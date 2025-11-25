import { Icon } from "xiilab-ui";

import { openKubernetesDescribeModalAtom } from "@/domain/kubernetes-monitoring/atom/kubernetes-monitoring.atom";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { ColumnIconWrap } from "@/styles/layers/column-layer.styled";

export function DescribeButton() {
  const { onOpen } = useGlobalModal(openKubernetesDescribeModalAtom);

  const handleClick = () => {
    onOpen();
  };

  return (
    <ColumnIconWrap onClick={handleClick}>
      <Icon name="Terminal" color="var(--icon-fill)" size={16} />
    </ColumnIconWrap>
  );
}
