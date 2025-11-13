import type { MySelectOption } from "@/components/common/select";
import type { PageGuideItemType } from "@/layouts/common/page-guide";
import type { PrivateRegistryImage } from "@/types/private-registry/private-registry.model";

/** 내부 레지스트리 상태 옵션 */
const STATUS: MySelectOption[] = [
  { label: "상태", value: "" },
  { label: "완료", value: "SUCCESSED" },
  { label: "진행중", value: "RUNNING" },
];

/** 내부 레지스트리 정렬 옵션 */
const SORT_ORDER: MySelectOption[] = [
  { label: "최신순", value: "latest" },
  { label: "오래된순", value: "oldest" },
  { label: "이름순", value: "name" },
];

/** 가이드 이미지 정보 */
const GUIDE_IMAGES = [
  {
    id: "1",
    src: "/images/create-workload-guide1.png",
    alt: "컨테이너 이미지 생성 가이드",
    title: "컨테이너 이미지 생성",
    description: "내부 레지스트리 컨테이너 이미지 생성.",
    stepLabel: "TIP 1",
  },
  {
    id: "2",
    src: "/images/create-workload-guide2.png",
    alt: "취약점 확인 및 수정 가이드",
    title: "취약점 확인 및 수정",
    description: "취약점 발견 시, 수정 후 이미지 재생성.",
    stepLabel: "TIP 2",
  },
  {
    id: "3",
    src: "/images/create-workload-guide3.png",
    alt: "태그 확인 및 검증 가이드",
    title: "태그 확인 및 검증",
    description: "생성 후, 이미지 상세에서 태그 확인 및 검증.",
    stepLabel: "TIP 3",
  },
];

/** 테이블 컬럼 설정 */
const TABLE_COLUMNS = [
  {
    id: "checkbox",
    textAlign: "center" as const,
    columnName: "",
    width: "40px",
  },
  {
    id: "name",
    textAlign: "left" as const,
    columnName: "컨테이너 이미지 이름",
    width: "200px",
  },
  {
    id: "tagInfo",
    textAlign: "left" as const,
    columnName: "최신 태그 / 개수",
    width: "150px",
  },
  {
    id: "pullCount",
    textAlign: "center" as const,
    columnName: "다운로드 횟수",
    width: "120px",
  },
  {
    id: "creator",
    textAlign: "center" as const,
    columnName: "생성자",
    width: "100px",
  },
  {
    id: "createDate",
    textAlign: "center" as const,
    columnName: "생성일",
    width: "120px",
  },
  {
    id: "description",
    textAlign: "left" as const,
    columnName: "설명",
    width: "300px",
  },
  {
    id: "status",
    textAlign: "center" as const,
    columnName: "업로드 상태",
    width: "100px",
  },
];

const LIST_DEMO: PrivateRegistryImage[] = Array.from(
  { length: 20 },
  (_, index) => ({
    id: index + 1,
    projectId: 101,
    name: "nginx-custom",
    description: "커스텀 nginx 웹서버 이미지",
    tagCnt: 5,
    pullCnt: 234,
    createTime: "2024-01-15T09:30:00Z",
    updateTime: "2024-01-20T14:45:00Z",
    status: "SUCCESSED",
  }),
);

const GUIDES: PageGuideItemType[] = [
  {
    iconName: "Image",
    title: "내부 레지스트리란?",
    description: [
      "조직 내부에서 사용하는 컨테이너 이미지를 저장하고 관리하는",
      "전용 저장소입니다. 인터넷 연결 없이 사용하실 수 있습니다.",
    ],
  },
  {
    iconName: "Security",
    title: "컨테이너 이미지란?",
    description: [
      "애플리케이션 실행에 필요한 프로그램, 라이브러리, 설정 파일 등을",
      "하나로 묶은 실행 패키지입니다.",
    ],
  },
];

const privateRegistryListConstants = {
  status: STATUS,
  sortOrder: SORT_ORDER,
  guideImages: GUIDE_IMAGES,
  tableColumns: TABLE_COLUMNS,
  listDemo: LIST_DEMO,
  guides: GUIDES,
};

export default privateRegistryListConstants;
