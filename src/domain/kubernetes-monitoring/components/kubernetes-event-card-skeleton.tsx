import styled from "styled-components";
import { Card } from "xiilab-ui";

export function KubernetesEventCardSkeleton() {
  return (
    <Card showHeader={false} loading={true}>
      <SkeletonBody />
    </Card>
  );
}

const SkeletonBody = styled.div`
  height: 94px;
`;
