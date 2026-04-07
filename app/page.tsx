"use client";
// ==========================================
// 메인 앱 (app/page.tsx)
// MongoDB API를 사용하는 풀스택 버전
// ==========================================
import BookingSummary from "@/components/BookingSummary";
import SeatButton from "@/components/SeatButton";
import { Movie, ROWS, Seat } from "@/types";
import { useEffect, useState } from "react";

export default function Home() {
  // ==========================================
  // 상태 관리 (State)
  // ==========================================
  const [step, setStep] = useState<"home" | "booking" | "success">("home");
  const [movies, setMovies] = useState<Movie[]>([]); // 서버에서 가져올 영화 목록
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]); // 서버에서 가져올 좌석 목록
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [bookingId, setBookingId] = useState<string | null>(null); // 예매 ID
  const [error, setError] = useState<string | null>(null); // 에러 메시지

  // ==========================================
  // 1️⃣ 영화 목록을 서버(MongoDB)에서 가져오기
  // ==========================================
  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        const res = await fetch("/api/movies");
        if (!res.ok) throw new Error("영화 목록 조회 실패");
        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error(err);
        setError("영화 목록을 불러오는데 실패했습니다. 시드 데이터를 먼저 생성해주세요.");
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  // ==========================================
  // 2️⃣ 영화 클릭 → 해당 영화의 좌석을 서버에서 가져오기
  // ==========================================
  const goToBooking = async (movie: Movie) => {
    setSelectedMovie(movie);
    setSelectedSeats([]);
    setStep("booking");
    setLoading(true);

    try {
      const res = await fetch(`/api/seats?movieId=${movie.movieId}`);
      if (!res.ok) throw new Error("좌석 조회 실패");
      const data = await res.json();
      setSeats(data);
    } catch (err) {
      console.error(err);
      setError("좌석 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 3️⃣ 좌석 클릭 로직 (변경 없음)
  // ==========================================
  const toggleSeat = (targetSeat: Seat) => {
    if (targetSeat.status === "booked") return;
    const isAlreadySelected = selectedSeats.some(
      (seat) => seat.seatId === targetSeat.seatId
    );

    if (isAlreadySelected) {
      setSelectedSeats((prev) =>
        prev.filter((seat) => seat.seatId !== targetSeat.seatId)
      );
    } else {
      if (selectedSeats.length >= 4) {
        alert("최대 4장까지만 예매할 수 있습니다.");
        return;
      }
      setSelectedSeats((prev) => [...prev, targetSeat]);
    }
  };

  // ==========================================
  // 4️⃣ 결제하기 → 서버에 예매 요청 (핵심 변경!)
  // ==========================================
  const goToSuccess = async () => {
    if (!selectedMovie || selectedSeats.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: selectedMovie.movieId,
          movieTitle: selectedMovie.title,
          seatIds: selectedSeats.map((s) => s.seatId),
          totalPrice,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "예매 실패");
      }

      const booking = await res.json();
      setBookingId(booking._id);
      setStep("success");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "예매 처리 중 오류가 발생했습니다.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 총 결제 금액 계산
  const totalPrice = selectedMovie
    ? selectedSeats.reduce(
      (total, seat) =>
        total + selectedMovie.basePrice * seat.priceMultiplier,
      0
    )
    : 0;

  const goToHome = () => {
    setStep("home");
    setSelectedMovie(null);
    setSelectedSeats([]);
    setSeats([]);
    setBookingId(null);
    setError(null);
  };

  // ==========================================
  // 시드 데이터 생성 함수
  // ==========================================
  const seedData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      if (!res.ok) throw new Error("시드 데이터 생성 실패");
      const data = await res.json();
      alert(data.message);
      // 시드 후 영화 목록 다시 불러오기
      const moviesRes = await fetch("/api/movies");
      const moviesData = await moviesRes.json();
      setMovies(moviesData);
      setError(null);
    } catch (err) {
      console.error(err);
      alert("시드 데이터 생성에 실패했습니다. MongoDB 연결을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 🎨 화면 렌더링
  // ==========================================

  // 1️⃣ 영화 목록 화면
  if (step === "home") {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
        <h1 className="text-4xl font-bold mb-10 text-center mt-10">
          🍿 CINEMA NEXT
        </h1>

        {/* 서버 연동 테스트용 시드 버튼 (항상 표시) */}
        {!loading && (
          <div className="text-center mb-8 border border-gray-700 p-4 rounded-xl">
            <p className="text-gray-400 mb-4 whitespace-pre-line">
              {error || "💡 데이터베이스(MongoDB)에 데이터 밀어넣기 테스트"}
            </p>
            <button
              onClick={seedData}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
            >
              🌱 초기 데이터 생성하기 (DB로 전송)
            </button>
          </div>
        )}

        {/* 로딩 표시 */}
        {loading && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="text-gray-400 mt-4">로딩 중...</p>
          </div>
        )}

        {/* 영화 목록 */}
        <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
          {movies.map((movie) => (
            <div
              key={movie.movieId}
              className="bg-gray-800 rounded-2xl p-4 w-72 cursor-pointer hover:-translate-y-2 transition-all border border-gray-700 hover:border-indigo-500"
              onClick={() => goToBooking(movie)}
            >
              {movie.posterUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-96 object-cover rounded-xl mb-4 shadow-lg shadow-black/50 group-hover:shadow-indigo-500/50 transition-shadow"
                />
              ) : (
                <div
                  className={`w-full h-96 ${movie.posterColor} rounded-xl mb-4 flex items-center justify-center text-gray-400 font-bold text-2xl shadow-lg shadow-black/50 group-hover:shadow-indigo-500/50 transition-shadow`}
                >
                  🎬
                </div>
              )}
              <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
              <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                <span>{movie.genre}</span>
                <span>{movie.runningTime}분</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-indigo-400 font-bold text-lg">
                  {movie.basePrice.toLocaleString()}원
                </p>
                <span className="text-gray-500 text-sm">🕐 {movie.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3️⃣ 결제 완료 화면
  if (step === "success" && selectedMovie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-sans p-8">
        <div className="bg-gray-800 p-10 rounded-3xl text-center max-w-md w-full border border-gray-700">
          <h1 className="text-3xl font-bold mb-8 text-green-400 mt-6">
            🎟️ 예매 완료!
          </h1>
          <p className="text-2xl font-bold mb-2">{selectedMovie.title}</p>
          <p className="text-gray-400 mb-2">
            좌석: {selectedSeats.map((s) => s.seatId).join(", ")}
          </p>
          <p className="text-gray-400 mb-2">
            총 결제 금액: {totalPrice.toLocaleString()}원
          </p>
          {bookingId && (
            <p className="text-gray-500 text-sm mb-6">
              예매번호: {bookingId}
            </p>
          )}
          <button
            onClick={goToHome}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-colors"
          >
            메인으로
          </button>
        </div>
      </div>
    );
  }

  // 2️⃣ 좌석 선택 화면
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center font-sans pb-32">
      <div className="w-full bg-gray-800 p-4 mb-8 flex items-center justify-between">
        <button onClick={goToHome} className="text-gray-400 hover:text-white transition-colors">
          ← 뒤로가기
        </button>
        {selectedMovie && (
          <h2 className="text-lg font-bold">{selectedMovie.title}</h2>
        )}
        <div className="w-20"></div>
      </div>

      {/* 로딩 표시 */}
      {loading && (
        <div className="text-center mt-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-gray-400 mt-4">좌석 정보 로딩 중...</p>
        </div>
      )}

      {/* 스크린 표시 */}
      {!loading && (
        <>
          <div className="w-80 h-2 bg-indigo-500 rounded-full mb-2 mx-auto"></div>
          <p className="text-gray-500 text-sm mb-8">SCREEN</p>

          {/* 좌석 범례 */}
          <div className="flex gap-6 mb-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
              <span>일반석</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>프리미엄석</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-indigo-500 rounded"></div>
              <span>선택됨</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-700 rounded opacity-50"></div>
              <span>예매됨</span>
            </div>
          </div>

          {/* 좌석 배치도 */}
          <div className="flex flex-col gap-5">
            {ROWS.map((row) => (
              <div key={row} className="flex gap-4 items-center justify-center">
                <div className="w-8 text-center text-gray-500 font-bold text-lg">
                  {row}
                </div>
                <div className="flex gap-3">
                  {seats
                    .filter((seat) => seat.seatId.startsWith(row))
                    .map((seat) => (
                      <SeatButton
                        key={seat.seatId}
                        seat={seat}
                        isSelected={selectedSeats.some(
                          (s) => s.seatId === seat.seatId
                        )}
                        onSeatClick={toggleSeat}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 하단 결제창 */}
      <BookingSummary
        selectedSeats={selectedSeats}
        totalPrice={totalPrice}
        onCheckout={goToSuccess}
      />
    </div>
  );
}