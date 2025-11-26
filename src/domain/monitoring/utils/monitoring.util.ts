import type { MonitoringMetricType } from "@/domain/monitoring/types/monitoring.type";

/**
 * 메트릭 정보 인터페이스
 * - text: 차트/카드 제목 등 메트릭명
 * - unit: Y축/tooltip에 사용되는 단위
 * - colors: 기본 색상 팔레트 (GPU는 종류별, 기타는 시리즈별로 순환 사용)
 * - series: 멀티 시리즈 메트릭의 경우, 시리즈(항목) key 목록
 */
interface MetricInfo {
  text: string;
  unit: string;
  colors: string[];
  series?: string[];
}

/**
 * 모니터링 메트릭 타입과 정보를 한 번에 관리하는 매핑
 */
const METRIC_MAP: Record<MonitoringMetricType, MetricInfo> = {
  // GPU 메트릭 (대표색 #A353FF 첫 번째 고정)
  "gpu-utilization": {
    text: "GPU 사용률",
    unit: "%",
    colors: [
      "#A353FF",
      "#5398FF",
      "#2DC598",
      "#FFD129",
      "#FF8629",
      "#515E80",
      "#FF8080",
      "#77B900",
    ],
  },
  "gpu-memory": {
    text: "GPU 메모리",
    unit: "GB",
    colors: [
      "#A353FF",
      "#5398FF",
      "#2DC598",
      "#FFD129",
      "#FF8629",
      "#515E80",
      "#FF8080",
      "#77B900",
    ],
  },
  "gpu-temperature": {
    text: "GPU 온도",
    unit: "°C",
    colors: [
      "#A353FF",
      "#5398FF",
      "#2DC598",
      "#FFD129",
      "#FF8629",
      "#515E80",
      "#FF8080",
      "#77B900",
    ],
  },
  "gpu-fan-speed": {
    text: "팬 속도",
    unit: "%",
    colors: [
      "#A353FF",
      "#5398FF",
      "#2DC598",
      "#FFD129",
      "#FF8629",
      "#515E80",
      "#FF8080",
      "#77B900",
    ],
  },
  "gpu-power-usage": {
    text: "전력 사용량",
    unit: "W",
    colors: [
      "#A353FF",
      "#5398FF",
      "#2DC598",
      "#FFD129",
      "#FF8629",
      "#515E80",
      "#FF8080",
      "#77B900",
    ],
  },

  // CPU 메트릭 (대표색 #376DFF 첫 번째 고정)
  "cpu-utilization": {
    text: "CPU 사용률",
    unit: "%",
    colors: ["#376DFF"],
  },
  "cpu-usage": {
    text: "CPU 사용량",
    unit: "Core",
    colors: ["#376DFF"],
  },
  "cpu-temperature": {
    text: "CPU 온도",
    unit: "°C",
    colors: ["#376DFF"],
  },
  "cpu-load-average": {
    text: "CPU 평균부하",
    unit: "",
    colors: ["#376DFF", "#2DC598", "#C4DEFF"],
    series: ["1min", "5min", "15min"],
  },

  // Memory 메트릭 (대표색 #55D398 첫 번째 고정)
  "memory-utilization": {
    text: "Memory 사용률",
    unit: "%",
    colors: ["#55D398"],
  },
  "memory-usage": {
    text: "Memory 사용량",
    unit: "GB",
    colors: ["#55D398"],
  },
  "memory-detail": {
    text: "Memory 상세",
    unit: "GB",
    colors: ["#55D398", "#FF9900", "#2DC598", "#A353FF"],
    series: ["buffers", "cached", "memory_total", "memory_free"],
  },

  // Network 메트릭 (임시 색상 - 가변 가능)
  "network-rt": {
    text: "Network 데이터 송수신",
    unit: "GB",
    colors: ["#FF8629", "#FFD129", "#FF2C2C"],
    series: ["receive", "transmit"],
  },

  // Disk 메트릭 (대표색 #17CDE5 첫 번째 고정)
  "disk-utilization": {
    text: "Disk 사용률",
    unit: "%",
    colors: ["#17CDE5"],
  },
  "disk-rw": {
    text: "Disk 읽기/쓰기",
    unit: "GB",
    colors: ["#17CDE5", "#3268FF"],
    series: ["read", "write"],
  },
};

/**
 * 모니터링 메트릭 타입 정보 조회
 * @param type - 모니터링 메트릭 타입
 * @returns 메트릭 정보 (제목, 단위, 색상 배열, 시리즈 정보)
 */
export function getMetricInfo(type: MonitoringMetricType): MetricInfo {
  return METRIC_MAP[type];
}
