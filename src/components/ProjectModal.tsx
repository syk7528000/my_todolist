import React from 'react';
import { Todo } from './types';

interface ProjectModalProps {
  todo: Todo;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ todo, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{todo.text}</h2>
          <button onClick={onClose} className="text-2xl font-bold">&times;</button>
        </div>
        <div className="mt-4 max-h-80 overflow-y-auto">
          {todo.subTodos && todo.subTodos.length > 0 ? (
            <ul className="space-y-2">
              {todo.subTodos.map(sub => (
                <li key={sub.id} className={`flex items-center p-2 rounded ${sub.completed ? 'bg-gray-100' : ''}`}>
                  {/* 1. 체크박스에 고유한 id를 추가합니다. */}
                  <input 
                    type="checkbox" 
                    id={`modal-subtodo-${sub.id}`}
                    checked={sub.completed} 
                    readOnly 
                    className="h-4 w-4 mr-3" 
                  />
                  {/* 2. span을 label로 변경하고, htmlFor로 체크박스와 연결합니다. */}
                  <label 
                    htmlFor={`modal-subtodo-${sub.id}`}
                    className={sub.completed ? 'line-through text-gray-500' : ''}
                  >
                    {sub.text}
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">하위 항목이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;