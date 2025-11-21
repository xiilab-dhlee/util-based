import { useState } from "react";
import styled from "styled-components";
import { Icon, InfoModal, type TabsSeparatedItem } from "xiilab-ui";

import type { NetworkAdapterInfoType } from "@/domain/node/schemas/redfish.schema";
import { openViewNetworkPortsModalAtom } from "@/domain/node/state/node.atom";
import { StateTab } from "@/shared/components/tab";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { REDFISH_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { NetworkPortRow } from "./network-port-row";
import { redfishNetworkDeviceColumn } from "./redfish-network-device-column";
import { redfishNetworkPortColumn } from "./redfish-network-port-column";

const TAB_ITEMS: TabsSeparatedItem[] = [
  {
    key: "port",
    label: "Network Ports",
  },
  {
    key: "device",
    label: "Network Devices",
  },
];
/**
 * 네트워크 어댑터 상세정보 모달 컴포넌트
 *
 * 네트워크 어댑터의 상세 정보를 모달 형태로 표시하는 컴포넌트입니다.
 * 포트와 디바이스 탭을 제공하여 네트워크 어댑터의 다양한 정보를 확인할 수 있습니다.
 * Pub/Sub을 통해 네트워크 어댑터 데이터를 수신하고 모달을 열어줍니다.
 */
export function ViewNetworkAdapterModal() {
  // 모달 내부 상태 관리
  const [rowData, setRowData] = useState<NetworkAdapterInfoType | null>(null);
  // 현재 선택된 탭 상태 관리
  const [selectedTab, setSelectedTab] = useState("port");

  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openViewNetworkPortsModalAtom,
  );

  // 네트워크 어댑터 데이터 수신 및 모달 열기
  useSubscribe(
    REDFISH_EVENTS.sendNetworkAdapter,
    (eventData: NetworkAdapterInfoType) => {
      setRowData(eventData);
      // 모달 열기
      onOpen();
    },
  );

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
          items={TAB_ITEMS}
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
