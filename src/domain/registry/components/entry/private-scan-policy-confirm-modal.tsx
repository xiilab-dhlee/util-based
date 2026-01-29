"use client";

import { VulnerabilityScanPolicyUpdateRequestImageType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ScanPolicyConfirmModal } from "@/domain/registry/components/entry/scan-policy-confirm-modal";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";

export function PrivateScanPolicyConfirmModal() {
  return (
    <ScanPolicyConfirmModal
      imageType={VulnerabilityScanPolicyUpdateRequestImageType.PRIVATE}
      eventName={REGISTRY_EVENTS.openPrivateScanPolicyConfirmModal}
      title="개인 레지스트리 이미지 보안 검사"
      enableMessage={
        <>
          개인 레지스트리 이미지 보안 자동 검사를 설정하시겠습니까?
          <br />
          설정 시 업로드와 보안 검사가 함께 진행됩니다.
        </>
      }
      disableMessage={
        <>
          개인 레지스트리 이미지 보안 자동 검사를 해제하시겠습니까?
          <br />
          해제 시 보안 검사는 수동으로 진행하게 됩니다.
        </>
      }
    />
  );
}
