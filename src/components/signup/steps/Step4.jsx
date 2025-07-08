import { useEffect, useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import InstallWidgetModal from "@/components/installer/InstallWidgetModal";
import { Button } from "@/components/ui/button";
const Step4 = ({
  form,
  handleSave,
  saving,
  previewURL,
  fetchPreviewAndEmbed,
}) => {
  const [userPlan, setUserPlan] = useState("");
  const [files, setFiles] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
  const fontOptions = ["Inter", "Roboto", "Poppins", "Open Sans", "sans-serif"];
  const [installOpen, setInstallOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Fetch user plan
    fetch("https://walrus.kalavishva.com/webhook/user_account", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        const plan = res[0]?.user_plan || "";
        setUserPlan(plan);
      });

    // Prefill form from localStorage
    const storedValues = {
      name: userDetails.companion_name || "",
      instructions: userDetails.companion_persona || "",
      primaryColor: userDetails.primary_colour || "#000000",
      secondaryColor: userDetails.secondary_colour || "#ffffff",
      fontFamily: userDetails.font_family || "sans-serif",
    };

    form.reset(storedValues);
    fetchPreviewAndEmbed(storedValues);
  }, []);

  return (
    <div className="flex flex-col w-full lg:flex-row gap-8 h-auto lg:h-full">
      {/* Left Side - Inputs */}
      <div className="lg:w-1/2 w-full flex flex-col gap-6">
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

        <FormField
          control={form.control}
          name="primaryColor"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="w-40">Primary Color</FormLabel>
              <FormControl>
                <input
                  type="color"
                  value={field.value}
                  onChange={field.onChange}
                  className="h-10 w-full border-none"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="secondaryColor"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="w-40">Secondary Color</FormLabel>
              <FormControl>
                <input
                  type="color"
                  value={field.value}
                  onChange={field.onChange}
                  className="h-10 w-full border-none"
                />
              </FormControl>
            </FormItem>
          )}
        />

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
                    <SelectValue placeholder="Choose a font" />
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

        <div>
          <FormLabel>Knowledge (upload files)</FormLabel>
          <div
            className={`border-2 border-dashed rounded-md mt-2 p-4 text-center 
              ${
                !userPlan
                  ? "border-gray-200 bg-gray-50"
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
                : "Upgrade to upload knowledge files"}
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

        <div className="flex flex-col justify-end h-full">
          {/* Save & Install */}
          <div>
            <div className="flex w-full gap-3">
              <Button
                type="button"
                className="px-4 py-2 w-1/2 bg-black text-white rounded-md"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Updating..." : "Update"}
              </Button>
              <Button
                type="button"
                className="px-4 py-2 w-1/2 mb-3 bg-black text-white rounded-md"
                onClick={() => setInstallOpen(true)}
              >
                Install
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Preview */}
      <div className="lg:w-1/2 flex flex-col gap-6 h-auto lg:h-full">
        <div className="flex-1 flex flex-col h-auto lg:h-full">
          <FormLabel>Live Preview</FormLabel>
          <div className="border rounded-md overflow-scroll flex-1 mt-2 min-h-[725px] lg:min-h-0">
            {previewURL ? (
              <iframe
                src={previewURL}
                className="w-full h-full min-h-[725px] lg:min-h-0"
                title="Preview"
                style={{ height: '100%' }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 min-h-[725px] lg:min-h-0">
                Preview loading...
              </div>
            )}
          </div>
        </div>
      </div>
      <InstallWidgetModal
        open={installOpen}
        onClose={() => setInstallOpen(false)}
        userDetails={userDetails}
      />
    </div>
  );
};

export default Step4;
