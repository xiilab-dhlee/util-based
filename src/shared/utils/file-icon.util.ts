/**
 * 파일 확장자에 따른 아이콘 이름을 반환하는 함수
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

  const ext = extension.toLowerCase();

  // 압축 파일
  if (["zip", "tar", "gz", "rar", "7z", "tgz"].includes(ext)) {
    return "FileZip";
  }

  // 이미지 파일
  if (
    ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "ico"].includes(ext)
  ) {
    return "FileImage";
  }

  // 비디오 파일
  if (["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"].includes(ext)) {
    return "FileVideo";
  }

  // 오디오 파일
  if (["mp3", "wav", "flac", "aac", "ogg", "wma"].includes(ext)) {
    return "FileAudio";
  }

  // PDF 파일
  if (ext === "pdf") {
    return "FilePdf";
  }

  // 문서 파일 (Word)
  if (["doc", "docx"].includes(ext)) {
    return "FileDoc";
  }

  // 스프레드시트 파일 (Excel)
  if (["xls", "xlsx", "csv"].includes(ext)) {
    return "FileExcel";
  }

  // 프레젠테이션 파일 (PowerPoint)
  if (["ppt", "pptx"].includes(ext)) {
    return "FilePpt";
  }

  // 코드 파일
  if (
    [
      "js",
      "ts",
      "jsx",
      "tsx",
      "py",
      "java",
      "c",
      "cpp",
      "h",
      "cs",
      "go",
      "rs",
      "rb",
      "php",
      "swift",
      "kt",
      "scala",
      "html",
      "css",
      "scss",
      "less",
      "json",
      "xml",
      "yaml",
      "yml",
      "md",
      "sh",
      "bash",
      "sql",
    ].includes(ext)
  ) {
    return "FileCode";
  }

  // 텍스트 파일
  if (["txt", "log", "ini", "cfg", "conf"].includes(ext)) {
    return "FileText";
  }

  // 기본 파일 아이콘
  return "File";
};
