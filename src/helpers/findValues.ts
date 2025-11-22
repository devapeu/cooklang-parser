
import { Ingredient } from "../../types";
import { findBoundary } from "./findBoundary";
import { parseBraces } from "./parseBraces";

function findValues(pointer: number, line: string): [Ingredient, number] {
  let name: string;
  let quantity: number | null = null;
  let measure: string | null = null;
  let note: string | null = null;
  let optional: boolean = false;

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
    // extract name from inbetween the sigil and the boundary
    name = line.substring(pointer + 1, boundary);
    // set the boundary to the next position of the closing brace
    boundary = line.indexOf("}", nextBrace + 1);
  } else {
    // grab the name too but without changing the boundary
    name = line.substring(pointer + 1, boundary);
  }

  if (name[0] === "*") {
    optional = true;
    name = name.slice(1)
  }

  let openingParentheses = line.indexOf("(", boundary);
  let closingParentheses = line.indexOf(")", openingParentheses);

  if (openingParentheses === boundary + 1 && closingParentheses > 0) {
    note = line.substring(openingParentheses + 1, closingParentheses);
    boundary = closingParentheses;
  }


  return [{ name, quantity, measure, note, optional }, boundary]
}

export { findValues }