# Steve Jobs American Academy (SJA) — Product Specification

> Build blueprint for the SJA management platform. This document is the single
> source of truth for starting product development. The clickable HTML
> wireframes in this repo (`index.html`, `admin.html`, `manager.html`,
> `trainer.html`, `student.html`, `parent.html`) are the visual reference; the
> PostgreSQL data model is in **`SJA_ER_Model.xlsx`**. When in doubt about a
> screen's layout or wording, open the corresponding wireframe.

---

## 1. Product overview

SJA is a multi-branch technology academy for children and teenagers (ages
6–16). The platform manages the full lifecycle: enrolment, grouping, the
curriculum, scheduling, lesson delivery, attendance, exams, homework, rewards,
finance, and communication — across five distinct user interfaces.

- **Language:** the system is **English-only**.
- **Database:** **PostgreSQL** (15+).
- **Branches:** Tbilisi, Batumi, Kutaisi, Zugdidi, Poti, Zestaponi (extensible).
- **Currency:** GEL (`₾`).

### 1.1 The five interfaces

| Interface | File | Audience | Scope |
|---|---|---|---|
| **Administrator** | `admin.html` | HQ admins | All branches, all data, system settings, access control |
| **Branch Manager** | `manager.html` | Branch staff | A single branch (wireframe = Tbilisi) |
| **Trainer** | `trainer.html` | Teaching staff | Their own lessons |
| **Student** | `student.html` | Enrolled children | Their own programs |
| **Parent** | `parent.html` | Guardians | Their child(ren) |

`index.html` is the landing / role-selection page.

---

## 2. Core domain concepts

Read this section first — every module depends on these definitions.

### 2.1 Age Category (course tier)

A student's tier is fixed by their **entry age** and drives the total course
length. Categories are reference data.

| Category | Entry age | Duration | Semesters |
|---|---|---|---|
| **Genesis** | 6–8 | 8 years | 16 |
| **Nexus** | 9–11 | 6 years | 12 |
| **Quantum** | 12–13 | 4 years | 8 |
| **Apex** | 14–16 | 2 years | 4 |

(2 semesters per academic year.)

### 2.2 Intake

A named, twice-yearly enrolment wave: **Sigma**, **Alpha**, **Delta**, … Each
intake has a season (spring/autumn) and a year.

### 2.3 Program

A student's **program = Age Category + Intake**. There is **no separate
"program"/discipline entity** grouping modules — the discipline (Robotics, Web
Development, etc.) is simply part of a module's name. It appears only as a
descriptive label on trainers (`specialization`) and projects (`track`).

### 2.4 Semester

Branch-scoped academic semester with start/end dates and a payment-due day.
Managed under **Settings**.

### 2.5 Module Template vs Module (important)

- **Module Template** = the *master* curriculum for one age category (e.g.
  "Robotics → Programming" for Nexus). Created and edited under the **Module
  Templates** menu. The number of semesters is **predefined by the age
  category** and cannot be changed. A template holds the ordered lectures and
  attached materials per semester.
- **Module** = a concrete **instantiation** of a template for one
  **Intake + Age Category** (e.g. "Alpha · Nexus · Robotics → Programming").
  Created under the **Learning Modules** menu by *picking an existing template*
  — never from scratch. On instantiation, the template's lectures and materials
  are copied and become independently editable for that intake-category (the
  template is not affected).

```
Module Templates ──(instantiate)──▶ Learning Modules ──(feeds)──▶ Schedule/Lessons
   (master, per                        (per intake +                 (per group)
    age category)                       age category)
```

### 2.6 Lecture

A row inside a module/template semester. Fields: title, sequence #, type
(training / midterm / final), duration, description, materials. In an
instantiated module each lecture additionally carries a **conducted** flag
(`is_conducted` + `conducted_on`) that a **Branch Manager / Admin** sets. The
**module progress bar = conducted lectures ÷ total lectures** (a derived
aggregate — it is *not* a per-student value and is not stored).

### 2.7 Learning materials

Files or links attached to a lecture (syllabus, lesson plan, homework, exam
material, presentation, video, link). **Video materials are download-only — no
in-browser streaming.**

### 2.8 Group (study group)

