-- ==========================================
-- Im Lab 초기 데이터 시드
-- Supabase Dashboard > SQL Editor 에서 실행
-- ==========================================

-- ── 1. 교수 정보 ──────────────────────────
UPDATE professor_info SET
  name            = '임현일',
  name_en         = 'Hyun-Il Lim',
  title           = '교수',
  title_en        = 'Professor',
  department      = '컴퓨터공학부',
  department_en   = 'School of Computer Engineering',
  email           = 'hilim@kyungnam.ac.kr',
  phone           = '055-249-2650',
  office_location = '경남대학교 공과대학',
  website         = 'https://www.kyungnam.ac.kr/ce/',
  bio             = '경남대학교 컴퓨터공학부 교수. KAIST 전산학부에서 박사학위를 취득하였으며, 지도교수는 한태숙 교수이다. 소프트웨어 보안 및 프로그램 분석 분야를 전공하였고, 주요 연구 주제는 소프트웨어 도용 탐지(birthmarking), 정적 프로그램 분석, 기계학습 기반 소프트웨어 분류이다. COMPSAC, IEICE, Journal of Systems and Software 등 국제 학술지 및 학술대회에 다수의 논문을 발표하였다. 2010년 3월부터 경남대학교에 재직 중이다.',
  bio_en          = 'Professor at the School of Computer Engineering, Kyungnam University. Received Ph.D. from KAIST School of Computing under Professor Taisook Han. Research focuses on software security and program analysis, including software theft detection (birthmarking), static program analysis, and machine learning-based software classification. Has published in COMPSAC, IEICE Transactions, Journal of Systems and Software, and other international venues. Joined Kyungnam University in March 2010.',
  research_areas  = '[
    {"ko": "소프트웨어 도용 탐지", "en": "Software Theft Detection"},
    {"ko": "프로그램 분석", "en": "Program Analysis"},
    {"ko": "소프트웨어 버스마킹", "en": "Software Birthmarking"},
    {"ko": "기계학습 기반 소프트웨어 분석", "en": "ML-based Software Analysis"},
    {"ko": "소프트웨어 보안", "en": "Software Security"}
  ]'::jsonb,
  education       = '[
    {"ko": "KAIST 전산학부 박사 (지도교수: 한태숙)", "en": "Ph.D. in Computer Science, KAIST (Advisor: Prof. Taisook Han)"},
    {"ko": "KAIST 전산학부 석사", "en": "M.S. in Computer Science, KAIST"},
    {"ko": "경남대학교 컴퓨터공학부 학사", "en": "B.S. in Computer Engineering, Kyungnam University"}
  ]'::jsonb;

-- ── 2. 연구실 정보 ──────────────────────────
UPDATE lab_info SET
  name            = 'Im Lab',
  name_en         = 'Im Lab',
  vision          = '정적 프로그램 분석과 기계학습을 결합하여 소프트웨어 보안 문제를 근본적으로 해결한다.',
  vision_en       = 'We address fundamental software security problems by combining static program analysis with machine learning.',
  description     = '임현일 교수 연구실은 소프트웨어 보안 및 프로그램 분석 분야를 연구합니다. 소프트웨어 도용 탐지, 정적 분석, 기계학습 기반 소프트웨어 분류 등의 연구를 통해 실제 소프트웨어 보안 문제를 해결합니다.',
  description_en  = 'Im Lab researches software security and program analysis. We tackle real-world software security problems through software theft detection, static analysis, and machine learning-based software classification.',
  research_areas  = '[
    {"ko": "소프트웨어 도용 탐지", "en": "Software Theft Detection"},
    {"ko": "프로그램 분석", "en": "Program Analysis"},
    {"ko": "소프트웨어 버스마킹", "en": "Software Birthmarking"},
    {"ko": "기계학습 기반 소프트웨어 분석", "en": "ML-based Software Analysis"},
    {"ko": "소프트웨어 보안", "en": "Software Security"}
  ]'::jsonb,
  contact_email   = 'hilim@kyungnam.ac.kr',
  contact_phone   = '055-249-2650',
  address         = '경남 창원시 마산회원구 경남대학로 7 공과대학',
  address_en      = '7 Kyungnamdaehak-ro, Masanhoewon-gu, Changwon, Gyeongnam';

