type IronGymMarkProps = {
  className?: string;
  shimmer?: boolean;
  gymClassName?: string;
};

/** Titoli brand IronGym in CamelCase (non usa font-display / Bebas). */
export function IronGymMark({
  className = "",
  shimmer = false,
  gymClassName = "text-silver-500",
}: IronGymMarkProps) {
  const gymClass = shimmer ? "" : gymClassName;

  return (
    <span
      className={`ig-brand-wordmark ${shimmer ? "ig-title-shimmer" : ""} ${className}`.trim()}
    >
      Iron{gymClass ? <span className={gymClass}>Gym</span> : "Gym"}
    </span>
  );
}
