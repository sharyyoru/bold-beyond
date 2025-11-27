"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Percent, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface Discount {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  usageLimit: number | null;
  usedCount: number;
  validFrom: string;
  validUntil: string | null;
  isActive: boolean;
}

// Mock data - replace with Supabase
const mockDiscounts: Discount[] = [
  {
    id: "1",
    code: "WELLNESS20",
    description: "20% off first session",
    discountType: "percentage",
    discountValue: 20,
    usageLimit: 100,
    usedCount: 45,
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    isActive: true,
  },
  {
    id: "2",
    code: "SAVE50",
    description: "50 AED off any booking",
    discountType: "fixed",
    discountValue: 50,
    usageLimit: null,
    usedCount: 120,
    validFrom: "2024-01-01",
    validUntil: null,
    isActive: true,
  },
  {
    id: "3",
    code: "EXPIRED10",
    description: "Old promotion",
    discountType: "percentage",
    discountValue: 10,
    usageLimit: 50,
    usedCount: 50,
    validFrom: "2023-01-01",
    validUntil: "2023-12-31",
    isActive: false,
  },
];

export default function DiscountsPage() {
  const { toast } = useToast();
  const [discounts, setDiscounts] = useState<Discount[]>(mockDiscounts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 0,
    usageLimit: "",
    validFrom: new Date().toISOString().split("T")[0],
    validUntil: "",
  });

  const filteredDiscounts = discounts.filter(
    (d) =>
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    if (editingDiscount) {
      setDiscounts((prev) =>
        prev.map((d) =>
          d.id === editingDiscount.id
            ? {
                ...d,
                ...formData,
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
                validUntil: formData.validUntil || null,
              }
            : d
        )
      );
      toast({ title: "Discount updated successfully" });
    } else {
      const newDiscount: Discount = {
        id: Date.now().toString(),
        ...formData,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        validUntil: formData.validUntil || null,
        usedCount: 0,
        isActive: true,
      };
      setDiscounts((prev) => [newDiscount, ...prev]);
      toast({ title: "Discount created successfully" });
    }
    resetForm();
  };

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount);
    setFormData({
      code: discount.code,
      description: discount.description,
      discountType: discount.discountType,
      discountValue: discount.discountValue,
      usageLimit: discount.usageLimit?.toString() || "",
      validFrom: discount.validFrom,
      validUntil: discount.validUntil || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
    toast({ title: "Discount deleted" });
  };

  const toggleActive = (id: string) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d))
    );
  };

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 0,
      usageLimit: "",
      validFrom: new Date().toISOString().split("T")[0],
      validUntil: "",
    });
    setEditingDiscount(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Discounts & Promo Codes</h1>
          <p className="text-muted-foreground">
            Manage promotional codes and discounts
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gold" onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Discount
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDiscount ? "Edit Discount" : "Create Discount"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Promo Code</label>
                <Input
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g., WELLNESS20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="e.g., 20% off first session"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value as "percentage" | "fixed",
                      })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (AED)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Value</label>
                  <Input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountValue: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Usage Limit (optional)</label>
                <Input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, usageLimit: e.target.value })
                  }
                  placeholder="Leave empty for unlimited"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Valid From</label>
                  <Input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) =>
                      setFormData({ ...formData, validFrom: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Valid Until (optional)</label>
                  <Input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) =>
                      setFormData({ ...formData, validUntil: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button variant="gold" onClick={handleSave}>
                  {editingDiscount ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search discounts..."
          className="pl-10"
        />
      </div>

      {/* Discounts List */}
      <div className="grid gap-4">
        {filteredDiscounts.map((discount) => (
          <Card key={discount.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    discount.discountType === "percentage"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {discount.discountType === "percentage" ? (
                    <Percent className="h-5 w-5" />
                  ) : (
                    <DollarSign className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold font-mono">{discount.code}</p>
                    <Badge variant={discount.isActive ? "default" : "secondary"}>
                      {discount.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {discount.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Used: {discount.usedCount}
                    {discount.usageLimit && ` / ${discount.usageLimit}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-brand-gold">
                    {discount.discountType === "percentage"
                      ? `${discount.discountValue}%`
                      : `${discount.discountValue} AED`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {discount.validUntil
                      ? `Expires: ${discount.validUntil}`
                      : "No expiry"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(discount)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(discount.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredDiscounts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No discounts found
          </div>
        )}
      </div>
    </div>
  );
}
