"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, GripVertical, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function OnboardingQuestionsPage() {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Onboarding Questions</h1>
          <p className="text-muted-foreground">
            Manage questions shown during user onboarding
          </p>
        </div>
        <Button variant="gold" asChild>
          <Link href="/studio/structure/onboardingQuestion" target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in Sanity Studio
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Onboarding questions are managed through Sanity Studio. This allows for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Multilingual support (English & Arabic)</li>
            <li>Multiple question types (single choice, multiple choice, text, scale)</li>
            <li>Answer mapping to collections for personalization</li>
            <li>Drag-and-drop ordering</li>
            <li>Category grouping (Goals, Preferences, History, Lifestyle)</li>
          </ul>
          <div className="flex gap-4 pt-4">
            <Button variant="outline" asChild>
              <Link href="/studio" target="_blank">
                Open Sanity Studio
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/test-questions">
                Manage Test Questions
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Question Types Available</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Single Choice</h4>
              <p className="text-sm text-muted-foreground">
                User selects one answer from a list of options
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Multiple Choice</h4>
              <p className="text-sm text-muted-foreground">
                User can select multiple answers from options
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Text Input</h4>
              <p className="text-sm text-muted-foreground">
                User provides a free-text response
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Scale (1-10)</h4>
              <p className="text-sm text-muted-foreground">
                User rates on a numeric scale
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
