import redfishMemoryColumn from "@/components/common/columns/redfish-memory-column";
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
 * Redfish 메모리 테이블의 확장 가능한 행 컴포넌트
 *
 * 각 메모리 모듈을 표시하는 테이블 행으로, 클릭 시 확장되어
 * 제조사, HPE 메모리 속성, 최소 전압, 랭크 수, 오류 수정, 데이터/버스 폭,
 * 채널, 메모리 컨트롤러, 슬롯 등의 상세 정보를 표시합니다.
 *
 * @param children - 테이블 셀 내용
 * @param rowData - 메모리 데이터
 * @param restProps - 기타 테이블 행 속성
 */
export function MemoryRow({ children, rowData, ...restProps }: any) {
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

      {/* 확장된 영역 - 메모리 상세 정보 */}
      {toggle && (
        <tr {...restProps}>
          <td colSpan={redfishMemoryColumn.length} style={{ padding: 0 }}>
            <TableCollapseRowContainer>
              <TableCollapseRowHeader>
                <TableCollapseRowHeaderTitle>
                  Memory 정보
                </TableCollapseRowHeaderTitle>
              </TableCollapseRowHeader>
              <TableCollapseRowBody>
                {/* 기본 정보 */}
                <TableCollapseRowRecord>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>
                      Manufacturer
                    </TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {rowData?.Manufacturer || "-"}
                    </TableCollapseRowRecordValue>
                  </TableCollapseRowKeyValueContainer>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>
                      HPE Memory
                    </TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {rowData?.Oem?.Hpe?.Attributes?.[0] || "-"}
                    </TableCollapseRowRecordValue>
                  </TableCollapseRowKeyValueContainer>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>
                      Minimum voltage
                    </TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {`${rowData?.Oem?.Hpe?.MinimumVoltageVoltsX10 || 0} volts`}
                    </TableCollapseRowRecordValue>
                  </TableCollapseRowKeyValueContainer>
                </TableCollapseRowRecord>

                {/* 메모리 사양 정보 */}
                <TableCollapseRowRecord>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>Ranks</TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {rowData?.RankCount || "-"}
                    </TableCollapseRowRecordValue>
                  </TableCollapseRowKeyValueContainer>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>
                      Error correction
                    </TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {rowData?.ErrorCorrection || "-"}
                    </TableCollapseRowRecordValue>
                  </TableCollapseRowKeyValueContainer>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>
                      Data width bits
                    </TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {rowData?.DataWidthBits || "-"}
                    </TableCollapseRowRecordValue>
                  </TableCollapseRowKeyValueContainer>
                </TableCollapseRowRecord>

                {/* 위치 정보 */}
                <TableCollapseRowRecord>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>
                      Bus width bits
                    </TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {rowData?.BusWidthBits || "-"}
                    </TableCollapseRowRecordValue>
                  </TableCollapseRowKeyValueContainer>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>
                      Channel
                    </TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {rowData?.MemoryLocation?.Channel || "-"}
                    </TableCollapseRowRecordValue>
                  </TableCollapseRowKeyValueContainer>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>
                      Memory controller
                    </TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {rowData?.MemoryLocation?.MemoryController || "-"}
                    </TableCollapseRowRecordValue>
                  </TableCollapseRowKeyValueContainer>
                </TableCollapseRowRecord>

                {/* 슬롯 정보 */}
                <TableCollapseRowRecord>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>Slot</TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {rowData?.MemoryLocation?.Slot || "-"}
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

