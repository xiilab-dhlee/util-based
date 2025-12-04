import type { SliderSingleProps } from "antd/es/slider";
import type { InputNumberProps } from "xiilab-ui";

import type { CoreResourceType } from "@/shared/types/core.interface";

/**
 * 슬라이더 마크 아이템
 */
export interface SliderMarkItem {
  /** 마크 위치 값 */
  value: number;
  /** 마크 라벨 */
  label: string;
  /** 마크 색상 (기본: gray) */
  color?: string;
}

/**
 * Slider 컴포넌트의 기본 Props 인터페이스
 */
export interface SliderProps {
  /** 현재 값 (제어 모드) */
  value?: number;
  /** 기본값 (비제어 모드) */
  defaultValue?: number;
  /** 최소값 */
  min?: number;
  /** 최대값 */
  max?: number;
  /** 증감 단위 */
  step?: number;
  /** 값 변경 시 콜백 함수 */
  onChange?: (value: number) => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 읽기 전용 여부 (InputNumber 전용 속성으로 전달) */
  readOnly?: boolean;
  /** 완전 읽기 모드 여부 (버튼, divider, dot 숨김) */
  readMode?: boolean;
  /** 컴포넌트 전체 너비 */
  width?: number | string;
  /** 리소스 타입 (GPU, MIG, MPS, CPU, MEM, DISK) */
  type?: CoreResourceType;
  /** 슬라이더 마크 (기존 할당량, 요청량 등) */
  marks?: SliderMarkItem[];

  /** 접근성을 위한 라벨 */
  "aria-label"?: string;
  /** 접근성을 위한 설명 */
  "aria-describedby"?: string;
  /** Ant Design Slider에 전달할 추가 속성 */
  sliderProps?: Omit<
    SliderSingleProps & { range?: boolean },
    "value" | "defaultValue" | "min" | "max" | "step" | "onChange" | "disabled"
  >;
  /** xiilab-ui InputNumber에 전달할 추가 속성 */
  inputProps?: Omit<
    InputNumberProps,
    | "value"
    | "defaultValue"
    | "min"
    | "max"
    | "step"
    | "onChange"
    | "disabled"
    | "readOnly"
  >;
  /** Input 표시 여부 */
  showInput?: boolean;
  /** 에러 상태 (InputNumber에 status="error" 적용) */
  error?: boolean;
}

/**
 * 기본 설정값
 */
export const DEFAULT_SLIDER_CONFIG = {
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 0,
  width: "200px",
} as const;
