import { Typography } from "xiilab-ui";

import type { GpuNodeListType } from "@/shared/schemas/gpu.schema";
import { getResourceInfo } from "@/shared/utils/resource.util";
import {
  DropdownInfoBox,
  DropdownInfoDivider,
  DropdownInfoItem,
  DropdownInfoLabel,
  DropdownInfoValue,
  DropdownOptionContent,
} from "./dropdown-option.styled";

const GPU_INFO = getResourceInfo("GPU");
const CPU_INFO = getResourceInfo("CPU");
const MEM_INFO = getResourceInfo("MEM");

interface NodeDropdownOptionProps {
  node: GpuNodeListType;
}

export function NodeDropdownOption({ node }: NodeDropdownOptionProps) {
  return (
    <DropdownOptionContent>
      <Typography.Text variant="body-2-4" color="#000" data-interactive-text>
        {node.name}
      </Typography.Text>
      <DropdownInfoBox>
        <DropdownInfoItem>
          <DropdownInfoLabel>{GPU_INFO.text}</DropdownInfoLabel>
          <DropdownInfoValue>
            {node.gpuTotal}
            {GPU_INFO.unit}
          </DropdownInfoValue>
        </DropdownInfoItem>
        <DropdownInfoDivider />
        <DropdownInfoItem>
          <DropdownInfoLabel>{CPU_INFO.text}</DropdownInfoLabel>
          <DropdownInfoValue>
            {node.cpuTotal}
            {CPU_INFO.unit}
          </DropdownInfoValue>
        </DropdownInfoItem>
        <DropdownInfoDivider />
        <DropdownInfoItem>
          <DropdownInfoLabel>{MEM_INFO.text}</DropdownInfoLabel>
          <DropdownInfoValue>
            {node.memoryTotal}
            {MEM_INFO.unit}
          </DropdownInfoValue>
        </DropdownInfoItem>
      </DropdownInfoBox>
    </DropdownOptionContent>
  );
}
