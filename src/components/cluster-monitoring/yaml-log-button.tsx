import { Icon } from "xiilab-ui";

import { openYamlLogModalAtom } from "@/atoms/monitoring.atom";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { ColumnIconWrap } from "@/styles/layers/column-layer.styled";

export function YamlLogButton() {
  const { onOpen } = useGlobalModal(openYamlLogModalAtom);

  const handleClick = () => {
    onOpen();
  };

  return (
    <ColumnIconWrap onClick={handleClick}>
      <Icon name="Terminal" color="var(--icon-fill)" size={16} />
    </ColumnIconWrap>
  );
}
