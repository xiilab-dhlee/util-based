import type { LabelColorVariant } from "xiilab-ui";

import type {
  TerminatedWorkloadItemReclaimStatus,
  WorkloadStatusResponseWorkloadStatus,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  RECLAIM_STATUS_COLOR_MAP,
  RECLAIM_STATUS_LABEL_MAP,
  WORKLOAD_IMAGE_TYPE_LABEL_MAP,
  WORKLOAD_JOB_TYPE_DETAIL_LABEL_MAP,
  WORKLOAD_STATUS_LABEL_MAP,
} from "@/domain/workload/constants/workload.constant";
import type {
  WorkloadImageType,
  WorkloadJobType,
} from "@/domain/workload/schemas/workload.schema";
import { ALL_OPTION } from "@/shared/constants/core.constant";

/**
 * 워크로드 잡 타입 정보 조회
 * @param jobType - 워크로드 잡 타입
 */
export const getWorkloadJobTypeInfo = (jobType?: WorkloadJobType) => {
  // 잡 타입 표시 텍스트
  let label = "";
  // 노드
  let nodeType = "";
  let nodeIcon = "";
  // IDE 정보
  let ideName = "";
  let ideIcon = "";

  if (jobType === "BATCH") {
    label = WORKLOAD_JOB_TYPE_DETAIL_LABEL_MAP.BATCH;

    nodeType = "single";
    nodeIcon = "SingleNode";

    ideName = "Pytorch";
    ideIcon = "pytorch";
  } else if (jobType === "INTERACTIVE") {
    label = WORKLOAD_JOB_TYPE_DETAIL_LABEL_MAP.INTERACTIVE;

    nodeType = "single";
    nodeIcon = "SingleNode";

    ideName = "Jupyter Notebook";
    ideIcon = "jupyter";
  } else if (jobType === "DISTRIBUTED") {
    label = WORKLOAD_JOB_TYPE_DETAIL_LABEL_MAP.DISTRIBUTED;

    nodeType = "multi";
    nodeIcon = "MultiNode";

    ideName = "Pytorch";
    ideIcon = "pytorch";
  }

  return { label, nodeType, ideName, ideIcon, nodeIcon };
};

/**
 * 워크로드 상태 정보 조회
 * @param status - 워크로드 상태 (필터 상태 값 포함, 로컬 + Orval 상태)
 */
type WorkloadStatusInfo = {
  label: string;
  colorVariant: string;
  icon: string;
};

type WorkloadStatusInfoByStatus = Omit<WorkloadStatusInfo, "colorVariant"> & {
  colorVariant: LabelColorVariant;
};

const WORKLOAD_STATUS_INFO_MAP: Record<
  WorkloadStatusResponseWorkloadStatus,
  WorkloadStatusInfoByStatus
> = {
  RUNNING: {
    label: WORKLOAD_STATUS_LABEL_MAP.RUNNING,
    colorVariant: "blue",
    icon: "Play",
  },
  PENDING: {
    label: WORKLOAD_STATUS_LABEL_MAP.PENDING,
    colorVariant: "green",
    icon: "Waiting",
  },
  CREATING: {
    label: WORKLOAD_STATUS_LABEL_MAP.CREATING,
    colorVariant: "green",
    icon: "Waiting",
  },
  TERMINATING: {
    label: WORKLOAD_STATUS_LABEL_MAP.TERMINATING,
    colorVariant: "orange",
    icon: "Waiting",
  },
  TERMINATED: {
    label: WORKLOAD_STATUS_LABEL_MAP.TERMINATED,
    colorVariant: "black",
    icon: "PowerBold",
  },
  ERROR: {
    label: WORKLOAD_STATUS_LABEL_MAP.ERROR,
    colorVariant: "red",
    icon: "Error",
  },
};

const DEFAULT_WORKLOAD_STATUS_COLOR = "var(--color-purple-07)";

export const getWorkloadStatusInfo = (
  status?:
    | WorkloadStatusResponseWorkloadStatus
    | typeof ALL_OPTION.value
    | "ALL",
): WorkloadStatusInfo => {
  const defaultInfo: WorkloadStatusInfo = {
    label: "",
    colorVariant: DEFAULT_WORKLOAD_STATUS_COLOR,
    icon: "",
  };

  if (status === "ALL" || status === ALL_OPTION.value) {
    return {
      label: ALL_OPTION.label,
      colorVariant: DEFAULT_WORKLOAD_STATUS_COLOR,
      icon: "Entire",
    };
  }

  if (!status) {
    return defaultInfo;
  }

  return WORKLOAD_STATUS_INFO_MAP[status] ?? defaultInfo;
};

