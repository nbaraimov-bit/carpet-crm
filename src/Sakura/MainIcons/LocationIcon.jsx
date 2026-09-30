export default function LocationIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          id="locationGlow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur
            stdDeviation="1.4"
            result="blur"
          />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d="M12 21C12 21 19 14.8 19 9.5C19 5.91 15.87 3 12 3C8.13 3 5 5.91 5 9.5C5 14.8 12 21 12 21Z"
        stroke="#C084FC"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#locationGlow)"
      />

      <circle
        cx="12"
        cy="9.5"
        r="2.4"
        stroke="#E9D5FF"
        strokeWidth="1.5"
      />
    </svg>
  )
}