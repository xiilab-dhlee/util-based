import { z } from "zod";

// 워크로드 스키마
const baseWorkloadSchema = z.object({
  /** 워크로드 아이디 */
  id: z.string().uuid(),
  /** 워크스페이스 이름 */
  workspaceName: z.string(),
  /** 워크스페이스 아이디 */
  workspaceId: z.string(),
  /** 워크로드 이름 */
  workloadName: z.string(),
  /** 워크로드 설명 */
  description: z.string().nullable(),
  /** 작업 유형 */
  jobType: z.enum(["BATCH", "INTERACTIVE", "DISTRIBUTED"]),
  /** 고정 여부 */
  isPinned: z.boolean(),
  /** 사용자 이름 */
  creatorName: z.string(),
  /** 라벨 */
  labels: z.array(z.string()),
  /** 상태 */
  status: z.enum(["RUNNING", "PENDING", "COMPLETED", "FAILED"]),
  /** 경과 시간 */
  elapsedTime: z.string().datetime(),
  /** 생성일 */
  creatorDate: z.string().datetime(),
  /** 이미지 */
  image: z.object({
    /** 타입 */
    type: z.enum(["BUILTIN", "HUB", "CUSTOM"]),
    /** 이미지 이름 */
    name: z.string(),
  }),

  /** 환경 변수 */
  envs: z.array(
    z.object({
      /** 아이디 */
      id: z.string(),
      /** 환경 변수 키 */
      envKey: z.string(),
      /** 환경 변수 값 */
      envValue: z.string(),
    }),
  ),
  /** 포트 */
  ports: z.array(
    z.object({
      /** 아이디 */
      id: z.string(),
      /** 포트 번호 */
      port: z.string(),
      /** 포트 이름 */
      portName: z.string(),
      /** 포트 주소 */
      url: z.string(),
    }),
  ),
  /** 소스코드 */
  sourcecodes: z.array(
    z.object({
      /** 아이디 */
      id: z.string(),
      /** 제목 */
      title: z.string(),
      /** 경로 */
      path: z.string(),
      /** 타입 */
      type: z.string(),
    }),
  ),
  /** 모델 */
  volumes: z.array(
    z.object({
      /** 아이디 */
      id: z.string(),
      /** 제목 */
      title: z.string(),
      /** 스토리지명 */
      storage: z.string(),
      /** 경로 */
      path: z.string(),
      /** 볼륨 크기 */
      volumeSize: z.number(),
      /** 라벨 */
      labels: z.array(z.string()),
    }),
  ),
  /** 이벤트 */
  events: z.array(
    z.object({
      /** 아이디 */
      id: z.string(),
      /** 이름 */
      name: z.string(),
      /** 경과 시간 */
      elapsedTime: z.string(),
      /** 출처 */
      from: z.string(),
      /** 메시지 */
      message: z.string(),
      /** 상태 */
      status: z.enum(["warning", "normal"]),
    }),
  ),
});

export const workloadListSchema = baseWorkloadSchema.pick({
  id: true,
  workspaceId: true,
  workloadName: true,
  jobType: true,
  isPinned: true,
  creatorName: true,
  labels: true,
  status: true,
  elapsedTime: true,
  creatorDate: true,
});

export const workloadDetailSchema = baseWorkloadSchema;

type Workload = z.infer<typeof baseWorkloadSchema>;
export type WorkloadListType = z.infer<typeof workloadListSchema>;
export type WorkloadDetailType = z.infer<typeof workloadDetailSchema>;
export type WorkloadEnvType = Workload["envs"][number];
export type WorkloadPortType = Workload["ports"][number];
export type WorkloadSourcecodeType = Workload["sourcecodes"][number];
export type WorkloadVolumeType = Workload["volumes"][number];
export type WorkloadEventType = Workload["events"][number];
export type WorkloadStatusType = Workload["status"];
export type WorkloadEventStatusType = WorkloadEventType["status"];
export type WorkloadJobType = Workload["jobType"];
export type WorkloadImageType = Workload["image"]["type"];
