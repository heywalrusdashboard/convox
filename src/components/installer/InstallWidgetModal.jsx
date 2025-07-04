import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

export default function InstallWidgetModal({ open, onClose, userDetails }) {
  const [variant, setVariant] = useState("javascript");
  const [embedCode, setEmbedCode] = useState("");

  useEffect(() => {
    if (open) {
      fetchScript();
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
          <DialogTitle>Install Widget</DialogTitle>
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
            <div className="space-y-4 w-1/3 text-sm text-muted-foreground">
              <p>
                1. Copy the code and paste it inside the <code>{`<head>`}</code> or
                before closing <code>{`</body>`}</code>.
              </p>
              <p>
                2. If using React, wrap it in a <code>useEffect</code> and inject it manually.
              </p>
              <p>3. Customize it anytime from the dashboard.</p>
            </div>

            {/* Code */}
            <div className="relative bg-muted rounded-md p-4 overflow-auto">
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={handleCopy}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
              <pre className="text-xs whitespace-pre-wrap break-words">
                <code>{embedCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
