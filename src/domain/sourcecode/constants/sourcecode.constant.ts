import type { DropdownOption } from "xiilab-ui";

import type { CoreGuideImage } from "@/shared/types/core.model";

export const SOURCECODE_TYPE_OPTIONS: DropdownOption[] = [
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

export const SOURCECODE_GUIDE_IMAGES: CoreGuideImage[] = [
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
