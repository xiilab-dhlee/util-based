"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";
import { Dropdown } from "xiilab-ui";

import { REQUEST_RESOURCE_STATUS_OPTIONS } from "@/domain/request-resource/constants/request-resource.constant";
import { useGetRequestResources } from "@/domain/request-resource/hooks/use-get-request-resources";
import {
  requestResourceEndDateAtom,
  requestResourcePageAtom,
  requestResourceStartDateAtom,
} from "@/domain/request-resource/state/request-resource.atom";
import type { WorkspaceRequestResourceStatus } from "@/domain/workspace/types/workspace.type";
import { ListRangePicker } from "@/shared/components/datepicker/list-range-picker";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { ALL_OPTION, LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { useSelect } from "@/shared/hooks/use-select";

export function RequestResourceFilter() {
  const page = useAtomValue(requestResourcePageAtom);
  const startDate = useAtomValue(requestResourceStartDateAtom);
  const endDate = useAtomValue(requestResourceEndDateAtom);

  const statusOptions = [ALL_OPTION, ...REQUEST_RESOURCE_STATUS_OPTIONS];
  const statusSelect = useSelect(null, statusOptions);

  const status =
    statusSelect.value === null || statusSelect.value === "ALL"
      ? undefined
      : (statusSelect.value as WorkspaceRequestResourceStatus);

  const { data } = useGetRequestResources({
    page,
    size: LIST_PAGE_SIZE,
    startDate,
    endDate,
    status,
  });

  return (
    <MySearchFilter title="리소스 신청 목록" total={data?.totalSize}>
      <FilterControls>
        <ListRangePicker
          startDateAtom={requestResourceStartDateAtom}
          endDateAtom={requestResourceEndDateAtom}
        />
        <Dropdown
          options={statusSelect.options}
          value={statusSelect.value}
          onChange={statusSelect.onChange}
          placeholder="승인여부"
          width={120}
        />
      </FilterControls>
    </MySearchFilter>
  );
}

const FilterControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
