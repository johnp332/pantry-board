import { generatePlan } from "./planner.js";
import { newId, normalizeName } from "./schema.js";
import { load, save } from "./storage.js";
import { render } from "./ui.js";

const byId = id => document.getElementById(id);
const state = await load();

async function commit() {
  await save(state);
  render(state);
}

function showTab(tabName) {
  document.querySelectorAll("nav button").forEach(button =>
    button.classList.toggle("active", button.dataset.tab === tabName));
  document.querySelectorAll("main section").forEach(section => {
    section.hidden = section.id !== tabName;
  });
}

function addPantryItem(rawName) {
  const name = normalizeName(rawName);
  if (!name || state.pantry.some(item => item.name === name)) return;
  state.pantry.push({ id: newId(), name });
  state.pantry.sort((a, b) => a.name.localeCompare(b.name));
}

document.querySelector("nav").addEventListener("click", event => {
  const tabName = event.target.dataset.tab;
  if (tabName) showTab(tabName);
});

byId("generate").onclick = () => {
  state.plan = generatePlan(state.meals, state.pantry);
  state.checkedGroceries = [];
  commit();
};

byId("pantryForm").onsubmit = event => {
  event.preventDefault();
  addPantryItem(byId("pantryInput").value);
  byId("pantryInput").value = "";
  commit();
};

byId("pantryList").onclick = event => {
  const itemId = event.target.dataset.removeId;
  if (!itemId) return;
  state.pantry = state.pantry.filter(item => item.id !== itemId);
  commit();
};

byId("groceryList").onchange = event => {
  const name = event.target.dataset.groceryName;
  if (!name) return;
  state.checkedGroceries = event.target.checked
    ? [...state.checkedGroceries, name]
    : state.checkedGroceries.filter(checkedName => checkedName !== name);
  save(state);
};

render(state);
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
