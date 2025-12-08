"use client";

import { Button } from "xiilab-ui";

export function ReportFilter() {
  const handlePdf = () => {
    alert("PDF 저장");
  };

  return (
    <Button
      color="primary"
      icon="Download"
      iconPosition="left"
      variant="gradient"
      width={120}
      height={30}
      onClick={handlePdf}
    >
      PDF 저장
    </Button>
  );
}
