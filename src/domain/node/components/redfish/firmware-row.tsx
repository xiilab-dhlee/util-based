import type { HTMLAttributes, MouseEvent } from "react";

import type { FirmwareInfoType } from "@/domain/node/schemas/redfish.schema";
import { ToggleTableRow } from "@/shared/components/table/toggle-table-row";
import { useToggle } from "@/shared/hooks/use-toggle";
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
import { redfishFirmwareColumn } from "./redfish-firmware-column";

interface FirmwareRowProps extends HTMLAttributes<HTMLTableRowElement> {
  rowData: FirmwareInfoType;
}

/**
 * Redfish 펌웨어 테이블의 확장 가능한 행 컴포넌트
 *
 * 각 펌웨어를 표시하는 테이블 행으로, 클릭 시 확장되어
 * 펌웨어의 설명 정보를 표시합니다.
 *
 * @param children - 테이블 셀 내용
 * @param rowData - 펌웨어 데이터
 * @param restProps - 기타 테이블 행 속성
 */
export function FirmwareRow({
  children,
  rowData,
  ...restProps
}: FirmwareRowProps) {
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

      {/* 확장된 영역 - 펌웨어 상세 정보 */}
      {toggle && (
        <tr {...restProps}>
          <td colSpan={redfishFirmwareColumn.length} style={{ padding: 0 }}>
            <TableCollapseRowContainer>
              <TableCollapseRowHeader>
                <TableCollapseRowHeaderTitle>
                  Firmware 정보
                </TableCollapseRowHeaderTitle>
              </TableCollapseRowHeader>
              <TableCollapseRowBody>
                <TableCollapseRowRecord>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>
                      Description
                    </TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {rowData?.Description || "-"}
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
