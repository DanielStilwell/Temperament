import { useEffect, useState, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts';
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

    // 能力雷达数据
    const radarData = (Object.keys(abilityScores) as AbilityDimension[]).map(
      (key) => ({
        dimension: t(`abilities.${key}`),
        score: abilityScores[key],
        fullMark: 100,
      })
    );

    // 取前 3 项能力得分（用于展示）
    const topAbilities = (Object.keys(abilityScores) as AbilityDimension[])
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
          {/* 装饰圆 */}
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

            {/* 特征标签 */}
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

        {/* 中部：能力雷达图 */}
        <div className="px-6 py-4">
          <h3 className="text-xs font-semibold text-[#3D3A5C] mb-1 text-center">
            {t('result.abilityRadar')}
          </h3>
          <div className="w-full h-[160px]">
            <RechartsRadar
              data={radarData}
              cx="50%"
              cy="50%"
              outerRadius="68%"
              width={375}
              height={160}
            >
              <PolarGrid stroke="#E0DCF5" strokeWidth={1} />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: '#5A5880', fontSize: 10, fontWeight: 500 }}
              />
              <Radar
                dataKey="score"
                stroke="#5B4FCF"
                strokeWidth={2}
                fill="url(#shareCardGradient)"
                fillOpacity={1}
                dot={{ r: 3, fill: '#5B4FCF' }}
              />
              <defs>
                <linearGradient id="shareCardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5B4FCF" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#8B7FD4" stopOpacity={0.15} />
                </linearGradient>
              </defs>
            </RechartsRadar>
          </div>

          {/* Top 3 能力 */}
          <div className="flex justify-around mt-2">
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
            <img src={qrDataUrl} alt="QR" className="w-[56px] h-[56px] ml-3" />
          )}
        </div>
      </div>
    );
  }
);

ShareCard.displayName = 'ShareCard';
export default ShareCard;
