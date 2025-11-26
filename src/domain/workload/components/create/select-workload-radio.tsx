"use client";

import { useAtom } from "jotai";
import { Radio } from "xiilab-ui";

import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";
import { selectedWorkloadAtom } from "../../state/workload.atom";

interface SelectWorkloadRadioProps {
  workloadId: string;
}

export function SelectWorkloadRadio({ workloadId }: SelectWorkloadRadioProps) {
  const [selectedWorkload, setSelectedWorkload] = useAtom(selectedWorkloadAtom);

  return (
    <ColumnAlignCenterWrap>
      <Radio
        checked={selectedWorkload === workloadId}
        onChange={() => setSelectedWorkload(workloadId)}
      />
    </ColumnAlignCenterWrap>
  );
}
