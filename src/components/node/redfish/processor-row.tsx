import type { HTMLAttributes, MouseEvent } from "react";

import { ToggleTableRow } from "@/components/common/table/toggle-table-row";
import { useToggle } from "@/hooks/common/use-toggle";
import type { ProcessorInfoType } from "@/schemas/redfish.schema";
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
import { redfishProcessorColumn } from "./redfish-processor-column";

interface ProcessorRowProps extends HTMLAttributes<HTMLTableRowElement> {
  rowData: ProcessorInfoType;
}

/**
 * Redfish 프로세서 테이블의 확장 가능한 행 컴포넌트
 *
 * 각 프로세서를 표시하는 테이블 행으로, 클릭 시 확장되어
 * 제조사, 명령어 집합, 프로세서 타입 등의 상세 정보를 표시합니다.
 *
 * @param children - 테이블 셀 내용
 * @param rowData - 프로세서 데이터
 * @param restProps - 기타 테이블 행 속성
 */
export function ProcessorRow({
  children,
  rowData,
  ...restProps
}: ProcessorRowProps) {
  // 토글 상태 관리
  const [toggle, onToggle] = useToggle();

  /**
   * 행 확장/축소 토글 핸들러
   *
   * @param e - 클릭 이벤트
   */
  const handleToggleClick = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation();

    if (rowData) {
      onToggle();
    }
  };

  return (
    <>
      {/* 확장 가능한 테이블 행 */}
      <ToggleTableRow
        toggle={toggle}
        onClickIcon={handleToggleClick}
        togglePosition="last"
        {...restProps}
      >
        {children}
      </ToggleTableRow>

      {/* 확장된 영역 - 프로세서 상세 정보 */}
      {toggle && (
        <tr {...restProps}>
          <td colSpan={redfishProcessorColumn.length} style={{ padding: 0 }}>
            <TableCollapseRowContainer>
              <TableCollapseRowHeader>
                <TableCollapseRowHeaderTitle>
                  Processors 정보
                </TableCollapseRowHeaderTitle>
              </TableCollapseRowHeader>
              <TableCollapseRowBody>
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
                      Instruction set
                    </TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {rowData?.InstructionSet || "-"}
                    </TableCollapseRowRecordValue>
                  </TableCollapseRowKeyValueContainer>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>
                      Processor type
                    </TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {rowData?.ProcessorType || "-"}
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
