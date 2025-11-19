"use client";

import { useState } from "react";
import { Icon, Input, Modal } from "xiilab-ui";

import { openManageBmcModalAtom } from "@/atoms/node.atom";
import { FormLabel } from "@/components/common/form/form-label";
import { REDFISH_EVENTS } from "@/constants/common/pubsub.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSubscribe } from "@/hooks/common/use-pub-sub";
import { useCreateBmc } from "@/hooks/node/use-create-bmc";
import { useUpdateBmc } from "@/hooks/node/use-update-bmc";
import { FormItem } from "@/styles/layers/form-layer.styled";
import type {
  CreateBmcPayload,
  UpdateBmcPayload,
} from "@/types/node/redfish.interface";

export function ManageBmcModal() {
  const { open, onOpen, onClose } = useGlobalModal(openManageBmcModalAtom);

  const createBmc = useCreateBmc();

  const updateBmc = useUpdateBmc();

  const [mode, setMode] = useState<"create" | "update">("create");
  // bmc id: 업데이트 시에만 사용
  const [bmcId, setBmcId] = useState(-1);
  // bmc ip
  const [bmcIp, setBmcIp] = useState("");
  // bmc username
  const [bmcUserName, setBmcUserName] = useState("");
  // bmc password
  const [bmcPassword, setBmcPassword] = useState("");
  // node ip
  const [nodeIp, setNodeIp] = useState("");

  const handleSubmit = () => {
    const payload = createPayload();

    // TODO: payload 검증 및 유효성 검사 추가 필요
    if (payload) {
      if (mode === "create") {
        createBmc.mutate(payload);
      } else if (mode === "update") {
        updateBmc.mutate({ id: +bmcId, ...payload });
      }
    }
  };

  const createPayload = (): CreateBmcPayload => {
    return {
      bmcIp,
      bmcUserName,
      bmcPassword,
      nodeIp,
    };
  };

  useSubscribe<{ nodeIp: string }>(
    REDFISH_EVENTS.sendCreateBmc,
    (eventData) => {
      setMode("create");
      setNodeIp(eventData.nodeIp);
      setBmcId(-1);
      setBmcIp("");
      setBmcUserName("");
      setBmcPassword("");

      onOpen();
    },
  );

  useSubscribe<UpdateBmcPayload>(REDFISH_EVENTS.sendUpdateBmc, (eventData) => {
    setMode("update");
    setNodeIp(eventData.nodeIp);
    setBmcId(eventData.id);
    setBmcIp(eventData.bmcIp);
    setBmcUserName(eventData.bmcUserName);
    setBmcPassword(eventData.bmcPassword);

    onOpen();
  });

  return (
    <Modal
      type="primary"
      icon={<Icon name="Port" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title={`Red fish 연동 ${mode === "update" ? "계정 수정" : ""}`}
      showCancelButton
      cancelText="취소"
      onCancel={onClose}
      okText="확인"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: false,
      }}
    >
      <form>
        <FormItem>
          <FormLabel htmlFor="bmcIp" className="required">
            BMC IP
          </FormLabel>
          <Input
            type="text"
            id="bmcIp"
            placeholder="BMC IP를 입력해 주세요."
            width="100%"
            value={bmcIp}
            onChange={(e) => setBmcIp(e.target.value)}
          />
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="bmcId" className="required">
            ID
          </FormLabel>
          <Input
            type="text"
            id="bmcId"
            placeholder="ID를 입력해 주세요."
            width="100%"
            value={bmcUserName}
            onChange={(e) => setBmcUserName(e.target.value)}
          />
        </FormItem>
        <FormItem className="last">
          <FormLabel htmlFor="bmcPassword" className="required">
            Password
          </FormLabel>
          <Input
            type="password"
            id="bmcPassword"
            placeholder="Password를 입력해 주세요."
            width="100%"
            value={bmcPassword}
            onChange={(e) => setBmcPassword(e.target.value)}
          />
        </FormItem>
      </form>
    </Modal>
  );
}
