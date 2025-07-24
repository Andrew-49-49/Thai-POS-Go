
"use client";

import * as React from "react";
import { Lightbulb, Loader2, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { th } from "@/lib/translations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Product } from "@/lib/mock-data";

export default function InsightsPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [insights, setInsights] = React.useState<{topSellers: Product[], trends: string} | null>(null);

  const handleGenerateInsights = () => {
    setIsLoading(true);
    setInsights(null);
    // Simulate AI call
    setTimeout(() => {
      // This would be replaced by a real AI call that analyzes sales data
      setInsights({
        topSellers: [],
        trends:
          "ไม่มีข้อมูลการขายเพียงพอที่จะสร้างแนวโน้ม",
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">{th.salesInsights}</h1>
        <div className="md:hidden">
            <SidebarTrigger />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{th.generateInsights}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGenerateInsights} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {th.generating}
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {th.generateInsights}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      {insights && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {th.topSellingItems}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {insights.topSellers.length > 0 ? (
                <ul className="list-disc space-y-2 pl-5">
                  {insights.topSellers.map((item: any) => (
                    <li key={item.id}>{item.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">ไม่มีข้อมูล</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                {th.salesTrends}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{insights.trends}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
