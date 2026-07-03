export default function Toast({
  type,
  title,
  text,
}) {

  return (
    <div className={`toast ${type}`}>

      <div className="toast-title">
        {title}
      </div>

      {text && (
        <div className="toast-text">
          {text}
        </div>
      )}

    </div>
  )

}