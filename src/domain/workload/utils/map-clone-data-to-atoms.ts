import type { WritableAtom } from "jotai";

import type {
  PortItem,
  WorkloadDetailResponse,
  WorkloadSourceCodeDetail,
  WorkloadVolumeDetail,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  WORKLOAD_JOB_TYPES,
  WORKLOAD_NODE_MODES,
} from "@/domain/workload/constants/workload.constant";
import {
  distributedTypeAtom,
  envsAtom,
  executionCmdAtom,
  executionDirectoryAtom,
  harborImageNameAtom,
  imageTagNameAtom,
  imageTypeAtom,
  jobTypeAtom,
  nodeModeAtom,
  outputDirectoryAtom,
  parameterAtom,
  portsAtom,
  resourcePresetIdAtom,
  type WorkloadPortFormType,
  type WorkloadSourcecodeInfoUiType,
  type WorkloadVolumeInfoUiType,
  workerCountAtom,
  workloadDescriptionAtom,
  workloadNameAtom,
  workloadSourcecodeInfoMapUiAtom,
  workloadSourcecodesAtom,
  workloadVolumeInfoMapUiAtom,
  workloadVolumesAtom,
} from "@/domain/workload/state/create-workload.atom";
import type { WorkloadSourcecodeType } from "@/domain/workload/types/workload.type";

/**
 * Source code 데이터를 atom 구조로 변환합니다.
 * - workloadSourcecodesAtom: API 요청용 데이터
 * - workloadSourcecodeInfoMapUiAtom: UI 표시용 데이터
 */
function mapSourceCode(sourceCode: WorkloadSourceCodeDetail | undefined) {
  if (!sourceCode) {
    return {
      requests: [],
      infoMap: {},
    };
  }

  const requests: WorkloadSourcecodeType[] = [
    {
      sourceCodeId: sourceCode.sourceCodeId,
      mountPath: sourceCode.mountPath,
      sourceCodeBranch: sourceCode.branch,
    },
  ];

  const infoMap: Record<number, WorkloadSourcecodeInfoUiType> = {
    [sourceCode.sourceCodeId]: {
      sourceCodeId: sourceCode.sourceCodeId,
      sourceCodeName: sourceCode.sourceCodeName,
      gitUrl: sourceCode.gitUrl,
      mountPath: sourceCode.mountPath,
      sourceCodeType: sourceCode.sourceCodeType,
    },
  };

  return { requests, infoMap };
}

/**
 * Volume 배열을 atom 구조로 변환합니다.
 * - workloadVolumesAtom: API 요청용 데이터
 * - workloadVolumeInfoMapUiAtom: UI 표시용 데이터
 */
function mapVolumes(volumes: WorkloadVolumeDetail[] | undefined) {
  if (!volumes || volumes.length === 0) {
    return {
      requests: [],
      infoMap: {},
    };
  }

  const requests = volumes.map((v) => ({
    volumeId: v.volumeId,
    mountPath: v.mountPath,
  }));

  const infoMap: Record<number, WorkloadVolumeInfoUiType> = {};
  volumes.forEach((v) => {
    infoMap[v.volumeId] = {
      volumeId: v.volumeId,
      volumeName: v.volumeName,
      volumeType: v.volumeType,
      mountPath: v.mountPath,
      fileSizeByte: v.volumeSize,
    };
  });

  return { requests, infoMap };
}

/**
 * Port 배열을 atom 구조로 변환합니다.
 * API의 url 필드는 제거하고 필요한 필드만 매핑합니다.
 */
function mapPorts(ports: PortItem[] | undefined): WorkloadPortFormType[] {
  if (!ports || ports.length === 0) return [];

  return ports.map(({ portName, portNumber, servicePortNum }) => ({
    portName,
    portNumber,
    servicePortNum,
  }));
}

/**
 * 워크로드 복제 데이터를 기존 워크로드 생성 atom에 매핑합니다.
 * 값이 없는 필드는 스킵하여 기본값을 유지합니다.
 *
 * @param cloneData - 워크로드 복제 API 응답 데이터
 * @param setAtom - Jotai setAtom 함수
 */
