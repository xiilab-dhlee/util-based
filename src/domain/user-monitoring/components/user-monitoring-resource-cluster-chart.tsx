import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import styled from "styled-components";

// 동적 import로 ApexCharts 로드 (SSR 비활성화)
const DynamicApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

/**
 * 대시보드 방사형 차트 컴포넌트의 Props 인터페이스
 */
interface UserMonitoringRadialBarProps {
  /** 차트에 표시할 데이터 값 (0-100 사이의 숫자) */
  series: number;
  /** 그라데이션 색상 배열 [시작색상, 끝색상] */
  gradientToColors: string[];
}

/**
 * UserMonitoringResourceClusterChart 컴포넌트
 *
 * 대시보드에서 사용되는 방사형(원형) 진행률 차트 컴포넌트입니다.
 * ApexCharts를 사용하여 구현되었으며, props가 변경될 때마다 자동으로 차트를 갱신합니다.
 *
 * 주요 기능:
 * - 방사형 진행률 차트 표시
 * - 그라데이션 색상 지원
 * - 중앙 빈 공간 크기 조절 가능
 * - props 변경 시 자동 차트 갱신
 * - SSR 호환성을 위한 동적 로딩
 * - 반응형 디자인 지원
 *
 * @param series - 차트에 표시할 데이터 값 (0-100 사이의 숫자)
 * @param gradientToColors - 그라데이션 색상 배열 [시작색상, 끝색상]
 * @returns 방사형 차트 컴포넌트
 *
 * @example
 * ```tsx
 * <UserMonitoringRadialBar
 *   series={75}
 *   height={200}
 *   hollowSize="70%"
 *   gradientToColors={["#00D4AA", "#00A8CC"]}
 * />
 * ```
 */
export function UserMonitoringResourceClusterChart({
  series,
  gradientToColors,
}: UserMonitoringRadialBarProps) {
  // series를 동적으로 업데이트
  const chartSeries = useMemo(() => [series], [series]);

  // props가 변경될 때마다 차트 옵션을 갱신
  const chartOptions = useMemo(
    (): ApexOptions => ({
      chart: {
        type: "radialBar",
        offsetY: 1,
        offsetX: -1,
      },
      plotOptions: {
        radialBar: {
          startAngle: -160, // 6시 방향 시작
          endAngle: 160, // 6시 방향 끝 (전체 원)
          hollow: {
            size: "70%", // 중앙 빈 공간 크기
          },
          track: {
            background: "#22242C",
            strokeWidth: "97%",
            margin: 5,
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          gradientToColors: [gradientToColors[1]],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      colors: [gradientToColors[0]],
    }),
    [gradientToColors],
  );

  return (
    <ChartWrapper>
      <DynamicApexChart
        options={chartOptions}
        series={chartSeries}
        type="radialBar"
        height={176}
      />
    </ChartWrapper>
  );
}

/**
 * 차트를 감싸는 래퍼 스타일
 *
 * 차트의 최대 너비를 제한하고 반응형 디자인을 지원합니다.
 * 280px의 최대 너비를 가져 다양한 화면 크기에서 적절한 크기로 표시됩니다.
 */
const ChartWrapper = styled.div`
  width: 100%;
`;
