# Mango HealthLab Design Specification

## Purpose

Mango HealthLab is a full-stack diagnostic booking and report-management MVP for an academic case study. It gives patients an elegant way to find tests, book a home collection or lab visit, track their sample, and retrieve a report. It gives operations staff focused tools to run the same booking lifecycle.

## Success Criteria

- A patient can register, log in, search the catalogue, choose a collection mode and available slot, make a booking, view its status, and open a generated report.
- An admin can maintain the seeded catalogue, assign a phlebotomist, progress a booking through valid states, and create a structured report.
- A phlebotomist can view assigned home collections and mark a sample collected.
- The API protects data by role, validates state transitions and slots, and persists all core data to MongoDB when configured.
- The project runs locally with clear environment configuration. PDF and SMTP services are available when configured; notification history remains visible without SMTP.

## Scope

### Included

- Application-managed email/password authentication with bcrypt and signed JWTs.
- Roles: `PATIENT`, `ADMIN`, `PHLEBOTOMIST`, and `DOCTOR`.
- Test and lab catalogue, search, filters, active/inactive state, and home collection support.
- Capacity-aware appointment slots and duplicate-booking prevention.
- Booking lifecycle: `PENDING`, `CONFIRMED`, `COLLECTION_ASSIGNED`, `SAMPLE_COLLECTED`, `PROCESSING`, `REPORT_READY`, `COMPLETED`, and eligible cancellation.
- Patient dashboard, admin operations dashboard, collection-staff view, and doctor-access placeholder/history route.
- Structured report values, flags, a generated PDF file, authenticated report download, and notification records.
- API documentation and seeded demo accounts/data.

### Deferred

- Payment, insurance, real Firebase integration, third-party lab/EHR integrations, and a native mobile app.
- Production object storage, production SMTP credentials, and Socket.io live updates. The service boundaries will support these later.
- Doctor-created orders and patient-driven doctor-access management beyond the protected read model.

## Technology Choices

- `client/`: React, Vite, React Router, Axios, Lucide icons, and CSS modules/global design tokens.
- `server/`: Node.js, Express, MongoDB/Mongoose, bcryptjs, jsonwebtoken, Zod validation, PDFKit, Nodemailer, and Jest/Supertest.
- MongoDB is optional at startup for the visual demo only; API write flows require `MONGO_URI`.
- SMTP is optional. With SMTP absent, events still create `IN_APP` notification records and return success with delivery marked skipped.

## User Experience and Visual System

### Design Intent

Mango HealthLab should feel like a friendly, premium consumer diagnostic service, not a generic clinical portal. The product begins with the booking task, rather than a marketing landing page.

### Tokens

- Background: true white (`#FFFFFF`) and pale mint operational bands (`#EDF7F3`).
- Ink: deep teal (`#103B37`); muted text: slate green (`#5B716C`).
- Primary: mango gold (`#F2B84B`), paired with a warm dark hover (`#D99A29`).
- Positive state: rich green (`#18795B`); attention: coral (`#D5664A`).
- Borders: `#D9E8E2`; radius: 8px maximum; shadows are quiet and low contrast.
- Typography: a clean sans family with assertive but not oversized headings. Controls use deliberate 14-16px text, zero letter-spacing, and consistent line height.

### Screen Inventory

1. Patient catalogue and booking workspace: brand header, search, test categories, test list, collection-mode choice, contextual booking summary, and booking drawer.
2. Booking confirmation: booking code, appointment details, clear status stage, and dashboard action.
3. Patient dashboard: active booking status, notifications, report list, and past-booking history.
4. Admin operations: sidebar shell, booking table, status progression, staff assignment, catalogue management, and report-entry form.
5. Phlebotomist collection view: assigned jobs, collection details, contact control, and mark-collected action.
6. Doctor history view: authorized-patient list, historical reports, and parameter trend display.

### Interaction Rules

- Search, category, collection mode, selected test, slot choice, and booking confirmation update local UI state immediately and persist through the API when configured.
- Booking controls remain disabled until all required information is valid. Home collection requires address and contact information; lab visit does not.
- Slots show remaining capacity. Filled or past slots cannot be submitted.
- Status transitions are rendered as a timeline and only actions permitted for the current role and state are shown.
- Empty, loading, network-error, unauthenticated, and unauthorized states are explicit and polished.
- Responsive layouts retain the booking action and key status information on mobile; operational tables collapse to readable rows rather than overflow.

## API and Data Boundaries

### Core Models

- `User`: identity, password hash, role, active flag, contact details.
- `Test`: name, category, description, price, preparation, sample type, turnaround hours, parameters, active flag.
- `Lab`: name, city, address, contact details, operating hours, home collection availability, active flag.
- `Booking`: readable booking code, patient, test items, lab, collection type, address/contact, appointment date/time, status, assigned staff, totals, lifecycle timestamps.
- `Report`: booking/patient/test references, structured results, ready status, generated PDF path, generated date.
- `Notification`: recipient, booking reference, channel, type, message, status, sent date.

### Core Endpoints

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`.
- `GET /api/tests`, `GET /api/tests/:id`, and admin test CRUD.
- `GET /api/labs`, `GET /api/labs/:id/slots`, and admin lab CRUD.
- `POST /api/bookings`, scoped `GET /api/bookings`, `GET /api/bookings/:id`, assignment, status transition, and cancellation.
- Admin report creation, scoped report list/read/download, and notifications list.
- Admin analytics and doctor history/trend routes where seeded access exists.

### Integrity Rules

- Only public registration may create a patient; privileged roles are seeded/admin-created.
- JWT verification loads the user record and checks the persisted role.
- Every booking transition is checked against the defined state machine; non-listed transitions return `400`.
- Cancellation is allowed only before collection.
- A slot must be future-dated, within lab hours, and below capacity.
- The same patient cannot create another non-cancelled booking for the same test/date/slot.
- Report downloads are constrained to the patient owner, admin, or authorized doctor.

## Error Handling

- Validation errors return `400` with field-level details.
- Expired/missing tokens return `401`; role/ownership failures return `403`; unknown resources return `404`.
- Unique-slot or duplicate booking collisions return a clear conflict response without creating partial data.
- PDF or email delivery failures are recorded, do not silently mark notification delivery successful, and leave reports downloadable when PDF generation succeeded.

## Verification

- Server tests cover registration, login, role guards, slot capacity, duplicate booking prevention, invalid transitions, cancellation, report authorization, and notification persistence.
- Client tests cover search/filter state, booking validation, successful booking feedback, cancellation affordance, and protected routes.
- Browser QA covers the patient booking journey and an admin-to-phlebotomist status update at desktop and mobile widths.
- The final UI will be visually checked against this visual system, with special attention to first viewport hierarchy, brand color use, type scale, responsive booking behavior, tables, and status timeline.

## Deliberate Assumptions

- The first delivery uses custom JWT authentication because no Firebase project configuration or SMTP credentials were supplied.
- Demo data will use fictional patients, labs, test results, and Indian Rupee pricing.
- The platform stores report metadata and generated local PDF paths; it does not store large PDFs inside MongoDB.