export function mapCloneDataToAtoms(
  cloneData: WorkloadDetailResponse,
  setAtom: <Value, Args extends unknown[], Result>(
    atom: WritableAtom<Value, Args, Result>,
    ...args: Args
  ) => Result,
): void {
  // Step 0: Job Type & Meta Data
  if (cloneData.workloadName) {
    setAtom(workloadNameAtom, cloneData.workloadName);
  }

  if (cloneData.description) {
    setAtom(workloadDescriptionAtom, cloneData.description);
  }

  // DISTRIBUTED 타입 특수 처리
  if (cloneData.workloadJobType === WORKLOAD_JOB_TYPES.DISTRIBUTED) {
    // DISTRIBUTED는 BATCH + MULTI node로 변환
    setAtom(jobTypeAtom, WORKLOAD_JOB_TYPES.BATCH);
    setAtom(nodeModeAtom, WORKLOAD_NODE_MODES.MULTI);
    setAtom(distributedTypeAtom, WORKLOAD_JOB_TYPES.DISTRIBUTED);
  } else {
    // 일반 타입 처리
    if (cloneData.workloadJobType) {
      setAtom(jobTypeAtom, cloneData.workloadJobType);
    }

    // Step 1: Resource - nodeType
    if (cloneData.nodeType) {
      setAtom(nodeModeAtom, cloneData.nodeType);
    }
  }

  // Step 1: Resource - 나머지 필드
  if (cloneData.resourcePreset?.resourcePresetId) {
    setAtom(resourcePresetIdAtom, cloneData.resourcePreset.resourcePresetId);
  }

  // workerCount는 MULTI node 또는 DISTRIBUTED일 때 설정
  if (
    (cloneData.nodeType === WORKLOAD_NODE_MODES.MULTI ||
      cloneData.workloadJobType === WORKLOAD_JOB_TYPES.DISTRIBUTED) &&
    cloneData.workerCount
  ) {
    setAtom(workerCountAtom, cloneData.workerCount);
  }

  // Step 2: Image
  if (cloneData.image) {
    if (cloneData.image.harborImageName) {
      setAtom(harborImageNameAtom, cloneData.image.harborImageName);
    }

    if (cloneData.image.imageTagName) {
      setAtom(imageTagNameAtom, cloneData.image.imageTagName);
    }

    if (cloneData.image.imageType) {
      setAtom(imageTypeAtom, cloneData.image.imageType);
    }
  }

  // Step 3: Task - Source Code
  const { requests: sourceCodeRequests, infoMap: sourceCodeInfoMap } =
    mapSourceCode(cloneData.sourceCode);

  if (sourceCodeRequests.length > 0) {
    setAtom(workloadSourcecodesAtom, sourceCodeRequests);
    setAtom(workloadSourcecodeInfoMapUiAtom, sourceCodeInfoMap);
  }

  // Step 3: Task - Volume
  const { requests: volumeRequests, infoMap: volumeInfoMap } = mapVolumes(
    cloneData.volume,
  );

  if (volumeRequests.length > 0) {
    setAtom(workloadVolumesAtom, volumeRequests);
    setAtom(workloadVolumeInfoMapUiAtom, volumeInfoMap);
  }

  // Step 4: Command
  if (cloneData.outputDirectory) {
    setAtom(outputDirectoryAtom, cloneData.outputDirectory);
  }

  if (cloneData.executionDirectory) {
    setAtom(executionDirectoryAtom, cloneData.executionDirectory);
  }

  if (cloneData.executionCommand) {
    setAtom(executionCmdAtom, cloneData.executionCommand);
  }

  if (cloneData.parameter && cloneData.parameter.length > 0) {
    setAtom(parameterAtom, cloneData.parameter);
  }

  // Step 4: Variables - Env
  if (cloneData.env && cloneData.env.length > 0) {
    setAtom(envsAtom, cloneData.env);
  }

  // Step 4: Variables - Port
  const mappedPorts = mapPorts(cloneData.port);
  if (mappedPorts.length > 0) {
    setAtom(portsAtom, mappedPorts);
  }
}
