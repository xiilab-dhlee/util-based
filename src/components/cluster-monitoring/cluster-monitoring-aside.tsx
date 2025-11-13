"use client";

import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { AsideDetailContainer } from "@/styles/layers/aside-detail-layers.styled";
import ClusterResourceCard from "./cluster-resource-card";
import ClusterResourceListBody from "./cluster-resource-list-body";
import ClusterResourceListFilter from "./cluster-resource-list-filter";
import ClusterResourceListFooter from "./cluster-resource-list-footer";

const RESOURCE = [
  "Nodes",
  "Service",
  "Daemonsets",
  "Containers",
  "PersistentVolume",
  "Namespaces",
  "Deployments",
  "Statefulsets",
  "Pods",
  "HPAs",
];

export function ClusterMonitoringAside() {
  return (
    <AsideDetailContainer>
      <Header>
        <Typography.Text variant="title-2">
          클러스터 리소스 정보
        </Typography.Text>
      </Header>
      <Bridge>
        {RESOURCE.map((resource) => (
          <ClusterResourceCard
            key={resource}
            resourceName={resource}
            count={999}
          />
        ))}
      </Bridge>
      <Body>
        <ClusterResourceListFilter />
        <ClusterResourceListBody />
        <ClusterResourceListFooter />
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
