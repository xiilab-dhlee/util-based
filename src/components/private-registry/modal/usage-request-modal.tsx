"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { Card, Icon, Input, Modal, Typography } from "xiilab-ui";

const ContentSection = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin: 8px 0;
`;

const LeftSection = styled.div`
  width: 266px;
`;

const RightSection = styled.div`
  width: 266px;
`;

const SectionTitle = styled(Typography.Text).attrs({
  variant: "body-2-2", // 12px, 600 weight
  as: "h4",
})`
  color: #000000;
  margin: 0;
`;

const TagHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  height: 16px;
  gap: 6px;
`;

const TagCount = styled(Typography.Text).attrs({
  variant: "body-3-3", // 11px, 400 weight
})`
  color: #000000;
`;

const TagListContainer = styled.div`
  width: 266px;
  height: 306px;
  background-color: #fafafa;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  position: relative;
`;

const TagList = styled.div`
  padding: 12px;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #dddddd transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #dddddd;
    border-radius: 3px;
  }

  /* Firefox에서 기본 스크롤바 숨기기 */
  scrollbar-width: thin;

  /* Edge, IE에서 스크롤바 스타일링 */
  -ms-overflow-style: -ms-autohiding-scrollbar;
`;

const VulnerabilityStats = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 20px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 35px;
`;

const StatLabel = styled(Typography.Text).attrs({
  variant: "body-4-1", // 10px, 600 weight
})`
  color: #484848;
  margin-bottom: 2px;
`;

const StatCount = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
})`
  color: #000000;
`;

const StatSeparator = styled.div`
  width: 1px;
  height: 20px;
  background-color: #e9ebee;
`;

const ReasonSection = styled.div`
  margin-bottom: 20px;
`;

const ReasonTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
  height: 16px;
`;

const ReasonLabel = styled(Typography.Text).attrs({
  variant: "body-2-2", // 12px, 600 weight
  as: "h4",
})`
  color: #000000;
  margin: 0;
`;

const TooltipIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const TooltipIconSvg = styled.svg`
  width: 12px;
  height: 12px;
  fill: #5f6368;
`;

const TagSizeBadge = styled(Typography.Text).attrs({
  variant: "body-4-2", // 10px, 400 weight
})`
  color: #000000;
  padding: 1px 8px;
  background-color: #fafafa;
  border: 1px solid #c1c7ce;
  border-radius: 2px;
`;

interface TagData {
  id: string;
  version: string;
  size: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface UsageRequestModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string, selectedTags: string[]) => void;
  selectedTags?: TagData[];
}

/**
 * 이미지 사용 요청 모달
 */
export function UsageRequestModal({
  open,
  onClose,
  onConfirm,
  selectedTags = [],
}: UsageRequestModalProps) {
  const [reason, setReason] = useState("");
  const [internalSelectedTags, setInternalSelectedTags] = useState<string[]>(
    [],
  );

  const handleClose = () => {
    setReason("");
    setInternalSelectedTags([]);
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(reason, internalSelectedTags);
    setReason("");
    setInternalSelectedTags([]);
    onClose();
  };

  const handleTagClick = (tagId: string) => {
    setInternalSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  // Use the provided selectedTags prop or fallback to empty array

  return (
    <Modal
      title="이미지 사용 요청"
      open={open}
      onCancel={handleClose}
      onOk={handleConfirm}
      modalWidth={588}
      height={466}
      centered
      icon={<Icon name="Request" color="#fff" size={20} />}
      type="primary"
      okText="사용 요청"
      closable={true}
      maskClosable={false}
      showHeaderBorder={true}
      getContainer={() => document.body}
      zIndex={1100}
    >
      <ContentSection>
        <LeftSection>
          <TagHeaderContainer>
            <SectionTitle>선택한 태그 정보</SectionTitle>
            <TagCount>총 {internalSelectedTags.length}건</TagCount>
          </TagHeaderContainer>
          <TagListContainer>
            <TagList>
              {selectedTags
                .filter((tag) => internalSelectedTags.includes(tag.id))
                .map((tag) => (
                  <Card
                    key={tag.id}
                    title={tag.version}
                    actionElement={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <TagSizeBadge>{tag.size}</TagSizeBadge>
                      </div>
                    }
                    width="242px"
                    height="86px"
                    style={{
                      background: "#F7F9FB",
                      border: "1px solid #D1D5DC",
                      borderRadius: "4px",
                      boxShadow:
                        "0px 4px 4px 0px rgba(171, 171, 171, 0.15), inset 0px 4px 4px 0px rgba(255, 255, 255, 0.25)",
                      marginBottom: "6px",
                      position: "relative",
                    }}
                    onClick={() => handleTagClick(tag.id)}
                    hoverable
                  >
                    {/* 취약점 통계 */}
                    <VulnerabilityStats>
                      <StatItem>
                        <StatLabel>Critical</StatLabel>
                        <StatCount>{tag.critical}</StatCount>
                      </StatItem>

                      <StatSeparator />

                      <StatItem>
                        <StatLabel>High</StatLabel>
                        <StatCount>{tag.high}</StatCount>
                      </StatItem>

                      <StatSeparator />

                      <StatItem>
                        <StatLabel>Medium</StatLabel>
                        <StatCount>{tag.medium}</StatCount>
                      </StatItem>

                      <StatSeparator />

                      <StatItem>
                        <StatLabel>Low</StatLabel>
                        <StatCount>{tag.low}</StatCount>
                      </StatItem>
                    </VulnerabilityStats>
                  </Card>
                ))}
            </TagList>
          </TagListContainer>
        </LeftSection>

        <RightSection>
          <ReasonSection>
            <ReasonTitle>
              <ReasonLabel>요청 사유</ReasonLabel>
              <TooltipIcon>
                <TooltipIconSvg viewBox="0 0 12 12">
                  <circle
                    cx="6"
                    cy="6"
                    r="5"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="none"
                  />
                  <path
                    d="M6 4v4M6 8h.01"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </TooltipIconSvg>
              </TooltipIcon>
            </ReasonTitle>
            <Input.TextArea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              height="200px"
              placeholder="이미지 사용 요청 사유를 입력해 주세요."
            />
          </ReasonSection>
        </RightSection>
      </ContentSection>
    </Modal>
  );
}

