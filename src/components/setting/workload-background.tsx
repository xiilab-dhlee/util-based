"use client";

import { useId } from "react";
import styled from "styled-components";

interface WorkloadBackgroundProps {
  /** 워크로드 상태 타입 */
  type: "running" | "stopped" | "waiting" | "error";
  /** SVG 너비 (기본: 136px) */
  width?: number;
  /** SVG 높이 (기본: 68px) */
  height?: number;
  /** 전체 투명도 (기본: 0.5) */
  opacity?: number;
  /** 점선 표시 여부 (기본: true) */
  showDashedBorder?: boolean;
  /** 점선 투명도 (기본: 0.3) */
  dashedBorderOpacity?: number;
  /** CSS 클래스명 */
  className?: string;
  /** 인라인 스타일 */
  style?: React.CSSProperties;
}

/**
 * 워크로드 상태별 반원형 배경 컴포넌트
 * 색상을 props로 받아서 동적으로 변경할 수 있는 재사용 가능한 컴포넌트
 */
export default function WorkloadBackground({
  type,
  width = 136,
  height = 68,
  opacity = 0.5,
  showDashedBorder = true,
  dashedBorderOpacity = 0.3,
  className,
  style,
}: WorkloadBackgroundProps) {
  const getColorConfig = () => {
    switch (type) {
      case "running":
        return {
          primaryColor: "#86B6FF",
          borderColor: "#86B6FF",
        };
      case "stopped":
        return {
          primaryColor: "#C3C3C3",
          borderColor: "#BFC1C6",
        };
      case "waiting":
        return {
          primaryColor: "#6ECF2D",
          borderColor: "#79BA69",
        };
      case "error":
        return {
          primaryColor: "#FF8080",
          borderColor: "#FF8080",
        };
    }
  };

  const config = getColorConfig();
  const reactId = useId();
  const uniqueId = `workload_bg_${type}_${reactId.replace(/:/g, "_")}`;

  return (
    <StyledSvg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient
          id={`paint0_linear_${uniqueId}`}
          x1={width / 2}
          y1="0"
          x2={width / 2}
          y2={height - 1}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={config.primaryColor} stopOpacity="0.4" />
          <stop offset="0.646246" stopColor="#171B26" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 반원형 배경 */}
      <path
        opacity={opacity}
        d="M136 68C136 59.0701 134.241 50.2277 130.824 41.9775C127.406 33.7274 122.398 26.2311 116.083 19.9167C109.769 13.6024 102.273 8.59351 94.0225 5.17619C85.7723 1.75887 76.9299 -3.90338e-07 68 0C59.0701 3.90338e-07 50.2277 1.75887 41.9775 5.17619C33.7274 8.59351 26.2311 13.6024 19.9167 19.9167C13.6024 26.2311 8.59351 33.7274 5.17619 41.9775C1.75887 50.2277 -7.80675e-07 59.0701 0 68L68 68H136Z"
        fill={`url(#paint0_linear_${uniqueId})`}
      />

      {/* 점선 테두리 */}
      {showDashedBorder && (
        <g opacity={dashedBorderOpacity}>
          <mask id={`path-1-inside-1_${uniqueId}`} fill="white">
            <path d="M136 68C136 59.0701 134.241 50.2277 130.824 41.9775C127.406 33.7274 122.398 26.2311 116.083 19.9167C109.769 13.6024 102.273 8.59351 94.0225 5.17619C85.7723 1.75887 76.9299 -3.90338e-07 68 0C59.0701 3.90338e-07 50.2277 1.75887 41.9775 5.17619C33.7274 8.59351 26.2311 13.6024 19.9167 19.9167C13.6024 26.2311 8.59351 33.7274 5.17619 41.9775C1.75887 50.2277 -7.80675e-07 59.0701 0 68L68 68H136Z" />
          </mask>
          <path
            d="M136 68C136 59.0701 134.241 50.2277 130.824 41.9775C127.406 33.7274 122.398 26.2311 116.083 19.9167C109.769 13.6024 102.273 8.59351 94.0225 5.17619C85.7723 1.75887 76.9299 -3.90338e-07 68 0C59.0701 3.90338e-07 50.2277 1.75887 41.9775 5.17619C33.7274 8.59351 26.2311 13.6024 19.9167 19.9167C13.6024 26.2311 8.59351 33.7274 5.17619 41.9775C1.75887 50.2277 -7.80675e-07 59.0701 0 68L68 68H136Z"
            stroke={config.borderColor}
            strokeWidth="2"
            strokeDasharray="2 4"
            mask={`url(#path-1-inside-1_${uniqueId})`}
          />
        </g>
      )}
    </StyledSvg>
  );
}

const StyledSvg = styled.svg`
  display: block;
  flex-shrink: 0;
`;
