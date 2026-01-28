"use client";

import { isString } from "es-toolkit/predicate";
import { Dropdown } from "xiilab-ui";

import { useGetDistributedPods } from "@/api/generated/workload/workload";
import { DROPDOWN_LIST_HEIGHT } from "@/shared/constants/core.constant";

interface PodSelectProps {
  workspaceId: number;
  workloadResourceName: string;
  value: string | null;
  setValue: (value: string | null) => void;
  disabled?: boolean;
}

function usePodOptions(workspaceId: number, workloadResourceName: string) {
  const query = useGetDistributedPods(workspaceId, workloadResourceName, {
    query: {
      enabled: !!workspaceId && !!workloadResourceName,
      select: (data) =>
        data.podNames?.map((podName) => ({
          label: podName,
          value: podName,
        })) ?? [],
    },
  });

  return {
    options: query.data ?? [],
    isLoading: query.isLoading,
  };
}

export function PodSelect({
  workspaceId,
  workloadResourceName,
  value,
  setValue,
  disabled = false,
}: PodSelectProps) {
  const { options, isLoading } = usePodOptions(
    workspaceId,
    workloadResourceName,
  );

  const handleChange = (v: string | number) => {
    if (isString(v)) {
      setValue(v);
    }
  };

  return (
    <Dropdown
      placeholder="Pod를 선택해 주세요."
      options={options}
      value={value}
      onChange={handleChange}
      width={230}
      showSearch
      optionFilterProp="children"
      loading={isLoading}
      disabled={disabled || options.length === 0}
      listHeight={DROPDOWN_LIST_HEIGHT}
    />
  );
}
