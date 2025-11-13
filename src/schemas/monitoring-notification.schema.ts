import { z } from "zod";

// 모니터링 알림 스키마
const baseMonitoringNotificationSchema = z.object({
  /** 알림 아이디 */
  id: z.string().uuid(),
  /** 노드 이름 */
  nodeName: z.string(),
  /** IP 주소 */
  ip: z.string(),
  /** 알림 이름 */
  name: z.string(),
  /** 채널 */
  channel: z.string(),
  /** 발생일시 */
  creatorDateTime: z.string().datetime(),
  /** 알림 설명 */
  description: z.string().nullable(),
  /** 알림 설정 */
  settings: z.array(
    z.object({
      /** 항목 */
      item: z.string(),
      /** 연산자 */
      operator: z.string(),
      /** 임계값 */
      threshold: z.string(),
      /** 지속시간 */
      duration: z.string(),
    }),
  ),
});

export const monitoringNotificationListSchema =
  baseMonitoringNotificationSchema.pick({
    id: true,
    nodeName: true,
    ip: true,
    name: true,
    channel: true,
    creatorDateTime: true,
  });

export const monitoringNotificationDetailSchema =
  baseMonitoringNotificationSchema;

// type MonitoringNotification = z.infer<typeof baseMonitoringNotificationSchema>;
export type MonitoringNotificationListType = z.infer<
  typeof monitoringNotificationListSchema
>;
export type MonitoringNotificationDetailType = z.infer<
  typeof monitoringNotificationDetailSchema
>;
export type MonitoringNotificationSettingType =
  MonitoringNotificationDetailType["settings"][number];
