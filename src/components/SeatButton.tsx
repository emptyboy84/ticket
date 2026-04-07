// ==========================================
// SeatButton 컴포넌트
// MongoDB에서 가져온 좌석 데이터를 렌더링
// ==========================================
import { Seat } from "../types";

interface SeatButtonProps {
  seat: Seat;
  onSeatClick: (targetSeat: Seat) => void;
  isSelected: boolean;
}

export default function SeatButton({
  seat,
  onSeatClick,
  isSelected,
}: SeatButtonProps) {
  const isPremium = seat.grade === "premium";

  // 상태에 따른 스타일 결정
  let seatClass =
    "w-12 h-12 rounded-t-xl rounded-b-md font-bold text-sm transition-all duration-200 flex items-center justify-center border-b-4 ";

  if (seat.status === "booked") {
    seatClass +=
      "bg-gray-700 border-gray-800 text-gray-600 cursor-not-allowed opacity-50";
  } else if (isSelected) {
    seatClass += "bg-indigo-500 border-indigo-600 text-white cursor-pointer hover:bg-indigo-400";
  } else if (isPremium) {
    seatClass += "bg-yellow-500 border-yellow-600 text-white cursor-pointer hover:bg-yellow-400";
  } else {
    seatClass += "bg-gray-600 border-gray-700 text-gray-300 cursor-pointer hover:bg-gray-500";
  }

  return (
    <button
      className={seatClass}
      onClick={() => onSeatClick(seat)}
      disabled={seat.status === "booked"}
      title={`${seat.seatId} (${seat.grade === "premium" ? "프리미엄" : "일반"})`}
    >
      {seat.status === "booked" ? "X" : seat.seatId.charAt(0)}
      {/* A1 → "A", B2 → "B" 표시 */}
    </button>
  );
}