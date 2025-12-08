import { HttpResponse, http } from "msw";

import type {
  HpeDetailType,
  UpdateHpeRequestType,
} from "@/domain/system-setting/schemas/hpe.schema";
import { hpeMockData } from "@/mocks/data/hpe.mock";

const BASE_URL = "/api/v1/system-settings/hpe";

/**
 * HPE OneView 연동 상태 관리
 * PUT 요청 성공 시 업데이트되어 GET 요청에서 반환
 */
let hpeConnectionState: HpeDetailType | null = hpeMockData;

/**
 * HPE OneView 관련 MSW 핸들러
 */
export const hpeHandlers = [
  /**
   * HPE 정보 조회
   * GET /api/v1/system-settings/hpe
   */
  http.get(BASE_URL, () => {
    // 현재 연동 상태 반환
    return HttpResponse.json<HpeDetailType | null>(hpeConnectionState);

    // 초기 연동된 상태로 테스트하려면 아래 주석 해제
    // return HttpResponse.json<HpeDetailType>(hpeMockData);
  }),

  /**
   * HPE 연동/수정
   * PUT /api/v1/system-settings/hpe
   */
  http.put(BASE_URL, async ({ request }) => {
    const body = (await request.json()) as UpdateHpeRequestType;

    // 입력값 검증 시뮬레이션
    if (!body.id || !body.password || !body.serverIp) {
      return HttpResponse.json(
        {
          code: "HPE_UPDATE_FAILED",
          message: "필수 필드를 모두 입력해주세요.",
        },
        { status: 400 },
      );
    }

    // IP 형식 검증
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(body.serverIp)) {
      return HttpResponse.json(
        {
          code: "HPE_UPDATE_FAILED",
          message: "Server IP 형식이 올바르지 않습니다.",
        },
        { status: 400 },
      );
    }

    // 인증 실패 시뮬레이션 (특정 조건)
    if (body.password === "wrong") {
      return HttpResponse.json(
        {
          code: "HPE_AUTHENTICATION_FAILED",
          message: "ID 또는 비밀번호가 올바르지 않습니다.",
        },
        { status: 401 },
      );
    }

    // 서버 연결 실패 시뮬레이션 (특정 IP)
    if (body.serverIp === "0.0.0.0") {
      return HttpResponse.json(
        {
          code: "HPE_SERVER_UNREACHABLE",
          message: "HPE 서버에 연결할 수 없습니다.",
        },
        { status: 503 },
      );
    }

    // 성공 응답 - 상태 업데이트
    const updatedHpe: HpeDetailType = {
      id: body.id,
      serverIp: body.serverIp,
      isConnected: true,
      lastUpdatedAt: new Date().toISOString(),
    };

    // 연동 상태 저장 (GET 요청에서 반환됨)
    hpeConnectionState = updatedHpe;

    return HttpResponse.json<HpeDetailType>(updatedHpe);
  }),
];
