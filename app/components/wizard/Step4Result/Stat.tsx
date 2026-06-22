export function Stat({ label, value }: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">{label}</span>
      <span className="text-sm md:text-base font-heading">{value}</span>
    </div>
  );
}
