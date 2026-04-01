// ==========================================
// Movie 모델 (Mongoose 스키마)
// MongoDB의 'movies' 컬렉션과 1:1 매핑
// ==========================================
import mongoose, { Document, Schema } from "mongoose";

// TypeScript 인터페이스: 영화 문서의 타입 정의
export interface IMovie extends Document {
  movieId: string;      // 고유 식별자 (m1, m2, ...)
  title: string;        // 영화 제목
  posterColor: string;  // 포스터 배경색 (Tailwind 클래스)
  runningTime: number;  // 상영 시간 (분)
  genre: string;        // 장르
  basePrice: number;    // 기본 가격
  time: string;         // 상영 시간대
}

// Mongoose 스키마 정의: DB에 저장될 구조
const MovieSchema = new Schema<IMovie>({
  movieId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  posterColor: { type: String, required: true },
  runningTime: { type: Number, required: true },
  genre: { type: String, required: true },
  basePrice: { type: Number, required: true },
  time: { type: String, required: true },
});

// 💡 mongoose.models.Movie가 이미 있으면 재사용, 없으면 새로 생성
// (서버리스 환경에서 모델 중복 등록 방지)
export default mongoose.models.Movie ||
  mongoose.model<IMovie>("Movie", MovieSchema); 
