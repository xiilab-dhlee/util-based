import type { VolumeFileItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getListFilesMockHandler,
  getListFilesResponseMock,
} from "@/api/generated/volume-file/volume-file.msw";
import {
  PREVIEWABLE_IMAGE_EXTENSIONS,
  PREVIEWABLE_TEXT_EXTENSIONS,
} from "@/shared/utils/file.util";

/**
 * 미리보기 가능한 이미지 파일 목록
 */
const IMAGE_FILES: VolumeFileItemResponse[] = PREVIEWABLE_IMAGE_EXTENSIONS.map(
  (ext, index) => ({
    name: `sample-image-${index + 1}.${ext}`,
    type: "FILE",
    path: `/images/sample-image-${index + 1}.${ext}`,
    size: (index + 1) * 1024 * 100, // 100KB ~ 700KB
  }),
);

/**
 * 미리보기 가능한 텍스트 파일 목록
 */
const TEXT_FILES: VolumeFileItemResponse[] = PREVIEWABLE_TEXT_EXTENSIONS.map(
  (ext, index) => ({
    name: `sample-code.${ext}`,
    type: "FILE",
    path: `/codes/sample-code.${ext}`,
    size: (index + 1) * 512, // 512B ~ 14KB
  }),
);

/**
 * 압축 파일 목록
 */
const ARCHIVE_FILES: VolumeFileItemResponse[] = [
  {
    name: "archive.zip",
    type: "FILE",
    path: "/archive.zip",
    size: 1024 * 1024 * 5,
  },
  {
    name: "backup.tar.gz",
    type: "FILE",
    path: "/backup.tar.gz",
    size: 1024 * 1024 * 10,
  },
  {
    name: "data.tgz",
    type: "FILE",
    path: "/data.tgz",
    size: 1024 * 1024 * 2,
  },
];

/**
 * 디렉토리 목록
 */
const DIRECTORIES: VolumeFileItemResponse[] = [
  { name: "images", type: "DIRECTORY", path: "/images", size: 0 },
  { name: "codes", type: "DIRECTORY", path: "/codes", size: 0 },
  { name: "data", type: "DIRECTORY", path: "/data", size: 0 },
  { name: "models", type: "DIRECTORY", path: "/models", size: 0 },
  { name: "outputs", type: "DIRECTORY", path: "/outputs", size: 0 },
];

/**
 * 경로별 하위 파일 목록 매핑
 */
const PATH_CHILDREN_MAP: Record<string, VolumeFileItemResponse[]> = {
  "/": [...DIRECTORIES, ...ARCHIVE_FILES],
  "/images": IMAGE_FILES,
  "/codes": TEXT_FILES,
  "/data": [
    {
      name: "train.csv",
      type: "FILE",
      path: "/data/train.csv",
      size: 1024 * 1024 * 50,
    },
    {
      name: "test.csv",
      type: "FILE",
      path: "/data/test.csv",
      size: 1024 * 1024 * 10,
    },
    {
      name: "validation.json",
      type: "FILE",
      path: "/data/validation.json",
      size: 1024 * 512,
    },
  ],
  "/models": [
    {
      name: "model_v1.pt",
      type: "FILE",
      path: "/models/model_v1.pt",
      size: 1024 * 1024 * 100,
    },
    {
      name: "model_v2.pt",
      type: "FILE",
      path: "/models/model_v2.pt",
      size: 1024 * 1024 * 150,
    },
    {
      name: "config.yaml",
      type: "FILE",
      path: "/models/config.yaml",
      size: 2048,
    },
  ],
  "/outputs": [
    {
      name: "result.log",
      type: "FILE",
      path: "/outputs/result.log",
      size: 1024 * 50,
    },
    {
      name: "metrics.json",
      type: "FILE",
      path: "/outputs/metrics.json",
      size: 1024,
    },
    {
      name: "predictions.csv",
      type: "FILE",
      path: "/outputs/predictions.csv",
      size: 1024 * 1024 * 5,
    },
  ],
};

/**
 * 볼륨 파일 목록 override 핸들러
 *
 * 미리보기 가능한 이미지 및 텍스트 파일을 포함한 파일 구조 제공
 */
export const volumeFileListOverrideHandlers = [
  getListFilesMockHandler(async (info) => {
    const url = new URL(info.request.url);
    const path = url.searchParams.get("path") || "/";

    const { status, message, timestamp } = getListFilesResponseMock();

    // 경로에 맞는 children 반환 (없으면 루트 반환)
    const children = PATH_CHILDREN_MAP[path] ?? PATH_CHILDREN_MAP["/"];

    const directoryCount = children.filter(
      (c) => c.type === "DIRECTORY",
    ).length;
    const fileCount = children.filter((c) => c.type === "FILE").length;

    return {
      status,
      message,
      timestamp,
      data: {
        children,
        directoryCount,
        fileCount,
      },
    };
  }),
];
