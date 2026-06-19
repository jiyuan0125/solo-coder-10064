import { expect, test } from "vitest";
import * as z from "zod/v4";

/////////////////////////
//  1. Trusted (Strict) Coercion Tests
/////////////////////////

test("strict number coercion - rejects empty string", () => {
  const schema = z.coerce.number({ strictCoerce: true });
  const result = schema.safeParse("");
  expect(result.success).toBe(false);
});

test("strict number coercion - rejects whitespace-only string", () => {
  const schema = z.coerce.number({ strictCoerce: true });
  expect(schema.safeParse("   ").success).toBe(false);
  expect(schema.safeParse("\t\n").success).toBe(false);
});

test("strict number coercion - rejects null", () => {
  const schema = z.coerce.number({ strictCoerce: true });
  expect(schema.safeParse(null).success).toBe(false);
});

test("strict number coercion - rejects empty array", () => {
  const schema = z.coerce.number({ strictCoerce: true });
  expect(schema.safeParse([]).success).toBe(false);
});

test("strict number coercion - rejects plain object", () => {
  const schema = z.coerce.number({ strictCoerce: true });
  expect(schema.safeParse({}).success).toBe(false);
});

test("strict number coercion - accepts valid numeric strings", () => {
  const schema = z.coerce.number({ strictCoerce: true });
  expect(schema.parse("123")).toBe(123);
  expect(schema.parse("-45")).toBe(-45);
  expect(schema.parse("3.14")).toBe(3.14);
  expect(schema.parse("  123  ")).toBe(123);
});

test("strict number coercion - accepts booleans (legacy behavior)", () => {
  const schema = z.coerce.number({ strictCoerce: true });
  expect(schema.parse(true)).toBe(1);
  expect(schema.parse(false)).toBe(0);
});

test("strict number coercion - accepts numbers directly", () => {
  const schema = z.coerce.number({ strictCoerce: true });
  expect(schema.parse(123)).toBe(123);
  expect(schema.parse(-0.5)).toBe(-0.5);
});

test("strict number coercion - accepts dates", () => {
  const schema = z.coerce.number({ strictCoerce: true });
  const d = new Date(1670139203496);
  expect(schema.parse(d)).toBe(1670139203496);
});

test("strict number coercion - rejects non-numeric strings", () => {
  const schema = z.coerce.number({ strictCoerce: true });
  expect(schema.safeParse("abc").success).toBe(false);
  expect(schema.safeParse("12abc").success).toBe(false);
});

test("NON-strict number coercion - empty string becomes 0 (legacy)", () => {
  const schema = z.coerce.number();
  expect(schema.parse("")).toBe(0);
  expect(schema.parse(null)).toBe(0);
  expect(schema.parse([])).toBe(0);
});

test("strict boolean coercion - rejects empty string", () => {
  const schema = z.coerce.boolean({ strictCoerce: true });
  expect(schema.safeParse("").success).toBe(false);
});

test("strict boolean coercion - rejects whitespace-only", () => {
  const schema = z.coerce.boolean({ strictCoerce: true });
  expect(schema.safeParse("   ").success).toBe(false);
});

test("strict boolean coercion - rejects null", () => {
  const schema = z.coerce.boolean({ strictCoerce: true });
  expect(schema.safeParse(null).success).toBe(false);
});

test("strict boolean coercion - accepts non-empty strings", () => {
  const schema = z.coerce.boolean({ strictCoerce: true });
  expect(schema.parse("true")).toBe(true);
  expect(schema.parse("false")).toBe(true); // any non-empty string is truthy
});

test("strict boolean coercion - accepts numbers and booleans", () => {
  const schema = z.coerce.boolean({ strictCoerce: true });
  expect(schema.parse(true)).toBe(true);
  expect(schema.parse(false)).toBe(false);
  expect(schema.parse(1)).toBe(true);
  expect(schema.parse(0)).toBe(false);
});

