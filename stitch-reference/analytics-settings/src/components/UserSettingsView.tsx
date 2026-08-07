import React, { useState } from 'react';
import { UserProfile } from '../types';

interface UserSettingsViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onResetDemoData: () => void;
}

export const UserSettingsView: React.FC<UserSettingsViewProps> = ({
  userProfile,
  onUpdateProfile,
  onResetDemoData,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [role, setRole] = useState(userProfile.role);
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl);
  const [unit, setUnit] = useState<'kg' | 'lbs'>(userProfile.unit);
  const [streak, setStreak] = useState(userProfile.dailyStreak);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      role,
      avatarUrl,
      unit,
      dailyStreak: Number(streak),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <main className="pt-24 pb-28 px-6 md:pl-[calc(256px+40px)] md:pr-10 md:pt-12 md:pb-12 max-w-[1000px] mx-auto min-h-screen flex flex-col gap-8">
      <div>
        <h1 className="font-['Sora'] text-3xl md:text-5xl font-bold text-[#1b1b24] tracking-tight mb-2">
          User Settings
        </h1>
        <p className="font-['Sora'] text-base text-[#474555]">
          Manage your athlete profile, display units, and training targets.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-8 rounded-3xl border border-white/60 shadow-xl space-y-6">
        <div className="flex items-center gap-6">
          <img
            src={avatarUrl}
            alt={name}
            className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-[#5340e4]/30"
          />
          <div>
            <h3 className="font-['Sora'] text-xl font-bold text-[#1b1b24]">{name}</h3>
            <p className="text-xs text-[#5340e4] font-semibold">{role}</p>
          </div>
        </div>

        <div className="space-y-4 font-['Sora'] text-sm">
          <div>
            <label className="block text-xs font-semibold text-[#474555] mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#c8c4d8] focus:border-[#5340e4] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#474555] mb-1">Athlete Status / Title</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#c8c4d8] focus:border-[#5340e4] outline-none"
              placeholder="e.g. Pro Athlete, Elite Powerlifter"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#474555] mb-1">Avatar Image URL</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#c8c4d8] focus:border-[#5340e4] outline-none text-xs font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#474555] mb-1">Weight Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'kg' | 'lbs')}
                className="w-full px-4 py-3 rounded-xl border border-[#c8c4d8] focus:border-[#5340e4] outline-none"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#474555] mb-1">Daily Streak Counter</label>
              <input
                type="number"
                value={streak}
                onChange={(e) => setStreak(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-[#c8c4d8] focus:border-[#5340e4] outline-none font-bold"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-[#c8c4d8]/30">
          <button
            type="button"
            onClick={onResetDemoData}
            className="px-5 py-2.5 rounded-full bg-[#ffdad6] text-[#93000a] font-['Sora'] text-xs font-bold hover:bg-[#ffb4a8] transition-colors"
          >
            Reset Demo Data
          </button>

          <div className="flex items-center gap-3">
            {isSaved && (
              <span className="text-xs text-[#006a61] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Saved Successfully!
              </span>
            )}
            <button
              type="submit"
              className="px-8 py-3.5 rounded-full bg-[#5340e4] text-white font-['Sora'] font-bold text-sm bg-glow-primary hover:bg-[#6d5dfe] transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};
