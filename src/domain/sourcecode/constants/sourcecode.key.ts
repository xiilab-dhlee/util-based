import type { GetSourcecodesPayload } from "@/domain/sourcecode/types/sourcecode.type";

export const sourcecodeKeys = {
  default: ["sourcecode"],
  list: (payload: GetSourcecodesPayload) => [
    ...sourcecodeKeys.default,
    "list",
    ...Object.values(payload),
  ],
  detail: (id: number) => [...sourcecodeKeys.default, "detail", id],
};
