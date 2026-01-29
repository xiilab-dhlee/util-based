/**
 * 모든 페이지에서 사용되는 공통 모델을 정의
 *
 */

import type { ReactNode } from "react";
import type { DropdownOption, MenuItem, ResponsiveColumnType } from "xiilab-ui";

/**
 * 파일 트리 타입 (재귀적 구조)
 * Orval의 WorkloadFileItemResponse와 호환되도록 설계
 */
export interface FileTreeType {
  /** 파일/디렉토리 고유 ID */
  id: string;
  /** 파일/디렉토리 이름 */
  name: string;
  /** 파일 경로 */
  path: string;
  /** 파일 타입 */
  type: "file" | "directory";
  /** 파일 확장자 (파일인 경우) */
  fileExtension: string | null;
  /** 파일 크기 (파일인 경우) */
  fileSize?: string;
  /** 폴더 내 파일 개수 (디렉토리인 경우) */
  fileCount?: number;
  /** 폴더 내 디렉토리 개수 (디렉토리인 경우) */
  directoryCount?: number;
  /** 자식 파일/디렉토리 목록 */
  children: FileTreeType[];
}

/** 파일 트리 배열 타입 */
export type FileTreeArrayType = FileTreeType[];

// 네비게이션 메뉴
export type CoreNavMenu = {
  // 타이틀
  title: string;
  // 메뉴 옵션
  items: MenuItem[];
};

// 테마 옵션
export interface CoreThemeOption {
  // 키
  key: string;
  // 이름
  name: string;
  // 미리보기 클래스
  previewClass: string;
}

// 파일 버튼 인터페이스
export interface CoreFileButton {
  /** 파일 이름 */
  fileName: string;
  /** 파일 키 */
  activeKey: string;
  /** 아이콘 표시 여부 */
  showIcon?: boolean;
  /** 파일/폴더 경로 */
  path?: string;
  /** 파일/폴더 타입 */
  type?: "file" | "directory";
  /** 폴더 클릭 시 하위 파일 로드 콜백 */
  onFolderClick?: (path: string) => void;
}

// 목록 응답 인터페이스
export interface CoreListResponse<T> {
  content: T[];
  totalSize: number;
}

// 파일 목록 응답 인터페이스
export interface CoreFileListResponse extends CoreListResponse<FileTreeType> {
  directoryCnt: number;
}

/**
 * 컬럼 설정 인터페이스 (제네릭)
 */
export interface CoreCreateColumnConfig extends Partial<ResponsiveColumnType> {}
// 가이드 요소
export interface CoreGuide {
  /** 아이콘 */
  icon: ReactNode;
  /** 타이틀 */
  title: string;
  /** 설명 (문자열 배열) */
  description: readonly string[];
}
// 가이드 이미지
export interface CoreGuideImage {
  id: string;
  src: string;
  alt: string;
}
// 차트 데이터 형식
export interface CoreChartSeries {
  type: string;
  name: string;
  data: Array<[number, number]>;
}
// 테스트 선택자 인터페이스
export interface CoreTestSelector {
  testId?: string;
}

export interface CoreDropdownOption<T> extends DropdownOption {
  origin: T;
}

/**
 * 테이블 정렬 상태 (백엔드 형식, 필수)
 * @deprecated monitoring 모듈에서 사용 중. 향후 AntdTableSortState로 마이그레이션 예정
 */
export interface TableSortState {
  sortBy: string;
  sortDirection: "ASC" | "DESC";
}

export type AntdTableSortOrder = "ascend" | "descend";

export interface AntdTableSortState<TField extends string = string> {
  field: TField | null;
  order: AntdTableSortOrder | null;
}
