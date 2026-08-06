import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Handshake, GraduationCap, Briefcase, Building2, Palette, Camera, BookOpen, Stethoscope } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BrandSection from '../components/home/BrandSection';
import IntroCards from '../components/home/IntroCards';
import Disclaimer from '../components/ui/Disclaimer';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import Button from '../components/ui/Button';
import useAssessmentStore from '../stores/assessment';
import { professionList } from '../data/professions';
import type { ProfessionType } from '../types';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Handshake, GraduationCap, Briefcase, Building2, Palette, Camera, BookOpen, Stethoscope,
};

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setProfession = useAssessmentStore((s) => s.setProfession);
  const [selectedProfession, setSelectedProfession] = useState<ProfessionType | null>(null);

  const handleStart = () => {
    if (selectedProfession) {
      setProfession(selectedProfession);
      navigate('/assessment');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] md:max-w-[520px] lg:max-w-[640px] xl:max-w-[720px] flex flex-col gap-5 relative">
        {/* 语言切换器 */}
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>

        <BrandSection />
        <IntroCards />

        {/* 职业选择区域 */}
        <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-5">
          <h3 className="text-sm font-semibold text-[#3D3A5C] mb-3">
            {t('home.selectProfession')}
          </h3>
          <p className="text-xs text-[#8E8CA8] mb-4 leading-relaxed">
            {t('home.selectProfessionHint')}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {professionList.map((prof) => {
              const IconComponent = iconMap[prof.icon];
              const isSelected = selectedProfession === prof.id;
              return (
                <button
                  key={prof.id}
                  onClick={() => setSelectedProfession(prof.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border-2 transition-all duration-300 text-left ${
                    isSelected
                      ? 'border-[#5B4FCF] bg-[#5B4FCF]/5 shadow-[0_0_0_1px_rgba(91,79,207,0.15)]'
                      : 'border-[#E8E6F5] bg-white/40 hover:border-[#C5C0E8] hover:bg-white/70'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${prof.bg}`}
                  >
                    {IconComponent && <IconComponent className="w-4 h-4" style={{ color: prof.color }} />}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? 'text-[#5B4FCF]' : 'text-[#3D3A5C]'
                    }`}
                  >
                    {t(`professions.${prof.id}`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Disclaimer />

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleStart}
          disabled={!selectedProfession}
          className="disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-5 h-5" />
          {selectedProfession ? t('home.startAssessment') : t('home.pleaseSelectProfession')}
        </Button>
      </div>
    </div>
  );
}
