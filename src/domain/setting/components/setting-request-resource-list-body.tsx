"use client";

import { useAtom } from "jotai";

import { createRequestResourceColumn } from "@/shared/components/column/create-request-resource-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { SETTING_LIST_PAGE_SIZE } from "../constants/setting.constant";
import { useGetSettingRequestResources } from "../hooks/use-get-setting-request-resources";
import { settingRequestResourcePageAtom } from "../state/setting.atom";

export function SettingRequestResourceListBody() {
  // 페이지 번호
  const [page, setPage] = useAtom(settingRequestResourcePageAtom);

  const { data } = useGetSettingRequestResources({
    page,
    size: SETTING_LIST_PAGE_SIZE,
    searchText: "",
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createRequestResourceColumn([
          {
            dataIndex: "creatorDateTime",
            title: "신청일시",
            align: "left",
          },
          {
            dataIndex: "gpuReq",
          },
          {
            dataIndex: "cpuReq",
          },
          {
            dataIndex: "memReq",
          },
          {
            dataIndex: "migGpu",
          },
          {
            dataIndex: "status",
          },
          {
            dataIndex: "rejectReason",
          },
          {
            dataIndex: "requestReason",
          },
        ])}
        data={data?.content || []}
        activePadding
        pagination={{
          pageSize: SETTING_LIST_PAGE_SIZE,
          total: data?.totalSize || 0,
          onChange: (page) => {
            setPage(page);
          },
        }}
      />
    </ListWrapper>
  );
}
