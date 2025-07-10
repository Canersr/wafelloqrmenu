import type { MenuItem } from '@/types';

// Bu dosya, veritabanınızı ilk kez doldurmak için bir referans olarak kullanılır.
// Buradaki ürünleri, yönetim panelindeki "Yeni Ürün Ekle" sayfasını kullanarak
// kopyala-yapıştır yöntemiyle kolayca ekleyebilirsiniz.
export const menuItems: Omit<MenuItem, 'id'>[] = [
  // Klasik Waffle
  {
    category: 'Klasik Waffle',
    name: 'Belçika Usulü',
    description: 'Pudra şekeri ve akçaağaç şurubu ile servis edilen geleneksel Belçika waffle.',
    price: 180.00,
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/food/dessert-category.jpg',
    aiHint: 'belgian waffle',
  },
  // Meyveli Waffle
  {
    category: 'Meyveli Waffle',
    name: 'Çilekli Rüyası',
    description: 'Taze çilekler, çilek sosu, beyaz çikolata ve bisküvi kırıntıları.',
    price: 250.00,
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/food/waffle-with-fruits.jpg',
    aiHint: 'strawberry waffle',
  },
  {
    category: 'Meyveli Waffle',
    name: 'Beyaz Büyü',
    description: 'Beyaz çikolata, Hindistan cevizi, badem ve taze muz dilimleri.',
    price: 255.00,
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/food/banana-kebab.jpg',
    aiHint: 'white chocolate banana',
  },
  // Çikolatalı Lezzetler
  {
    category: 'Çikolatalı Lezzetler',
    name: 'Çikolata Şelalesi',
    description: 'Bol Nutella, sütlü çikolata, fındık ve çikolata parçacıkları.',
    price: 265.00,
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1621524312/chocolate_pancakes.jpg',
    aiHint: 'chocolate waffle',
  },
  {
    category: 'Çikolatalı Lezzetler',
    name: 'Oreo Canavarı',
    description: 'Oreo parçacıkları, beyaz çikolata sosu ve bir top vanilyalı dondurma.',
    price: 280.00,
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1621524312/ice_cream.jpg',
    aiHint: 'oreo waffle',
  },
  {
    category: 'Çikolatalı Lezzetler',
    name: 'Lotus Biscoff Keyfi',
    description: 'Lotus kreması, kırılmış Lotus bisküvileri ve karamel sosu.',
    price: 245.00,
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1621524312/croissant.jpg',
    aiHint: 'lotus waffle',
  },
  // İçecekler
  {
    category: 'İçecekler',
    name: 'Ev Yapımı Limonata',
    description: 'Taze sıkılmış, nane yapraklarıyla ferahlatıcı ev yapımı limonata.',
    price: 90.00,
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/drinks/lemonade.jpg',
    aiHint: 'lemonade glass',
  },
  {
    category: 'İçecekler',
    name: 'Latte',
    description: 'Espresso ve buharda ısıtılmış sütün mükemmel uyumu. Sıcak veya soğuk servis edilir.',
    price: 80.00,
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1621524312/coffee_cup.jpg',
    aiHint: 'latte art',
  },
  {
    category: 'İçecekler',
    name: 'Sıcak Çikolata',
    description: 'Yoğun Belçika çikolatası ve süt ile hazırlanan, üzeri kremalı sıcak çikolata.',
    price: 95.00,
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1621524312/hot_chocolate.jpg',
    aiHint: 'hot chocolate mug',
  },
  {
    category: 'İçecekler',
    name: 'Filtre Kahve',
    description: 'Taze demlenmiş, aromatik Kolombiya çekirdeklerinden filtre kahve.',
    price: 70.00,
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1621524312/coffee.jpg',
    aiHint: 'filter coffee cup',
  },
];
