"use client";

import Link from "next/link";
import { ExternalLink, FileQuestion, Brain, Heart, Moon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testCategories = [
  {
    name: "Anxiety Assessment",
    icon: Brain,
    description: "GAD-7 style questions to assess anxiety levels",
    questionCount: 7,
  },
  {
    name: "Depression Screening",
    icon: Heart,
    description: "PHQ-9 style questions for depression screening",
    questionCount: 9,
  },
  {
    name: "Sleep Quality",
    icon: Moon,
    description: "Questions to evaluate sleep patterns and quality",
    questionCount: 5,
  },
  {
    name: "Relationship Health",
    icon: Users,
    description: "Assessment of relationship dynamics and communication",
    questionCount: 8,
  },
];

export default function TestQuestionsPage() {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Test Questions</h1>
          <p className="text-muted-foreground">
            Manage psychological assessments and screening tests
          </p>
        </div>
        <Button variant="gold" asChild>
          <Link href="/studio/structure/testQuestion" target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in Sanity Studio
          </Link>
        </Button>
      </div>

      {/* Test Categories */}
      <div className="grid gap-6 md:grid-cols-2">
        {testCategories.map((category) => (
          <Card key={category.name}>
            <CardContent className="flex items-start gap-4 p-6">
              <div className="h-12 w-12 rounded-full bg-brand-gold/10 flex items-center justify-center">
                <category.icon className="h-6 w-6 text-brand-gold" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {category.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {category.questionCount} questions
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Managing Test Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Test questions are used for mental health assessments and screenings.
            They should be created and reviewed by qualified professionals.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Important Notes</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
              <li>All clinical assessments should be validated instruments</li>
              <li>Scoring logic should follow standard protocols</li>
              <li>Risk flags should trigger appropriate follow-up actions</li>
              <li>Results should be reviewed by qualified professionals</li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" asChild>
              <Link href="/studio" target="_blank">
                Open Sanity Studio
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Question Types Reference */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Scoring Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Likert Scale</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Standard 5-point scale: Not at all (0) → Extremely (4)
              </p>
              <div className="flex gap-2">
                {["Not at all", "Slightly", "Moderately", "Very", "Extremely"].map(
                  (label, i) => (
                    <span
                      key={label}
                      className="text-xs bg-muted px-2 py-1 rounded"
                    >
                      {i}: {label}
                    </span>
                  )
                )}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Frequency Scale</h4>
              <p className="text-sm text-muted-foreground mb-2">
                For behavior frequency: Never (0) → Nearly every day (3)
              </p>
              <div className="flex gap-2">
                {[
                  "Not at all",
                  "Several days",
                  "More than half",
                  "Nearly every day",
                ].map((label, i) => (
                  <span
                    key={label}
                    className="text-xs bg-muted px-2 py-1 rounded"
                  >
                    {i}: {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
