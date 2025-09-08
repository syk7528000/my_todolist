// src/components/TodoItem.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Todo, Priority } from './types';
import { ChevronRight, ChevronDown, Plus, Trash } from 'react-bootstrap-icons';
import SubTodoItem from './SubTodoItem'; // SubTodoItem 컴포넌트 임포트

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, newText: string) => void;
  changeTodoPriority: (id: number, priority: Priority) => void;
  addSubTodo: (parentId: number, text: string) => void;
  toggleSubTodo: (parentId: number, subTodoId: number) => void;
  deleteSubTodo: (parentId: number, subTodoId: number) => void;
  editSubTodo: (parentId: number, subTodoId: number, newText: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = (props) => {
  const { todo, toggleTodo, deleteTodo, editTodo, addSubTodo, changeTodoPriority } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(todo.text);
  const [isAddingSub, setIsAddingSub] = useState(false);
  const [subText, setSubText] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isPriorityMenuOpen, setPriorityMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const priorityRef = useRef<HTMLDivElement>(null);

  const priorityColorClasses = {
    '높음': 'bg-red-100 text-red-800 hover:bg-red-200 ring-red-200',
    '중간': 'bg-sky-100 text-sky-800 hover:bg-sky-200 ring-sky-200',
    '낮음': 'bg-slate-100 text-slate-800 hover:bg-slate-200 ring-slate-200',
  };

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

  // 외부 클릭 감지하여 우선순위 메뉴 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (priorityRef.current && !priorityRef.current.contains(event.target as Node)) {
        setPriorityMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [priorityRef]);


  return (
    <li className="group bg-white rounded-lg transition-shadow duration-200 hover:shadow-sm">
      <div className="flex items-center p-2.5">
        <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="mr-1 p-1">
          {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
        <input
          type="checkbox"
          id={`todo-check-${todo.id}`}
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          className="h-4 w-4 mr-3 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
        />
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()} 
            className="flex-grow bg-transparent border-b-2 border-sky-500 outline-none"
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
        <div className="relative" ref={priorityRef}>
          <button
            type="button"
            onClick={() => setPriorityMenuOpen(!isPriorityMenuOpen)} 
            className={`ml-4 text-xs font-semibold px-2 py-1 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 hover:ring-2 ${
              priorityColorClasses[todo.priority || '낮음']
            }`}
          >
            {todo.priority || '우선순위'}
          </button>
          {isPriorityMenuOpen && (
            <div className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg z-20 border">
              <ul className="py-1">
                {(['높음', '중간', '낮음'] as Priority[]).map(p => (
                  <li key={p}>
                    <button type="button" onClick={() => { changeTodoPriority(todo.id, p); setPriorityMenuOpen(false); }} 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {p}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button 
          type="button"
          onClick={() => deleteTodo(todo.id)}
          className="ml-2 p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors"
        >
          <Trash size={14} />
        </button>
      </div>

      {isExpanded && (
        <div className="ml-6 pl-6 border-l-2 border-slate-200/80 pb-2">
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
                placeholder="하위 항목 추가"
                className="flex-grow p-1 text-sm bg-slate-100 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-400"
                autoFocus
              />
              <button type="submit" className="text-sm bg-sky-100 text-sky-700 px-2 py-1 rounded">추가</button>
            </form>
          ) : (
            <button type="button" onClick={() => setIsAddingSub(true)} className="flex items-center text-sm text-slate-500 mt-1 p-1 hover:bg-slate-100 rounded w-full">
              <Plus size={14} className="mr-2" /> 항목 추가
            </button>
          )}
        </div>
      )}
    </li>
  );
};

export default TodoItem;