A cohort. Identity = **group number** (e.g. `#4_Genesis`). A group's program is
determined by **Intake + Age Category**; it is bound to that category's module.
Groups advance one semester at a time (closing a semester moves the group on).
Students are added/removed via membership; removal routes to Waiting list,
Withdrawal (date + reason), Graduated, or another group.

### 2.9 Student statuses & Alumni

- **Statuses:** `Active`, `Waiting list`, `Suspended`, `Graduated`.
- **Alumni** is *not* a status — it's a completion marker recording the **last
  completed age category + year**. Alumni recognition is granted **once every 2
  years**.
- Students are **synced from an external system** (not created in the UI). The
  **Personal ID (national ID) is the login username** for every user type.

### 2.10 SteveCoin

The reward currency. Trainers award coins per lesson (and as homework-review
bonuses). It's an append-only ledger (`stevecoin_transaction`).

---

## 3. Access control (RBAC)

Authorization is **group-based**. Managed by the Admin under **Users & Groups**.

- Every user belongs to **one user group**. Menu access and CRUD rights are
  defined **per group** and inherited by members.
- **System groups (locked) — each with its own dedicated interface:**
  `Students` (`student.html`), `Parents` (`parent.html`), `Trainers`
  (`trainer.html`), `Branch Manager` (`manager.html`). They carry the special
  interfaces and core logic — they cannot be renamed or deleted, and their
  permissions are fixed/read-only.
- **Custom groups (unlimited):** Super Admin, Administrator, Finance,
  Backoffice, and any group the admin creates. **Every custom group runs on the
  Administrator interface (`admin.html`)**, restricted by its permissions — for
  each, toggle **menu access** (per menu) and **CRUD permissions** (per
  resource: View / Create / Update / Delete). There is no separate interface per
  custom group; permissions alone shape what its members see and can do.

Data-model tables: `user_group`, `group_menu_permission`,
`group_resource_permission`, and `app_user.group_id`. See the ER workbook.

---

## 4. Interfaces & modules

Menus marked **[Coming soon]** are intentionally stubbed in the wireframes —
build the shell/nav but no functionality yet.

### 4.1 Administrator (`admin.html`)

**Organization**
- **Branches** — list + detail; add branch (name, manager, address, payment-due
  day). Semesters are *not* set here (see Settings).
- **Students** — full grid with status tabs (Active / Waiting list / Suspended /
  Graduated), filters (status, branch, age category, year, alumni, intake), and
  an **Intake** column. Alumni column shows last completed category · year
  (note: granted every 2 years). Student profile is full-width with tabs:
  **Overview** (all fields; status-specific fields for Suspended/Waiting list),
  **Progress** (projects first, then attendance by module; button to History),
  **History** (groups, closed semesters, modules, scores, SteveCoin),
  **Files**. Status changes via a modal (4 statuses incl. Graduated w/ date).
- **Trainers** — trimmed grid → trainer detail showing **work start date**,
  **total lecture hours** and **this-month hours**, qualification, specialization,
  and work schedule.
- **Groups** — cards (group number, category + intake badges, module link,
  progress); create group (branch, number, category, intake — program auto-set);
  group detail with student list + contacts and 3-way remove
  (Waiting list / Withdrawal / other group) + Graduated.
- **Learning Modules** — pick **Intake → Age Category → module list**; add a
  module by **instantiating a template** (no from-scratch). Module detail = flat
  semester slots (count fixed by category) with lectures; every lecture has an
  **edit** action (full Edit Lecture modal: all fields + attached files) and a
  **conducted** marker; **Export to Excel**.
- **Module Templates** — age-category cards → per-category **module list** →
  **New module** (master template; semesters predefined by category) → template
  detail (all semesters, lectures, materials; per-lecture edit; **Export to
  Excel**). *This is where new modules are created.*
- **Schedule** — monthly weekend drag-and-drop builder; dropping a lecture into a
  slot prompts to assign a lecturer.
- **Exams** — calendar/overview.
- **Projects** — competitions/demo days; link students with a result → coins.

**Finance**
- **Payments** — **[Coming soon]**
- **Debts** — **[Coming soon]**

**Documents**
- **Reports** — **[Coming soon]**
- **Evaluations** — **[Coming soon]**
- **Documents** — **[Coming soon]**

