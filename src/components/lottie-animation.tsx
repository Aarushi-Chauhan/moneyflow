"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LottieAnimationProps {
  url: string;
  className?: string;
}

export function LottieAnimation({
  url,
  className,
}: LottieAnimationProps) {
  return (
    <div className={className}>
      <DotLottieReact
        src={url}
        loop
        autoplay
      />
    </div>
  );
}