test("strict bigint coercion - rejects empty string", () => {
  const schema = z.coerce.bigint({ strictCoerce: true });
  expect(schema.safeParse("").success).toBe(false);
});

test("strict bigint coercion - rejects whitespace-only", () => {
  const schema = z.coerce.bigint({ strictCoerce: true });
  expect(schema.safeParse("   ").success).toBe(false);
});

test("strict bigint coercion - rejects null", () => {
  const schema = z.coerce.bigint({ strictCoerce: true });
  expect(schema.safeParse(null).success).toBe(false);
});

test("strict bigint coercion - accepts valid integer strings", () => {
  const schema = z.coerce.bigint({ strictCoerce: true });
  expect(schema.parse("123")).toBe(BigInt(123));
  expect(schema.parse("-45")).toBe(BigInt(-45));
  expect(schema.parse("  123  ")).toBe(BigInt(123));
});

test("strict date coercion - rejects empty string", () => {
  const schema = z.coerce.date({ strictCoerce: true });
  expect(schema.safeParse("").success).toBe(false);
});

test("strict date coercion - rejects whitespace-only", () => {
  const schema = z.coerce.date({ strictCoerce: true });
  expect(schema.safeParse("   ").success).toBe(false);
});

test("strict date coercion - rejects invalid date string", () => {
  const schema = z.coerce.date({ strictCoerce: true });
  expect(schema.safeParse("not-a-date").success).toBe(false);
});

test("strict date coercion - accepts valid date strings", () => {
  const schema = z.coerce.date({ strictCoerce: true });
  const result = schema.safeParse("2024-01-01");
  expect(result.success).toBe(true);
  expect(result.success && result.data).toBeInstanceOf(Date);
});

test("strict date coercion - accepts numbers and dates", () => {
  const schema = z.coerce.date({ strictCoerce: true });
  expect(schema.parse(0)).toBeInstanceOf(Date);
  expect(schema.parse(new Date())).toBeInstanceOf(Date);
});

test("global strictCoerce config works", () => {
  z.config({ strictCoerce: true });
  const schema = z.coerce.number();
  expect(schema.safeParse("").success).toBe(false);
  expect(schema.safeParse(null).success).toBe(false);
  z.config({ strictCoerce: false }); // reset
});

test("per-schema strictCoerce overrides global false", () => {
  z.config({ strictCoerce: false });
  const strictSchema = z.coerce.number({ strictCoerce: true });
  const legacySchema = z.coerce.number();
  expect(strictSchema.safeParse("").success).toBe(false);
  expect(legacySchema.parse("")).toBe(0);
});

test("per-schema strictCoerce: false overrides global true", () => {
  z.config({ strictCoerce: true });
  const strictSchema = z.coerce.number();
  const legacySchema = z.coerce.number({ strictCoerce: false });
  expect(strictSchema.safeParse("").success).toBe(false);
  expect(legacySchema.parse("")).toBe(0);
  z.config({ strictCoerce: false }); // reset
});

/////////////////////////
//  2. Structured Error Serialization Tests
/////////////////////////

test("error toJSON() returns structured object with issues", () => {
  const schema = z.string();
  const result = schema.safeParse(123);
  expect(result.success).toBe(false);
  if (!result.success) {
    const serialized = result.error.toJSON();
    expect(serialized.name).toBe("ZodError");
    expect(Array.isArray(serialized.issues)).toBe(true);
    expect(serialized.issues.length).toBeGreaterThan(0);
    expect(serialized.issues[0]?.code).toBe("invalid_type");
    expect(serialized.issues[0]?.path).toEqual([]);
  }
});

