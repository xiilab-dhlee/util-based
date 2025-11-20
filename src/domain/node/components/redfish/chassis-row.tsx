import type { HTMLAttributes, MouseEvent } from "react";

import type { ChassisInfoType } from "@/domain/node/schemas/redfish.schema";
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
import { redfishChassisColumn } from "./redfish-chassis-column";

interface ChassisRowProps extends HTMLAttributes<HTMLTableRowElement> {
  rowData: ChassisInfoType;
}

/**
 * Redfish 케이스 테이블의 확장 가능한 행 컴포넌트
 *
 * 각 케이스를 표시하는 테이블 행으로, 클릭 시 확장되어
 * 제조사, SKU, 자산 태그, 환경 등급 등의 상세 정보를 표시합니다.
 *
 * @param children - 테이블 셀 내용
 * @param rowData - 케이스 데이터
 * @param restProps - 기타 테이블 행 속성
 */
export function ChassisRow({
  children,
  rowData,
  ...restProps
}: ChassisRowProps) {
  const [toggle, onToggle] = useToggle();

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

      {/* 확장된 영역 - 케이스 상세 정보 */}
      {toggle && (
        <tr {...restProps}>
          <td colSpan={redfishChassisColumn.length} style={{ padding: 0 }}>
            <TableCollapseRowContainer>
              <TableCollapseRowHeader>
                <TableCollapseRowHeaderTitle>
                  Chassis 정보
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
                    <TableCollapseRowRecordKey>SKU</TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>
                      {rowData?.SKU || "-"}
                    </TableCollapseRowRecordValue>
                  </TableCollapseRowKeyValueContainer>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>
                      Asset Tag
                    </TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>-</TableCollapseRowRecordValue>
                  </TableCollapseRowKeyValueContainer>
                </TableCollapseRowRecord>

                {/* 환경 정보 */}
                <TableCollapseRowRecord>
                  <TableCollapseRowKeyValueContainer>
                    <TableCollapseRowRecordKey>
                      Environmental Class
                    </TableCollapseRowRecordKey>
                    <TableCollapseRowRecordValue>-</TableCollapseRowRecordValue>
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
