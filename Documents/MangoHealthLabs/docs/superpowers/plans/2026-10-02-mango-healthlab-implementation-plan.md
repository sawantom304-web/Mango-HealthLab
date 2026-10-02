# Mango HealthLab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Mango HealthLab full-stack academic MVP with a real Express/MongoDB backend, role-based workflows, report delivery, and a responsive React booking experience.

**Architecture:** A single repository contains `server/` and `client/`. Express routes are thin and delegate to controllers/services; Mongoose models own persistence; Zod schemas validate request data; JWT middleware loads the persisted user before role and ownership checks. React Router provides protected role views, a centralized Axios client talks to `/api`, and shared UI primitives implement the approved Mango HealthLab design system.

**Tech Stack:** Node.js, Express, MongoDB, Mongoose, bcryptjs, jsonwebtoken, Zod, PDFKit, Nodemailer, Jest, Supertest, React, Vite, React Router, Axios, Lucide React, and CSS.

**Spec:** `docs/superpowers/specs/2026-10-02-mango-healthlab-design.md`

## Global Constraints

- Product name is `Mango HealthLab`.
- The backend uses MongoDB through `process.env.MONGO_URI`, defaulting in `.env.example` to `mongodb://localhost:27017/healthlab`.
- Public registration can only create `PATIENT` users; privileged roles come from seed/admin flows.
- Success and error responses use `{ success, message, data, errors }` consistently.
- Core booking transitions, slot capacity, duplicate prevention, ownership, and role checks are enforced server-side.
- `.env` is ignored and `.env.example` documents required configuration.
- UI colors are `#FFFFFF`, `#EDF7F3`, `#103B37`, `#5B716C`, `#F2B84B`, `#D99A29`, `#18795B`, `#D5664A`, and `#D9E8E2`; maximum radius is 8px.
- Do not use Orange Health Labs branding, assets, code, or copy.

## Review Focus

- Duplicate booking races: a second non-cancelled booking for the same patient/test/date/slot returns `409` without partial data; pin in booking integration tests.
- Invalid lifecycle transitions: only the defined role/state transitions succeed and all other transitions return `400`; pin in booking service tests.
- Unauthorized report downloads: non-owner patients and doctors without seeded access return `403`; pin in report authorization tests.
- Missing MongoDB or SMTP: startup reports the database failure clearly, while SMTP absence records an in-app notification without claiming an email was sent; pin in config/notification tests.
- Responsive booking validation: mobile booking keeps required fields and prevents confirmation until the correct home-collection fields exist; pin in client interaction tests and browser QA.

---

### Task 1: Repository and Runtime Scaffold

**Files:**
- Create: `package.json`, `.gitignore`, `.env.example`, `README.md`
- Create: `server/package.json`, `server/src/app.js`, `server/src/server.js`, `server/src/config/env.js`, `server/src/config/db.js`, `server/src/routes/health.routes.js`
- Create: `client/package.json`, `client/index.html`, `client/vite.config.js`, `client/src/main.jsx`
- Test: `server/src/routes/health.routes.test.js`

**Interfaces:**
- Produces `GET /api/health` with `{ success: true, message: "Mango HealthLab API is healthy", data: { database } }`.
- Produces root scripts `npm run dev`, `npm run seed`, and `npm test`.

- [ ] **Step 1: Write the health endpoint test** expecting `200`, a success envelope, and a database state field.
- [ ] **Step 2: Run the focused test and verify it fails because the app does not exist.**
- [ ] **Step 3: Implement the root/server/client package scripts, environment loader, Express app, health route, JSON error envelope, and Mongo connection module.** The connection module must log `MongoDB connected successfully` on success and emit a clear error before exit on startup failure.
- [ ] **Step 4: Run `npm test -- --runInBand` and `npm run build` inside `client/`; verify the health test passes and the client builds.
- [ ] **Step 5: Commit the scaffold.**

### Task 2: Authentication, Users, and Authorization

**Files:**
- Create: `server/src/models/User.js`, `server/src/middleware/authMiddleware.js`, `server/src/middleware/requireRole.js`, `server/src/middleware/errorHandler.js`
- Create: `server/src/validators/auth.schemas.js`, `server/src/controllers/auth.controller.js`, `server/src/routes/auth.routes.js`, `server/src/services/auth.service.js`, `server/src/utils/jwt.js`, `server/src/utils/password.js`
- Create: `server/src/scripts/seed.js`, `server/src/scripts/seedData.js`
- Test: `server/src/controllers/auth.controller.test.js`, `server/src/middleware/authMiddleware.test.js`

