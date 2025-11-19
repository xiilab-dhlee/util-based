"use client";

import styled from "styled-components";
import WorkloadBackground from "./workload-background";

interface WorkloadStatusCardProps {
  /** 상태 타입 */
  type: "running" | "stopped" | "waiting" | "error";
  /** 건수 텍스트 */
  count: string;
  /** 하단 라벨 */
  label: string;
  /** 카드 크기 (기본: 136px) */
  size?: number;
}

/**
 * 워크로드 상태 카드 컴포넌트
 * 피그마 디자인과 완전 일치하는 반원형 배경 + 원형 아이콘 + 텍스트 구성
 */
export default function WorkloadStatusCard({
  type,
  count,
  label,
  size = 136,
}: WorkloadStatusCardProps) {
  const getTypeConfig = () => {
    switch (type) {
      case "running":
        return {
          backgroundColor: "#86B6FF",
          borderColor: "#86B6FF",
          labelDotColor: "#3E8AFF",
          iconBackgroundColor: "rgba(134, 182, 255, 0.4)",
          circleStrokeColor: "#86B6FF",
          icon: (
            <svg width="16.5" height="16.5" viewBox="0 0 18 18" fill="none">
              <path
                d="M7.28125 12.0938L12.0938 9L7.28125 5.90625V12.0938ZM9 15.875C8.04896 15.875 7.15521 15.6945 6.31875 15.3336C5.48229 14.9727 4.75469 14.4828 4.13594 13.8641C3.51719 13.2453 3.02734 12.5177 2.66641 11.6813C2.30547 10.8448 2.125 9.95104 2.125 9C2.125 8.04896 2.30547 7.15521 2.66641 6.31875C3.02734 5.48229 3.51719 4.75469 4.13594 4.13594C4.75469 3.51719 5.48229 3.02734 6.31875 2.66641C7.15521 2.30547 8.04896 2.125 9 2.125C9.95104 2.125 10.8448 2.30547 11.6813 2.66641C12.5177 3.02734 13.2453 3.51719 13.8641 4.13594C14.4828 4.75469 14.9727 5.48229 15.3336 6.31875C15.6945 7.15521 15.875 8.04896 15.875 9C15.875 9.95104 15.6945 10.8448 15.3336 11.6813C14.9727 12.5177 14.4828 13.2453 13.8641 13.8641C13.2453 14.4828 12.5177 14.9727 11.6813 15.3336C10.8448 15.6945 9.95104 15.875 9 15.875ZM9 14.5C10.5354 14.5 11.8359 13.9672 12.9016 12.9016C13.9672 11.8359 14.5 10.5354 14.5 9C14.5 7.46458 13.9672 6.16406 12.9016 5.09844C11.8359 4.03281 10.5354 3.5 9 3.5C7.46458 3.5 6.16406 4.03281 5.09844 5.09844C4.03281 6.16406 3.5 7.46458 3.5 9C3.5 10.5354 4.03281 11.8359 5.09844 12.9016C6.16406 13.9672 7.46458 14.5 9 14.5Z"
                fill="#6C94D0"
              />
            </svg>
          ),
        };
      case "stopped":
        return {
          backgroundColor: "#C3C3C3",
          borderColor: "#BFC1C6",
          labelDotColor: "#FBFBFB",
          iconBackgroundColor: "rgba(186, 186, 186, 0.4)",
          circleStrokeColor: "#BFC1C6",
          icon: (
            <svg width="16.5" height="16.5" viewBox="0 0 24 24" fill="none">
              <g clipPath="url(#clip0_stopped)">
                <path
                  d="M12.6667 6H11.3333V12.6667H12.6667V6ZM15.8867 7.44667L14.94 8.39333C15.9933 9.24 16.6667 10.54 16.6667 12C16.6667 14.58 14.58 16.6667 12 16.6667C9.42 16.6667 7.33333 14.58 7.33333 12C7.33333 10.54 8.00667 9.24 9.05333 8.38667L8.11333 7.44667C6.82 8.54667 6 10.1733 6 12C6 15.3133 8.68667 18 12 18C15.3133 18 18 15.3133 18 12C18 10.1733 17.18 8.54667 15.8867 7.44667Z"
                  fill="#A9B2BF"
                />
              </g>
              <defs>
                <clipPath id="clip0_stopped">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          ),
        };
      case "waiting":
        return {
          backgroundColor: "#6ECF2D",
          borderColor: "#79BA69",
          labelDotColor: "#52BC4A",
          iconBackgroundColor: "rgba(43, 76, 36, 0.4)",
          circleStrokeColor: "#79BA69",
          icon: (
            <svg width="16.5" height="16.5" viewBox="0 0 18 18" fill="none">
              <path
                d="M5.5625 10.0312C5.84896 10.0312 6.09245 9.93099 6.29297 9.73047C6.49349 9.52995 6.59375 9.28646 6.59375 9C6.59375 8.71354 6.49349 8.47005 6.29297 8.26953C6.09245 8.06901 5.84896 7.96875 5.5625 7.96875C5.27604 7.96875 5.03255 8.06901 4.83203 8.26953C4.63151 8.47005 4.53125 8.71354 4.53125 9C4.53125 9.28646 4.63151 9.52995 4.83203 9.73047C5.03255 9.93099 5.27604 10.0312 5.5625 10.0312ZM9 10.0312C9.28646 10.0312 9.52995 9.93099 9.73047 9.73047C9.93099 9.52995 10.0312 9.28646 10.0312 9C10.0312 8.71354 9.93099 8.47005 9.73047 8.26953C9.52995 8.06901 9.28646 7.96875 9 7.96875C8.71354 7.96875 8.47005 8.06901 8.26953 8.26953C8.06901 8.47005 7.96875 8.71354 7.96875 9C7.96875 9.28646 8.06901 9.52995 8.26953 9.73047C8.47005 9.93099 8.71354 10.0312 9 10.0312ZM12.4375 10.0312C12.724 10.0312 12.9674 9.93099 13.168 9.73047C13.3685 9.52995 13.4688 9.28646 13.4688 9C13.4688 8.71354 13.3685 8.47005 13.168 8.26953C12.9674 8.06901 12.724 7.96875 12.4375 7.96875C12.151 7.96875 11.9076 8.06901 11.707 8.26953C11.5065 8.47005 11.4062 8.71354 11.4062 9C11.4062 9.28646 11.5065 9.52995 11.707 9.73047C11.9076 9.93099 12.151 10.0312 12.4375 10.0312ZM9 15.875C8.04896 15.875 7.15521 15.6945 6.31875 15.3336C5.48229 14.9727 4.75469 14.4828 4.13594 13.8641C3.51719 13.2453 3.02734 12.5177 2.66641 11.6813C2.30547 10.8448 2.125 9.95104 2.125 9C2.125 8.04896 2.30547 7.15521 2.66641 6.31875C3.02734 5.48229 3.51719 4.75469 4.13594 4.13594C4.75469 3.51719 5.48229 3.02734 6.31875 2.66641C7.15521 2.30547 8.04896 2.125 9 2.125C9.95104 2.125 10.8448 2.30547 11.6813 2.66641C12.5177 3.02734 13.2453 3.51719 13.8641 4.13594C14.4828 4.75469 14.9727 5.48229 15.3336 6.31875C15.6945 7.15521 15.875 8.04896 15.875 9C15.875 9.95104 15.6945 10.8448 15.3336 11.6813C14.9727 12.5177 14.4828 13.2453 13.8641 13.8641C13.2453 14.4828 12.5177 14.9727 11.6813 15.3336C10.8448 15.6945 9.95104 15.875 9 15.875ZM9 14.5C10.5354 14.5 11.8359 13.9672 12.9016 12.9016C13.9672 11.8359 14.5 10.5354 14.5 9C14.5 7.46458 13.9672 6.16406 12.9016 5.09844C11.8359 4.03281 10.5354 3.5 9 3.5C7.46458 3.5 6.16406 4.03281 5.09844 5.09844C4.03281 6.16406 3.5 7.46458 3.5 9C3.5 10.5354 4.03281 11.8359 5.09844 12.9016C6.16406 13.9672 7.46458 14.5 9 14.5Z"
                fill="#4F9838"
              />
            </svg>
          ),
        };
      case "error":
        return {
          backgroundColor: "#FF8080",
          borderColor: "#FF8080",
          labelDotColor: "#FF5858",
          iconBackgroundColor: "rgba(255, 128, 128, 0.4)",
          circleStrokeColor: "#FF8080",
          icon: (
            <svg width="16.5" height="16.5" viewBox="0 0 18 18" fill="none">
              <path
                d="M9.00087 15.9627C8.81568 15.9627 8.63918 15.928 8.47135 15.8585C8.30353 15.7891 8.15017 15.6907 8.01128 15.5634L2.43837 9.99045C2.31105 9.85156 2.21267 9.69821 2.14323 9.53038C2.07378 9.36256 2.03906 9.18605 2.03906 9.00087C2.03906 8.81568 2.07378 8.63628 2.14323 8.46267C2.21267 8.28906 2.31105 8.1386 2.43837 8.01128L8.01128 2.43837C8.15017 2.29948 8.30353 2.19821 8.47135 2.13455C8.63918 2.07089 8.81568 2.03906 9.00087 2.03906C9.18605 2.03906 9.36545 2.07089 9.53906 2.13455C9.71267 2.19821 9.86314 2.29948 9.99045 2.43837L15.5634 8.01128C15.7023 8.1386 15.8035 8.28906 15.8672 8.46267C15.9308 8.63628 15.9627 8.81568 15.9627 9.00087C15.9627 9.18605 15.9308 9.36256 15.8672 9.53038C15.8035 9.69821 15.7023 9.85156 15.5634 9.99045L9.99045 15.5634C9.86314 15.6907 9.71267 15.7891 9.53906 15.8585C9.36545 15.928 9.18605 15.9627 9.00087 15.9627ZM9.00087 14.5738L14.5738 9.00087L9.00087 3.42795L3.42795 9.00087L9.00087 14.5738ZM8.30642 9.69531H9.69531V5.52865H8.30642V9.69531ZM9.00087 11.7786C9.19763 11.7786 9.36256 11.7121 9.49566 11.579C9.62876 11.4459 9.69531 11.281 9.69531 11.0842C9.69531 10.8874 9.62876 10.7225 9.49566 10.5894C9.36256 10.4563 9.19763 10.3898 9.00087 10.3898C8.80411 10.3898 8.63918 10.4563 8.50608 10.5894C8.37297 10.7225 8.30642 10.8874 8.30642 11.0842C8.30642 11.281 8.37297 11.4459 8.50608 11.579C8.63918 11.7121 8.80411 11.7786 9.00087 11.7786Z"
                fill="#FF5858"
              />
            </svg>
          ),
        };
    }
  };

  const config = getTypeConfig();

  return (
    <Container>
      <CardWrapper size={size}>
        {/* 재사용 가능한 워크로드 배경 컴포넌트 */}
        <WorkloadBackground
          type={type}
          width={size}
          height={size / 2}
          style={{ position: "absolute", bottom: 0, left: 0 }}
        />

        {/* 좌상단 라벨 (색깔 점 + 텍스트) */}
        <TopLeftLabel>
          <LabelDot color={config.labelDotColor} />
          <LabelText>{label}</LabelText>
        </TopLeftLabel>

        {/* 중앙 상단 원형 아이콘 */}
        <CenterTopIcon>
          <CircularIconWrapper>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
            >
              <circle cx="13" cy="13" r="13" fill="black" />
              <circle
                cx="13"
                cy="13"
                r="12.5"
                stroke={config.circleStrokeColor}
                strokeOpacity="0.4"
              />
            </svg>
            <IconContainer>{config.icon}</IconContainer>
          </CircularIconWrapper>
        </CenterTopIcon>

        {/* 중앙 하단 카운트 텍스트 */}
        <CenterBottomText>
          <CountText>{count}</CountText>
        </CenterBottomText>
      </CardWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CardWrapper = styled.div<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => Math.floor(size * 0.85)}px; /* 전체 높이 줄임 */
  position: relative;
  display: flex;
  align-items: flex-end; /* 하단 정렬로 반원을 아래쪽에 배치 */
  justify-content: center;
`;

const TopLeftLabel = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LabelDot = styled.div<{ color: string }>`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  flex-shrink: 0;
`;

const LabelText = styled.span`
  color: #ffffff;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  white-space: nowrap;
`;

const CenterTopIcon = styled.div`
  position: absolute;
  top: 34px; /* 점선이 지나가는 위치에 정확히 겹침 */
  left: 50%;
  transform: translateX(-50%);
  z-index: 15; /* 점선보다 위에 표시 */
`;

const CenterBottomText = styled.div`
  position: absolute;
  bottom: 14px; /* 바닥에서 14px 위치 */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CountText = styled.div`
  color: #f5f5f5;
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  text-align: center;
`;

const CircularIconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
`;

const IconContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  width: 16.5px !important;
  height: 16.5px !important;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16.5px !important;
    height: 16.5px !important;
    flex-shrink: 0;
  }
`;
