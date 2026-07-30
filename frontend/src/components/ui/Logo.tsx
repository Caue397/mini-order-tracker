export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-sm font-extrabold text-white ${className}`}
    >
      MOT
    </span>
  );
}
