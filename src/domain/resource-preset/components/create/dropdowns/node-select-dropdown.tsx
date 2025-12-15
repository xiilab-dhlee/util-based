import { CompoundDropdown } from "xiilab-ui";

import type { GpuNodeListType } from "@/shared/schemas/gpu.schema";
import { NodeDropdownOption } from "./node-dropdown-option";

interface NodeSelectDropdownProps {
  nodes: GpuNodeListType[];
  value: string | undefined;
  onChange: (value: string) => void;
  error?: boolean;
  loading?: boolean;
}

export function NodeSelectDropdown({
  nodes,
  value,
  onChange,
  error,
  loading,
}: NodeSelectDropdownProps) {
  return (
    <CompoundDropdown
      theme="light"
      width="100%"
      height={40}
      placeholder="GPU 사용 노드를 선택해 주세요."
      value={value}
      onChange={onChange}
      status={error ? "error" : undefined}
      loading={loading}
    >
      {nodes.map((node) => (
        <CompoundDropdown.Option
          key={node.id}
          value={node.id}
          display={node.name}
        >
          <NodeDropdownOption node={node} />
        </CompoundDropdown.Option>
      ))}
    </CompoundDropdown>
  );
}
