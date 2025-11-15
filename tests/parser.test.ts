import { describe, expect, test } from "@jest/globals";
import { Parser } from "../app";
import { Section } from "../types";

describe("split lines", () => {
  test("should save a split line as a single instruction sentence", () => {
    const recipe = `
    Crack fresh eggs on a
    cast iron skillet with hot oil
    for a minute or two.
    `
    expect(Parser(recipe).instructions[0]).toBe("Crack fresh eggs on a cast iron skillet with hot oil for a minute or two.");
  })

  test("should split lines without leading space", () => {
    const recipe = ` 
    Add eggs to a frying pan on low heat.
    `
    expect(Parser(recipe).instructions[0]).toBe("Add eggs to a frying pan on low heat.");
  })

  test("should handle multiple instruction lines", () => {
    const recipe = `
    Add eggs to a frying pan on low heat.

    Cook for a minute or two.

    Serve with toast.
    `

    let result = Parser(recipe);

    expect(result.instructions.length).toBe(3);
    expect(result.instructions[0]).toBe("Add eggs to a frying pan on low heat.");
    expect(result.instructions[1]).toBe("Cook for a minute or two.");
    expect(result.instructions[2]).toBe("Serve with toast.");
  })
})

describe("parse sections", () => {
  test("should write sections to object", () => {
    const recipe =
    `>> Dough

    Mix flour, eggs and salt into a bowl.

    Knead for 10 minutes.

    Let it rest.
    
    >> Filling

    Cook onions and garlic in a frying pan.

    Add ground beef.

    Season with salt, cumin and oregano.
    `

    let result = Parser(recipe);
    let sections = result.sections as Section[];
    
    expect(Array.isArray(sections)).toBe(true);
    expect(sections?.length).toBe(2);
    expect(sections[0].name).toBe("Dough");
    expect(sections[1].name).toBe("Filling");
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