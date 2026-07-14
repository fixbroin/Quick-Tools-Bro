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
  { name: 'Watermelon', category: 'Fruits', nutrition: { calories: 30, protein: 0.6, carbs: 8, fats: 0.2 }, units: { gram: 1, cup: 154 } },
  { name: 'Blueberries', category: 'Fruits', nutrition: { calories: 57, protein: 0.7, carbs: 14, fats: 0.3 }, units: { gram: 1, cup: 148 } },
  { name: 'Avocado', category: 'Fruits', nutrition: { calories: 160, protein: 2, carbs: 9, fats: 15 }, units: { gram: 1, piece: 150 } },
  { name: 'Pineapple', category: 'Fruits', nutrition: { calories: 50, protein: 0.5, carbs: 13, fats: 0.1 }, units: { gram: 1, cup: 165 } },
  { name: 'Papaya', category: 'Fruits', nutrition: { calories: 43, protein: 0.5, carbs: 11, fats: 0.3 }, units: { gram: 1, cup: 140 } },
  { name: 'Pomegranate', category: 'Fruits', nutrition: { calories: 83, protein: 1.7, carbs: 19, fats: 1.2 }, units: { gram: 1, piece: 282 } },
  { name: 'Kiwi', category: 'Fruits', nutrition: { calories: 61, protein: 1.1, carbs: 15, fats: 0.5 }, units: { gram: 1, piece: 75 } },
  { name: 'Peach', category: 'Fruits', nutrition: { calories: 39, protein: 0.9, carbs: 10, fats: 0.3 }, units: { gram: 1, piece: 150 } },
  { name: 'Pear', category: 'Fruits', nutrition: { calories: 57, protein: 0.4, carbs: 15, fats: 0.1 }, units: { gram: 1, piece: 178 } },
  { name: 'Cherries', category: 'Fruits', nutrition: { calories: 50, protein: 1, carbs: 12, fats: 0.3 }, units: { gram: 1, cup: 154 } },
  { name: 'Guava', category: 'Fruits', nutrition: { calories: 68, protein: 2.6, carbs: 14, fats: 1 }, units: { gram: 1, piece: 55 } },
  
  // Vegetables
  { name: 'Carrot', category: 'Vegetables', nutrition: { calories: 41, protein: 0.9, carbs: 10, fats: 0.2 }, units: { gram: 1, piece: 61 } },
  { name: 'Broccoli', category: 'Vegetables', nutrition: { calories: 34, protein: 2.8, carbs: 7, fats: 0.4 }, units: { gram: 1, cup: 91 } },
  { name: 'Spinach', category: 'Vegetables', nutrition: { calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4 }, units: { gram: 1, cup: 30 } },
  { name: 'Potato (boiled)', category: 'Vegetables', nutrition: { calories: 87, protein: 1.9, carbs: 20, fats: 0.1 }, units: { gram: 1, piece: 173 } },
  { name: 'Tomato', category: 'Vegetables', nutrition: { calories: 18, protein: 0.9, carbs: 3.9, fats: 0.2 }, units: { gram: 1, piece: 123 } },
  { name: 'Cucumber', category: 'Vegetables', nutrition: { calories: 15, protein: 0.7, carbs: 3.6, fats: 0.1 }, units: { gram: 1, piece: 200 } },
  { name: 'Onion', category: 'Vegetables', nutrition: { calories: 40, protein: 1.1, carbs: 9.3, fats: 0.1 }, units: { gram: 1, piece: 110 } },
  { name: 'Garlic', category: 'Vegetables', nutrition: { calories: 149, protein: 6.4, carbs: 33, fats: 0.5 }, units: { gram: 1, clove: 3 } },
  { name: 'Bell Pepper / Capsicum', category: 'Vegetables', nutrition: { calories: 20, protein: 0.9, carbs: 4.6, fats: 0.2 }, units: { gram: 1, piece: 119 } },
  { name: 'Cauliflower', category: 'Vegetables', nutrition: { calories: 25, protein: 1.9, carbs: 5, fats: 0.3 }, units: { gram: 1, cup: 100 } },
  { name: 'Cabbage', category: 'Vegetables', nutrition: { calories: 25, protein: 1.3, carbs: 6, fats: 0.1 }, units: { gram: 1, cup: 89 } },
  { name: 'Lettuce', category: 'Vegetables', nutrition: { calories: 15, protein: 1.4, carbs: 2.9, fats: 0.2 }, units: { gram: 1, cup: 36 } },
  { name: 'Mushroom', category: 'Vegetables', nutrition: { calories: 22, protein: 3.1, carbs: 3.3, fats: 0.3 }, units: { gram: 1, cup: 70 } },
  { name: 'Sweet Potato (boiled)', category: 'Vegetables', nutrition: { calories: 86, protein: 1.6, carbs: 20, fats: 0.1 }, units: { gram: 1, piece: 130 } },
  { name: 'Eggplant / Brinjal', category: 'Vegetables', nutrition: { calories: 25, protein: 1, carbs: 6, fats: 0.2 }, units: { gram: 1, piece: 358 } },
  { name: 'Peas (green)', category: 'Vegetables', nutrition: { calories: 81, protein: 5.4, carbs: 14, fats: 0.4 }, units: { gram: 1, cup: 145 } },

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
  { name: 'Cashews', category: 'Nuts & Seeds', nutrition: { calories: 553, protein: 18, carbs: 30, fats: 44 }, units: { gram: 1, cup: 137 } },
  { name: 'Pistachios', category: 'Nuts & Seeds', nutrition: { calories: 562, protein: 20, carbs: 28, fats: 45 }, units: { gram: 1, cup: 123 } },
  { name: 'Raisins (Kishmish)', category: 'Nuts & Seeds', nutrition: { calories: 299, protein: 3, carbs: 79, fats: 0.5 }, units: { gram: 1, cup: 165 } },
  { name: 'Dates (Khajur)', category: 'Nuts & Seeds', nutrition: { calories: 282, protein: 2.5, carbs: 75, fats: 0.4 }, units: { gram: 1, piece: 8 } },
  { name: 'Dried Figs (Anjeer)', category: 'Nuts & Seeds', nutrition: { calories: 249, protein: 3.3, carbs: 64, fats: 0.9 }, units: { gram: 1, piece: 8 } },
  { name: 'Peanuts', category: 'Nuts & Seeds', nutrition: { calories: 567, protein: 25, carbs: 16, fats: 49 }, units: { gram: 1, cup: 146 } },
  { name: 'Chia Seeds', category: 'Nuts & Seeds', nutrition: { calories: 486, protein: 17, carbs: 42, fats: 31 }, units: { gram: 1, tablespoon: 12 } },

  // Indian Foods
  { name: 'Roti / Chapati', category: 'Indian Foods', nutrition: { calories: 297, protein: 10, carbs: 60, fats: 2.5 }, units: { gram: 1, piece: 40 } },
  { name: 'Idli', category: 'Indian Foods', nutrition: { calories: 124, protein: 4, carbs: 26, fats: 0.5 }, units: { gram: 1, piece: 50 } },
  { name: 'Dosa (plain)', category: 'Indian Foods', nutrition: { calories: 168, protein: 3.9, carbs: 29, fats: 3.7 }, units: { gram: 1, piece: 80 } },
  { name: 'Masala Dosa', category: 'Indian Foods', nutrition: { calories: 205, protein: 4, carbs: 31, fats: 7 }, units: { gram: 1, piece: 150 } },
  { name: 'Samosa', category: 'Indian Foods', nutrition: { calories: 262, protein: 4.5, carbs: 32, fats: 13 }, units: { gram: 1, piece: 75 } },
  { name: 'Dal Tadka (cooked)', category: 'Indian Foods', nutrition: { calories: 116, protein: 6, carbs: 16, fats: 3.5 }, units: { gram: 1, bowl: 150 } },
  { name: 'Paneer Tikka Masala', category: 'Indian Foods', nutrition: { calories: 171, protein: 8, carbs: 6, fats: 13 }, units: { gram: 1, portion: 200 } },
  { name: 'Butter Chicken', category: 'Indian Foods', nutrition: { calories: 218, protein: 14, carbs: 4, fats: 16 }, units: { gram: 1, portion: 200 } },
  { name: 'Veg Biryani', category: 'Indian Foods', nutrition: { calories: 163, protein: 4.2, carbs: 28, fats: 3.8 }, units: { gram: 1, plate: 250 } },
  { name: 'Chicken Biryani', category: 'Indian Foods', nutrition: { calories: 180, protein: 11, carbs: 24, fats: 4.5 }, units: { gram: 1, plate: 250 } },
  { name: 'Chole Masala (cooked)', category: 'Indian Foods', nutrition: { calories: 150, protein: 6, carbs: 20, fats: 5 }, units: { gram: 1, bowl: 150 } },
  { name: 'Bhatura', category: 'Indian Foods', nutrition: { calories: 333, protein: 7.5, carbs: 50, fats: 11 }, units: { gram: 1, piece: 60 } },
  { name: 'Gulab Jamun', category: 'Indian Foods', nutrition: { calories: 380, protein: 4.2, carbs: 63, fats: 12 }, units: { gram: 1, piece: 50 } },
];
