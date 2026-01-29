"use client";

import { useState, useEffect } from "react";
import { DailyScore } from "@/lib/api";
import { format } from "@/lib/date";
import { getStatusText, getStatusColor } from "@/lib/scores";
import { X, Moon, Utensils, Trophy, Save } from "lucide-react";

interface DayModalProps {
    isOpen: boolean;
    date: Date;
    initialScore?: DailyScore;
    onClose: () => void;
    onSave: (score: Omit<DailyScore, 'updated_at'>) => Promise<void>;
}

export default function DayModal({ isOpen, date, initialScore, onClose, onSave }: DayModalProps) {
    const [sleep, setSleep] = useState(0);
    const [food, setFood] = useState(0);
    const [sport, setSport] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSleep(initialScore?.sleep ?? 0);
            setFood(initialScore?.food ?? 0);
            setSport(initialScore?.sport ?? 0);
        }
    }, [initialScore, isOpen]);

    if (!isOpen) return null;

    const total = sleep + food + sport;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave({
                date: format(date, 'yyyy-MM-dd'),
                sleep,
                food,
                sport,
            });
            onClose();
        } catch (error) {
            alert("Error al guardar los datos");
        } finally {
            setIsSaving(false);
        }
    };

    const ScoreInput = ({
        label,
        value,
        onChange,
        icon: Icon,
        colorClass
    }: {
        label: string,
        value: number,
        onChange: (v: number) => void,
        icon: any,
        colorClass: string
    }) => (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${colorClass} bg-opacity-20`}>
                    <Icon size={18} className={colorClass.replace('bg-', 'text-')} />
                </div>
                <label className="text-sm font-semibold text-slate-700">{label}</label>
                <span className="ml-auto text-lg font-bold text-slate-900">{value}</span>
            </div>
            <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
                <span>0</span>
                <span>5</span>
                <span>10</span>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 capitalize">
                            {format(date, 'd MMMM yyyy')}
                        </h3>
                        <p className="text-sm text-slate-500">¿Cómo fue tu día?</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    <ScoreInput label="Sueño" value={sleep} onChange={setSleep} icon={Moon} colorClass="bg-indigo-500" />
                    <ScoreInput label="Alimentación" value={food} onChange={setFood} icon={Utensils} colorClass="bg-orange-500" />
                    <ScoreInput label="Deporte" value={sport} onChange={setSport} icon={Trophy} colorClass="bg-emerald-500" />

                    <div className="pt-4 mt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <div>
                                <span className="text-sm font-bold text-slate-500 block uppercase tracking-wider">Puntuación Total</span>
                                <span className="text-3xl font-black text-slate-900">{total} <span className="text-slate-300 text-lg">/ 30</span></span>
                            </div>
                            <div className={`
                w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg
                transition-colors duration-500
                ${getStatusColor(total)}
              `}>
                                <span className="text-xs font-bold uppercase">
                                    {getStatusText(total)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50/50 flex gap-4">
                    <button onClick={onClose} className="flex-1 py-4 text-sm font-bold text-slate-600 hover:text-slate-900">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={18} /> Guardar</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
