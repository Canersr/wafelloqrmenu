'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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
import Image from 'next/image';
import { compressImage } from '@/lib/image-compressor';

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
});

export default function AddMenuItemPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
    },
  });
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(null); // Reset previous file
      setImagePreview(URL.createObjectURL(file)); // Show preview instantly
      setIsCompressing(true);
      try {
        const compressedFile = await compressImage(file);
        setImageFile(compressedFile);
      } catch (error) {
        toast({
            title: 'Uyarı',
            description: 'Resim sıkıştırılamadı, orijinal dosya kullanılacak. Yükleme biraz daha uzun sürebilir.',
            variant: 'default',
        });
        setImageFile(file); // Fallback to original file
      } finally {
        setIsCompressing(false);
      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    let imageUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
        
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
        });
        
        if (!res.ok) {
            throw new Error('Resim yüklemesi başarısız oldu.');
        }
        
        const data = await res.json();
        imageUrl = data.secure_url;
      }

      await addDoc(collection(db, 'menuItems'), {
        ...values,
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
      if (error.message.includes('Cloudinary') || error.message.includes('Resim')) {
        description = 'Resim yüklenemedi. Lütfen Cloudinary ayarlarınızı (.env dosyası) kontrol edin.';
      } else if (error.code === 'permission-denied') {
        description =
          'Veritabanına yazma izniniz yok. Lütfen Firebase kurallarınızı kontrol edin.';
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

            <FormItem>
              <FormLabel>Ürün Resmi</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" disabled={isCompressing}/>
              </FormControl>
              {isCompressing && <p className="text-sm text-muted-foreground mt-2">Resim optimize ediliyor, lütfen bekleyin...</p>}
              <FormMessage />
            </FormItem>

            {imagePreview && (
              <div>
                <FormLabel>Resim Önizlemesi</FormLabel>
                <div className="mt-2 relative w-full aspect-video rounded-md overflow-hidden">
                  <Image src={imagePreview} alt="Seçilen resmin önizlemesi" fill className="object-cover" />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading || isCompressing}
              >
                İptal
              </Button>
              <Button type="submit" disabled={loading || isCompressing || !imageFile && !!imagePreview}>
                {(loading || isCompressing) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isCompressing ? 'Resim Hazırlanıyor...' : loading ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