-- ── 3. 논문 ──────────────────────────
-- 기존 데이터 초기화 후 삽입
DELETE FROM publications WHERE authors ILIKE '%Hyun-il Lim%' OR authors ILIKE '%임현일%';

INSERT INTO publications (title, authors, venue, year, doi, pub_type, is_featured, display_order) VALUES

-- 저널 논문
(
  'An Approach to Applying Multiple Linear Regression Models by Interlacing Data in Classifying Similar Software',
  'Hyun-il Lim',
  'Journal of Information Processing Systems, Vol. 18(2): 268-281',
  2022, NULL, 'journal', true, 1
),
(
  'Analyzing Stack Flows to Compare Java Programs',
  'Hyun-il Lim, Taisook Han',
  'IEICE Transactions on Information and Systems, Vol. 95-D(2): 565-576',
  2012, NULL, 'journal', true, 2
),
(
  'Detecting Common Modules in Java Packages Based on Static Object Trace Birthmark',
  'Hyun-il Lim, Heewan Park, Seokwoo Choi, Taisook Han',
  'The Computer Journal, Vol. 54(1): 108-124',
  2011, NULL, 'journal', true, 3
),
(
  'A method for detecting the theft of Java programs through analysis of the control flow information',
  'Hyun-il Lim, Heewan Park, Seokwoo Choi, Taisook Han',
  'Information and Software Technology, Vol. 51(9): 1338-1350',
  2009, NULL, 'journal', true, 4
),
(
  'A static API birthmark for Windows binary executables',
  'Hyun-il Lim, Seokwoo Choi, Heewan Park, Taisook Han',
  'Journal of Systems and Software, Vol. 82(5): 862-873',
  2009, NULL, 'journal', true, 5
),
(
  'Detecting Theft of Java Applications via a Static Birthmark Based on Weighted Stack Patterns',
  'Hyun-il Lim, Heewan Park, Seokwoo Choi, Taisook Han',
  'IEICE Transactions on Information and Systems, Vol. 91-D(9): 2323-2332',
  2008, NULL, 'journal', false, 6
),

-- 학술대회 논문
(
  'A Study on Comparative Analysis of the Effect of Applying DropOut and DropConnect to Deep Neural Network',
  'Hyun-il Lim',
  'IHCI 2020',
  2020, NULL, 'conference', false, 10
),
(
  'Applying Multiple Models to Improve the Accuracy of Prediction Results in Neural Networks',
  'Hyun-il Lim',
  'IHCI 2020',
  2020, NULL, 'conference', false, 11
),
(
  'Detecting Similar Versions of Software by Learning with Logistic Regression on Binary Opcode Information',
  'Hyun-il Lim',
  'MLIS 2020',
  2020, NULL, 'conference', false, 12
),
(
  'A Study on the Effect of DropConnect to Control Overfitting in Designing Neural Networks',
  'Hyun-il Lim',
  'MLIS 2020',
  2020, NULL, 'conference', false, 13
),
(
  'A Linear Regression Approach to Modeling Software Characteristics for Classifying Similar Software',
  'Hyun-il Lim',
  'IEEE COMPSAC 2019',
  2019, NULL, 'conference', false, 14
),
(
  'Applying Code Vectors for Presenting Software Features in Machine Learning',
  'Hyun-il Lim',
  'IEEE COMPSAC 2018',
  2018, NULL, 'conference', false, 15
),
(
  'An Approach to Tracing Information Flows of Untrustworthy Data in Programs',
  'Hyun-il Lim',
  'ICADIWT 2015',
  2015, NULL, 'conference', false, 16
),
(
  'Customizing k-Gram Based Birthmark through Partial Matching in Detecting Software Thefts',
  'Hyun-il Lim',
  'IEEE COMPSAC Workshops 2013',
  2013, NULL, 'conference', false, 17
),
(
  'A Static Java Birthmark Based on Control Flow Edges',
  'Hyun-il Lim, Heewan Park, Seokwoo Choi, Taisook Han',
  'IEEE COMPSAC 2009',
  2009, NULL, 'conference', false, 18
),
(
  'Detecting Java Theft Based on Static API Trace Birthmark',
  'Hyun-il Lim, Heewan Park, Seokwoo Choi, Taisook Han',
  'IWSEC 2008',
  2008, NULL, 'conference', false, 19
);

