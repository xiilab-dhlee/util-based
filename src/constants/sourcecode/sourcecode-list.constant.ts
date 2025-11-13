import type { MySelectOption } from "@/components/common/select";
import type { SourcecodeParameterType } from "@/schemas/sourcecode.schema";

interface GuideImage {
  id: string;
  src: string;
  alt: string;
}

const CODE_TYPE: MySelectOption[] = [
  {
    label: "GitHub",
    value: "GITHUB",
  },
  {
    label: "GitLab",
    value: "GITLAB",
  },
  {
    label: "Bitbucket",
    value: "BITBUCKET",
  },
];

const PARAMETER_DEMO: SourcecodeParameterType[] = [
  {
    key: "DATABASE_URL1234567890asdfasdfadfasdfadfadsfafd",
    value:
      "postgresql://username:password1234567890dfadsfadsfadsfadsfadsfasdfafds",
  },
  {
    key: "DATABASE_URL",
    value: "postgresql://username:password",
  },
  {
    key: "DATABASE_URL",
    value: "postgresql://username:password",
  },
  {
    key: "DATABASE_URL",
    value: "postgresql://username:password",
  },
  {
    key: "DATABASE_URL",
    value: "postgresql://username:password",
  },
  {
    key: "DATABASE_URL",
    value: "postgresql://username:password",
  },
  {
    key: "DATABASE_URL",
    value: "postgresql://username:password",
  },
  {
    key: "DATABASE_URL",
    value: "postgresql://username:password",
  },
];

// 가이드 이미지 목록
const GUIDE_IMAGES: GuideImage[] = [
  {
    id: "sourcecode-guide-1",
    src: "/images/create-sourcecode-guide.png",
    alt: "소스코드 생성 가이드 1",
  },
  {
    id: "sourcecode-guide-2",
    src: "/images/create-sourcecode-guide.png",
    alt: "소스코드 생성 가이드 2",
  },
  {
    id: "sourcecode-guide-3",
    src: "/images/create-sourcecode-guide.png",
    alt: "소스코드 생성 가이드 3",
  },
];

const sourcecodeListConstants = {
  // 소스코드 타입 셀렉트 옵션
  codeType: CODE_TYPE,
  // 페이지 크기
  pageSize: 20,
  parameterDemo: PARAMETER_DEMO,
  // 가이드 이미지
  guideImages: GUIDE_IMAGES,
};

export default sourcecodeListConstants;
