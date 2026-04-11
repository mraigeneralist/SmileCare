# SmileCare Dental - Setup Guide

Complete setup instructions to deploy this booking website for any dentist.

---

## 1. Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- A [Supabase](https://supabase.com/) account (free tier works)
- A [Vercel](https://vercel.com/) account (free tier works)
- A [Meta Business](https://business.facebook.com/) account (for WhatsApp API)
- A phone number for WhatsApp Business API

---

## 2. Supabase Setup

### 2.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com/) and create a new project
2. Note your **Project URL** and **anon key** from Settings > API
3. Note your **Service Role Key** from Settings > API (keep this secret!)

### 2.2 Create Database Tables

Go to **SQL Editor** in your Supabase dashboard and run the following SQL:

```sql
-- Services table
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  duration_minutes INT NOT NULL DEFAULT 30,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Availability table (weekly recurring schedule)
CREATE TABLE availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration_minutes INT NOT NULL DEFAULT 30,
  is_active BOOLEAN DEFAULT true
);

-- Blocked dates (holidays / days off)
CREATE TABLE blocked_dates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  reason TEXT
);

-- Appointments table
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES services(id),
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT DEFAULT 'pending_otp' CHECK (status IN ('pending_otp','confirmed','cancelled','completed','no_show')),
  otp_code TEXT,
  otp_expires_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  reminder_1h_sent BOOLEAN DEFAULT false,
  reminder_30m_sent BOOLEAN DEFAULT false,
  reminder_10m_sent BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Settings table (single row)
CREATE TABLE settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  clinic_name TEXT DEFAULT 'SmileCare Dental',
  clinic_phone TEXT DEFAULT '',
  clinic_address TEXT DEFAULT '',
  dentist_whatsapp TEXT DEFAULT ''
);

-- Insert default settings row
INSERT INTO settings (id, clinic_name) VALUES (1, 'SmileCare Dental');

-- Seed default services
INSERT INTO services (name, description, duration_minutes, price, sort_order) VALUES
  ('Dental Checkup', 'Comprehensive oral examination with digital X-rays', 30, 500, 1),
  ('Teeth Cleaning', 'Professional scaling and polishing', 45, 800, 2),
  ('Teeth Whitening', 'Advanced whitening treatment for a brighter smile', 60, 3000, 3),
  ('Tooth Filling', 'Durable tooth-colored composite fillings', 30, 1000, 4),
  ('Root Canal', 'Painless root canal therapy', 60, 5000, 5),
  ('Tooth Extraction', 'Safe and gentle tooth extraction', 30, 1500, 6);

-- Seed default availability (Mon-Sat, 9am-1pm and 2pm-6pm)
INSERT INTO availability (day_of_week, start_time, end_time, slot_duration_minutes) VALUES
  (1, '09:00', '13:00', 30),
  (1, '14:00', '18:00', 30),
  (2, '09:00', '13:00', 30),
  (2, '14:00', '18:00', 30),
  (3, '09:00', '13:00', 30),
  (3, '14:00', '18:00', 30),
  (4, '09:00', '13:00', 30),
  (4, '14:00', '18:00', 30),
  (5, '09:00', '13:00', 30),
  (5, '14:00', '18:00', 30),
  (6, '09:00', '13:00', 30);
```

### 2.3 Set Up Row Level Security (RLS)

Run this SQL to secure your tables:

```sql
-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Services: anyone can read active services
CREATE POLICY "Public read services" ON services
  FOR SELECT USING (is_active = true);

-- Availability: anyone can read active availability
CREATE POLICY "Public read availability" ON availability
  FOR SELECT USING (is_active = true);

-- Blocked dates: anyone can read
CREATE POLICY "Public read blocked_dates" ON blocked_dates
  FOR SELECT USING (true);

-- Appointments: anyone can insert (for booking)
CREATE POLICY "Public insert appointments" ON appointments
  FOR INSERT WITH CHECK (true);

-- Appointments: only authenticated users can read
CREATE POLICY "Auth read appointments" ON appointments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Appointments: only authenticated users can update
CREATE POLICY "Auth update appointments" ON appointments
  FOR UPDATE USING (auth.role() = 'authenticated');
```

### 2.4 Create an Admin User

Go to **Authentication** > **Users** in Supabase and click **Add User**:
- Email: your admin email (e.g., `admin@smilecare.com`)
- Password: a strong password
- Check "Auto Confirm User"

---

## 3. WhatsApp Cloud API Setup

### 3.1 Create a Meta Business App

1. Go to [developers.facebook.com](https://developers.facebook.com/)
2. Click **My Apps** > **Create App**
3. Select app type: **Business**
4. Give it a name (e.g., "SmileCare Dental")
5. Click **Create App**

### 3.2 Add WhatsApp Product

1. In your app dashboard, click **Add Product**
2. Find **WhatsApp** and click **Set Up**
3. In **WhatsApp** > **Getting Started**:
   - Note the **Phone Number ID** (under "From" number)
   - Note the **Temporary Access Token** (for testing)

### 3.3 Get a Permanent Access Token

1. Go to **Business Settings** > **System Users**
2. Create a system user with **Admin** role
3. Click **Generate Token**
4. Select your WhatsApp app and grant these permissions:
   - `whatsapp_business_management`
   - `whatsapp_business_messaging`
5. Copy and save the permanent token

### 3.4 Add a Real Phone Number (Production)

1. In **WhatsApp** > **Getting Started**, click **Add Phone Number**
2. Follow the verification process
3. Update your **Phone Number ID** with the new number

### 3.5 Register Test Numbers (Development)

While developing, you can only send messages to verified numbers:
1. Go to **WhatsApp** > **Getting Started** > **To** field
2. Click **Manage phone number list**
3. Add your test phone numbers

> **Note:** The app uses plain text messages (not templates) for simplicity. WhatsApp allows sending plain text messages within a 24-hour customer service window. For production with high volume, you may want to create approved message templates.

---

## 4. Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# WhatsApp Cloud API
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_ACCESS_TOKEN=your-permanent-access-token
DENTIST_WHATSAPP_NUMBER=919876543210

# Cron Security
CRON_SECRET=generate-a-random-string-here
```

### Generate CRON_SECRET

Run this in your terminal to generate a secure random string:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 5. Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit `http://localhost:3000` to see the website.

### Test the booking flow:
1. Go to `/book` and select a service
2. Pick a date and time
3. Enter your name and a verified WhatsApp test number
4. You should receive an OTP on WhatsApp
5. Enter the OTP to confirm the booking
6. Check `/admin` to see the appointment

### Test reminders locally:
Reminders are triggered by a Vercel Cron job. To test locally:

```bash
curl http://localhost:3000/api/reminders -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## 6. Deploy to Vercel

### 6.1 Push to GitHub

```bash
git add .
git commit -m "Initial SmileCare Dental setup"
git push
```

### 6.2 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com/) and click **New Project**
2. Import your GitHub repository
3. Vercel will auto-detect Next.js
4. Add all environment variables from `.env.local` in the **Environment Variables** section
5. Click **Deploy**

### 6.3 Verify Cron Job

After deployment, go to your Vercel project dashboard:
1. Click **Settings** > **Cron Jobs**
2. You should see `/api/reminders` running every 5 minutes
3. Check the **Logs** tab to verify it's working

---

## 7. Customization

### Change Clinic Name
- Update the name in the admin **Settings** page (`/admin/settings`)
- Update `metadata` in `app/layout.tsx`
- Search and replace "SmileCare" across landing page components

### Change Colors
- Edit CSS variables in `app/globals.css`
- `--primary` is the main teal color (`#0d9488`)
- Adjust `--primary-light`, `--primary-dark`, etc.

### Modify Services
- Log in to admin at `/admin/services`
- Add, edit, or deactivate services
- Prices are in INR by default

### Adjust Schedule
- Log in to admin at `/admin/availability`
- Add or modify time slots for each day
- Block specific dates (holidays)

### Change Landing Page Content
- Edit text in `components/landing/` files
- `HeroSection.tsx` - headline, stats, CTAs
- `ServicesSection.tsx` - service descriptions
- `AboutSection.tsx` - about text, feature cards
- `TestimonialsSection.tsx` - patient reviews
- `Footer.tsx` - contact info, address

---

## 8. Troubleshooting

### WhatsApp messages not sending
- Verify your access token is valid and not expired
- Check the Phone Number ID is correct
- For test mode, ensure the recipient number is in your verified list
- Check Vercel function logs for error details

### OTP not received
- WhatsApp may take a few seconds to deliver
- Check if the phone number format is correct (include country code, no +)
- Verify WhatsApp API quotas haven't been exceeded

### Cron not running
- Verify `CRON_SECRET` is set in Vercel environment variables
- Check Vercel Cron Jobs settings page
- Cron jobs only work in production (not in preview deployments)
- Free Vercel plan supports 1 cron job (which is what we use)

### Appointments not showing in admin
- Verify the Supabase service role key is correct
- Check RLS policies are set up properly
- Make sure the admin user is authenticated

---

## 9. Architecture Overview

```
Customer Flow:
  Landing Page → Book Appointment → Select Service → Pick Date → Pick Time
  → Enter Details → Receive WhatsApp OTP → Verify → Confirmed!
  → Receives WhatsApp confirmation
  → Receives reminders at 1h, 30m, 10m before appointment

Dentist Flow:
  Receives WhatsApp notification on new booking
  Receives reminders at 1h, 30m, 10m before appointment
  Admin Dashboard → View appointments, manage services, set availability

Tech Flow:
  Frontend (Next.js) → API Routes → Supabase (database)
                                  → WhatsApp Cloud API (messages)
  Vercel Cron (every 5min) → /api/reminders → sends reminder messages
```
