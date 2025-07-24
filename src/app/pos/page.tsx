"use client";

import * as React from "react";
import { PlusCircle, Search, ShoppingCart, X } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { th } from "@/lib/translations";
import { products, Product } from "@/lib/mock-data";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface CartItem extends Product {
  quantity: number;
}

export default function PosPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const { toast } = useToast();

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  const handleCheckout = () => {
    // Here you would typically process the payment and record the sale
    toast({
        title: "การขายเสร็จสมบูรณ์",
        description: `ยอดรวม: ฿${subtotal.toLocaleString()}`,
    });
    setCart([]);
  }

  return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold md:text-3xl">{th.pointOfSale}</h1>
            <div className="md:hidden">
                <SidebarTrigger />
            </div>
        </div>
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        {/* Product Selection */}
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder={th.searchProducts}
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                        <div className="relative">
                            <Image
                            alt={product.name}
                            className="aspect-square w-full object-cover"
                            height="200"
                            src={product.imageUrl || "https://placehold.co/200x200"}
                            width="200"
                            data-ai-hint="product photo"
                            />
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">฿{product.price.toLocaleString()}</p>
                            <Button
                            size="sm"
                            className="w-full mt-2 gap-2"
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            >
                            <PlusCircle className="h-4 w-4" />
                            {th.addToCart}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                </CardContent>
            </Card>
        </div>

        {/* Shopping Cart */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" />{th.shoppingCart}</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-muted-foreground">{th.emptyCart}</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                        <Image src={item.imageUrl || "https://placehold.co/64x64"} alt={item.name} width={64} height={64} className="rounded-md" data-ai-hint="product photo"/>
                        <div className="flex-grow">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">฿{item.price.toLocaleString()}</p>
                        </div>
                        <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            className="w-16 h-8 text-center"
                            min="0"
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => updateQuantity(item.id, 0)}>
                            <X className="h-4 w-4"/>
                        </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            {cart.length > 0 && (
              <CardFooter className="flex flex-col gap-4">
                <Separator />
                <div className="w-full flex justify-between text-lg font-semibold">
                  <span>{th.subtotal}</span>
                  <span>฿{subtotal.toLocaleString()}</span>
                </div>
                <Button className="w-full" onClick={handleCheckout}>{th.checkout}</Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
