export const BP = { xs: 320, sm: 360, md: 390, lg: 420 } as const;
export type BPKey = keyof typeof BP;

export const mq = {
  up: (k: BPKey) => `@media (min-width: ${BP[k]}px)`,
  down: (k: BPKey) => `@media (max-width: ${BP[k] - 1}px)`,
  between: (a: BPKey, b: BPKey) =>
    `@media (min-width: ${BP[a]}px) and (max-width: ${BP[b] - 1}px)`,
};

export const HP = { short: 660 } as const;

export const preset = {
  xsShort: `@media (max-width: ${BP.sm - 1}px) and (max-height: ${HP.short}px)`,
};
