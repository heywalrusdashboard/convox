import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import jwtEncode from "jwt-encode";
import { useState } from "react";
import { toast } from "sonner";

const SignupForm = ({ step, setStep }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewURL, setPreviewURL] = useState("");

  const form = useForm({
    defaultValues: {
      companyName: "",
      websiteURL: "",
      industry: "",
      customIndustry: "",
      companionGoal: "Conversation Scout - Capture inquiries from the users",
      companionPersona:
        "You are Efficient & Empathetic in your response. Keep your answers precise, concise and compassionate in their tone",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      name: "",
      primaryColor: "#000000",
      secondaryColor: "#ffffff",
      fontFamily: "sans-serif",
      instructions: "",
    },
    mode: "onTouched",
  });

  const fetchPreviewAndEmbed = async (values) => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
    try {
      const payload = {
        user_id: userDetails.User_id,
        primaryColor: values.primaryColor,
        secondaryColor: values.secondaryColor,
        companionName: values.name,
        fontFamily: values.fontFamily,
      };

      const scriptRes = await fetch(
        "https://walrus.kalavishva.com/webhook/generate-widget",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const widgetScript = await scriptRes.text();

      const htmlWrapper = `
        <html>
          <head><meta charset="UTF-8"><title>Widget Preview</title></head>
          <body>
            <div id="widget-root"></div>
            ${widgetScript}
          </body>
        </html>
      `;
      const blob = new Blob([htmlWrapper], { type: "text/html" });
      const blobUrl = URL.createObjectURL(blob);
      setPreviewURL(blobUrl);
    } catch (err) {
      console.error("Preview/embed fetch error:", err);
    }
  };

  const onNext = async () => {
    const fieldsPerStep = {
      1: ["companyName", "websiteURL", "industry", "customIndustry"],
      2: ["companionGoal", "companionPersona"],
      3: ["email", "mobile", "password", "confirmPassword"],
    };

    if (step < 3) {
      const valid = await form.trigger(fieldsPerStep[step]);
      if (valid) setStep((prev) => prev + 1);
    } else if (step === 3) {
      const valid = await form.trigger(fieldsPerStep[3]);
      if (!valid) return;
      setLoading(true);

      try {
        const signupRes = await fetch(
          "https://walrus.kalavishva.com/webhook/walrus_convox_signup",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form.getValues()),
          }
        );

        if (!signupRes.ok) {
          const errorData = await signupRes.json();
          toast.error(`Signup failed: ${errorData.message || "Unknown error"}`);
          return;
        }

        const secret = import.meta.env.VITE_JWT_SECRET;
        const tokenData = { user_id: form.getValues().email };
        const loginToken = jwtEncode(tokenData, secret, { alg: "HS256" });

        const loginRes = await fetch(
          "https://walrus.kalavishva.com/webhook/loginv2",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${loginToken}`,
            },
            body: JSON.stringify({
              email: form.getValues().email,
              password: form.getValues().password,
            }),
          }
        );

        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.length > 0) {
          localStorage.setItem(
            "token",
            loginData[0].jwt_token.replace("Bearer ", "")
          );
          localStorage.setItem("userDetails", JSON.stringify(loginData[0]));
          setStep(4);
        } else {
          toast.error("Signup succeeded, but login failed.");
        }
      } catch (err) {
        console.error("Signup/Login error:", err);
        toast.error("An error occurred during signup.");
      } finally {
        setLoading(false);
      }
    }
  };

  const onBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
    const values = form.getValues();

    if (!token) {
      toast.error("You are not authenticated");
      return;
    }

    setSaving(true);

    const payload = {
      user_id: userDetails.User_id,
      companion_name: values.name,
      primary_colour: values.primaryColor,
      secondary_colour: values.secondaryColor,
      font_family: values.fontFamily,
      companion_persona: values.instructions,
    };

    const planRes = await fetch(
      "https://walrus.kalavishva.com/webhook/user_account",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const planData = await planRes.json();
    const isPremium = planData?.[0]?.user_plan;

    if (isPremium) {
      payload.companion_goal = values.companionGoal;
    }

    try {
      const res = await fetch(
        "https://walrus.kalavishva.com/webhook/update_companion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to save companion config");

      localStorage.setItem(
        "userDetails",
        JSON.stringify({ ...userDetails, ...payload })
      );

      await fetchPreviewAndEmbed(values);
      toast.success("Companion settings updated successfully!");
    } catch (err) {
      console.error("Save failed", err);
      toast.error("Failed to save companion settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className={`w-full ${
          step === 4 ? "lg:w-full flex-1 h-full overflow-scroll" : "lg:w-2/3"
        } p-6 sm:p-8 flex flex-col gap-6`}
      >
        {step === 1 && <Step1 form={form} />}
        {step === 2 && <Step2 form={form} />}
        {step === 3 && <Step3 form={form} />}
        {step === 4 && (
          <Step4
            form={form}
            handleSave={handleSave}
            saving={saving}
            previewURL={previewURL}
            fetchPreviewAndEmbed={fetchPreviewAndEmbed}
          />
        )}

        {step < 4 && (
          <div className="flex justify-between pt-4">
            {step > 1 && (
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-black"
                onClick={onBack}
              >
                Back
              </button>
            )}
            <button
              type="button"
              className={`px-6 py-2 rounded-md text-white ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }`}
              disabled={loading}
              onClick={onNext}
            >
              {loading ? "Signing up..." : "Next"}
            </button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default SignupForm;
