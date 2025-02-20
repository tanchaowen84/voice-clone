import * as z from "zod";

/**
 * newsletter schema
 */
export const NewsletterFormSchema = z.object({
  email: z.string().email({
    message: "Enter a valid email",
  }),
});

export type NewsletterFormData = z.infer<typeof NewsletterFormSchema>;

/**
 * submit item
 */
export const SubmitSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(32, { message: "Name must be 32 or fewer characters long" }),
  link: z.string().url({ message: "Invalid url" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(256, { message: "Description must be 256 or fewer characters long" }),
  introduction: z
    .string()
    .min(1, { message: "Introduction is required" })
    .max(4096, {
      message: "Introduction must be 4096 or fewer characters long",
    }),
  tags: z.array(z.string()).min(1, { message: "Must select at least one tag" }),
  categories: z
    .array(z.string())
    .min(1, { message: "Must select at least one category" }),
  imageId: z.string().min(1, { message: "Must upload an image" }),
});

/**
 * edit item
 */
export const EditSchema = SubmitSchema.extend({
  id: z.string().min(1, { message: "ID is required" }),
  pricePlan: z.string().min(1, { message: "Price plan is required" }),
  planStatus: z.string().min(1, { message: "Plan status is required" }),
});

/**
 * account settings
 */
export const SettingsSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    link: z.string().optional(),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    },
  );

export const UserNameSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(32, { message: "Name must be 32 or fewer characters long" }),
});

export type UserNameData = z.infer<typeof UserNameSchema>;

export const UserLinkSchema = z.object({
  link: z
    .string()
    .min(0, { message: "Link is optional" })
    .max(128, { message: "Link must be 128 or fewer characters long" }),
});

export type UserLinkData = z.infer<typeof UserLinkSchema>;

export const UserPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
    newPassword: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
    confirmPassword: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required",
      path: ["password"],
    },
  )
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword !== data.confirmPassword) {
        return false;
      }

      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export type UserPasswordData = z.infer<typeof UserPasswordSchema>;

/**
 * auth related schemas
 */
export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const ActivateSchema = z.object({
  name: z.string().min(1, {
    message: "GitHub username is required",
  }),
  license: z.string().min(1, {
    message: "License key is required",
  }),
});

export type ActivateFormData = z.infer<typeof ActivateSchema>;

/**
 * og image schema
 */
export const ogImageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.string().optional(),
  mode: z.enum(["light", "dark"]).default("light"),
});
