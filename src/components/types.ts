export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date?: string; // 선택적 날짜 속성
}
