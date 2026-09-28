export const FORM_FIELDS = {
  Name: "name",
  Email: "email",
  Password: "password",
} as const;
export type FormField = (typeof FORM_FIELDS)[keyof typeof FORM_FIELDS];

export const VALIDATION_LIMITS = {
  DisplayNameMaxLength: 80,
  EmailMaxLength: 254,
  PasswordMinLength: 8,
  PasswordMaxLength: 72,
  PostTitleMaxLength: 200,
  PostBodyMaxLength: 10000,
  CommentMaxLength: 5000,
} as const;

export const INPUT_TYPES = {
  Email: "email",
  Password: "password",
  Text: "text",
} as const;
export type InputType = (typeof INPUT_TYPES)[keyof typeof INPUT_TYPES];

export const AUTOCOMPLETE_VALUES = {
  Name: "name",
  Email: "email",
  NewPassword: "new-password",
  CurrentPassword: "current-password",
} as const;
export type AutocompleteValue =
  (typeof AUTOCOMPLETE_VALUES)[keyof typeof AUTOCOMPLETE_VALUES];
