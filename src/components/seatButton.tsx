// components/SeatButton.tsx 에 들어갈 타입 정의
import { Seat } from "../types";


interface SeatButtonProps {
   seat: Seat; // 1. 부모가 주는 좌석 정보 (예매 상태, 등급 등)
   onSeatClick: (targetSeat: Seat) => void; // 2. 클릭 시 부모에게 알려줄 함수(부모가 주는 '리모컨' (함수))
}

// SeatButton 컴포넌트
export default function SeatButton({ seat, onSeatClick }: SeatButtonProps) {
   // 좌석 상태(status)나 등급(grade)에 따라 배경색을 다르게 하는 로직
   let bgColor = "bg-gray-300";
   if (seat.status === "booked") bgColor: "bg-gray-100";


   return (

      <button
         className={`w-12 h12 rounded-t-xl ${bgColor}`}
         onClick={seat.status === "booked" ? undefined : () => onSeatClick(seat)}>
         {seat.id}

      </button>
   );
}