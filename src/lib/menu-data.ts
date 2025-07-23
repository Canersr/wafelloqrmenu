import type { MenuItem } from '@/types';

/**
 * =================================================================================
 * MENU DATA MANAGEMENT
 * =================================================================================
 * 
 * Bu dosya, menünüzdeki tüm ürünlerin ve kategorilerin merkezi olarak 
 * yönetildiği yerdir.
 * 
 * ---------------------------------------------------------------------------------
 * YENİ KATEGORİ EKLEME/SİLME/SIRALAMA
 * ---------------------------------------------------------------------------------
 * 1. Aşağıdaki `allCategories` dizisini düzenleyerek kategorileri yönetebilirsiniz.
 * 2. Dizideki elemanların sırası, menü sayfasındaki kategori sırasını belirler.
 * 3. İlk kategori olan "Tümü" genellikle sabit kalmalıdır.
 * 
 * ---------------------------------------------------------------------------------
 * YENİ ÜRÜN NASIL EKLENİR?
 * ---------------------------------------------------------------------------------
 * 1. Aşağıdaki `allMenuItems` dizisinin içine yeni bir obje olarak ürününüzü ekleyin.
 * 2. `id` alanını benzersiz bir metin olarak belirleyin (örn: "yeni-waffle-1").
 * 3. `name`, `description`, `price` alanlarını doldurun.
 * 4. `category` alanına, ürünün ait olduğu ve yukarıdaki `allCategories` 
 *    dizisinde tanımladığınız kategorinin adını yazın.
 * 5. `imageUrl` için, `public/images/menu/` klasörüne koyduğunuz resmin adını yazın.
 *    Örneğin, resmin adı `yeni-waffle.webp` ise, `imageUrl` şöyle olmalıdır:
 *    `imageUrl: '/images/menu/yeni-waffle.webp'`
 * =================================================================================
 */

// 1. ADIM: Kategorilerinizi buradan yönetin. Sıralama önemlidir.
export const allCategories = [
  'Tümü',
  'Meyveli Waffle',
  'Çikolatalı Lezzetler',
  'Klasik Waffle',
  'İçecekler',
  'a'
];


// 2. ADIM: Ürünlerinizi buraya ekleyin.
export const allMenuItems: MenuItem[] = [
  {
    id: 'cilekli-ruya',
    name: 'Çilekli Rüyası',
    description: 'Taze çilekler, Belçika çikolatası ve çıtır waffle hamurunun muhteşem buluşması.',
    price: 250.00,
    category: 'Meyveli Waffle',
    imageUrl: '/images/menu/cilekli-ruya.webp',
    aiHint: 'strawberry waffle'
  },
  {
    id: 'belcika-usulu',
    name: 'Belçika Usulü Klasik',
    description: 'Orijinal Belçika tarifiyle hazırlanmış, üzerinde pudra şekeri ve akçaağaç şurubu ile servis edilen klasik lezzet.',
    price: 220.50,
    category: 'Klasik Waffle',
    imageUrl: '/images/menu/belcika-usulu.webp',
    aiHint: 'belgian waffle'
  },
  {
    id: 'muzlu-cikolatali-ask',
    name: 'Muzlu Çikolatalı Aşk',
    description: 'Dilimlenmiş muz, akışkan sütlü çikolata ve fındık parçacıkları ile tatlı bir kaçamak.',
    price: 260.00,
    category: 'Meyveli Waffle',
    imageUrl: '/images/menu/muzlu-cikolatali.webp',
    aiHint: 'banana chocolate waffle'
  },
  {
    id: 'beyaz-cikolata-firtinasi',
    name: 'Beyaz Çikolata Fırtınası',
    description: 'Bol beyaz çikolata sosu, frambuaz ve beyaz çikolata parçacıkları ile unutulmaz bir deneyim.',
    price: 275.00,
    category: 'Çikolatalı Lezzetler',
    imageUrl: '/images/menu/beyaz-cikolata.webp',
    aiHint: 'white chocolate waffle'
  },
  {
    id: 'ev-yapimi-limonata',
    name: 'Ev Yapımı Limonata',
    description: 'Taze sıkılmış limonlardan hazırlanan, ferahlatıcı ve doğal ev yapımı limonata.',
    price: 90.00,
    category: 'İçecekler',
    imageUrl: '/images/menu/limonata.webp',
    aiHint: 'lemonade'
  },
  {
    id: 'soguk-kahve',
    name: 'Soğuk Kahve (Ice Latte)',
    description: 'Sıcak günlerin vazgeçilmezi, taze demlenmiş espresso ve sütün buzla buluşması.',
    price: 110.00,
    category: 'İçecekler',
    imageUrl: '/images/menu/soguk-kahve.webp',
    aiHint: 'iced coffee'
  },
  {
    id: 'caner',
    name: 'caner',
    description: 'Taze sıkılmış limonlardan hazırlanan, ferahlatıcı ve doğal ev yapımı limonata.',
    price: 90.00,
    category: 'a',
    imageUrl: '/images/menu/limonata.webp',
    aiHint: 'lemonade'
  }
];
