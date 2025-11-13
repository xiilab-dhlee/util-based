import { theme } from "xiilab-ui";

export type AppTheme = typeof theme;

export const lightTheme: AppTheme = {
  ...theme,
};

export const darkTheme: AppTheme = {
  ...theme,
};
