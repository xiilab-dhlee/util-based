const breakpoints = {
  mobile: 320,
  tablet: 768,
  laptop: 1024,
  desktop: 1200,
  largeDesktop: 1500,
} as const;

type BreakpointKey = keyof typeof breakpoints;

export const mediaQueries = {
  up: (size: BreakpointKey) => `@media (min-width: ${breakpoints[size]}px)`,
  down: (size: BreakpointKey) => `@media (max-width: ${breakpoints[size]}px)`,
  between: (start: BreakpointKey, end: BreakpointKey) =>
    `@media (min-width: ${breakpoints[start]}px) and (max-width: ${breakpoints[end]}px)`,
} as const;

// 사용 예시:
// ${mediaQueries.down('largeDesktop')} {
//   display: none;
// }
