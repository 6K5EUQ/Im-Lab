-- ==========================================
-- Enable RLS on all tables
-- ==========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE professor_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_info ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin' FROM profiles WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- Profiles
-- ==========================================
CREATE POLICY "Profiles: anyone can view active members"
  ON profiles FOR SELECT
  USING (is_active = true OR auth.uid() = id OR is_admin());

CREATE POLICY "Profiles: users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles: admin can update any profile"
  ON profiles FOR UPDATE
  USING (is_admin());

CREATE POLICY "Profiles: admin can delete"
  ON profiles FOR DELETE
  USING (is_admin());

-- ==========================================
-- Attendance Records
-- ==========================================
CREATE POLICY "Attendance: users can view own records"
  ON attendance_records FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Attendance: users can insert own records"
  ON attendance_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Attendance: users can update own records"
  ON attendance_records FOR UPDATE
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Attendance: admin can delete"
  ON attendance_records FOR DELETE
  USING (is_admin());

-- ==========================================
-- Calendar Events
-- ==========================================
CREATE POLICY "Events: authenticated can view"
  ON calendar_events FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Events: admin can insert"
  ON calendar_events FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Events: admin can update"
  ON calendar_events FOR UPDATE
  USING (is_admin());

CREATE POLICY "Events: admin can delete"
  ON calendar_events FOR DELETE
  USING (is_admin());

-- ==========================================
-- Research Projects (public read)
-- ==========================================
CREATE POLICY "Projects: public can view"
  ON research_projects FOR SELECT
  USING (true);

CREATE POLICY "Projects: admin can insert"
  ON research_projects FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Projects: admin can update"
  ON research_projects FOR UPDATE
  USING (is_admin());

CREATE POLICY "Projects: admin can delete"
  ON research_projects FOR DELETE
  USING (is_admin());

-- ==========================================
-- Project Members (public read)
-- ==========================================
CREATE POLICY "Project members: public can view"
  ON project_members FOR SELECT
  USING (true);

CREATE POLICY "Project members: admin can manage"
  ON project_members FOR ALL
  USING (is_admin());

-- ==========================================
-- Publications (public read)
-- ==========================================
CREATE POLICY "Publications: public can view"
  ON publications FOR SELECT
  USING (true);

CREATE POLICY "Publications: admin can insert"
  ON publications FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Publications: admin can update"
  ON publications FOR UPDATE
  USING (is_admin());

CREATE POLICY "Publications: admin can delete"
  ON publications FOR DELETE
  USING (is_admin());

-- ==========================================
-- Posts (public read published, admin sees all)
-- ==========================================
CREATE POLICY "Posts: public can view published"
  ON posts FOR SELECT
  USING (is_published = true OR is_admin());

CREATE POLICY "Posts: admin can insert"
  ON posts FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Posts: admin can update"
  ON posts FOR UPDATE
  USING (is_admin());

CREATE POLICY "Posts: admin can delete"
  ON posts FOR DELETE
  USING (is_admin());

-- ==========================================
-- Post Attachments
-- ==========================================
CREATE POLICY "Attachments: public can view"
  ON post_attachments FOR SELECT
  USING (true);

CREATE POLICY "Attachments: admin can manage"
  ON post_attachments FOR ALL
  USING (is_admin());

-- ==========================================
-- Professor Info (public read)
-- ==========================================
CREATE POLICY "Professor: public can view"
  ON professor_info FOR SELECT
  USING (true);

CREATE POLICY "Professor: admin can update"
  ON professor_info FOR UPDATE
  USING (is_admin());

-- ==========================================
-- Lab Info (public read)
-- ==========================================
CREATE POLICY "Lab info: public can view"
  ON lab_info FOR SELECT
  USING (true);

CREATE POLICY "Lab info: admin can update"
  ON lab_info FOR UPDATE
  USING (is_admin());
