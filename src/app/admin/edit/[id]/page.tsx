'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
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
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';

const categories = [
  'Klasik Waffle',
  'Meyveli Waffle',
  'Çikolatalı Lezzetler',
  'İçecekler',
];

const formSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır.'),
  category: z.enum([...categories] as [string, ...string[]], {
    required_error: 'Lütfen bir kategori seçin.',
  }),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır.'),
  price: z.coerce.number().positive('Fiyat pozitif bir sayı olmalıdır.'),
  image: z
    .any()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files.length === 1,
      'Sadece bir resim yükleyebilirsiniz.'
    )
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= 5000000,
      `Maksimum resim boyutu 5MB'dir.`
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        ['image/jpeg', 'image/png', 'image/webp'].includes(files[0].type),
      'Sadece .jpg, .png, ve .webp formatları desteklenmektedir.'
    ),
});

export default function EditMenuItemPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const itemId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [item, setItem] = useState<MenuItem | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!itemId || !item) return;
    setLoading(true);
    try {
      const { image, ...dataToUpdate } = values;
      let finalImageUrl = item.imageUrl;

      if (image && image.length > 0) {
        const imageFile = image[0] as File;
        const storageRef = ref(
          storage,
          `menuItems/${Date.now()}-${imageFile.name}`
        );
        await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      const docRef = doc(db, 'menuItems', itemId);
      await updateDoc(docRef, { ...dataToUpdate, imageUrl: finalImageUrl });
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
        description =
          'Veritabanına yazma izniniz yok gibi görünüyor. Lütfen Firebase konsolundaki güvenlik kurallarınızı kontrol edin.';
      } else if (error.code === 'storage/unauthorized') {
        description =
          'Dosya yükleme izniniz yok. Lütfen Firebase Storage kurallarınızı kontrol edin.';
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
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
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
        <CardDescription>"{item.name}" adlı ürünü güncelleyin.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Bir kategori seçin" />
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
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ürün hakkında kısa bir açıklama..."
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
             <div className="space-y-2">
              <Label>Mevcut Resim</Label>
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={100}
                height={100}
                className="rounded-md border object-cover aspect-square"
              />
            </div>
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Resmi Değiştir (İsteğe bağlı)</FormLabel>
                  <FormControl>
                     <Input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={(e) => onChange(e.target.files)}
                      {...rest}
                    />
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
                disabled={loading}
              >
                İptal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Güncelle
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
