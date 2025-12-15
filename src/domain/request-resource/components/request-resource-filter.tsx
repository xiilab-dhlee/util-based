"use client";

import { useAtom, useSetAtom } from "jotai";
import styled from "styled-components";
import { Dropdown } from "xiilab-ui";

import { REQUEST_RESOURCE_STATUS_OPTIONS } from "@/domain/request-resource/constants/request-resource.constant";
import {
  requestResourceKeywordAtom,
  requestResourceStatusAtom,
} from "@/domain/request-resource/state/request-resource.atom";
import type { RequestResourceStatusFilter as StatusFilterType } from "@/domain/request-resource/type/request-resource.type";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { ALL_OPTION } from "@/shared/constants/core.constant";

interface RequestResourceFilterProps {
  total?: number;
}

export function RequestResourceFilter({ total }: RequestResourceFilterProps) {
  const [status, setStatus] = useAtom(requestResourceStatusAtom);
  const setKeyword = useSetAtom(requestResourceKeywordAtom);
  const statusOptions = [ALL_OPTION, ...REQUEST_RESOURCE_STATUS_OPTIONS];

  return (
    <MySearchFilter title="리소스 신청 목록" total={total}>
      <FilterControls>
        <Dropdown
          options={statusOptions}
          value={status}
          onChange={(value) => setStatus(value as StatusFilterType)}
          placeholder="승인 여부"
          width={120}
        />
        <SearchInput
          placeholder="워크스페이스 이름 또는 요청자 이름 검색"
          width={270}
          onSearch={setKeyword}
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
