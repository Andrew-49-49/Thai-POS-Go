"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { th } from "@/lib/translations"
import { Product } from "@/lib/mock-data"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

interface ProductDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  product?: Product;
  onSave: (product: Omit<Product, 'id'> & { id?: string }) => void;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "ต้องใส่ชื่อสินค้า" }),
  sku: z.string().min(1, { message: "ต้องใส่ SKU" }),
  price: z.coerce.number().min(0, { message: "ราคาต้องไม่ติดลบ" }),
  stock: z.coerce.number().int().min(0, { message: "สต็อกต้องไม่ติดลบ" }),
  category: z.string().optional(),
  imageUrl: z.string().optional(),
});


export function ProductDialog({ isOpen, setIsOpen, product, onSave }: ProductDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sku: "",
      price: 0,
      stock: 0,
      category: "",
      imageUrl: "",
    },
  });

  React.useEffect(() => {
    if (product) {
      form.reset(product);
    } else {
      form.reset({
        name: "",
        sku: "",
        price: 0,
        stock: 0,
        category: "",
        imageUrl: "",
      });
    }
  }, [product, form, isOpen]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({
      ...values,
      id: product?.id,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {product ? th.editProduct : th.addProduct}
          </DialogTitle>
          <DialogDescription>
            {th.productDetails}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{th.productName}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{th.sku}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{th.price}</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{th.stock}</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                 </div>
                 <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{th.category}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="https://placehold.co/64x64.png" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>{th.cancel}</Button>
                    <Button type="submit">{th.save}</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
