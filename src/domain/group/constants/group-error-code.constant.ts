export const GROUP_ERROR_CODES = {
  HAS_MEMBERS: "GROUP_HAS_MEMBERS",
} as const;

export type GroupErrorCode =
  (typeof GROUP_ERROR_CODES)[keyof typeof GROUP_ERROR_CODES];
