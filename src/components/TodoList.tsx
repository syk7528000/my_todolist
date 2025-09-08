import React from 'react';
import { Todo, Priority } from './types';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, newText: string) => void;
  changeTodoPriority: (id: number, priority: Priority) => void;
  addSubTodo: (parentId: number, text: string) => void;
  // 하위 항목 제어 함수 props 추가
  toggleSubTodo: (parentId: number, subTodoId: number) => void;
  deleteSubTodo: (parentId: number, subTodoId: number) => void;
  editSubTodo: (parentId: number, subTodoId: number, newText: string) => void;
}

const TodoList: React.FC<TodoListProps> = (props) => {
  return (
    <ul className="space-y-1 mt-4 pt-4 border-t border-slate-200/80">
      {props.todos.map(todo => (
        <TodoItem 
          key={todo.id} 
          {...props}
          todo={todo}
        />
      ))}
    </ul>
  );
};

export default TodoList;