**Interfaces:**
- `POST /api/auth/register`, `POST /api/auth/login`, and `GET /api/auth/me`.
- `requireAuth(req, res, next)` attaches the active Mongoose user to `req.user`.
- `requireRole(...roles)` rejects authenticated users whose persisted role is not allowed.

- [ ] **Step 1: Write tests for patient-only registration, password hashing, login JWT claims, inactive-user rejection, invalid token rejection, and role rejection.**
- [ ] **Step 2: Run the focused tests and verify they fail.**
- [ ] **Step 3: Implement the User schema, bcrypt password helpers, JWT helpers, Zod auth schemas, controllers, middleware, and seed users for all four roles.** API responses must never include `passwordHash`.
- [ ] **Step 4: Run auth tests and verify all pass.**
- [ ] **Step 5: Run `npm run seed` against a local MongoDB and verify the script prints the seeded demo accounts without exposing password hashes.**
- [ ] **Step 6: Commit authentication.**

### Task 3: Catalogue, Labs, and Slot Availability

**Files:**
- Create: `server/src/models/Test.js`, `server/src/models/Lab.js`
- Create: `server/src/validators/catalogue.schemas.js`, `server/src/controllers/test.controller.js`, `server/src/controllers/lab.controller.js`, `server/src/routes/test.routes.js`, `server/src/routes/lab.routes.js`
- Modify: `server/src/scripts/seedData.js`
- Test: `server/src/controllers/test.controller.test.js`, `server/src/controllers/lab.controller.test.js`, `server/src/services/slot.service.test.js`

**Interfaces:**
- Public catalogue and lab routes plus admin CRUD.
- `GET /api/labs/:id/slots?date=YYYY-MM-DD&collectionType=HOME|LAB` returns slot capacity, booked count, and remaining count.
- `slotService.getAvailableSlots({ labId, date, collectionType })` returns future, operating-hour slots.

- [ ] **Step 1: Write tests for test search/category filters, soft deletion, lab city filtering, invalid ObjectIds, and slot capacity calculation.**
- [ ] **Step 2: Run focused tests and verify they fail.**
- [ ] **Step 3: Implement Test and Lab models, catalogue controllers/routes, Zod validation, slot service, and admin guards.** Seed at least ten diagnostic tests and three fictional labs in Indian cities with INR pricing.
- [ ] **Step 4: Run focused tests and verify they pass.**
- [ ] **Step 5: Run `npm run seed` and verify the seeded catalogue can be listed through the API.**
- [ ] **Step 6: Commit catalogue and slots.**

### Task 4: Bookings and Lifecycle State Machine

**Files:**
- Create: `server/src/models/Booking.js`, `server/src/utils/bookingCode.js`, `server/src/services/booking.service.js`, `server/src/services/bookingState.service.js`
- Create: `server/src/validators/booking.schemas.js`, `server/src/controllers/booking.controller.js`, `server/src/routes/booking.routes.js`
- Modify: `server/src/services/slot.service.js`, `server/src/app.js`
- Test: `server/src/services/booking.service.test.js`, `server/src/controllers/booking.controller.test.js`

**Interfaces:**
- `POST /api/bookings`, scoped `GET /api/bookings`, `GET /api/bookings/:id`, `PUT /api/bookings/:id/status`, `PUT /api/bookings/:id/assign`, and `DELETE /api/bookings/:id`.
- `bookingService.createBooking(input, actor)` validates date, slot, collection fields, duplicate rule, server-side prices, and returns a backend-generated code like `MLH-20261002-4821`.
- `bookingStateService.transition({ booking, nextStatus, actor })` enforces the lifecycle and role rules.

- [ ] **Step 1: Write failing tests for booking creation, home-vs-lab required fields, backend-generated code, capacity conflict, duplicate conflict, ownership scoping, cancellation, assignment, and every invalid transition.**
- [ ] **Step 2: Run focused tests and verify they fail.**
- [ ] **Step 3: Implement schema indexes, booking code generation, slot reservation checks, booking service/controller/routes, and lifecycle transition rules.** Store test snapshots/prices on booking items so later catalogue edits cannot change historical totals.
- [ ] **Step 4: Run focused tests and verify they pass.**
- [ ] **Step 5: Run an API smoke test from register through booking creation and confirm the response code is not frontend-generated.**
- [ ] **Step 6: Commit bookings.**

### Task 5: Reports, PDFs, and Notifications

