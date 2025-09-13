import z, { property } from 'zod';

export const buyerLeadSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters long' }).max(80, { message: 'Full name must be at most 80 characters long' }),
  email: z.email({ message: 'Invalid email address' }).optional(),
  phone: z.string().regex(/^\d{10,15}$/, "Phone must be numeric and 10–15 digits"),
  city: z.enum(['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other']),
  propertyType: z.enum(['Apartment', 'Office', 'Villa', 'Plot', 'Retail']),
  bhk: z.enum(['One', 'Two', 'Three', 'Four', 'Studio']).optional(),
  purpose: z.enum(['Buy', 'Rent']),
  budgetMin: z.number().int().nonnegative().optional(),
  budgetMax: z.number().int().nonnegative().optional(),
  timeline: z.enum(["ZERO_TO_THREE", "THREE_TO_SIX", "MORE_THAN_SIX", "EXPLORING"]),
  source: z.enum(['Website','Referral','WalkIn','Call','Other']),
  notes: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
})

export const buyerSchemaWithRefinements = buyerLeadSchema.superRefine((data, ctx) => {
  if (data.budgetMin !== undefined && data.budgetMax !== undefined) {
    if (data.budgetMax < data.budgetMin) {
      ctx.addIssue({
        path: ["budgetMax"],
        message: "Budget max must be greater than or equal to budget min",
        code: z.ZodIssueCode.custom,
      });
    }
  }

  if (["Apartment", "Villa"].includes(data.propertyType) && !data.bhk) {
    ctx.addIssue({
      path: ["bhk"],
      message: "BHK is required for Apartment or Villa",
      code: z.ZodIssueCode.custom,
    });
  }
});

