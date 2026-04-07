# 🎫 티켓팅 시스템 전체 구조 및 실행 흐름도

이 문서는 사용자가 브라우저에서 버튼을 클릭했을 때 데이터베이스까지 어떻게 정보가 흘러가는지를 보여주는 도식화입니다. 머릿속으로 아래의 흐름을 그리면서 코드를 작성하면 훨씬 이해가 쉽습니다.

## 1. 전체 아키텍처 (어플리케이션 구조)

```mermaid
graph TD
    subgraph Frontend [1. 프론트엔드 - 화면 Next.js/React]
        A1[app/page.tsx 메인 페이지]
        A2[src/components/SeatButton.tsx 좌석 버튼들]
        A3[src/components/BookingSummary.tsx 결제 요약창]
        
        A1 --> A2
        A1 --> A3
    end

    subgraph Backend [2. 백엔드 - API 서버 Next.js Route Handlers]
        B1[app/api/movies/route.ts 영화 목록 요청 처리]
        B2[app/api/bookings/route.ts 예약 상태 조회 & 예약 등록]
        B3[app/api/bookings/id/route.ts 예약 취소 삭제 처리]
    end

    subgraph Database [3. 데이터베이스 MongoDB Atlas]
        C1[lib/mongodb.ts DB 연결 파이프]
        C2[models/Movie.ts 영화 모델링]
        C3[models/Booking.ts 예약 모델링]
        C4[(실제 MongoDB 데이터베이스)]
    end

    %% 연결 관계
    Frontend -- HTTP 요청 fetch --> Backend
    Backend -- 데이터 검증 및 요청 --> C1
    C1 -- 모델 규칙 Schema 적용 --> C2
    C1 -- 모델 규칙 Schema 적용 --> C3
    C2 -. 읽기/쓰기 .-> C4
    C3 -. 읽기/쓰기 .-> C4
    
    %% 색상 지정
    style Frontend fill:#e0f2fe,stroke:#0284c7,stroke-width:2px
    style Backend fill:#fef08a,stroke:#ca8a04,stroke-width:2px
    style Database fill:#dcfce3,stroke:#16a34a,stroke-width:2px
```

---

## 2. 좌석 예매 실행 흐름 (데이터가 오가는 과정)

사용자가 사이트에 접속해서 자리를 예매하는 과정의 실제 흐름입니다.

```mermaid
sequenceDiagram
    participant U as 사용자 브라우저
    participant F as 프론트엔드 app/page.tsx
    participant B as 백엔드 API api/bookings/route.ts
    participant DB as MongoDB

    Note over U, DB: ➡️ 1단계: 웹사이트 최초 접속 시
    U->>F: 1. http://localhost:3000 접속
    F->>B: 2. GET /api/movies 영화 정보 요청
    B->>DB: 3. 영화 데이터 조회
    DB-->>B: 4. 영화 데이터 전달
    B-->>F: 5. 🎬 JSON 형태로 응답
    F->>B: 6. GET /api/bookings 기예약 좌석 요청
    B->>DB: 7. 예약된 자리 정보 조회
    DB-->>B: 8. 데이터 전달
    B-->>F: 9. 💺 JSON 형태로 응답
    F-->>U: 10. 빈자리회색, 예약된 자리빨간색 화면 출력

    Note over U, DB: ➡️ 2단계: 사용자가 좌석을 누르고 결제할 때
    U->>F: 11. 좌석 클릭 & 결제하기 버튼 클릭
    F->>B: 12. POST /api/bookings 신규 예약 요청
    B->>DB: 13. 모델 검증 후 DB 저장
    DB-->>B: 14. 저장 성공
    B-->>F: 15. 응답 예약 완료되었습니다
    F-->>U: 16. 알림창 표시 및 화면 업데이트
```

### 💡 흐름 이해하기 팁!
* **프론트엔드 (파란 구역)**: 식당의 "메뉴판"과 "손님 눈앞에 보이는 접시"라고 생각하세요. 오직 **UI와 클릭 이벤트**만 담당합니다. 데이터가 필요하면 백엔드에게 "fetch(요청)"를 보냅니다.
* **백엔드 API (노란 구역)**: 식당의 "메인 셰프"입니다. 프론트엔드의 요청을 받아서, 유효한 요청인지 검사하고, 데이터를 데이터베이스에 저장하거나 불러옵니다.
* **데이터베이스 (초록 구역)**: 식당의 "대형 냉장고"입니다. 데이터들이 차곡차곡 쌓여있는 곳입니다. 

방문자가 어떤 행동을 하면 `UI(클릭) -> 프론트(fetch) -> 백엔드(검증) -> DB(저장/조회)` 순서로 흘러갑니다. 
이 흐름을 머릿속에 담아두고 코드를 짜면 길을 잃지 않습니다.