**Files:**
- Create: `server/src/models/Report.js`, `server/src/models/Notification.js`
- Create: `server/src/services/report.service.js`, `server/src/services/pdf.service.js`, `server/src/services/notification.service.js`, `server/src/services/email.service.js`
- Create: `server/src/validators/report.schemas.js`, `server/src/controllers/report.controller.js`, `server/src/controllers/notification.controller.js`, `server/src/routes/report.routes.js`, `server/src/routes/notification.routes.js`
- Test: `server/src/services/report.service.test.js`, `server/src/services/notification.service.test.js`, `server/src/controllers/report.controller.test.js`

**Interfaces:**
- Admin report creation and generation; owner/admin/authorized-doctor report reads and downloads; authenticated notification list.
- `reportService.createReport(input, actor)` computes LOW/NORMAL/HIGH flags, generates PDF metadata, and transitions the booking to `REPORT_READY` only after the report is valid.
- `notificationService.recordAndDeliver(event)` stores an in-app record and uses Nodemailer only when SMTP configuration exists.

- [ ] **Step 1: Write tests for structured result flags, PDF path creation, authenticated download authorization, notification persistence, and SMTP fallback status.**
- [ ] **Step 2: Run focused tests and verify they fail.**
- [ ] **Step 3: Implement report/notification models, PDFKit generation, safe file resolution, Nodemailer adapter, event notifications, routes, and authorization checks.**
- [ ] **Step 4: Run focused tests and verify they pass.**
- [ ] **Step 5: Generate a seeded demo report and verify the authenticated download returns a PDF content type.**
- [ ] **Step 6: Commit reports and notifications.**

### Task 6: React Client Foundation and Patient Catalogue

**Files:**
- Create: `client/src/api/axios.js`, `client/src/api/*.js`, `client/src/context/AuthContext.jsx`, `client/src/routes/AppRoutes.jsx`
- Create: `client/src/components/ui/*.jsx`, `client/src/components/layout/*.jsx`, `client/src/pages/auth/*.jsx`, `client/src/pages/patient/CataloguePage.jsx`, `client/src/pages/patient/TestDetailPage.jsx`
- Create: `client/src/data/*.js`, `client/src/styles/tokens.css`, `client/src/styles/global.css`
- Test: `client/src/pages/patient/CataloguePage.test.jsx`, `client/src/context/AuthContext.test.jsx`

**Interfaces:**
- Axios client attaches the stored JWT and normalizes `401`, `403`, `404`, and `500` errors.
- Auth context restores the session through `/api/auth/me`, exposes `user`, `login`, `register`, and `logout`.

- [ ] **Step 1: Write client tests for catalogue filtering, protected route redirects, token restoration, and logout.**
- [ ] **Step 2: Run focused tests and verify they fail.**
- [ ] **Step 3: Implement the Vite React shell, auth screens, route guards, shared buttons/inputs/panels/status components, and the approved Mango HealthLab design tokens.**
- [ ] **Step 4: Implement catalogue search/filter, test detail, preparation/sample/TAT display, lab list, and a responsive booking entry point.**
- [ ] **Step 5: Run client tests and `npm run build`; verify they pass.**
- [ ] **Step 6: Commit the client foundation.**

### Task 7: Patient Booking Workspace and Dashboard

**Files:**
- Create: `client/src/pages/patient/BookingPage.jsx`, `client/src/pages/patient/BookingConfirmationPage.jsx`, `client/src/pages/patient/PatientDashboardPage.jsx`
- Create: `client/src/components/booking/*.jsx`, `client/src/components/status/StatusTimeline.jsx`
- Modify: `client/src/api/*.js`, `client/src/routes/AppRoutes.jsx`
- Test: `client/src/components/booking/BookingFlow.test.jsx`, `client/src/pages/patient/PatientDashboardPage.test.jsx`

**Interfaces:**
- Booking UI submits only through `POST /api/bookings` and renders the returned booking code/status.
- Dashboard uses booking, report, and notification API modules rather than local-only core state.

- [ ] **Step 1: Write tests for each booking step, home-collection validation, disabled confirmation, API success confirmation, cancellation visibility, and report-download visibility.**
- [ ] **Step 2: Run focused tests and verify they fail.**
- [ ] **Step 3: Implement the multi-step booking workspace, future slot selection, review summary, confirmation view, status timeline, notifications, reports, and booking history.**
- [ ] **Step 4: Run client tests and verify they pass.**
- [ ] **Step 5: Verify the flow manually at desktop and mobile widths against a running API and MongoDB.**
- [ ] **Step 6: Commit the patient experience.**

