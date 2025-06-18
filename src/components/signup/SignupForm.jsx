import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import jwtEncode from "jwt-encode";

const SignupForm = ({ step, setStep }) => {
  const form = useForm({
    defaultValues: {
      companyName: "",
      websiteURL: "",
      industry: "",
      customIndustry: "",
      companionGoal: "",
      companionPersona: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const onNext = async () => {
    if (step < 3) {
      const fieldsPerStep = {
        1: ["companyName", "websiteURL", "industry", "customIndustry"],
        2: ["companionGoal", "companionPersona"],
      };
      const valid = await form.trigger(fieldsPerStep[step]);
      if (valid) setStep((prev) => prev + 1);
    }
  };
  const secret = import.meta.env.VITE_JWT_SECRET;
  const onBack = () => setStep((prev) => Math.max(prev - 1, 1));
  const onSubmit = async (data) => {
    try {
      const token = jwtEncode(data, secret, { alg: "HS256" });
      const response = await fetch(
        "https://walrus.kalavishva.com/webhook/walrus_convox_signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        window.location.href =
          "https://dashboard.heywalrus.in/app/convox-v1-0/login-682603059ec32534dc791ebd";
      } else {
        const errorData = await response.json();
        alert(`Signup failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("An error occurred during signup.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full lg:w-2/3 p-6 sm:p-8 flex flex-col gap-6"
      >
        {step === 1 && <Step1 form={form} />}
        {step === 2 && <Step2 form={form} />}
        {step === 3 && <Step3 form={form} />}

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
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            onClick={
              step !== 3
                ? onNext
                : async () => {
                    const valid = await form.trigger([
                      "email",
                      "mobile",
                      "password",
                      "confirmPassword",
                    ]);
                    if (valid) {
                      form.handleSubmit(onSubmit)();
                    }
                  }
            }
          >
            {step === 3 ? "Finish" : "Next"}
          </button>
        </div>
      </form>
    </Form>
  );
};

export default SignupForm;
