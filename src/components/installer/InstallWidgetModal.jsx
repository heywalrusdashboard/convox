import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export default function InstallWidgetModal({ open, onClose, userDetails }) {
  const [variant, setVariant] = useState("javascript");
  const [embedCode, setEmbedCode] = useState("");
  const [widgetInstalled, setWidgetInstalled] = useState(false);

  useEffect(() => {
    if (open && variant === "javascript") {
      fetchScript();
    } else if (variant === "react") {
      setEmbedCode("");
    }
  }, [open, variant]);

  const fetchScript = async () => {
    try {
      const payload = {
        user_id: userDetails.User_id,
        primaryColor: userDetails.primary_colour,
        secondaryColor: userDetails.secondary_colour,
        companionName: userDetails.companion_name,
        fontFamily: userDetails.font_family,
        type: variant,
      };

      const res = await fetch("https://walrus.kalavishva.com/webhook/generate-widget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const scriptText = await res.text();
      setEmbedCode(scriptText);
    } catch (err) {
      toast.error("Failed to fetch embed code");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    toast.success("Code copied to clipboard!");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Install</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4">
          <ToggleGroup
            type="single"
            value={variant}
            onValueChange={(val) => val && setVariant(val)}
            className="self-start"
          >
            <ToggleGroupItem value="javascript">JavaScript</ToggleGroupItem>
            <ToggleGroupItem value="react">React</ToggleGroupItem>
          </ToggleGroup>

          <div className="flex">
            {/* Instructions */}
            <div className="space-y-4 w-1/3 text-sm text-muted-foreground flex flex-col justify-center">
              {variant === "javascript" ? (
                <>
                  <p>
                    1. Copy the code and paste it inside the <code>{`<head>`}</code> or
                    before closing <code>{`</body>`}</code>.
                  </p>
                  <p>
                    2. If using React, wrap it in a <code>useEffect</code> and inject it manually.
                  </p>
                  <p>3. Customize it anytime from the dashboard.</p>
                </>
              ) : (
                <p className="text-center">React installation instructions coming soon!</p>
              )}
            </div>

            {/* Code */}
            <div className="relative bg-muted rounded-md p-4 overflow-auto min-h-[100px] flex items-center justify-center">
              {variant === "javascript" ? (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={handleCopy}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                  <pre className="text-xs whitespace-pre-wrap break-words w-full">
                    <code>{embedCode}</code>
                  </pre>
                </>
              ) : (
                <span className="text-gray-500 w-full text-center">React embed coming soon!</span>
              )}
            </div>
          </div>

          {/* Toggle and Continue button */}
          <div className="flex flex-col gap-4 mt-6">
            <label className="flex items-center gap-3">
              <Switch checked={widgetInstalled} onCheckedChange={setWidgetInstalled} />
              <span className="text-sm">I’ve confirmed that the companion has been installed on our Website. 
</span>
            </label>
            <Button
              type="button"
              className="px-4 py-2 bg-gray-200 text-black w-full rounded-md hover:bg-gray-300"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
