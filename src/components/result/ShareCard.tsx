import { useEffect, useState, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import { temperamentMap } from '../../data/results';
import type {
  TemperamentType,
  TemperamentScores,
  AbilityScores,
  AbilityDimension,
} from '../../types';

interface ShareCardProps {
  temperament: TemperamentType;
  temperamentScores: TemperamentScores;
  abilityScores: AbilityScores;
}

const ANIMAL_EMOJI: Record<TemperamentType, string> = {
  sanguine: '🐬',
  choleric: '🦁',
  phlegmatic: '🐘',
  melancholic: '🦉',
};

const APP_URL = 'https://www.dsrtempe.top';

// 雷达图参数
const RADAR_CX = 187.5;
const RADAR_CY = 85;
const RADAR_R = 58;
const ANGLES = [-90, -30, 30, 90, 150, 210]; // 6 个轴角度（度）

function polarPoint(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function hexagonPath(cx: number, cy: number, r: number): string {
  return ANGLES.map((a, i) => {
    const p = polarPoint(cx, cy, r, a);
    return `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join('') + 'Z';
}

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ temperament, temperamentScores, abilityScores }, ref) => {
    const { t } = useTranslation();
    const info = temperamentMap[temperament];
    const features = t(`temperament.${temperament}.features`, {
      returnObjects: true,
    }) as string[];
    const [qrDataUrl, setQrDataUrl] = useState('');

    useEffect(() => {
      QRCode.toDataURL(APP_URL, {
        width: 72,
        margin: 0,
        color: { dark: '#3D3A5C', light: '#FFFFFF00' },
      }).then(setQrDataUrl).catch(() => {});
    }, []);

    // 能力维度数据
    const dimensions = Object.keys(abilityScores) as AbilityDimension[];
    const scores = dimensions.map((d) => abilityScores[d]);

    // 数据多边形顶点
    const dataPoints = ANGLES.map((a, i) =>
      polarPoint(RADAR_CX, RADAR_CY, (RADAR_R * scores[i]) / 100, a)
    );
    const dataPolygon = dataPoints
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join('') + 'Z';

    // 标签位置（在轴端外侧）
    const labelPoints = ANGLES.map((a, i) => {
      const p = polarPoint(RADAR_CX, RADAR_CY, RADAR_R + 14, a);
      let anchor: 'start' | 'middle' | 'end' = 'middle';
      if (Math.abs(a) < 90) anchor = 'start';
      else if (Math.abs(a) > 90) anchor = 'end';
      return { ...p, anchor, label: t(`abilities.${dimensions[i]}`) };
    });

    // 取前 3 项能力得分
    const topAbilities = dimensions
      .map((key) => ({
        key,
        label: t(`abilities.${key}`),
        score: abilityScores[key],
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return (
      <div
        ref={ref}
        className="w-[375px] rounded-[28px] overflow-hidden bg-white shadow-2xl"
        style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}
      >
        {/* 顶部：气质渐变区 */}
        <div
          className="relative px-6 pt-8 pb-6 text-white text-center overflow-hidden"
          style={{ background: info.gradient }}
        >
          <div className="absolute top-3 right-5 w-20 h-20 rounded-full bg-white opacity-10" />
          <div className="absolute bottom-1 left-3 w-14 h-14 rounded-full bg-white opacity-10" />

          <div className="relative">
            <div className="text-5xl mb-2">{ANIMAL_EMOJI[temperament]}</div>
            <h2 className="text-xl font-bold mb-0.5">
              {t(`temperament.${temperament}.name`)}
            </h2>
            <p className="text-white/70 text-xs mb-3">
              {t(`temperament.${temperament}.animal`)}
            </p>

            <div className="flex flex-wrap justify-center gap-1.5">
              {features.map((f) => (
                <span
                  key={f}
                  className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs text-white/90"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 中部：能力雷达图（纯手写 SVG，避免 Recharts 序列化问题） */}
        <div className="px-6 py-4">
          <h3 className="text-xs font-semibold text-[#3D3A5C] mb-1 text-center">
            {t('result.abilityRadar')}
          </h3>
          <svg viewBox="0 0 375 170" width="375" height="170" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5B4FCF" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#8B7FD4" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* 网格六边形 */}
            {[0.25, 0.5, 0.75, 1].map((lvl) => (
              <path
                key={lvl}
                d={hexagonPath(RADAR_CX, RADAR_CY, RADAR_R * lvl)}
                fill="none"
                stroke="#E0DCF5"
                strokeWidth="1"
              />
            ))}

            {/* 轴线 */}
            {ANGLES.map((a) => {
              const p = polarPoint(RADAR_CX, RADAR_CY, RADAR_R, a);
              return (
                <line
                  key={a}
                  x1={RADAR_CX}
                  y1={RADAR_CY}
                  x2={p.x.toFixed(1)}
                  y2={p.y.toFixed(1)}
                  stroke="#E0DCF5"
                  strokeWidth="1"
                />
              );
            })}

            {/* 数据多边形 */}
            <path d={dataPolygon} fill="url(#radarFill)" stroke="#5B4FCF" strokeWidth="2" />

            {/* 数据点 */}
            {dataPoints.map((p, i) => (
              <circle
                key={i}
                cx={p.x.toFixed(1)}
                cy={p.y.toFixed(1)}
                r="3"
                fill="#5B4FCF"
              />
            ))}

            {/* 标签 */}
            {labelPoints.map((p, i) => (
              <text
                key={i}
                x={p.x.toFixed(1)}
                y={(p.y + 3).toFixed(1)}
                textAnchor={p.anchor}
                fontSize="10"
                fontWeight="500"
                fill="#5A5880"
              >
                {p.label}
              </text>
            ))}
          </svg>

          {/* Top 3 能力 */}
          <div className="flex justify-around -mt-2">
            {topAbilities.map((a) => (
              <div key={a.key} className="text-center">
                <p className="text-lg font-bold" style={{ color: info.color }}>
                  {a.score}
                </p>
                <p className="text-[10px] text-[#8E8CA8]">{a.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 底部：品牌 + 二维码 */}
        <div
          className="flex items-center justify-between px-6 py-3"
          style={{ background: '#F5F3FA' }}
        >
          <div className="flex-1">
            <p className="text-sm font-bold text-[#3D3A5C]">Tempe</p>
            <p className="text-[10px] text-[#8E8CA8] leading-tight">
              {t('shareCard.tagline')}
            </p>
            <p className="text-[9px] text-[#A9A7C8] mt-1 leading-tight">
              {t('shareCard.disclaimer')}
            </p>
          </div>
          {qrDataUrl && (
            <img src={qrDataUrl} alt="QR" className="w-[56px] h-[56px] ml-3" crossOrigin="anonymous" />
          )}
        </div>
      </div>
    );
  }
);

ShareCard.displayName = 'ShareCard';
export default ShareCard;
