import { Ingredient } from "../../types";

/**
 * Formats an ingredient to a readable string of text
 * @param {Ingredient} i
 * @returns {string}
 */
function formatIngredient(i: Ingredient): string {
  // format ingredient instruction into recipe wording
  if (i.measure !== null) {
    return `${i.quantity} ${i.measure} of ${i.name}`;
  } else if (i.quantity !== null) {
    return `${i.quantity} ${i.name}`;
  }
  return i.name + " ";
}

export { formatIngredient }