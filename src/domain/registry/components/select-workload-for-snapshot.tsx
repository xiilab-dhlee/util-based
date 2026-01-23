"use client";

import { useAtomValue } from "jotai";
import { Dropdown } from "xiilab-ui";

import { useGetRecentWorkloads } from "@/domain/workload/hooks/use-get-recent-workloads";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";

interface SelectWorkloadForSnapshotProps {
  checkedWorkload: string | null;
  setCheckedWorkload: (value: string | null) => void;
}

export function SelectWorkloadForSnapshot({
  checkedWorkload,
  setCheckedWorkload,
}: SelectWorkloadForSnapshotProps) {
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);

  const { data } = useGetRecentWorkloads(
    {
      page: 1,
      size: 100,
      searchText: "",
    },
    !!selectedWorkspace,
  );

  const workloadOptions =
    data?.content?.map((workload) => ({
      label: workload.workloadName,
      value: workload.id,
    })) || [];

  return (
    <Dropdown
      options={workloadOptions}
      value={checkedWorkload}
      onChange={(value) => setCheckedWorkload(value as string | null)}
      placeholder="워크로드를 선택해 주세요."
      theme="light"
      width="100%"
    />
  );
}
