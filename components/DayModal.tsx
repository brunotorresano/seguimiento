"use client";

import { useState, useEffect } from "react";
import { DailyScore, deleteDayScore } from "@/lib/api";
import { format } from "@/lib/date";
import { getStatusText, getStatusColor } from "@/lib/scores";
import { X, CheckCircle2, Circle, Utensils, Trophy, Save, Trash2, Smile } from "lucide-react";

interface DayModalProps {
    isOpen: boolean;
    date: Date;
    initialScore?: DailyScore;
    onClose: () => void;
    onSave: (score: Omit<DailyScore, 'updated_at'>) => Promise<void>;
}

export default function DayModal({ isOpen, date, initialScore, onClose, onSave }: DayModalProps) {
    // Comida
    const [healthyFood, setHealthyFood] = useState(false);
    const [noEatingLate, setNoEatingLate] = useState(false);


    // Dientes
    const [teethCheck, setTeethCheck] = useState(false);

    // Deporte
    const [exercise, setExercise] = useState(false);
    const [steps, setSteps] = useState(false);

    const [notes, setNotes] = useState("");
    const [isSaving, setIsSaving] = useState(false);


    useEffect(() => {
        if (isOpen) {
            // Map teeth (0 or 10)
            setTeethCheck(initialScore?.teeth === 10);

            // Map food (0, 5, 10)
            const foodVal = initialScore?.food ?? 0;
            setHealthyFood(foodVal >= 5);
            setNoEatingLate(foodVal >= 10);


            // Map sport (0, 5, 10)
            const sportVal = initialScore?.sport ?? 0;
            setExercise(sportVal >= 5);
            setSteps(sportVal >= 10);

            setNotes(initialScore?.notes ?? "");
        }
    }, [initialScore, isOpen]);


    if (!isOpen) return null;

    // Calc scores
    const foodScore = (healthyFood ? 5 : 0) + (noEatingLate ? 5 : 0);
    const teethScore = teethCheck ? 10 : 0;

    const sportScore = (exercise ? 5 : 0) + (steps ? 5 : 0);

    const total = foodScore + teethScore + sportScore;


    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave({
                date: format(date, 'yyyy-MM-dd'),
                teeth: teethScore,
                food: foodScore,
                sport: sportScore,
                notes,
            });
            onClose();
        } catch (error: any) {
            console.error("Error completo al guardar:", error);
            const errorMsg = error.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
            alert("Error al guardar: " + errorMsg);
        } finally {
            setIsSaving(false);
        }
    };


    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de que quieres borrar este registro?")) return;
        setIsSaving(true);
        try {
            await deleteDayScore(format(date, 'yyyy-MM-dd'));
            onClose();
        } catch (error) {
            alert("Error al borrar los datos");
        } finally {
            setIsSaving(false);
        }
    };

    const CheckboxItem = ({
        label,
        checked,
        onToggle,
    }: {
        label: string,
        checked: boolean,
        onToggle: () => void,
    }) => (
        <label className="flex items-center gap-3 cursor-pointer group">
            <div
                onClick={onToggle}
                className={`p-1 rounded-lg transition-all ${checked ? 'bg-indigo-600' : 'bg-slate-100 group-hover:bg-slate-200'}`}
            >
                {checked ? (
                    <CheckCircle2 size={18} className="text-white" />
                ) : (
                    <Circle size={18} className="text-slate-300" />
                )}
            </div>
            <span className={`text-sm font-medium ${checked ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                {label}
            </span>
        </label>
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
                    {/* Comida */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-orange-500 bg-opacity-20">
                                <Utensils size={18} className="text-orange-500" />
                            </div>
                            <label className="text-sm font-black text-slate-900 uppercase tracking-wide">Comida</label>
                            <span className="ml-auto text-lg font-black text-orange-600">{foodScore}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2 pl-2">
                            <CheckboxItem label="Comida Sana (No procesados y bajo en hidratos)" checked={healthyFood} onToggle={() => setHealthyFood(!healthyFood)} />
                            <CheckboxItem label="Ayuno después de la comida principal" checked={noEatingLate} onToggle={() => setNoEatingLate(!noEatingLate)} />
                        </div>
                    </div>

                    {/* Dientes */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-indigo-500 bg-opacity-20">
                                <Smile size={18} className="text-indigo-500" />
                            </div>
                            <label className="text-sm font-black text-slate-900 uppercase tracking-wide">Dientes</label>
                            <span className="ml-auto text-lg font-black text-indigo-600">{teethScore}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2 pl-2">
                            <CheckboxItem label="Cepillado + Irrigador" checked={teethCheck} onToggle={() => setTeethCheck(!teethCheck)} />
                        </div>
                    </div>

                    {/* Deporte */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-emerald-500 bg-opacity-20">
                                <Trophy size={18} className="text-emerald-500" />
                            </div>
                            <label className="text-sm font-black text-slate-900 uppercase tracking-wide">Deporte</label>
                            <span className="ml-auto text-lg font-black text-emerald-600">{sportScore}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2 pl-2">
                            <CheckboxItem label="Tabla de ejercicios" checked={exercise} onToggle={() => setExercise(!exercise)} />
                            <CheckboxItem label="Objetivo de pasos" checked={steps} onToggle={() => setSteps(!steps)} />
                        </div>
                    </div>


                    <div className="pt-4 mt-4 border-t border-slate-100">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Comentarios del día</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Escribe aquí tus reflexiones o notas..."
                                className="w-full min-h-[100px] p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all resize-none"
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl mt-6">
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
                    {initialScore && (
                        <button
                            onClick={handleDelete}
                            disabled={isSaving}
                            className="p-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors disabled:opacity-50"
                            title="Borrar registro"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
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
