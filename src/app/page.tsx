
"use client"
import * as React from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Boxes, DollarSign, History, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartTooltip, ChartTooltipContent, ChartContainer } from "@/components/ui/chart"
import { th } from "@/lib/translations"
import { Product, weeklySales } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { getProducts } from "@/lib/pantry-actions"

const chartConfig = {
  sales: {
    label: th.sales,
    color: "hsl(var(--primary))",
  },
}

export default function Dashboard() {
    const [lowStockProducts, setLowStockProducts] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const data = await getProducts();
            if (data) {
                setLowStockProducts(data.filter(p => p.stock < 10));
            }
            setLoading(false);
        };

        fetchProducts();
    }, []);


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">{th.dashboard}</h1>
        <div className="md:hidden">
            <SidebarTrigger />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{th.todaysSales}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿0</div>
            <p className="text-xs text-muted-foreground">{/* +20.1% {th.fromLastMonth} */}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{th.totalSales}</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
             <p className="text-xs text-muted-foreground">{/* +180.1% {th.fromLastMonth} */}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{th.newCustomers}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
             <p className="text-xs text-muted-foreground">{/* +15% {th.fromLastMonth} */}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{th.lowStockItems}</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-12"/> : <div className="text-2xl font-bold">{lowStockProducts.length}</div>}
            <p className="text-xs text-muted-foreground">{th.itemsNeedRestocking}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{th.salesOverview}</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklySales} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `฿${value/1000}k`} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="sales" fill="var(--color-sales)" radius={8} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{th.lowStockItems}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{th.product}</TableHead>
                  <TableHead className="text-right">{th.stock}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    Array.from({length: 3}).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-3/4"/></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-4 w-8 inline-block"/></TableCell>
                        </TableRow>
                    ))
                ) : lowStockProducts.length > 0 ? (
                  lowStockProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={product.stock === 0 ? "destructive" : "secondary"}>{product.stock}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={2} className="text-center text-muted-foreground">ไม่มีสินค้าใกล้หมด</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
