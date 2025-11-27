import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Platform settings</CardTitle>
          <CardDescription>
            High-level toggles for features across Bold & Beyond.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Beyond+ membership</p>
              <p className="text-xs text-muted-foreground">
                Controls access to membership perks and pricing.
              </p>
            </div>
            <Switch disabled checked={false} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Allow guest browsing</p>
              <p className="text-xs text-muted-foreground">
                If off, users must log in to view services and experts.
              </p>
            </div>
            <Switch disabled checked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
