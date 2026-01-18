"use client";

import { useState } from "react";
import { Icon, InfoModal } from "xiilab-ui";

import { useDescribeResource } from "@/api/generated/admin-k8s/admin-k8s";
import { openKubernetesDescribeModalAtom } from "@/domain/kubernetes-monitoring/atom/kubernetes-monitoring.atom";
import type { K8sResourceModalPayload } from "@/domain/kubernetes-monitoring/types/kubernetes-monitoring.type";
import { CodeViewer } from "@/shared/components/terminal/code-viewer";
import { KUBERNETES_MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/**
 * 쿠버네티스 리소스 Describe 모달 컴포넌트
 *
 * PubSub 패턴을 사용하여 리소스 정보를 수신하고 Describe API를 호출합니다.
 */
export function ViewDescribeModal() {
  const { open, onClose } = useGlobalModal(openKubernetesDescribeModalAtom);

  const [resourceInfo, setResourceInfo] =
    useState<K8sResourceModalPayload | null>(null);

  // PubSub 이벤트 구독 - 리소스 정보 수신
  useSubscribe<K8sResourceModalPayload>(
    KUBERNETES_MONITORING_EVENTS.sendResourceDescribe,
    (data) => {
      setResourceInfo(data);
    },
  );

  // Describe API 호출
  const { data, isLoading, isError } = useDescribeResource(
    resourceInfo?.resourceType ?? "NODE",
    resourceInfo?.name ?? "",
    {
      query: {
        enabled:
          open &&
          Boolean(resourceInfo?.resourceType) &&
          Boolean(resourceInfo?.name),
      },
    },
  );

  const content = data?.description ?? "";

  return (
    <InfoModal
      modalWidth={800}
      title="Describe"
      icon={<Icon name="Terminal" color="#fff" size={20} />}
      open={open}
      closable
      onClose={onClose}
      centered
    >
      <div style={{ height: 600 }}>
        <CodeViewer content={content} isLoading={isLoading} isError={isError} />
      </div>
    </InfoModal>
  );
}
