//영화정보타입
export interface Movie {
   id: string;
   title: string;
   posterColor: string;
   runningTime: number;
   genre: string;
   basePrice: number
   time: string;

}

//좌석정보타입
export interface Seat {
   id: string;
   status: 'availble' | 'booked';
   grade: "standard" | "premium";
   priceMultiplier: number;

}

// 2. 가상 데이터 세팅
// ==========================================
export const mockMovies: Movie[] = [
   {
      id: 'm1', title: "어벤져스: 엔드게임", basePrice: 15000, posterColor: "bg-purple-800", runningTime:
         181, genre: "액션", time: "14:00"
   }
];

export const ROWS = ['A', 'B', 'C', 'D', 'E'];
export const COLS = [1, 2, 3, 4, 5, 6, 7, 8];
export const MOCK_SEATS: Seat[] = ROWS.flatMap(row =>//행과 열을 합쳐서 좌석을 만듬
   COLS.map(col => ({//열을 행에 넣어서 좌석을 만듬
      id: `${row}${col}`,
      status: (row === 'C' && col === 4) ? 'booked' : 'availble',
      grade: (row === 'D' || row === 'E') ? 'premium' : 'standard',
      priceMultiplier: (row === 'D' || row === 'E') ? 1.2 : 1.0
   }))
);
