import type { MySelectOption } from "@/components/common/select";
import type { Credential } from "@/types/credential/credential.model";

const TYPE: MySelectOption[] = [
  {
    label: "GitHub",
    value: "GITHUB",
  },
  {
    label: "Docker",
    value: "DOCKER",
  },
];

const LIST_DEMO: Credential[] = [
  {
    id: 1,
    name: "GitHub",
    description: "GitHub 크레덴셜",
    type: "GIT",
    createdAt: "2025-08-21T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Docker",
    description: "Docker 크레덴셜",
    type: "DOCKER",
    createdAt: "2025-08-21T00:00:00.000Z",
  },
];

const credentialListConstants = {
  type: TYPE,
  listDemo: LIST_DEMO,
};

export default credentialListConstants;
