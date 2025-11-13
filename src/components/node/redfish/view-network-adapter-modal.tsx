import { useState } from "react";
import styled from "styled-components";
import { Icon, InfoModal } from "xiilab-ui";

import { openViewNetworkPortsModalAtom } from "@/atoms/node/node-detail.atom";
import { redfishNetworkDeviceColumn } from "@/components/common/columns/redfish-network-device-column";
import { redfishNetworkPortColumn } from "@/components/common/columns/redfish-network-port-column";
import { StateTab } from "@/components/common/state-tab";
import { CustomizedTable } from "@/components/common/table/customized-table";
import pubsubConstants from "@/constants/common/pubsub.constant";
import redfishConstants from "@/constants/node/redfish.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSubscribe } from "@/hooks/common/use-pub-sub";
import NetworkPortRow from "./network-port-row";

/**
 * 네트워크 어댑터 상세정보 모달 컴포넌트
 *
 * 네트워크 어댑터의 상세 정보를 모달 형태로 표시하는 컴포넌트입니다.
 * 포트와 디바이스 탭을 제공하여 네트워크 어댑터의 다양한 정보를 확인할 수 있습니다.
 * Pub/Sub을 통해 네트워크 어댑터 데이터를 수신하고 모달을 열어줍니다.
 */
export function ViewNetworkAdapterModal() {
  // 모달 내부 상태 관리
  const [rowData, setRowData] = useState<any>(null);
  // 현재 선택된 탭 상태 관리
  const [selectedTab, setSelectedTab] = useState("port");

  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openViewNetworkPortsModalAtom,
  );

  // 네트워크 어댑터 데이터 수신 및 모달 열기
  useSubscribe<any>(pubsubConstants.redfish.sendNetworkAdapter, (eventData) => {
    setRowData(eventData);
    // 모달 열기
    onOpen();
  });

  return (
    <InfoModal
      modalWidth={800}
      title="Network Adapter"
      icon={<Icon name="Folder" color="#fff" size={20} />}
      open={open}
      closable
      onClose={onClose}
      showHeaderBorder
      centered
    >
      <Container>
        {/* 탭 네비게이션 */}
        <StateTab
          tabs={redfishConstants.networkAdapterTabs}
          selectedKey={selectedTab}
          setSelectedKey={setSelectedTab}
        />

        {/* 테이블 바디 */}
        <Body>
          <CustomizedTable
            columns={
              selectedTab === "port"
                ? redfishNetworkPortColumn
                : redfishNetworkDeviceColumn
            }
            data={rowData ? [rowData] : []}
            columnHeight={32}
            bodyBgColor="transparent"
            activePadding
            customRow={selectedTab === "port" ? NetworkPortRow : undefined}
          />
        </Body>
      </Container>
    </InfoModal>
  );
}


/** 모달 컨테이너 */
const Container = styled.div`
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
`;

/** 테이블 바디 영역 */
const Body = styled.div`
  flex: 1;
  border: 1px solid #e9e9e9;
  border-top: 0;
  padding: 10px;
`;