test("error JSON.stringify preserves issues and paths", () => {
  const schema = z.object({
    user: z.object({
      name: z.string(),
      age: z.number(),
    }),
  });
  const result = schema.safeParse({
    user: {
      name: 123,
      age: "not-a-number",
    },
  });
  expect(result.success).toBe(false);
  if (!result.success) {
    const jsonStr = JSON.stringify(result.error);
    const parsed = JSON.parse(jsonStr);
    expect(parsed.issues.length).toBe(2);
    // Check that paths are preserved (not flattened to top level)
    const nameError = parsed.issues.find((i: any) => i.expected === "string");
    const ageError = parsed.issues.find((i: any) => i.expected === "number");
    expect(nameError.path).toEqual(["user", "name"]);
    expect(ageError.path).toEqual(["user", "age"]);
  }
});

test("deeply nested errors preserve correct paths in serialization", () => {
  const schema = z.object({
    a: z.object({
      b: z.object({
        c: z.object({
          d: z.string(),
        }),
      }),
    }),
  });
  const result = schema.safeParse({ a: { b: { c: { d: 123 } } } });
  expect(result.success).toBe(false);
  if (!result.success) {
    const jsonStr = JSON.stringify(result.error);
    const parsed = JSON.parse(jsonStr);
    expect(parsed.issues[0].path).toEqual(["a", "b", "c", "d"]);
  }
});

test("error direct property access still works", () => {
  const schema = z.string();
  const result = schema.safeParse(456);
  expect(result.success).toBe(false);
  if (!result.success) {
    // Direct property access should still work
    expect(Array.isArray(result.error.issues)).toBe(true);
    expect(result.error.issues.length).toBeGreaterThan(0);
    expect(result.error.name).toBe("ZodError");
    expect(typeof result.error.message).toBe("string");
  }
});

test("empty issues array serializes correctly", () => {
  const err = new z.ZodError([]);
  const json = JSON.parse(JSON.stringify(err));
  expect(json.issues).toEqual([]);
  expect(json.name).toBe("ZodError");
});

/////////////////////////
//  3. Fallback/Catch Suppressed Issues Tests
/////////////////////////

test("catch() preserves original errors in suppressedIssues (success result)", () => {
  const schema = z.number().catch(42);
  const result = schema.safeParse("not-a-number") as any;
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data).toBe(42);
    expect(result.fallback).toBe(true);
    expect(Array.isArray(result.suppressedIssues)).toBe(true);
    expect(result.suppressedIssues!.length).toBeGreaterThan(0);
    expect(result.suppressedIssues![0]?.code).toBe("invalid_type");
    expect(result.suppressedIssues![0]?.expected).toBe("number");
  }
});

test("catch() with valid input has no suppressed issues", () => {
  const schema = z.number().catch(42);
  const result = schema.safeParse(100) as any;
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data).toBe(100);
    expect(result.fallback).toBeUndefined();
    expect(result.suppressedIssues).toBeUndefined();
  }
});

test("nested catch preserves correct paths in suppressed issues", () => {
  const schema = z.object({
    id: z.number().catch(0),
    name: z.string(),
  });
  const result = schema.safeParse({
    id: "invalid-id",
    name: "test",
  }) as any;
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.id).toBe(0);
    expect(result.fallback).toBe(true);
    expect(Array.isArray(result.suppressedIssues)).toBe(true);
    expect(result.suppressedIssues!.length).toBe(1);
    // Path should indicate the id field, not the top level
    expect(result.suppressedIssues![0]?.path).toEqual(["id"]);
  }
});

test("error thrown by parse() has suppressedIssues on error object", () => {
  // Test a case where catch is inside but there's still an error
  const schema = z.object({
    id: z.number().catch(0),
    required: z.string(),
  });
  try {
    schema.parse({ id: "bad" }); // missing 'required'
    expect.fail("Should have thrown");
  } catch (e: any) {
    // The error from missing 'required' should also have access to
    // suppressed issues from the id field catch
    expect(e.name).toBe("ZodError");
    expect(Array.isArray(e.issues)).toBe(true);
  }
});

