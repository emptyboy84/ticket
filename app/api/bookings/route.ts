// ==========================================
// POST /api/bookings - 예매 생성 API
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Seat from "@/models/Seat";

/**
 * 💡 예매 생성 흐름:
 *
 * 1. 클라이언트가 { movieId, movieTitle, seatIds, totalPrice }를 POST
 * 2. 선택된 좌석들이 아직 예매 가능한지 확인 (동시 예매 방지)
 * 3. 좌석 상태를 'booked'로 변경
 * 4. Booking 문서 생성
 * 5. 생성된 예매 정보 반환
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { movieId, movieTitle, seatIds, totalPrice } = body;

    // 필수 값 검증
    if (!movieId || !movieTitle || !seatIds || !totalPrice) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 1️⃣ 선택된 좌석이 아직 예매 가능한지 확인
    const seats = await Seat.find({
      movieId,
      seatId: { $in: seatIds },
    });

    const alreadyBooked = seats.filter((s) => s.status === "booked");
    if (alreadyBooked.length > 0) {
      return NextResponse.json(
        {
          error: "이미 예매된 좌석이 포함되어 있습니다.",
          bookedSeats: alreadyBooked.map((s) => s.seatId),
        },
        { status: 409 } // 409 Conflict
      );
    }

    // 2️⃣ 좌석 상태를 'booked'로 업데이트
    await Seat.updateMany(
      { movieId, seatId: { $in: seatIds } },
      { $set: { status: "booked" } }
    );

    // 3️⃣ Booking 문서 생성
    const booking = await Booking.create({
      movieId,
      movieTitle,
      seatIds,
      totalPrice,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("예매 생성 실패:", error);
    return NextResponse.json(
      { error: "예매 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
