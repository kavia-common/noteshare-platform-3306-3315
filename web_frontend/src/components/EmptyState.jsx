export default function EmptyState({ title = "Nothing here yet", subtitle = "Try changing filters or adding new notes." }) {
  return (
    <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
      <div className="text-4xl mb-3">🗒️</div>
      <h3 className="text-lg font-semibold text-ocean-text">{title}</h3>
      <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
    </div>
  );
}
