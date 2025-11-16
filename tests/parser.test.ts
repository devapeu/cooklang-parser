import { describe, expect, test } from "@jest/globals";
import { Parser } from "../app";
import { Ingredient, Section } from "../types";

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
    // Section titles only need == at the beginning, per the Cooklang spec
    // == at the end of the section name is purely visual and should be ignored
    const recipe =
    `== Dough ==

    Mix flour, eggs and salt into a bowl.

    Knead for 10 minutes.

    Let it rest.
    
    = Filling

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

  test("should parse ingredients data in sections", () => {
    const recipe =`
    == Filling
    Mix and knead @flour{2%cups}, @eggs{2} and @butter in a bowl.
    `

    let result: any = Parser(recipe);
    let ingredients = result.sections[0].ingredients;

    expect(ingredients[0].name).toBe("flour");
    expect(ingredients[0].quantity).toBe(2);
    expect(ingredients[0].measure).toBe("cups");

    expect(ingredients[1].name).toBe("eggs");
    expect(ingredients[1].quantity).toBe(2);
    expect(ingredients[1].measure).toBeNull();

    expect(ingredients[2].name).toBe("butter");
    expect(ingredients[2].quantity).toBeNull();
    expect(ingredients[2].measure).toBeNull();
  })

  
  test("should include ingredients in sections", () => {
    const recipe = `
    == Dough
    Mix and knead @flour{4%cups} and @butter{90%grams} in a bowl.

    Let it rest in the fridge for 1 hour.

    == Filling
    Fry @ground beef{500%grams} in hot @oil.

    Chop and add @onions{2}, cook until translucent.`

    let result = Parser(recipe);

    let sections = result.sections as Section[];
    
    expect(sections[0].ingredients.length).toBe(2);
    expect(sections[1].ingredients.length).toBe(3);
  });
})

describe("parse ingredients", () => {
  test("should include ingredients", () => {
    const recipe = `Pour @oil in a frying pan, then add @eggs{2}.`

    let result = Parser(recipe);
    expect(result.ingredients.length).toBe(2);
  })

  test("should include notes", () => {
    const recipe = `Add @green onions{2%stalks}(chopped and diced)`;
    expect(Parser(recipe).ingredients[0].note).toBe("chopped and diced");
  });
})

describe("ignore comments", () => {
  test('should skip lines that start with --', () => {
    const recipe = 
    `-- Should try scrambled egg another time.
    Add eggs to a frying pan on low heat.`;

    expect(Parser(recipe).instructions[0]).toBe("Add eggs to a frying pan on low heat.")

  })
})