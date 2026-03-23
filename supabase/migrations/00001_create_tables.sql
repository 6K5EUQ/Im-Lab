-- ==========================================
-- Im-Lab Database Schema
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Profiles (linked to auth.users)
-- ==========================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  name_en TEXT,
  student_id TEXT UNIQUE,
  position TEXT NOT NULL DEFAULT 'master'
    CHECK (position IN ('professor', 'phd', 'master', 'undergraduate', 'alumni', 'researcher')),
  email TEXT NOT NULL DEFAULT '',
  phone TEXT,
  profile_photo_url TEXT,
  role TEXT NOT NULL DEFAULT 'member'
    CHECK (role IN ('admin', 'member')),
  bio TEXT,
  bio_en TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  joined_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 2. Attendance Records
-- ==========================================
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  clock_in TIMESTAMPTZ NOT NULL,
  clock_out TIMESTAMPTZ,
  date DATE NOT NULL,
  duration_minutes INTEGER,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_attendance_user_date ON attendance_records(user_id, date);
ALTER TABLE attendance_records ADD CONSTRAINT uq_attendance_user_date_clockin UNIQUE (user_id, date, clock_in);

-- ==========================================
-- 3. Calendar Events
-- ==========================================
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  description_en TEXT,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ,
  is_all_day BOOLEAN NOT NULL DEFAULT false,
  category TEXT NOT NULL DEFAULT 'other'
    CHECK (category IN ('seminar', 'meeting', 'conference', 'deadline', 'holiday', 'other')),
  location TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_start ON calendar_events(start_datetime);

-- ==========================================
-- 4. Research Projects
-- ==========================================
CREATE TABLE research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  description_en TEXT,
  status TEXT NOT NULL DEFAULT 'ongoing'
    CHECK (status IN ('ongoing', 'completed', 'planned')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date DATE,
  end_date DATE,
  funding_source TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 5. Project Members (join table)
-- ==========================================
CREATE TABLE project_members (
  project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_in_project TEXT DEFAULT 'member',
  PRIMARY KEY (project_id, user_id)
);

-- ==========================================
-- 6. Publications
-- ==========================================
CREATE TABLE publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
  venue TEXT,
  year INTEGER NOT NULL,
  doi TEXT,
  url TEXT,
  abstract TEXT,
  pub_type TEXT DEFAULT 'journal'
    CHECK (pub_type IN ('journal', 'conference', 'workshop', 'thesis', 'patent', 'other')),
  project_id UUID REFERENCES research_projects(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 7. Posts (announcements / board)
-- ==========================================
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category TEXT DEFAULT 'notice'
    CHECK (category IN ('notice', 'general', 'resource')),
  is_pinned BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 8. Post Attachments
-- ==========================================
CREATE TABLE post_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 9. Professor Info (singleton)
-- ==========================================
CREATE TABLE professor_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  name_en TEXT,
  title TEXT,
  title_en TEXT,
  department TEXT,
  department_en TEXT,
  bio TEXT,
  bio_en TEXT,
  research_areas JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  photo_url TEXT,
  email TEXT,
  phone TEXT,
  office_location TEXT,
  website TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 10. Lab Info (singleton)
-- ==========================================
CREATE TABLE lab_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  name_en TEXT,
  vision TEXT,
  vision_en TEXT,
  description TEXT,
  description_en TEXT,
  research_areas JSONB DEFAULT '[]'::jsonb,
  location TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  address_en TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- Triggers: auto-update updated_at
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON research_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON professor_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON lab_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- Trigger: auto-create profile on signup
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.email, ''),
    'member'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- Seed: Insert default professor_info and lab_info rows
-- ==========================================
INSERT INTO professor_info (name) VALUES ('');
INSERT INTO lab_info (name) VALUES ('Im Lab');
