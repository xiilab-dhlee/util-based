import styled from "styled-components";

import redfishNetworkPortColumn from "@/components/common/columns/redfish-network-port-column";
import { ToggleTableRow } from "@/components/common/table/toggle-table-row";
import { useToggle } from "@/hooks/common/use-toggle";
import {
  TableCollapseRowBody,
  TableCollapseRowContainer,
  TableCollapseRowHeader,
  TableCollapseRowHeaderTitle,
} from "@/styles/layers/table-collapse-row.styled";

/**
 * 노드 로그 테이블의 확장 가능한 행 컴포넌트
 *
 * 각 로그 항목을 표시하는 테이블 행으로, 클릭 시 확장되어
 * 해당 로그의 권장 조치(Recommended Action) 정보를 표시합니다.
 *
 * @param children - 테이블 셀 내용
 * @param rowData - 로그 데이터 (Oem.Hpe.RecommendedAction 포함)
 * @param restProps - 기타 테이블 행 속성
 */
export function NodeLogRow({ children, rowData, ...restProps }: any) {
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

      {/* 확장된 영역 - 권장 조치 표시 */}
      {toggle && (
        <tr {...restProps}>
          <CollapseCell colSpan={redfishNetworkPortColumn.length}>
            <TableCollapseRowContainer>
              <TableCollapseRowHeader>
                <TableCollapseRowHeaderTitle>
                  Recommend
                </TableCollapseRowHeaderTitle>
              </TableCollapseRowHeader>
              <TableCollapseRowBody>
                <RecommendText>
                  {rowData?.Oem?.Hpe?.RecommendedAction}
                </RecommendText>
              </TableCollapseRowBody>
            </TableCollapseRowContainer>
          </CollapseCell>
        </tr>
      )}
    </>
  );
}


/** 확장 영역 테이블 셀 스타일 */
const CollapseCell = styled.td`
  padding: 0 !important;
  // 테이블 레이아웃이 셀 내부 콘텐츠에 의해 확장되지 않도록 제한했습니다.
  max-width: 0;
`;

/** 권장 조치 텍스트 스타일 */
const RecommendText = styled.p`
  text-align: left;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: #484848;
`;
