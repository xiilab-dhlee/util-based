import { z } from "zod";

import { rejectResourceRequestBody } from "@/api/generated/admin-workspace/admin-workspace.zod";
import {
  REJECT_REASON_MAX_LENGTH,
  REJECT_REQUEST_RESOURCE_FORM_ERROR_MESSAGES,
} from "@/domain/request-resource/constants/reject-request-resource-form-error-message";

export const rejectResourceRequestBodyExtended =
  rejectResourceRequestBody.extend({
    rejectReason: z
      .string()
      .trim()
      .min(1, {
        message:
          REJECT_REQUEST_RESOURCE_FORM_ERROR_MESSAGES.rejectReason.too_small,
      })
      .max(REJECT_REASON_MAX_LENGTH, {
        message:
          REJECT_REQUEST_RESOURCE_FORM_ERROR_MESSAGES.rejectReason.too_big,
      })
      .describe("반려 사유 (한글 1,000자, 영문 2,000자)"),
  });

export type RejectResourceFormType = z.infer<
  typeof rejectResourceRequestBodyExtended
>;
