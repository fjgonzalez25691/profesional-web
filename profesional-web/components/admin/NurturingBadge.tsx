type Props = {
  stage: number;
};

const stageMap: Record<number, { label: string; color: string }> = {
  0: { label: 'Inicial', color: 'bg-slate-100 text-slate-800' },
  1: { label: 'Día 1', color: 'bg-blue-100 text-blue-800' },
  2: { label: 'Día 3', color: 'bg-indigo-100 text-indigo-800' },
  3: { label: 'Agendado', color: 'bg-emerald-100 text-emerald-800' },
  [-1]: { label: 'Desuscrito', color: 'bg-red-100 text-red-800' },
};

export function NurturingBadge({ stage }: Props) {
  const meta = stageMap[stage] ?? { label: 'Desconocido', color: 'bg-gray-100 text-gray-800' };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.color}`}>
      {meta.label}
    </span>
  );
}
