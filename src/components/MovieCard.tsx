import { useEffect, useState } from "react";
import { Movie } from "../types";

export default function MovieCard() {
   const [movie, setMovie] = useState<Movie[]>([]);// 처음엔 영화가 0개

   useEffect(() => {
      // 1. 서버에 데이터를 요청하고 받아오는 척하는 로직
      // 2. 데이터를 다 받아오면 setMovies()를 써서 상태를 업데이트함
      setMovie(movie);//상태 업데이트

   }, []);// []안에 변수가 있으면 그 변수가 바뀔때마다 실행, 없으면 처음 한번만 실행
}