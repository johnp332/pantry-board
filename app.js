// Pantry Board — vanilla JS, no build step. Data lives in localStorage on the device.

// ---- Seed recipes (edit/extend; add real links in `url`) ----
const RECIPES = [
  { name: "One-skillet creamy beef & veggie pasta", ingredients: ["ground beef", "pasta", "mixed vegetables", "cream cheese", "broth"], url: "" },
  { name: "Rice cooker pilaf with chicken", ingredients: ["rice", "chicken", "onion", "broth"], url: "" },
  { name: "Sheet-pan sausage & potatoes", ingredients: ["sausage", "potatoes", "onion"], url: "" },
  { name: "Black bean quesadillas", ingredients: ["tortillas", "black beans", "cheese"], url: "" },
  { name: "Egg fried rice", ingredients: ["rice", "eggs", "mixed vegetables", "soy sauce"], url: "" },
  { name: "Spaghetti with meat sauce", ingredients: ["pasta", "ground beef", "tomato sauce"], url: "" },
  { name: "Chicken tacos", ingredients: ["chicken", "tortillas", "cheese", "salsa"], url: "" },
  { name: "Veggie omelet & toast", ingredients: ["eggs", "bread", "cheese", "mixed vegetables"], url: "" },
  { name: "Tuna pasta salad", ingredients: ["pasta", "tuna", "mayo", "onion"], url: "" },
  { name: "Chili", ingredients: ["ground beef", "kidney beans", "tomato sauce", "onion"], url: "" },
];

// ---- Storage ----
const KEY = "pantryBoard.v1";
const state = load();
function load() {
  try { return Object.assign({ pantry: [], plan: [], checked: [] }, JSON.parse(localStorage.getItem(KEY))); }
  catch { return { pantry: [], plan: [], checked: [] }; }
}
function save() { localStorage.setItem(KEY, JSON.stringify(state)); }

// ---- Logic ----
const norm = s => s.trim().toLowerCase();
function missing(recipe) { return recipe.ingredients.filter(i => !state.pantry.includes(i)); }

function generatePlan() {
  // Rank by fewest missing ingredients, shuffle ties, take 7.
  const ranked = RECIPES.map(r => ({ r, m: missing(r).length, k: Math.random() }))
    .sort((a, b) => a.m - b.m || a.k - b.k)
    .slice(0, 7).map(x => x.r.name);
  state.plan = ranked; state.checked = []; save(); render();
}

function groceryItems() {
  const set = new Set();
  state.plan.forEach(n => missing(RECIPES.find(r => r.name === n) || { ingredients: [] }).forEach(i => set.add(i)));
  return [...set].sort();
}

// ---- Render ----
const $ = id => document.getElementById(id);
function render() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  $("planList").innerHTML = state.plan.map((n, i) => {
    const r = RECIPES.find(x => x.name === n); if (!r) return "";
    const link = r.url || "https://www.google.com/search?q=" + encodeURIComponent(r.name + " recipe");
    const m = missing(r);
    return `<li><strong>${days[i]}</strong> — ${r.name}<br>
      <small>${m.length ? "Need: " + m.join(", ") : "Have everything"}</small><br>
      <a href="${link}" target="_blank" rel="noopener">Recipe</a></li>`;
  }).join("") || `<li class="muted">No plan yet. Add pantry items, then generate.</li>`;

  $("pantryList").innerHTML = state.pantry.map(p =>
    `<li>${p}<button data-del="${p}" aria-label="Remove ${p}">×</button></li>`).join("");

  $("groceryList").innerHTML = groceryItems().map(g =>
    `<li><label><input type="checkbox" data-chk="${g}" ${state.checked.includes(g) ? "checked" : ""}><span>${g}</span></label></li>`).join("")
    || `<li class="muted">Nothing needed.</li>`;
}

// ---- Events ----
document.querySelector("nav").addEventListener("click", e => {
  const t = e.target.dataset.tab; if (!t) return;
  document.querySelectorAll("nav button").forEach(b => b.classList.toggle("active", b.dataset.tab === t));
  document.querySelectorAll("main section").forEach(s => s.hidden = s.id !== t);
});
$("generate").onclick = generatePlan;
$("pantryForm").onsubmit = e => {
  e.preventDefault();
  const v = norm($("pantryInput").value);
  if (v && !state.pantry.includes(v)) { state.pantry.push(v); state.pantry.sort(); save(); render(); }
  $("pantryInput").value = "";
};
$("pantryList").onclick = e => {
  const d = e.target.dataset.del; if (!d) return;
  state.pantry = state.pantry.filter(p => p !== d); save(); render();
};
$("groceryList").onchange = e => {
  const c = e.target.dataset.chk; if (!c) return;
  state.checked = e.target.checked ? [...state.checked, c] : state.checked.filter(x => x !== c);
  save();
};

render();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
