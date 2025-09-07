// src/components/TodoItem.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Todo } from './types';

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, newText: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, toggleTodo, deleteTodo, editTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (text.trim()) {
      editTodo(todo.id, text);
    } else {
      setText(todo.text); // 빈 값일 경우 원래 텍스트로 복원
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <li className="group flex items-center p-2 rounded hover:bg-gray-100 transition-colors">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        className="h-4 w-4 mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        aria-label="Complete todo"
      />
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="flex-grow bg-transparent border-b-2 border-blue-500 outline-none"
          aria-label="Edit todo" 
        />
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className={`flex-grow cursor-pointer ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
        >
          {todo.text}
        </span>
      )}
      <button 
        onClick={() => deleteTodo(todo.id)} 
        className="ml-auto text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
        aria-label="Delete todo"
      >
        🗑️
      </button>
    </li>
  );
};

export default TodoItem;