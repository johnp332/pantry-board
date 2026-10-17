import { SCHEMA_VERSION, createEmptyState, migrateFromV1 } from "./schema.js";

const STATE_KEY = "pantryBoard.state";
const LEGACY_KEY = "pantryBoard.v1";

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

export async function load() {
  const saved = readJson(STATE_KEY);
  if (saved?.version === SCHEMA_VERSION) return saved;

  const legacy = readJson(LEGACY_KEY);
  const state = legacy ? migrateFromV1(legacy) : createEmptyState();
  await save(state);
  return state;
}

export async function save(state) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}
