import { z } from "zod";

// 알림 전체 스키마
const baseAlertSchema = z.object({
  /** 알림 고유 ID */
  id: z.string().uuid(),
  /** 알림 제목 */
  title: z.string().min(1).max(200),
  /** 알림 내용 */
  content: z.string().max(1000),
  /** 알림 타입 */
  type: z.enum(["INFO", "WARNING", "ERROR", "SUCCESS"]),
  /** 생성일시 */
  createdDate: z.string().datetime(),
  /** 생성자 이름 */
  creatorName: z.string().min(1).max(100),
  /** 읽음 여부 */
  isRead: z.boolean(),
  /** 우선순위 */
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

// 알림 목록용 스키마
export const alertListSchema = baseAlertSchema.pick({
  id: true,
  title: true,
  content: true,
  type: true,
  createdDate: true,
  creatorName: true,
  isRead: true,
  priority: true,
});

// 알림 상세용 스키마
export const alertDetailSchema = baseAlertSchema;

// 타입 추출
type Alert = z.infer<typeof baseAlertSchema>;
export type AlertListType = z.infer<typeof alertListSchema>;
export type AlertDetailType = z.infer<typeof alertDetailSchema>;
export type AlertType = Alert["type"];
export type AlertPriority = Alert["priority"];
