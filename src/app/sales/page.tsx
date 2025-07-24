"use client";

import * as React from "react";
import { format } from "date-fns";
import { th as thLocale } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
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
import { salesData } from "@/lib/mock-data";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function SalesHistoryPage() {
  const [date, setDate] = React.useState<DateRange | undefined>();

  const filteredSales = salesData.filter((sale) => {
    if (!date?.from) return true;
    const saleDate = new Date(sale.date);
    if (date.to) {
      return saleDate >= date.from && saleDate <= date.to;
    }
    return saleDate >= date.from;
  });

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
              {filteredSales.map((sale) => (
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
                    {sale.items.map((item) => (
                      <div key={item.productId}>
                        {item.name} x {item.quantity}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell className="text-right">
                    ฿{sale.total.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
