import { useSetAtom } from "jotai";

import {
  migGpusAtom,
  selectedMigConfigIdAtom,
} from "@/domain/node/state/node.atom";
import { MigUtil } from "@/domain/node/utils/mig.util";

export const useMigHelper = () => {
  const setMigGpus = useSetAtom(migGpusAtom);
  const setSelectedMigConfigId = useSetAtom(selectedMigConfigIdAtom);
  // 인스턴스 개수 조회
  const getInstanceCount = (configId: number, gpuProduct: string) => {
    const instances = getInstance(configId, gpuProduct);
    return instances.filter((instance) => instance).length;
  };
  // 인스턴스 조회
  const getInstance = (configId: number, gpuProduct: string) => {
    // GPU 제품을 기반으로 MigUtil 인스턴스 생성
    const util = new MigUtil(gpuProduct);

    let instances: boolean[];
    if (configId === -1) {
      instances = util.generateSelectInstances();
    } else {
      instances = util.getConfigInstances(configId);
    }

    return instances;
  };
  // MIG 설정 초기화
  const initMig = (gpuIndex: number, migEnable: boolean) => {
    if (gpuIndex === -1) return;

    setMigGpus((prev) =>
      prev.map((gpu) =>
        gpu.gpuIndex === gpuIndex ? { ...gpu, migEnable, configId: -1 } : gpu,
      ),
    );

    // Config ID 초기화
    setSelectedMigConfigId(-1);
  };

  // 인스턴스 선택
  const updateMig = (gpuIndex: number, configId: number) => {
    if (gpuIndex === -1) return;

    setMigGpus((prev) =>
      prev.map((gpu) =>
        gpu.gpuIndex === gpuIndex ? { ...gpu, configId } : gpu,
      ),
    );
  };

  return { initMig, updateMig, getInstance, getInstanceCount };
};
