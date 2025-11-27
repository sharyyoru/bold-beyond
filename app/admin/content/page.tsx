import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminContentPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sanity Studio</CardTitle>
          <CardDescription>
            Manage services, experts, partners, and blog posts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <Link href="/studio">Open Studio</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
