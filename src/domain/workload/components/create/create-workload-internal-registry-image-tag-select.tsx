"use client";

import { useAtom, useAtomValue } from "jotai";
import { Dropdown } from "xiilab-ui";

import { useGetInternalRegistryImageTagOptions } from "@/domain/internal-registry-image/hooks/use-get-internal-registry-image-tag-options";
import { useSelect } from "@/shared/hooks/use-select";
import { imageIdAtom, imageTagIdAtom } from "../../state/create-workload.atom";

export function CreateWorkloadInternalRegistryImageTagSelect() {
  const imageId = useAtomValue(imageIdAtom);
  const [imageTagId, setImageTagId] = useAtom(imageTagIdAtom);
  /** 내부 레지스트리 이미지 태그 옵션 목록 조회 */
  const { data } = useGetInternalRegistryImageTagOptions(Number(imageId));

  const imageTag = useSelect(null, data || []);

  const handleChangeImageTag = (value: string) => {
    setImageTagId(value);
  };

  return (
    <Dropdown
      placeholder="내부 레지스트리 이미지 태그를 선택해 주세요."
      options={imageTag.options}
      value={imageTagId}
      onChange={handleChangeImageTag}
      width="100%"
    />
  );
}
