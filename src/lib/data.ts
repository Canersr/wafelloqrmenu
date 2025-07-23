import type { MenuItem } from '@/types';

// Bu dosya, veritabanınızı ilk kez doldurmak için bir referans olarak kullanılır.
// Buradaki ürünleri, yönetim panelindeki "Yeni Ürün Ekle" sayfasını kullanarak
// veya "Örnek Ürünleri Yükle" butonuyla kolayca ekleyebilirsiniz.
export const menuItems: Omit<MenuItem, 'id'>[] = [
  // Klasik Waffle
  {
    category: 'Klasik Waffle',
    name: 'Belçika Usulü',
    description: 'Pudra şekeri ve akçaağaç şurubu ile servis edilen geleneksel Belçika waffle.',
    price: 180.00,
    imageUrl: 'https://res.cloudinary.com/dxwwviisy/image/upload/v1721323315/waffle-stock/belgian-waffle.jpg',
    aiHint: 'belgian waffle',
  },
  // Meyveli Waffle
  {
    category: 'Meyveli Waffle',
    name: 'Çilekli Rüyası',
    description: 'Taze çilekler, çilek sosu, beyaz çikolata ve bisküvi kırıntıları.',
    price: 250.00,
    imageUrl: 'https://res.cloudinary.com/dxwwviisy/image/upload/v1721323316/waffle-stock/strawberry-waffle.jpg',
    aiHint: 'strawberry waffle',
  },
  {
    category: 'Meyveli Waffle',
    name: 'Beyaz Büyü',
    description: 'Beyaz çikolata, Hindistan cevizi, badem ve taze muz dilimleri.',
    price: 255.00,
    imageUrl: 'https://res.cloudinary.com/dxwwviisy/image/upload/v1721323317/waffle-stock/white-chocolate-banana-waffle.jpg',
    aiHint: 'white chocolate banana',
  },
  // Çikolatalı Lezzetler
  {
    category: 'Çikolatalı Lezzetler',
    name: 'Çikolata Şelalesi',
    description: 'Bol Nutella, sütlü çikolata, fındık ve çikolata parçacıkları.',
    price: 265.00,
    imageUrl: 'https://res.cloudinary.com/dxwwviisy/image/upload/v1721323317/waffle-stock/chocolate-waffle.jpg',
    aiHint: 'chocolate waffle',
  },
  {
    category: 'Çikolatalı Lezzetler',
    name: 'Oreo Canavarı',
    description: 'Oreo parçacıkları, beyaz çikolata sosu ve bir top vanilyalı dondurma.',
    price: 280.00,
    imageUrl: 'https://res.cloudinary.com/dxwwviisy/image/upload/v1721323315/waffle-stock/oreo-waffle.jpg',
    aiHint: 'oreo waffle',
  },
  {
    category: 'Çikolatalı Lezzetler',
    name: 'Lotus Biscoff Keyfi',
    description: 'Lotus kreması, kırılmış Lotus bisküvileri ve karamel sosu.',
    price: 245.00,
    imageUrl: 'https://res.cloudinary.com/dxwwviisy/image/upload/v1721323315/waffle-stock/lotus-waffle.jpg',
    aiHint: 'lotus waffle',
  },
  // İçecekler
  {
    category: 'İçecekler',
    name: 'Ev Yapımı Limonata',
    description: 'Taze sıkılmış, nane yapraklarıyla ferahlatıcı ev yapımı limonata.',
    price: 90.00,
    imageUrl: 'https://res.cloudinary.com/dxwwviisy/image/upload/v1721323316/waffle-stock/lemonade.jpg',
    aiHint: 'lemonade glass',
  },
  {
    category: 'İçecekler',
    name: 'Latte',
    description: 'Espresso ve buharda ısıtılmış sütün mükemmel uyumu. Sıcak veya soğuk servis edilir.',
    price: 80.00,
    imageUrl: 'https://res.cloudinary.com/dxwwviisy/image/upload/v1721323316/waffle-stock/latte.jpg',
    aiHint: 'latte art',
  },
  {
    category: 'İçecekler',
    name: 'Sıcak Çikolata',
    description: 'Yoğun Belçika çikolatası ve süt ile hazırlanan, üzeri kremalı sıcak çikolata.',
    price: 95.00,
    imageUrl: 'https://res.cloudinary.com/dxwwviisy/image/upload/v1721323316/waffle-stock/hot-chocolate.jpg',
    aiHint: 'hot chocolate mug',
  },
  {
    category: 'İçecekler',
    name: 'Filtre Kahve',
    description: 'Taze demlenmiş, aromatik Kolombiya çekirdeklerinden filtre kahve.',
    price: 70.00,
    imageUrl: 'https://res.cloudinary.com/dxwwviisy/image/upload/v1721323316/waffle-stock/filter-coffee.jpg',
    aiHint: 'filter coffee cup',
  },
];
