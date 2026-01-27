"use client";

import { Dropdown } from "xiilab-ui";

import { useGetDistributedPods } from "@/api/generated/workload/workload";

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
    if (typeof v === "string") {
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
      optionFilterProp="label"
      loading={isLoading}
      disabled={disabled || options.length === 0}
    />
  );
}
