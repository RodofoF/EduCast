export default function EmptyState({ title, description }) {
  return (
    <div className="rounded-[28px] border border-dashed border-blue-200 bg-white p-8 text-center shadow-sm">
      <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
