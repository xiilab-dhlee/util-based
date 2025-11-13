/**
 * 모든 페이지에서 사용되는 공통 모델을 정의
 *
 */

import type { MenuItem, ResponsiveColumnType } from "xiilab-ui";

import type { FileTreeType } from "@/schemas/filetree.schema";

// 브레드크럼 아이템
export interface CoreBreadcrumbItem {
  // 타이틀
  title: string;
  // 타이틀 아이콘
  icon?: string;
  // 링크
  href?: string;
}

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
  icon: string;
  /** 타이틀 */
  title: string;
  /** 설명 (문자열 배열) */
  description: string[];
}
// 가이드 이미지
export interface CoreGuideImage {
  id: string;
  src: string;
  alt: string;
}
// 차트 데이터 형식
export interface CoreChartSeries {
  name?: string;
  data: Array<[number, number]>;
}
