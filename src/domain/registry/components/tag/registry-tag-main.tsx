"use client";

import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { DeleteRegistryTagModal } from "@/domain/registry/components/delete-registry-tag-modal";
import { RegistryTagAside } from "@/domain/registry/components/tag/registry-tag-aside";
import { RegistryTagBody } from "@/domain/registry/components/tag/registry-tag-body";
import { RegistryTagFilter } from "@/domain/registry/components/tag/registry-tag-filter";
import { RegistryTagFooter } from "@/domain/registry/components/tag/registry-tag-footer";
import { UpdateRegistryTagModal } from "@/domain/registry/components/update-registry-tag-modal";
import { REGISTRY_TAG_VULNERABILITY_PAGE_SIZE } from "@/domain/registry/constants/registry-tag.constant";
import { useGetRegistryTagVulnerabilitiesByMode } from "@/domain/registry/hooks/use-get-registry-tag-vulnerabilities-by-mode";
import { registryTagVulnerabilityPageAtom } from "@/domain/registry/state/registry-tag.atom";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { PageHeader } from "@/shared/components/layouts/page-header";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";

interface RegistryTagMainProps {
  mode: RegistryMode;
}

export function RegistryTagMain({ mode }: RegistryTagMainProps) {
  const { name, tagName } = useParams<{ name: string; tagName: string }>();
  const harborImageName = name ? decodeURIComponent(name) : "";

  const resetPage = useResetAtom(registryTagVulnerabilityPageAtom);

  const page = useAtomValue(registryTagVulnerabilityPageAtom);

  const { data, isLoading, isError } = useGetRegistryTagVulnerabilitiesByMode(
    mode,
    {
      pageNo: page - 1,
      pageSize: REGISTRY_TAG_VULNERABILITY_PAGE_SIZE,
      harborImageName,
      tagName: tagName ?? "",
    },
  );

  useEffect(() => {
    resetPage();
  }, [resetPage]);

  return (
    <>
      <PageHeader
        pageKey={`admin.${mode}-registry.detail`}
        pageParams={{ name: name ?? "", tagName: tagName ?? "" }}
      />
      <DetailPageBody>
        <RegistryTagAside mode={mode} />
        <DetailPageContent>
          <DetailContentSection>
            <RegistryTagFilter totalSize={data?.totalSize || 0} />
            <RegistryTagBody
              data={data?.content || []}
              isLoading={isLoading}
              isError={isError}
            />
            <RegistryTagFooter
              totalSize={data?.totalSize || 0}
              isLoading={isLoading}
            />
          </DetailContentSection>
        </DetailPageContent>
      </DetailPageBody>
      {/* 개인 레지스트리 태그 삭제 모달 */}
      <DeleteRegistryTagModal mode={mode} />
      {/* 개인 레지스트리 태그 수정 모달 */}
      <UpdateRegistryTagModal mode={mode} />
    </>
  );
}
