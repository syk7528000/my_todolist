import React, { useState, useRef, useEffect } from 'react';
import { Todo } from './types';

interface SubTodoItemProps {
  subTodo: Todo;
  parentId: number;
  toggleSubTodo: (parentId: number, subTodoId: number) => void;
  deleteSubTodo: (parentId: number, subTodoId: number) => void;
  editSubTodo: (parentId: number, subTodoId: number, newText: string) => void;
}

const SubTodoItem: React.FC<SubTodoItemProps> = ({ subTodo, parentId, toggleSubTodo, deleteSubTodo, editSubTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(subTodo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleSave = () => {
    if (text.trim()) editSubTodo(parentId, subTodo.id, text);
    else setText(subTodo.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setText(subTodo.text);
      setIsEditing(false);
    }
  };

  return (
    <li className="group flex items-center text-sm p-1 rounded hover:bg-gray-50">
      <input
        type="checkbox"
        id={`subtodo-check-${subTodo.id}`}
        checked={subTodo.completed}
        onChange={() => toggleSubTodo(parentId, subTodo.id)}
        className="h-3.5 w-3.5 mr-3 rounded border-gray-300"
        aria-label={`Mark sub-task "${subTodo.text}" as complete`}
      />
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="flex-grow bg-transparent border-b border-blue-500 outline-none"
          aria-label="Edit sub-task"
        />
      ) : (
        <label
          htmlFor={`subtodo-check-${subTodo.id}`}
          onClick={() => setIsEditing(true)}
          className={`flex-grow cursor-pointer ${subTodo.completed ? 'line-through text-gray-400' : ''}`}
        >
          {subTodo.text}
        </label>
      )}
      <button 
        onClick={() => deleteSubTodo(parentId, subTodo.id)} 
        className="ml-auto text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500"
        aria-label={`Delete sub-task "${subTodo.text}"`}
      >
        🗑️
      </button>
    </li>
  );
};

export default SubTodoItem;