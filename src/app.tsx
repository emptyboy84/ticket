// ==========================================
// 메인 앱 (src/App.tsx)
// ==========================================
import { useEffect, useState } from "react";
import BookingSummary from "./components/bookingSummary";
import SeatButton from "./components/seatButton";
import { MOCK_SEATS, mockMovies, Movie, ROWS, Seat } from "./types";


export default function App() {
   // 상태 관리 (기억 장치들)
   const [step, setStep] = useState<'home' | 'booking' | 'success'>('home');
   const [movies, setMovies] = useState<Movie[]>([]); // 👈 서버에서 가져올 영화 목록
   const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
   const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

   // 💡 화면이 처음 켜질 때 서버에서 데이터를 가져오는 시뮬레이션
   useEffect(() => {
      setMovies(mockMovies);
   }, []); // 빈 배열 = 처음 한 번만 실행!

   // 좌석 클릭 로직
   const toggleSeat = (targetSeat: Seat) => {
      if (targetSeat.status === 'booked') return;
      const isAlreadySelected = selectedSeats.some(seat => seat.id === targetSeat.id);

      if (isAlreadySelected) {
         setSelectedSeats(prev => prev.filter(seat => seat.id !== targetSeat.id));
      } else {
         if (selectedSeats.length >= 4) {
            alert("최대 4장까지만 예매할 수 있습니다.");
            return;
         }
         setSelectedSeats(prev => [...prev, targetSeat]);
      }
   };

   // 총 결제 금액 계산
   const totalPrice = selectedMovie
      ? selectedSeats.reduce((total, seat) => total + (selectedMovie.basePrice * seat.priceMultiplier), 0)
      : 0;

   // 화면 이동 함수들
   const goToBooking = (movie: Movie) => {
      setSelectedMovie(movie);
      setSelectedSeats([]);
      setStep('booking');
   };

   const goToSuccess = () => {
      setStep('success');
   };

   const goToHome = () => {
      setStep('home');
      setSelectedMovie(null);
      setSelectedSeats([]);
   };

   // 1️⃣ 영화 목록 화면
   if (step === 'home') {
      return (
         <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
            <h1 className="text-4xl font-bold mb-10 text-center mt-10">🍿 CINEMA NEXT</h1>
            <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
               {movies.map(movie => (
                  <div
                     key={movie.id}
                     className="bg-gray-800 rounded-2xl p-4 w-72 cursor-pointer hover:-translate-y-2 transition-all border border-gray-700"
                     onClick={() => goToBooking(movie)}
                  >
                     <div className={`w-full h-96 ${movie.posterColor} rounded-xl mb-4 flex items-center justify-center text-gray-400 font-bold text-2xl`}>POSTER</div>
                     <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
                     <p className="text-indigo-400 font-bold">{movie.basePrice.toLocaleString()}원</p>
                  </div>
               ))}
            </div>
         </div>
      );
   }

   // 3️⃣ 결제 완료 화면
   if (step === 'success' && selectedMovie) {
      return (
         <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-sans p-8">
            <div className="bg-gray-800 p-10 rounded-3xl text-center max-w-md w-full border border-gray-700">
               <h1 className="text-3xl font-bold mb-8 text-green-400 mt-6">🎟️ 예매 완료!</h1>
               <p className="text-2xl font-bold mb-2">{selectedMovie.title}</p>
               <p className="text-gray-400 mb-6">총 결제 금액: {totalPrice.toLocaleString()}원</p>
               <button onClick={goToHome} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl">메인으로</button>
            </div>
         </div>
      );
   }

   // 2️⃣ 좌석 선택 화면
   return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center font-sans pb-32">
         <div className="w-full bg-gray-800 p-4 mb-8">
            <button onClick={goToHome} className="text-gray-400">← 뒤로가기</button>
         </div>

         {/* 좌석 배치도 */}
         <div className="flex flex-col gap-5">
            {ROWS.map(row => (
               <div key={row} className="flex gap-4 items-center justify-center">
                  <div className="w-8 text-center text-gray-500 font-bold text-lg">{row}</div>
                  <div className="flex gap-3">
                     {MOCK_SEATS.filter(seat => seat.id.startsWith(row)).map(seat => (
                        <SeatButton
                           key={seat.id}
                           seat={seat}
                           isSelected={selectedSeats.some(s => s.id === seat.id)}
                           onSeatClick={toggleSeat}
                        />
                     ))}
                  </div>
               </div>
            ))}
         </div>

         {/* 방금 만든 하단 결제창 부품 조립! */}
         <BookingSummary
            selectedSeats={selectedSeats}
            totalPrice={totalPrice}
            onCheckout={goToSuccess}
         />
      </div>
   );
}