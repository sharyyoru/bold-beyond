import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const payouts = [
  {
    id: "1",
    period: "This week",
    amount: 2850,
    sessions: 6,
    trend: "up" as const,
  },
  {
    id: "2",
    period: "Last week",
    amount: 2100,
    sessions: 5,
    trend: "down" as const,
  },
];

export default function PortalOrdersPage() {
  return (
    <div className="container py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Earnings</h1>
        <p className="text-sm text-muted-foreground">
          Overview of completed sessions and payouts.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {payouts.map((p) => (
          <Card key={p.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{p.period}</CardTitle>
              <CardDescription>{p.sessions} sessions</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">{p.amount} AED</p>
              <div className="flex items-center text-sm text-muted-foreground">
                {p.trend === "up" ? (
                  <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                )}
                <span>{p.trend === "up" ? "Higher" : "Lower"} than previous</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
