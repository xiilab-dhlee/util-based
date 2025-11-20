import { faker } from "@faker-js/faker";

import type { FileTreeType } from "@/shared/schemas/filetree.schema";
import {
  FILE_EXTENSIONS,
  FILE_SIZE_RANGES,
} from "@/shared/constants/filetree.constant";

type FileSizeCategory = keyof typeof FILE_SIZE_RANGES;
type FileTemplate = Record<string, unknown>;

/**
 * 파일 크기 생성
 */
function generateFileSize(category: FileSizeCategory): string {
  const range = FILE_SIZE_RANGES[category];
  const size = faker.number.int({ min: range.min, max: range.max });
  return `${size}${range.unit}`;
}

/**
 * 파일 확장자에 따른 파일 크기 범위 결정
 */
function getFileSizeCategory(extension: string): FileSizeCategory {
  if (FILE_EXTENSIONS.images.includes(extension)) return "medium";
  if (FILE_EXTENSIONS.models.includes(extension)) return "xlarge";
  if (FILE_EXTENSIONS.notebooks.includes(extension)) return "large";
  if (FILE_EXTENSIONS.logs.includes(extension)) return "medium";
  return "small";
}

/**
 * 파일 생성
 */
function generateFile(
  basePath: string,
  name: string,
  extension: string,
): FileTreeType {
  const path = `${basePath}/${name}`;
  const category = getFileSizeCategory(extension);

  return {
    id: path,
    name,
    path,
    type: "file",
    fileExtension: extension,
    fileSize: generateFileSize(category),
    children: [],
  };
}

/**
 * 디렉토리 생성
 */
function generateDirectory(
  basePath: string,
  name: string,
  children: FileTreeType[],
): FileTreeType {
  const path = `${basePath}/${name}`;

  return {
    id: path,
    name,
    path,
    type: "directory",
    fileExtension: null,
    fileCount: children.length,
    children,
  };
}

/**
 * 커스텀 파일 트리 생성 (템플릿 기반)
 *
 * 지원하는 구조:
 * - true - 단일 파일 생성 (키가 파일명)
 * - 배열 - 파일 리스트
 * - 객체 - 중첩 디렉토리
 *
 * @param template - 파일 트리 템플릿 객체
 * @param basePath - 기본 경로 (기본값: "")
 * @returns 생성된 파일 트리 배열
 */
export function generateCustomTree(
  template: FileTemplate,
  basePath: string = "",
): FileTreeType[] {
  const tree: FileTreeType[] = [];

  for (const [key, value] of Object.entries(template)) {
    // 특수 키: @files - 루트 레벨 파일들
    if (key === "@files" && Array.isArray(value)) {
      const files = value
        .map((fileName) => {
          if (typeof fileName !== "string") return null;
          const ext = fileName.split(".").pop() || "";
          return generateFile(basePath, fileName, ext);
        })
        .filter((file): file is FileTreeType => file !== null);
      tree.push(...files);
      continue;
    }

    const currentPath = basePath ? `${basePath}/${key}` : `/${key}`;

    // 특수 값: true - 단일 파일 생성
    if (value === true) {
      const ext = key.split(".").pop() || "";
      tree.push(generateFile(basePath, key, ext));
      continue;
    }

    // 배열: 파일 리스트
    if (Array.isArray(value)) {
      const files = value
        .map((fileName) => {
          if (typeof fileName !== "string") return null;
          const ext = fileName.split(".").pop() || "";
          return generateFile(currentPath, fileName, ext);
        })
        .filter((file): file is FileTreeType => file !== null);
      tree.push(generateDirectory(basePath, key, files));
      continue;
    }

    // 객체: 중첩 디렉토리
    if (typeof value === "object" && value !== null) {
      const children = generateCustomTree(value as FileTemplate, currentPath);
      tree.push(generateDirectory(basePath, key, children));
    }
  }

  return tree;
}

/**
 * 랜덤 파일 트리 생성
 *
 * @param depth - 트리 깊이 (기본값: 3)
 * @param breadth - 각 레벨의 최대 항목 수 (기본값: 5)
 * @returns 생성된 파일 트리 배열
 */
export function generateRandomTree(
  depth: number = 3,
  breadth: number = 5,
): FileTreeType[] {
  if (depth <= 0) return [];

  const tree: FileTreeType[] = [];
  const numItems = faker.number.int({ min: 2, max: breadth });

  for (let i = 0; i < numItems; i++) {
    const isDirectory = faker.datatype.boolean() && depth > 1;
    const name = faker.system.fileName();

    if (isDirectory) {
      const children = generateRandomTree(depth - 1, breadth);
      tree.push(generateDirectory("", name.split(".")[0] || name, children));
    } else {
      const extension = faker.helpers.arrayElement([
        ...FILE_EXTENSIONS.code,
        ...FILE_EXTENSIONS.data,
        ...FILE_EXTENSIONS.documents,
      ]);
      tree.push(generateFile("", name, extension));
    }
  }

  return tree;
}
