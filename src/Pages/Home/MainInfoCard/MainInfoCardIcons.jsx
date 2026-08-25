// Status ikonkalari

export function NewIcon({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3" y="3" width="18" height="18" rx="5"
        stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7V17M7 12H17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round" />
    </svg>
  );
}


export function ReceivedIcon({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 4V14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 11L12 15L16 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="4"
        y="17"
        width="16"
        height="3"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}


export function WashedIcon({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 8H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7 5H17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="4"
        y="8"
        width="16"
        height="11"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="12"
        cy="13.5"
        r="3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}


export function ReadyIcon({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M7.5 12.5L10.5 15.5L16.5 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


// Mahsulot ikonkalari

export function CarpetIcon({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gilam tanasi */}
      <path
        d="M5 5.5
           C5 4.7 5.7 4 6.5 4
           H18
           C18.8 4 19.5 4.7 19.5 5.5
           V16.5
           C19.5 17.3 18.8 18 18 18
           H7
           C5.9 18 5 17.1 5 16
           V5.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Gilam ichki naqshi */}
      <path
        d="M7.5 7
           H17
           M7.5 10
           H17
           M7.5 13
           H17"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* O'ralgan qismi */}
      <path
        d="M5 5.5
           C3.6 5.5 3.2 7.2 4.3 8
           C5.1 8.6 6.3 8.1 6.3 7
           C6.3 6.3 5.7 5.8 5 5.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Gilam cheti */}
      <path
        d="M7 18
           C7 19.2 6.3 20 5.2 20
           M10 18
           C10 19.2 9.3 20 8.2 20
           M13 18
           C13 19.2 12.3 20 11.2 20"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}


export function BlanketIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 5H18C19.1 5 20 5.9 20 7V19H7C5.9 19 5 18.1 5 17V5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M8 9H17M8 13H17"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M5 17C5 15.9 5.9 15 7 15H20"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}


export function YakandozIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 5C7 3.9 7.9 3 9 3H15C16.1 3 17 3.9 17 5V19H7V5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M9 7H15M9 11H15M9 15H13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M5 19H19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}


export function CurtainIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 5H19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M6 6V19M18 6V19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M6 7C8 9 8 16 6 19M18 7C16 9 16 16 18 19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9 7V19M15 7V19"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity=".7"
      />
    </svg>
  );
}