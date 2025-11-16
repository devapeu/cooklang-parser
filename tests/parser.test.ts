import { describe, expect, test } from "@jest/globals";
import { Parser } from "../src";
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
    // Section titles only need = at the beginning, per the Cooklang spec
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

  test("should not skip ahead when () are present", () => {
    const recipe = `Add @salt{1%tsp} to the boiling water (just a little bit).`;
    let result = Parser(recipe);
    expect(result.ingredients[0].note).toBeNull();
    expect(result.instructions[0]).toBe("Add 1 tsp of salt to the boiling water (just a little bit).")
  });
})

describe("ignore comments", () => {
  test('should skip lines that start with --', () => {
    const recipe = 
    `-- Should try scrambled egg another time.
    Add eggs to a frying pan on low heat.`;

    expect(Parser(recipe).instructions[0]).toBe("Add eggs to a frying pan on low heat.")

  })

  test('should skip rest of line with comment', () => {
    const recipe = `Add eggs to a frying pan on low heat. -- Or was it high heat?`
    expect(Parser(recipe).instructions[0]).toBe("Add eggs to a frying pan on low heat. ")
  });
})

describe("general recipe check", () => {
  test('should parse the standard example', () => {
    const recipe = `
      Crack the @eggs{3}(any type) into a blender, then add the @flour{125%g},
      @milk{250%ml} and @sea salt{1%pinch}, and blitz until smooth.

      Pour into a #bowl and leave to stand for ~{15%minutes}.

      Melt the @butter in a #large non-stick frying pan{} on
      a medium heat, then tilt the pan so the butter coats the surface.

      Pour in 1 ladle of batter and tilt again, so that the batter
      spreads all over the base, then cook for 1 to 2 minutes,
      or until it starts to come away from the sides.

      Once golden underneath, flip the pancake over and cook for 1 further
      minute, or until cooked through.

      Serve straightaway with your favourite topping. -- Add your favorite
      -- topping here to make sure it's included in your meal plan!
    `

    let result = Parser(recipe);

    expect(result.ingredients[0].name).toBe("eggs");
    expect(result.ingredients[0].quantity).toBe(3);
    expect(result.ingredients[0].measure).toBeNull();
    expect(result.ingredients[0].note).toBe("any type");

    expect(result.ingredients[1].name).toBe("flour");
    expect(result.ingredients[1].quantity).toBe(125);
    expect(result.ingredients[1].measure).toBe("g");

    expect(result.instructions[0]).toBe("Crack the 3 eggs into a blender, then add the 125 g of flour, 250 ml of milk and 1 pinch of sea salt, and blitz until smooth.")

    expect(result.utensils[0]).toBe("bowl");
    expect(result.utensils[1]).toBe("large non-stick frying pan");
  })
});