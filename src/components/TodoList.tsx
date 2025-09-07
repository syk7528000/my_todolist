import React from 'react';
import { Todo } from './types';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, newText: string) => void; // editTodo prop 추가
}

const TodoList: React.FC<TodoListProps> = ({ todos, toggleTodo, deleteTodo, editTodo }) => {
  return (
    <ul className="space-y-2">
      {todos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          toggleTodo={toggleTodo} 
          deleteTodo={deleteTodo} 
          editTodo={editTodo} // editTodo prop 전달
        />
      ))}
    </ul>
  );
};

export default TodoList;