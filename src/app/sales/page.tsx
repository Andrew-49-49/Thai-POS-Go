
"use client";

import * as React from "react";
import { format } from "date-fns";
import { th as thLocale } from "date-fns/locale";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { th } from "@/lib/translations";
import { Sale } from "@/lib/mock-data";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getSales } from "@/lib/pantry-actions";
import { Skeleton } from "@/components/ui/skeleton";

export default function SalesHistoryPage() {
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [sales, setSales] = React.useState<Sale[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSales = async () => {
        setLoading(true);
        const data = await getSales();
        setSales(data.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setLoading(false);
    };
    fetchSales();
  }, [])

  const filteredSales = sales.filter((sale) => {
    if (!date?.from) return true;
    const saleDate = new Date(sale.date);
    if (date.to) {
      // Add one day to the 'to' date to make the range inclusive
      const toDate = new Date(date.to);
      toDate.setDate(toDate.getDate() + 1);
      return saleDate >= date.from && saleDate < toDate;
    }
    // If only 'from' is selected, filter from the start of that day
    const fromDate = new Date(date.from);
    fromDate.setHours(0,0,0,0);
    return saleDate >= fromDate;
  });

  const exportToCSV = () => {
    const headers = ["Sale ID", "Date", "Product Name", "Quantity", "Price", "Total"];
    const rows = filteredSales.flatMap(sale => 
        sale.items.map(item => [
            sale.id,
            format(new Date(sale.date), "yyyy-MM-dd HH:mm:ss"),
            `"${item.name}"`, // Wrap in quotes to handle commas in names
            item.quantity,
            item.price,
            sale.total
        ].join(','))
    );

    const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sales_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">{th.salesHistory}</h1>
        <div className="flex items-center gap-2">
            <Popover>
            <PopoverTrigger asChild>
                <Button
                id="date"
                variant={"outline"}
                className={cn(
                    "w-[260px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                )}
                >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                    date.to ? (
                    <>
                        {format(date.from, "LLL dd, y", { locale: thLocale })} -{" "}
                        {format(date.to, "LLL dd, y", { locale: thLocale })}
                    </>
                    ) : (
                    format(date.from, "LLL dd, y", { locale: thLocale })
                    )
                ) : (
                    <span>{th.filterByDate}</span>
                )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                locale={thLocale}
                />
            </PopoverContent>
            </Popover>
             <Button onClick={exportToCSV} variant="outline" size="icon" disabled={filteredSales.length === 0}>
                <Download className="h-4 w-4" />
                <span className="sr-only">Export CSV</span>
            </Button>
            <div className="md:hidden">
                <SidebarTrigger />
            </div>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{th.saleId}</TableHead>
                <TableHead>{th.date}</TableHead>
                <TableHead>{th.items}</TableHead>
                <TableHead className="text-right">{th.total}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-36" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-6 w-20 inline-block" /></TableCell>
                    </TableRow>
                ))
              ) : filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">
                    <Badge variant="secondary">{sale.id}</Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(sale.date), "PPP p", {
                      locale: thLocale,
                    })}
                  </TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside">
                        {sale.items.map((item, index) => (
                        <li key={index}>
                            {item.name} x {item.quantity}
                        </li>
                        ))}
                    </ul>
                  </TableCell>
                  <TableCell className="text-right">
                    ฿{sale.total.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                    ไม่มีข้อมูลการขายในช่วงวันที่เลือก
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
