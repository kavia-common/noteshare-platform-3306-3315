import clsx from "classnames";

/**
 * PUBLIC_INTERFACE
 * Input: Styled input with label and error
 */
export default function Input({ label, error, className, ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>}
      <input
        className={clsx(
          "w-full h-10 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </label>
  );
}
