export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      className="logo-mark"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="32" height="32" rx="9" fill="currentColor" />
      <path
        d="M7 25V14.5C7 9.2 10.8 6 16 6s9 3.2 9 8.5V25"
        fill="none"
        stroke="#F7F4EF"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M12 25V16.2c0-2.4 1.7-4 4-4s4 1.6 4 4V25"
        fill="none"
        stroke="#F6B99A"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}
