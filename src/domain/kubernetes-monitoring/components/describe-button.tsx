import { Icon } from "xiilab-ui";

import { openKubernetesDescribeModalAtom } from "@/domain/kubernetes-monitoring/atom/kubernetes-monitoring.atom";
import type { K8sResourceModalPayload } from "@/domain/kubernetes-monitoring/types/kubernetes-monitoring.type";
import { KUBERNETES_MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { ColumnIconWrap } from "@/styles/layers/column-layer.styled";

interface DescribeButtonProps extends K8sResourceModalPayload {}

export function DescribeButton({ resourceType, name }: DescribeButtonProps) {
  const { onOpen } = useGlobalModal(openKubernetesDescribeModalAtom);
  const publish = usePublish();

  const handleClick = () => {
    publish<K8sResourceModalPayload>(
      KUBERNETES_MONITORING_EVENTS.sendResourceDescribe,
      { resourceType, name },
    );
    onOpen();
  };

  return (
    <ColumnIconWrap onClick={handleClick}>
      <Icon name="Terminal" color="var(--icon-fill)" size={16} />
    </ColumnIconWrap>
  );
}
