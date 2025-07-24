"use client";

import * as React from "react";
import { Lightbulb, Loader2, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { th } from "@/lib/translations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { products } from "@/lib/mock-data";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function InsightsPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [insights, setInsights] = React.useState<any | null>(null);

  const handleGenerateInsights = () => {
    setIsLoading(true);
    setInsights(null);
    // Simulate AI call
    setTimeout(() => {
      setInsights({
        topSellers: [products[0], products[2], products[4]],
        trends:
          "ยอดขายมีแนวโน้มเพิ่มขึ้นในช่วงสุดสัปดาห์ โดยเฉพาะสินค้าประเภทเสื้อผ้า หมวดหมู่เครื่องประดับขายได้ดีอย่างต่อเนื่องตลอดทั้งเดือน",
      });
      setIsLoading(false);
    }, 2000);
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
              <ul className="list-disc space-y-2 pl-5">
                {insights.topSellers.map((item: any) => (
                  <li key={item.id}>{item.name}</li>
                ))}
              </ul>
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
