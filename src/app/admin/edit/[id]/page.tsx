'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { menuItems } from '@/lib/data';
import { useEffect } from 'react';

const categories = [
  'Klasik Waffle',
  'Meyveli Waffle',
  'Çikolatalı Lezzetler',
  'İçecekler',
];

const formSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır.'),
  category: z.string({ required_error: 'Lütfen bir kategori seçin.' }),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır.'),
  price: z.coerce.number().positive('Fiyat pozitif bir sayı olmalıdır.'),
});

export default function EditMenuItemPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const itemId = parseInt(params.id as string, 10);
  const item = menuItems.find((i) => i.id === itemId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: item || {
      name: '',
      description: '',
      price: 0,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset(item);
    }
  }, [item, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ ...values, id: itemId });
    toast({
      title: 'Demo Modu',
      description:
        'Ürün güncellendi (simülasyon). Bu özellik için bir veritabanı bağlantısı gerekir.',
      variant: 'default',
    });
    router.push('/admin');
  }

  if (!item) {
    return (
      <div className="flex justify-center items-center h-full">
        <Card>
          <CardHeader>
            <CardTitle>Hata</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Ürün bulunamadı. Lütfen yönetim paneline geri dönün.</p>
            <Button onClick={() => router.push('/admin')} className="mt-4">
              Geri Dön
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ürünü Düzenle</CardTitle>
        <CardDescription>
          "{item.name}" adlı ürünü güncelleyin.
        </CardDescription>
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
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                İptal
              </Button>
              <Button type="submit">Güncelle</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
