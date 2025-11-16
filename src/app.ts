import { Recipe, Ingredient, Section } from "../types";
import { findValues } from "./helpers/findValues";
import { formatIngredient } from "./helpers/formatIngredient";

function Parser(recipe: string): Recipe {
  let sections : Section[] = [];

  let ingredients: Ingredient[] = [];
  let utensils: string[] = [];
  let instructions: string[] = [];

  const lines: string[] = recipe.split("\n").map(l => l.trim());

  let tempMeta = null;
  let tempSection : Section | null = null;
  let tempInstruction: string = "";

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let chunk = line.slice(0, 3);

    if (chunk === "-- ") { // this is a comment so we skip it
      continue; 
    } else if (chunk === "---") { // this is the metadata block
      // TODO add meta data logic
    } else if (chunk[0] === "=") { // this is a section

      // if there is a section and we hit another one, push it
      if (tempSection !== null) {
        sections.push(tempSection);
      }

      // initialize section
      tempSection = { 
        name: line.replace(/=/g, '').trim(), 
        instructions: [], 
        ingredients: [],
        utensils: [],
      };

    } else if (line.trim() === "") { // this is an empty line, so we must push an instruction
      // if we are working with a temp section, push it there instead
      if (tempInstruction !== "") {
        if (tempSection !== null) tempSection.instructions.push(tempInstruction);
        else instructions.push(tempInstruction);
        tempInstruction = ""
      }

    } else {
      // we must check what ingredients, utensils or times are in this line
      // push them to the recipe and also format them nicely

      let pointer = 0;
      let formattedInstruction = "";

      // read every character in this line
      while (pointer < line.length) {
        // set easy name for this character
        let ch = line[pointer];

        // inline comment, quit parsing this line
        if (ch === "-" && line[pointer + 1] === "-") {
          break;
        }

        if (['@', '#', '~'].includes(ch)) {
          // read until a " " or a "{" is hit
          // if we found  " ", then we got all we need
          // if we found "{", then we need to look for the next "}"

          let [data, boundary] = findValues(pointer, line);

          // check for sigils
          if (ch === "@") {            
            // format readable ingredient string
            formattedInstruction += formatIngredient(data);

            // Configure ingredient object to pass to either section, if applicable, or recipe root 
            let newIngredient: Ingredient = { ...data }
            if (tempSection !== null) tempSection.ingredients.push(newIngredient);
            else ingredients.push(newIngredient);
            
          } else if (ch === "#") {
            formattedInstruction += data.name;

            if (tempSection !== null) tempSection.utensils.push(data.name);
            else utensils.push(data.name);

          } else if (ch === "~") {
            if (data.measure !== null) {
              formattedInstruction += `${data.quantity} ${data.measure}`
            }
          }

          pointer = boundary + 1;
          
        } else {
          // add characters to the instruction
          formattedInstruction += ch;
          // move pointer forward
          pointer++
        }

      }

      // add formatted instruction to temp instruction value
      // if the instruction has some text already, add space inbetween to prevent joint words
      tempInstruction += (tempInstruction.length > 0 ? " " : "") + formattedInstruction;
    }
  }

  // flush last instruction we had in memory
  if (tempInstruction !== "") {
    if (tempSection !== null) tempSection.instructions.push(tempInstruction);
    else instructions.push(tempInstruction);
    tempInstruction = ""
  }

  // flush last section left in memory
  if (tempSection !== null) sections.push(tempSection);

  return {
    meta: {},
    ingredients,
    instructions,
    sections,
    utensils,
  };
}

export { Parser }