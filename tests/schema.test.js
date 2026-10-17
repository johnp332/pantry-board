import assert from "node:assert/strict";
import { test } from "node:test";
import { SCHEMA_VERSION, createEmptyState, migrateFromV1, normalizeName } from "../js/schema.js";

test("createEmptyState starts with seed meals and nothing else", () => {
  const state = createEmptyState();
  assert.equal(state.version, SCHEMA_VERSION);
  assert.equal(state.meals.length, 10);
  assert.deepEqual([state.pantry, state.plan, state.checkedGroceries], [[], [], []]);
});

test("createEmptyState gives each call its own meals", () => {
  const first = createEmptyState();
  first.meals[0].name = "changed";
  assert.notEqual(createEmptyState().meals[0].name, "changed");
});

test("migrateFromV1 turns pantry strings into items with ids", () => {
  const state = migrateFromV1({ pantry: ["rice", "eggs"], plan: [], checked: [] });
  assert.deepEqual(state.pantry.map(item => item.name), ["rice", "eggs"]);
  assert.equal(new Set(state.pantry.map(item => item.id)).size, 2);
});

test("migrateFromV1 maps plan names to meal ids and drops unknown names", () => {
  const state = migrateFromV1({ pantry: [], plan: ["Chili", "Not a real meal", "Egg fried rice"], checked: [] });
  assert.deepEqual(state.plan, [{ mealId: "chili" }, { mealId: "egg-fried-rice" }]);
});

test("migrateFromV1 keeps checked groceries", () => {
  assert.deepEqual(migrateFromV1({ checked: ["eggs"] }).checkedGroceries, ["eggs"]);
});

test("migrateFromV1 tolerates missing or malformed fields", () => {
  const state = migrateFromV1({ pantry: "oops", plan: null });
  assert.deepEqual([state.pantry, state.plan, state.checkedGroceries], [[], [], []]);
  assert.equal(migrateFromV1(null).version, SCHEMA_VERSION);
});

test("normalizeName trims and lowercases", () => {
  assert.equal(normalizeName("  Ground Beef "), "ground beef");
});
