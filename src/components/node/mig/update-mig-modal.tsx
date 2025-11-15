"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { groupBy, map } from "lodash";
import { useState } from "react";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";
import { Icon, Modal, Radio } from "xiilab-ui";

import {
  migGpuProductAtom,
  migGpusAtom,
  openUpdateMigModalAtom,
  selectedMigConfigIdAtom,
  selectedMigCountAtom,
  selectedMigGpuIndexAtom,
} from "@/atoms/node/node-list.atom";
import { GuideTooltip } from "@/components/common/tooltip/guide-tooltip";
import { NODE_EVENTS } from "@/constants/common/pubsub.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSubscribe } from "@/hooks/common/use-pub-sub";
import { useGetNodeMigInfo } from "@/hooks/node/use-get-mig-info";
import { useUpdateMig } from "@/hooks/node/use-update-mig";
import type { MigGpu, UpdateMigPayload } from "@/types/node/node.interface";
import type { MigInfo } from "@/types/node/node.model";
import { MigUtil } from "@/utils/node/mig.util";
import { ApplyOnceTooltipTitle } from "../../common/tooltip-title/apply-once-tooltip-title";
import { UpdateMigTooltipTitle } from "../../common/tooltip-title/update-mig-tooltip-title";
import { MigConfigSelect } from "./mig-config-select";
import { MigCountSelect } from "./mig-count-select";
import { MigGpuItem } from "./mig-gpu-item";
import { SelectDisplayConfig } from "./select-display-config";

// import { useDisableMig } from "@/hooks/node/use-disable-mig";

/**
 * MIG 설정 변경 모달 컴포넌트
 *
 * 노드의 MIG(Multi-Instance GPU) 설정을 변경할 수 있는 모달입니다.
 * - GPU 목록 표시 및 선택
 * - MIG 개수 및 설정 선택
 * - 일괄 적용 옵션
 * - 설정 변경 후 서버에 업데이트 요청
 *
 * @returns MIG 설정 변경 모달 컴포넌트
 */
