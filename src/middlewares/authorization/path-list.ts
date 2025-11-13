import type { PROTECTED_PATH } from "./types";

export const path: PROTECTED_PATH[] = [
  {
    path: "/admin",
    roles: ["ROLE_ADMIN"],
  },
  {
    path: "/standard",
    roles: ["ROLE_ADMIN", "ROLE_USER"],
  },
];
