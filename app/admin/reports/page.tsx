import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

const metrics = [
  { label: "Monthly revenue", value: "287,450 AED", change: "+18.2%" },
  { label: "Completed sessions", value: "1,284", change: "+12.5%" },
  { label: "New users", value: "642", change: "+9.1%" },
];

export default function AdminReportsPage() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {metric.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-xl font-semibold">{metric.value}</p>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              <span>{metric.change} vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
