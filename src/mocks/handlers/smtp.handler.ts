import { HttpResponse, http } from "msw";

import { smtpMock } from "@/mocks/data/smtp.mock";

/**
 * SMTP API 핸들러
 */
export const smtpHandlers = [
  // SMTP 설정 조회
  http.get("/api/v1/smtp", () => {
    return HttpResponse.json(smtpMock);
  }),

  // SMTP 설정 생성
  http.post("/api/v1/smtp", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      id: 1,
      ...body,
    });
  }),

  // SMTP 설정 수정
  http.patch("/api/v1/smtp", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(body);
  }),

  // SMTP 설정 삭제
  http.delete("/api/v1/smtp/:id", () => {
    return HttpResponse.json({ success: true });
  }),
];
