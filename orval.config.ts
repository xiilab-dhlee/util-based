import { defineConfig } from "orval";

export const orvalConfig = defineConfig({
  // React Query 훅 생성
  "astrago-client": {
    input: {
      target: "./node_modules/@xiilab/astrago-openapi-spec/openapi.json",
    },
    output: {
      target: "./src/api/generated",
      mode: "tags-split",
      client: "react-query",
      mock: true, // MSW 생성 활성화

      biome: true,
      override: {
        mock: {
          required: true,
          properties: {
            status: "SUCCESS",
          },
        },
        mutator: {
          path: "./src/shared/api/axios-mutator.ts",
          name: "customInstance",
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },

  // Zod 스키마 생성 (Form validation용)
  "astrago-validation": {
    input: {
      target: "./node_modules/@xiilab/astrago-openapi-spec/openapi.json",
    },
    output: {
      target: "./src/api/generated",
      mode: "tags-split",
      client: "zod",
      fileExtension: ".zod.ts",
      override: {
        zod: {
          strict: {
            body: true,
            response: true,
          },
          generate: {
            body: true,
            response: true,
            param: true,
            query: true,
          },
        },
      },
    },
  },
});

// Orval CLI loads config files via require-like semantics in many setups.
// Exporting through CommonJS keeps compatibility while avoiding default export lint errors.
module.exports = orvalConfig;
