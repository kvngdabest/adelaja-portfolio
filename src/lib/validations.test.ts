import { describe, expect, it } from "vitest";
import {
  contactFormSchema,
  loginSchema,
  projectSchema,
  skillSchema,
  slugSchema,
} from "./validations";

describe("slugSchema", () => {
  it("accepts lowercase hyphenated slugs", () => {
    expect(slugSchema.safeParse("my-project-1").success).toBe(true);
  });

  it.each(["My Project", "my_project", "-leading", "trailing-", "double--hyphen"])(
    "rejects %s",
    (value) => {
      expect(slugSchema.safeParse(value).success).toBe(false);
    }
  );
});

describe("projectSchema", () => {
  const base = { title: "Test Project", slug: "test-project" };

  it("applies defaults for optional fields", () => {
    const result = projectSchema.parse(base);
    expect(result.status).toBe("draft");
    expect(result.is_featured).toBe(false);
    expect(result.tech_stack).toEqual([]);
    expect(result.sort_order).toBe(0);
  });

  it("requires a title and slug", () => {
    expect(projectSchema.safeParse({ slug: "no-title" }).success).toBe(false);
    expect(projectSchema.safeParse({ title: "No Slug" }).success).toBe(false);
  });

  it("rejects an invalid project URL but allows an empty string", () => {
    expect(
      projectSchema.safeParse({ ...base, project_url: "not-a-url" }).success
    ).toBe(false);
    expect(projectSchema.safeParse({ ...base, project_url: "" }).success).toBe(true);
    expect(
      projectSchema.safeParse({ ...base, project_url: "https://example.com" }).success
    ).toBe(true);
  });
});

describe("skillSchema", () => {
  it("bounds proficiency between 1 and 100", () => {
    const valid = { name: "n8n", category: "Automation & AI" };
    expect(skillSchema.safeParse({ ...valid, proficiency: 0 }).success).toBe(false);
    expect(skillSchema.safeParse({ ...valid, proficiency: 101 }).success).toBe(false);
    expect(skillSchema.safeParse({ ...valid, proficiency: 95 }).success).toBe(true);
  });
});

describe("contactFormSchema", () => {
  const valid = {
    name: "Jane Doe",
    email: "jane@example.com",
    message: "I would like to discuss an automation project.",
  };

  it("accepts a well-formed submission with an empty honeypot", () => {
    expect(contactFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a message that is too short", () => {
    expect(
      contactFormSchema.safeParse({ ...valid, message: "hi" }).success
    ).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(
      contactFormSchema.safeParse({ ...valid, email: "not-an-email" }).success
    ).toBe(false);
  });

  it("rejects a filled-in honeypot field (bot submission)", () => {
    expect(
      contactFormSchema.safeParse({ ...valid, company: "Acme Bots Inc" }).success
    ).toBe(false);
  });
});

describe("loginSchema", () => {
  it("requires a valid email and a 6+ character password", () => {
    expect(
      loginSchema.safeParse({ email: "admin@example.com", password: "12345" }).success
    ).toBe(false);
    expect(
      loginSchema.safeParse({ email: "admin@example.com", password: "123456" }).success
    ).toBe(true);
    expect(
      loginSchema.safeParse({ email: "not-an-email", password: "123456" }).success
    ).toBe(false);
  });
});