export function UpdateMigModal() {
  // 모달 열림/닫힘 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(openUpdateMigModalAtom);

  // MIG 관련 상태 관리
  const [migGpus, setMigGpus] = useAtom(migGpusAtom); // GPU 목록
  const migGpuProduct = useAtomValue(migGpuProductAtom); // GPU 제품명 (A30, A100 등)
  const setMigGpuProduct = useSetAtom(migGpuProductAtom);
  const [selectedMigGpuIndex, setSelectedMigGpuIndex] = useAtom(
    selectedMigGpuIndexAtom, // 선택된 GPU 인덱스
  );
  const setSelectedMigCount = useSetAtom(selectedMigCountAtom); // 선택된 MIG 개수
  const setSelectedMigConfigId = useSetAtom(selectedMigConfigIdAtom); // 선택된 MIG 설정 ID

  // 모달 내부 상태
  const [nodeName, setNodeName] = useState(""); // 노드 이름
  const [migKey, setMigKey] = useState(""); // MIG 키
  const [applyOnce, setApplyOnce] = useState("Y"); // 일괄 적용 여부 (Y: 적용, N: 미적용)

  // 커스텀 훅
  const { execute } = useGetNodeMigInfo(); // MIG 정보 조회
  const updateMig = useUpdateMig(); // MIG 업데이트
  // const displayMig = useDisableMig(); // MIG 종료

  /**
   * MIG 설정 변경 제출 핸들러
   *
   * 사용자가 확인 버튼을 클릭했을 때 호출됩니다.
   * createPayload()로 서버에 전송할 데이터를 생성하고,
   * updateMig.mutate()로 서버에 MIG 설정 변경을 요청합니다.
   */
  const handleSubmit = () => {
    const payload = createPayload();

    if (payload) {
      updateMig.mutate(payload, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  /**
   * 서버에 전송할 MIG 설정 변경 페이로드 생성
   *
   * 일괄 적용 여부에 따라 GPU 설정을 처리하고,
   * configId별로 그룹화하여 MigInfo 배열을 생성합니다.
   * 각 MigInfo에는 GPU 인덱스, MIG 활성화 상태, profile, configId가 포함됩니다.
   *
   * @returns UpdateMigPayload | null - 서버에 전송할 페이로드
   */
  const createPayload = (): UpdateMigPayload | null => {
    let clientMigInfos: MigGpu[] = [];

    // 일괄 적용이 활성화된 경우, 선택된 GPU의 설정을 모든 GPU에 적용
    if (applyOnce === "Y") {
      clientMigInfos = migGpus.map((item) => {
        return {
          ...item,
          migEnable: migGpus[selectedMigGpuIndex].migEnable,
          configId: migGpus[selectedMigGpuIndex].configId,
        };
      });
    } else {
      // 일괄 적용이 비활성화된 경우, 각 GPU의 개별 설정 유지
      clientMigInfos = migGpus;
    }

    // configId별로 GPU 목록 그룹화
    const groupByConfigId = groupBy(clientMigInfos, (item) => {
      if (item.configId > 0) {
        return item.configId;
      }
      return "null"; // configId가 -1인 경우 (MIG 비활성화)
    });

    // 그룹화된 데이터를 MigInfo 배열로 변환
    const migInfos: MigInfo[] = map(groupByConfigId, (group) => {
      const configId = group[0].configId;

      // configId로부터 profile 생성 (GPU 제품 정보 필요)
      let profile = {};
      if (configId > 0 && migGpuProduct) {
        const util = new MigUtil(migGpuProduct);
        // configId와 GPU 제품을 기반으로 profile 생성
        profile = util.createProfile(configId);
      }

      return {
        gpuIndexs: group.map((item) => item.gpuIndex), // 해당 configId를 사용하는 GPU 인덱스들
        migEnable: group[0].migEnable, // MIG 활성화 상태
        profile, // GPU 인스턴스별 메모리 설정 정보
        configId: configId === -1 ? undefined : configId, // configId (-1인 경우 undefined)
      };
    });

    return {
      nodeName, // 대상 노드 이름
      migInfos, // MIG 설정 정보 배열
      migKey, // MIG 키
    };
  };

  /**
   * 일괄 적용 옵션 변경 핸들러
   *
   * 사용자가 일괄 적용 라디오 버튼을 클릭했을 때 호출됩니다.
   * "Y": 선택된 GPU의 설정을 모든 GPU에 적용
   * "N": 각 GPU의 개별 설정 유지
   *
   * @param value - "Y" 또는 "N"
   */
  const handleClickApplyOnce = (value: string) => {
    setApplyOnce(value);
  };

  /**
   * MIG 설정 변경 모달 열기 이벤트 구독
   *
   * NODE_EVENTS.sendUpdateMig 이벤트를 구독하여
   * 다른 컴포넌트에서 MIG 설정 변경 모달을 열도록 요청할 때 호출됩니다.
   *
   * 처리 과정:
   * 1. 노드 이름 설정 및 기본값 초기화
   * 2. 서버에서 MIG 설정 정보 조회
   * 3. MIG 정보를 GPU 목록으로 변환
   * 4. 첫 번째 GPU의 설정을 기본값으로 설정
   * 5. 모달 열기
   */
  useSubscribe<any>(NODE_EVENTS.sendUpdateMig, async ({ nodeName }) => {
    // 노드 이름 설정
    setNodeName(nodeName);
    // 일괄 적용의 기본 값을 Y로 설정
    setApplyOnce("Y");
    // 개수 설정을 기본값으로 설정
    setSelectedMigCount("DISABLED");
    // ConfigId 설정을 기본값으로 설정
    setSelectedMigConfigId(-1);

    try {
      // MIG 설정 정보 조회

      const { migInfos, gpuProduct, migKey } = await execute({ nodeName });

      console.log(migInfos);

      // MIG 정보를 GPU 목록으로 변환
      // migInfos의 각 항목에서 gpuIndexs 배열을 평면화하여 개별 GPU 항목 생성
      const migGpus = migInfos
        .flatMap((migInfo: MigInfo) =>
          migInfo.gpuIndexs.map((gpuIndex: number) => ({
            gpuIndex,
            migEnable: migInfo.migEnable,
            configId: migInfo.configId || -1,
          })),
        )
        .sort((a: MigGpu, b: MigGpu) => a.gpuIndex - b.gpuIndex); // GPU 인덱스 순으로 정렬

      // MIG 키 설정
      setMigKey(migKey);
      // GPU 목록 설정
      setMigGpus(migGpus);
      // GPU 제품 설정
      setMigGpuProduct(gpuProduct);

      // GPU 목록이 있는 경우
      if (migGpus.length > 0) {
        // GPU 목록 첫 번째 인덱스 선택
        setSelectedMigGpuIndex(migGpus[0].gpuIndex);

        // 첫 번째 GPU가 MIG 활성화된 경우
        if (migGpus[0].migEnable) {
          // GPU 제품을 기반으로 MigUtil 인스턴스 생성하여 인스턴스 개수 계산
          const util = new MigUtil(gpuProduct);
          const count = util.getInstanceCount(migGpus[0].configId);
          // 개수 셀렉트 설정 (count가 0이면 "DISABLED")
          setSelectedMigCount(count === 0 ? "DISABLED" : count.toString());
          // config id 설정
          setSelectedMigConfigId(migGpus[0].configId);
        }
      }

      // 모달 열기
      onOpen();
    } catch (error) {
      console.error(error);
      toast.error("MIG 설정 정보 조회 중 오류가 발생했습니다.");
    }
  });

  return (
    <Modal
      type="primary"
      icon={<Icon name="Information" color="#fff" size={14} />}
      modalWidth={580}
      open={open}
      closable
      title={nodeName}
      showCancelButton
      cancelText="취소"
      onCancel={onClose}
      okText="확인"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: updateMig.isPending, // MIG 업데이트 중일 때 확인 버튼 비활성화
      }}
    >
      <Container>
        {/* 왼쪽: GPU 목록 */}
        <Left>
          <Field>
            <FieldTitle>GPU 목록</FieldTitle>
          </Field>
          <LeftBody>
            {migGpus.map((gpu) => (
              <MigGpuItem key={gpu.gpuIndex} {...gpu} />
            ))}
          </LeftBody>
        </Left>

        {/* 오른쪽: MIG 설정 */}
        <Right>
          {/* MIG 설정 헤더 */}
          <Field>
            <FieldTitle>
              MIG 설정
              <GuideTooltip title={<UpdateMigTooltipTitle />} />
            </FieldTitle>
            <ExternalGuide>
              Nvidia Profile 메뉴얼 원하시면{" "}
              <a
                href="https://docs.nvidia.com/datacenter/tesla/mig-user-guide"
                target="_blank"
                rel="noopener noreferrer"
              >
                여기
              </a>
              를 클릭해 주세요.
            </ExternalGuide>
          </Field>

          {/* MIG 개수 및 설정 선택 */}
          <Filter>
            <MigCountSelect />
            <MigConfigSelect />
          </Filter>

          {/* MIG 인스턴스 표시 */}
          <RightBody>
            <DisplayConfigWrapper>
              <SelectDisplayConfig />
            </DisplayConfigWrapper>
          </RightBody>

          {/* 일괄 적용 옵션 */}
          <Field>
            <FieldTitle>
              일괄 적용
              <GuideTooltip title={<ApplyOnceTooltipTitle />} />
            </FieldTitle>
          </Field>
          <ApplyOnceWrapper>
            <RadioItem>
              <Radio
                value="Y"
                label="적용"
                checked={applyOnce === "Y"}
                onClick={() => handleClickApplyOnce("Y")}
                size="small"
              />
            </RadioItem>
            <RadioItem>
              <Radio
                value="N"
                label="미적용"
                checked={applyOnce === "N"}
                onClick={() => handleClickApplyOnce("N")}
                size="small"
              />
            </RadioItem>
          </ApplyOnceWrapper>
        </Right>
      </Container>
    </Modal>
  );
}

// 스타일드 컴포넌트들

/** 메인 컨테이너 - 좌우 레이아웃 */
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

/** 공통 래퍼 스타일 - 좌우 패널 공통 스타일 */
const wrapStyle = css`
  border: 1px solid var(--border-color);
  border-radius: 4px 4px 2px 2px;
  height: 346px;
  padding-top: 14px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  background-color: #fff;

  --border-color: #e9e9e9;
`;

/** 왼쪽 패널 - GPU 목록 */
const Left = styled.div`
  flex: 1;

  ${wrapStyle}
`;

/** 오른쪽 패널 - MIG 설정 */
const Right = styled.div`
  width: 380px;

  ${wrapStyle}
`;

/** 필드 헤더 컨테이너 */
const Field = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding-right: 10px;
  padding-left: 10px;
  padding-bottom: 4px;
`;

/** 필드 제목 */
const FieldTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: #000;
`;

/** 외부 가이드 링크 */
const ExternalGuide = styled.div`
  font-weight: 400;
  font-size: 10px;
  line-height: 16px;
  color: #5a5d5f !important;

  a,
  a:visited,
  a:hover,
  a:active {
    font-weight: 600;
    color: inherit;
    text-decoration: underline;
  }
`;

/** 필터 영역 - MIG 개수 및 설정 선택 */
const Filter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
  padding-left: 10px;
  margin-bottom: 10px;
`;

/** 왼쪽 패널 본문 - GPU 목록 */
const LeftBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px;
  overflow-y: auto;
`;

/** 오른쪽 패널 본문 */
const RightBody = styled.div`
  flex: 1;
`;

/** MIG 인스턴스 표시 영역 */
const DisplayConfigWrapper = styled.div`
  border: 1px solid #e1e4e7;
  background-color: #fafafa;
  padding: 10px 12px;
  border-radius: 2px;
  max-height: 190px;
  margin: 0 10px;
  gap: 4px;
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
`;

/** 일괄 적용 옵션 래퍼 */
const ApplyOnceWrapper = styled.div`
  border: 1px solid #e1e4e7;
  background-color: #fafafa;
  border-radius: 2px;
  height: 30px;
  margin: 0 10px;
  gap: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/** 라디오 버튼 아이템 */
const RadioItem = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 10px;

  & + & {
    border-left: 1px solid #e1e4e7;
  }
`;
