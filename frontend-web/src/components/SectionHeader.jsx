export default function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.24em] text-blue-700">
            {eyebrow}
          </p>
        ) : null}
        <h3 className="mt-2 text-2xl font-bold text-slate-900">{title}</h3>
        {description ? (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div>{action}</div> : null}
    </div>
  );
}
