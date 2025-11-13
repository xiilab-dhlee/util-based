import type { PrivateRegistryImage } from "@/types/private-registry/private-registry.model";

/**
 * 내부 레지스트리 이미지 샘플 데이터
 * TODO: 실제 API 연동 후 제거 예정
 */
export const PRIVATE_REGISTRY_SAMPLE_IMAGES: PrivateRegistryImage[] = [
  {
    id: 1,
    projectId: 101,
    name: "nginx-custom",
    description: "커스텀 nginx 웹서버 이미지",
    tagCnt: 5,
    pullCnt: 234,
    createTime: "2024-01-15T09:30:00Z",
    updateTime: "2024-01-20T14:45:00Z",
    status: "SUCCESSED",
  },
  {
    id: 2,
    projectId: 102,
    name: "python-ml-toolkit",
    description: "머신러닝용 Python 환경 이미지",
    tagCnt: 12,
    pullCnt: 567,
    createTime: "2024-01-10T11:20:00Z",
    updateTime: "2024-01-22T16:30:00Z",
    status: "SUCCESSED",
  },
  {
    id: 3,
    projectId: 103,
    name: "nodejs-api-server",
    description: "Node.js API 서버 기본 이미지",
    tagCnt: 8,
    pullCnt: 123,
    createTime: "2024-01-18T13:15:00Z",
    updateTime: "2024-01-23T10:20:00Z",
    status: "RUNNING",
  },
  {
    id: 4,
    projectId: 104,
    name: "mysql-optimized",
    description: "성능 최적화된 MySQL 데이터베이스",
    tagCnt: 3,
    pullCnt: 89,
    createTime: "2024-01-12T08:45:00Z",
    updateTime: "2024-01-19T15:10:00Z",
    status: "SUCCESSED",
  },
  {
    id: 5,
    projectId: 105,
    name: "redis-cluster",
    description: "Redis 클러스터 구성용 이미지",
    tagCnt: 6,
    pullCnt: 345,
    createTime: "2024-01-14T16:20:00Z",
    updateTime: "2024-01-21T12:35:00Z",
    status: "SUCCESSED",
  },
  {
    id: 6,
    projectId: 106,
    name: "jupyter-notebook",
    description: "데이터 분석용 Jupyter 노트북 환경",
    tagCnt: 15,
    pullCnt: 678,
    createTime: "2024-01-08T14:30:00Z",
    updateTime: "2024-01-24T09:45:00Z",
    status: "RUNNING",
  },
  {
    id: 7,
    projectId: 107,
    name: "elasticsearch-custom",
    description: "커스텀 Elasticsearch 검색 엔진",
    tagCnt: 4,
    pullCnt: 156,
    createTime: "2024-01-16T10:15:00Z",
    updateTime: "2024-01-22T13:20:00Z",
    status: "SUCCESSED",
  },
  {
    id: 8,
    projectId: 108,
    name: "apache-kafka",
    description: "메시지 큐용 Apache Kafka",
    tagCnt: 7,
    pullCnt: 234,
    createTime: "2024-01-11T12:40:00Z",
    updateTime: "2024-01-20T17:25:00Z",
    status: "SUCCESSED",
  },
  {
    id: 9,
    projectId: 109,
    name: "tensorflow-gpu",
    description: "GPU 지원 TensorFlow 머신러닝 환경",
    tagCnt: 20,
    pullCnt: 890,
    createTime: "2024-01-05T15:50:00Z",
    updateTime: "2024-01-25T11:10:00Z",
    status: "RUNNING",
  },
  {
    id: 10,
    projectId: 110,
    name: "mongodb-replica",
    description: "복제 설정이 포함된 MongoDB",
    tagCnt: 9,
    pullCnt: 445,
    createTime: "2024-01-13T09:25:00Z",
    updateTime: "2024-01-23T14:15:00Z",
    status: "SUCCESSED",
  },
];

/**
 * 샘플 응답 데이터
 * TODO: 실제 API 연동 후 제거 예정
 */
export const PRIVATE_REGISTRY_SAMPLE_RESPONSE = {
  images: PRIVATE_REGISTRY_SAMPLE_IMAGES,
  total: PRIVATE_REGISTRY_SAMPLE_IMAGES.length,
  currentPage: 1,
  totalPages: Math.ceil(PRIVATE_REGISTRY_SAMPLE_IMAGES.length / 20),
};
