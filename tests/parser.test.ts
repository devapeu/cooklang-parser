import { describe, expect, test } from "@jest/globals";
import { Parser } from "../app";

describe("split lines", () => {
  test("should save a split line as a single instruction sentence", () => {
    const recipe = `
    Cook some fresh eggs on
    a cast iron skillet with hot oil
    for a minute or two.
    `
    expect(Parser(recipe).instructions[0]).toBe("Cook some fresh eggs on a cast iron skillet with hot oil for a minute or two.");
  })

  test("should split lines without leading space", () => {
    const recipe = ` 
    Add eggs to a frying pan on low heat.
    `
    expect(Parser(recipe).instructions[0]).toBe("Add eggs to a frying pan on low heat.");
  })
})

describe("ignore comments", () => {
  test('should skip lines that start with --', () => {
    const recipe = 
    `-- Should try scrambled egg another time.
    Add eggs to a frying pan on low heat.`;

    expect(Parser(recipe).instructions[0]).toBe("Add eggs to a frying pan on low heat.")

  })
})