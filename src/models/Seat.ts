// ==========================================
// Seat 모델 (Mongoose 스키마)
// MongoDB의 'seats' 컬렉션과 1:1 매핑
// ==========================================
import mongoose, { Schema, Document } from "mongoose";

// TypeScript 인터페이스: 좌석 문서의 타입 정의
export interface ISeat extends Document {
  seatId: string;           // 좌석 ID (A1, A2, B1, ...)
  movieId: string;          // 어떤 영화의 좌석인지
  status: "available" | "booked"; // 예매 가능 / 예매됨
  grade: "standard" | "premium";  // 등급
  priceMultiplier: number;  // 가격 배수 (standard=1.0, premium=1.2)
}

// Mongoose 스키마 정의
const SeatSchema = new Schema<ISeat>({
  seatId: { type: String, required: true },
  movieId: { type: String, required: true },
  status: {
    type: String,
    enum: ["available", "booked"],
    default: "available",
  },
  grade: {
    type: String,
    enum: ["standard", "premium"],
    default: "standard",
  },
  priceMultiplier: { type: Number, default: 1.0 },
});

// 같은 영화의 같은 좌석은 하나만 존재하도록 복합 인덱스
SeatSchema.index({ seatId: 1, movieId: 1 }, { unique: true });

export default mongoose.models.Seat ||
  mongoose.model<ISeat>("Seat", SeatSchema);
