// ==========================================
// GET /api/movies - 영화 목록 조회 API
// ==========================================
import dbConnect from "@/lib/mongodb";
import Movie from "@/models/Movie";
import { NextResponse } from "next/server";

/**
 * 💡 이 함수는 브라우저에서 fetch('/api/movies')로 호출됩니다.
 * 
 * 흐름:
 * 1. MongoDB에 연결
 * 2. movies 컬렉션에서 모든 영화 조회
 * 3. JSON으로 반환
 */
export async function GET() {
  try {
    // DB 연결 (이미 연결되어 있으면 캐시 사용)
    await dbConnect();

    // MongoDB에서 모든 영화 조회
    const movies = await Movie.find({}).lean();//.lean()은 Mongoose 문서가 아닌 일반 JS 객체로 반환 (더 빠름)

    // 💡 .lean()은 Mongoose 문서가 아닌 일반 JS 객체로 반환 (더 빠름)
    return NextResponse.json(movies, { status: 200 });
  } catch (error) {
    console.error("영화 목록 조회 실패:", error);
    return NextResponse.json(
      { error: "영화 목록을 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
