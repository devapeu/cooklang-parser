// Tokenizer

type Ingredient = {
  name: string,
  measure: string | null,
  quantity: number | null,
}

type Instruction = {
  content: string,
}

type Recipe = {
  ingredients: Ingredient[],
  instructions: string[],
}

type Section = {
  name: string,
  ingredients: Ingredient[],
  instructions: string[],
  utensils: string[],
}

type BraceData = {
  quantity: number | null,
  measure: string | null,
}

/** 
 * For a given line from a specific pointer, find correct delimiter.
  * @param {number} pointer // from what position to start scanning
  * @param {string} line // line to scan
  * @returns {number}
*/
function findBoundary(pointer: number, line: string): number{ 
  let nextSpace = line.indexOf(" ", pointer + 1);
  let nextBrace = line.indexOf("{", pointer + 1);

  if (nextBrace !== -1) {
    // brace exists: stop at brace
    return nextBrace;
  } else if (nextSpace !== -1) {
    // no brace, single-word name
    return nextSpace;
  } else {
    // no matches, so boundry is at end of line
    return line.length;
  }
}

/**
 * For a given line with an opening brace,
 * finds matching pair and parses contents into measure and quantity.
 * @param {number} nextBrace 
 * @param {string} line 
 * @returns {BraceData | null}
 */
function parseBraces(nextBrace: number, line:string) : BraceData | null {
  // deifne output object
  let output: BraceData = { quantity: null, measure: null };
  // save index for opening and closing brace
  let open = nextBrace;
  let close = line.indexOf("}", open + 1);

  // should check somwhere there's a matching pair at all!
  if (close === -1) return null;

  // otherwise, split this string by the "%" symbol
  let value = line.substring(open + 1, close).split("%");

  if (value.length > 2) {
    // invalid brace data like {2%cups%small}
    throw new Error(`Too many arguments at ${open + 1}}.`);
  } else if (value.length === 1 && value[0] === "") {
    // not an error
    // braces are empty, so its just a delimiter
    // e.g. @olive oil{}
    return output;
  } else {
    let parsedQuantity = parseInt(value[0]);

    // throw an error if the first value is not a number
    // could have passed something like {three%cups}
    if (isNaN(parsedQuantity)) {
      throw new Error(`Invalid quantity number at ${open + 1}.`);
    }

    // if it passed, set the quantity
    output.quantity = parsedQuantity;

    // check if we have a measure, and save it
    if (value.length === 2) {
      output.measure = value[1];
    }
  }

  return output;
}

function Parser(recipe: string): Recipe {
  let pointer = 0;
  let sections = [];
  let atLineStart = false;

  let ingredients = [];
  let utensils = [];
  let instructions = [];
  let time = 0;

  const lines: string[] = recipe.split("\n");

  let tempMeta = null;
  let tempSection : Section | null = null;
  let tempInstruction: string = "";

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    let chunk = line.slice(0, 3);

    if (chunk === "-- ") {
      continue; // this is a comment so we skip it
    } else if (chunk === "---") {
      // this is the metadata block
    } else if (chunk === ">> ") {

      // if there is a section and we hit another one, push it
      if (tempSection !== null) {
        sections.push(tempSection);
      }
      // initialize section
      tempSection = { 
        name: line.substring(0, line.length), 
        instructions: [], 
        ingredients: [],
        utensils: [],
      };

    } else if (line.trim() === "") {
      // this is an empty line, so we must push an instruction

      // if we are working with a temp section, push it there instead
      if (tempSection !== null) tempSection.instructions.push(tempInstruction);
      else instructions.push(tempInstruction);

      tempInstruction = ""
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

          let name: string;
          let quantity: number | null = null;
          let measure: string | null = null;

          // find "{" or " " to know where the ingredient name ends
          let boundary = findBoundary(pointer, line);
          // also check again for "{" to see if the brace is the delimiter
          let nextBrace = line.indexOf("{", pointer + 1);

          // if the brace is indeed the delimiter, then we need to find the matching pair
          if (boundary === nextBrace) {
            let braceContents = parseBraces(nextBrace, line);

            if (braceContents !== null) {
              quantity = braceContents.quantity;
              measure = braceContents.measure;
            }
          }

          // extract name from inbetween the sigil and the boundary
          name = line.substring(pointer + 1, boundary);

          // set boundary to the position of the closing brace
          boundary = line.indexOf("}", nextBrace + 1);

          // check for sigils
          if (ch === "@") {            
            // format ingredient instruction into recipe wording
            let ingredientString = '';

            if (measure !== null) {
              ingredientString = `${quantity} + ${measure} of ${name}`;
            } else if (quantity !== null) {
              ingredientString = `${quantity} ${name}`;
            } else {
              ingredientString = name;
            }

            formattedInstruction += ingredientString;

            // Configure ingredient object to pass to either section, if applicable, or recipe root 
            let newIngredient: Ingredient = { name, quantity, measure }
            if (tempSection !== null) tempSection.ingredients.push(newIngredient);
            else ingredients.push(newIngredient);
            
          } else if (ch === "#") {
            if (tempSection !== null) tempSection.utensils.push(name);
            else utensils.push(name);

          } else if (ch === "~") {
            // idk what to do here lol
          }

          pointer = boundary + 1;
          
        } else {
          // add characters to the instruction
          formattedInstruction += ch;
          // move pointer forward
          pointer++
        }

      }
      
      tempInstruction += " " + formattedInstruction;
    }
  }

  return {
    ingredients,
    instructions,
    sections,
  } as Recipe;
}

export { findBoundary, parseBraces, Parser }