**Communication**
- **Notifications** — **[Coming soon]**
- **AI / Knowledge Base** — **[Coming soon]**

**System**
- **Users & Groups** — Users tab (users + their group + change group) and Groups
  tab (system + custom groups); group detail with member list, menu-access
  checkboxes and the CRUD permission matrix. Add user assigns a group; Personal
  ID required (= login).
- **Settings** — course categories (reference cards) and **semesters/intakes**
  (add with name + start/end dates).

There is **no dashboard/home** for Admin (default view = Branches).

### 4.2 Branch Manager (`manager.html`)

Mirror of the Admin, **scoped to one branch** (wireframe = Tbilisi). Differences:
- Users: can add only **Students** and **Parents** (auto-linked to the branch);
  groups/permissions are admin-managed.
- Same Learning Modules / Module Templates behaviour; can mark lectures conducted.
- Same trainer detail (start date + hours).
- Payments, Debts, Reports, Evaluations, Documents, Notifications, AI —
  **[Coming soon]**.
- No dashboard (default view = Students).

### 4.3 Trainer (`trainer.html`)

- **Lessons** (default) — grid of the trainer's lectures across groups; each row
  opens a **Lesson detail** page with tabs:
  1. **Learning materials** — view/download (videos download-only).
  2. **Attendance & SteveCoin** — mark present/absent per student + award coins.
  3. **Upload homework** — create the lecture's homework (title, due date,
     description, attachment) and publish it to students.
  4. **Submitted homework** — review submissions (download), grade, give
     feedback (+ optional SteveCoin), see overdue.
- **Reports** — **[Coming soon]**
- **AI Assistant / Knowledge Base** — **[Coming soon]**
- **Profile** — personal details, qualification/bio. (Trainers are **not** bound
  to groups or modules; their schedule is set when they're assigned as lecturer
  in the Schedule builder.)

### 4.4 Student (`student.html`)

- **Dashboard** — KPIs (active programs, attendance, SteveCoin, assignments due),
  today's schedule, my programs.
- **Schedule** — weekly/monthly classes (day, time, program/topic, trainer).
- **My Program** — program cards → program detail with tabs: overview, progress,
  materials (per lecture; **videos download-only**), homework (per lecture),
  exams/scores. (No "trainer evaluation" tab.)
- **SteveCoin** — balance & history.
- **Profile**.

### 4.5 Parent (`parent.html`)

- **Dashboard**, **Schedule** (child's, read-only).
- **Child's Data** — all fields, read-only.
- **My Program** — child's materials/homework per lecture (read-only; videos
  download-only).
- **Subscription** — the parent activates the subscription (this is the only
  active finance action for parents; one-time payment removed).
- **Profile** — read-only; the parent can change only their password. Parents
  cannot edit their own data (managed by branch manager/admin).

---

## 5. Cross-cutting business rules

1. **Login username = Personal ID** for every user, all roles.
2. **Students are synced** from an external system; the UI does not create them.
   A login is activated later (sets `app_user`).
3. **Program = Age Category + Intake.** Age category is fixed by entry age.
4. **Module semesters are fixed by the age category** (16/12/8/4) — never edited.
5. **New modules are created only as templates** (Module Templates); Learning
   Modules only *instantiate* them per intake.
6. **A lecture is marked "conducted" by Branch Manager/Admin**; module progress =
   conducted ÷ total lectures.
7. **Video materials are download-only.**
8. **Alumni** = last completed category + year, granted every 2 years; it is not
   a status.
9. **Authorization is per user group**; Students/Parents/Trainers are locked
   system groups.
10. **Trainers are not bound to groups/modules**; they are assigned per lesson in
    the Schedule.

---

## 6. Data model

Full schema: **`SJA_ER_Model.xlsx`** (PostgreSQL). 30 base tables, no views.
Sheets: Overview, Entities, Attributes (every column: type, PK/FK, nullability,
notes), Relationships (all FKs + M:N resolutions), CRUD Matrix, Enums.

Conventions:
- Every table has `id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY`.
- FKs are `*_id` columns referencing `<table>(id)`.
- Enumerations are PostgreSQL `ENUM` types (see the Enums sheet).

