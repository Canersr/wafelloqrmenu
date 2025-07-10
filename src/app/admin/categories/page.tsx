// src/app/admin/categories/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  writeBatch,
  getDocs,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Trash2, Loader2, ArrowLeft } from 'lucide-react';
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
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

export default function CategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const categoriesCollection = collection(db, 'categories');
    const q = query(categoriesCollection, orderBy('name'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        })) as Category[];
        setCategories(items);
        setLoading(false);
      },
      (error) => {
        console.error('Kategori verisi çekme hatası: ', error);
        toast({
          title: 'Veritabanı Hatası',
          description: 'Kategoriler çekilirken bir hata oluştu.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast]);

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast({
        title: 'Hata',
        description: 'Kategori adı boş olamaz.',
        variant: 'destructive',
      });
      return;
    }
    setIsAdding(true);
    try {
      await addDoc(collection(db, 'categories'), {
        name: newCategoryName.trim(),
      });
      toast({
        title: 'Başarılı!',
        description: `"${newCategoryName.trim()}" kategorisi eklendi.`,
      });
      setNewCategoryName('');
    } catch (error) {
      console.error('Kategori ekleme hatası: ', error);
      toast({
        title: 'Hata!',
        description: 'Kategori eklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (category: Category) => {
    try {
      const batch = writeBatch(db);

      // Kategoriyi sil
      const categoryRef = doc(db, 'categories', category.id);
      batch.delete(categoryRef);

      // Bu kategorideki tüm ürünleri bul ve sil
      const menuItemsRef = collection(db, 'menuItems');
      const q = query(menuItemsRef, where('category', '==', category.name));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      toast({
        title: 'Başarılı!',
        description: `"${category.name}" kategorisi ve ilgili tüm ürünler silindi.`,
      });
    } catch (error) {
      console.error('Kategori silme hatası: ', error);
      toast({
        title: 'Hata!',
        description: 'Kategori silinirken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className='flex items-center gap-4'>
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <CardTitle>Kategori Yönetimi</CardTitle>
                    <CardDescription>
                        Menü kategorilerini ekleyin, düzenleyin veya silin.
                    </CardDescription>
                </div>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddCategory} className="flex items-center gap-4 mb-6">
          <Input
            type="text"
            placeholder="Yeni kategori adı"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-grow"
            disabled={isAdding}
          />
          <Button type="submit" disabled={isAdding}>
            {isAdding ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="mr-2 h-4 w-4" />
            )}
            Ekle
          </Button>
        </form>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kategori Adı</TableHead>
                <TableHead className="text-right">Eylemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center h-24">
                    <Loader2 className="h-6 w-6 animate-spin inline-block" />
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center h-24 text-muted-foreground"
                  >
                    Henüz kategori eklenmemiş.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell className="text-right">
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
                              "{cat.name}" kategorisini silmek üzeresiniz. Bu
                              kategoriye ait TÜM ürünler de kalıcı olarak
                              silinecektir. Bu işlem geri alınamaz.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(cat)}
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
