import { Ingredient } from "../../types";

/**
 * Formats an ingredient to a readable string of text
 * @param {Ingredient} i
 * @returns {string}
 */
function formatIngredient(i: Ingredient, ingredientTag?: string): string {
  // format ingredient instruction into recipe wording
  let output = "";
  if (i.measure !== null) {
    output = `${i.quantity} ${i.measure} of ${i.name}`;
  } else if (i.quantity !== null) {
    output = `${i.quantity} ${i.name}`;
  } else {
    output = i.name + " ";
  }

  if (typeof ingredientTag !== 'undefined') output = `<${ingredientTag}>${output}</${ingredientTag}>`

  return output;
}

export { formatIngredient }