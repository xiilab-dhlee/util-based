"use client";

import { useAtom } from "jotai";
import { Radio } from "xiilab-ui";

import { selectedWorkloadAtom } from "@/domain/workload/state/workload.atom";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

interface SelectWorkloadRadioProps {
  workloadId: string;
}

export function SelectWorkloadRadio({ workloadId }: SelectWorkloadRadioProps) {
  const [selectedWorkload, setSelectedWorkload] = useAtom(selectedWorkloadAtom);

  const handleRadioChange = () => {
    setSelectedWorkload(workloadId);
  };

  return (
    <ColumnAlignCenterWrap>
      <Radio
        checked={selectedWorkload === workloadId}
        onChange={handleRadioChange}
      />
    </ColumnAlignCenterWrap>
  );
}
