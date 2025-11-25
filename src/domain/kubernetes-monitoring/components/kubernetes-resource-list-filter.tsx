"use client";

import { useAtom } from "jotai";
import type { FormEvent } from "react";
import styled from "styled-components";
import { Dropdown } from "xiilab-ui";

import {
  kubernetesResourceKeywordAtom,
  kubernetesResourceStatusAtom,
} from "@/domain/kubernetes-monitoring/atom/kubernetes-monitoring.atom";
import { KUBERNETES_RESOURCE_STATUS_FILTER_OPTIONS } from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { ALL_OPTION } from "@/shared/constants/core.constant";
import { useSearch } from "@/shared/hooks/use-search";
import { useSelect } from "@/shared/hooks/use-select";

export function KubernetesResourceListFilter() {
  const [status, setStatus] = useAtom(kubernetesResourceStatusAtom);
  const { onSubmit } = useSearch(kubernetesResourceKeywordAtom);
  const statusOptions = [
    ALL_OPTION,
    ...KUBERNETES_RESOURCE_STATUS_FILTER_OPTIONS,
  ];
  const statusSelect = useSelect(status, statusOptions);

  const handleChangeStatus = (value: string | null) => {
    statusSelect.onChange(value);
    setStatus(value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    onSubmit(e);
  };

  return (
    <MySearchFilter title="리소스 리스트" showTotal={false}>
      <FilterControls>
        <Dropdown
          options={statusSelect.options}
          value={statusSelect.value}
          onChange={handleChangeStatus}
          placeholder="상태"
          width={120}
        />
        <form onSubmit={handleSubmit}>
          <SearchInput />
        </form>
      </FilterControls>
    </MySearchFilter>
  );
}

const FilterControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
