type ArrowUpRightIconProps = {
  className?: string;
};

export function ArrowUpRightIcon({ className = "" }: ArrowUpRightIconProps) {
  const classes = ["arrow-icon", className].filter(Boolean).join(" ");

  return (
    <svg
      aria-hidden="true"
      className={classes}
      focusable="false"
      viewBox="0 0 16 16"
    >
      <path d="M3.5 12.5 12.5 3.5" />
      <path d="M6 3.5h6.5V10" />
    </svg>
  );
}
