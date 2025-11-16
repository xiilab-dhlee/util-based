"use client";

import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Button, Typography } from "xiilab-ui";

import { REDFISH_EVENTS } from "@/constants/common/pubsub.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";
import { useGetNodeBmcInfo } from "@/hooks/node/use-get-bmc-info";
import { useGetNode } from "@/hooks/node/use-get-node";
import { useGetRedfishSystems } from "@/hooks/node/use-get-redfish-systems";
import {
  DetailContentArticle,
  DetailContentHeader,
  DetailContentKey,
  DetailContentSubTitle,
  DetailContentTitle,
} from "@/styles/layers/detail-page-layers.styled";
import {
  DetailContentFeature,
  DetailContentFeatureBody,
  DetailContentFeaturePane,
  DetailContentFeatureRow,
  DetailContentPaneValue,
} from "@/styles/layers/detail-page-vertical-layers.styled";
import { getRedfishSystemId } from "@/utils/node/redfish.util";
import { ReadonlyChassis } from "./readonly-chassis";
import { ReadonlyDevice } from "./readonly-device";
import { ReadonlyFirmware } from "./readonly-firmware";
import { ReadonlyMemory } from "./readonly-memory";
import { ReadonlyNetworkAdapter } from "./readonly-network-adapter";
import { ReadonlyPowerSupplies } from "./readonly-power-supplies";
import { ReadonlyProcessor } from "./readonly-processor";
import { ReadonlyThermal } from "./readonly-thermal";

/**
 * Redfish 연동 상태의 메인 컴포넌트
 *
 * 노드에 Redfish가 연동된 경우 표시되는 컴포넌트로,
 * 하드웨어 정보, 관리 프로세서, 케이스, 디바이스, 펌웨어, 메모리,
 * 네트워크 어댑터, 전원 공급 장치, 프로세서, 열 관리 등의
 * 다양한 Redfish 정보를 종합적으로 표시합니다.
 */
