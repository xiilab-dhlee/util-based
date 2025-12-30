import Image from "next/image";

export const LoginBackgroundIcon = () => (
  <Image
    src="/assets/login-background.svg"
    alt="login background"
    fill
    style={{
      objectFit: "cover",
      objectPosition: "center",
    }}
    draggable={false}
  />
);
