# 🎬 Cinema Next - 전체 아키텍처 문서

## 📌 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **앱 이름** | Cinema Next (영화 예매 시스템) |
| **프레임워크** | Next.js 16 (App Router) |
| **데이터베이스** | MongoDB Atlas (클라우드) |
| **ODM** | Mongoose |
| **호스팅** | Vercel |
| **스타일링** | Tailwind CSS v4 |

---

## 🏗️ 전체 시스템 아키텍처

```mermaid
graph TB
    subgraph "🖥️ 클라이언트 (브라우저)"
        A["page.tsx<br/>메인 페이지"]
        B["SeatButton<br/>좌석 버튼"]
        C["BookingSummary<br/>결제 요약"]
        D["MovieCard<br/>영화 카드"]
    end

    subgraph "⚡ Next.js API Routes (서버)"
        E["/api/movies<br/>GET: 영화 목록"]
        F["/api/movies/[id]<br/>GET: 영화 상세"]
        G["/api/seats<br/>GET: 좌석 조회"]
        H["/api/bookings<br/>POST: 예매 생성"]
        I["/api/bookings/[id]<br/>GET: 예매 조회"]
        J["/api/seed<br/>POST: 초기 데이터"]
    end

    subgraph "🗄️ MongoDB Atlas"
        K[("movies<br/>컬렉션")]
        L[("seats<br/>컬렉션")]
        M[("bookings<br/>컬렉션")]
    end

    subgraph "🔧 공유 유틸리티"
        N["lib/mongodb.ts<br/>DB 연결"]
        O["models/*.ts<br/>Mongoose 모델"]
    end

    A -->|fetch| E
    A -->|fetch| G
    A -->|fetch| H
    B --> A
    C --> A
    D --> A

    E --> N
    F --> N
    G --> N
    H --> N
    I --> N
    J --> N

    N --> K
    N --> L
    N --> M

    O --> E
    O --> F
    O --> G
    O --> H
    O --> I
    O --> J
```

---

## 📁 프로젝트 폴더 구조

```
ticket/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 루트 레이아웃 (HTML 뼈대)
│   ├── page.tsx                  # 메인 페이지 (클라이언트)
│   ├── globals.css               # 전역 스타일
│   └── api/                      # ⭐ 백엔드 API 라우트
│       ├── movies/
│       │   └── route.ts          # GET /api/movies
│       ├── seats/
│       │   └── route.ts          # GET /api/seats?movieId=xxx
│       ├── bookings/
│       │   ├── route.ts          # POST /api/bookings
│       │   └── [id]/
│       │       └── route.ts      # GET /api/bookings/:id
│       └── seed/
│           └── route.ts          # POST /api/seed (초기 데이터)
│
├── src/
│   ├── components/               # UI 컴포넌트들
│   │   ├── SeatButton.tsx        # 좌석 버튼
│   │   ├── BookingSummary.tsx    # 결제 요약
│   │   ├── MovieCard.tsx         # 영화 카드
│   │   └── Header.tsx            # 헤더
│   ├── lib/                      # ⭐ 유틸리티
│   │   └── mongodb.ts            # MongoDB 연결 관리
│   ├── models/                   # ⭐ Mongoose 모델 (스키마)
│   │   ├── Movie.ts              # 영화 모델
│   │   ├── Seat.ts               # 좌석 모델
│   │   └── Booking.ts            # 예매 모델
│   └── types/
│       └── index.ts              # TypeScript 타입 정의
│
├── .env.local                    # 🔑 환경변수 (MongoDB URI)
├── package.json
├── next.config.ts
└── tsconfig.json
```

---

## 🔄 데이터 흐름 (예매 과정)

```mermaid
sequenceDiagram
    participant User as 👤 사용자
    participant Page as 📱 page.tsx
    participant API as ⚡ API Route
    participant DB as 🗄️ MongoDB

    Note over User, DB: 1️⃣ 영화 목록 조회
    User->>Page: 앱 접속
    Page->>API: GET /api/movies
    API->>DB: Movie.find()
    DB-->>API: 영화 데이터[]
    API-->>Page: JSON 응답
    Page-->>User: 영화 카드 렌더링

    Note over User, DB: 2️⃣ 좌석 선택
    User->>Page: 영화 클릭
    Page->>API: GET /api/seats?movieId=m1
    API->>DB: Seat.find({movieId})
    DB-->>API: 좌석 데이터[]
    API-->>Page: JSON 응답
    Page-->>User: 좌석 배치도 렌더링

    Note over User, DB: 3️⃣ 예매 완료
    User->>Page: 결제하기 클릭
    Page->>API: POST /api/bookings
    API->>DB: Booking.create() + Seat 상태 업데이트
    DB-->>API: 예매 확인
    API-->>Page: 예매 ID 반환
    Page-->>User: 예매 완료 화면
```

---

## 📊 데이터베이스 모델 (MongoDB 컬렉션)

