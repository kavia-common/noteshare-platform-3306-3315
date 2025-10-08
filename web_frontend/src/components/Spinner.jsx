export default function Spinner({ label }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="animate-spin h-6 w-6 rounded-full border-2 border-blue-600 border-t-transparent mr-3" />
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </div>
  );
}
