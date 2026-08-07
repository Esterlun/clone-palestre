import React, { useState } from 'react';
import { UserProfile, AICoachMessage } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  currentWeight: number;
  currentBodyFat: number;
  recoveryScore: number;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  currentWeight,
  currentBodyFat,
  recoveryScore
}) => {
  const [messages, setMessages] = useState<AICoachMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Ciao ${user.name}! I am your Aura AI Coach. Your current stats show 12 streak days, 85% recovery, and consistent weight drop (74.2 kg). What fitness, programming, or nutrition questions do you have today?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isLoadingAi) return;

    const userMsg: AICoachMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: inputPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const promptToSend = inputPrompt;
    setInputPrompt('');
    setIsLoadingAi(true);

    try {
      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          userContext: {
            weight: currentWeight,
            bodyFat: currentBodyFat,
            recovery: recoveryScore,
            streak: user.streakDays
          }
        })
      });

      const data = await response.json();
      const aiReply = data.reply || "Keep up the great work!";

      const aiMsg: AICoachMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "Sorry, I couldn't connect to the AI server right now. Please check your internet connection.",
          timestamp: 'Now'
        }
      ]);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const toggleUnit = () => {
    onUpdateUser({
      ...user,
      unit: user.unit === 'kg' ? 'lbs' : 'kg'
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-[#1A1B2E] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-white/10 shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#6d5dfe]/25 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#6d5dfe] shadow-lg relative shrink-0">
            <img src={user.sidebarAvatarUrl} alt={user.name} className="object-cover w-full h-full" />
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">{user.name}</h2>
              <span className="bg-[#65f9e7] text-[#00201d] text-xs font-bold px-3 py-0.5 rounded-full">PRO</span>
            </div>
            <p className="text-sm text-[#c5c0ff]">{user.title}</p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
              <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 text-xs font-semibold">
                <span className="material-symbols-outlined text-amber-400 text-sm">local_fire_department</span>
                <span>{user.streakDays} Day Streak</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-semibold text-[#65f9e7]">
                Target: {user.targetWeightKg} kg
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences & Units Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#c8c4d8]/20 shadow-xs flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg text-[#1b1b24]">Units & System Preferences</h3>
          <p className="text-xs text-[#787587]">Switch between metric (kg) and imperial (lbs)</p>
        </div>

        <button
          onClick={toggleUnit}
          className="bg-[#f0ecf9] hover:bg-[#e5e0ee] text-[#5340e4] font-bold px-5 py-2.5 rounded-2xl transition-colors text-sm flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">swap_horiz</span>
          Unit: {user.unit.toUpperCase()}
        </button>
      </div>

      {/* AI Fitness Coach Chat Section */}
      <div className="bg-white rounded-3xl p-6 border border-[#c8c4d8]/20 shadow-xs flex flex-col h-[480px]">
        <div className="flex items-center gap-3 pb-4 border-b border-[#e5e0ee]">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5340e4] to-[#65f9e7] text-white flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-xl">smart_toy</span>
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#1b1b24] leading-tight">Aura AI Fitness Coach</h3>
            <span className="text-xs text-[#006a61] font-semibold">Powered by Gemini 3.6 Flash</span>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#5340e4] text-white rounded-br-none shadow-sm'
                    : 'bg-[#f0ecf9] text-[#1b1b24] rounded-bl-none border border-[#c8c4d8]/20'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-[#787587] mt-1 px-1 font-medium">{m.timestamp}</span>
            </div>
          ))}

          {isLoadingAi && (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5340e4] bg-[#f0ecf9] w-fit px-4 py-2 rounded-2xl">
              <span className="material-symbols-outlined text-sm animate-spin">sync</span>
              Aura AI is thinking...
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="pt-3 border-t border-[#e5e0ee] flex gap-2">
          <input
            type="text"
            placeholder="Ask Aura Coach (e.g. 'How to improve my Pull Day volume?')"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            className="flex-1 bg-[#f6f1ff] border border-[#c8c4d8]/40 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#5340e4] outline-hidden text-[#1b1b24] font-medium"
          />
          <button
            type="submit"
            disabled={isLoadingAi || !inputPrompt.trim()}
            className="bg-[#5340e4] hover:bg-[#402dcd] disabled:opacity-50 text-white font-bold px-5 rounded-2xl transition-all flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
