// ==========================================
// GET /api/bookings/[id] - 예매 상세 조회 API
// ==========================================
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { NextRequest, NextResponse } from "next/server";

/**
 * 💡 동적 라우트: [id] 부분이 URL 파라미터로 전달됩니다.
 * 예: GET /api/bookings/abc123 → params.id = "abc123"
 */
export async function GET( //async는 비동기 함수를 선언할 때 사용합니다.
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();//데이터베이스 연결 await은 비동기 함수에서 동기적으로 실행되도록 합니다.

    const { id } = await params;

    const booking = await Booking.findById(id).lean();

    if (!booking) {
      return NextResponse.json(
        { error: "예매 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(booking, { status: 200 });//예매 정보 반환
  } catch (error) {
    console.error("예매 조회 실패:", error);
    return NextResponse.json(
      { error: "예매 정보를 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
