export interface MonitoringDataPoint {
  dateTime: string;
  value: string | number;
}

export interface MonitoringDataItem {
  modelName: string;
  gpuIndex: number;
  valueDTOS: MonitoringDataPoint[];
}

export interface ChartDataPoint {
  x: Date;
  y: number;
}

export interface ChartDataSeries {
  type: "line" | "bar" | "area";
  name: string;
  data: ChartDataPoint[];
}

/**
 * 워크로드 모니터링 데이터를 차트 데이터로 변환
 * @param data - 모니터링 데이터 배열
 * @param type - 차트 타입 (기본값: "line")
 * @returns 차트 시리즈 데이터 배열
 */
export function mapToChartData(
  data: MonitoringDataItem[] | undefined,
  type: "line" | "bar" | "area" = "line",
): ChartDataSeries[] {
  const targetData = data || [];

  return targetData.map((item: MonitoringDataItem) => ({
    type,
    name: `${item.modelName}-${item.gpuIndex}`,
    data: (item.valueDTOS || []).map((point: MonitoringDataPoint) => ({
      x: new Date(point.dateTime),
      y: Number(point.value),
    })),
  }));
}