export const getWorkloadStatusInfoByStatus = (
  status: WorkloadStatusResponseWorkloadStatus,
): WorkloadStatusInfoByStatus =>
  WORKLOAD_STATUS_INFO_MAP[status] ?? {
    label: WORKLOAD_STATUS_LABEL_MAP[status] || "",
    colorVariant: "black",
    icon: "",
  };

/**
 * 워크로드 이미지 타입 정보 조회
 * @param imageType - 워크로드 이미지 타입
 */
export const getWorkloadImageTypeInfo = (imageType?: WorkloadImageType) => {
  // 이미지 타입 표시 텍스트
  let label = "";
  // 이미지 타입 아이콘
  let icon = "";

  if (imageType === "BUILTIN") {
    label = WORKLOAD_IMAGE_TYPE_LABEL_MAP.BUILTIN;
    icon = "BuiltInImage";
  } else if (imageType === "HUB") {
    label = WORKLOAD_IMAGE_TYPE_LABEL_MAP.HUB;
    icon = "Hub";
  } else if (imageType === "INTERNAL_REGISTRY") {
    label = WORKLOAD_IMAGE_TYPE_LABEL_MAP.INTERNAL_REGISTRY;
    icon = "PrivateRegistry";
  } else if (imageType === "EXTERNAL_REGISTRY") {
    label = WORKLOAD_IMAGE_TYPE_LABEL_MAP.EXTERNAL_REGISTRY;
    icon = "PublicRegistry";
  }

  return { label, icon };
};

/**
 * 워크로드 상태에 따른 액션 버튼 활성화 상태 반환
 * 여러 컴포넌트에서 재사용 가능
 */
export interface WorkloadActionStates {
  canAccessLog: boolean; // 로그 접근 가능
  canAccessTerminal: boolean; // 웹터미널 접근 가능
  canAccessPort: boolean; // 포트 접근 가능 (status만 체크, ports/imageType은 별도)
  canAccessMonitoring: boolean; // 모니터링 접근 가능
  canAccessFileList: boolean; // 파일 목록 접근 가능
  canAccessDetails: boolean; // 상세 정보 접근 가능
  canAccessEventHistory: boolean; // 이벤트 이력 접근 가능
  canEditDetails: boolean; // 상세 정보 수정 가능
  canStop: boolean; // 종료 가능
  canRestart: boolean; // 재시작 가능
  canDelete: boolean; // 삭제 가능
}

export function getWorkloadActionStates(
  status: WorkloadStatusResponseWorkloadStatus,
): WorkloadActionStates {
  return {
    // 로그 접근: RUNNING / TERMINATED
    canAccessLog: status === "RUNNING" || status === "TERMINATED",

    // 웹터미널 접근: RUNNING만
    canAccessTerminal: status === "RUNNING",

    // 포트 접근: RUNNING만 (ports, imageType은 별도 체크 필요)
    canAccessPort: status === "RUNNING",

    // 모니터링 접근: RUNNING / TERMINATING / TERMINATED
    canAccessMonitoring:
      status === "RUNNING" ||
      status === "TERMINATING" ||
      status === "TERMINATED",

    // 파일 목록 접근: RUNNING만
    canAccessFileList: status === "RUNNING",

    // 상세 정보 접근: 모든 상태
    canAccessDetails: true,

    // 이벤트 이력 접근: 모든 상태
    canAccessEventHistory: true,

    // 상세 정보 수정: 모든 상태
    canEditDetails: true,

    // 종료: CREATING / PENDING / RUNNING / TERMINATING / ERROR (TERMINATED 제외)
    canStop: status !== "TERMINATED",

    // 재시작: TERMINATED만
    canRestart: status === "TERMINATED",

    // 삭제: TERMINATED만
    canDelete: status === "TERMINATED",
  };
}

/**
 * 리소스 회수 상태 정보 조회
 */
export function getReclaimStatusInfo(
  status: TerminatedWorkloadItemReclaimStatus,
) {
  return {
    label: RECLAIM_STATUS_LABEL_MAP[status],
    color: RECLAIM_STATUS_COLOR_MAP[status],
  };
}
