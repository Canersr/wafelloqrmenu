
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
import { compressImage } from '@/lib/image-compressor';
import { generateDescription } from '@/ai/flows/generate-description';
import { signCloudinaryUpload } from '@/ai/flows/sign-cloudinary-upload';


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
  const [isCompressing, setIsCompressing] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [item, setItem] = useState<MenuItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
          if (data.imageUrl) {
            setImagePreview(data.imageUrl);
          }
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(null);
      setImagePreview(URL.createObjectURL(file));
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
        setImageFile(file);
      } finally {
        setIsCompressing(false);
      }
    }
  };

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
    let imageUrl = item.imageUrl;

    try {
      if (imageFile) {
        const { signature, timestamp, apiKey, cloudName } = await signCloudinaryUpload();

        if (!cloudName || !apiKey) {
            throw new Error('Cloudinary environment variables are not configured on the server.');
        }

        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp.toString());
        formData.append('api_key', apiKey);
        
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Cloudinary upload error:', errorText);
            throw new Error('Resim yüklemesi başarısız oldu.');
        }
        
        const data = await res.json();
        imageUrl = data.secure_url;
      }

      const docRef = doc(db, 'menuItems', itemId);
      await updateDoc(docRef, { ...values, imageUrl: imageUrl, aiHint: values.name.split(' ').slice(0, 2).join(' ').toLowerCase() });
      toast({
        title: 'Başarılı!',
        description: 'Ürün başarıyla güncellendi.',
        variant: 'default',
      });
      router.push('/admin');
    } catch (error: any) {
      console.error('Güncelleme hatası: ', error);
      let description = 'Ürün güncellenirken bir hata oluştu.';
      if (error.message.includes('Cloudinary environment variables')) {
        description = 'Sunucu tarafında Cloudinary ayarları eksik. Lütfen .env dosyasını kontrol edin.';
      } else if (error.message.includes('Resim yüklemesi başarısız oldu')) {
        description = 'Resim yüklenemedi. Lütfen Cloudinary API anahtar, secret ve cloud name bilgilerinizin doğru olduğundan emin olun.';
      } else if (error.code === 'permission-denied') {
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
                    disabled={isCategoriesLoading || categories.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isCategoriesLoading ? "Kategoriler yükleniyor..." : "Bir kategori seçin"} />
                      </Trigger>
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
                  <Image src={imagePreview} alt="Mevcut veya seçilen resmin önizlemesi" fill className="object-cover" />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading || isCompressing || isAiLoading}
              >
                İptal
              </Button>
              <Button type="submit" disabled={loading || isCompressing || isAiLoading || !imagePreview}>
                {(loading || isCompressing) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isCompressing ? 'Resim Hazırlanıyor...' : loading ? 'Güncelleniyor...' : 'Güncelle'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
