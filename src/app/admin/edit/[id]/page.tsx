
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
import { useEffect, useState, useRef } from 'react';
import { Loader2, Sparkles, Upload } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { generateDescription } from '@/ai/flows/generate-description';
import { compressImage } from '@/lib/image-compressor';


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
  const [isUploading, setIsUploading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [item, setItem] = useState<MenuItem | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setIsCategoriesLoading(true);
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
          const fetchedItem = { id: docSnap.id, ...data };
          setItem(fetchedItem);
          form.reset(data);
          setImagePreview(fetchedItem.imageUrl); // Set initial image preview
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary environment variables are not set!');
    }
    
    const compressedFile = await compressImage(file);

    const formData = new FormData();
    formData.append('file', compressedFile);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || 'Image upload failed');
      }

      const data = await response.json();
      return data.secure_url;
    } finally {
      setIsUploading(false);
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
    
    try {
      let imageUrl = item.imageUrl; // Keep the existing image by default

      if (imageFile) {
        try {
            imageUrl = await uploadImage(imageFile);
        } catch (uploadError: any) {
            toast({
                title: 'Resim Yükleme Hatası!',
                description: `Resim yüklenemedi: ${uploadError.message}. Lütfen Cloudinary ayarlarınızı kontrol edin.`,
                variant: 'destructive',
            });
            setLoading(false);
            return;
        }
      }

      const docRef = doc(db, 'menuItems', itemId);
      await updateDoc(docRef, { 
        ...values, 
        imageUrl: imageUrl, // Update with new or existing URL
        aiHint: values.name.split(' ').slice(0, 2).join(' ').toLowerCase() 
      });
      
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
          <CardTitle><Skeleton className="h-8 w-1/2" /></CardTitle>
          <CardDescription><Skeleton className="h-4 w-1/3" /></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Skeleton className="aspect-video w-full max-w-sm rounded-lg" />
            <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-20 w-full" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
        </CardContent>
      </Card>
    );
  }

  if (!item) {
    return <p>Ürün yüklenemedi.</p>;
  }

  const allLoading = loading || isAiLoading || isUploading || isCategoriesLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ürünü Düzenle</CardTitle>
        <CardDescription>"{item.name}" adlı ürünü güncelleyin.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormItem>
              <FormLabel>Ürün Resmi</FormLabel>
              <Card
                className="mt-2 aspect-video w-full max-w-sm relative flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <Image src={imagePreview} alt="Ürün resmi önizleme" fill className="object-cover rounded-lg" />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Upload className="mx-auto h-8 w-8 mb-2" />
                    <span>Resim Yükle</span>
                    <p className="text-xs">Tıkla ve bir dosya seç</p>
                  </div>
                )}
                <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={allLoading}
                />
              </Card>
              {isUploading && (
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resim sıkıştırılıyor ve yükleniyor...
                </div>
              )}
            </FormItem>

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
                        disabled={allLoading}
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
                disabled={allLoading}
              >
                İptal
              </Button>
              <Button type="submit" disabled={allLoading}>
                {(loading || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Güncelleniyor...' : isUploading ? 'Resim Yükleniyor...' : 'Güncelle'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
