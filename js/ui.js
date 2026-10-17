import { findMeal, groceryItems, missingIngredients } from "./planner.js";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export const escapeHtml = text => String(text).replace(/[&<>"']/g, char => HTML_ESCAPES[char]);

export const recipeLink = meal =>
  meal.url || "https://www.google.com/search?q=" + encodeURIComponent(meal.name + " recipe");

function planItemHtml({ mealId }, dayIndex, state) {
  const meal = findMeal(state.meals, mealId);
  if (!meal) return "";
  const missing = missingIngredients(meal, state.pantry);
  const needText = missing.length ? "Need: " + missing.join(", ") : "Have everything";
  return `<li><strong>${DAY_NAMES[dayIndex]}</strong> — ${escapeHtml(meal.name)}<br>
    <small>${escapeHtml(needText)}</small><br>
    <a href="${escapeHtml(recipeLink(meal))}" target="_blank" rel="noopener">Recipe</a></li>`;
}

function pantryItemHtml({ id, name }) {
  return `<li>${escapeHtml(name)}<button data-remove-id="${escapeHtml(id)}" aria-label="Remove ${escapeHtml(name)}">×</button></li>`;
}

function groceryItemHtml(name, checkedNames) {
  const checked = checkedNames.includes(name) ? "checked" : "";
  return `<li><label><input type="checkbox" data-grocery-name="${escapeHtml(name)}" ${checked}><span>${escapeHtml(name)}</span></label></li>`;
}

export function render(state) {
  const planHtml = state.plan.map((entry, index) => planItemHtml(entry, index, state)).join("");
  document.getElementById("planList").innerHTML =
    planHtml || `<li class="muted">No plan yet. Add pantry items, then generate.</li>`;

  document.getElementById("pantryList").innerHTML = state.pantry.map(pantryItemHtml).join("");

  const groceryHtml = groceryItems(state)
    .map(name => groceryItemHtml(name, state.checkedGroceries))
    .join("");
  document.getElementById("groceryList").innerHTML = groceryHtml || `<li class="muted">Nothing needed.</li>`;
}
