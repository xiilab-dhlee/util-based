"use client";

import Image from "next/image";
import styled from "styled-components";

import { MySpinner } from "@/shared/components/spinner";

/**
 * 파일 확장자를 MIME 타입용으로 정규화
 *
 * - 앞의 점(.) 제거
 * - 소문자 변환
 * - jpg → jpeg 매핑
 * - svg → svg+xml 매핑
 */
function normalizeExtensionForMime(extension: string | null): string {
  if (!extension) return "png";

  const normalized = extension.replace(/^\./, "").toLowerCase();

  if (normalized === "jpg") return "jpeg";
  if (normalized === "svg") return "svg+xml";

  return normalized;
}

export interface WorkloadFilePreviewProps {
  previewType: "image" | "text" | null;
  previewData: string | undefined;
  isLoading: boolean;
  isError: boolean;
  fileName: string;
  fileExtension: string | null;
}

/**
 * 워크로드 파일 미리보기 컴포넌트
 *
 * 이미지와 텍스트 파일의 미리보기를 표시합니다.
 */
export function WorkloadFilePreview({
  previewType,
  previewData,
  isLoading,
  isError,
  fileName,
  fileExtension,
}: WorkloadFilePreviewProps) {
  // 미리보기 불가
  if (!previewType) {
    return <Description>미리보기를 지원하지 않는 파일입니다.</Description>;
  }

  // 로딩 중
  if (isLoading) {
    return (
      <PreviewLoading>
        <MySpinner />
      </PreviewLoading>
    );
  }

  // 에러 발생
  if (isError) {
    return (
      <Description>미리보기를 불러오는 중 오류가 발생했습니다.</Description>
    );
  }

  // 데이터 없음
  if (!previewData) {
    return <Description>미리보기를 불러올 수 없습니다.</Description>;
  }

  // 이미지 미리보기
  if (previewType === "image") {
    const mimeType = normalizeExtensionForMime(fileExtension);
    const imageSrc = `data:image/${mimeType};base64,${previewData}`;

    return (
      <ImagePreview>
        <Image
          src={imageSrc}
          alt={fileName}
          fill
          unoptimized
          draggable={false}
        />
      </ImagePreview>
    );
  }

  // 텍스트 미리보기
  return (
    <TextPreview>
      <pre>{previewData}</pre>
    </TextPreview>
  );
}

const Description = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-size: 13px;
  font-weight: 400;
  color: #666;
`;

const PreviewLoading = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  background-color: #f5f5f5;
`;

const TextPreview = styled.div`
  flex: 1;
  overflow: auto;
  max-height: 300px;
  background: #f5f5f5;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  padding: 12px;

  pre {
    margin: 0;
    font-family: "Consolas", "Monaco", "Courier New", monospace;
    font-size: 12px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-wrap: break-word;
    color: #333;
  }
`;
