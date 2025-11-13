import type { MySelectOption } from "@/components/common/select";
import type {
  WorkloadImageType,
  WorkloadJobType,
  WorkloadStatusType,
} from "@/schemas/workload.schema";
import type { CoreGuide, CoreGuideImage } from "@/types/common/core.model";

export function Workload() {
  // 1. 함수로 호출 시: Number(value)
  //    -> 값을 숫자로 변환합니다. (타입 변환)
  // if (!(this instanceof Number)) {
  //   return ToNumeric(value); // 'ToNumeric'은 내부적인 변환 연산
  // }
  // 2. 생성자로 호출 시: new Number(value)
  //    -> 숫자 값을 감싸는 'Number 래퍼 객체'를 생성합니다.
  // (일반적으로 `new Number()` 사용은 권장되지 않습니다.)
  // this.internalValue = ToNumeric(value);
  // 'this'는 새로 생성된 객체입니다.
}
Workload.TITLE = "워크로드";
Workload.TITLE_ENG = "Workload";
Workload.GUIDE_TITLE = "워크로드 생성";
Workload.GUIDE_TITLE_ENG = "Create Workload";
Workload.GUIDE_DESCRIPTION = [
  "원하는 Job Type, 이미지 및 리소스, 소스 코드 등을 입력해",
  "워크로드를 생성해보세요.",
];
Workload.GUIDE_BG_IMAGE = "workload-intro-background.png";
Workload.LIST_PAGE_SIZE = 20;
Workload.SECURITY_PAGE_SIZE = 20;

Workload.JOB_TYPE_OPTIONS = [
  {
    label: "Batch",
    value: "BATCH",
  },
  {
    label: "Interactive",
    value: "INTERACTIVE",
  },
] as MySelectOption[];

Workload.STATUS_OPTIONS = [
  {
    label: "실행중",
    value: "RUNNING",
  },
  {
    label: "대기중",
    value: "PENDING",
  },
  {
    label: "에러",
    value: "ERROR",
  },
  {
    label: "종료",
    value: "COMPLETED",
  },
] as MySelectOption[];

Workload.GUIDES = [
  {
    icon: "Workload",
    title: "워크로드란?",
    description: [
      "워크로드란 워크스페이스에서 이뤄지는 잡(Job) 입니다.",
      "입력한 정보를 바탕으로 학습이 진행되도록 합니다.",
    ],
  },
  {
    icon: "Workspace01",
    title: "워크스페이스란?",
    description: [
      "워크스페이스란 팀별로 함께 사용하는 작업공간입니다.",
      "팀원이 생성한 워크로드 및 진행상황 확인이 가능합니다.",
    ],
  },
] as CoreGuide[];

Workload.GUIDE_IMAGES = [
  {
    id: "1",
    src: "/images/create-workload-guide1.png",
    alt: "워크로드 가이드 1",
  },
  {
    id: "2",
    src: "/images/create-workload-guide2.png",
    alt: "워크로드 가이드 2",
  },
  {
    id: "3",
    src: "/images/create-workload-guide3.png",
    alt: "워크로드 가이드 3",
  },
] as CoreGuideImage[];

// ------------------------------------
// 정적(Static) 메소드
// ------------------------------------

/**
 * 워크로드 잡 타입 정보 조회
 * @param jobType - 워크로드 잡 타입
 */
Workload.getJobTypeInfo = (jobType: WorkloadJobType) => {
  // 잡 타입 표시 텍스트
  let displayName = "";
  // 노드
  let nodeType = "";
  let nodeIconName = "";
  // IDE 정보
  let ideName = "";
  let ideIconName = "";

  if (jobType === "BATCH") {
    displayName = "Batch Job";

    nodeType = "single";
    nodeIconName = "SingleNode";

    ideName = "Pytorch";
    ideIconName = "pytorch";
  } else if (jobType === "INTERACTIVE") {
    displayName = "Interactive Job (IDE)";

    nodeType = "single";
    nodeIconName = "SingleNode";

    ideName = "Jupyter Notebook";
    ideIconName = "jupyter";
  } else if (jobType === "DISTRIBUTED") {
    displayName = "Distributed Job";

    nodeType = "multi";
    nodeIconName = "MultiNode";

    ideName = "Pytorch";
    ideIconName = "pytorch";
  }

  return { displayName, nodeType, ideName, ideIconName, nodeIconName };
};

/**
 * 워크로드 상태 정보 조회
 * @param status - 워크로드 상태
 */
Workload.getStatusInfo = (status: WorkloadStatusType) => {
  // 상태 표시 텍스트
  let displayName = "";
  // 상태 색상
  let colorVariant = "";
  // 상태 아이콘
  let icon = "";

  if (status === "RUNNING") {
    displayName = "실행중";
    colorVariant = "blue";
    icon = "Play";
  } else if (status === "PENDING") {
    displayName = "대기중";
    colorVariant = "green";
    icon = "Waiting";
  } else if (status === "COMPLETED") {
    displayName = "종료";
    colorVariant = "black";
    icon = "PowerBold";
  } else if (status === "FAILED") {
    displayName = "에러";
    colorVariant = "red";
    icon = "Error";
  }

  return { displayName, colorVariant, icon };
};

/**
 * 워크로드 이미지 타입 정보 조회
 * @param imageType - 워크로드 이미지 타입
 */
Workload.getImageTypeInfo = (imageType: WorkloadImageType) => {
  // 이미지 타입 표시 텍스트
  let displayName = "";
  // 이미지 타입 아이콘
  let icon = "";

  if (imageType === "BUILTIN") {
    displayName = "Built-in";
    icon = "builtin";
  } else if (imageType === "HUB") {
    displayName = "Hub";
    icon = "hub";
  } else if (imageType === "CUSTOM") {
    displayName = "Custom";
    icon = "custom";
  }

  return { displayName, icon };
};
