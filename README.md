

## **Local Setup Guide for Buyer Leads App**

### **1. Clone the repository**

```bash
git clone "https://github.com/Akash-m15/buyer-lead-intake.git"
cd buyer-leads
```

---

### **2. Install dependencies**

```bash
npm install
```

---

### **3. Copy environment file**

```bash
cp .env.example .env
```

* Open `.env` and fill in:

  * `DATABASE_URL` → Supabase database URL
  * `DIRECT_URL` → Direct connection URL (for migrations)
 
  *Can get from supabase account -> project settings -> api-keys -> use anon-key or create a publishable key
  
  * `NEXT_PUBLIC_SUPABASE_URL` → Supabase project URL
  * `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` → Supabase publishable key
  * `NEXT_PUBLIC_PAGESIZE` → Optional, default 10
  * `NEXT_BASE_URL` → `http://localhost:3000`
---

### **4. Apply database migrations**

* If the repo already has `prisma/migrations`:

```bash
npx prisma migrate dev
```

* This creates tables locally or syncs with Supabase.

> ✅ This step also generates the `PrismaClient`.

---

### **5. Run the development server**

```bash
npm run dev
```

* The app should be available at: `http://localhost:3000`
* API routes will use your local Prisma client.

---

### **6. Verify**

* Check Supabase tables to ensure migrations applied.
* Open the app and test CRUD operations.

---

