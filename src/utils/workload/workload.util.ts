import type {
  WorkloadImageType,
  WorkloadJobType,
  WorkloadStatusType,
} from "@/schemas/workload.schema";

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
    label = "Batch Job";

    nodeType = "single";
    nodeIcon = "SingleNode";

    ideName = "Pytorch";
    ideIcon = "pytorch";
  } else if (jobType === "INTERACTIVE") {
    label = "Interactive Job (IDE)";

    nodeType = "single";
    nodeIcon = "SingleNode";

    ideName = "Jupyter Notebook";
    ideIcon = "jupyter";
  } else if (jobType === "DISTRIBUTED") {
    label = "Distributed Job";

    nodeType = "multi";
    nodeIcon = "MultiNode";

    ideName = "Pytorch";
    ideIcon = "pytorch";
  }

  return { label, nodeType, ideName, ideIcon, nodeIcon };
};

/**
 * 워크로드 상태 정보 조회
 * @param status - 워크로드 상태
 */
export const getWorkloadStatusInfo = (status?: WorkloadStatusType | "ALL") => {
  // 상태 표시 텍스트
  let label = "";
  // 상태 색상
  let colorVariant = "";
  // 상태 아이콘
  let icon = "";

  if (status === "RUNNING") {
    label = "실행중";
    colorVariant = "blue";
    icon = "Play";
  } else if (status === "PENDING") {
    label = "대기중";
    colorVariant = "green";
    icon = "Waiting";
  } else if (status === "COMPLETED") {
    label = "종료";
    colorVariant = "black";
    icon = "PowerBold";
  } else if (status === "FAILED") {
    label = "에러";
    colorVariant = "red";
    icon = "Error";
  } else if (status === "ALL") {
    label = "전체";
    icon = "Entire";
  }

  return { label, colorVariant, icon };
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
    label = "Built-in";
    icon = "builtin";
  } else if (imageType === "HUB") {
    label = "Hub";
    icon = "hub";
  } else if (imageType === "CUSTOM") {
    label = "Custom";
    icon = "custom";
  }

  return { label, icon };
};
