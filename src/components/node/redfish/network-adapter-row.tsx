import { Button } from "xiilab-ui";
import { REDFISH_EVENTS } from "@/constants/common/pubsub.constant";

import { redfishNetworkAdapterColumn } from "@/components/common/columns/redfish-network-adapter-column";
import { ToggleTableRow } from "@/components/common/table/toggle-table-row";
import { REDFISH_EVENTS } from "@/constants/common/pubsub.constant";

import { usePublish } from "@/hooks/common/use-pub-sub";
import { useToggle } from "@/hooks/common/use-toggle";
import {
  TableCollapseRowBody,
  TableCollapseRowContainer,
  TableCollapseRowFooter,
  TableCollapseRowHeader,
  TableCollapseRowHeaderTitle,
  TableCollapseRowKeyValueContainer,
  TableCollapseRowRecord,
  TableCollapseRowRecordKey,
  TableCollapseRowRecordValue,
} from "@/styles/layers/table-collapse-row.styled";
import { REDFISH_EVENTS } from "@/constants/common/pubsub.constant";

/**
 * Redfish 네트워크 어댑터 테이블의 확장 가능한 행 컴포넌트
 *
 * 각 네트워크 어댑터를 표시하는 테이블 행으로, 클릭 시 확장되어
 * MAC 주소, 이름 등의 기본 정보를 표시하고 상세정보 보기 버튼을 제공합니다.
 *
 * @param children - 테이블 셀 내용
 * @param rowData - 네트워크 어댑터 데이터
 * @param restProps - 기타 테이블 행 속성
 */
export function NetworkAdapterRow({ children, rowData, ...restProps }: any) {
  // Pub/Sub 메시지 발행을 위한 훅
  const publish = usePublish();

  // 토글 상태 관리
  const [toggle, onToggle] = useToggle();

  /**
   * 행 확장/축소 토글 핸들러
   *
   * @param e - 클릭 이벤트
   */
  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (rowData) {
      onToggle();
    }
  };

  /**
   * 네트워크 어댑터 상세정보 보기 핸들러
   *
   * 네트워크 어댑터 상세정보 모달을 열기 위한 이벤트를 발행합니다.
   */
  const handleViewNetworkAdapter = () => {
    publish(REDFISH_EVENTS.sendNetworkAdapter, rowData);
  };

  return (
    <>
      {/* 확장 가능한 테이블 행 */}
      <ToggleTableRow
        toggle={toggle}
        onToggle={handleToggleClick}
        togglePosition="last"
        {...restProps}
      >
        {children}
      </ToggleTableRow>

      {/* 확장된 영역 - 네트워크 어댑터 상세 정보 */}
      {toggle && (
        <tr {...restProps}>
          <td
            colSpan={redfishNetworkAdapterColumn.length}
            style={{ padding: 0 }}
          >
            <TableCollapseRowContainer>
              <TableCollapseRowHeader>
                <TableCollapseRowHeaderTitle>
                  Network Adapters 정보
                </TableCollapseRowHeaderTitle>
              </TableCollapseRowHeader>
              <TableCollapseRowBody>
                {/* 기본 정보 */}
                <TableCollapseRowRecord>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>
                      Serial number
                    </TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {rowData?.MACAddress || "-"}
                    </TableCollapseRowRecordValue>
                  </TableCollapseRowKeyValueContainer>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>Name</TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {rowData?.Name || "-"}
                    </TableCollapseRowRecordValue>
                  </TableCollapseRowKeyValueContainer>
                </TableCollapseRowRecord>
              </TableCollapseRowBody>

              {/* 상세정보 보기 버튼 */}
              <TableCollapseRowFooter>
                <Button
                  size="small"
                  variant="outlined"
                  icon="Front"
                  iconColor="#000"
                  iconPosition="right"
                  width={120}
                  height={20}
                  onClick={handleViewNetworkAdapter}
                >
                  상세정보 보기
                </Button>
              </TableCollapseRowFooter>
            </TableCollapseRowContainer>
          </td>
        </tr>
      )}
    </>
  );
}

