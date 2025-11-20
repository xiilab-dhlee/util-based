import { Tag } from "xiilab-ui";

interface PreviewTagProps {
  labels: string[];
  height: number;
}

export function PreviewTag({ labels, height }: PreviewTagProps) {
  // 임시 표시 개수
  const visibleCount = 1;
  if (labels.length === 0) {
    return null;
  }

  if (labels.length === 1) {
    return (
      <Tag variant="purple" style={{ height }}>
        {labels[0]}
      </Tag>
    );
  }

  return (
    <>
      {labels.slice(0, visibleCount).map((label) => (
        <Tag variant="purple" style={{ height }} key={label}>
          {label}
        </Tag>
      ))}
      {labels.length - visibleCount > 0 && (
        <Tag variant="gray" style={{ height }}>
          +{labels.length - visibleCount}
        </Tag>
      )}
    </>
  );
}
