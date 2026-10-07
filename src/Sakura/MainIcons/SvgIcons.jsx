export const UserIcon = ({className = "" }) => (

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

export const PhoneIcon = ({className = "" }) =>
  (
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

export const LocationIcon = ({className = "" }) => (
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

export const CommentIcon = ({className = "" }) => 
  (
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

export const PriceIcon = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12 3V21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />

    <path
      d="M16 7.5C15.2 6.4 14 6 12.5 6C10.6 6 9 7.1 9 8.6C9 10.2 10.4 10.8 12.4 11.3L13.6 11.6C15.6 12.1 17 12.8 17 14.5C17 16.4 15.2 18 12.5 18C10.6 18 8.9 17.3 8 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const TimeIcon = ({className = "" }) => (

  <svg
    className="operator-time-icon"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="8.5"
      stroke="currentColor"
      strokeWidth="1.8"
    />
                  
    <path
      d="M12 7.5V12L15 14"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)


export const SearchIcon = ({className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      cx="11"
      cy="11"
      r="6.5"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M16 16L20 20"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)
