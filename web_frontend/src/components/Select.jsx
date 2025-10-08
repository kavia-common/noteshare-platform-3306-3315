import clsx from "classnames";

/**
 * PUBLIC_INTERFACE
 * Select: Styled select with label
 */
export default function Select({ label, className, children, ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>}
      <select
        className={clsx(
          "w-full h-10 px-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
