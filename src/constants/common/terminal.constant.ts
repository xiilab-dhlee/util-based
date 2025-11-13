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

const THEME_LIST: Record<string, ITheme> = {
  MaterialDark,
  Gruvbox_Dark,
  AdventureTime,
  Borland,
  Solarized_Light,
  Material,
  Github,
};

// 터미널 수직 분할 최대 크기
const TERM_MAX_VCNT = 2;
// 터미널 수평 분할 최대 크기
const TERM_MAX_HCNT = 2;
// 기본 테마
const TERM_DEFAULT_THEME = "MaterialDark";

const terminalConstants = {
  themes: THEME_LIST,
  maxVcount: TERM_MAX_VCNT,
  maxHcount: TERM_MAX_HCNT,
  defaultTheme: TERM_DEFAULT_THEME,
};

export default terminalConstants;
