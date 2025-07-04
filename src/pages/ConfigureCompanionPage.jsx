import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import Navbar from "@/components/layouts/Navbar";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function ConfigureCompanionPage() {
  const [userPlan, setUserPlan] = useState("");
  const [files, setFiles] = useState([]);
  const [previewURL, setPreviewURL] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
  const [saving, setSaving] = useState(false);

  const form = useForm({
    defaultValues: {
      name: userDetails.companion_name || "",
      instructions: userDetails.companion_persona || "",
      companionGoal:
        userDetails.companion_goal ||
        "Conversation Scout - Capture inquiries from the users",
      primaryColor: userDetails.primary_colour || "#000000",
      secondaryColor: userDetails.secondary_colour || "#ffffff",
      fontFamily: userDetails.font_family || "sans-serif",
    },
    mode: "onTouched",
  });

  const fontOptions = ["Inter", "Roboto", "Poppins", "Open Sans", "sans-serif"];
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://walrus.kalavishva.com/webhook/user_account", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const plan = res[0]?.user_plan || "";
        setUserPlan(plan);
      })
      .catch((err) => console.error("Failed to fetch plan info", err));
    const storedValues = {
      name: userDetails.companion_name || "",
      instructions: userDetails.companion_persona,
      primaryColor: userDetails.primary_colour || "#000000",
      secondaryColor: userDetails.secondary_colour || "#ffffff",
      fontFamily: userDetails.font_family || "sans-serif",
    };
    fetchPreviewAndEmbed(storedValues);
  }, []);
  const fetchPreviewAndEmbed = async (values) => {
    try {
      const payload = {
        user_id: userDetails.User_id,
        primaryColor: values.primaryColor,
        secondaryColor: values.secondaryColor,
        companionName: values.name,
        fontFamily: values.fontFamily,
      };

      // Fetch only <script> from generate-widget
      const scriptRes = await fetch(
        "https://walrus.kalavishva.com/webhook/generate-widget",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const rawScript = await scriptRes.text();

      // Inject into preview iframe
      const htmlWrapper = `
      <html>
        <head><meta charset="UTF-8"><title>Widget Preview</title></head>
        <body>
          <div id="widget-root"></div>
          ${rawScript}
        </body>
      </html>
    `;

      const blob = new Blob([htmlWrapper], { type: "text/html" });
      const blobUrl = URL.createObjectURL(blob);
      setPreviewURL(blobUrl);
      setEmbedCode(rawScript); // Also update embed code
    } catch (err) {
      console.error("Failed to load preview/code:", err);
    }
  };

  const onSubmit = async (values) => {
    const token = localStorage.getItem("token");
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

    if (userPlan) {
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

      if (!res.ok) {
        throw new Error("Failed to update companion config");
      }
      const updatedData = {
        ...userDetails,
        ...payload,
      };
      localStorage.setItem("userDetails", JSON.stringify(updatedData));

      // 🔸 Regenerate preview and code
      await fetchPreviewAndEmbed(values);
      toast.success("Companion settings updated successfully!");
    } catch (error) {
      console.error("Error saving companion config:", error);
      toast.error("Failed to save companion settings.");
    } finally {
      setSaving(false); // 🔹 END loading
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    toast("Code copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Configure Companion" />

      <div className="flex flex-col lg:flex-row p-6 gap-6 flex-1">
        {/* Left: Config Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full lg:w-1/2 space-y-6"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Companion Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Goal (fixed for free, editable for premium) */}
            <FormField
              control={form.control}
              name="companionGoal"
              rules={userPlan ? { required: "Goal is required" } : {}}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Companion Goal</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      {...field}
                      readOnly={!userPlan}
                      className={
                        !userPlan ? "bg-gray-100 cursor-not-allowed" : ""
                      }
                    />
                  </FormControl>
                  {!userPlan && (
                    <p className="text-xs text-gray-500">
                      Upgrade your plan to customize the companion's goal.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Instructions */}
            <FormField
              control={form.control}
              name="instructions"
              rules={{ required: "Persona is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Persona</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="How should the companion behave?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Knowledge File Upload */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Knowledge (upload files)
              </label>
              <div
                className={`border-2 border-dashed rounded-md p-4 text-center 
    ${
      !userPlan
        ? "border-gray-200 bg-gray-50 cursor-not-allowed"
        : "hover:border-black border-gray-300"
    }`}
                onClick={() =>
                  userPlan && document.getElementById("file-input").click()
                }
              >
                <input
                  id="file-input"
                  type="file"
                  multiple
                  className="hidden"
                  disabled={!userPlan}
                  onChange={(e) =>
                    setFiles((prev) => [...prev, ...Array.from(e.target.files)])
                  }
                />
                <p className="text-gray-500">
                  {userPlan
                    ? "Click or drag files here to upload"
                    : "Upgrade your plan to upload knowledge files"}
                </p>
                {userPlan && files.length > 0 && (
                  <ul className="mt-2 text-sm">
                    {files.map((f, i) => (
                      <li key={i}>{f.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Colors</h3>
              <div className="flex flex-wrap gap-4">
                {["primaryColor", "secondaryColor"].map((name) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="w-40 capitalize">
                          {name.replace("Color", " Color")}
                        </FormLabel>
                        <FormControl>
                          <input
                            type="color"
                            value={field.value}
                            onChange={field.onChange}
                            className="h-10 w-10 border-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Font */}
            <FormField
              control={form.control}
              name="fontFamily"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Font Family</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((f) => (
                          <SelectItem key={f} value={f}>
                            {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="mt-4 w-full bg-black text-white"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>

        {/* Right: Preview + Embed */}
        <div className="w-full lg:w-1/2 flex flex-col flex-1 space-y-6 h-100% ">
          {/* Preview Header */}
          <div className="h-[100vh] md:h-full">
            <h2 className="text-lg font-semibold mb-2">Live Preview</h2>
            <div className="border rounded-md overflow-scroll h-full">
              {previewURL ? (
                <iframe
                  src={previewURL}
                  className="w-full h-full"
                  title="Widget Preview"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Preview will appear here
                </div>
              )}
            </div>
          </div>

          {/* Embed Script Section */}
        </div>
      </div>
    </div>
  );
}
