export type MenuItem = {
  id: string;
  category: 'Klasik Waffle' | 'Meyveli Waffle' | 'Çikolatalı Lezzetler' | 'İçecekler';
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  aiHint?: string;
};