-- ── 4. 학부생 멤버 ──────────────────────────
DO $$
DECLARE
  uid1 UUID;
  uid2 UUID;
  uid3 UUID;
BEGIN
  SELECT id INTO uid1 FROM auth.users WHERE email = 'dohyun.kim@kyungnam.ac.kr';
  IF uid1 IS NULL THEN
    uid1 := gen_random_uuid();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
    VALUES (uid1, 'dohyun.kim@kyungnam.ac.kr', '', now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"김도현"}'::jsonb, 'authenticated', 'authenticated');
  END IF;

  SELECT id INTO uid2 FROM auth.users WHERE email = 'seoyeon.park@kyungnam.ac.kr';
  IF uid2 IS NULL THEN
    uid2 := gen_random_uuid();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
    VALUES (uid2, 'seoyeon.park@kyungnam.ac.kr', '', now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"박서연"}'::jsonb, 'authenticated', 'authenticated');
  END IF;

  SELECT id INTO uid3 FROM auth.users WHERE email = 'junhyeok.lee@kyungnam.ac.kr';
  IF uid3 IS NULL THEN
    uid3 := gen_random_uuid();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
    VALUES (uid3, 'junhyeok.lee@kyungnam.ac.kr', '', now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"이준혁"}'::jsonb, 'authenticated', 'authenticated');
  END IF;

  INSERT INTO profiles (id, name, name_en, student_id, position, email, bio, bio_en, is_active, joined_at)
  VALUES
    (
      uid1, '김도현', 'Do-Hyun Kim', '20210001', 'undergraduate',
      'dohyun.kim@kyungnam.ac.kr',
      '경남대학교 컴퓨터공학부 4학년. 소프트웨어 보안 및 정적 분석에 관심이 있으며, 졸업 논문으로 소스코드 취약점 자동 탐지 시스템을 연구 중이다.',
      '4th-year undergraduate at Kyungnam University. Interested in software security and static analysis. Currently working on an undergraduate thesis on automated source code vulnerability detection.',
      true, '2021-03-02'
    ),
    (
      uid2, '박서연', 'Seo-Yeon Park', '20220042', 'undergraduate',
      'seoyeon.park@kyungnam.ac.kr',
      '경남대학교 컴퓨터공학부 3학년. 소프트웨어 테스팅 자동화와 퍼징(Fuzzing) 기법에 관심을 가지고 연구실 인턴으로 활동 중이다.',
      '3rd-year undergraduate at Kyungnam University. Interested in automated software testing and fuzzing techniques. Currently participating as a lab intern.',
      true, '2022-03-02'
    ),
    (
      uid3, '이준혁', 'Jun-Hyeok Lee', '20230088', 'undergraduate',
      'junhyeok.lee@kyungnam.ac.kr',
      '경남대학교 컴퓨터공학부 2학년. 프로그램 분석과 컴파일러 이론에 흥미를 가지고 있으며, 연구실 스터디 그룹에 참여하고 있다.',
      '2nd-year undergraduate at Kyungnam University. Interested in program analysis and compiler theory. Participating in the lab study group.',
      true, '2023-03-02'
    )
  ON CONFLICT (id) DO UPDATE SET
    name       = EXCLUDED.name,
    name_en    = EXCLUDED.name_en,
    student_id = EXCLUDED.student_id,
    position   = EXCLUDED.position,
    bio        = EXCLUDED.bio,
    bio_en     = EXCLUDED.bio_en,
    is_active  = true,
    joined_at  = EXCLUDED.joined_at;

END $$;
