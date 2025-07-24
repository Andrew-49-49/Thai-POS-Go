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
import { Product } from "@/lib/mock-data";
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
import { getSheetData, appendSheetData, updateSheetData, clearSheetData } from "@/lib/sheets-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function InventoryPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | undefined>(undefined);
  const { toast } = useToast();

  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    const data = await getSheetData('Sheet1!A2:G'); // Assuming data is in Sheet1 and starts from row 2
    if (data) {
      const productsData: Product[] = data.map((row: any[], index: number) => ({
        id: row[0] || `p${index + 1}`,
        name: row[1] || "",
        sku: row[2] || "",
        price: parseFloat(row[3]) || 0,
        stock: parseInt(row[4]) || 0,
        category: row[5] || "",
        imageUrl: row[6] || undefined,
      }));
      setProducts(productsData);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSaveProduct = async (product: Product) => {
    try {
        if (editingProduct) {
            // Update existing product
            const productIndex = products.findIndex((p) => p.id === product.id);
            if (productIndex === -1) return;
            const range = `Sheet1!A${productIndex + 2}:G${productIndex + 2}`;
            const values = [[product.id, product.name, product.sku, product.price, product.stock, product.category, product.imageUrl || ""]];
            await updateSheetData(range, values);
            toast({ title: "สำเร็จ", description: "สินค้าถูกแก้ไขเรียบร้อยแล้ว" });
        } else {
            // Add new product
            const newId = `p${Date.now()}`;
            const values = [[newId, product.name, product.sku, product.price, product.stock, product.category, product.imageUrl || ""]];
            await appendSheetData('Sheet1!A:G', values);
            toast({ title: "สำเร็จ", description: "สินค้าถูกเพิ่มเรียบร้อยแล้ว" });
        }
        fetchProducts(); // Refresh data from sheet
    } catch (error) {
        toast({ variant: "destructive", title: "เกิดข้อผิดพลาด", description: "ไม่สามารถบันทึกข้อมูลสินค้าได้" });
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

  const handleDelete = async (productId: string) => {
     try {
        const productIndex = products.findIndex((p) => p.id === productId);
        if (productIndex === -1) return;
        const range = `Sheet1!A${productIndex + 2}:G${productIndex + 2}`;
        await clearSheetData(range); // This will clear the row
        toast({ title: "สำเร็จ", description: "สินค้าถูกลบเรียบร้อยแล้ว" });
        fetchProducts(); // Refresh data
     } catch (error) {
        toast({ variant: "destructive", title: "เกิดข้อผิดพลาด", description: "ไม่สามารถลบสินค้าได้" });
     }
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
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell className="hidden sm:table-cell">
                            <Skeleton className="h-[64px] w-[64px] rounded-md" />
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-3/4" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-1/2" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-1/4" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-1/2" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                    </TableRow>
                ))
              ) : filteredProducts.map((product) => (
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
