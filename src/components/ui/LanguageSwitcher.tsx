import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../../i18n/config';

interface LanguageSwitcherProps {
  /** 浅色背景（用于彩色 hero 卡片上） */
  variant?: 'default' | 'onColor';
  /** 紧凑模式：只显示地球图标 */
  compact?: boolean;
  className?: string;
}

export default function LanguageSwitcher({
  variant = 'default',
  compact = false,
  className = '',
}: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const current = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  const isOnColor = variant === 'onColor';
  const triggerClass = isOnColor
    ? 'bg-white/20 text-white hover:bg-white/30 border-white/30'
    : 'bg-white/60 text-[#3D3A5C] hover:bg-white/80 border-white/60';

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Language"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-medium transition-all ${triggerClass}`}
      >
        <Globe className="w-3.5 h-3.5" />
        {!compact && <span>{current.label}</span>}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 min-w-[160px] rounded-2xl bg-white/95 backdrop-blur-[10px] border border-white/60 shadow-xl py-1 z-50 overflow-hidden">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                lang.code === current.code
                  ? 'bg-[#5B4FCF]/8 text-[#5B4FCF] font-medium'
                  : 'text-[#3D3A5C] hover:bg-[#F5F3FF]'
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span className="flex-1 text-left">{lang.label}</span>
              {lang.code === current.code && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
