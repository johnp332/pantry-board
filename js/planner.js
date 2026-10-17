const DINNERS_PER_WEEK = 7;

export const findMeal = (meals, mealId) => meals.find(meal => meal.id === mealId);

export function missingIngredients(meal, pantry) {
  const owned = new Set(pantry.map(item => item.name));
  return meal.ingredients.filter(ingredient => !owned.has(ingredient));
}

export function generatePlan(meals, pantry, random = Math.random) {
  return meals
    .map(meal => ({ meal, missingCount: missingIngredients(meal, pantry).length, tiebreaker: random() }))
    .sort((a, b) => a.missingCount - b.missingCount || a.tiebreaker - b.tiebreaker)
    .slice(0, DINNERS_PER_WEEK)
    .map(({ meal }) => ({ mealId: meal.id }));
}

export function groceryItems({ plan, meals, pantry }) {
  const needed = new Set();
  for (const { mealId } of plan) {
    const meal = findMeal(meals, mealId);
    if (meal) missingIngredients(meal, pantry).forEach(ingredient => needed.add(ingredient));
  }
  return [...needed].sort();
}
