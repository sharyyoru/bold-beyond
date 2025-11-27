"use client";

import { useState } from "react";
import { LogOut, User, Mail, Phone, ShieldCheck, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockUser = {
  name: "Sarah Ahmed",
  email: "sarah@example.com",
  phone: "+971 50 123 4567",
  tier: "Free",
};

export default function ProfilePage() {
  const [name, setName] = useState(mockUser.name);
  const [phone, setPhone] = useState(mockUser.phone);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your details, preferences, and security.
        </p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              {mockUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">{mockUser.name}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              {mockUser.tier} member
            </p>
          </div>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <form onSubmit={handleSave} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal details</CardTitle>
            <CardDescription>These details are used for bookings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <label htmlFor="name" className="font-medium flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                Full name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2 text-sm">
              <label htmlFor="email" className="font-medium flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                Email
              </label>
              <Input id="email" value={mockUser.email} disabled />
            </div>
            <div className="space-y-2 text-sm">
              <label htmlFor="phone" className="font-medium flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                Phone
              </label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-3">
          <Button type="button" variant="outline" className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
          <Button type="submit" variant="gold">
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
