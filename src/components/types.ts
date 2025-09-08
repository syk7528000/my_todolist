export type Priority = '높음' | '중간' | '낮음';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date?: string;
  subTodos?: Todo[];
  view?: string;
  priority?: Priority; // 이 줄을 추가해주세요.
}

// 작업을 위한 새로운 타입을 정의합니다.
export interface Project {
  id: number;
  name: string;
  inbox?: boolean; // 이 줄을 추가해주세요.
}
