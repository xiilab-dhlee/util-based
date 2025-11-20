"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { DateRange, Dropdown, Icon, Modal } from "xiilab-ui";

import {
  REPORT_DATE_TYPE_OPTIONS,
  REPORT_TYPE_OPTIONS,
} from "@/domain/report/constants/report.constant";
import { openCreateReportModalAtom } from "@/domain/report/state/report.atom";
import { FormLabel } from "@/shared/components/form/form-label";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSelect } from "@/shared/hooks/use-select";
import { FormItem, FormRow } from "@/styles/layers/form-layer.styled";

export function CreateReportModal() {
  const router = useRouter();

  const { open, onClose } = useGlobalModal(openCreateReportModalAtom);

  const dateTypeSelect = useSelect<string>(
    null,
    REPORT_DATE_TYPE_OPTIONS,
    true,
  );

  const reportTypeSelect = useSelect<string>(null, REPORT_TYPE_OPTIONS, true);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleChangeDate = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleSubmit = () => {
    if (!dateTypeSelect.value) {
      toast.error("기간을 선택해 주세요.");
      return;
    }
    if (!reportTypeSelect.value) {
      toast.error("리포트 종류를 선택해 주세요.");
      return;
    }

    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
      toast.error("날짜를 선택해 주세요.");
      return;
    }

    onClose();

    router.push(
      `/admin/report?reportType=${dateTypeSelect.value}_${reportTypeSelect.value}&endDate=${format(endDate, "yyyy-MM-dd")}`,
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
          <Dropdown
            options={dateTypeSelect.options}
            onChange={dateTypeSelect.onChange}
            value={dateTypeSelect.value}
            width={120}
            placeholder="기간"
          />
        </FormItem>
        <FormItem style={{ width: "100%" }}>
          <FormLabel hidden></FormLabel>
          <Dropdown
            options={reportTypeSelect.options}
            onChange={reportTypeSelect.onChange}
            value={reportTypeSelect.value}
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
