
import { BraceData } from "../../types";

function parseQuantity(raw: string): number | string | null {
  if (raw.includes("/")) {
    const parts = raw.split("/");
    if (parts.length === 2 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1])) && parseFloat(parts[1]) !== 0) {
      return raw;
    }
    return null;
  }
  const n = parseFloat(raw);
  return isNaN(n) ? null : n;
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
    let parsedQuantity = parseQuantity(value[0]);

    if (parsedQuantity === null) {
      throw new Error(`Invalid quantity number at ${open + 1}.`);
    }

    output.quantity = parsedQuantity;

    // check if we have a measure, and save it
    if (value.length === 2) {
      output.measure = value[1];
    }
  }

  return output;
}

export { parseBraces }