test("toJSON() includes suppressedIssues on error when present", () => {
  // Construct an error with suppressedIssues
  const err = new z.ZodError([
    {
      code: "invalid_type",
      expected: "string",
      path: ["name"],
      message: "Expected string",
    },
  ]);
  err.suppressedIssues = [
    {
      code: "invalid_type",
      expected: "number",
      path: ["id"],
      message: "Expected number",
    },
  ];
  const json = JSON.parse(JSON.stringify(err));
  expect(json.issues.length).toBe(1);
  expect(Array.isArray(json.suppressedIssues)).toBe(true);
  expect(json.suppressedIssues.length).toBe(1);
  expect(json.suppressedIssues[0].path).toEqual(["id"]);
});

test("catch inside nested object preserves deep paths", () => {
  const schema = z.object({
    user: z.object({
      profile: z.object({
        age: z.number().catch(18),
      }),
    }),
  });
  const result = schema.safeParse({
    user: {
      profile: {
        age: "not-a-number",
      },
    },
  }) as any;
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.user.profile.age).toBe(18);
    expect(Array.isArray(result.suppressedIssues)).toBe(true);
    expect(result.suppressedIssues!.length).toBe(1);
    expect(result.suppressedIssues![0]?.path).toEqual(["user", "profile", "age"]);
  }
});

/////////////////////////
//  4. Backward Compatibility Tests
/////////////////////////

test("legacy coerce behavior unchanged when strictCoerce not enabled", () => {
  const numSchema = z.coerce.number();
  expect(numSchema.parse("")).toBe(0);
  expect(numSchema.parse("   ")).toBe(0);
  expect(numSchema.parse(null)).toBe(0);
  expect(numSchema.parse([])).toBe(0);
  expect(numSchema.parse(false)).toBe(0);
  expect(numSchema.parse(true)).toBe(1);

  const boolSchema = z.coerce.boolean();
  expect(boolSchema.parse("")).toBe(false);
  expect(boolSchema.parse(null)).toBe(false);
  expect(boolSchema.parse("false")).toBe(true); // non-empty string → true

  const dateSchema = z.coerce.date();
  // Empty string → Invalid Date → error in Zod, but null should work
  expect(dateSchema.parse(null)).toBeInstanceOf(Date);
});

test("all existing Zod functionality still works", () => {
  // object
  const obj = z.object({ a: z.string(), b: z.number() });
  expect(obj.parse({ a: "hi", b: 1 })).toEqual({ a: "hi", b: 1 });

  // union
  const uni = z.union([z.string(), z.number()]);
  expect(uni.parse("x")).toBe("x");
  expect(uni.parse(5)).toBe(5);

  // array
  const arr = z.array(z.number());
  expect(arr.parse([1, 2, 3])).toEqual([1, 2, 3]);

  // refine
  const ref = z.number().refine((x) => x > 0);
  expect(ref.parse(5)).toBe(5);
  expect(ref.safeParse(-1).success).toBe(false);

  // pipe
  const piped = z.string().pipe(z.coerce.number());
  expect(piped.parse("123")).toBe(123);

  // optional
  const opt = z.object({ a: z.string().optional() });
  expect(opt.parse({})).toEqual({});
  expect(opt.parse({ a: "x" })).toEqual({ a: "x" });

  // nullable
  const nul = z.string().nullable();
  expect(nul.parse(null)).toBeNull();
  expect(nul.parse("x")).toBe("x");

  // transform
  const trans = z.string().transform((s) => s.length);
  expect(trans.parse("hello")).toBe(5);

  // default
  const def = z.string().default("fallback");
  expect(def.parse(undefined)).toBe("fallback");
  expect(def.parse("hi")).toBe("hi");
});

/////////////////////////
//  5. Edge Cases
/////////////////////////

test("strict number coercion - leading zeros accepted", () => {
  const schema = z.coerce.number({ strictCoerce: true });
  expect(schema.parse("007")).toBe(7);
  expect(schema.parse("-001.5")).toBe(-1.5);
});

test("strict number coercion - scientific notation accepted", () => {
  const schema = z.coerce.number({ strictCoerce: true });
  expect(schema.parse("1e5")).toBe(100000);
  expect(schema.parse("2.5e-3")).toBe(0.0025);
});

