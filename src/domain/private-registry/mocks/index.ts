import type { HttpHandler } from "msw";

import { getImageJobMock } from "@/api/generated/image-job/image-job.msw";
import { getPrivateRegistryMock } from "@/api/generated/private-registry/private-registry.msw";
import { imageJobsOverrideHandlers } from "@/domain/private-registry/mocks/image-jobs.override";
import { privateRegistryListOverrideHandlers } from "@/domain/private-registry/mocks/private-registry-list.override";
import { privateRegistryTagDetailOverrideHandlers } from "@/domain/private-registry/mocks/private-registry-tag-detail.override";
import { privateRegistryTagListOverrideHandlers } from "@/domain/private-registry/mocks/private-registry-tag-list.override";

export const privateRegistryHandlers: HttpHandler[] = [
  ...privateRegistryListOverrideHandlers,
  ...privateRegistryTagListOverrideHandlers,
  ...privateRegistryTagDetailOverrideHandlers,
  ...imageJobsOverrideHandlers,
  ...getPrivateRegistryMock(),
  ...getImageJobMock(),
];
