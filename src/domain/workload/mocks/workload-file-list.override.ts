import type { WorkloadFileItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getWorkloadListFilesMockHandler,
  getWorkloadListFilesResponseMock,
} from "@/api/generated/workload/workload.msw";
import {
  PREVIEWABLE_IMAGE_EXTENSIONS,
  PREVIEWABLE_TEXT_EXTENSIONS,
} from "@/shared/utils/file.util";

/**
 * 미리보기 가능한 이미지 파일 목록
 */
const IMAGE_FILES: WorkloadFileItemResponse[] =
  PREVIEWABLE_IMAGE_EXTENSIONS.map((ext, index) => ({
    name: `sample-image-${index + 1}.${ext}`,
    type: "FILE",
    path: `/workspace/images/sample-image-${index + 1}.${ext}`,
    size: (index + 1) * 1024 * 100, // 100KB ~ 700KB
  }));

/**
 * 미리보기 가능한 텍스트 파일 목록
 */
const TEXT_FILES: WorkloadFileItemResponse[] = PREVIEWABLE_TEXT_EXTENSIONS.map(
  (ext, index) => ({
    name: `sample-code.${ext}`,
    type: "FILE",
    path: `/workspace/codes/sample-code.${ext}`,
    size: (index + 1) * 512, // 512B ~ 14KB
  }),
);

/**
 * 압축 파일 목록
 */
const ARCHIVE_FILES: WorkloadFileItemResponse[] = [
  {
    name: "archive.zip",
    type: "FILE",
    path: "/workspace/archive.zip",
    size: 1024 * 1024 * 5,
  },
  {
    name: "backup.tar.gz",
    type: "FILE",
    path: "/workspace/backup.tar.gz",
    size: 1024 * 1024 * 10,
  },
  {
    name: "data.tgz",
    type: "FILE",
    path: "/workspace/data.tgz",
    size: 1024 * 1024 * 2,
  },
];

/**
 * 디렉토리 목록
 */
const DIRECTORIES: WorkloadFileItemResponse[] = [
  { name: "images", type: "DIRECTORY", path: "/workspace/images", size: 0 },
  { name: "codes", type: "DIRECTORY", path: "/workspace/codes", size: 0 },
  { name: "data", type: "DIRECTORY", path: "/workspace/data", size: 0 },
  { name: "models", type: "DIRECTORY", path: "/workspace/models", size: 0 },
  { name: "outputs", type: "DIRECTORY", path: "/workspace/outputs", size: 0 },
];

/**
 * 루트 디렉토리 (workspace)
 */
const ROOT_DIRECTORY: WorkloadFileItemResponse[] = [
  { name: "workspace", type: "DIRECTORY", path: "/workspace", size: 0 },
];

/**
 * 경로별 하위 파일 목록 매핑
 */
const PATH_CHILDREN_MAP: Record<string, WorkloadFileItemResponse[]> = {
  "/": ROOT_DIRECTORY,
  "/workspace": [...DIRECTORIES, ...ARCHIVE_FILES],
  "/workspace/images": IMAGE_FILES,
  "/workspace/codes": TEXT_FILES,
  "/workspace/data": [
    {
      name: "train.csv",
      type: "FILE",
      path: "/workspace/data/train.csv",
      size: 1024 * 1024 * 50,
    },
    {
      name: "test.csv",
      type: "FILE",
      path: "/workspace/data/test.csv",
      size: 1024 * 1024 * 10,
    },
    {
      name: "validation.json",
      type: "FILE",
      path: "/workspace/data/validation.json",
      size: 1024 * 512,
    },
  ],
  "/workspace/models": [
    {
      name: "model_v1.pt",
      type: "FILE",
      path: "/workspace/models/model_v1.pt",
      size: 1024 * 1024 * 100,
    },
    {
      name: "model_v2.pt",
      type: "FILE",
      path: "/workspace/models/model_v2.pt",
      size: 1024 * 1024 * 150,
    },
    {
      name: "config.yaml",
      type: "FILE",
      path: "/workspace/models/config.yaml",
      size: 2048,
    },
  ],
  "/workspace/outputs": [
    {
      name: "result.log",
      type: "FILE",
      path: "/workspace/outputs/result.log",
      size: 1024 * 50,
    },
    {
      name: "metrics.json",
      type: "FILE",
      path: "/workspace/outputs/metrics.json",
      size: 1024,
    },
    {
      name: "predictions.csv",
      type: "FILE",
      path: "/workspace/outputs/predictions.csv",
      size: 1024 * 1024 * 5,
    },
  ],
};

/**
 * 워크로드 파일 목록 override 핸들러
 *
 * 미리보기 가능한 이미지 및 텍스트 파일을 포함한 파일 구조 제공
 */
export const workloadFileListOverrideHandlers = [
  getWorkloadListFilesMockHandler(async (info) => {
    const url = new URL(info.request.url);
    const path = url.searchParams.get("path") || "/";

    const { status, message, timestamp } = getWorkloadListFilesResponseMock();

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
