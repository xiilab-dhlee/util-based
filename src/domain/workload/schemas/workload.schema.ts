import { z } from "zod";

import { sourcecodeListSchema } from "@/domain/sourcecode/schemas/sourcecode.schema";
import { volumeListSchema } from "@/domain/volume/schemas/volume.schema";
import {
  WORKLOAD_IMAGE_TYPES,
  WORKLOAD_JOB_TYPES,
  WORKLOAD_STATUS,
} from "@/domain/workload/constants/workload.constant";

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
  jobType: z.enum(WORKLOAD_JOB_TYPES),
  /** 사용자 이름 */
  creatorName: z.string(),
  /** 라벨 */
  labels: z.array(z.string()),
  /** 상태 */
  status: z.enum(WORKLOAD_STATUS),
  /** 경과 시간 */
  elapsedTime: z.string().datetime(),
  /** 생성일 */
  creatorDate: z.string().datetime(),
  /** 회수 경고 회수 */
  revokeWarningCount: z.number().min(0),
  /** 회수 여부 */
  isRevoked: z.boolean(),
  /** 이미지 */
  image: z.object({
    id: z.string().uuid(),
    /** 타입 */
    type: z.enum(WORKLOAD_IMAGE_TYPES),
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
      /** 서비스 포트 번호 */
      servicePort: z.string(),
      /** 포트 이름 */
      portName: z.string(),
      /** 포트 주소 */
      url: z.string(),
    }),
  ),
  /** 소스코드 */
  sourcecodes: z.array(
    sourcecodeListSchema.extend({
      branch: z.string(),
      path: z.string(),
    }),
  ),
  /** 볼륨 */
  volumes: z.array(volumeListSchema),
  /** 실행 경로 */
  execPath: z.string().nullable(),
  /** 실행 명령어 */
  execCommand: z.string().nullable(),
  /** 보안검사 결과 */
  scanResult: z
    .object({
      /** 치명적(Critical) 취약점 수 */
      critical: z.number().int().min(0).max(9999),
      /** 높은(High) 취약점 수 */
      high: z.number().int().min(0).max(9999),
      /** 중간(Medium) 취약점 수 */
      medium: z.number().int().min(0).max(9999),
      /** 낮은(Low) 취약점 수 */
      low: z.number().int().min(0).max(9999),
    })
    .nullable(),
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
  /** GPU */
  gpuType: z.enum(["NORMAL", "MIG", "MPS"]),
  gpuName: z.literal("Tesla-V100-PCIE-32GB-SHARED"),
  gpuMemoryGb: z.number().min(0).max(100),
  gpuCount: z.number().min(0).max(100),
  /** CPU */
  cpuCore: z.number().min(0).max(100),
  /** Memory */
  memoryGb: z.number().min(0).max(100),
  /** 노드 이름 */
  nodeName: z.string().nullable(),
});

export const workloadListSchema = baseWorkloadSchema.pick({
  id: true,
  workspaceId: true,
  workloadName: true,
  jobType: true,
  creatorName: true,
  labels: true,
  status: true,
  elapsedTime: true,
  creatorDate: true,
  ports: true,
  image: true,
  revokeWarningCount: true,
  isRevoked: true,
  nodeName: true,
});

export const workloadDetailSchema = baseWorkloadSchema;

type Workload = z.infer<typeof baseWorkloadSchema>;
export type WorkloadListType = z.infer<typeof workloadListSchema>;
export type WorkloadIdType = Workload["id"];
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
