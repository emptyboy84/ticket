// ==========================================
// POST /api/seed - 초기 데이터 생성 API
// ==========================================
// 💡 이 API는 DB에 테스트 데이터를 넣을 때 한 번만 호출합니다.
// 브라우저에서 /api/seed 로 POST 요청을 보내면 됩니다.
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Movie from "@/models/Movie";
import Seat from "@/models/Seat";

// 영화 초기 데이터
const SEED_MOVIES = [
  {
    movieId: "m1",
    title: "어벤져스: 엔드게임",
    posterColor: "bg-purple-800",
    runningTime: 181,
    genre: "액션",
    basePrice: 15000,
    time: "14:00",
  },
  {
    movieId: "m2",
    title: "인터스텔라",
    posterColor: "bg-blue-900",
    runningTime: 169,
    genre: "SF",
    basePrice: 13000,
    time: "17:30",
  },
  {
    movieId: "m3",
    title: "기생충",
    posterColor: "bg-green-800",
    runningTime: 132,
    genre: "드라마",
    basePrice: 12000,
    time: "20:00",
  },
];

// 좌석 생성 함수
const ROWS = ["A", "B", "C", "D", "E"];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8];

function generateSeats(movieId: string) {
  return ROWS.flatMap((row) =>
    COLS.map((col) => ({
      seatId: `${row}${col}`,
      movieId,
      status: "available" as const, // 처음엔 모든 좌석 예매 가능
      grade: (row === "D" || row === "E" ? "premium" : "standard") as
        | "standard"
        | "premium",
      priceMultiplier: row === "D" || row === "E" ? 1.2 : 1.0,
    }))
  );
}

export async function POST() {
  try {
    await dbConnect();

    // 기존 데이터 삭제 (클린 시드)
    await Movie.deleteMany({});
    await Seat.deleteMany({});

    // 영화 데이터 삽입
    await Movie.insertMany(SEED_MOVIES);

    // 각 영화별 좌석 데이터 생성 & 삽입
    const allSeats = SEED_MOVIES.flatMap((movie) =>
      generateSeats(movie.movieId)
    );
    await Seat.insertMany(allSeats);

    return NextResponse.json(
      {
        message: "✅ 초기 데이터 생성 완료!",
        movies: SEED_MOVIES.length,
        seats: allSeats.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("시드 데이터 생성 실패:", error);
    return NextResponse.json(
      { error: "초기 데이터 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