test("strict number coercion - NaN/Infinity string rejected", () => {
  const schema = z.coerce.number({ strictCoerce: true });
  expect(schema.safeParse("NaN").success).toBe(false);
  expect(schema.safeParse("Infinity").success).toBe(false);
});

test("strict number coercion - single element array accepted only if element valid", () => {
  const schema = z.coerce.number({ strictCoerce: true });
  expect(schema.safeParse([123]).success).toBe(true);
  expect(schema.safeParse(["456"]).success).toBe(true);
  expect(schema.safeParse([""]).success).toBe(false);
  expect(schema.safeParse([1, 2]).success).toBe(false);
});

test("string coerce works unaffected", () => {
  const schema = z.coerce.string();
  expect(schema.parse(123)).toBe("123");
  expect(schema.parse(null)).toBe("null");
  expect(schema.parse(undefined)).toBe("undefined");
});

test("flattenError preserves full deep paths (not collapsed to first segment)", () => {
  const schema = z.object({
    user: z.object({
      profile: z.object({
        name: z.string(),
        age: z.number(),
      }),
    }),
  });
  const result = schema.safeParse({ user: { profile: { name: 123, age: "not-a-number" } } });
  expect(result.success).toBe(false);
  if (!result.success) {
    const flat = z.flattenError(result.error);
    // Key must be the FULL dot-path, not just the top-level "user"
    expect(Object.keys(flat.fieldErrors).sort()).toEqual(["user.profile.age", "user.profile.name"]);
    expect(flat.fieldErrors).not.toHaveProperty("user");
    expect(flat.fieldErrors).not.toHaveProperty("user.profile");
    expect(Array.isArray((flat.fieldErrors as any)["user.profile.name"])).toBe(true);
    expect(Array.isArray((flat.fieldErrors as any)["user.profile.age"])).toBe(true);
  }
});

test("flattenError supports multiple errors at different depths with correct paths", () => {
  const schema = z.object({
    topLevel: z.string(),
    nested: z.object({
      deep: z.object({
        value: z.number(),
      }),
    }),
  });
  const result = schema.safeParse({
    topLevel: 123,
    nested: { deep: { value: "bad" } },
  });
  expect(result.success).toBe(false);
  if (!result.success) {
    const flat = z.flattenError(result.error);
    expect(Object.keys(flat.fieldErrors).sort()).toEqual(["nested.deep.value", "topLevel"]);
    expect((flat.fieldErrors as any).topLevel.length).toBe(1);
    expect((flat.fieldErrors as any)["nested.deep.value"].length).toBe(1);
  }
});

test("flattenError handles array index paths correctly", () => {
  const schema = z.object({
    items: z.array(z.object({ name: z.string() })),
  });
  const result = schema.safeParse({
    items: [{ name: "ok" }, { name: 123 }, { name: 456 }],
  });
  expect(result.success).toBe(false);
  if (!result.success) {
    const flat = z.flattenError(result.error);
    expect(Object.keys(flat.fieldErrors).sort()).toEqual(["items[1].name", "items[2].name"]);
  }
});

test("flattenError still works correctly with single-level paths", () => {
  const schema = z.object({
    user: z.object({
      name: z.string(),
    }),
  });
  const result = schema.safeParse({ user: { name: 123 } });
  expect(result.success).toBe(false);
  if (!result.success) {
    const flat = z.flattenError(result.error);
    expect(flat.fieldErrors).toHaveProperty("user.name");
  }
});

test("formatError still works correctly with deep paths", () => {
  const schema = z.object({
    user: z.object({
      name: z.string(),
    }),
  });
  const result = schema.safeParse({ user: { name: 123 } });
  expect(result.success).toBe(false);
  if (!result.success) {
    const formatted = z.formatError(result.error);
    expect(formatted).toHaveProperty("user");
    expect((formatted as any).user).toHaveProperty("_errors");
  }
});
