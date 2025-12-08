import { HttpResponse, http } from "msw";

import {
  type CreateSmtpRequestPayload,
  createSmtpRequestSchema,
  type UpdateSmtpRequestPayload,
  updateSmtpRequestSchema,
} from "@/domain/system-setting/schemas/smtp.schema";
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
    const json = (await request.json()) as unknown;
    const body: CreateSmtpRequestPayload = createSmtpRequestSchema.parse(json);

    return HttpResponse.json({
      id: 1,
      ...body,
    });
  }),

  // SMTP 설정 수정
  http.patch("/api/v1/smtp", async ({ request }) => {
    const json = (await request.json()) as unknown;
    const body: UpdateSmtpRequestPayload = updateSmtpRequestSchema.parse(json);
    return HttpResponse.json(body);
  }),

  // SMTP 설정 삭제
  http.delete("/api/v1/smtp/:id", () => {
    return HttpResponse.json({ success: true });
  }),
];
