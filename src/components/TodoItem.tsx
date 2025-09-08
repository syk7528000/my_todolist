// src/components/TodoItem.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Todo } from './types';
import { ChevronRight, ChevronDown, Plus } from 'react-bootstrap-icons';
import SubTodoItem from './SubTodoItem'; // SubTodoItem 컴포넌트 임포트

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, newText: string) => void;
  addSubTodo: (parentId: number, text: string) => void;
  toggleSubTodo: (parentId: number, subTodoId: number) => void;
  deleteSubTodo: (parentId: number, subTodoId: number) => void;
  editSubTodo: (parentId: number, subTodoId: number, newText: string) => void;
  onItemClick?: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = (props) => {
  const { todo, toggleTodo, deleteTodo, editTodo, addSubTodo, onItemClick } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(todo.text);
  const [isAddingSub, setIsAddingSub] = useState(false);
  const [subText, setSubText] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleSave = () => {
    if (text.trim()) editTodo(todo.id, text);
    else setText(todo.text);
    setIsEditing(false);
  };

  const handleSubTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subText.trim()) {
      addSubTodo(todo.id, subText);
      setSubText('');
      setIsAddingSub(false);
    }
  };

  return (
    <li 
      className="group border-b last:border-b-0 py-1"
      onClick={() => onItemClick && onItemClick(todo)} // 클릭 이벤트 핸들러 추가
    >
      <div className="flex items-center p-2 rounded hover:bg-gray-100 transition-colors">
        <button onClick={() => setIsExpanded(!isExpanded)} className="mr-1 p-1">
          {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
        <input
          type="checkbox"
          id={`todo-check-${todo.id}`}
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          className="h-4 w-4 mr-3 rounded border-gray-300"
        />
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="flex-grow bg-transparent border-b-2 border-blue-500 outline-none"
            placeholder="할 일 내용"
          />
        ) : (
          <label
            htmlFor={`todo-check-${todo.id}`}
            onClick={() => setIsEditing(true)}
            className={`flex-grow cursor-pointer ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
          >
            {todo.text}
          </label>
        )}
        <button 
          onClick={() => deleteTodo(todo.id)} 
          className="ml-auto text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500"
        >
          🗑️
        </button>
      </div>

      {isExpanded && (
        // 하위 항목 영역에 왼쪽 들여쓰기 선과 패딩 추가
        <div className="ml-6 pl-6 border-l-2 border-gray-200">
          <ul className="space-y-1 pt-2 pb-1">
            {props.todo.subTodos?.map(sub => (
              <SubTodoItem
                key={sub.id}
                subTodo={sub}
                parentId={props.todo.id}
                toggleSubTodo={props.toggleSubTodo}
                deleteSubTodo={props.deleteSubTodo}
                editSubTodo={props.editSubTodo}
              />
            ))}
          </ul>
          {isAddingSub ? (
            <form onSubmit={handleSubTodoSubmit} className="flex gap-2 mt-2">
              <input
                type="text"
                value={subText}
                onChange={(e) => setSubText(e.target.value)}
                placeholder="하위 항목 내용..."
                className="flex-grow p-1 text-sm bg-gray-100 rounded-md focus:outline-none"
                autoFocus
              />
              <button type="submit" className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">추가</button>
            </form>
          ) : (
            <button onClick={() => setIsAddingSub(true)} className="flex items-center text-sm text-gray-500 mt-2 p-1 hover:bg-gray-200 rounded w-full">
              <Plus size={14} className="mr-2" /> 항목 추가
            </button>
          )}
        </div>
      )}
    </li>
  );
};

export default TodoItem;