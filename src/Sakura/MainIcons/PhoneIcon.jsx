export default function PhoneIcon() {
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
          id="phoneGlow"
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

      <path
        d="M7.2 4.2L9.1 3.4C9.6 3.2 10.2 3.4 10.5 3.9L12 7.2C12.2 7.7 12.1 8.2 11.7 8.6L10.2 10C11 11.7 12.3 13 14 13.8L15.4 12.3C15.8 11.9 16.3 11.8 16.8 12L20.1 13.5C20.6 13.8 20.8 14.4 20.6 14.9L19.8 16.8C19.5 17.6 18.8 18.1 18 18.2C10.5 18.8 5.2 13.5 5.8 6C5.9 5.2 6.4 4.5 7.2 4.2Z"
        stroke="#C084FC"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#phoneGlow)"
      />
    </svg>
  )
}