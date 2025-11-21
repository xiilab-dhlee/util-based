"use client";

import Image from "next/image";
import styled from "styled-components";

import { AsideFillCard } from "@/shared/components/layouts/aside-fill-card";

/**
 * 가이드 이미지 타입
 */
interface GuideImage {
  id: string;
  src: string;
  alt: string;
}

/**
 * 페이지 이미지 가이드 컴포넌트의 props 인터페이스
 */
interface PageImageGuideProps {
  /** 제목 */
  title: string;
  /** 가이드 이미지 리스트 */
  guideImages: GuideImage[];
}

/**
 * 페이지 이미지 가이드 컴포넌트
 */
export function PageImageGuide({ title, guideImages }: PageImageGuideProps) {
  return (
    <AsideFillCard title={title}>
      {guideImages.map((guideImage) => (
        <Item key={guideImage.id}>
          <Image
            src={guideImage.src}
            alt={guideImage.alt}
            width={360}
            height={118}
          />
        </Item>
      ))}
    </AsideFillCard>
  );
}

const Item = styled.div`
  width: 100%;
  height: 118px;
  overflow: hidden;
  border-radius: 8px;

  & + & {
    margin-top: 8px;
  }
`;
