/*백엔드가 데이터베이스(냉장고)와 연결하기 위한 보안 통로입니다.*/
// lib은 **Library(라이브러리)**의 줄임말입니다. 이 폴더에는 프로젝트 여러 곳에서 **공통으로 두고두고 꺼내 쓰는 도구(유틸리티)**들을 모아둡니다.
//  식당으로 치면 요리사들이 공용으로 쓰는 '다용도실'이나 '공용 도구함' 같은 곳이죠. 🛠️

// 보통 이런 종류의 파일들을 넣습니다:

// 데이터베이스 연결 설정 (우리가 방금 본 mongodb.ts)

// 날짜나 시간을 예쁘게 바꿔주는 함수 (예: formatDate.ts)

// 외부 서비스(결제, 이메일 전송 등)와 통신하는 설정 파일

//그래서 데이터베이스와 연결하는 mongodb.ts 파일도 "어떤 
// API 라우트에서든 필요할 때 쉽게 꺼내 쓰기 위해" 이 lib 폴더에 넣어둔 것입니다.



// ==========================================
// MongoDB 연결 관리 유틸리티
// Vercel 서버리스 환경에서 연결 캐싱 패턴
// ==========================================
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;//숨겨둔 .env.local 파일에서 데이터베이스 주소를 가져오는 역할

if (!MONGODB_URI) {
  throw new Error(
    "⚠️ MONGODB_URI 환경변수가 설정되지 않았습니다.\n" +
    ".env.local 파일에 MONGODB_URI를 추가하세요."
  );
}

/**
 * Global 타입 확장 - 서버리스 환경에서 연결 캐싱을 위해 필요
 * 
 * 💡 왜 global을 사용하나요?
 * Vercel 같은 서버리스 환경에서는 매 API 요청마다 새로운 실행 컨텍스트가 생길 수 있습니다.
 * 하지만 같은 "따뜻한(warm)" 인스턴스에서는 global 변수가 유지되므로,
 * 불필요한 DB 재연결을 방지할 수 있습니다.
 */
interface MongooseCache { // MongooseCache는 mongoose 연결 정보를 담는 객체입니다.
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// global 객체에 mongoose 캐시 추가
declare global { //global은 전역 객체로, 프로그램 전체에서 접근할 수 있습니다.(네임스페이스)
  // eslint-disable-next-line no-var 
  var _mongoose: MongooseCache | undefined; // global._mongoose는 mongoose 연결 정보를 담는 객체입니다.
}

// 캐시 초기화 (없으면 생성)
const cached: MongooseCache = global._mongoose || { conn: null, promise: null };
global._mongoose = cached;

/**
 * MongoDB에 연결하는 함수
 * - 이미 연결되어 있으면 캐시된 연결을 반환
 * - 없으면 새로 연결하고 캐시에 저장
 */
export default async function dbConnect(): Promise<typeof mongoose> {
  // 1️⃣ 이미 연결된 게 있으면 그대로 사용
  if (cached.conn) {
    return cached.conn;
  }

  // 2️⃣ 연결 중인 Promise가 없으면 새로 만들기
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // 연결 전에는 명령 버퍼링 안 함
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    // 3️⃣ 연결 완료 대기
    cached.conn = await cached.promise;
  } catch (e) {
    // 에러 시 캐시 초기화 (다음에 다시 시도할 수 있도록)
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
