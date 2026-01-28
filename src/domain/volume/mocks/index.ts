import type { HttpHandler } from "msw";

import { getAdminVolumeMock } from "@/api/generated/admin-volume/admin-volume.msw";
import { getVolumeMock } from "@/api/generated/volume/volume.msw";
import { getVolumeFileMock } from "@/api/generated/volume-file/volume-file.msw";
import { volumeFileListOverrideHandlers } from "@/domain/volume/mocks/volume-file-list.override";
import { volumeListOverrideHandlers } from "@/domain/volume/mocks/volume-list.override";

export const volumeHandlers: HttpHandler[] = [
  // override 핸들러가 먼저 매칭되도록 배치
  ...volumeListOverrideHandlers,
  ...volumeFileListOverrideHandlers,
  // orval에서 생성된 기본 핸들러 (override되지 않은 엔드포인트용)
  ...getVolumeMock(),
  ...getVolumeFileMock(),
  ...getAdminVolumeMock(),
];
