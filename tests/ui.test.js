import assert from "node:assert/strict";
import { test } from "node:test";
import { escapeHtml, recipeLink } from "../js/ui.js";

test("escapeHtml neutralizes markup and quotes", () => {
  assert.equal(escapeHtml(`<b onclick="x">Tom & 'Jerry'</b>`),
    "&lt;b onclick=&quot;x&quot;&gt;Tom &amp; &#39;Jerry&#39;&lt;/b&gt;");
});

test("recipeLink prefers the meal's own url", () => {
  assert.equal(recipeLink({ name: "Chili", url: "https://example.com/chili" }), "https://example.com/chili");
});

test("recipeLink falls back to a search for the meal name", () => {
  assert.equal(recipeLink({ name: "Egg fried rice", url: "" }),
    "https://www.google.com/search?q=Egg%20fried%20rice%20recipe");
});
