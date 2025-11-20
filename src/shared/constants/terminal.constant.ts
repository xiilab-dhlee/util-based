import type { ITheme } from "@xterm/xterm";
import {
  AdventureTime,
  Borland,
  Github,
  Gruvbox_Dark,
  Material,
  MaterialDark,
  Solarized_Light,
} from "xterm-theme";

export const TERMINAL_THEME_LIST: Record<string, ITheme> = {
  MaterialDark,
  Gruvbox_Dark,
  AdventureTime,
  Borland,
  Solarized_Light,
  Material,
  Github,
};

// 터미널 수직 분할 최대 크기
export const TERMINAL_MAX_VCNT = 2;
// 터미널 수평 분할 최대 크기
export const TERMINAL_MAX_HCNT = 2;
