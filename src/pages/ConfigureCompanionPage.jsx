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
  const [files, setFiles] = useState([]);
  const [previewURL, setPreviewURL] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};

  const form = useForm({
    defaultValues: {
      name: userDetails.companion_name || "",
      instructions: userDetails.companion_persona || "",
      primaryColor: userDetails.primary_colour || "#000000",
      secondaryColor: userDetails.secondary_colour || "#ffffff",
      fontFamily: userDetails.font_family || "sans-serif",
    },
    mode: "onTouched",
  });

  const fontOptions = ["Inter", "Roboto", "Poppins", "Open Sans", "sans-serif"];
  useEffect(() => {
  const storedValues = {
    name: userDetails.companion_name || "",
    instructions: userDetails.companion_persona, // optionally load saved instructions if available
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


      // 🔹 Fetch raw HTML for preview
      const widgetRes = await fetch(
        "https://walrus.kalavishva.com/webhook/widget-script",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const htmlText = await widgetRes.text();
      const blob = new Blob([htmlText], { type: "text/html" });
      const blobUrl = URL.createObjectURL(blob);
      setPreviewURL(blobUrl);

      // 🔹 Fetch <script> for embed
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

      const rawScript = await scriptRes.text(); // 📌 Get raw script text
      setEmbedCode(rawScript);
    } catch (err) {
      console.error("Failed to load preview/code:", err);
    }
  };

  const onSubmit = async (values) => {
  const updatedData = {
    ...userDetails,
    companion_name: values.name,
    primary_colour: values.primaryColor,
    secondary_colour: values.secondaryColor,
    font_family: values.fontFamily,
  };
  localStorage.setItem("userDetails", JSON.stringify(updatedData));
  toast("Companion settings saved!"); // ✅ fixed
  await fetchPreviewAndEmbed(values);
};


  const copyToClipboard = () => {
  navigator.clipboard.writeText(embedCode);
  toast("Code copied to clipboard!"); // ✅ fixed
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

            {/* Instructions */}
            <FormField
              control={form.control}
              name="instructions"
              rules={{ required: "Instructions are required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
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
                className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-black"
                onClick={() => document.getElementById("file-input").click()}
              >
                <input
                  id="file-input"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) =>
                    setFiles((prev) => [...prev, ...Array.from(e.target.files)])
                  }
                />
                <p className="text-gray-500">
                  Click or drag files here to upload
                </p>
                {files.length > 0 && (
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

            <Button type="submit" className="mt-4 w-full bg-black text-white">
              Save
            </Button>
          </form>
        </Form>

        {/* Right: Preview + Embed */}
        <div className="w-full lg:w-1/2 space-y-6">
          {/* Live Preview */}
          <div className="border rounded-md overflow-hidden h-96">
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

          {/* Embed Code */}
          {embedCode && (
            <div className="bg-gray-50 border rounded-md p-4 relative">
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                {embedCode}
              </pre>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="absolute top-2 right-2"
              >
                Copy Code
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
