
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, getDoc, updateDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MenuItem } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { generateDescription } from '@/ai/flows/generate-description';


const formSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır.'),
  category: z.string({
    required_error: 'Lütfen bir kategori seçin.',
  }),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır.'),
  price: z.coerce.number().positive('Fiyat pozitif bir sayı olmalıdır.'),
});

export default function EditMenuItemPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const itemId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [item, setItem] = useState<MenuItem | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, 'categories');
        const q = query(categoriesCollection, orderBy('name'));
        const querySnapshot = await getDocs(q);
        setCategories(querySnapshot.docs.map(doc => doc.data().name));
      } catch (error) {
        toast({
            title: 'Hata',
            description: 'Kategoriler yüklenirken bir sorun oluştu.',
            variant: 'destructive',
        });
        console.error("Error fetching categories: ", error);
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [toast]);

  useEffect(() => {
    if (!itemId) return;

    const fetchItem = async () => {
      setFetching(true);
      try {
        const docRef = doc(db, 'menuItems', itemId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Omit<MenuItem, 'id'>;
          setItem({ id: docSnap.id, ...data });
          form.reset(data);
        } else {
          toast({
            title: 'Hata',
            description: 'Ürün bulunamadı.',
            variant: 'destructive',
          });
          router.push('/admin');
        }
      } catch (error) {
        console.error('Veri çekme hatası: ', error);
        toast({
          title: 'Veritabanı Hatası',
          description: 'Ürün bilgileri çekilirken bir hata oluştu.',
          variant: 'destructive',
        });
      } finally {
        setFetching(false);
      }
    };

    fetchItem();
  }, [itemId, form, router, toast]);

  const handleGenerateDescription = async () => {
    const productName = form.getValues('name');
    const category = form.getValues('category');

    if (!productName || !category) {
      toast({
        title: 'Eksik Bilgi',
        description: 'Lütfen önce ürün adını ve kategorisini doldurun.',
        variant: 'destructive',
      });
      return;
    }

    setIsAiLoading(true);
    try {
      const result = await generateDescription({ productName, category });
      form.setValue('description', result.description, { shouldValidate: true });
      toast({
        title: 'Başarılı!',
        description: 'Yapay zeka açıklamayı oluşturdu.',
      });
    } catch (error) {
      console.error('AI description error:', error);
      toast({
        title: 'Yapay Zeka Hatası',
        description: 'Açıklama oluşturulurken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setIsAiLoading(false);
    }
  };
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!itemId || !item) return;
    setLoading(true);
    
    try {
      const docRef = doc(db, 'menuItems', itemId);
      // Not updating imageUrl here, as it's managed from the data file now.
      await updateDoc(docRef, { ...values, aiHint: values.name.split(' ').slice(0, 2).join(' ').toLowerCase() });
      toast({
        title: 'Başarılı!',
        description: 'Ürün başarıyla güncellendi.',
        variant: 'default',
      });
      router.push('/admin');
    } catch (error: any) {
      console.error('Güncelleme hatası: ', error);
      let description = 'Ürün güncellenirken bir hata oluştu.';
      if (error.code === 'permission-denied') {
        description = 'Veritabanına yazma izniniz yok. Lütfen Firebase kurallarınızı kontrol edin.';
      }
      toast({
        title: 'Hata!',
        description: description,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-1/2" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-1/3" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!item) {
    return <p>Ürün yüklenemedi.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ürünü Düzenle</CardTitle>
        <CardDescription>"{item.name}" adlı ürünü güncelleyin. Resimler kod dosyasından (`src/lib/data.ts`) yönetilecektir.</CardDescription>
      </CardHeader>
      <CardContent>
        {item.imageUrl && (
            <div>
                <p className="text-sm font-medium mb-2">Mevcut Resim</p>
                <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                <Image src={item.imageUrl} alt="Mevcut resim" fill className="object-cover" />
                </div>
                <p className='text-xs text-muted-foreground mt-2'>Resmi değiştirmek için `src/lib/data.ts` dosyasını güncelleyin.</p>
            </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ürün Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="örn. Belçika Usulü" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isCategoriesLoading || categories.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isCategoriesLoading ? "Kategoriler yükleniyor..." : "Bir kategori seçin"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Açıklama</FormLabel>
                     <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleGenerateDescription}
                        disabled={isAiLoading}
                        className="text-xs"
                      >
                        {isAiLoading ? (
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        ) : (
                          <Sparkles className="mr-2 h-3 w-3" />
                        )}
                        AI ile Oluştur
                      </Button>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Ürün hakkında kısa bir açıklama veya AI ile oluşturun..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fiyat (TL)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading || isAiLoading}
              >
                İptal
              </Button>
              <Button type="submit" disabled={loading || isAiLoading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Güncelleniyor...' : 'Güncelle'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
