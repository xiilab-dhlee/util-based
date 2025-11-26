"use client";

import { Button } from "xiilab-ui";

import { useGetCredentials } from "@/domain/credential/hooks/use-get-credentials";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { openCreateCredentialModalAtom } from "@/shared/state/modal.atom";

export function SettingCredentialListFilter() {
  const { onOpen } = useGlobalModal(openCreateCredentialModalAtom);
  const { data } = useGetCredentials({
    page: 1,
    size: 100,
    searchText: "",
  });

  const handleCreateCredential = () => {
    onOpen();
  };

  return (
    <MySearchFilter title="크레덴셜 목록" total={data?.totalSize || 0}>
      <Button
        color="primary"
        icon="Plus"
        iconPosition="left"
        variant="gradient"
        width={120}
        height={30}
        onClick={handleCreateCredential}
      >
        크레덴셜 추가
      </Button>
    </MySearchFilter>
  );
}
