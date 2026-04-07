// ==========================================
// BookingSummary 컴포넌트 (결제 요약)
// MongoDB에서 가져온 좌석 데이터를 표시
// ==========================================
import { Seat } from "../types";

interface BookingSummaryProps { //인터페이스는 객체의 구조를 정의하는 데 사용됩니다.
  selectedSeats: Seat[];
  totalPrice: number;
  onCheckout: () => void;
}

export default function BookingSummary({
  selectedSeats,
  totalPrice,
  onCheckout,
}: BookingSummaryProps) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 border-t border-gray-700 p-6 flex justify-between items-center z-10">
      {/* 왼쪽: 선택 내역 및 금액 표시 */}
      <div>
        <p className="text-gray-400 text-sm mb-1">
          선택좌석:{" "}
          {selectedSeats.length > 0
            ? selectedSeats.map((seat) => seat.seatId).join(", ")
            : "없음"}
        </p>
        <p className="text-2xl font-bold text-white">
          {totalPrice.toLocaleString()}원
        </p>
      </div>

      {/* 오른쪽: 결제 버튼 */}
      <button
        className={`px-8 py-3 rounded-xl font-bold transition-colors ${selectedSeats.length === 0
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        onClick={onCheckout}
        disabled={selectedSeats.length === 0}
      >
        결제하기 ({selectedSeats.length}석)
      </button>
    </div>
  );
}
