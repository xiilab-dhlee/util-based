"use client";

import type { RequestResourceListType } from "@/domain/request-resource/schemas/request-resource.schema";
import { createRequestResourceColumn } from "@/shared/components/column/create-request-resource-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface SettingRequestResourceListBodyProps {
  /** 리소스 요청 목록 데이터 */
  content: RequestResourceListType[];
  /** 로딩 상태 */
  loading: boolean;
  /** 에러 상태 */
  isError: boolean;
}

/**
 * 설정 리소스 요청 목록 본문 컴포넌트
 *
 * 리소스 요청 목록의 테이블을 표시합니다.
 */
export function SettingRequestResourceListBody({
  content,
  loading,
  isError,
}: SettingRequestResourceListBodyProps) {
  return (
    <ListWrapper>
      <CustomizedTable
        columns={createRequestResourceColumn([
          {
            dataIndex: "requester",
            title: "요청자",
            align: "center",
            width: 60,
            sorter: true,
          },
          {
            dataIndex: "creatorDateTime",
            title: "요청일시",
            align: "left",
            width: 120,
            sorter: true,
          },
          {
            dataIndex: "gpuReq",
            width: 50,
          },
          {
            dataIndex: "cpuReq",
            width: 70,
          },
          {
            dataIndex: "memReq",
            width: 70,
          },
          {
            dataIndex: "migCount",
            width: 50,
          },
          {
            dataIndex: "mpsReq",
            width: 50,
          },
          {
            dataIndex: "status",
            title: "승인여부",
            width: 70,
            sorter: true,
          },
          {
            dataIndex: "modDate",
            title: "승인일시",
            align: "left",
            width: 120,
          },
          {
            dataIndex: "rejectReason",
            width: 65,
          },
          {
            dataIndex: "requestReason",
            width: 65,
          },
          {
            dataIndex: "delete",
            width: 65,
          },
        ])}
        data={content}
        loading={loading}
        isError={isError}
        columnHeight={36}
      />
    </ListWrapper>
  );
}
