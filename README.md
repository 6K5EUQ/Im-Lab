# Im Lab — 경남대학교 임현일 교수 연구실

> **소프트웨어 보안 · 프로그램 분석 · 기계학습 기반 소프트웨어 분류**
> 경남대학교 컴퓨터공학부 임현일 교수 연구실 공식 웹사이트

🌐 **[im-lab.bewe.co.kr](https://im-lab.bewe.co.kr)**

---

## 소개

Im Lab은 소프트웨어 보안과 프로그램 분석 분야를 연구하는 그룹입니다.
소프트웨어 도용 탐지(birthmarking), 정적 프로그램 분석, 기계학습 기반 소프트웨어 분류 등의 연구를 통해 현실 세계의 소프트웨어 보안 문제를 해결합니다.

- 📍 경남 창원시 마산회원구 경남대학로 7 공과대학
- 📧 hilim@kyungnam.ac.kr
- 📞 055-249-2650

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 🏠 연구실 소개 | 비전, 연구 분야, 통계 |
| 👨‍🏫 교수 소개 | 임현일 교수 프로필, 학력, 연구 분야 |
| 👥 멤버 | 연구실 구성원 소개 |
| 🔬 연구 현황 | 진행 중인 프로젝트 |
| 📄 논문 | 저널/학술대회 발표 논문 목록 |
| 📢 공지사항 | 연구실 공지 및 소식 |
| 🗓️ 캘린더 | 연구실 일정 관리 (멤버 전용) |
| ⏰ 출퇴근 | 출근/퇴근 기록 (멤버 전용) |
| 🔧 관리자 | 멤버·연구·공지사항 관리 (관리자 전용) |

---

## 기술 스택

```
Frontend     Next.js 16 + TypeScript + Tailwind CSS v4
Backend      Supabase (PostgreSQL + Auth + Storage)
i18n         next-intl (한국어 / English)
배포          Vercel
```

---

## 로컬 실행

### 1. 저장소 클론
```bash
git clone https://github.com/6K5EUQ/Im-Lab.git
cd Im-Lab
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경변수 설정
`.env.local` 파일 생성:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. DB 초기화
Supabase Dashboard → SQL Editor에서 아래 파일 순서대로 실행:
```
supabase/migrations/00001_create_tables.sql
supabase/migrations/00002_create_rls_policies.sql
supabase/seed.sql
```

### 5. 개발 서버 실행
```bash
npm run dev
```
→ http://localhost:3000

---

## 프로젝트 구조

```
src/
├── app/
│   └── [locale]/          # 한국어(ko) / 영어(en) 라우팅
│       ├── page.tsx        # 홈
│       ├── professor/      # 교수 소개
│       ├── members/        # 멤버
│       ├── research/       # 연구 현황 + 논문
│       ├── announcements/  # 공지사항
│       └── dashboard/      # 멤버 전용 (출퇴근, 캘린더, 관리자)
├── components/
│   └── layout/            # Header, Footer, Sidebar
├── lib/
│   ├── types.ts           # TypeScript 타입 정의
│   └── supabase/          # Supabase 클라이언트
└── messages/
    ├── ko.json            # 한국어
    └── en.json            # 영어
```

---

## 배포

`main` 브랜치에 push하면 Vercel이 자동으로 배포합니다.

```bash
git add .
git commit -m "커밋 메시지"
git push origin main
```

---

<p align="center">
  © 2025 Im Lab, Kyungnam University. All rights reserved.
</p>
