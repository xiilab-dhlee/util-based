interface MonitoringDataPoint {
  dateTime: string;
  value: string | number;
}

interface MonitoringDataItem {
  modelName: string;
  gpuIndex: number;
  valueDTOS: MonitoringDataPoint[];
}

interface ChartDataPoint {
  x: Date;
  y: number;
}

interface ChartDataSeries {
  type: "line" | "bar" | "area";
  name: string;
  data: ChartDataPoint[];
}

/**
 * 모니터링 데이터를 차트 데이터로 변환
 * @param data - 모니터링 데이터 배열
 * @param type - 차트 타입 (기본값: "line")
 * @returns 차트 시리즈 데이터 배열
 */
export function mapToChartData(
  data: MonitoringDataItem[] = [
    {
      modelName: "Monitoring",
      gpuIndex: 0,
      valueDTOS: [
        {
          dateTime: "2024-01-01T01:00:00.000Z",
          value: "48",
        },
        {
          dateTime: "2024-01-01T02:00:00.000Z",
          value: "52",
        },
        {
          dateTime: "2024-01-01T03:00:00.000Z",
          value: "45",
        },
        {
          dateTime: "2024-01-01T04:00:00.000Z",
          value: "51",
        },
        {
          dateTime: "2024-01-01T05:00:00.000Z",
          value: "47",
        },
        {
          dateTime: "2024-01-01T06:00:00.000Z",
          value: "53",
        },
        {
          dateTime: "2024-01-01T07:00:00.000Z",
          value: "49",
        },
        {
          dateTime: "2024-01-01T08:00:00.000Z",
          value: "55",
        },
        {
          dateTime: "2024-01-01T09:00:00.000Z",
          value: "50",
        },
        {
          dateTime: "2024-01-01T10:00:00.000Z",
          value: "54",
        },
        {
          dateTime: "2024-01-01T11:00:00.000Z",
          value: "48",
        },
        {
          dateTime: "2024-01-01T12:00:00.000Z",
          value: "52",
        },
        {
          dateTime: "2024-01-01T13:00:00.000Z",
          value: "46",
        },
        {
          dateTime: "2024-01-01T14:00:00.000Z",
          value: "51",
        },
        {
          dateTime: "2024-01-01T15:00:00.000Z",
          value: "47",
        },
        {
          dateTime: "2024-01-01T16:00:00.000Z",
          value: "53",
        },
        {
          dateTime: "2024-01-01T17:00:00.000Z",
          value: "49",
        },
        {
          dateTime: "2024-01-01T18:00:00.000Z",
          value: "54",
        },
        {
          dateTime: "2024-01-01T19:00:00.000Z",
          value: "50",
        },
        {
          dateTime: "2024-01-01T20:00:00.000Z",
          value: "55",
        },
        {
          dateTime: "2024-01-01T21:00:00.000Z",
          value: "51",
        },
        {
          dateTime: "2024-01-01T22:00:00.000Z",
          value: "53",
        },
        {
          dateTime: "2024-01-01T23:00:00.000Z",
          value: "49",
        },
      ],
    },
  ],
  type: "line" | "bar" | "area" = "line",
): ChartDataSeries[] {
  return data.map((el: MonitoringDataItem) => {
    return {
      type,
      name: `${el.modelName}-${el.gpuIndex}`,
      data: (el?.valueDTOS || []).map((el: MonitoringDataPoint) => {
        return {
          x: new Date(el.dateTime),
          y: Number(el.value),
        };
      }),
    };
  });
}
