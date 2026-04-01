# 🚀 Cinema Next - 설정 & 배포 가이드

## ✅ 현재 완료된 작업

| # | 작업 | 상태 |
|---|------|------|
| 1 | MongoDB 연결 유틸리티 (`src/lib/mongodb.ts`) | ✅ |
| 2 | Mongoose 모델 3개 (Movie, Seat, Booking) | ✅ |
| 3 | API Routes 5개 (movies, seats, bookings, bookings/[id], seed) | ✅ |
| 4 | 프론트엔드 MongoDB API 연동 | ✅ |
| 5 | 컴포넌트 업데이트 (SeatButton, BookingSummary) | ✅ |
| 6 | 타입 정의 업데이트 | ✅ |
| 7 | 빌드 성공 확인 | ✅ |

---

## 📋 남은 단계: MongoDB Atlas 설정

### Step 1: MongoDB Atlas 무료 클러스터 만들기

1. [https://cloud.mongodb.com](https://cloud.mongodb.com) 접속
2. 회원가입 (Google 계정으로 가능)
3. **"Build a Cluster"** 클릭 → **M0 Free Tier** 선택
4. 리전: `Seoul (ap-northeast-2)` 또는 가까운 곳 선택
5. 클러스터 이름 입력 후 생성

### Step 2: 데이터베이스 사용자 생성

1. 좌측 메뉴 → **Database Access** 클릭
2. **"Add New Database User"** 클릭
3. 사용자명/비밀번호 설정 (예: `cinema-admin` / `mypassword123`)
4. 권한: **Read and write to any database** (기본값)

### Step 3: 네트워크 접근 허용

1. 좌측 메뉴 → **Network Access** 클릭
2. **"Add IP Address"** → **"Allow Access from Anywhere"** (`0.0.0.0/0`)
3. 확인

### Step 4: 연결 문자열 복사

1. 좌측 메뉴 → **Database** → **Connect** 클릭
2. **"Drivers"** 선택
3. Connection String 복사 (예시):
```
mongodb+srv://cinema-admin:mypassword123@cluster0.xxxxx.mongodb.net/cinema-next?retryWrites=true&w=majority
```

### Step 5: `.env.local` 파일 수정

[.env.local](file:///c:/Users/lg/ticketing/ticket/.env.local) 파일을 열고 연결 문자열을 붙여넣기:

```env
MONGODB_URI=mongodb+srv://cinema-admin:mypassword123@cluster0.xxxxx.mongodb.net/cinema-next?retryWrites=true&w=majority
```

> [!CAUTION]
> `.env.local`은 절대 GitHub에 올리지 마세요! `.gitignore`에 이미 포함되어 있어야 합니다.

---

## 🧪 로컬 테스트 방법

### 1. 개발 서버 실행
```bash
npm run dev
```

### 2. 초기 데이터 생성
브라우저에서 `http://localhost:3000` 접속 후:
- **"🌱 초기 데이터 생성하기"** 버튼 클릭
- 영화 3개 + 좌석 120개(영화당 40개)가 MongoDB에 저장됨

### 3. 전체 기능 테스트
- 영화 선택 → 좌석 선택 → 결제하기 → 예매 완료!
- MongoDB Atlas의 **Browse Collections**에서 데이터 확인 가능

---

## 🌐 Vercel 배포 방법

### Step 1: GitHub에 Push

```bash
cd c:\Users\lg\ticketing
git add .
git commit -m "feat: MongoDB 백엔드 연동 완료"
git push origin main
```

### Step 2: Vercel에서 Import

1. [https://vercel.com](https://vercel.com) 접속 & 로그인
2. **"Add New Project"** → GitHub 리포지토리 선택
3. **Root Directory**: `ticket` 으로 설정 (중요!)
4. **Framework Preset**: `Next.js` (자동 감지됨)

### Step 3: 환경변수 등록

Vercel 프로젝트 설정에서:
- **Settings** → **Environment Variables**
- Key: `MONGODB_URI`
- Value: MongoDB Atlas 연결 문자열 붙여넣기

### Step 4: Deploy!

- "Deploy" 버튼 클릭
- 빌드 완료 후 `https://your-project.vercel.app` 에서 확인

> [!TIP]
> 이후 `main` 브랜치에 push하면 Vercel이 자동으로 재배포합니다!

---

## 📁 최종 프로젝트 구조

```
ticket/
├── app/
│   ├── api/
│   │   ├── bookings/
│   │   │   ├── route.ts          ← POST: 예매 생성
│   │   │   └── [id]/
│   │   │       └── route.ts      ← GET: 예매 조회
│   │   ├── movies/
│   │   │   └── route.ts          ← GET: 영화 목록
│   │   ├── seats/
│   │   │   └── route.ts          ← GET: 좌석 조회
│   │   └── seed/
│   │       └── route.ts          ← POST: 초기 데이터
│   ├── globals.css
│   ├── layout.tsx                ← SEO 메타데이터 포함
│   └── page.tsx                  ← 메인 UI (fetch API 사용)
│
├── src/
│   ├── components/
│   │   ├── BookingSummary.tsx     ← 결제 요약 UI
│   │   ├── SeatButton.tsx        ← 좌석 버튼 UI
│   │   ├── MovieCard.tsx
│   │   └── Header.tsx
│   ├── lib/
│   │   └── mongodb.ts            ← DB 연결 (캐싱 패턴)
│   ├── models/
│   │   ├── Movie.ts              ← 영화 스키마
│   │   ├── Seat.ts               ← 좌석 스키마
│   │   └── Booking.ts            ← 예매 스키마
│   └── types/
│       └── index.ts              ← 공유 타입 정의
│
├── .env.local                    ← MongoDB URI (비밀!)
├── package.json
└── tsconfig.json
```
