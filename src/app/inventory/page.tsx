"use client";

import * as React from "react";
import {
  MoreHorizontal,
  PlusCircle,
  Search,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { th } from "@/lib/translations";
import { products as initialProducts, Product } from "@/lib/mock-data";
import Image from "next/image";
import { ProductDialog } from "@/components/inventory/product-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function InventoryPage() {
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | undefined>(undefined);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
    } else {
      setProducts([...products, { ...product, id: `p${products.length + 1}` }]);
    }
    setEditingProduct(undefined);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingProduct(undefined);
    setIsDialogOpen(true);
  }

  const handleDelete = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
  };


  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">{th.manageInventory}</h1>
        <div className="flex items-center gap-2">
            <Button onClick={handleAddNew} className="gap-2">
                <PlusCircle className="h-5 w-5" />
                <span className="hidden md:inline">{th.addProduct}</span>
            </Button>
            <div className="md:hidden">
                <SidebarTrigger />
            </div>
        </div>
      </div>
      <Card>
        <CardHeader>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder={th.searchProducts}
                    className="pl-8 sm:w-1/2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>{th.productName}</TableHead>
                <TableHead>{th.sku}</TableHead>
                <TableHead>{th.stock}</TableHead>
                <TableHead className="hidden md:table-cell">{th.price}</TableHead>
                <TableHead>
                  <span className="sr-only">{th.actions}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={product.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={product.imageUrl || "https://placehold.co/64x64"}
                      width="64"
                      data-ai-hint="product image"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.sku}</Badge>
                  </TableCell>
                  <TableCell>
                    {product.stock > 0 ? (
                      `${product.stock}`
                    ) : (
                      <Badge variant="destructive">{th.stock}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    ฿{product.price.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{th.actions}</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(product)}>
                            {th.edit}
                          </DropdownMenuItem>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                {th.delete}
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{th.confirmDelete}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {th.confirmDeleteMessage}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{th.cancel}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-destructive hover:bg-destructive/90">{th.delete}</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ProductDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
