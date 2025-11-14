import redfishNetworkPortColumn from "@/components/common/columns/redfish-network-port-column";
import { ToggleTableRow } from "@/components/common/table/toggle-table-row";
import { useToggle } from "@/hooks/common/use-toggle";
import {
  TableCollapseRowBody,
  TableCollapseRowContainer,
  TableCollapseRowHeader,
  TableCollapseRowHeaderTitle,
  TableCollapseRowKeyValueContainer,
  TableCollapseRowRecord,
  TableCollapseRowRecordKey,
  TableCollapseRowRecordValue,
} from "@/styles/layers/table-collapse-row.styled";

/**
 * Redfish 네트워크 포트 테이블의 확장 가능한 행 컴포넌트
 *
 * 각 네트워크 포트를 표시하는 테이블 행으로, 클릭 시 확장되어
 * LLDP 활성화 상태, MAC 주소 등의 상세 정보를 표시합니다.
 *
 * @param children - 테이블 셀 내용
 * @param rowData - 네트워크 포트 데이터
 * @param restProps - 기타 테이블 행 속성
 */
export function NetworkPortRow({ children, rowData, ...restProps }: any) {
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

      {/* 확장된 영역 - 네트워크 포트 상세 정보 */}
      {toggle && (
        <tr {...restProps}>
          <td colSpan={redfishNetworkPortColumn.length} style={{ padding: 0 }}>
            <TableCollapseRowContainer>
              <TableCollapseRowHeader>
                <TableCollapseRowHeaderTitle>
                  Network Ports 정보
                </TableCollapseRowHeaderTitle>
              </TableCollapseRowHeader>
              <TableCollapseRowBody>
                <TableCollapseRowRecord>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>
                      LLDP enabled
                    </TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {rowData?.MACAddress || "-"}
                    </TableCollapseRowRecordValue>
                  </TableCollapseRowKeyValueContainer>
                </TableCollapseRowRecord>
              </TableCollapseRowBody>
            </TableCollapseRowContainer>
          </td>
        </tr>
      )}
    </>
  );
}
