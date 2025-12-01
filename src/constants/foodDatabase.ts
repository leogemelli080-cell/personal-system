export interface Food {
    name: string;
    unit: string;
    calories: number; // per 1 unit (e.g., per 100g or per 1 unit)
    protein: number;
    carbs: number;
    fats: number;
    category: "protein" | "carb" | "fat" | "vegetable" | "fruit" | "dairy";
    allowed_meals: ("breakfast" | "lunch" | "snack" | "dinner")[];
    default_quantity: number; // standard serving size
}

export const FOOD_DATABASE: Food[] = [
    // Proteins - Lunch/Dinner
    { name: "Peito de Frango Grelhado", unit: "g", calories: 1.65, protein: 0.31, carbs: 0, fats: 0.036, category: "protein", allowed_meals: ["lunch", "dinner"], default_quantity: 150 },
    { name: "Carne Moída (Patinho)", unit: "g", calories: 2.19, protein: 0.36, carbs: 0, fats: 0.07, category: "protein", allowed_meals: ["lunch", "dinner"], default_quantity: 150 },
    { name: "Tilápia Grelhada", unit: "g", calories: 1.2, protein: 0.26, carbs: 0, fats: 0.02, category: "protein", allowed_meals: ["lunch", "dinner"], default_quantity: 150 },
    { name: "Salmão Assado", unit: "g", calories: 2.08, protein: 0.20, carbs: 0, fats: 0.13, category: "protein", allowed_meals: ["lunch", "dinner"], default_quantity: 120 },

    // Proteins - Breakfast/Snack
    { name: "Ovos Mexidos", unit: "unid", calories: 90, protein: 6.5, carbs: 1, fats: 7, category: "protein", allowed_meals: ["breakfast", "snack", "dinner"], default_quantity: 2 },
    { name: "Ovos Cozidos", unit: "unid", calories: 70, protein: 6, carbs: 0.5, fats: 5, category: "protein", allowed_meals: ["breakfast", "snack", "dinner"], default_quantity: 2 },
    { name: "Whey Protein", unit: "dose", calories: 120, protein: 24, carbs: 3, fats: 1, category: "protein", allowed_meals: ["breakfast", "snack"], default_quantity: 1 },
    { name: "Atum em Água", unit: "lata", calories: 120, protein: 26, carbs: 0, fats: 1, category: "protein", allowed_meals: ["snack", "dinner"], default_quantity: 0.5 },

    // Carbs - Lunch/Dinner
    { name: "Arroz Branco", unit: "g", calories: 1.3, protein: 0.02, carbs: 0.28, fats: 0.002, category: "carb", allowed_meals: ["lunch", "dinner"], default_quantity: 150 },
    { name: "Arroz Integral", unit: "g", calories: 1.12, protein: 0.026, carbs: 0.23, fats: 0.009, category: "carb", allowed_meals: ["lunch", "dinner"], default_quantity: 150 },
    { name: "Batata Doce", unit: "g", calories: 0.86, protein: 0.016, carbs: 0.20, fats: 0.001, category: "carb", allowed_meals: ["lunch", "dinner"], default_quantity: 150 },
    { name: "Batata Inglesa", unit: "g", calories: 0.77, protein: 0.02, carbs: 0.17, fats: 0.001, category: "carb", allowed_meals: ["lunch", "dinner"], default_quantity: 150 },
    { name: "Macarrão Integral", unit: "g", calories: 1.24, protein: 0.05, carbs: 0.26, fats: 0.005, category: "carb", allowed_meals: ["lunch", "dinner"], default_quantity: 120 },

    // Carbs - Breakfast/Snack
    { name: "Aveia em Flocos", unit: "g", calories: 3.89, protein: 0.14, carbs: 0.66, fats: 0.07, category: "carb", allowed_meals: ["breakfast", "snack"], default_quantity: 30 },
    { name: "Pão Integral", unit: "fatia", calories: 60, protein: 3, carbs: 12, fats: 1, category: "carb", allowed_meals: ["breakfast", "snack"], default_quantity: 2 },
    { name: "Tapioca", unit: "g", calories: 3.3, protein: 0, carbs: 0.8, fats: 0, category: "carb", allowed_meals: ["breakfast", "snack"], default_quantity: 40 },
    { name: "Granola sem Açúcar", unit: "g", calories: 4.7, protein: 0.1, carbs: 0.7, fats: 0.15, category: "carb", allowed_meals: ["breakfast", "snack"], default_quantity: 30 },

    // Fruits (Breakfast/Snack)
    { name: "Banana Prata", unit: "unid", calories: 98, protein: 1.3, carbs: 26, fats: 0.1, category: "fruit", allowed_meals: ["breakfast", "snack"], default_quantity: 1 },
    { name: "Maçã", unit: "unid", calories: 72, protein: 0.3, carbs: 19, fats: 0.2, category: "fruit", allowed_meals: ["breakfast", "snack"], default_quantity: 1 },
    { name: "Mamão Papaia", unit: "fatia", calories: 45, protein: 0.5, carbs: 11, fats: 0.1, category: "fruit", allowed_meals: ["breakfast", "snack"], default_quantity: 0.5 },
    { name: "Morangos", unit: "g", calories: 0.32, protein: 0.007, carbs: 0.077, fats: 0.003, category: "fruit", allowed_meals: ["breakfast", "snack"], default_quantity: 100 },

    // Fats
    { name: "Azeite de Oliva", unit: "ml", calories: 8.84, protein: 0, carbs: 0, fats: 1, category: "fat", allowed_meals: ["lunch", "dinner"], default_quantity: 10 },
    { name: "Pasta de Amendoim", unit: "g", calories: 5.88, protein: 0.25, carbs: 0.20, fats: 0.50, category: "fat", allowed_meals: ["breakfast", "snack"], default_quantity: 20 },
    { name: "Abacate", unit: "g", calories: 1.6, protein: 0.02, carbs: 0.09, fats: 0.15, category: "fat", allowed_meals: ["breakfast", "snack", "dinner"], default_quantity: 100 },
    { name: "Castanhas do Pará", unit: "unid", calories: 27, protein: 0.6, carbs: 0.5, fats: 2.7, category: "fat", allowed_meals: ["snack"], default_quantity: 2 },

    // Vegetables (Lunch/Dinner)
    { name: "Brócolis Cozido", unit: "g", calories: 0.35, protein: 0.024, carbs: 0.07, fats: 0.004, category: "vegetable", allowed_meals: ["lunch", "dinner"], default_quantity: 100 },
    { name: "Salada de Folhas", unit: "prato", calories: 15, protein: 1, carbs: 3, fats: 0, category: "vegetable", allowed_meals: ["lunch", "dinner"], default_quantity: 1 },
    { name: "Cenoura Ralada", unit: "g", calories: 0.41, protein: 0.01, carbs: 0.1, fats: 0.002, category: "vegetable", allowed_meals: ["lunch", "dinner"], default_quantity: 50 },
    { name: "Abobrinha Refogada", unit: "g", calories: 0.2, protein: 0.01, carbs: 0.04, fats: 0.002, category: "vegetable", allowed_meals: ["lunch", "dinner"], default_quantity: 100 },

    // Dairy
    { name: "Iogurte Natural", unit: "pote", calories: 70, protein: 8, carbs: 10, fats: 0, category: "dairy", allowed_meals: ["breakfast", "snack"], default_quantity: 1 },
    { name: "Queijo Cottage", unit: "g", calories: 0.98, protein: 0.11, carbs: 0.03, fats: 0.04, category: "dairy", allowed_meals: ["breakfast", "snack"], default_quantity: 50 },
    { name: "Leite Desnatado", unit: "copo", calories: 70, protein: 7, carbs: 10, fats: 0, category: "dairy", allowed_meals: ["breakfast", "snack"], default_quantity: 1 },
];

export const MEAL_STRUCTURE = [
    {
        name: "Café da Manhã",
        tag: "breakfast",
        type: ["protein", "carb", "fruit", "dairy"],
        visual_guide: "Prato equilibrado: 1 fonte de proteína (ovos/queijo), 1 carboidrato complexo (aveia/pão) e 1 fruta."
    },
    {
        name: "Almoço",
        tag: "lunch",
        type: ["protein", "carb", "vegetable", "fat"],
        visual_guide: "Metade do prato de vegetais, 1/4 de proteína magra e 1/4 de carboidratos."
    },
    {
        name: "Lanche da Tarde",
        tag: "snack",
        type: ["protein", "carb", "fruit"],
        visual_guide: "Opção prática: Iogurte com fruta ou sanduíche natural."
    },
    {
        name: "Jantar",
        tag: "dinner",
        type: ["protein", "carb", "vegetable", "fat"],
        visual_guide: "Leve e nutritivo: Priorize proteínas e vegetais. Reduza carboidratos se preferir."
    },
];
