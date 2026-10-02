# Mango HealthLab

Mango HealthLab is a full-stack diagnostic booking and report-management MVP built from the supplied product brief.

## Run locally

1. Start MongoDB locally.
2. Copy `.env.example` to `.env` and adjust values if needed.
3. Install dependencies from the repository root:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

4. Seed the database:

```bash
npm run seed
```

5. Start the API and client together:

```bash
npm run dev
```

The API runs at `http://localhost:4000` and the client runs at `http://localhost:5173`.

## Demo accounts

All seeded demo accounts use password `Mango@123`.

- Patient: `patient@mangohealthlab.test`
- Admin: `admin@mangohealthlab.test`
- Phlebotomist: `staff@mangohealthlab.test`
- Doctor: `doctor@mangohealthlab.test`

## Implemented API areas

- Auth: registration, login, current user, bcrypt password hashing, JWT and role middleware.
- Catalogue: tests, search/category filtering, labs, soft deactivation and slot availability.
- Bookings: home/lab collection, capacity checks, duplicate prevention, server-generated booking codes, lifecycle transitions, cancellation and assignment.
- Reports: structured results, automatic flags, PDFKit generation, authenticated downloads and report-ready lifecycle update.
- Notifications: in-app history and optional Nodemailer delivery when SMTP variables are configured.
- Analytics: admin overview route.

## Verification

```bash
npm test
npm run build --prefix client
```

MongoDB is required for API writes. SMTP is optional; without SMTP, notification events are retained as in-app records with `SKIPPED` delivery status.
