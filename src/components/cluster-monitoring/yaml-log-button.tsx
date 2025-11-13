import { openYamlLogModalAtom } from "@/atoms/monitoring/cluster-monitoring.atom";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { ColumnIconWrap } from "@/styles/layers/column-layer.styled";
import MyIcon from "../common/icons";

export function YamlLogButton() {
  const { onOpen } = useGlobalModal(openYamlLogModalAtom);

  const handleClick = () => {
    onOpen();
  };

  return (
    <ColumnIconWrap onClick={handleClick}>
      <MyIcon name="Terminal" color="var(--icon-fill)" size={16} />
    </ColumnIconWrap>
  );
}

