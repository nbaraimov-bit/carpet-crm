export default function CommentIcon() {
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
          id="commentGlow"
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
        d="M5 5.5C5 4.67 5.67 4 6.5 4H17.5C18.33 4 19 4.67 19 5.5V14.5C19 15.33 18.33 16 17.5 16H10L6 20V16.2C5.42 15.96 5 15.39 5 14.7V5.5Z"
        stroke="#C084FC"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#commentGlow)"
      />

      <path
        d="M8.5 8H15.5"
        stroke="#E9D5FF"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="M8.5 11H13"
        stroke="#E9D5FF"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}