### Task 8: Admin, Phlebotomist, and Doctor Workspaces

**Files:**
- Create: `client/src/pages/admin/AdminDashboardPage.jsx`, `client/src/pages/admin/TestManagementPage.jsx`, `client/src/pages/admin/BookingOperationsPage.jsx`, `client/src/pages/admin/ReportEntryPage.jsx`
- Create: `client/src/pages/staff/PhlebotomistDashboardPage.jsx`, `client/src/pages/doctor/DoctorHistoryPage.jsx`
- Create: `client/src/components/operations/*.jsx`, `client/src/components/reports/*.jsx`, `client/src/components/trends/*.jsx`
- Modify: `client/src/routes/AppRoutes.jsx`, `server/src/controllers/*.js`, `server/src/routes/*.js`
- Test: `client/src/pages/admin/AdminDashboardPage.test.jsx`, `client/src/pages/staff/PhlebotomistDashboardPage.test.jsx`, `client/src/pages/doctor/DoctorHistoryPage.test.jsx`

**Interfaces:**
- Role-specific routes are protected by the current user role and call the real server transitions.
- Admin can update status, assign staff, CRUD tests/labs, and create reports.
- Phlebotomist can see assigned home jobs and call the sample-collected transition.
- Doctor can read seeded authorized history and trends only.

- [ ] **Step 1: Write client tests for role redirects, admin assignment/status controls, phlebotomist collection action, and doctor authorization/empty states.**
- [ ] **Step 2: Run focused tests and verify they fail.**
- [ ] **Step 3: Implement operational shells, responsive table-to-row behavior, report entry, structured result fields, history/trend views, and the supporting API calls.**
- [ ] **Step 4: Run client tests and verify they pass.**
- [ ] **Step 5: Smoke-test the admin-to-phlebotomist-to-report lifecycle against the real API.**
- [ ] **Step 6: Commit role workspaces.**

### Task 9: Analytics, API Documentation, and Seeded Demo Data

**Files:**
- Create: `server/src/controllers/analytics.controller.js`, `server/src/routes/analytics.routes.js`, `server/src/docs/openapi.yaml`
- Modify: `server/src/scripts/seedData.js`, `README.md`, `server/src/app.js`
- Test: `server/src/controllers/analytics.controller.test.js`

**Interfaces:**
- Admin-only volume and average-TAT endpoints.
- OpenAPI/Postman documentation describes auth, catalogue, slots, bookings, reports, notifications, and analytics.

- [ ] **Step 1: Write analytics tests for test volume and average turnaround time with date filters and admin-only access.**
- [ ] **Step 2: Run focused tests and verify they fail.**
- [ ] **Step 3: Implement aggregation services/routes, seed realistic demo reports, and write OpenAPI documentation.**
- [ ] **Step 4: Run focused tests and verify they pass.**
- [ ] **Step 5: Verify `npm run seed` creates at least four demo users, ten tests, three labs, and realistic report data.**
- [ ] **Step 6: Commit documentation and analytics.**

### Task 10: End-to-End Verification and Handoff

**Files:**
- Create: `tests/e2e/booking-flow.spec.js` if browser tooling is available
- Modify: `README.md`, `client/src/styles/*.css`, and any files identified by QA

- [ ] **Step 1: Run all server tests, client tests, and production builds.**
- [ ] **Step 2: Start MongoDB, API, and Vite dev servers; verify the health endpoint and browser loads.**
- [ ] **Step 3: Exercise patient register/login, catalogue search, home booking, cancellation, report view/download, and admin/staff status progression at desktop and mobile widths.**
- [ ] **Step 4: Fix any visual or interaction defects found in browser QA, including overflow, inaccessible controls, missing loading/error states, and typography drift.**
- [ ] **Step 5: Verify no `.env` or generated report credentials are tracked, then run `git status --short` and inspect the final diff.**
- [ ] **Step 6: Commit final QA fixes and update README with commands, demo accounts, environment variables, API summary, tests run, and any credential-dependent limitations.**

## Coverage Check

The plan covers the requested phases: architecture/health, auth/roles, catalogue/labs, slots/bookings, patient UI, admin/staff UI, reports/PDF, notifications, doctor/trends/analytics, tests, docs, seed data, and responsive QA. The only deferred items are explicitly listed in the spec: payments, real Firebase, external storage, and production integrations.

