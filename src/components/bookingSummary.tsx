//예약정보 요약
import { Seat } from "../types";


interface BookingSummaryProps {// props는 부모 컴포넌트에서 전달받는 데이터
   selectedSeats: Seat[];
   totalPrice: number;
   onCheckout: () => void;//결제하기 버튼을 눌렀을 때 실행할 함수

}

export default function BookingSummary({ selectedSeats, totalPrice, onCheckout }: BookingSummaryProps) {
   //하단 결제창을 그리는 블록
   return (
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 p-6 flex justify-between items-center z-10">
         <h2 className="text-xl font-bold mb-4 text-gray-800">예매 요약</h2>

         {/* 왼쪽: 선택 내역 및 금액 표시 */}
         <div>
            <p className="text-gray-400 text-sm">
               선택좌석:{selectedSeats.map(seat => seat.id).join(',')}{/*배열을 문자열로 변환,seat) 
               seat => { return seat.id; }가축약된형태*/}
            </p>
            <p className="text-2xl font-bold">{totalPrice.toLocaleString()}원</p>
         </div>
         {/* 오른쪽: 결제 버튼 */}
         <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold"
            onClick={onCheckout} disabled={selectedSeats.length === 0}>
            결제하기
         </button>




      </div >
   );
}
