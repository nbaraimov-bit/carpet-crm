export default function UserIcon() {
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
          id="userGlow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur
            stdDeviation="1.3"
            result="blur"
          />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle
        cx="12"
        cy="8"
        r="3.5"
        stroke="#C084FC"
        strokeWidth="1.7"
        filter="url(#userGlow)"
      />

      <path
        d="M5.5 20C5.9 16.5 8.3 14.5 12 14.5C15.7 14.5 18.1 16.5 18.5 20"
        stroke="#C084FC"
        strokeWidth="1.7"
        strokeLinecap="round"
        filter="url(#userGlow)"
      />
    </svg>
  )
}