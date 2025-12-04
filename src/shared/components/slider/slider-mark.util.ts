import type { SliderMarkItem } from "./types";

/**
 * 리소스 데이터에서 슬라이더 마크 배열 생성
 * @param current 현재 할당량
 * @param request 요청량
 * @returns SliderMarkItem 배열 (기존 할당량, 요청량 순서)
 */
export const createSliderMarks = (
	current: number,
	request: number,
): SliderMarkItem[] => [
	{ value: current, label: current.toString() },
	{ value: request, label: request.toString() },
];
