// lib/utils.ts
export function getDiffs(
  oldData: Record<string, any>,
  newData: Record<string, any>,
) {

  const diff: Record<string, { old: any; new: any }> = {};
  const changes: Record<string, any> = {};
  for (const key of Object.keys(newData)) {
    const oldVal = oldData[key];
    const newVal = newData[key];
    console.log(key + "-(old)>"+oldVal)
    console.log(key + "-(new)>"+newVal)
    console.log("\n\n\n\n");
   
    const oldNorm =
      oldVal instanceof Date
        ? oldVal.toISOString()
        : Array.isArray(oldVal)
          ? oldVal.join(", ")
          : String(oldVal ?? "");

    const newNorm = String(newVal ?? "");

    if (oldNorm !== newNorm) {
      diff[key] = { old: oldVal, new: newVal };
      changes[key] = newVal;
    }
  }
  console.log("Diff", diff);
  console.log("changes",changes)
  return { changes ,diff };
}

export function normalizeFormData(data: any) {
  return {
    ...data,
    budgetMin: data.budgetMin ? Number(data.budgetMin) : null,
    budgetMax: data.budgetMax ? Number(data.budgetMax) : null,
    bhk: data.bhk === "" ? null : Number(data.bhk),
    tags: typeof data.tags === "string" ? data.tags.split(",") : data.tags,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
  };
}

