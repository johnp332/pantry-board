import { SEED_MEALS } from "./seed-meals.js";

export const SCHEMA_VERSION = 2;

export const newId = () => crypto.randomUUID();

export const normalizeName = text => text.trim().toLowerCase();

const asArray = value => (Array.isArray(value) ? value : []);

export function createEmptyState() {
  return {
    version: SCHEMA_VERSION,
    pantry: [],
    meals: SEED_MEALS.map(meal => ({ ...meal })),
    plan: [],
    checkedGroceries: [],
  };
}

export function migrateFromV1(legacy) {
  const state = createEmptyState();
  const mealIdByName = new Map(state.meals.map(meal => [meal.name, meal.id]));
  state.pantry = asArray(legacy?.pantry).map(name => ({ id: newId(), name }));
  state.plan = asArray(legacy?.plan)
    .filter(name => mealIdByName.has(name))
    .map(name => ({ mealId: mealIdByName.get(name) }));
  state.checkedGroceries = asArray(legacy?.checked);
  return state;
}
