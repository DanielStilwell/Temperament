import { useState } from 'react';
import { Trash2, ChevronRight, User as UserIcon, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Observer } from '../../types/account';
import type { TemperamentType } from '../../types';

const TEMPERAMENT_BADGE: Record<TemperamentType, { bg: string; color: string }> = {
  sanguine: { bg: 'bg-[#FDF0E6]', color: 'text-[#E8A87C]' },
  choleric: { bg: 'bg-[#FBE8E6]', color: 'text-[#D96459]' },
  phlegmatic: { bg: 'bg-[#E8F0F8]', color: 'text-[#6B9AC4]' },
  melancholic: { bg: 'bg-[#F0ECF8]', color: 'text-[#8E7CC3]' },
};

const GENDER_LABEL: Record<string, string> = {
  male: 'M',
  female: 'F',
  other: 'Other',
  unknown: '',
};

interface Props {
  observers: Observer[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
  onSelect?: (observer: Observer) => void;
  selectable?: boolean;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  emptyHint?: string;
}

export default function ObserverList({
  observers,
  loading,
  onDelete,
  onSelect,
  selectable = false,
  selectedIds = [],
  onToggleSelect,
  emptyHint,
}: Props) {
  const { t } = useTranslation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(t('observerList.deleteConfirm', { name }))) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-8 flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-[#5B4FCF] animate-spin" />
      </div>
    );
  }

  if (observers.length === 0) {
    return (
      <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#5B4FCF]/10 flex items-center justify-center mx-auto mb-3">
          <UserIcon className="w-6 h-6 text-[#5B4FCF]" />
        </div>
        <p className="text-sm text-[#8E8CA8]">{emptyHint || t('observerList.empty')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 overflow-hidden">
      {observers.map((ob, i) => {
        const temperamentKey = ob.result?.temperament || 'sanguine';
        const badge = TEMPERAMENT_BADGE[temperamentKey];
        const isSelected = selectedIds.includes(ob.id);
        return (
          <div
            key={ob.id}
            className={`flex items-center gap-3 p-4 transition-colors ${
              i > 0 ? 'border-t border-[#E8E6F5]' : ''
            } ${selectable && isSelected ? 'bg-[#5B4FCF]/5' : 'hover:bg-white/40'}`}
          >
            {selectable && (
              <button
                onClick={() => onToggleSelect?.(ob.id)}
                className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  isSelected ? 'border-[#5B4FCF] bg-[#5B4FCF]' : 'border-[#C5C0E8] bg-white'
                }`}
              >
                {isSelected && <span className="text-white text-xs">✓</span>}
              </button>
            )}

            <button
              onClick={() => !selectable && onSelect?.(ob)}
              className="flex-1 flex items-center gap-3 text-left min-w-0"
              disabled={selectable}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#5B4FCF]/15 to-[#7B6FE0]/15 flex items-center justify-center text-[#5B4FCF] font-semibold">
                {ob.name.slice(0, 1)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#3D3A5C] truncate">{ob.name}</span>
                  {GENDER_LABEL[ob.gender] && (
                    <span className="text-xs text-[#8E8CA8]">{GENDER_LABEL[ob.gender]}</span>
                  )}
                  <span className={`px-1.5 py-0.5 rounded text-xs ${badge.bg} ${badge.color}`}>{t(`temperament.${temperamentKey}.badge`)}</span>
                </div>
                <div className="text-xs text-[#8E8CA8] mt-0.5 truncate">
                  {ob.profession || t('observerList.noProfession')}
                  {ob.note && ` · ${ob.note}`}
                </div>
              </div>
            </button>

            {!selectable && onSelect && (
              <ChevronRight className="w-4 h-4 text-[#8E8CA8] flex-shrink-0" />
            )}

            {!selectable && (
              <button
                onClick={() => handleDelete(ob.id, ob.name)}
                disabled={deletingId === ob.id}
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#8E8CA8] hover:text-red-500 hover:bg-red-50/60 transition-all disabled:opacity-40"
                title={t('observerList.delete')}
              >
                {deletingId === ob.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
