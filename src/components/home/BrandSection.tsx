export default function BrandSection() {
  return (
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#5B4FCF] via-[#6B5FE0] to-[#7B6FE0] p-10 pt-12 pb-14 text-center text-white">
      {/* 背景装饰粒子 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-6 left-6 w-20 h-20 rounded-full bg-white/8 animate-float" />
        <div className="absolute top-1/3 right-8 w-14 h-14 rounded-full bg-white/6 animate-float-delayed" />
        <div className="absolute bottom-8 left-1/3 w-16 h-16 rounded-full bg-white/5 animate-float-slow" />
        <div className="absolute top-1/4 left-1/2 w-8 h-8 rounded-full bg-white/10 animate-float" />
      </div>

      {/* 顶部装饰线 */}
      <div className="relative inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/15 text-white/80 text-sm font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F5D5A0]" />
        Temperament Insight
        <span className="w-1.5 h-1.5 rounded-full bg-[#F5D5A0]" />
      </div>

      <h1 className="relative text-3xl font-bold tracking-tight mb-3" style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}>
        Understand Temperament, Unlock Potential
      </h1>

      <p className="relative text-white/75 text-base leading-relaxed max-w-xs mx-auto">
        A temperament & ability assessment tool based on situational behavioral observation, helping you understand others objectively
      </p>
    </div>
  );
}