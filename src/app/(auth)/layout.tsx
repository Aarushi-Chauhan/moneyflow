import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { LottieAnimation } from "@/components/lottie-animation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // You can replace this URL with any dotlottie or json animation url
  const lottieUrl = "https://assets3.lottiefiles.com/packages/lf20_0yfsb3a1.json";

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background relative overflow-hidden transition-colors duration-500">

      {/* Absolute Header Items (Logo & Theme Toggle aligned at same top gap) */}
      <div className="absolute top-4 md:top-6 left-4 md:left-8 z-50 group cursor-pointer">
        <Image
          src="/logo.png"
          alt="MoneyFlow Logo"
          width={300}
          height={10}
          priority
          style={{ width: "300px", height: "auto" }}
          className="object-contain object-left-top dark:invert transition-all duration-700 group-hover:scale-105 group-hover:-rotate-1 animate-float"
        />
      </div>
      <div className="absolute top-4 md:top-6 right-4 md:right-8 z-50">
        <ThemeToggle />
      </div>

      {/* LEFT COLUMN: Animation & Branding */}
      <div className="relative hidden lg:flex flex-col items-center justify-center p-12 overflow-hidden border-r border-border/50">

        {/* Crazy color bombing background layers restricted to left side */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#B12B30]/30 via-[#990463]/20 to-[#F0C49D]/30 dark:from-[#B12B30]/40 dark:via-[#990463]/40 dark:to-[#F0C49D]/40 opacity-40 animate-color-bomb -z-20" />

        {/* Spinning/Orbiting circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl aspect-square pointer-events-none -z-10">
          <div className="absolute inset-0 border-[40px] border-[#B12B30]/10 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-4 border-[20px] border-[#990463]/20 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
          <div className="absolute inset-16 border-[10px] border-[#F0C49D]/30 rounded-full animate-[spin_6s_linear_infinite]" />

          {/* Orbiting orbs */}
          <div className="absolute top-1/2 left-1/2 w-8 h-8 -mt-4 -ml-4 bg-[#B12B30] rounded-full shadow-[0_0_40px_#B12B30] animate-orbit" />
          <div className="absolute top-1/2 left-1/2 w-12 h-12 -mt-6 -ml-6 bg-[#990463] rounded-full shadow-[0_0_50px_#990463] animate-orbit" style={{ animationDelay: '-4s' }} />
          <div className="absolute top-1/2 left-1/2 w-6 h-6 -mt-3 -ml-3 bg-[#F0C49D] rounded-full shadow-[0_0_30px_#F0C49D] animate-orbit" style={{ animationDelay: '-2s' }} />
        </div>

        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] -z-10" />

        {/* The Lottie Animation */}
        <div className="w-full max-w-[700px] z-10 relative mt-16 drop-shadow-2xl flex justify-center animate-float">
          <LottieAnimation url={lottieUrl} className="w-full h-[400px] sm:h-[500px] lg:h-[550px] object-contain" />
        </div>

        {/* <div className="z-10 text-center mt-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-foreground mb-4">Master Your Finances</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-lg">
            Track expenses, manage budgets, and gain deep insights into your financial health with MoneyFlow.
          </p>
        </div> */}
      </div>

      {/* RIGHT COLUMN: Auth Form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 z-10 relative w-full h-screen">
        <div className="w-full pt-20 lg:pt-0 flex justify-center">
          {children}
        </div>
      </div>

    </div>
  );
}
