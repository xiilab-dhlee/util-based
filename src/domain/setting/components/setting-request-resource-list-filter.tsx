"use client";

import { useAtomValue } from "jotai";
import { Button } from "xiilab-ui";

import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { SETTING_LIST_PAGE_SIZE } from "../constants/setting.constant";
import { useGetSettingRequestResources } from "../hooks/use-get-setting-request-resources";
import {
  openCreateResourceRequestModalAtom,
  settingRequestResourcePageAtom,
} from "../state/setting.atom";

export function SettingRequestResourceListFilter() {
  const { onOpen } = useGlobalModal(openCreateResourceRequestModalAtom);
  const page = useAtomValue(settingRequestResourcePageAtom);

  const { data } = useGetSettingRequestResources({
    page,
    size: SETTING_LIST_PAGE_SIZE,
    searchText: "",
  });

  const handleCreateRequestResource = () => {
    onOpen();
  };

  return (
    <MySearchFilter title="리소스 요청 목록" total={data?.totalSize || 0}>
      <Button
        color="primary"
        icon="RequestResource"
        iconPosition="left"
        variant="gradient"
        width={110}
        height={30}
        onClick={handleCreateRequestResource}
      >
        리소스 요청
      </Button>
    </MySearchFilter>
  );
}
