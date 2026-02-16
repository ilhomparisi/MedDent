# MongoDB migration – feedback form & superadmin

## Will the feedback (consultation form) work?

**Yes.** The current flow is:

1. **Public submit** – `ConsultationFormModal` sends a POST to the database with: `full_name`, `phone`, `lives_in_tashkent`, `last_dentist_visit`, `current_problems`, `previous_clinic_experience`, `missing_teeth`, `preferred_call_time`, `source`, `time_spent_seconds`. In Supabase, anonymous users are allowed to **insert** into `consultation_forms` (RLS policy).

2. **Admin view/update** – CRM/Form Submissions and dashboard read and update submissions; that is restricted to **authenticated** users.

To keep the same behavior with MongoDB:

- The backend must expose **one public (no auth) endpoint** for form submission, for example:
  - `POST /api/consultation-forms`  
  - Body: same fields as above (snake_case or camelCase, depending on your API).  
  - Backend inserts into the `consultation_forms` collection.

- All other consultation-form operations (list, filter, update `lead_status`, `notes`) should go through **protected** endpoints (e.g. `GET /api/consultation-forms`, `PATCH /api/consultation-forms/:id`) that require admin (or CRM) authentication.

As long as you implement that public `POST` and the frontend calls it instead of Supabase, the feedback form will work as expected: visitors can submit without logging in; only admins can see and edit submissions.

---

## Superadmin credentials

### Current setup (Supabase)

- Admin panel login uses **Supabase Auth** (`signInWithPassword`). There are no credentials in the repo.
- The “superadmin” is whichever user you created in the Supabase Dashboard (Authentication → Users). So **today**, superadmin = that Supabase user’s email and password.

### After migrating to MongoDB

- Supabase Auth is removed. Admin identity must live in your backend (e.g. MongoDB).
- **Superadmin credentials** should be defined in two places:

1. **Backend `.env` (for seeding)**  
   Use variables so the first admin is created by your seed script with known credentials, for example:

   ```env
   # Optional: override default superadmin created by seed (recommended: change after first login)
   ADMIN_SEED_EMAIL=admin@meddent.uz
   ADMIN_SEED_PASSWORD=Admin123!
   ```

2. **Seed script**  
   When the database is empty (or when you run “seed if empty”):

   - Ensure an `admin_users` (or similar) collection exists.
   - Insert **one** superadmin document, for example:
     - `email`: value from `ADMIN_SEED_EMAIL` or default `admin@meddent.uz`
     - `password`: **hashed** value of `ADMIN_SEED_PASSWORD` (e.g. bcrypt), never store plain text.

So, **after migration**, the superadmin credentials are:

- **Email:** `admin@meddent.uz` (or whatever you set in `ADMIN_SEED_EMAIL`).
- **Password:** `Admin123!` (or whatever you set in `ADMIN_SEED_PASSWORD`).

**Important:** Change this default password after first login, or set strong values in `.env` and do not commit `.env`.

---

## Summary

| Concern | Answer |
|--------|--------|
| Will the feedback/consultation form still work? | Yes, if the backend exposes a **public** `POST /api/consultation-forms` and the frontend uses it; list/update stay behind auth. |
| What are the superadmin credentials? | **Now:** the Supabase Auth user you created in the dashboard. **After migration:** the user created by seed, e.g. `admin@meddent.uz` / `Admin123!`, configurable via `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD` in backend `.env`. |
