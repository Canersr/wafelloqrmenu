export type MenuItem = {
  id: number;
  category: 'Cajun Menus' | 'Bucket Menus' | 'Burgers' | 'Bowls' | 'Pastas' | 'Salads' | 'Sides' | 'Sauces' | 'Desserts' | 'Drinks';
  name: string;
  description: string;
  price: number;
};
