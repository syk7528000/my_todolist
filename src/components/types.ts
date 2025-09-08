export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date?: string;
  subTodos?: Todo[];
  view?: string; 
}

// 작업을 위한 새로운 타입을 정의합니다.
export interface Project {
  id: number;
  name: string;
}
