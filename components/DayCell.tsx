"use client";

import { DailyScore } from "@/lib/api";
import { format, isToday, isSameMonth } from "@/lib/date";
import { getColorClass } from "@/lib/scores";

interface DayCellProps {
    day: Date;
    currentMonth: Date;
    score?: DailyScore;
    onClick: (date: Date, score?: DailyScore) => void;
}

export default function DayCell({ day, currentMonth, score, onClick }: DayCellProps) {
    const isSelectedMonth = isSameMonth(day, currentMonth);
    const total = score ? score.teeth + score.food + score.sport : 0;

    const colors = score
        ? getColorClass(total)
        : "bg-white border-slate-100 hover:border-indigo-300";

    return (
        <div
            onClick={() => onClick(day, score)}
            className={`
        min-h-[80px] sm:min-h-[110px] p-2 flex flex-col justify-between border transition-all cursor-pointer rounded-xl sm:rounded-2xl
        ${colors}
        ${!isSelectedMonth ? "opacity-25 grayscale-[0.5]" : "opacity-100"}
        ${isToday(day) ? "ring-2 ring-indigo-500 ring-offset-2 z-10" : "z-0"}
        hover:scale-[1.02] hover:shadow-xl hover:z-20
      `}
        >
            <div className="flex justify-between items-start">
                <span className={`text-xs sm:text-sm font-black ${!score && isSelectedMonth ? "text-slate-400" : ""}`}>
                    {format(day, 'd')}
                </span>
                {isToday(day) && (
                    <span className="text-[8px] sm:text-[10px] uppercase font-black px-1.5 py-0.5 bg-indigo-600 text-white rounded-md shadow-sm">
                        Hoy
                    </span>
                )}
            </div>

            <div className="mt-1">
                {score ? (
                    <div className="flex flex-col gap-0.5">
                        <div className="text-[9px] sm:text-[11px] font-bold opacity-80 truncate hidden sm:block">
                            D:{score.teeth} A:{score.food} D:{score.sport}
                        </div>
                        <div className="text-[10px] sm:text-sm font-black tracking-tight">
                            {total} <span className="text-[8px] sm:text-[10px] opacity-70">pts</span>
                        </div>
                    </div>
                ) : (
                    isSelectedMonth && (
                        <div className="text-[8px] sm:text-[10px] text-slate-300 italic font-medium">
                            -
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
