"use client";

import { useSession } from "next-auth/react";
import styled from "styled-components";
import { Button, Icon } from "xiilab-ui";

import type { RegistryDetailResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { checkIsUser, getSessionAccountId } from "@/shared/utils/auth.util";
import { formatDateSafely } from "@/shared/utils/date.util";
import { ListSectionTitle } from "@/styles/layers/list-page-layers.styled";

interface RegistryImageInfoPanelProps {
  mode: RegistryMode;
  harborImageName: string;
  data?: RegistryDetailResponse;
}

/**
 * 레지스트리 이미지 기본 정보 패널 컴포넌트
 *
 * 이미지의 기본 정보(구분, 이름, 생성자, 생성일)를 표시하고
 * 삭제 권한이 있는 경우 삭제 버튼을 제공합니다.
 */
export function RegistryImageInfoPanel({
  mode,
  harborImageName,
  data,
}: RegistryImageInfoPanelProps) {
  const { data: session } = useSession();
  const publish = usePublish();

  // 생성자, 관리자(admin, super admin) 삭제 허용
  const isUser = checkIsUser(session);
  const sessionAccountId = getSessionAccountId(session);
  const isOwner = data?.creatorId === sessionAccountId;
  const canDelete = !!session && (!isUser || isOwner);

  const handleDelete = () => {
    publish(REGISTRY_EVENTS.openDeleteModal, [harborImageName]);
  };

  return (
    <>
      {/* 이미지 기본 정보 헤더 */}
      <Header>
        <ListSectionTitle>컨테이너 이미지 기본 정보</ListSectionTitle>
        {canDelete && (
          <Button
            width={80}
            size="small"
            variant="outlined"
            onClick={handleDelete}
            height={34}
          >
            이미지 삭제
          </Button>
        )}
      </Header>

      {/* 이미지 기본 정보 패널 */}
      <InfoPanel>
        <Pane>
          <Record>
            <IconWrapper>
              <Icon name="Information" color="var(--icon-fill)" size={20} />
            </IconWrapper>
            <Key>구분 :</Key>
            <SourceTypeValue>
              {data?.imageSourceType?.toLowerCase() || "-"}
            </SourceTypeValue>
          </Record>
          <Record>
            <IconWrapper>
              <Icon name="Information" color="var(--icon-fill)" size={20} />
            </IconWrapper>
            <Key>이름 :</Key>
            <Value>{data?.imageDisplayName || "-"}</Value>
          </Record>
          {mode === "public" && (
            <Record>
              <IconWrapper>
                <Icon name="Person" color="var(--icon-fill)" size={16} />
              </IconWrapper>
              <Key>생성자 :</Key>
              <Value>{data?.creatorName || "-"}</Value>
            </Record>
          )}
          <Record>
            <IconWrapper>
              <Icon name="Calendar" color="var(--icon-fill)" size={20} />
            </IconWrapper>
            <Key>생성일 :</Key>
            <Value>{formatDateSafely(data?.createdAt)}</Value>
          </Record>
        </Pane>
      </InfoPanel>
    </>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const InfoPanel = styled.div`
  border: 1px solid #e0e0e0;
  background-color: #f7f9fb;
  padding: 10px;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  margin-bottom: 38px;
  border-radius: 4px;
`;

const Pane = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  & + & {
    border-left: 1px solid #e0e0e0;
    margin-left: 10px;
    padding-left: 10px;
  }
`;

const Record = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 11px;

  & + & {
    border-top: 1px solid #e0e0e0;
    padding-top: 10px;
    margin-top: 10px;
  }
`;

const IconWrapper = styled.div`
  border: 1px solid #d1d5dc;
  border-radius: 2px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;

  --icon-fill: #000;
`;

const Key = styled.span`
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  color: #000;
`;

const Value = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #000;
`;

const SourceTypeValue = styled(Value)`
  text-transform: capitalize;
`;
