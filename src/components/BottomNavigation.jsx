export default function BottomNavigation({
  page,
  setPage,
}) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,

        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",

        padding: "12px 0",

        background: "#0b1538",

        borderTop: "1px solid rgba(255,255,255,0.08)",

        zIndex: 1000,
      }}
    >
      <button onClick={() => setPage("home")}>
        🏠<br />
        Menu
      </button>

      <button onClick={() => setPage("teams")}>
        👥<br />
        Teams
      </button>

      <button onClick={() => setPage("report")}>
        📊<br />
        Hisobot
      </button>

      <button onClick={() => setPage("profile")}>
        👤<br />
        Shaxsiy
      </button>
    </div>
  );
}