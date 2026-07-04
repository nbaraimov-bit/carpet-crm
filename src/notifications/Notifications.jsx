import { useState } from "react"
import Toast from "./Toast"

export default function Notifications() {

  const [toast, setToast] = useState(null)

  function showNotification(data) {

    setToast(data)

    setTimeout(() => {
      setToast(null)
    }, 3000)

  }

  return (
    <>
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          text={toast.text}
        />
      )}
    </>
  )

} 