```mermaid
erDiagram
    MOVIES {
        string _id PK
        string movieId UK "고유 식별자 (m1, m2...)"
        string title "영화 제목"
        string posterColor "포스터 색상"
        number runningTime "상영 시간(분)"
        string genre "장르"
        number basePrice "기본 가격"
        string time "상영 시간"
    }

    SEATS {
        string _id PK
        string seatId UK "좌석 ID (A1, B2...)"
        string movieId FK "영화 ID"
        string status "available / booked"
        string grade "standard / premium"
        number priceMultiplier "가격 배수"
    }

    BOOKINGS {
        string _id PK
        string movieId FK "영화 ID"
        string movieTitle "영화 제목"
        string[] seatIds "선택된 좌석 ID 배열"
        number totalPrice "총 결제 금액"
        date createdAt "예매 시각"
    }

    MOVIES ||--o{ SEATS : "has"
    MOVIES ||--o{ BOOKINGS : "has"
    SEATS }o--o{ BOOKINGS : "included in"
```

---

## 🌐 API 엔드포인트 목록

| 메서드 | 경로 | 설명 | 요청 바디 | 응답 |
|--------|------|------|----------|------|
| `GET` | `/api/movies` | 영화 목록 조회 | - | `Movie[]` |
| `GET` | `/api/seats?movieId=xxx` | 특정 영화의 좌석 조회 | - | `Seat[]` |
| `POST` | `/api/bookings` | 예매 생성 | `{movieId, seatIds, totalPrice}` | `Booking` |
| `GET` | `/api/bookings/[id]` | 예매 상세 조회 | - | `Booking` |
| `POST` | `/api/seed` | 초기 데이터 생성 | - | `{message}` |

---

## 🔑 환경변수 설정

```env
# .env.local
MONGODB_URI=mongodb+srv://<사용자명>:<비밀번호>@<클러스터>.mongodb.net/<DB이름>?retryWrites=true&w=majority
```

> [!IMPORTANT]
> MongoDB Atlas에서 무료 클러스터를 생성한 후, Connection String을 `.env.local`에 넣어야 합니다.

---

## 🚀 Vercel 배포 절차

```mermaid
graph LR
    A["1. GitHub에<br/>코드 Push"] --> B["2. Vercel에서<br/>Import Project"]
    B --> C["3. 환경변수<br/>MONGODB_URI 설정"]
    C --> D["4. Deploy<br/>자동 빌드"]
    D --> E["5. 🎉 배포 완료!<br/>yourapp.vercel.app"]
```

### 상세 단계:

1. **GitHub 리포지토리 연결**
   - `git push origin main` 으로 코드를 GitHub에 업로드

2. **Vercel 프로젝트 설정**
   - [vercel.com](https://vercel.com) 에서 "Import Project" 클릭
   - GitHub 리포지토리 선택
   - Root Directory: `ticket` (모노레포 구조이므로)

3. **환경변수 등록**
   - Vercel 대시보드 → Settings → Environment Variables
   - `MONGODB_URI` 값 입력

4. **자동 배포**
   - `main` 브랜치에 push할 때마다 자동으로 재배포

---

## 🔧 MongoDB 연결 구조 (핵심)

```mermaid
graph TD
    A["API Route 호출"] --> B{"DB 연결이<br/>캐시에 있나?"}
    B -->|있음| C["캐시된 연결 재사용"]
    B -->|없음| D["새 연결 생성<br/>mongoose.connect()"]
    D --> E["global._mongoose에<br/>연결 캐시 저장"]
    C --> F["Mongoose Model로<br/>CRUD 수행"]
    E --> F
    F --> G["JSON 응답 반환"]
```

> [!NOTE]
> Vercel의 서버리스 환경에서는 매 요청마다 새 연결을 만들면 비효율적이므로, `global` 객체에 연결을 캐싱하는 패턴을 사용합니다. 이것이 `lib/mongodb.ts`의 핵심 역할입니다.

---

## 🧩 컴포넌트 관계도

```mermaid
graph TD
    subgraph "App Router"
        Layout["layout.tsx<br/>(서버 컴포넌트)"]
        Page["page.tsx<br/>(클라이언트 컴포넌트)"]
    end

    subgraph "UI 컴포넌트"
        MC["MovieCard<br/>영화 카드"]
        SB["SeatButton<br/>좌석 버튼"]
        BS["BookingSummary<br/>결제 요약"]
    end

    subgraph "상태 관리"
        S1["step: home/booking/success"]
        S2["movies: Movie[]"]
        S3["selectedMovie: Movie"]
        S4["selectedSeats: Seat[]"]
    end

    Layout --> Page
    Page --> MC
    Page --> SB
    Page --> BS
    Page --> S1
    Page --> S2
    Page --> S3
    Page --> S4

    MC -.->|"goToBooking(movie)"| S1
    SB -.->|"toggleSeat(seat)"| S4
    BS -.->|"goToSuccess()"| S1
```

---

## ✅ 변경 사항 요약 (Before → After)

| 항목 | Before (기존) | After (변경 후) |
|------|--------------|----------------|
| 데이터 소스 | `mockMovies` 하드코딩 | MongoDB에서 `fetch()` |
| 좌석 데이터 | `MOCK_SEATS` 하드코딩 | MongoDB에서 영화별 조회 |
| 예매 처리 | 화면 전환만 | DB에 예매 기록 저장 + 좌석 상태 변경 |
| API | 없음 | 5개 API Route 추가 |
| DB 연결 | 없음 | `lib/mongodb.ts` 연결 관리 |
| 환경변수 | 비어있음 | `MONGODB_URI` 설정 |
| 배포 | 로컬만 | Vercel 배포 가능 |
