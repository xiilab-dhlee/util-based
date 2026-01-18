"use client";

import { useEffect, useState } from "react";
import { Icon, InfoModal } from "xiilab-ui";

import { useGetResourceYaml } from "@/api/generated/admin-k8s/admin-k8s";
import { openKubernetesYamlModalAtom } from "@/domain/kubernetes-monitoring/atom/kubernetes-monitoring.atom";
import type { K8sResourceModalPayload } from "@/domain/kubernetes-monitoring/types/kubernetes-monitoring.type";
import { CodeViewer } from "@/shared/components/terminal/code-viewer";
import { KUBERNETES_MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/**
 * 쿠버네티스 리소스 YAML 모달 컴포넌트
 *
 * PubSub 패턴을 사용하여 리소스 정보를 수신하고 YAML API를 호출합니다.
 */
export function ViewYamlLogModal() {
  const { open, onClose } = useGlobalModal(openKubernetesYamlModalAtom);

  const [resourceInfo, setResourceInfo] =
    useState<K8sResourceModalPayload | null>(null);

  useEffect(() => {
    if (!open && resourceInfo) {
      setResourceInfo(null);
    }
  }, [open, resourceInfo]);

  // PubSub 이벤트 구독 - 리소스 정보 수신
  useSubscribe<K8sResourceModalPayload>(
    KUBERNETES_MONITORING_EVENTS.sendResourceYaml,
    (data) => {
      setResourceInfo(data);
    },
  );

  // YAML API 호출
  const { data, isLoading, isError } = useGetResourceYaml(
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

  const content = data?.yaml ?? "";

  return (
    <InfoModal
      modalWidth={800}
      title="YAML"
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
