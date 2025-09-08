import React, { useState, useMemo, useEffect } from 'react';
import { Todo, Priority } from './types';
import TodoList from './TodoList';
import { Search, X } from 'react-bootstrap-icons';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, newText: string) => void;
  changeTodoPriority: (id: number, priority: Priority) => void;
  addSubTodo: (parentId: number, text: string) => void;
  toggleSubTodo: (parentId: number, subTodoId: number) => void;
  deleteSubTodo: (parentId: number, subTodoId: number) => void;
  editSubTodo: (parentId: number, subTodoId: number, newText: string) => void;
}

const SearchModal: React.FC<SearchModalProps> = (props) => {
  const { isOpen, onClose, todos } = props;
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery(''); // 모달이 닫힐 때 검색어 초기화
    }
  }, [isOpen]);

  const searchedTodos = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    return todos.filter(todo =>
      todo.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [todos, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-start pt-20 z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">할 일 검색</h2>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800 p-1 rounded-full"><X size={28} /></button>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            autoFocus
          />
        </div>
        <div className="max-h-[60vh] overflow-y-auto -mr-3 pr-3">
          <TodoList {...props} todos={searchedTodos} />
          {searchQuery.trim() && searchedTodos.length === 0 && <p className="text-center text-gray-500 mt-8">검색 결과가 없습니다.</p>}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;