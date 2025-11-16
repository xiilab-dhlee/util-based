import Image from "next/image";

interface PytorchIconProps {
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
}

export const PytorchIcon = ({
  width = 17,
  height = 11,
  alt = "PyTouch",
  className,
}: PytorchIconProps) => (
  <Image
    src="/images/pytouch.png"
    width={width}
    height={height}
    alt={alt}
    className={className}
    priority
  />
);
