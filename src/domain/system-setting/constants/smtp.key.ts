export const smtpKeys = {
  default: ["smtp"],
  // Query keys
  detail: () => [...smtpKeys.default, "detail"],
  // Mutation keys
  create: () => [...smtpKeys.default, "create"],
  update: () => [...smtpKeys.default, "update"],
  delete: () => [...smtpKeys.default, "delete"],
};
