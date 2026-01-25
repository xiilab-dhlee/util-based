import type { GpuConfigMap } from "@/domain/node/types/node.type";

/** A30 Config */
export const MIG_GPU_ALPHA_CONFIG = {
  1: [{ gpuIndex: 0, compute: 4 }],
  2: [
    { gpuIndex: 1, compute: 2 },
    { gpuIndex: 2, compute: 2 },
  ],
  3: [
    { gpuIndex: 1, compute: 2 },
    { gpuIndex: 5, compute: 1 },
    { gpuIndex: 6, compute: 1 },
  ],
  4: [
    { gpuIndex: 2, compute: 2 },
    { gpuIndex: 3, compute: 1 },
    { gpuIndex: 4, compute: 1 },
  ],
  5: [
    { gpuIndex: 3, compute: 1 },
    { gpuIndex: 4, compute: 1 },
    { gpuIndex: 5, compute: 1 },
    { gpuIndex: 6, compute: 1 },
  ],
};
/** A100 ~ Current Model Config */
export const MIG_GPU_BETA_CONFIG = {
  1: [{ gpuIndex: 0, compute: 7 }],
  2: [
    { gpuIndex: 1, compute: 4 },
    { gpuIndex: 3, compute: 3 },
  ],
  3: [
    { gpuIndex: 1, compute: 4 },
    { gpuIndex: 6, compute: 2 },
    { gpuIndex: 13, compute: 1 },
  ],
  4: [
    { gpuIndex: 1, compute: 4 },
    { gpuIndex: 11, compute: 1 },
    { gpuIndex: 12, compute: 1 },
    { gpuIndex: 13, compute: 1 },
  ],
  5: [
    { gpuIndex: 2, compute: 3 },
    { gpuIndex: 3, compute: 3 },
  ],
  6: [
    { gpuIndex: 2, compute: 3 },
    { gpuIndex: 6, compute: 2 },
    { gpuIndex: 13, compute: 1 },
  ],
  7: [
    { gpuIndex: 2, compute: 3 },
    { gpuIndex: 11, compute: 1 },
    { gpuIndex: 12, compute: 1 },
    { gpuIndex: 13, compute: 1 },
  ],
  8: [
    { gpuIndex: 3, compute: 3 },
    { gpuIndex: 4, compute: 2 },
    { gpuIndex: 5, compute: 2 },
  ],
  9: [
    { gpuIndex: 3, compute: 3 },
    { gpuIndex: 4, compute: 2 },
    { gpuIndex: 9, compute: 1 },
    { gpuIndex: 10, compute: 1 },
  ],
  10: [
    { gpuIndex: 3, compute: 3 },
    { gpuIndex: 5, compute: 2 },
    { gpuIndex: 7, compute: 1 },
    { gpuIndex: 8, compute: 1 },
  ],
  11: [
    { gpuIndex: 3, compute: 3 },
    { gpuIndex: 7, compute: 1 },
    { gpuIndex: 8, compute: 1 },
    { gpuIndex: 9, compute: 1 },
    { gpuIndex: 10, compute: 1 },
  ],
  12: [
    { gpuIndex: 4, compute: 2 },
    { gpuIndex: 5, compute: 2 },
    { gpuIndex: 6, compute: 2 },
    { gpuIndex: 13, compute: 1 },
  ],
  13: [
    { gpuIndex: 4, compute: 2 },
    { gpuIndex: 6, compute: 2 },
    { gpuIndex: 9, compute: 1 },
    { gpuIndex: 10, compute: 1 },
    { gpuIndex: 13, compute: 1 },
  ],
  14: [
    { gpuIndex: 5, compute: 2 },
    { gpuIndex: 6, compute: 2 },
    { gpuIndex: 7, compute: 1 },
    { gpuIndex: 8, compute: 1 },
    { gpuIndex: 13, compute: 1 },
  ],
  15: [
    { gpuIndex: 4, compute: 2 },
    { gpuIndex: 9, compute: 1 },
    { gpuIndex: 10, compute: 1 },
    { gpuIndex: 11, compute: 1 },
    { gpuIndex: 12, compute: 1 },
    { gpuIndex: 13, compute: 1 },
  ],
  16: [
    { gpuIndex: 5, compute: 2 },
    { gpuIndex: 7, compute: 1 },
    { gpuIndex: 8, compute: 1 },
    { gpuIndex: 11, compute: 1 },
    { gpuIndex: 12, compute: 1 },
    { gpuIndex: 13, compute: 1 },
  ],
  17: [
    { gpuIndex: 6, compute: 2 },
    { gpuIndex: 7, compute: 1 },
    { gpuIndex: 8, compute: 1 },
    { gpuIndex: 9, compute: 1 },
    { gpuIndex: 10, compute: 1 },
    { gpuIndex: 13, compute: 1 },
  ],
  19: [
    { gpuIndex: 7, compute: 1 },
    { gpuIndex: 8, compute: 1 },
    { gpuIndex: 9, compute: 1 },
    { gpuIndex: 10, compute: 1 },
    { gpuIndex: 11, compute: 1 },
    { gpuIndex: 12, compute: 1 },
    { gpuIndex: 13, compute: 1 },
  ],
};
/** A30 Model */
export const MIG_GPU_ALPHA_MODEL: GpuConfigMap = {
  A30: {
    configs: [
      { compute: 4, memory: 24 },
      { compute: 2, memory: 12 },
      { compute: 1, memory: 6 },
    ],
  },
};
/** A100 ~ Current Model Model */
export const MIG_GPU_BETA_MODEL: GpuConfigMap = {
  A100: {
    configs: [
      { compute: 7, memory: 40 },
      { compute: 4, memory: 20 },
      { compute: 3, memory: 20 },
      { compute: 2, memory: 10 },
      { compute: 1, memory: 5 },
    ],
  },
  "A100-80GB": {
    configs: [
      { compute: 7, memory: 80 },
      { compute: 4, memory: 40 },
      { compute: 3, memory: 40 },
      { compute: 2, memory: 20 },
      { compute: 1, memory: 10 },
    ],
  },
  H100: {
    configs: [
      { compute: 7, memory: 80 },
      { compute: 4, memory: 40 },
      { compute: 3, memory: 40 },
      { compute: 2, memory: 20 },
      { compute: 1, memory: 10 },
    ],
  },
  "H100-94GB": {
    configs: [
      { compute: 7, memory: 88 },
      { compute: 4, memory: 44 },
      { compute: 3, memory: 44 },
      { compute: 2, memory: 22 },
      { compute: 1, memory: 11 },
    ],
  },
  "H100-96GB": {
    configs: [
      { compute: 7, memory: 96 },
      { compute: 4, memory: 48 },
      { compute: 3, memory: 48 },
      { compute: 2, memory: 24 },
      { compute: 1, memory: 12 },
    ],
  },
  H200: {
    configs: [
      { compute: 7, memory: 141 },
      { compute: 4, memory: 71 },
      { compute: 3, memory: 71 },
      { compute: 2, memory: 35 },
      { compute: 1, memory: 18 },
    ],
  },
  B200: {
    configs: [
      { compute: 7, memory: 180 },
      { compute: 4, memory: 90 },
      { compute: 3, memory: 90 },
      { compute: 2, memory: 45 },
      { compute: 1, memory: 23 },
    ],
  },
};
