
import { validateBudget } from "../lib/validators";

describe("validateBudget", () => {
  it("returns true for valid budgets", () => {
    expect(validateBudget(1000, 5000)).toBe(true);
  });

  it("returns false if min > max", () => {
    expect(validateBudget(5000, 1000)).toBe(false);
  });

  it("returns false if negative numbers", () => {
    expect(validateBudget(-100, 1000)).toBe(false);
  });
});
