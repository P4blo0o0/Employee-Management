# 🏢 HR Management System

A full-stack Human Resource Management System built with **Vue.js**, **Node.js/Express**, and **MySQL**.

> ⚠️ **Work in Progress** - This project is under active development and not yet complete.

## 📸 Preview

![Status: In Development](https://img.shields.io/badge/status-in%20development-yellow)
![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🚀 Tech Stack

### Frontend
- **Vue 3** (Composition API)
- **Vue Router** - Client-side routing
- **Pinia** - State management
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Vite** - Build tool

### Backend
- **Node.js**
- **Express.js** - REST API framework
- **MySQL2** - Database driver
- **Express Validator** - Input validation
- **Morgan** - HTTP request logger

---

## ✅ Completed Features

### Module 1: Employee Lifecycle & Profile Management

- [x] Employee CRUD (Create, Read, Update, Delete/Archive)
- [x] Employee listing with pagination, search, and filtering
- [x] Department management
- [x] Position management
- [x] Basic admin dashboard with statistics
- [x] Simple login system (admin/employee roles)
- [x] Role-based access control
- [x] Employee self-service portal (basic)
- [x] Philippine-specific fields (SSS, PhilHealth, Pag-IBIG, TIN)
- [x] Emergency contact information
- [x] Employment history tracking
- [x] Bulk employee import (API ready)

---

## 🚧 To-Do / Upcoming

### In Progress
- [ ] Password encryption (bcrypt)
- [ ] JWT token-based authentication
- [ ] Enhanced employee portal features
- [ ] File upload for employee documents
- [ ] Audit logging improvements

### Planned Modules
- [ ] **Module 2: Attendance & Time Tracking**
  - Time in/out logging
  - Shift management
  - Overtime tracking
  - Leave management

- [ ] **Module 3: Payroll Management**
  - Salary computation
  - Deductions and contributions
  - Payslip generation
  - 13th month pay computation
  - Government-mandated benefits

- [ ] **Module 4: Reports & Analytics**
  - Employee demographics
  - Attendance reports
  - Payroll summaries
  - Export to Excel/PDF

- [ ] **UI Enhancements**
  - Better design system
  - Dark mode support
  - Mobile responsiveness
  - Charts and data visualization
  - Loading skeletons
  - Animations and transitions

---

## 🛠️ Setup & Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **MySQL** (v5.7 or higher) or **MariaDB** (v10+)
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Employee-Management.git
cd Employee-Management