import redfishPowerSupplyColumn from "@/components/common/columns/redfish-power-supply-column";
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
 * Redfish 전원 공급 장치 테이블의 확장 가능한 행 컴포넌트
 *
 * 각 전원 공급 장치를 표시하는 테이블 행으로, 클릭 시 확장되어
 * 시리얼 번호, 제조사, 펌웨어 버전, 전력 출력 등의 상세 정보를 표시합니다.
 *
 * @param children - 테이블 셀 내용
 * @param rowData - 전원 공급 장치 데이터
 * @param restProps - 기타 테이블 행 속성
 */
export function PowerSuppliesRow({ children, rowData, ...restProps }: any) {
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

      {/* 확장된 영역 - 전원 공급 장치 상세 정보 */}
      {toggle && (
        <tr {...restProps}>
          <td colSpan={redfishPowerSupplyColumn.length} style={{ padding: 0 }}>
            <TableCollapseRowContainer>
              <TableCollapseRowHeader>
                <TableCollapseRowHeaderTitle>
                  Power Supplies 정보
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
                      {rowData?.SerialNumber || "-"}
                    </TableCollapseRowRecordValue>
                  </TableCollapseRowKeyValueContainer>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>
                      Spare part number
                    </TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {rowData?.SparePartNumber || "-"}
                    </TableCollapseRowRecordValue>
                  </TableCollapseRowKeyValueContainer>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>
                      Manufacturer
                    </TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {rowData?.Manufacturer || "-"}
                    </TableCollapseRowRecordValue>
                  </TableCollapseRowKeyValueContainer>
                </TableCollapseRowRecord>

                {/* 전력 정보 */}
                <TableCollapseRowRecord>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>
                      Firmware version
                    </TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {rowData?.FirmwareVersion || "-"}
                    </TableCollapseRowRecordValue>
                  </TableCollapseRowKeyValueContainer>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>
                      Last power output
                    </TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {`${rowData?.LastPowerOutputWatts || 0} watts`}
                    </TableCollapseRowRecordValue>
                  </TableCollapseRowKeyValueContainer>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>
                      Max power output
                    </TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {`${rowData?.Oem?.Hpe?.MaxPowerOutputWatts || 0} watts`}
                    </TableCollapseRowRecordValue>
                  </TableCollapseRowKeyValueContainer>
                </TableCollapseRowRecord>

                {/* 입력 전압 정보 */}
                <TableCollapseRowRecord>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>
                      Line input voltage
                    </TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {rowData?.LineInputVoltageType || "-"}
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

