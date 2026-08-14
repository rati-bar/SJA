# Steve Jobs American Academy — Management Platform (Wireframes)

HTML wireframes / clickable prototype for the SJA multi-branch training academy
management platform. Built for **Etape 0 — UX/UI design** of the SOW.

> _"I don't follow, I lead — preparing our students not just to keep up with the
> future, but to shape it."_

## Structure

| File | Role | Description |
|------|------|--------|
| `index.html` | — | Landing page: role selection |
| `admin.html` | Administrator | Full platform management (all branches) |
| `manager.html` | Branch Manager | Management of a single branch (Tbilisi) |
| `trainer.html` | Trainer | Learning process management + SteveCoin |
| `student.html` | Student | Personal cabinet (assignments, SteveCoin, news) |
| `parent.html` | Parent | Child monitoring + tuition fee payment |
| `assets/sja.css` | — | Brand design system (SJA brandbook) |
| `assets/sja.js` | — | navigation / tab switching (dependency-free) |
| `assets/logo.svg` | — | SJA logo |

## Data

Demo data is taken from real Excel files (academic calendar and
exam schedule 2025/26):

- **Branches:** Tbilisi, Batumi, Kutaisi, Zugdidi, Poti, Zestaponi
- **Programs:** Robotics, Mob Application, Web Development, Minecraft, + Global Leadership (companion)
- **Learning course categories** (by age at entry, which determines course duration):
  - Genesis (6–8 yrs) — 8-year course
  - Nexus (9–11 yrs) — 6-year course
  - Quantum (12–13 yrs) — 4-year course
  - Apex (14–16 yrs) — 2-year course
- **Intakes:** every semester, named (e.g. Sigma — Spring 2025, Alpha — Fall 2025, Delta — Spring 2026). A student's program = Age Category + Intake.
- **Semesters:** I (Fall) and II (Spring) — per branch
- **Exams:** quiz · midterm · final exam · summary session

From the landing page you can navigate into each role's interface. Each
role has a side menu from which the individual screens of that role's functionality open.

## Roles & functionality covered

### 🛠️ Administrator (`admin.html`)
Dashboard · Branches (semester deadlines, escalation logic) · Student database
(registration, profile, payment status) · Trainer database · Learning groups and
lesson schedule · Enrollments/Payments and Finance (auto-matching, unallocated enrollments,
Fina integration, KPI) · Debts · Reports (templates, schedule, archive) ·
Assessments/surveys · Document storage · Notifications (SMS/Voice/Email,
Citynet, 4-stage escalation) · AI Knowledge Base · Roles and access · Settings.

### 🏢 Branch Manager (`manager.html`)
Functionality carried over from the administrator menu, limited to a **single branch**
(Tbilisi — branch-based access): Dashboard · Student registration and management ·
Trainers · Groups · Exams/academic calendar · Enrollments/Payments (view + matching of
unallocated enrollments) · Debts · Reports · Assessments · Documents · Notifications ·
AI Assistant · Profile. (Multi-branch management, role access and system settings
remain with the Administrator only.)

### Role distribution (doc. "Role distribution on the platform")

| Role | Edit | View |
|------|------|------|
| Super Administrator | Everything + new features | Everything |
| Director | Everything | Everything |
| Branch Manager | All folders of their own branch | Contracts (signature) · Other branches |
| Trainer | ClassDojo — SteveCoin | Schedules/groups/students, Teaching Materials, QA results |
| Student | Homework upload | Schedule, assignments, news, personal data |
| Parent | Tuition fee payment | Child's schedule, assignments, news, personal data |

### 🎓 Trainer (`trainer.html`)
Dashboard · My groups · Schedule · Attendance and assessment · Learning material ·
Filling out reports with deadlines · Self-assessment and received assessments · AI Assistant · Profile.

### 🧑‍💻 Student (`student.html`)
Dashboard · Schedule · My course (modules) · Scores/attendance · Payments (by card /
subscription, history, receipts) · Trainer assessment · Documents · AI help ·
Profile (password setup).

## Brand

Taken from the SJA brandbook: Savoy Blue `#4E62AA`, Yellow Green `#AACB5C`,
Hunyadi Yellow `#E5A436`, Cerise `#CF435E`, navy `#22315F`.

## Usage

Open `index.html` in a browser. These are static files — no build needed.
