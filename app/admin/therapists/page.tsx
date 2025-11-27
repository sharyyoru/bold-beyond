import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck } from "lucide-react";

const therapists = [
  { id: "1", name: "Dr. Aisha Rahman", approved: true, services: 4 },
  { id: "2", name: "Dr. James Wilson", approved: true, services: 3 },
  { id: "3", name: "Coach Michael Chen", approved: false, services: 2 },
];

export default function AdminTherapistsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Therapists</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {therapists.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between rounded-lg border px-3 py-2"
          >
            <div>
              <p className="font-medium flex items-center gap-1">
                {t.name}
                {t.approved && (
                  <BadgeCheck className="h-4 w-4 text-brand-gold" />
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.services} services configured
              </p>
            </div>
            <span className="text-xs font-medium">
              {t.approved ? "Approved" : "Pending"}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
