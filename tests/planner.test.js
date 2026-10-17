import assert from "node:assert/strict";
import { test } from "node:test";
import { generatePlan, groceryItems, missingIngredients } from "../js/planner.js";

const pantryOf = (...names) => names.map((name, index) => ({ id: String(index), name }));

const meals = [
  { id: "rice-bowl", name: "Rice bowl", ingredients: ["rice", "eggs"] },
  { id: "tacos", name: "Tacos", ingredients: ["tortillas", "cheese", "chicken"] },
  { id: "omelet", name: "Omelet", ingredients: ["eggs"] },
];

test("missingIngredients lists only what the pantry lacks", () => {
  assert.deepEqual(missingIngredients(meals[0], pantryOf("rice")), ["eggs"]);
  assert.deepEqual(missingIngredients(meals[0], pantryOf("rice", "eggs")), []);
});

test("generatePlan ranks meals by fewest missing ingredients", () => {
  const plan = generatePlan(meals, pantryOf("eggs"), () => 0);
  assert.deepEqual(plan.map(entry => entry.mealId), ["omelet", "rice-bowl", "tacos"]);
});

test("generatePlan breaks ties with the random source", () => {
  const draws = [0.9, 0.1];
  const tied = [meals[0], meals[1]].map(meal => ({ ...meal, ingredients: ["x"] }));
  const plan = generatePlan(tied, [], () => draws.shift());
  assert.deepEqual(plan.map(entry => entry.mealId), ["tacos", "rice-bowl"]);
});

test("generatePlan returns at most seven dinners", () => {
  const manyMeals = Array.from({ length: 10 }, (_, index) => ({ id: `m${index}`, name: `M${index}`, ingredients: [] }));
  assert.equal(generatePlan(manyMeals, []).length, 7);
});

test("groceryItems merges missing ingredients across the plan without duplicates, sorted", () => {
  const state = {
    meals,
    pantry: pantryOf("rice"),
    plan: [{ mealId: "rice-bowl" }, { mealId: "omelet" }, { mealId: "tacos" }],
  };
  assert.deepEqual(groceryItems(state), ["cheese", "chicken", "eggs", "tortillas"]);
});

test("groceryItems skips plan entries whose meal no longer exists", () => {
  const state = { meals, pantry: [], plan: [{ mealId: "deleted" }] };
  assert.deepEqual(groceryItems(state), []);
});
