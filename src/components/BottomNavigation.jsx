import "../styles/bottomNavigation.css";

export default function BottomNavigation({
  page,
  setPage,
  currentWorker,
}) {

  const navItems = [
    {
      page: "home",
      icon: "🏠",
      title: "Bosh menu",
    },
    {
      page: "teams",
      icon: "👥",
      title: "Teams",
    },
    {
      page: "archive",
      icon: "🗄",
      title: "Arxiv",
    },
    {
      page: "stats",
      icon: "📊",
      title: "Statistika",
      adminOnly: true,
    },
    {
      page: "profile",
      icon: "👤",
      title: "Profil",
    },
  ];

  const isAdmin =
  currentWorker?.roles?.includes("admin") ||
  currentWorker?.roles?.includes("ega");

  return (

    <div className="bottom-nav">

      {navItems.map((item) => {

        if (
          item.adminOnly &&
          !isAdmin
        ) {
          return null;
        }

        return (
  
          <button
            key={item.page}
            className={`bottom-nav-item ${
              page === item.page ? "active" : ""
            }`} 
            onClick={() => setPage(item.page)}
          >

            <div className="bottom-nav-icon">
              {item.icon}
            </div>

            <div className="bottom-nav-title">
              {item.title}
            </div>

          </button>
  
        );

      })}

    </div>

  );

}