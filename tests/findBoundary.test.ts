import { describe, expect, test } from "@jest/globals";
import { findBoundary } from "../app";

describe('findBoundary', () => {
  test('reads line until end of string', () => {
    let line = "@salt";
    expect(findBoundary(1, line)).toBe(5);
  });

  test('reads line until {', () => {
    let line = "@milk{5%cups}";
    expect(findBoundary(1, line)).toBe(5);
  })

  test('reads line until space', () => {
    let line = "@salt into the mix."
    expect(findBoundary(1, line)).toBe(5);
  });

  test('reads line until next { when both a space and {} are present', () => {
    let line = "@green onions{1%bunch}";
    expect(findBoundary(1, line)).toBe(13);
  });

    test('reads first match only', () => {
    let line = "@salt with @onions{3}";
    expect(findBoundary(1, line)).toBe(5);
  })

  test('reads first match only with quantity', () => {
    let line = "@onions{3} and @garlic{2%cloves}";
    expect(findBoundary(1, line)).toBe(7);
  })

  test('reads first match only with quantity, when it has spaces', () => {
    let line = "@green onions{3} and @garlic{2%cloves}";
    expect(findBoundary(1, line)).toBe(7);
  })
})
