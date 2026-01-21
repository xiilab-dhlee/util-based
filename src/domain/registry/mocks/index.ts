import type { HttpHandler } from "msw";

import { getImageJobMock } from "@/api/generated/image-job/image-job.msw";
import { getPrivateRegistryMock } from "@/api/generated/private-registry/private-registry.msw";
import { getPublicRegistryMock } from "@/api/generated/public-registry/public-registry.msw";
import { imageJobsOverrideHandlers } from "@/domain/registry/mocks/image-jobs.override";
import { registryListOverrideHandlers } from "@/domain/registry/mocks/registry-list.override";
import { registryTagDetailOverrideHandlers } from "@/domain/registry/mocks/registry-tag-detail.override";
import { registryTagListOverrideHandlers } from "@/domain/registry/mocks/registry-tag-list.override";
import { registryVulnerabilityListOverrideHandlers } from "@/domain/registry/mocks/registry-vulnerability-list.override";

export const registryHandlers: HttpHandler[] = [
  // Registry override handlers (private + public)
  ...registryListOverrideHandlers,
  ...registryTagListOverrideHandlers,
  ...registryTagDetailOverrideHandlers,
  ...registryVulnerabilityListOverrideHandlers,
  // Default mock handlers
  ...getPrivateRegistryMock(),
  ...getPublicRegistryMock(),
  // Image job handlers
  ...imageJobsOverrideHandlers,
  ...getImageJobMock(),
];
