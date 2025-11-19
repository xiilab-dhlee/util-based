import type { InputNumberProps } from "xiilab-ui";
import type { SliderSingleProps } from "antd/es/slider";
import type { ResourceType } from "@/constants/common/unit.constant";
import { RESOURCE_UNITS } from "@/constants/common/unit.constant";

/**
 * 슬라이더 색상 타입
 */
export type SliderColorType = ResourceType;

/**
 * 색상별 스타일 설정
 */
export const SLIDER_COLOR_CONFIG = {
  gpu: {
    track: "var(--color-purple-04)",
    handle: "var(--color-purple-04)",
    unit: RESOURCE_UNITS.gpu,
  },
  cpu: {
    track: "var(--color-blue-05)",
    handle: "var(--color-blue-05)",
    unit: RESOURCE_UNITS.cpu,
  },
  memory: {
    track: "var(--color-green-11)",
    handle: "var(--color-green-11)",
    unit: RESOURCE_UNITS.memory,
  },
} as const;

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
  /** 색상 타입 (GPU, CPU, Memory) */
  type?: SliderColorType;

  /** 접근성을 위한 라벨 */
  "aria-label"?: string;
  /** 접근성을 위한 설명 */
  "aria-describedby"?: string;
  /** Ant Design Slider에 전달할 추가 속성 */
  sliderProps?: Omit<
    SliderSingleProps,
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
