import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const users = [
  { id: "1", name: "Sarah Ahmed", role: "client", status: "active" },
  { id: "2", name: "Dr. Aisha Rahman", role: "therapist", status: "active" },
  { id: "3", name: "Bold Gym LLC", role: "partner", status: "pending" },
];

export default function AdminUsersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 border-b pb-2 text-xs font-medium text-muted-foreground">
          <span>Name</span>
          <span>Role</span>
          <span>Status</span>
        </div>
        <div className="divide-y">
          {users.map((user) => (
            <div key={user.id} className="grid grid-cols-3 gap-2 py-2 text-sm">
              <span>{user.name}</span>
              <span className="capitalize">{user.role}</span>
              <span className="capitalize">{user.status}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
