"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

import {
  kubernetesResourcePageAtom,
  kubernetesResourceSearchTextAtom,
  kubernetesResourceStatusAtom,
  kubernetesSelectedResourceNameAtom,
} from "@/domain/kubernetes-monitoring/atom/kubernetes-monitoring.atom";
import { KubernetesResourceCard } from "@/domain/kubernetes-monitoring/components/kubernetes-resource-card";
import {
  DaemonsetsSection,
  DeploymentsSection,
  NamespacesSection,
  NodesSection,
  PersistentVolumesSection,
  PodsSection,
  ServicesSection,
  StatefulsetsSection,
} from "@/domain/kubernetes-monitoring/components/kubernetes-resource-sections";
import {
  KUBERNETES_RESOURCE_NAMES,
  type KubernetesResourceName,
} from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";
import { AsideDetailContainer } from "@/styles/layers/aside-detail-layers.styled";

/**
 * 선택된 리소스에 해당하는 섹션 컴포넌트 렌더링
 */
function renderResourceSection(resourceName: KubernetesResourceName) {
  switch (resourceName) {
    case "Nodes":
      return <NodesSection />;
    case "Service":
      return <ServicesSection />;
    case "Daemonsets":
      return <DaemonsetsSection />;
    case "PersistentVolume":
      return <PersistentVolumesSection />;
    case "Namespaces":
      return <NamespacesSection />;
    case "Deployments":
      return <DeploymentsSection />;
    case "Statefulsets":
      return <StatefulsetsSection />;
    case "Pods":
      return <PodsSection />;
    default:
      return <PodsSection />;
  }
}

export function KubernetesMonitoringAside() {
  const [selectedResourceName, setSelectedResourceName] = useAtom(
    kubernetesSelectedResourceNameAtom,
  );

  const resetPage = useResetAtom(kubernetesResourcePageAtom);
  const resetSearchText = useResetAtom(kubernetesResourceSearchTextAtom);
  const resetStatus = useResetAtom(kubernetesResourceStatusAtom);

  /**
   * 리소스 변경 핸들러
   * 리소스 변경 시 페이지, 필터, 검색어를 모두 초기화
   */
  const handleResourceChange = (resourceName: KubernetesResourceName) => {
    setSelectedResourceName(resourceName);
    resetPage();
    resetStatus();
    resetSearchText();
  };

  return (
    <AsideDetailContainer>
      <Header>
        <Typography.Text variant="title-2">
          쿠버네티스 리소스 정보
        </Typography.Text>
      </Header>
      <Bridge>
        {KUBERNETES_RESOURCE_NAMES.map((resourceName) => (
          <KubernetesResourceCard
            key={resourceName}
            resourceName={resourceName}
            count={999}
            isActive={resourceName === selectedResourceName}
            onClick={() => handleResourceChange(resourceName)}
          />
        ))}
      </Bridge>
      <Body key={selectedResourceName}>
        {renderResourceSection(selectedResourceName)}
      </Body>
    </AsideDetailContainer>
  );
}

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
`;

const Bridge = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  margin-bottom: 10px;
`;

const Body = styled.div`
  flex: 1;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  padding: 16px 20px;
  overflow: hidden;
`;
