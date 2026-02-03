"use client";

import { useState, useEffect, useCallback } from "react";
import {
    getMonthDays,
    format,
    addMonths,
    subMonths,
} from "@/lib/date";
import { fetchMonthScores, upsertDayScore, DailyScore } from "@/lib/api";
import DayCell from "./DayCell";
import DayModal from "./DayModal";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RefreshCcw, LogOut, User } from "lucide-react";

interface CalendarProps {
    user?: any;
    onLogout?: () => void;
}

export default function Calendar({ user, onLogout }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [scores, setScores] = useState<Record<string, DailyScore>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedScore, setSelectedScore] = useState<DailyScore | undefined>();

    const loadScores = useCallback(async () => {
        setIsLoading(true);
        try {
            const days = getMonthDays(currentMonth);
            const start = format(days[0], 'yyyy-MM-dd');
            const end = format(days[days.length - 1], 'yyyy-MM-dd');

            const data = await fetchMonthScores(start, end);
            const scoreMap: Record<string, DailyScore> = {};
            data.forEach(s => {
                scoreMap[s.date] = s;
            });
            setScores(scoreMap);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [currentMonth]);

    useEffect(() => {
        loadScores();
    }, [loadScores]);

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const handleToday = () => setCurrentMonth(new Date());

    const handleDayClick = (date: Date, score?: DailyScore) => {
        setSelectedDate(date);
        setSelectedScore(score);
        setIsModalOpen(true);
    };

    const handleSaveScore = async (newScore: Omit<DailyScore, 'updated_at'>) => {
        await upsertDayScore(newScore);
        await loadScores();
    };

    const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const days = getMonthDays(currentMonth);

    return (
        <div className="w-full max-w-6xl mx-auto px-4 pt-2 pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-3">
                <div>
                    <div className="p-1.5 bg-indigo-600 text-white rounded-xl shadow-lg">
                        <CalendarIcon size={20} />
                    </div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3 capitalize">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h1>
                    <p className="text-slate-500 mt-0.5 text-sm font-medium italic">Sigue tu ritmo, mejora tu vida.</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
                        <button onClick={handlePrevMonth} className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors text-slate-600">
                            <ChevronLeft size={22} />
                        </button>
                        <button onClick={handleToday} className="px-6 py-2.5 bg-slate-900 text-white text-sm font-black rounded-xl hover:bg-slate-800 transition-all shadow-md">
                            Hoy
                        </button>
                        <button onClick={handleNextMonth} className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors text-slate-600">
                            <ChevronRight size={22} />
                        </button>
                        <div className="w-px h-6 bg-slate-100 mx-1" />
                        <button onClick={loadScores} disabled={isLoading} className={`p-2.5 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 ${isLoading ? 'animate-spin' : ''}`}>
                            <RefreshCcw size={18} />
                        </button>
                    </div>

                    {user && (
                        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 ml-2">
                            <div className="flex items-center gap-2 px-2">
                                <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                                    <User size={16} />
                                </div>
                                <span className="text-sm font-bold text-slate-600 hidden lg:inline max-w-[150px] truncate">{user.email}</span>
                            </div>
                            <div className="w-px h-6 bg-slate-100 mx-1" />
                            <button
                                onClick={onLogout}
                                className="p-2.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
                                title="Cerrar sesión"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-2">
                <LegendItem color="bg-emerald-500" label="Top (>20)" />
                <LegendItem color="bg-amber-400" label="Ok (11-20)" />
                <LegendItem color="bg-rose-500" label="Oops (≤10)" />
            </div>

            <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/50">
                    {weekDays.map(day => (
                        <div key={day} className="py-4 text-center text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-px bg-slate-100">
                    {days.map(day => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        return (
                            <DayCell
                                key={dateStr}
                                day={day}
                                currentMonth={currentMonth}
                                score={scores[dateStr]}
                                onClick={handleDayClick}
                            />
                        );
                    })}
                </div>
            </div>

            <DayModal
                isOpen={isModalOpen}
                date={selectedDate}
                initialScore={selectedScore}
                onClose={() => {
                    setIsModalOpen(false);
                    loadScores();
                }}
                onSave={handleSaveScore}
            />
        </div>
    );
}

function LegendItem({ color, label }: { color: string, label: string }) {
    return (
        <div className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-full text-xs font-black border border-slate-100 uppercase tracking-wider shadow-sm">
            <div className={`w-3 h-3 ${color} rounded-full shadow-sm`} />
            {label}
        </div>
    );
}
