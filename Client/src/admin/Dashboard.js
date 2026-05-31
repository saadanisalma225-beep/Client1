import React, { useState } from "react";
import "./dashboard.css";
import DomainesPage from "./DomainesPage";
import HomeDashboard from "./HomeDashboard";

function Dashboard({ onLogout }) {
  const [menu, setMenu] = useState("dashboard");

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h2>Dashboard Administration</h2>
        <button className="logout-btn" onClick={onLogout}>
          Déconnexion
        </button>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <button
              className={`sidebar-item ${menu === "dashboard" ? "active" : ""}`}
              onClick={() => setMenu("dashboard")}
            >
              🏠 Dashboard
            </button>
            <button
              className={`sidebar-item ${menu === "domaines" ? "active" : ""}`}
              onClick={() => setMenu("domaines")}
            >
              📂 Domaines
            </button>
          </nav>
        </aside>

        <main className="dashboard-main">
          {menu === "dashboard" && <HomeDashboard setActiveMenu={setMenu} />}
          {menu === "domaines" && <DomainesPage />}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;