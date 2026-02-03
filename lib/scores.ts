export const getColorClass = (total: number) => {
    if (total > 20) return "bg-emerald-500 text-white border-emerald-600"; // Green
    if (total > 10) return "bg-amber-400 text-amber-950 border-amber-500"; // Yellow
    return "bg-rose-500 text-white border-rose-600"; // Red
};

export const getStatusText = (total: number) => {
    if (total > 20) return "Top";
    if (total > 10) return "Ok";
    return "Oops";
};

export const getStatusColor = (total: number) => {
    if (total > 20) return "bg-emerald-500 shadow-emerald-200";
    if (total > 10) return "bg-amber-400 shadow-amber-200";
    return "bg-rose-500 shadow-rose-200";
};
