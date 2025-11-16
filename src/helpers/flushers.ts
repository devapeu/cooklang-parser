import { Section } from "../../types";

/**
 * Pushes a Section object into a Section array.
 * @param temp
 * @param array 
 */
function flushSection(temp: Section | null, array: Section[]): void {
  if (temp !== null) array.push(temp);
}

/**
 * Checks if a instruction exists, then, whether to push it to an ongoing section or the base ingredient list.
 * @param tempInstruction 
 * @param tempSection 
 * @param ingredients 
 */
function flushInstruction(tempInstruction: string, tempSection: Section | null, ingredients: string[]): void {
  if (!tempInstruction) return;

  if (tempSection) tempSection.instructions.push(tempInstruction);
  else ingredients.push(tempInstruction);
}

export { flushSection, flushInstruction }