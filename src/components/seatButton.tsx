// components/SeatButton.tsx 에 들어갈 타입 정의
import { Seat } from "../types";


interface SeatButtonProps {
   seat: Seat; // 1. 부모가 주는 좌석 정보 (예매 상태, 등급 등)
   onSeatClick: (targetSeat: Seat) => void; // 2. 클릭 시 부모에게 알려줄 함수(부모가 주는 '리모컨' (함수))
   isSelected: boolean;//선택 여부

}


// SeatButton 컴포넌트
export default function SeatButton({ seat, onSeatClick, isSelected }: SeatButtonProps) {
   const isPremium = seat.grade === "premium";
   let seatClass = "w-12 h12 rounded-t-xl rounded-b-md font-bold text-sm transition-all duration-200 flex items-center justify-center border-b-4 ";
   let bgColor = "bg-gray-300";

   if (seat.status === "booked") {
      seatClass += "bg-gray-700 border-gray-800 text-gray-600 cursor-not-allowed opacity-50";

   } else if (isSelected) {
      seatClass += "bg-indigo-500 border-blue-600 text-white";
   } else if (isPremium) {
      seatClass += "bg-yellow-500 border-yellow-600 text-white";
   }


   return (

      <button
         className={`w-12 h12 rounded-t-xl ${bgColor}`}
         onClick={seat.status === "booked" ? undefined : () => onSeatClick(seat)}>
         {seat.id}

      </button>
   );
}