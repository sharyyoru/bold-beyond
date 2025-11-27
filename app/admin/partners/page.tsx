import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const partners = [
  { id: "1", name: "Fitness First", type: "Gym", status: "active" },
  { id: "2", name: "Calm Cafe", type: "Restaurant", status: "active" },
  { id: "3", name: "Urban Yoga Studio", type: "Yoga", status: "draft" },
];

export default function AdminPartnersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Partners</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 border-b pb-2 text-xs font-medium text-muted-foreground">
          <span>Name</span>
          <span>Type</span>
          <span>Status</span>
        </div>
        <div className="divide-y">
          {partners.map((partner) => (
            <div key={partner.id} className="grid grid-cols-3 gap-2 py-2 text-sm">
              <span>{partner.name}</span>
              <span>{partner.type}</span>
              <span className="capitalize">{partner.status}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
