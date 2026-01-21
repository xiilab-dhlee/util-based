import type { HttpHandler } from "msw";

import { getImageJobMock } from "@/api/generated/image-job/image-job.msw";
import { getPrivateRegistryMock } from "@/api/generated/private-registry/private-registry.msw";
import { getPublicRegistryMock } from "@/api/generated/public-registry/public-registry.msw";
import { imageJobsOverrideHandlers } from "@/domain/registry/mocks/image-jobs.override";
import { privateRegistryListOverrideHandlers } from "@/domain/registry/mocks/private-registry-list.override";
import { privateRegistryTagDetailOverrideHandlers } from "@/domain/registry/mocks/private-registry-tag-detail.override";
import { privateRegistryTagListOverrideHandlers } from "@/domain/registry/mocks/private-registry-tag-list.override";
import { publicRegistryListOverrideHandlers } from "@/domain/registry/mocks/public-registry-list.override";
import { publicRegistryTagDetailOverrideHandlers } from "@/domain/registry/mocks/public-registry-tag-detail.override";
import { publicRegistryTagListOverrideHandlers } from "@/domain/registry/mocks/public-registry-tag-list.override";

export const registryHandlers: HttpHandler[] = [
  // Private registry handlers
  ...privateRegistryListOverrideHandlers,
  ...privateRegistryTagListOverrideHandlers,
  ...privateRegistryTagDetailOverrideHandlers,
  ...getPrivateRegistryMock(),
  // Public registry handlers
  ...publicRegistryListOverrideHandlers,
  ...publicRegistryTagListOverrideHandlers,
  ...publicRegistryTagDetailOverrideHandlers,
  ...getPublicRegistryMock(),
  // Image job handlers
  ...imageJobsOverrideHandlers,
  ...getImageJobMock(),
];
