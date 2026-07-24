interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[#8E8CA8]">
          第 {current + 1} / {total} 题
        </span>
        <span className="text-xs font-semibold text-[#5B4FCF]">{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-[#E8E6F5] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#5B4FCF] to-[#7B6FE0] transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}