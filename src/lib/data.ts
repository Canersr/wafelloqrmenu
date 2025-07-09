import type { MenuItem } from '@/types';

// Bu dosya artık doğrudan kullanılmıyor.
// Veriler Firebase Firestore'dan çekilmektedir.
// Bu veriyi, veritabanınızı ilk kez doldurmak için referans olarak kullanabilirsiniz.
export const menuItems: Omit<MenuItem, 'id'>[] = [
  // Klasik Waffle
  {
    category: 'Klasik Waffle',
    name: 'Belçika Usulü',
    description: 'Pudra şekeri ve akçaağaç şurubu ile servis edilen klasik Belçika waffle.',
    price: 180.00,
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'belgian waffle',
  },
  // Meyveli Waffle
  {
    category: 'Meyveli Waffle',
    name: 'Beyaz Büyü',
    description: 'Beyaz çikolata, Hindistan cevizi, badem ve muz dilimleri.',
    price: 255.00,
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'white chocolate',
  },
  {
    category: 'Meyveli Waffle',
    name: 'Çilekli Rüyası',
    description: 'Taze çilekler, cheesecake kreması ve bisküvi kırıntıları.',
    price: 250.00,
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'strawberry waffle',
  },
  // Çikolatalı Lezzetler
  {
    category: 'Çikolatalı Lezzetler',
    name: 'Çikolata Şelalesi',
    description: 'Bol Nutella, beyaz çikolata sosu, fındık ve çikolata parçacıkları.',
    price: 265.00,
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'chocolate waffle',
  },
  {
    category: 'Çikolatalı Lezzetler',
    name: 'Oreo Canavarı',
    description: 'Oreo parçacıkları, beyaz çikolata sosu ve vanilyalı dondurma.',
    price: 280.00,
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'oreo waffle',
  },
  {
    category: 'Çikolatalı Lezzetler',
    name: 'Lotus Biscoff Keyfi',
    description: 'Lotus Biscoff kreması, kırılmış Lotus bisküvileri ve bir top vanilyalı dondurma.',
    price: 245.00,
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'lotus waffle',
  },
  // İçecekler
  {
    category: 'İçecekler',
    name: 'Ev Yapımı Limonata',
    description: 'Taze sıkılmış, ferahlatıcı limonata.',
    price: 90.00,
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'lemonade glass',
  },
  {
    category: 'İçecekler',
    name: 'Latte',
    description: 'Espresso ve buharda ısıtılmış sütün mükemmel uyumu.',
    price: 80.00,
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'latte art',
  },
  {
    category: 'İçecekler',
    name: 'Sıcak Çikolata',
    description: 'Yoğun ve kremalı sıcak çikolata.',
    price: 95.00,
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'hot chocolate',
  },
  {
    category: 'İçecekler',
    name: 'Filtre Kahve',
    description: 'Taze demlenmiş, aromatik filtre kahve.',
    price: 70.00,
    imageUrl: 'https://placehold.co/600x400.png',
    aiHint: 'filter coffee',
  },
];
