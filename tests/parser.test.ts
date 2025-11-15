import { describe, expect, test } from "@jest/globals";
import { Parser } from "../app";

describe("split lines", () => {
  // test("should umm", () => {
  //   
  // })

  test("should split lines without leading space", () => {
    const recipe = ` 
    Add eggs to a frying pan on low heat.
    `

    let result = Parser(recipe);
    console.log(result);

    expect(result.instructions[0]).toBe("Add eggs to a frying pan on low heat.");
  })
})

describe("ignore comments", () => {
  test('should skip lines that start with --', () => {
    const recipe = 
    `-- Should try scrambled egg another time.
    Add eggs to a frying pan on low heat.`;

    let result = Parser(recipe);

    //console.log(result);

    expect(result.instructions[0]).toBe("Add eggs to a frying pan on low heat.")

  })
})