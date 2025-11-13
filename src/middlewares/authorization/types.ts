export const ROLE_ADMIN = "ROLE_ADMIN";
export const ROLE_DEVELOPER = "ROLE_DEVELOPER";
export const ROLE_TEST = "ROLE_TEST";
export const ROLE_USER = "ROLE_USER";

export type ROLE =
  | typeof ROLE_ADMIN
  | typeof ROLE_DEVELOPER
  | typeof ROLE_TEST
  | typeof ROLE_USER;

export interface PROTECTED_PATH {
  path: string;
  roles: ROLE[];
}
