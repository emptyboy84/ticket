// ==========================================
// TypeScript 타입 정의
// 프론트엔드와 백엔드에서 공유하는 타입
// ==========================================

// 영화 정보 타입 (MongoDB에서 가져온 데이터용)
export interface Movie {
  _id?: string;
  movieId: string;
  title: string;
  posterColor: string;
  runningTime: number;
  genre: string;
  basePrice: number;
  time: string;
}

// 좌석 정보 타입 (MongoDB에서 가져온 데이터용)
export interface Seat {
  _id?: string;
  seatId: string;       // 좌석 고유 ID (A1, B2, ...)
  movieId: string;      // 어떤 영화의 좌석인지
  status: "available" | "booked";
  grade: "standard" | "premium";
  priceMultiplier: number;
}

// 예매 정보 타입
export interface Booking {
  _id?: string;
  movieId: string;
  movieTitle: string;
  seatIds: string[];
  totalPrice: number;
  createdAt?: string;
}

// 좌석 행/열 상수 (UI 렌더링용)
export const ROWS = ["A", "B", "C", "D", "E"];
export const COLS = [1, 2, 3, 4, 5, 6, 7, 8];
