# ApexDentalPRO - Clinical Patient Management & Odontogram System

[![Deploy SPA to GitHub Pages](https://github.com/apex-dental/apex-dental-pro/actions/workflows/deploy.yml/badge.svg)](https://github.com/apex-dental/apex-dental-pro/actions/workflows/deploy.yml)
[![Live SPA Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://apex-dental.github.io/apex-dental-pro/)

**ApexDentalPRO** is a modern, high-performance, fully-featured Single Page Application (SPA) designed for dental practices, receptionists, and oral surgeons. Built with React 19, TypeScript Strict Mode, Tailwind CSS v4, and Zustand with local **IndexedDB mock persistence**, it runs entirely on the client side with zero external backend dependencies while persisting all client records, attachments, and clinical charts across browser reloads.

---

## 📸 Interface & Workflow Showcase

### 1. Patient Directory & Medical Risk Classification
Browse, search, and filter patient records with real-time risk indicators (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) and prominent medical alert badges.

![Patient Directory](docs/screenshots/01_patient_directory.png)

---

### 2. Interactive Dental Odontogram & Dual Notation System
Interactive adult/pediatric tooth chart supporting both **Universal Numbering System (#1 - #32)** and **FDI World Dental Federation Notation (11 - 48)**. Log condition states including *Healthy*, *Caries*, *Root Canal*, *Crown*, *Filling*, *Extraction Needed*, *Missing*, *Implant*, and *Bridge*.

![Patient Profile & Odontogram](docs/screenshots/02_patient_profile_odontogram.png)

---

### 3. Secure Document Vault & Media Attachment Center
Upload, preview, tag, and download patient attachments (X-Rays, Lab Results, Prescriptions, Consent Forms, ID Cards) stored directly in IndexedDB via Browser File API and Base64 URLs.

![Document Center](docs/screenshots/03_document_center_xray.png)

---

### 4. Appointment Schedule & Calendar Agenda
Track daily and weekly dental clinic appointments, filter by status (`Scheduled`, `Completed`, `Cancelled`, `No-Show`), and schedule new visits directly tied to client accounts.

![Appointment Schedule](docs/screenshots/04_appointment_schedule.png)

---

## ✨ Core Features

* 🏥 **Patient Account Management:** Full CRUD operations for patient demographics, insurance policy numbers, and emergency contacts.
* ⚠️ **Critical Medical Alert System:** Visual red banner warnings for high-risk conditions (Penicillin/Latex allergies, Bleeding Disorders, Anticoagulants, Hypertension, Pregnancy, Heart Conditions).
* 🦷 **Tooth-by-Tooth Charting:** Click any individual tooth in the Maxillary or Mandibular arch to log pathology, existing restorations, surface notes, or schedule clinical procedures.
* 📝 **Clinical Encounter Timeline:** Structured SOAP notes (Subjective, Objective, Assessment, Plan) with procedure codes and chronological visit history.
* 📁 **Digital Document Attachment:** Local file storage simulation with inline modal preview for high-resolution JPEG/PNG X-rays and PDF reports.
* 🗓️ **Calendar Agenda:** Integrated schedule manager to track patient flow, dentist availability, and appointment statuses.
* 💾 **100% Offline / Client-Side Persistence:** Powered by IndexedDB via `idb` wrapper + Zustand state management. Initialized with rich seed data upon first load.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [Vite 6](https://vite.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict Mode Enabled) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) with custom IndexedDB middleware |
| **Database** | Browser [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) via [`idb`](https://github.com/jakearchibald/idb) |
| **Forms & Validation**| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Linter & Quality** | [Oxlint](https://oxc.rs/) |
| **Deployment** | GitHub Pages (Static SPA Export) + GitHub Actions CI/CD |

---

## 🚀 Local Development Setup

### Prerequisites
* Node.js >= 18.x
* npm >= 9.x

### Installation & Launch

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Scripts

* `npm run dev`: Starts local development server.
* `npm run build`: Runs TypeScript typechecks (`tsc -b`) and builds production distribution artifacts to `dist/`.
* `npm run lint`: Runs Oxlint code verification.
* `npm run preview`: Preview local production build.
