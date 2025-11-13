import type { RegistryImageTag } from "@/types/registry/registry.model";

// 이미지 상세 정보 데모
const DEMO_REGISTRY_IMAGE = {
  id: 1,
  imageName: "Dev Snapshot  v1.2",
  workspaceName: "AstraGo - workspace",
  creator: "이수빈",
  createTime: "2025.12.21",
  description: `Dev Snapshot -V1.2 이미지는 Mosquitto MQTT 브로커를 포함하는 Docker 
이미지입니다. 이 이미지는 x86_64(amd64) 아키텍처 기반 시스템에서 실행되도록 설계
되었습니다. 해당 컨테이너 이미지는 업로드 완료 된 상태이며 태그는 V1.2까지 
생성되었습니다.

V4의 경우 검증 실패 상태였지만 관리자의 승인 요청을 통해서 사용 가능하도록 
수정 되었습니다.  취약점이 존재하지만 사용하도록 승인을 한 경우이니 사용자는 유의하여
해당 이미지를 사용하시길 바랍니다.`,
};

const TAG_LIST_DEMO: RegistryImageTag[] = Array.from(
  { length: 20 },
  (_, index) => ({
    id: index + 1,
    tag: "v21.0.0",
    imageSize: "121.1 MB",
    critical: 1,
    high: 2,
    medium: 0,
    low: 1,
    status: "APPROVED",
    createdAt: "2025.12.22",
    lastCheckedAt: "2025.12.22",
    creator: "이수빈",
    available: true,
    requestReason: "요청 사유",
    rejectReason: "반려 사유",
  }),
);

const privateRegistryImageDetailConstants = {
  // 페이지 크기
  tagPageSize: 10,
  // 취약점 목록 페이지 크기
  vulnerabilityPageSize: 10,
  // 데모 이미지 상세 정보
  demoRegistryImage: DEMO_REGISTRY_IMAGE,
  // 데모 태그 목록
  tagListDemo: TAG_LIST_DEMO,
};

export default privateRegistryImageDetailConstants;
