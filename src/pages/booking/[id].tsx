//frontend
import BookingSummary from "../../components/bookingSummary";
//import { useRouter } from "next/router";
import { useState } from "react";


export function BookingPage() {
   //const router = useRouter();
   
   const [step, setStep] = useState<"home" | 'booking' | 'success'>('home');//현재 페이지 상태 
   // useState 함수는 실행하면 항상 두 개의 값이 들어있는 배열을 하나 탁! 뱉어냅니다.
   // (타입스크립트 제네릭)
   //이 부분은 TypeScript가 제공하는 엄격한 철통 보안 역할입니다. 
   // step 이라는 변수 안에는 무조건 저 3개의 글자 중 하나만 들어갈 수 있다고 못을 박아두는 것입니다.
   // (| 기호는 '또는(or)' 이라는 뜻입니다.)
   const goToSuccess = () => {
      setStep('success');//성공 페이지로 이동


   }

   return (
      <div>
         <BookingSummary
            selectedSeats={[]}//선택된 좌석
            totalPrice={Number()}//총 가격
            onCheckout={goToSuccess}//결제하기 버튼을 눌렀을 때 실행할 함수
         />
      </div>
   )
}
