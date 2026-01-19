/**
 * 파일 확장자에 따른 아이콘 이름을 반환하는 함수
 * xiilab-ui에서 지원하는 아이콘만 사용
 *
 * @param extension - 파일 확장자 (null인 경우 기본 아이콘 반환)
 * @param type - 파일 타입 (file | directory)
 * @returns 아이콘 이름
 */
export const getFileIconName = (
  extension: string | null | undefined,
  type: "file" | "directory",
): string => {
  if (type === "directory") {
    return "FolderFiled";
  }

  if (!extension) {
    return "File";
  }

  // 확장자 정규화: 공백 제거 → 앞의 점 제거 → 마지막 세그먼트 추출 → 소문자 변환
  const normalized = extension.trim().replace(/^\.+/, "");
  const segments = normalized.split(".");
  const ext = segments[segments.length - 1].toLowerCase();

  // 압축 파일
  if (["zip", "tar", "gz", "rar", "7z", "tgz"].includes(ext)) {
    return "FileZip";
  }

  // PDF 파일
  if (ext === "pdf") {
    return "FilePdf";
  }

  // 문서 파일 (Word)
  if (["doc", "docx"].includes(ext)) {
    return "FileDoc";
  }

  // JPG 이미지
  if (["jpg", "jpeg"].includes(ext)) {
    return "FileJpg";
  }

  // PNG 이미지
  if (ext === "png") {
    return "FilePng";
  }

  // CSV 파일
  if (ext === "csv") {
    return "FileCsv";
  }

  // 텍스트 파일
  if (ext === "txt") {
    return "FileTxt";
  }

  // 기본 파일 아이콘
  return "File";
};
