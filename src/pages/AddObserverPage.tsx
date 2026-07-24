import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Disclaimer from '../components/ui/Disclaimer';
import { professionList } from '../data/professions';
import useAssessmentStore from '../stores/assessment';
import type { ProfessionType } from '../types';
import type { Gender, AccountTier } from '../types/account';

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
  { value: 'other', label: '其他' },
  { value: 'unknown', label: '不便透露' },
];

export default function AddObserverPage() {
  const { tier } = useParams<{ tier: AccountTier }>();
  const navigate = useNavigate();
  const startObserverMode = useAssessmentStore((s) => s.startObserverMode);

  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('unknown');
  const [profession, setProfession] = useState<ProfessionType | null>(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleStart = async () => {
    if (!name.trim() || !profession) return;
    setSubmitting(true);
    startObserverMode(profession, { name: name.trim(), gender, note: note.trim() });
    // 用 setTimeout 确保 store 更新后再跳转
    setTimeout(() => {
      setSubmitting(false);
      navigate('/assessment');
    }, 50);
  };

  const backLink = tier === 'max' ? '/max' : '/pro';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] md:max-w-[520px] lg:max-w-[640px] flex flex-col gap-5">
        <Link to={backLink} className="inline-flex items-center gap-1.5 text-sm text-[#8E8CA8] hover:text-[#5B4FCF] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          返回工作台
        </Link>

        <div className="rounded-[20px] bg-gradient-to-br from-[#5B4FCF] to-[#7B6FE0] p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Nunito', 'PingFang SC', sans-serif" }}>
              添加被观察者
            </h2>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">
            管理者代填模式：基于你对被观察者的真实了解，选择其在每个情境下的反应
          </p>
        </div>

        <div className="rounded-[20px] bg-white/60 backdrop-blur-[10px] border border-white/50 p-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#3D3A5C]">
              被观察者姓名 <span className="text-[#8E8CA8] text-xs">（可使用化名/编号）</span>
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：小张 / Obs-001"
              className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-[#E8E6F5] text-[#3D3A5C] text-sm placeholder:text-[#8E8CA8]/60 focus:outline-none focus:border-[#5B4FCF] focus:bg-white transition-all"
            />
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#3D3A5C]">性别</span>
            <div className="grid grid-cols-4 gap-2">
              {GENDER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setGender(opt.value)}
                  className={`px-3 py-2.5 rounded-2xl text-sm font-medium border-2 transition-all ${
                    gender === opt.value
                      ? 'border-[#5B4FCF] bg-[#5B4FCF]/5 text-[#5B4FCF]'
                      : 'border-[#E8E6F5] bg-white/40 text-[#3D3A5C] hover:border-[#C5C0E8]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#3D3A5C]">职业领域</span>
            <p className="text-xs text-[#8E8CA8] mb-2">不同职业匹配不同情境题目</p>
            <div className="grid grid-cols-2 gap-2">
              {professionList.map((prof) => (
                <button
                  key={prof.id}
                  type="button"
                  onClick={() => setProfession(prof.id)}
                  className={`px-3 py-2.5 rounded-2xl text-sm font-medium border-2 transition-all text-left ${
                    profession === prof.id
                      ? 'border-[#5B4FCF] bg-[#5B4FCF]/5 text-[#5B4FCF]'
                      : 'border-[#E8E6F5] bg-white/40 text-[#3D3A5C] hover:border-[#C5C0E8]'
                  }`}
                >
                  {prof.name}
                </button>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[#3D3A5C]">
              备注 <span className="text-[#8E8CA8] text-xs">（可选）</span>
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="部门、岗位、关系等便于你区分"
              rows={2}
              className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-[#E8E6F5] text-[#3D3A5C] text-sm placeholder:text-[#8E8CA8]/60 focus:outline-none focus:border-[#5B4FCF] focus:bg-white transition-all resize-none"
            />
          </label>
        </div>

        <Disclaimer />

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleStart}
          disabled={submitting || !name.trim() || !profession}
          className="disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              准备题目...
            </>
          ) : (
            '开始为该被观察者测评'
          )}
        </Button>
      </div>
    </div>
  );
}
