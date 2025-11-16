/** 
 * For a given line from a specific pointer, find correct delimiter.
  * @param {number} pointer // from what position to start scanning
  * @param {string} line // line to scan
  * @returns {number}
*/
function findBoundary(pointer: number, line: string): number{ 
  let nextSpace = line.indexOf(" ", pointer + 1);
  let nextBrace = line.indexOf("{", pointer + 1);
  let nextSigil = line.length;

  pointer++ // skip the first character i.e. the sigil we are at

  while (pointer < line.length) {
    if (['@', '#', '~'].includes(line[pointer])) {
      nextSigil = pointer;
      break;
    }
    pointer++
  }

  // there is a space, but there's also a sigil with its own {}
  // so we need to just return the first space
  // except when there is a space 
  if (nextSpace > 0 && nextSigil < nextBrace) {
    return nextSpace;
  } else if (nextBrace !== -1) {
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

export { findBoundary }