'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, onSnapshot, doc, deleteDoc, query, orderBy, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MenuItem } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, Loader2, Database, LayoutGrid } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
} from '@/components/ui/alert-dialog';

export default function AdminDashboard() {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    const menuItemsCollection = collection(db, 'menuItems');
    const q = query(menuItemsCollection, orderBy('name'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDbError(null);
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MenuItem[];
      setMenuItems(items);
      setLoading(false);
    }, (error: any) => {
      console.error("Veri çekme hatası: ", error);
      let desc = "Ürünler çekilirken bir hata oluştu. Lütfen Firebase yapılandırmanızı kontrol edin.";
      if (error.code === 'permission-denied') {
        desc = "Veritabanına erişim izniniz yok. Lütfen Firebase konsolundaki Firestore güvenlik kurallarınızı kontrol edin.";
      }
      setDbError(desc);
      toast({
        title: "Veritabanı Hatası",
        description: desc,
        variant: "destructive"
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    toast({
        title: 'İşlem Başlatıldı',
        description: 'Örnek veriler veritabanına ekleniyor...',
    });
    try {
      // This is a placeholder for sample data.
      // Since data.ts is removed, we'd need to redefine it or fetch from a static source.
      // For now, we'll just log a message.
      console.log("Seeding is disabled as sample data file is removed.");
      toast({
          title: "İşlem Devre Dışı",
          description: "Örnek veri dosyası kaldırıldığı için bu özellik devre dışı bırakılmıştır.",
          variant: 'default',
        });

    } catch (error: any) {
      console.error("Veritabanı doldurma hatası: ", error);
      let description = 'Örnek ürünler eklenirken bir hata oluştu.';
       if (error.code === 'permission-denied') {
        description = 'Veritabanına yazma izniniz yok gibi görünüyor. Lütfen Firebase konsolundaki güvenlik kurallarınızı kontrol edin.';
      }
      toast({
        title: 'Hata!',
        description: description,
        variant: 'destructive',
      });
    } finally {
      setIsSeeding(false);
    }
  };


  const handleDelete = async (item: MenuItem) => {
    try {
      await deleteDoc(doc(db, 'menuItems', item.id));
      toast({
        title: 'Başarılı!',
        description: `"${item.name}" adlı ürün başarıyla silindi.`,
        variant: 'default',
      });
    } catch (error: any) {
      console.error("Silme hatası: ", error);
      let description = 'Ürün silinirken bir hata oluştu.';
      if (error.code === 'permission-denied') {
        description = 'Veritabanına yazma izniniz yok gibi görünüyor. Lütfen Firebase konsolundaki güvenlik kurallarınızı kontrol edin.';
      }
      toast({
        title: 'Hata!',
        description: description,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Ürün Yönetimi</CardTitle>
          <CardDescription>
            Menünüzdeki ürünleri görüntüleyin, düzenleyin veya silin.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
           <Button asChild variant="outline">
            <Link href="/admin/categories">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Kategorileri Yönet
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Yeni Ürün Ekle
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ürün Adı</TableHead>
                <TableHead className="hidden md:table-cell">Kategori</TableHead>
                <TableHead className="hidden sm:table-cell">Fiyat</TableHead>
                <TableHead className="text-right">Eylemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    <Loader2 className="h-6 w-6 animate-spin inline-block" />
                  </TableCell>
                </TableRow>
              ) : dbError ? (
                 <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-destructive">
                    Hata: {dbError}
                  </TableCell>
                </TableRow>
              ) : menuItems.length === 0 ? (
                 <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                    <div className="flex flex-col items-center gap-4">
                        <span>Veritabanında hiç ürün bulunamadı.</span>
                        {/* The button is now disabled as the source file is removed */}
                        <Button onClick={handleSeedDatabase} disabled>
                            <Database className="mr-2 h-4 w-4" />
                            Örnek Ürünleri Yükle (Devre Dışı)
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                menuItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.category}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {item.price.toFixed(2)} TL
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/edit/${item.id}`} title="Düzenle">
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            title="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{item.name}" ürününü silmek üzeresiniz. Bu işlem
                              geri alınamaz.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
