
export function validateBudget(min: number, max: number) {
  if (min < 0 || max < 0) return false;
  if (min > max) return false;
  return true;
}


 
