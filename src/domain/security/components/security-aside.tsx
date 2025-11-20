"use client";

import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { vulnerabilityListMock } from "@/mocks/data/vulnerability.mock";
import { createSecurityColumn } from "@/shared/components/column/create-security-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListPageFooter } from "@/shared/layouts/list/list-page-footer";
import type { CoreSecurityLevel } from "@/shared/types/core.interface";
import { AsideDetailContainer } from "@/styles/layers/aside-detail-layers.styled";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { subTitleStyle } from "@/styles/mixins/text";
import { RegistrySecurityLevelCard } from "./security-level-card";

const LEVELS: CoreSecurityLevel[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

export function SecurityAside() {
  return (
    <AsideDetailContainer>
      <Category>
        <Title>전체 취약점 정보</Title>
      </Category>
      <Levels>
        <RegistrySecurityLevelCard level="ALL" count={999} />
        {LEVELS.map((v) => (
          <RegistrySecurityLevelCard key={v} level={v} count={999} />
        ))}
      </Levels>
      <Category>
        <Title>사용자별 취약점 발견 이미지 정보</Title>
      </Category>
      <Body>
        <ListWrapper>
          <CustomizedTable
            columns={createSecurityColumn([
              { dataIndex: "creatorName", title: "사용자" },
              { dataIndex: "imageCount", title: "이미지 개수" },
              { dataIndex: "total", title: "취약점 개수", width: 80 },
              { dataIndex: "critical", title: "Critical" },
              { dataIndex: "high", title: "High" },
              { dataIndex: "medium", title: "Medium" },
              { dataIndex: "low", title: "Low" },
            ])}
            data={vulnerabilityListMock}
            activePadding
          />
        </ListWrapper>
        <ListPageFooter
          total={100}
          page={1}
          pageSize={14}
          onChange={() => {}}
          isLoading={false}
        />
      </Body>
    </AsideDetailContainer>
  );
}

const Category = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 14px;
`;

const Levels = styled.div`
  display: flex;
  padding: 20px 16px;
  flex-direction: row;
  background-color: #f7f9fb;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  margin-bottom: 20px;
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

const Title = styled(Typography.Text).attrs({ variant: "subtitle-2" })`
  ${subTitleStyle(5)}

  margin-left: 5px;
`;
