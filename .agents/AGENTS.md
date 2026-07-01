# DyLeks-New Workspace Rules and Structure

This file defines the project structure, design guidelines, and implementation preferences established during the development of the DyLeks project workspace.

## Project Directory Structure

The workspace is organized into three main application scopes (Siswa, Guru, Psikolog), each containing separate frontend and backend directories:

- **[siswa/](file:///d:/dev/dyleks-new/siswa)**: Application scope for students.
  - **[siswa/frontend/](file:///d:/dev/dyleks-new/siswa/frontend)**: Next.js frontend application (TypeScript, Tailwind CSS, App Router).
  - **[siswa/backend/](file:///d:/dev/dyleks-new/siswa/backend)**: Python-based FastAPI backend application (currently empty placeholder).
- **[guru/](file:///d:/dev/dyleks-new/guru)**: Application scope for teachers/school administrators.
  - **[guru/frontend/](file:///d:/dev/dyleks-new/guru/frontend)**: Next.js frontend application (TypeScript, Tailwind CSS, App Router).
  - **[guru/backend/](file:///d:/dev/dyleks-new/guru/backend)**: Python-based FastAPI backend application (currently empty placeholder).
- **[psikolog/](file:///d:/dev/dyleks-new/psikolog)**: Application scope for psychologists.
  - **[psikolog/frontend/](file:///d:/dev/dyleks-new/psikolog/frontend)**: Next.js frontend application (TypeScript, Tailwind CSS, App Router).
  - **[psikolog/backend/](file:///d:/dev/dyleks-new/psikolog/backend)**: Python-based FastAPI backend application (currently empty placeholder).

---

## Technical Architecture (Separation of Concerns)

To maintain code clarity and avoid code redundancy, follow this strict architectural pattern:

### 1. Types Module
- Place all interfaces and type definitions in the centralized types module: **[app/types/index.ts](file:///d:/dev/dyleks-new/guru/frontend/app/types/index.ts)**.
- Avoid inline prop interface definitions or component-local entity types.

### 2. Services Layer
- Refactor and divide business logic concerns into focused service modules under `app/services/`:
  - **[services/storage.ts](file:///d:/dev/dyleks-new/guru/frontend/app/services/storage.ts)**: Local storage key strings and browser context helpers (`isClient`).
  - **[services/teacherService.ts](file:///d:/dev/dyleks-new/guru/frontend/app/services/teacherService.ts)**: Teacher account CRUD/persistence.
  - **[services/studentService.ts](file:///d:/dev/dyleks-new/guru/frontend/app/services/studentService.ts)**: Student profile CRUD and mock data seeds.
  - **[services/logService.ts](file:///d:/dev/dyleks-new/guru/frontend/app/services/logService.ts)**: Logging and audit trail events.
- UI components must remain presentational. Any data fetching or state changes must be delegated to custom hooks (e.g. `hooks/useAuth.ts` and `hooks/useStudents.ts`) communicating with these services.

---

## UI/UX Design Preferences

Always implement the following layout and styling rules in future portal designs:

### 1. Color Theme & Mode
- **Clean and Minimalist Light-Mode**: Avoid heavy dark modes, vibrant gradients, or high-contrast backgrounds. Use soft whites (`bg-white`), light slates/grays (`bg-slate-50`, `border-slate-100`), clean slate text colors (`text-slate-800`), and minimalist layouts.

### 2. Dashboard Layout Structure
- **No Floating Headers**: Avoid standard sticky header navbars if log out actions are already covered inside cards.
- **Single-Column Vertical Layout**: Stack dashboard cards vertically (`space-y-6`) instead of using two-column sidebar splits. This gives tables full width horizontal room.
- **Fixed height overflow containers**: Elements with variable data length like timeline logs (e.g. `ActivityLogList`) must be styled with a fixed height (e.g., `h-[240px]`) and internal vertical scrollbars to prevent dashboard page bloat.

### 3. QR Code Operations
- Remove download buttons ("Unduh QR") from QR Code modals.
- Prioritize clipboard copying ("Salin Tautan") and displaying the link text alongside a canvas-drawn QR code.

### 4. Draft-to-Commit Registration Flow
- When adding new students, **do not save them to the database/localStorage immediately** upon clicking "Tambah Siswa Baru". 
- Generate a client-side temporary draft first.
- Only commit the student record to the database (and write the activity log entry) when the user **clicks the Copy Link ("Salin Tautan")** button inside the modal.

---

## Python Environment
- The recommended Python version for backend services is `3.12.10`, as defined in the **[.python-version](file:///d:/dev/dyleks-new/.python-version)** file.
