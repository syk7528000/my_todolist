import React from 'react';
import { Todo } from './types';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, newText: string) => void;
  addSubTodo: (parentId: number, text: string) => void;
  // 하위 항목 제어 함수 props 추가
  toggleSubTodo: (parentId: number, subTodoId: number) => void;
  deleteSubTodo: (parentId: number, subTodoId: number) => void;
  editSubTodo: (parentId: number, subTodoId: number, newText: string) => void;
  onItemClick?: (todo: Todo) => void; // 클릭 핸들러 prop 추가 (optional)
}

const TodoList: React.FC<TodoListProps> = (props) => {
  return (
    // 목록 상단에 구분선 추가 및 간격 조절
    <ul className="space-y-2 mt-6 pt-4 border-t">
      {props.todos.map(todo => (
        <TodoItem 
          key={todo.id} 
          {...props}
          todo={todo}
          onItemClick={props.onItemClick} // TodoItem으로 전달
        />
      ))}
    </ul>
  );
};

export default TodoList;