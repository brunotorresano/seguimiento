export const getColorClass = (total: number) => {
    if (total > 21) return "bg-emerald-500 text-white border-emerald-600";
    if (total > 15) return "bg-amber-400 text-amber-950 border-amber-500";
    return "bg-rose-500 text-white border-rose-600";
};

export const getStatusText = (total: number) => {
    if (total > 21) return "Top";
    if (total > 15) return "Ok";
    return "Oops";
};

export const getStatusColor = (total: number) => {
    if (total > 21) return "bg-emerald-500 shadow-emerald-200";
    if (total > 15) return "bg-amber-400 shadow-amber-200";
    return "bg-rose-500 shadow-rose-200";
};
