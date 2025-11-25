"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

import {
  kubernetesResourceKeywordAtom,
  kubernetesResourcePageAtom,
  kubernetesResourceStatusAtom,
  kubernetesSelectedResourceNameAtom,
} from "@/domain/kubernetes-monitoring/atom/kubernetes-monitoring.atom";
import {
  KUBERNETES_RESOURCE_LIST_PAGE_SIZE,
  KUBERNETES_RESOURCE_NAMES,
} from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";
import { useKubernetesResourceList } from "@/domain/kubernetes-monitoring/hooks/use-kubernetes-resource-list.hook";
import { AsideDetailContainer } from "@/styles/layers/aside-detail-layers.styled";
import { KubernetesResourceCard } from "./kubernetes-resource-card";
import { KubernetesResourceListBody } from "./kubernetes-resource-list-body";
import { KubernetesResourceListFilter } from "./kubernetes-resource-list-filter";
import { KubernetesResourceListFooter } from "./kubernetes-resource-list-footer";

export function KubernetesMonitoringAside() {
  const [selectedResourceName, setSelectedResourceName] = useAtom(
    kubernetesSelectedResourceNameAtom,
  );
  const [pageNo, setPageNo] = useAtom(kubernetesResourcePageAtom);
  const [keyword] = useAtom(kubernetesResourceKeywordAtom);
  const [status] = useAtom(kubernetesResourceStatusAtom);

  const { data, isLoading, isError } = useKubernetesResourceList({
    resourceName: selectedResourceName,
    pageNo,
    pageSize: KUBERNETES_RESOURCE_LIST_PAGE_SIZE,
    keyword,
    status,
  });

  const totalSize = data?.data.totalSize ?? 0;
  const currentPage = data?.data.currentPage ?? pageNo;

  // biome-ignore lint: keyword 변경 시 페이지를 1로 리셋하기 위한 의도적인 의존성
  useEffect(() => {
    setPageNo(1);
  }, [keyword]);

  const handleChangePage = (page: number) => {
    setPageNo(page);
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
            onClick={() => {
              setSelectedResourceName(resourceName);
              setPageNo(1);
            }}
          />
        ))}
      </Bridge>
      <Body>
        <KubernetesResourceListFilter />
        <KubernetesResourceListBody
          items={data?.data.content ?? []}
          isLoading={isLoading}
          isError={isError}
        />
        <KubernetesResourceListFooter
          total={totalSize}
          page={currentPage}
          pageSize={KUBERNETES_RESOURCE_LIST_PAGE_SIZE}
          onChange={handleChangePage}
          isLoading={isLoading}
        />
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
  grid-template-columns: repeat(5, 1fr);
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
