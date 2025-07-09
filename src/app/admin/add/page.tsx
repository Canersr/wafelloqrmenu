'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
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
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

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
    .refine((files) => files?.length == 1, 'Resim yüklemek zorunludur.')
    .refine(
      (files) => files?.[0]?.size <= 5000000,
      `Maksimum resim boyutu 5MB'dir.`
    )
    .refine(
      (files) =>
        ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      'Sadece .jpg, .png, ve .webp formatları desteklenmektedir.'
    ),
});

export default function AddMenuItemPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const imageFile = values.image[0] as File;
      const storageRef = ref(
        storage,
        `menuItems/${Date.now()}-${imageFile.name}`
      );
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);

      const { image, ...dataToSave } = values;

      await addDoc(collection(db, 'menuItems'), {
        ...dataToSave,
        imageUrl: imageUrl,
        aiHint: values.name.split(' ').slice(0, 2).join(' ').toLowerCase(),
      });
      toast({
        title: 'Başarılı!',
        description: 'Yeni ürün menüye başarıyla eklendi.',
        variant: 'default',
      });
      router.push('/admin');
    } catch (error: any) {
      console.error('Ekleme hatası: ', error);
      let description = 'Ürün eklenirken bir hata oluştu.';
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
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yeni Ürün Ekle</CardTitle>
        <CardDescription>Menünüze yeni bir ürün ekleyin.</CardDescription>
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
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Ürün Resmi</FormLabel>
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
                Kaydet
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
