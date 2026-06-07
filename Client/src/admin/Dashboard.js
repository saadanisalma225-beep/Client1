// Dashboard.js - Version complète et corrigée
import React, { useState } from "react";
import "./dashboard.css";
import DomainesPage from "./DomainesPage";
import HomeDashboard from "./HomeDashboard";
import CategoriesPage from "./CategoriesPage";
import ProductsPage from "./ProductsPage";

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
            {/* 🏠 Dashboard */}
            <button
              className={`sidebar-item ${menu === "dashboard" ? "active" : ""}`}
              onClick={() => setMenu("dashboard")}
            >
              🏠 Dashboard
            </button>
            
            {/* 📂 Domaines */}
            <button
              className={`sidebar-item ${menu === "domaines" ? "active" : ""}`}
              onClick={() => setMenu("domaines")}
            >
              📂 Domaines
            </button>
            
            {/* 🏷️ Catégories */}
            <button
              className={`sidebar-item ${menu === "categories" ? "active" : ""}`}
              onClick={() => setMenu("categories")}
            >
              🏷️ Catégories
            </button>
            
            {/* 📦 Produits */}
            <button
              className={`sidebar-item ${menu === "products" ? "active" : ""}`}
              onClick={() => setMenu("products")}
            >
              📦 Produits
            </button>
          </nav>
        </aside>

        <main className="dashboard-main">
          {menu === "dashboard" && <HomeDashboard setActiveMenu={setMenu} />}
          {menu === "domaines" && <DomainesPage />}
          {menu === "categories" && <CategoriesPage />}
          {menu === "products" && <ProductsPage />}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;