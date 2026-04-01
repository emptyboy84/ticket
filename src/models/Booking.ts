// ==========================================
// Booking 모델 (Mongoose 스키마)
// MongoDB의 'bookings' 컬렉션과 1:1 매핑
// ==========================================
import mongoose, { Schema, Document } from "mongoose";

// TypeScript 인터페이스: 예매 문서의 타입 정의
export interface IBooking extends Document {
  movieId: string;       // 영화 ID
  movieTitle: string;    // 영화 제목 (조회 편의)
  seatIds: string[];     // 예매된 좌석 ID 배열
  totalPrice: number;    // 총 결제 금액
  createdAt: Date;       // 예매 시각
}

// Mongoose 스키마 정의
const BookingSchema = new Schema<IBooking>(
  {
    movieId: { type: String, required: true },
    movieTitle: { type: String, required: true },
    seatIds: { type: [String], required: true },
    totalPrice: { type: Number, required: true },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

export default mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);
