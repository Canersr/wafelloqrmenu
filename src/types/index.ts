export type MenuItem = {
  id: number;
  category: 'Waffles' | 'Drinks' | 'Sides';
  name: string;
  description: string;
  price: number;
  image: string;
  aiHint: string;
  ingredients: string[];
  calories: number;
};
