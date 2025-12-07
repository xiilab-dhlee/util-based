import { smtpResponseSchema } from "@/domain/system-setting/schemas/smtp.schema";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * SMTP 설정 Mock 데이터
 */
export const smtpMock = makeMock(smtpResponseSchema);
