// ==========================================
// GET /api/bookings/[id] - 예매 상세 조회 API
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";

/**
 * 💡 동적 라우트: [id] 부분이 URL 파라미터로 전달됩니다.
 * 예: GET /api/bookings/abc123 → params.id = "abc123"
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const booking = await Booking.findById(id).lean();

    if (!booking) {
      return NextResponse.json(
        { error: "예매 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error("예매 조회 실패:", error);
    return NextResponse.json(
      { error: "예매 정보를 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
