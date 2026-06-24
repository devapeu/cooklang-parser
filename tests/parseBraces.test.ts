import { describe, expect, test } from "@jest/globals";
import { parseBraces } from "../src/helpers/parseBraces";

describe('parseBraces', () => {
  test('returns quantity and measure when both are defined', () => {
    let line = "@evaporated milk{2%cups}";
    let nextBrace = 16;

    let result = parseBraces(nextBrace, line);

    expect(result?.quantity).toBe(2);
    expect(result?.measure).toBe("cups")
  })

  test('returns null when brace pair is incomplete', () => {
    let line = "@eggs { and I forgot to close it!"
    let nextBrace = 6;

    expect(parseBraces(nextBrace, line)).toBeNull();
  })

  test('returns quantity only when no measure has been defined', () => {
    let line = "@eggs{2}";
    let nextBrace = 5;

    let result = parseBraces(nextBrace, line);

    expect(result?.quantity).toBe(2);
    expect(result?.measure).toBeNull();
  })

  test('returns null for quantity and measure when braces are empty', () => {
    let line = "@olive oil{}"
    let nextBrace = 10;

    let result = parseBraces(nextBrace, line);

    expect(result?.quantity).toBeNull();
    expect(result?.measure).toBeNull();
  })

  test('returns fraction string and measure for fraction quantity', () => {
    let line = "@water{1/2%liters}";
    let nextBrace = 6;

    let result = parseBraces(nextBrace, line);

    expect(result?.quantity).toBe("1/2");
    expect(result?.measure).toBe("liters");
  })

  test('returns decimal number and measure for decimal quantity', () => {
    let line = "@water{0.5%liters}";
    let nextBrace = 6;

    let result = parseBraces(nextBrace, line);

    expect(result?.quantity).toBe(0.5);
    expect(result?.measure).toBe("liters");
  })
});