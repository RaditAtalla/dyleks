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

To maintain code clarity and avoid code redundancy, follow this strict architectural pattern in both the Guru and Siswa frontend modules:

### 1. Types Module
- Place all interfaces and type definitions in the centralized types module of each scope:
  - Guru: **[app/types/index.ts](file:///d:/dev/dyleks-new/guru/frontend/app/types/index.ts)**
  - Siswa: **[app/types/index.ts](file:///d:/dev/dyleks-new/siswa/frontend/app/types/index.ts)**
- Avoid inline prop interface definitions or component-local entity types.

### 2. Services Layer
- Refactor and divide business logic concerns into focused service modules under `app/services/`:
  - **[services/storage.ts](file:///d:/dev/dyleks-new/guru/frontend/app/services/storage.ts)**: Local storage keys (`dyleks_teachers`, `dyleks_students`, `dyleks_logs`) shared between scopes for unified browser state.
  - **[services/studentService.ts](file:///d:/dev/dyleks-new/guru/frontend/app/services/studentService.ts)**: Student profile CRUD and updates.
  - **[services/teacherService.ts](file:///d:/dev/dyleks-new/guru/frontend/app/services/teacherService.ts)**: Teacher info/lookups.
  - **[services/logService.ts](file:///d:/dev/dyleks-new/guru/frontend/app/services/logService.ts)** (Guru): Activity logs and audit trails.
- UI components must remain presentational. Any data fetching or state changes must be delegated to custom hooks (e.g., `hooks/useAuth.ts`, `hooks/useStudents.ts`, and `hooks/useStudentAuth.ts`).

### 3. Real-Time Synchronization (Decoupled File Watcher)
- Real-time updates on the teacher dashboard are driven by **Server-Sent Events (SSE)**.
- **Decoupled Architecture**: To keep modules independent, the student and teacher backend processes do not communicate directly. Instead, they share the SQLite database file (`shared-db/dyleks.db`).
- **File Watcher (`DBWatcher`)**:
  - The teacher's backend running on port 8004 runs an asynchronous background task (`DBWatcher` in **[app/utils/notifier.py](file:///d:/dev/dyleks-new/guru/backend/app/utils/notifier.py)**) that monitors modification times (`mtime`) of the database file and its WAL file (`dyleks.db-wal`) every 1.0 second.
  - When database writes occur from either backend, the watcher automatically broadcasts a change signal to all active clients subscribed via **[app/routers/events.py](file:///d:/dev/dyleks-new/guru/backend/app/routers/events.py)** (`/api/events/subscribe`).
- **Frontend Live Listener**: The frontend dashboard hook **[useStudents.ts](file:///d:/dev/dyleks-new/guru/frontend/app/hooks/useStudents.ts)** listens to this SSE stream and automatically invokes `refreshData()` to retrieve fresh database records and re-render the dashboard UI seamlessly.

---

## UI/UX Design Preferences

Always implement the following layout and styling rules in portal designs:

### 1. Color Theme & Mode
- **Clean and Minimalist Light-Mode**: Avoid heavy dark modes, vibrant gradients, or high-contrast backgrounds. Use soft whites (`bg-white`), light slates/grays (`bg-slate-50`, `border-slate-100`), clean slate text colors (`text-slate-800`), and minimalist layouts.

### 2. Dashboard Layout Structure
- **No Floating Headers**: Avoid standard sticky header navbars if log out actions are already covered inside cards.
- **Single-Column Vertical Layout**: Stack dashboard cards vertically (`space-y-6` or `space-y-5`) instead of using two-column sidebar splits.
- **Fixed height overflow containers**: Elements with variable data length like timeline logs (e.g. `ActivityLogList`) must be styled with a fixed height (e.g., `h-[240px]`) and internal vertical scrollbars to prevent dashboard page bloat.
- **Mobile-First (Siswa)**: The student portal must be designed mobile-first, targeting compact screens (e.g., using `max-w-md` wrappers).

### 3. QR Code Operations & Login Flow
- Remove download buttons ("Unduh QR") from QR Code modals.
- Prioritize clipboard copying ("Salin Tautan") and displaying the link text alongside a canvas-drawn QR code.
- Student login QR code URL target structure: `http://localhost:8001?student_id=XXX` (for registered students) or `http://localhost:8001?student_id=XXX&teacher_id=YYY` (for new registrations).
- **Siswa Login Flow**: If no `student_id` query param is present on loading, show instructions explaining how to scan the QR code from the teacher.

### 4. Student-Side Registration Flow (No Temporary Students)
- **No Temporary Database Records**: When adding new students in the Guru dashboard, **do not save them to the database** immediately (neither upon clicking "Tambah Siswa Baru" nor clicking "Salin Tautan").
- **ID Uniqueness Verification**:
  - The student ID is generated as a random 3-digit number.
  - The Guru frontend validates its availability by calling `GET /api/students/{student_id}` on the backend. It loops and verifies uniqueness up to 10 times to prevent conflicts.
- **Registration URL Structure**: The target structure is `http://localhost:8001?student_id=XXX&teacher_id=YYY`. The `teacher_id` parameter is required in the URL because the student record does not yet exist in the database.
- **Client-Side Draft Session**:
  - When the student loads the QR code URL, if `student_id` is not in the database but `teacher_id` is in the query params, a client-side mock student draft session (default name `"Siswa Baru"`, class `"-"`) is established in `localStorage` (`CURRENT_STUDENT_KEY`).
  - To prevent registration page reloads from logging the student out, this client-side draft session is persisted in local storage instead of discarding it because it's not found in the DB.
  - The student is automatically routed to `/register`.
- **Database Commit & Log Seeding**:
  - Only when the student fills out their details (Name, Age, Gender, Grade) and submits the registration form, is the student record committed to the database (via a `PUT /api/students/{student_id}` request passing `teacherId` in the request body).
  - The backend creates the student record, seeds defaults (`currentLevel=1`, `riskScore=0`, `riskClass='low'`), and automatically writes the corresponding teacher activity log: `"telah melengkapi pendaftaran akun siswa"`.

---

## Python Environment
- The recommended Python version for backend services is `3.12.10`, as defined in the **[.python-version](file:///d:/dev/dyleks-new/.python-version)** file.

---

## Student Game ("Latihan Bertahap") & Handwriting Recognition Flow

- **Game Structure**: The "Latihan Bertahap" game contains 10 questions.
  - Questions 1 to 8: Multiple-choice selection using 5 vowel buttons (`A`, `I`, `U`, `E`, `O`).
  - Questions 9 and 10: Handwriting recognition questions.
- **Subcomponent Splitting**: Component interfaces and prop types are centralized in `siswa/frontend/app/types/index.ts` (e.g. `QuizQuestion`, `LandingStageProps`, `QuizStageProps`, `ChoiceQuizProps`, `HandwritingQuizProps`, `FinishStageProps`). The implementation is split into a subfolder `_components/` (e.g. `LandingStage.tsx`, `QuizStage.tsx`, `ChoiceQuiz.tsx`, `HandwritingQuiz.tsx`, and `FinishStage.tsx`) to maintain clean code and reusability.
- **Handwriting Camera & Stream Management**:
  - Live video stream from the device camera is rendered inside a `<video>` element using `getUserMedia` (rear/environment camera preferred on mobile).
  - Stream tracks must be stopped on component unmount or stream shutdown to release camera hardware.
  - **No-Retake Flow**: Clicking "Ambil & Analisis Foto" grabs the current frame using a hidden `<canvas>`, stops the camera, displays the frozen preview image, and immediately posts the image data to the backend in a single step.
- **OCR Analysis Endpoint (`POST /api/ocr/predict`)**:
  - Receives `file` (UploadFile) and optional `target` (vowel character, Form parameter).
  - Backend utilizes `microsoft/trocr-base-handwritten` for predictions, loaded lazily upon the first request to prevent slow startup times.
  - Generates text with explicit limit `max_new_tokens=5` to improve performance and prevent warnings.
  - **Graceful Fallback**: If model loading, download, or memory issues occur, it catches the exception and falls back to resolving the target vowel with a high simulated accuracy (e.g., `88.5%`) to guarantee smooth local gameplay.
- **Correctness Threshold**: The answer is marked correct if the matching accuracy score returned from the OCR endpoint is strictly **greater than 50%**.

