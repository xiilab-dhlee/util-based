"use client";

import { format } from "date-fns";
import { isDate } from "lodash";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { DateRange, Icon, Modal } from "xiilab-ui";

import { openCreateReportModalAtom } from "@/atoms/report/report.atom";
import { FormLabel } from "@/components/common/form/form-label";
import { MySelect } from "@/components/common/select";
import reportConstants from "@/constants/report/report.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSelect } from "@/hooks/common/use-select";
import { FormItem, FormRow } from "@/styles/layers/form-layer.styled";

export function CreateReportModal() {
  const router = useRouter();

  const { open, onClose } = useGlobalModal(openCreateReportModalAtom);

  const dateType = useSelect<string>("", reportConstants.dateType, true);

  const reportType = useSelect<string>("", reportConstants.reportType, true);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleChangeDate = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleSubmit = () => {
    if (dateType.value === "") {
      toast.error("기간을 선택해 주세요.");
      return;
    }
    if (reportType.value === "") {
      toast.error("리포트 종류를 선택해 주세요.");
      return;
    }

    if (!isDate(startDate) || !isDate(endDate)) {
      toast.error("날짜를 선택해 주세요.");
      return;
    }

    onClose();

    router.push(
      `/admin/report?reportType=${dateType.value + "_" + reportType.value}&endDate=${format(endDate, "yyyy-MM-dd")}`,
    );
  };

  return (
    <Modal
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="리포트 생성"
      showCancelButton
      cancelText="취소"
      onCancel={onClose}
      okText="추가"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: false,
      }}
    >
      <FormRow>
        <FormItem style={{ width: "120px", flex: "none" }}>
          <FormLabel>리포트 종류</FormLabel>
          <MySelect
            options={dateType.options}
            setValue={dateType.setValue}
            value={dateType.value}
            width="120px"
            placeholder="기간"
          />
        </FormItem>
        <FormItem style={{ width: "100%" }}>
          <FormLabel hidden></FormLabel>
          <MySelect
            options={reportType.options}
            setValue={reportType.setValue}
            value={reportType.value}
            width="100%"
            placeholder="리포트 종류를 선택해 주세요."
          />
        </FormItem>
      </FormRow>
      {/* 설명 입력 필드 */}
      <FormItem>
        <FormLabel htmlFor="credentialDescription">기간 설정</FormLabel>
        <DateRange
          startDate={startDate}
          endDate={endDate}
          endLabel="종료일시"
          height="30px"
          onChange={handleChangeDate}
          placeholder="기간을 선택해 주세요."
          startLabel="시작일시"
          width="100%"
        />
      </FormItem>
    </Modal>
  );
}
