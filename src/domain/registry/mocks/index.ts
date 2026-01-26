import type { HttpHandler } from "msw";

import { getAdminPrivateRegistryMock } from "@/api/generated/admin-private-registry/admin-private-registry.msw";
import { getImageJobMock } from "@/api/generated/image-job/image-job.msw";
import { getPrivateRegistryMock } from "@/api/generated/private-registry/private-registry.msw";
import { getPublicRegistryMock } from "@/api/generated/public-registry/public-registry.msw";
import { imageJobsOverrideHandlers } from "@/domain/registry/mocks/image-jobs.override";
import { registryListOverrideHandlers } from "@/domain/registry/mocks/registry-list.override";
import { registryTagDetailOverrideHandlers } from "@/domain/registry/mocks/registry-tag-detail.override";
import { registryTagListOverrideHandlers } from "@/domain/registry/mocks/registry-tag-list.override";
import { registryUserListOverrideHandlers } from "@/domain/registry/mocks/registry-user-list.override";
import { registryVulnerabilityListOverrideHandlers } from "@/domain/registry/mocks/registry-vulnerability-list.override";

export const registryHandlers: HttpHandler[] = [
  // Registry override handlers (private + public)
  ...registryListOverrideHandlers,
  ...registryTagListOverrideHandlers,
  ...registryTagDetailOverrideHandlers,
  ...registryVulnerabilityListOverrideHandlers,
  // Registry user list override handlers (admin)
  ...registryUserListOverrideHandlers,
  // Default mock handlers
  ...getPrivateRegistryMock(),
  ...getPublicRegistryMock(),
  ...getAdminPrivateRegistryMock(),
  // Image job handlers
  ...imageJobsOverrideHandlers,
  ...getImageJobMock(),
];
