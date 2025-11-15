
type Ingredient = {
  name: string,
  measure: string | null,
  quantity: number | null,
}

type Recipe = {
  ingredients: Ingredient[],
  instructions: string[],
  utensils: string[],
  sections: Section[] | null,
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

export {
  Ingredient,
  Recipe,
  Section,
  BraceData
}