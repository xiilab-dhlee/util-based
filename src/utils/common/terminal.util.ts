import type {
  TerminalActionData,
  TerminalActionType,
} from "@/types/common/terminal.interface";

/**
 * 터미널 메시지 생성 유틸리티 함수
 * @param type - 메시지 타입
 * @param data - 메시지 데이터
 * @returns 터미널 메시지
 */
export function createTerminalAction(
  type: TerminalActionType,
  data?: TerminalActionData | string,
): string {
  const action = Object.assign({ messageType: type }, data);

  return JSON.stringify(action);
}
