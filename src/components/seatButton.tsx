// components/SeatButton.tsx 에 들어갈 타입 정의
import { Seat } from "../types";



interface SeatButtonProps {
   seat: Seat; // 1. 부모가 주는 좌석 정보 (예매 상태, 등급 등)
   onSeatClick: (targetSeat: Seat) => void; // 2. 클릭 시 부모에게 알려줄 함수(부모가 주는 '리모컨' (함수))
   isSelected: boolean;//선택 여부

}


// SeatButton 컴포넌트 
export default function SeatButton({ seat, onSeatClick, isSelected }: SeatButtonProps) { //좌석 하나를 그리는 블록
   const isPremium = seat.grade === "premium";
   // 상태에 따른 복잡한 디자인(CSS) 결정 로직

   let seatClass = "w-12 h12 rounded-t-xl rounded-b-md font-bold text-sm transition-all duration-200 flex items-center justify-center border-b-4 ";
   let bgColor = "bg-gray-300";

   if (seat.status === "booked") { //예매된 좌석
      seatClass += "bg-gray-700 border-gray-800 text-gray-600 cursor-not-allowed opacity-50";

   } else if (isSelected) {
      seatClass += "bg-indigo-500 border-blue-600 text-white";
   } else if (isPremium) {
      seatClass += "bg-yellow-500 border-yellow-600 text-white";
   }


   return (

      <button
         className={seatClass}
         onClick={() => {
            console.log("클릭된 좌석 값 디버깅:", seat);
            onSeatClick(seat);
         }}
         disabled={seat.status === "booked"}>
         {/* 디버깅: 'A'는 아스키코드 65입니다. 여기서 64를 빼면 1, 'B'(66)에서 64를 빼면 2가 됩니다. */}
         {seat.status === "booked" ? "X" : seat.id.charCodeAt(0) - 64}
         {/* //A1->1, B1->2, C1->3, D1->4, E1->5, F1->6, G1->7, H1->8, I1->9, J1->10 */}


      </button>
   );
}