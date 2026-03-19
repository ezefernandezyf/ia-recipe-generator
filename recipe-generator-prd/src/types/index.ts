// Este archivo exporta las interfaces y tipos de TypeScript utilizados en toda la aplicación, asegurando la seguridad de tipos y claridad en el código.

export interface Ingredient {
    id: string;
    name: string;
    quantity: number;
    unit: string;
}

export interface Recipe {
    id: string;
    title: string;
    ingredients: Ingredient[];
    instructions: string;
    prepTime: number; // en minutos
    cookTime: number; // en minutos
    totalTime: number; // en minutos
    difficulty: 'easy' | 'medium' | 'hard';
    macros: {
        calories: number;
        protein: number;
        fat: number;
        carbohydrates: number;
    };
}

export interface UserInput {
    ingredients: Ingredient[];
    dietaryRestrictions?: string[];
    cuisineType?: string;
    mealType?: string; // e.g., breakfast, lunch, dinner
}