import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-sans selection:bg-violet-500/30">
      <div className="absolute inset-0 z-0">
        <Image
          src="/landing/background.jpeg"
          alt="Monster Word Lab Background Texture"
          fill
          className="object-cover"
          priority
          quality={90}
        />
      </div>

      <div className="absolute inset-4 z-10 overflow-hidden rounded-[2.5rem] border-4 border-white/10 shadow-2xl sm:inset-6 md:inset-8">
        <Image
          src="/landing/foreground.jpeg"
          alt="Monster Lab Scene"
          fill
          className="object-cover object-bottom"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
      </div>

      <main className="relative z-30 flex min-h-screen flex-col items-center justify-between pb-8 pt-12 sm:pb-12 sm:pt-20 md:pb-16 md:pt-32 pointer-events-none">
        <div className="animate-fade-in-down opacity-0 pointer-events-auto" style={{ animationDelay: "0ms" }}>
          <Image
            src="/landing/title.png"
            alt="Monster Word Lab"
            width={800}
            height={400}
            className="w-[350px] md:w-[600px] lg:w-[800px] h-auto drop-shadow-2xl transition-transform hover-wobble-custom cursor-pointer"
            priority
          />
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:gap-16 animate-fade-in-up opacity-0 pointer-events-auto" style={{ animationDelay: "300ms" }}>
          <Link href="/start" className="group relative transition-transform hover:scale-105 active:scale-95">
            <Image
              src="/landing/btn-start.png"
              alt="Start Experiment"
              width={350}
              height={120}
              className="w-[260px] md:w-[320px] lg:w-[380px] h-auto drop-shadow-xl group-hover:drop-shadow-2xl transition-all"
            />
          </Link>

          <Link href="/explore" className="group relative transition-transform hover:scale-105 active:scale-95">
            <Image
              src="/landing/btn-explore.png"
              alt="Explore Experiments"
              width={350}
              height={120}
              className="w-[260px] md:w-[320px] lg:w-[380px] h-auto drop-shadow-xl group-hover:drop-shadow-2xl transition-all"
            />
          </Link>
        </div>
      </main>
    </div>
  );
}
