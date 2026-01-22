"use client";

import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { REGISTRY_TAG_VULNERABILITY_PAGE_SIZE } from "@/domain/registry/constants/registry-tag.constant";
import { useGetRegistryTagVulnerabilitiesByMode } from "@/domain/registry/hooks/use-get-registry-tag-vulnerabilities-by-mode";
import { registryTagVulnerabilityPageAtom } from "@/domain/registry/state/registry-tag.atom";
import { PageHeader } from "@/shared/components/layouts/page-header";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";
import { RegistryTagAside } from "./registry-tag-aside";
import { RegistryTagBody } from "./registry-tag-body";
import { RegistryTagFilter } from "./registry-tag-filter";
import { RegistryTagFooter } from "./registry-tag-footer";

export function RegistryTagMain() {
  const { name, tagName } = useParams<{ name: string; tagName: string }>();
  const harborImageName = name ? decodeURIComponent(name) : "";

  const resetPage = useResetAtom(registryTagVulnerabilityPageAtom);

  const page = useAtomValue(registryTagVulnerabilityPageAtom);

  // TODO: 취약점 목록 조회 API 연동 필요
  const { data, isLoading, isError } = useGetRegistryTagVulnerabilitiesByMode(
    "private",
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
        pageKey="admin.private-registry.detail"
        pageParams={{ name: name ?? "", tagName: tagName ?? "" }}
      />
      <DetailPageBody>
        <RegistryTagAside />
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
      {/* <DeletePrivateRegistryTagModal /> */}
    </>
  );
}
