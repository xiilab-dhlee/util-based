export type NodeMigInfo = {
  nodeName: string;
  migInfos: MigInfo[];
  migKey: string;
};

export type MigInfo = {
  // 대상 GPU 인덱스 목록
  gpuIndexs: number[];
  // MIG Config (Nvidia MIG Config 참조)
  configId?: number;
  // MIG 활성화 여부
  migEnable: boolean;
  /**
   * 선택한 프로파일 목록 (key: 프로파일 이름, value: 프로파일 ID)
   * 예시: { "1g.12gb": 1, "2g.24gb": 2 }
   */
  profile: Record<string, number>;
};
