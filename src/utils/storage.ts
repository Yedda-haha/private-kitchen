import { ref } from 'vue';

// Types
export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  prepTime: number; // minutes
  cookTime: number; // minutes
  steps: string;
  notes: string;
  image?: string; // Base64 string
  category?: string;
  updatedAt: number;
}

export interface PriceHistory {
  date: number;
  price: number;
}

export interface IngredientPrice {
  name: string;
  price: number; // per unit
  unit: string;
  lastUpdated: number;
  history?: PriceHistory[];
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  isBought: boolean;
  isManual: boolean;
  estimatedPrice: number;
}

// Storage Keys
const KEYS = {
  RECIPES: 'pk_recipes',
  PRICES: 'pk_prices',
  SHOPPING: 'pk_shopping'
};

// Helper to generate UUID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Data Manager Class
class DataManager {
  // Recipes
  static getRecipes(): Recipe[] {
    const data = localStorage.getItem(KEYS.RECIPES);
    return data ? JSON.parse(data) : [];
  }

  static saveRecipe(recipe: Recipe) {
    const recipes = this.getRecipes();
    const index = recipes.findIndex(r => r.id === recipe.id);
    if (index >= 0) {
      recipes[index] = { ...recipe, updatedAt: Date.now() };
    } else {
      recipe.id = recipe.id || generateId();
      recipe.updatedAt = Date.now();
      recipes.push(recipe);
    }
    localStorage.setItem(KEYS.RECIPES, JSON.stringify(recipes));
    return recipe;
  }

  static deleteRecipe(id: string) {
    const recipes = this.getRecipes().filter(r => r.id !== id);
    localStorage.setItem(KEYS.RECIPES, JSON.stringify(recipes));
  }

  // Prices
  static getPrices(): Record<string, IngredientPrice> {
    const data = localStorage.getItem(KEYS.PRICES);
    return data ? JSON.parse(data) : {};
  }

  static updatePrice(name: string, price: number, unit: string) {
    const prices = this.getPrices();
    const now = Date.now();
    
    // Get existing history or initialize
    const existing = prices[name];
    let history = existing?.history || [];
    
    // Append new history
    history.push({ date: now, price });
    
    // Filter history: Keep only last 120 days
    const cutoff = now - (120 * 24 * 60 * 60 * 1000);
    history = history.filter(h => h.date >= cutoff);
    
    prices[name] = {
      name,
      price,
      unit,
      lastUpdated: now,
      history
    };
    localStorage.setItem(KEYS.PRICES, JSON.stringify(prices));
  }

  static getPrice(name: string): IngredientPrice | undefined {
    return this.getPrices()[name];
  }

  // Shopping List
  static getShoppingList(): ShoppingItem[] {
    const data = localStorage.getItem(KEYS.SHOPPING);
    return data ? JSON.parse(data) : [];
  }

  static saveShoppingList(list: ShoppingItem[]) {
    localStorage.setItem(KEYS.SHOPPING, JSON.stringify(list));
  }
  
  static addToShoppingList(items: ShoppingItem[]) {
    const current = this.getShoppingList();
    // Merge logic could be complex, for now just append or update
    // Simple implementation: Merge by name and unit
    const map = new Map<string, ShoppingItem>();
    
    [...current, ...items].forEach(item => {
      const key = `${item.name}-${item.unit}`;
      if (map.has(key)) {
        const existing = map.get(key)!;
        existing.quantity += item.quantity;
        // Keep existing ID and bought status if existing
      } else {
        map.set(key, { ...item, id: item.id || generateId() });
      }
    });
    
    this.saveShoppingList(Array.from(map.values()));
  }
}

export default DataManager;
