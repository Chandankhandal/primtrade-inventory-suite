# Multi-Vendor Inventory Analytical Suite (Primetrade.ai Backend Assignment)

A production-ready, scalable RESTful API and supportive React frontend interface that implements secure role-based inventory lifecycle management, token-based session tracking, and multi-vendor data isolation. Built as a comprehensive evaluation assignment for the Primetrade.ai Backend Developer Intern position.

## 🌟 Core System Highlights
* **Robust Multi-Vendor Isolation Layer:** Admins possess strict cryptographic data isolation. An authenticated Admin can only view, mutate, or purge the inventory assets they personally compiled, while other admins' data remains isolated.
* **Role-Based Access Control (RBAC):** Explicit route access configuration distinguishing `admin` users (with full CRUD permissions) from standard `user` sessions (restricted to read-only catalog analysis).
* **Decoupled Architecture:** Built utilizing a strict modular monolith structure, cleanly separating database schemas, route controllers, validation protocols, and the client application.
* **Modern CSS Baseline:** Driven by Tailwind CSS v4 featuring native high-contrast theme styling optimized for developer operations dashboards.

---

## 🛠️ Project Structure
```text
primtrade-inventory-suite/
├── backend/
│   ├── config/          # Database & setup connections
│   ├── controllers/     # API Business logic engines (Auth, Products)
│   ├── middleware/      # JWT protection, role verification, error handlers
│   ├── models/          # Mongoose Database schemas (User, Product)
│   ├── routes/          # Versioned express routing map (/api/v1)
│   ├── .env.example     # Template for local secret configurations
│   └── server.js        # Main backend application bootstrapper
├── frontend/
│   ├── src/
│   │   ├── context/     # AuthContext global telemetry provider
│   │   ├── pages/       # View layers (AuthPage.jsx, Dashboard.jsx)
│   │   ├── App.jsx      # Central Switchboard Page Router map
│   │   └── index.css    # Tailwind v4 compiled style baseline
└── README.md