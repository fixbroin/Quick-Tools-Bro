export interface FoodItem {
  name: string;
  category: string;
  nutrition: {
    calories: number; // per 100g/ml
    protein: number;
    carbs: number;
    fats: number;
  };
  units: {
    [key: string]: number; // e.g., { gram: 1, piece: 120, cup: 200 }
  };
}

export const foodData: FoodItem[] = [
  // Fruits
  { name: 'Apple', category: 'Fruits', nutrition: { calories: 52, protein: 0.3, carbs: 14, fats: 0.2 }, units: { gram: 1, piece: 182 } },
  { name: 'Banana', category: 'Fruits', nutrition: { calories: 89, protein: 1.1, carbs: 23, fats: 0.3 }, units: { gram: 1, piece: 118 } },
  { name: 'Orange', category: 'Fruits', nutrition: { calories: 47, protein: 0.9, carbs: 12, fats: 0.1 }, units: { gram: 1, piece: 131 } },
  { name: 'Grapes', category: 'Fruits', nutrition: { calories: 69, protein: 0.7, carbs: 18, fats: 0.2 }, units: { gram: 1, cup: 151 } },
  { name: 'Strawberry', category: 'Fruits', nutrition: { calories: 32, protein: 0.7, carbs: 8, fats: 0.3 }, units: { gram: 1, cup: 152 } },
  { name: 'Mango', category: 'Fruits', nutrition: { calories: 60, protein: 0.8, carbs: 15, fats: 0.4 }, units: { gram: 1, cup: 165 } },
  
  // Vegetables
  { name: 'Carrot', category: 'Vegetables', nutrition: { calories: 41, protein: 0.9, carbs: 10, fats: 0.2 }, units: { gram: 1, piece: 61 } },
  { name: 'Broccoli', category: 'Vegetables', nutrition: { calories: 34, protein: 2.8, carbs: 7, fats: 0.4 }, units: { gram: 1, cup: 91 } },
  { name: 'Spinach', category: 'Vegetables', nutrition: { calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4 }, units: { gram: 1, cup: 30 } },
  { name: 'Potato (boiled)', category: 'Vegetables', nutrition: { calories: 87, protein: 1.9, carbs: 20, fats: 0.1 }, units: { gram: 1, piece: 173 } },
  { name: 'Tomato', category: 'Vegetables', nutrition: { calories: 18, protein: 0.9, carbs: 3.9, fats: 0.2 }, units: { gram: 1, piece: 123 } },
  { name: 'Cucumber', category: 'Vegetables', nutrition: { calories: 15, protein: 0.7, carbs: 3.6, fats: 0.1 }, units: { gram: 1, piece: 200 } },

  // Grains
  { name: 'Rice (white, boiled)', category: 'Grains', nutrition: { calories: 130, protein: 2.7, carbs: 28, fats: 0.3 }, units: { gram: 1, cup: 158 } },
  { name: 'Rice (brown, boiled)', category: 'Grains', nutrition: { calories: 123, protein: 2.6, carbs: 26, fats: 1 }, units: { gram: 1, cup: 202 } },
  { name: 'Whole Wheat Bread', category: 'Grains', nutrition: { calories: 265, protein: 13, carbs: 48, fats: 3.4 }, units: { gram: 1, slice: 28 } },
  { name: 'Oats (rolled)', category: 'Grains', nutrition: { calories: 389, protein: 16.9, carbs: 66, fats: 6.9 }, units: { gram: 1, cup: 81 } },
  
  // Meats
  { name: 'Chicken Breast (cooked)', category: 'Meats', nutrition: { calories: 165, protein: 31, carbs: 0, fats: 3.6 }, units: { gram: 1 } },
  { name: 'Salmon (cooked)', category: 'Meats', nutrition: { calories: 206, protein: 22, carbs: 0, fats: 13 }, units: { gram: 1 } },
  { name: 'Beef (ground, 85% lean, cooked)', category: 'Meats', nutrition: { calories: 250, protein: 26, carbs: 0, fats: 15 }, units: { gram: 1 } },
  { name: 'Pork Chop (cooked)', category: 'Meats', nutrition: { calories: 221, protein: 26, carbs: 0, fats: 12 }, units: { gram: 1 } },

  // Dairy & Eggs
  { name: 'Milk (whole)', category: 'Dairy & Eggs', nutrition: { calories: 61, protein: 3.2, carbs: 4.8, fats: 3.3 }, units: { ml: 1, cup: 244 } },
  { name: 'Cheese (cheddar)', category: 'Dairy & Eggs', nutrition: { calories: 404, protein: 25, carbs: 1.3, fats: 33 }, units: { gram: 1, slice: 28 } },
  { name: 'Yogurt (plain)', category: 'Dairy & Eggs', nutrition: { calories: 59, protein: 10, carbs: 3.6, fats: 0.4 }, units: { gram: 1, cup: 245 } },
  { name: 'Egg (large, boiled)', category: 'Dairy & Eggs', nutrition: { calories: 155, protein: 13, carbs: 1.1, fats: 11 }, units: { gram: 1, piece: 50 } },

  // Nuts & Seeds
  { name: 'Almonds', category: 'Nuts & Seeds', nutrition: { calories: 579, protein: 21, carbs: 22, fats: 49 }, units: { gram: 1, cup: 143 } },
  { name: 'Walnuts', category: 'Nuts & Seeds', nutrition: { calories: 654, protein: 15, carbs: 14, fats: 65 }, units: { gram: 1, cup: 117 } },
];
