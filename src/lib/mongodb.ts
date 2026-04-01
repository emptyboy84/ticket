// ==========================================
// MongoDB 연결 관리 유틸리티
// Vercel 서버리스 환경에서 연결 캐싱 패턴
// ==========================================
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

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
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// global 객체에 mongoose 캐시 추가
declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
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
