// ==========================================
// GET /api/seats?movieId=xxx - 좌석 조회 API
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Seat from "@/models/Seat";

/**
 * 💡 이 함수는 브라우저에서 fetch('/api/seats?movieId=m1')로 호출됩니다.
 *
 * 흐름:
 * 1. URL 쿼리에서 movieId 추출
 * 2. MongoDB에서 해당 영화의 좌석 조회
 * 3. JSON으로 반환
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // URL에서 movieId 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return NextResponse.json(
        { error: "movieId가 필요합니다." },
        { status: 400 }
      );
    }

    // 해당 영화의 모든 좌석 조회
    const seats = await Seat.find({ movieId }).lean();

    return NextResponse.json(seats, { status: 200 });
  } catch (error) {
    console.error("좌석 조회 실패:", error);
    return NextResponse.json(
      { error: "좌석 정보를 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