Entity groups:
- **People & Org:** `branch`, `app_user`, `user_group`,
  `group_menu_permission`, `group_resource_permission`, `student`, `parent`,
  `student_parent`, `trainer`, `staff_member`.
- **Academic:** `age_category`, `intake`, `semester`, `study_group`,
  `group_membership`, `module_template`, `template_lecture`, `module`,
  `module_lecture`, `lecture_material`.
- **Delivery:** `lesson`, `attendance`, `exam`, `exam_result`, `homework`,
  `homework_submission`.
- **Rewards:** `stevecoin_transaction`, `project`, `project_participation`.
- **Finance (active):** `subscription`.

> Entities for the **[Coming soon]** menus (payments, debts, reports,
> evaluations, documents, notifications, AI/knowledge base) are intentionally
> **not** in the model yet — add them when those modules are built.

---

## 7. Suggested tech approach

The wireframes are dependency-free static HTML/CSS/JS (`assets/sja.css`,
`assets/sja.js`) and define the visual system (brand tokens, components,
view/tab/modal switching). Recommended for the real product:

- **DB:** PostgreSQL 15+ (per the ER model).
- **Backend:** any modern framework (Node/NestJS, Django, Rails, .NET…). Must
  enforce the per-group menu + CRUD permissions server-side.
- **Frontend:** an SPA (React/Vue/Svelte) or server-rendered app that reproduces
  the wireframe layouts and component system. Reuse the design tokens from
  `assets/sja.css` (colors: savoy `#4E62AA`, green `#AACB5C`, yellow `#E5A436`,
  cerise `#CF435E`, navy `#22315F`).
- **Auth:** username = Personal ID + password; group-based authorization.
- **Integrations (later):** external **student sync**; **Fina** for payments;
  **Citynet** (SMS/voice/email) for notifications.

### Brand design system (from `assets/sja.css`)
Badges: `b-ok`, `b-warn`, `b-info`, `b-muted`, `b-danger`. Grids: `g-2`, `g-3`,
`g-4`, `g-1-2`, `g-2-1`. Primitives: `.kpi`, `.card/.pad`, `.hist-block`,
`.train-row`, `.modal-overlay/.modal`, `.add-tile`, `.coming-soon`, `.tbl`.

---

## 8. Suggested build order

1. **Foundations** — PostgreSQL schema from `SJA_ER_Model.xlsx`; auth
   (Personal ID login); RBAC (`user_group` + permission tables) with the three
   locked system groups seeded.
2. **Org & people** — branches; student sync; students grid + profile; parents;
   trainers; staff; Users & Groups admin.
3. **Academic core** — age categories, intakes, semesters; **Module Templates**
   (create/edit master modules per category) → **Learning Modules**
   (instantiate); lectures + materials (download-only video); Excel export.
4. **Groups** — create/advance; membership + remove flows; group detail.
5. **Scheduling & delivery** — Schedule builder + lecturer assignment; Trainer
   Lessons + Lesson detail (materials, attendance + SteveCoin, homework upload,
   submission review); mark-conducted → module progress.
6. **Assessment & rewards** — exams + results; homework; SteveCoin ledger;
   projects.
7. **Student & Parent portals** — dashboards, schedule, My Program, SteveCoin,
   subscription, read-only profiles.
8. **Later / [Coming soon]** — Payments + Fina, Debts, Reports, Evaluations,
   Documents, Notifications + Citynet, AI/Knowledge Base.

---

## 9. Reference files

| File | Purpose |
|---|---|
| `index.html` | Landing / role selection |
| `admin.html` | Administrator interface wireframe |
| `manager.html` | Branch Manager interface wireframe |
| `trainer.html` | Trainer interface wireframe |
| `student.html` | Student interface wireframe |
| `parent.html` | Parent interface wireframe |
| `assets/sja.css` | Design system (tokens + components) |
| `assets/sja.js` | View/tab/modal switching, drag-and-drop |
| `SJA_ER_Model.xlsx` | PostgreSQL data model (authoritative) |
| `README.md` | Wireframe overview |
| `PRODUCT_SPEC.md` | This document |

> The wireframes are Stage-0 UX/UI mockups: layouts, flows and copy are
> intentional; sample data is illustrative.
