"use client";

import styled from "styled-components";

interface IntegratedResourceCardProps {
  type: "gpu" | "cpu" | "memory";
  label: string;
  /** 숫자 값 (API에서 받을 값) */
  number: string | number;
  /** 단위 텍스트 */
  unit: string;
}

/**
 * 피그마 원본과 동일한 통합 SVG 리소스 카드
 * 배경 패턴 + 아이콘이 하나의 SVG로 구성
 */
export default function IntegratedResourceCard({
  type,
  label,
  number,
  unit,
}: IntegratedResourceCardProps) {
  const getTypeConfig = () => {
    switch (type) {
      case "gpu":
        return {
          color: "#F1BEFF",
          iconPath:
            "M10.8 20.97L4.8 17.52C4.42 17.3 4.125 17.01 3.915 16.65C3.705 16.29 3.6 15.89 3.6 15.45V8.55C3.6 8.11 3.705 7.71 3.915 7.35C4.125 6.99 4.42 6.7 4.8 6.48L10.8 3.03C11.18 2.81 11.58 2.7 12 2.7C12.42 2.7 12.82 2.81 13.2 3.03L19.2 6.48C19.58 6.7 19.875 6.99 20.085 7.35C20.295 7.71 20.4 8.11 20.4 8.55V15.45C20.4 15.89 20.295 16.29 20.085 16.65C19.875 17.01 19.58 17.3 19.2 17.52L13.2 20.97C12.82 21.19 12.42 21.3 12 21.3C11.58 21.3 11.18 21.19 10.8 20.97ZM10.8 18.21V12.69L6 9.9V15.45L10.8 18.21ZM13.2 18.21L18 15.45V9.9L13.2 12.69V18.21ZM0 6V2.4C0 1.74 0.235 1.175 0.705 0.705C1.175 0.235 1.74 0 2.4 0H6V2.4H2.4V6H0ZM6 24H2.4C1.74 24 1.175 23.765 0.705 23.295C0.235 22.825 0 22.26 0 21.6V18H2.4V21.6H6V24ZM18 24V21.6H21.6V18H24V21.6C24 22.26 23.765 22.825 23.295 23.295C22.825 23.765 22.26 24 21.6 24H18ZM21.6 6V2.4H18V0H21.6C22.26 0 22.825 0.235 23.295 0.705C23.765 1.175 24 1.74 24 2.4V6H21.6ZM12 10.62L16.74 7.83L12 5.1L7.26 7.83L12 10.62Z",
        };
      case "cpu":
        return {
          color: "#92D2FF",
          iconPath:
            "M16.1875 13.8125H24.4406C24.1437 11.6354 23.2383 9.78984 21.7242 8.27578C20.2102 6.76172 18.3646 5.85625 16.1875 5.55938V13.8125ZM13.8125 24.4406V5.55938C11.4177 5.85625 9.43359 6.90026 7.86016 8.69141C6.28672 10.4826 5.5 12.5854 5.5 15C5.5 17.4146 6.28672 19.5174 7.86016 21.3086C9.43359 23.0997 11.4177 24.1437 13.8125 24.4406ZM16.1875 24.4406C18.3646 24.1635 20.2151 23.263 21.7391 21.7391C23.263 20.2151 24.1635 18.3646 24.4406 16.1875H16.1875V24.4406ZM15 26.875C13.3573 26.875 11.8135 26.5633 10.3688 25.9398C8.92396 25.3164 7.66719 24.4703 6.59844 23.4016C5.52969 22.3328 4.68359 21.076 4.06016 19.6313C3.43672 18.1865 3.125 16.6427 3.125 15C3.125 13.3573 3.43672 11.8135 4.06016 10.3688C4.68359 8.92396 5.52969 7.66719 6.59844 6.59844C7.66719 5.52969 8.92396 4.68359 10.3688 4.06016C11.8135 3.43672 13.3573 3.125 15 3.125C16.6427 3.125 18.1815 3.43672 19.6164 4.06016C21.0513 4.68359 22.3081 5.53464 23.3867 6.61328C24.4654 7.69193 25.3164 8.9487 25.9398 10.3836C26.5633 11.8185 26.875 13.3573 26.875 15C26.875 16.6229 26.5633 18.1568 25.9398 19.6016C25.3164 21.0464 24.4703 22.3081 23.4016 23.3867C22.3328 24.4654 21.076 25.3164 19.6313 25.9398C18.1865 26.5633 16.6427 26.875 15 26.875Z",
        };
      case "memory":
        return {
          color: "#9EF6DC",
          iconPath:
            "M11.4375 18.5625V11.4375H18.5625V18.5625H11.4375ZM13.8125 16.1875H16.1875V13.8125H13.8125V16.1875ZM11.4375 25.6875V23.3125H9.0625C8.40937 23.3125 7.85026 23.0799 7.38516 22.6148C6.92005 22.1497 6.6875 21.5906 6.6875 20.9375V18.5625H4.3125V16.1875H6.6875V13.8125H4.3125V11.4375H6.6875V9.0625C6.6875 8.40937 6.92005 7.85026 7.38516 7.38516C7.85026 6.92005 8.40937 6.6875 9.0625 6.6875H11.4375V4.3125H13.8125V6.6875H16.1875V4.3125H18.5625V6.6875H20.9375C21.5906 6.6875 22.1497 6.92005 22.6148 7.38516C23.0799 7.85026 23.3125 8.40937 23.3125 9.0625V11.4375H25.6875V13.8125H23.3125V16.1875H25.6875V18.5625H23.3125V20.9375C23.3125 21.5906 23.0799 22.1497 22.6148 22.6148C22.1497 23.0799 21.5906 23.3125 20.9375 23.3125H18.5625V25.6875H16.1875V23.3125H13.8125V25.6875H11.4375ZM20.9375 20.9375V9.0625H9.0625V20.9375H20.9375Z",
        };
    }
  };

  const config = getTypeConfig();

  return (
    <ResourceCard>
      {/* 좌측 SVG 영역 (74px) - 그리드 패턴 + 아이콘만 */}
      <LeftSection>
        <svg
          width="74"
          height="88"
          viewBox="0 0 74 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 피그마 정확한 그라데이션들 */}
            <linearGradient
              id={`paint0_linear_${type}`}
              x1="35.5"
              y1="-1.91795e-08"
              x2="35.5"
              y2="88"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#070913" />
              <stop offset="0.5" stopColor="white" />
              <stop offset="1" stopColor="#070913" />
            </linearGradient>
            <linearGradient
              id={`paint1_linear_${type}`}
              x1="19.5"
              y1="-1.91795e-08"
              x2="19.5"
              y2="88"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#070913" />
              <stop offset="0.5" stopColor="white" />
              <stop offset="1" stopColor="#070913" />
            </linearGradient>
            <linearGradient
              id={`paint5_linear_${type}`}
              x1="69"
              y1="85.5"
              x2="4.00001"
              y2="85.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#070913" />
              <stop offset="0.389423" stopColor="white" />
              <stop offset="0.925481" stopColor="white" />
              <stop offset="1" stopColor="#070913" />
            </linearGradient>
            <linearGradient
              id={`paint6_linear_${type}`}
              x1="69"
              y1="69.5"
              x2="4"
              y2="69.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#070913" />
              <stop offset="0.109797" stopColor="white" stopOpacity="0.8" />
              <stop offset="0.925481" stopColor="white" />
              <stop offset="1" stopColor="#070913" />
            </linearGradient>

            {/* 아이콘 그림자 필터 (42px 컨테이너용) */}
            <filter
              id={`filter0_dd_${type}`}
              x="-10"
              y="-10"
              width="62"
              height="62"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.415686 0 0 0 0 0.219608 0 0 0 0 0.882353 0 0 0 0.36 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.85 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_dropShadow"
                result="effect2_dropShadow"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect2_dropShadow"
                result="shape"
              />
            </filter>
          </defs>

          {/* 기본 배경 */}
          <rect x="0" y="0" width="74" height="88" fill="#070913" />

          {/* 피그마 정확한 그리드 패턴 배경 */}
          <g opacity="0.8">
            {/* 세로 라인들 */}
            <line
              x1="36.5"
              y1="1.91795e-08"
              x2="36.5"
              y2="88"
              stroke={`url(#paint0_linear_${type})`}
            />
            <line
              x1="20.5"
              y1="1.91795e-08"
              x2="20.5"
              y2="88"
              stroke={`url(#paint1_linear_${type})`}
            />
            <line
              x1="28.5"
              y1="1.91795e-08"
              x2="28.5"
              y2="88"
              stroke={`url(#paint1_linear_${type})`}
            />
            <line
              x1="44.5"
              y1="1.91795e-08"
              x2="44.5"
              y2="88"
              stroke={`url(#paint1_linear_${type})`}
            />
            <line
              x1="12.5"
              y1="1.91795e-08"
              x2="12.5"
              y2="88"
              stroke={`url(#paint1_linear_${type})`}
              strokeOpacity="0.3"
            />
            <line
              x1="52.5"
              y1="88"
              x2="52.5"
              y2="1.96255e-08"
              stroke={`url(#paint1_linear_${type})`}
            />
            <line
              x1="60.5"
              y1="88"
              x2="60.5"
              y2="1.96255e-08"
              stroke={`url(#paint1_linear_${type})`}
              strokeOpacity="0.56"
            />

            {/* 가로 라인들 */}
            <line
              opacity="0.1"
              x1="74"
              y1="86.5"
              x2="0"
              y2="86.5"
              stroke={`url(#paint5_linear_${type})`}
            />
            <line
              opacity="0.5"
              x1="74"
              y1="70.5"
              x2="0"
              y2="70.5"
              stroke={`url(#paint6_linear_${type})`}
            />
            <line
              opacity="0.3"
              x1="74"
              y1="78.5"
              x2="0"
              y2="78.5"
              stroke={`url(#paint5_linear_${type})`}
            />
            <line
              opacity="0.7"
              x1="74"
              y1="62.5"
              x2="0"
              y2="62.5"
              stroke={`url(#paint6_linear_${type})`}
            />
            <line
              x1="74"
              y1="54.5"
              x2="0"
              y2="54.5"
              stroke={`url(#paint6_linear_${type})`}
            />
            <line
              opacity="0.5"
              x1="74"
              y1="22.5"
              x2="0"
              y2="22.5"
              stroke={`url(#paint6_linear_${type})`}
            />
            <line
              opacity="0.7"
              x1="74"
              y1="30.5"
              x2="0"
              y2="30.5"
              stroke={`url(#paint6_linear_${type})`}
            />
            <line
              opacity="0.7"
              x1="74"
              y1="38.5"
              x2="0"
              y2="38.5"
              stroke={`url(#paint6_linear_${type})`}
            />
            <line
              x1="74"
              y1="46.5"
              x2="0"
              y2="46.5"
              stroke={`url(#paint6_linear_${type})`}
            />
          </g>

          {/* Dimmed 오버레이 */}
          <rect
            opacity="0.7"
            x="0"
            y="0"
            width="74"
            height="88"
            fill="#070913"
          />

          {/* 아이콘을 배경 위에 덮어쓰기 */}
          <g transform="translate(16, 23)">
            {/* 아이콘 배경 (42px × 42px 컨테이너) */}
            <g filter={`url(#filter0_dd_${type})`}>
              <rect x="0" y="0" width="42" height="42" rx="2" fill="#070913" />
              <rect
                x="0.5"
                y="0.5"
                width="41"
                height="41"
                rx="1.5"
                stroke={config.color}
              />
            </g>

            {/* 아이콘 - 42px 컨테이너 정가운데 배치 (foreignObject 사용) */}
            <foreignObject x="9" y="9" width="24" height="24">
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox={type === "gpu" ? "0 0 24 24" : "0 0 30 30"}
                  fill="none"
                >
                  <path d={config.iconPath} fill={config.color} />
                </svg>
              </div>
            </foreignObject>
          </g>
        </svg>
      </LeftSection>

      {/* 우측 텍스트 영역 (102px) - 일반 HTML */}
      <RightSection>
        <Label>{label}</Label>
        <Divider />
        <Value>
          <NumberPart>{number}</NumberPart>
          <UnitPart>{unit}</UnitPart>
        </Value>
      </RightSection>
    </ResourceCard>
  );
}

const ResourceCard = styled.div`
  width: 100%;
  height: 88px;
  border-radius: 4px;
  border: 1px solid #2a3041;
  overflow: hidden;
  position: relative;
  display: flex;
  background: #070913;

  /* 피그마 정확한 비율: 176px width */
  aspect-ratio: 176 / 88;
`;

const LeftSection = styled.div`
  width: 74px;
  height: 88px;
  flex-shrink: 0;
  position: relative;
  border-radius: 4px 0 0 4px;
  overflow: hidden;
`;

const RightSection = styled.div`
  flex: 1;
  height: 88px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 9px;
  background: #070913;
  border-radius: 0 4px 4px 0;
`;

const Label = styled.div`
  font-family: "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #c5c6c8;
  line-height: 1;
`;

const Divider = styled.div`
  width: 78px;
  height: 1px;
  background: #2a3041;
  margin: 8px 0;
`;

const Value = styled.div`
  font-family: "Pretendard", sans-serif;
  color: #f5f5f5;
  line-height: 1;
  display: flex;
  align-items: baseline;
  gap: 2px;
`;

const NumberPart = styled.span`
  font-size: 18px;
  font-weight: 500;
`;

const UnitPart = styled.span`
  font-size: 14px;
  font-weight: 500;
`;