export function ReadyRedfish() {
  // Pub/Sub 메시지 발행을 위한 훅
  const publish = usePublish();

  // URL 파라미터에서 노드 이름 추출
  const { name } = useParams();

  // 노드 정보 조회
  const { data } = useGetNode(String(name));

  // BMC 정보 조회
  const { data: bmcData } = useGetNodeBmcInfo(data?.ip || "");

  // Redfish 시스템 정보 조회
  const { data: systemData } = useGetRedfishSystems(bmcData?.bmcIp || "");

  // 시스템 ID 추출
  const systemId = getRedfishSystemId(
    (systemData?.Members?.[0] as Record<string, unknown>) || {},
  );

  /**
   * BMC 정보 수정 버튼 클릭 핸들러
   *
   * BMC 데이터가 있는 경우 BMC 수정 이벤트를 발행하고,
   * 없는 경우 에러 토스트를 표시합니다.
   */
  const handleClickUpdateBmc = () => {
    if (bmcData) {
      publish(REDFISH_EVENTS.sendUpdateBmc, bmcData);
    } else {
      toast.error("노드 BMC 정보를 찾을 수 없습니다.");
    }
  };

  return (
    <>
      {/* 페이지 헤더 */}
      <DetailContentHeader>
        <DetailContentTitle>
          Red fish 연동
          <Typography.Text
            variant="body-1-2"
            as="span"
            style={{ marginLeft: 6 }}
          >
            하드웨어 장치 및 구성정보를 확인할 수 있습니다.
          </Typography.Text>
        </DetailContentTitle>
      </DetailContentHeader>

      {/* BMC 정보 헤더 섹션 */}
      <PrimaryArticle>
        <BmcItem className="first">
          <BmcItemKey>Node</BmcItemKey>
          <BmcItemValue>{name}</BmcItemValue>
        </BmcItem>
        <BmcItem>
          <BmcItemKey>ID</BmcItemKey>
          <BmcItemValue>{bmcData?.bmcUserName}</BmcItemValue>
        </BmcItem>
        <BmcItem>
          <BmcItemKey>BMC IP</BmcItemKey>
          <BmcItemValue>{bmcData?.bmcIp}</BmcItemValue>
        </BmcItem>
        <BmcItem className="last">
          <BmcItemKey>정보수정</BmcItemKey>
          <BmcItemValue>
            <Button
              variant="outlined"
              height={26}
              icon="Edit01"
              iconColor="#484848"
              iconSize={16}
              width={90}
              style={{
                fontSize: 12,
              }}
              onClick={handleClickUpdateBmc}
            >
              정보수정
            </Button>
          </BmcItemValue>
        </BmcItem>
      </PrimaryArticle>
      {/* 하드웨어 정보 섹션 */}
      <AnotherArticle>
        <DetailContentFeature className="first">
          <DetailContentSubTitle>Hardware</DetailContentSubTitle>
          <DetailContentFeatureBody>
            {/* 서버 기본 정보 */}
            <StyledDetailContentFeaturePane>
              <StyledDetailContentFeatureRow>
                <DetailContentKey>Server name</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title="10.61.2.24 server"
                >
                  10.61.2.24 server
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow>
                <DetailContentKey>State</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title="No Profile Applied"
                >
                  No Profile Applied
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow>
                <DetailContentKey>Server Profile</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title="Create profile"
                >
                  Create profile
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow>
                <DetailContentKey>Server Power</DetailContentKey>
                <DetailContentPaneValue className="truncate" title="ON">
                  ON
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow>
                <DetailContentKey>Model</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title="ProLiant DL380 Gen11"
                >
                  ProLiant DL380 Gen11
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow className="last"></StyledDetailContentFeatureRow>
            </StyledDetailContentFeaturePane>
            {/* 시스템 사양 정보 */}
            <StyledDetailContentFeaturePane>
              <StyledDetailContentFeatureRow>
                <DetailContentKey>Model</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title="ProLiant DL380 Gen11"
                >
                  ProLiant DL380 Gen11
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow>
                <DetailContentKey>Operating system</DetailContentKey>
                <DetailContentPaneValue className="truncate" title="unknown">
                  unknown
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow>
                <DetailContentKey>System ROM</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title="U54 v2.12(12/13/2023)"
                >
                  U54 v2.12(12/13/2023)
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow>
                <DetailContentKey>Memory</DetailContentKey>
                <DetailContentPaneValue className="truncate" title="48GB">
                  48GB
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow>
                <DetailContentKey>Location</DetailContentKey>
                <DetailContentPaneValue className="truncate" title="-">
                  -
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow className="last">
                <DetailContentKey>Cpu</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title="1 processor, Intel(R) Xeon(R) Bronze 3408U (4 GHz / 8-core)"
                >
                  1 processor, Intel(R) Xeon(R) Bronze 3408U (4 GHz / 8-core)
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
            </StyledDetailContentFeaturePane>
          </DetailContentFeatureBody>
        </DetailContentFeature>
        <DetailContentFeature>
          <DetailContentFeatureBody>
            {/* 전력 및 식별 정보 */}
            <StyledDetailContentFeaturePane>
              <StyledDetailContentFeatureRow>
                <DetailContentKey>Powered by</DetailContentKey>
                <DetailContentPaneValue className="truncate" title="-">
                  -
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow>
                <DetailContentKey>Maximum power</DetailContentKey>
                <DetailContentPaneValue className="truncate" title="4400 Watts">
                  4400 Watts
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow className="last"></StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow className="last"></StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow className="last"></StyledDetailContentFeatureRow>
            </StyledDetailContentFeaturePane>
            {/* 제품 정보 */}
            <StyledDetailContentFeaturePane>
              <StyledDetailContentFeatureRow>
                <DetailContentKey>Serial number</DetailContentKey>
                <DetailContentPaneValue className="truncate" title="SGH406NFFK">
                  SGH406NFFK
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow>
                <DetailContentKey>Product ID</DetailContentKey>
                <DetailContentPaneValue className="truncate" title="P52534-B21">
                  P52534-B21
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow>
                <DetailContentKey>OneView power</DetailContentKey>
                <DetailContentPaneValue className="truncate" title="4400 Watts">
                  4400 Watts
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow>
                <DetailContentKey>Asset tag</DetailContentKey>
                <DetailContentPaneValue className="truncate" title="-">
                  -
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow className="last">
                <DetailContentKey>UUID</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title="35323550-3433-4753-4834-30364E46464B"
                >
                  35323550-3433-4753-4834-30364E46464B
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
            </StyledDetailContentFeaturePane>
          </DetailContentFeatureBody>
        </DetailContentFeature>
      </AnotherArticle>

      {/* 관리 프로세서 정보 섹션 */}
      <AnotherArticle>
        <DetailContentFeature className="first last">
          <DetailContentSubTitle>Management Processor</DetailContentSubTitle>
          <DetailContentFeatureBody>
            {/* 관리 프로세서 기본 정보 */}
            <StyledDetailContentFeaturePane>
              <StyledDetailContentFeatureRow>
                <DetailContentKey>Server name</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title="10.61.2.24 server"
                >
                  10.61.2.24 server
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow>
                <DetailContentKey>State</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title="No Profile Applied"
                >
                  No Profile Applied
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow className="last">
                <DetailContentKey>Server Profile</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title="Create profile"
                >
                  Create profile
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
            </StyledDetailContentFeaturePane>
            {/* 관리 프로세서 상태 정보 */}
            <StyledDetailContentFeaturePane>
              <StyledDetailContentFeatureRow>
                <DetailContentKey>Server Power</DetailContentKey>
                <DetailContentPaneValue className="truncate" title="ON">
                  ON
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow>
                <DetailContentKey>One Time boot</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title="No one time boot"
                >
                  No one time boot
                </DetailContentPaneValue>
              </StyledDetailContentFeatureRow>
              <StyledDetailContentFeatureRow className="last"></StyledDetailContentFeatureRow>
            </StyledDetailContentFeaturePane>
          </DetailContentFeatureBody>
        </DetailContentFeature>
      </AnotherArticle>
      {/* Redfish 하드웨어 구성 요소들 */}
      <AnotherArticle>
        <ReadonlyChassis bmcIp={bmcData?.bmcIp || ""} />
      </AnotherArticle>
      <AnotherArticle>
        <ReadonlyDevice bmcIp={bmcData?.bmcIp || ""} systemId={systemId} />
      </AnotherArticle>
      <AnotherArticle>
        <ReadonlyFirmware bmcIp={bmcData?.bmcIp || ""} />
      </AnotherArticle>
      <AnotherArticle>
        <ReadonlyMemory bmcIp={bmcData?.bmcIp || ""} systemId={systemId} />
      </AnotherArticle>
      <AnotherArticle>
        <ReadonlyNetworkAdapter
          bmcIp={bmcData?.bmcIp || ""}
          systemId={systemId}
        />
      </AnotherArticle>
      <AnotherArticle>
        <ReadonlyPowerSupplies bmcIp={bmcData?.bmcIp || ""} />
      </AnotherArticle>
      <AnotherArticle>
        <ReadonlyProcessor bmcIp={bmcData?.bmcIp || ""} systemId={systemId} />
      </AnotherArticle>
      <AnotherArticle>
        <ReadonlyThermal bmcIp={bmcData?.bmcIp || ""} />
      </AnotherArticle>
    </>
  );
}

// ===== Styled Components =====

/** 헤더 컨테이너 - 노드 이름과 설명을 표시 */
const PrimaryArticle = styled(DetailContentArticle)`
  height: 50px;
  flex: none;
  flex-direction: row;
  padding: 12px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const AnotherArticle = styled(DetailContentArticle)`
  flex: none;
  padding: 12px;
  overflow: hidden;
  margin-bottom: 8px;
  flex-direction: column;
`;

const BmcItem = styled.div`
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;

  &.first {
    padding-left: 0;
  }

  &.last {
    padding-right: 0;
  }

  & + & {
    border-left: 0.5px solid #bac0c6;
  }
`;

const BmcItemKey = styled(DetailContentSubTitle)`
  margin-bottom: 0;
`;

const BmcItemValue = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: #000;
`;

const StyledDetailContentFeaturePane = styled(DetailContentFeaturePane)`
  gap: 0px;
`;

const StyledDetailContentFeatureRow = styled(DetailContentFeatureRow)`
  border-bottom: 1px dotted #e9edf2;
  padding: 5px 4px;
  height: 21px;

  &.last {
    border-color: transparent;
  }
`;
