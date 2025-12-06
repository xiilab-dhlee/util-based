import classNames from "classnames";
import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";

import type { CoreResourceType } from "@/shared/types/core.interface";
import { getResourceInfo } from "@/shared/utils/resource.util";
import { UserMonitoringCategoryTitle } from "@/styles/layers/user-monitoring-layers.styled";
import { UserMonitoringResourceRecoveryChart } from "./user-monitoring-resource-recovery-chart";

const RESOURCE_TYPES: CoreResourceType[] = ["GPU", "CPU", "MEM"];

export function UserMonitoringResourceRecoveryArticle() {
  const [resource, setResource] = useState<CoreResourceType>("GPU");

  const { unit } = getResourceInfo(resource);

  const handleClickResource = (resourceType: CoreResourceType) => {
    setResource(resourceType);
  };

  return (
    <Container data-testid="user-monitoring-resource-recovery">
      <UserMonitoringCategoryTitle>
        리소스 회수 정보
      </UserMonitoringCategoryTitle>
      <ChartWrapper>
        <UserMonitoringResourceRecoveryChart series={70} />
      </ChartWrapper>

      <ResourceButtons>
        {RESOURCE_TYPES.map((v) => {
          const resourceInfo = getResourceInfo(v);
          return (
            <ResourceButton
              key={v}
              className={classNames({
                active: resource === v,
              })}
              onClick={() => handleClickResource(v)}
            >
              {resourceInfo.text}
            </ResourceButton>
          );
        })}
        {/* Radial Chart 받침대 */}
        <ChartStand>
          <Image
            src="/images/radial-support.png"
            width="70"
            height="70"
            alt="support"
            draggable={false}
          />
        </ChartStand>
        {/* Radial Chart 레이블 */}
        <ChartLabel>
          <ChartLabelBody>{resource}</ChartLabelBody>
          <ChartLabelFooter>
            <Usage>777&nbsp;</Usage>
            <Total>/ 999 {unit}</Total>
          </ChartLabelFooter>
        </ChartLabel>
      </ResourceButtons>
    </Container>
  );
}

const Container = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 280px;
  padding-left: 20px;
  padding-bottom: 30px;
  margin-bottom: 24px;
  height: 371px;

  border-left: 1px solid #292b32;
`;

const ChartWrapper = styled.div`
  position: absolute;
  top: 42px;
  left: 20px;
  width: 260px;
`;

const ChartStand = styled.div`
  position: absolute;
  bottom: calc(100%);
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 70px;

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const ChartLabel = styled.div`
  position: absolute;
  bottom: calc(100% + 57px);
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: 160px;
  border-radius: 50%;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #22242c;
`;

const ChartLabelBody = styled.div`
  width: 100%;
  color: #f5f5f5;
  font-weight: 600;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 12px;
  width: 110px;
  border-bottom: 1px solid #5d6278;
`;

const ChartLabelFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-top: 12px;
`;

const Total = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: #969696;
`;

const Usage = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #fff;
`;

const ResourceButtons = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-radius: 2px;
  padding: 4px 0;
  background-color: #22242c;
  margin-top: 5px;
`;

const ResourceButton = styled.button`
  font-weight: 400;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 96px;
  height: 100%;
  position: relative;
  color: #D3D3D3;

  &::before {
    position: absolute;
    top: calc(100% + 1px);
    left: 0;
    width: 100%;
    height: 2px;
    border-radius: 2px;
    content: "";
  }

  &.active {
    color: #fff;
    font-weight: 500;
  }

  &.active::before {
    background-color: #7274ff;
  }

  & + & {
    border-left: 1px solid #070913;
  }
`;
