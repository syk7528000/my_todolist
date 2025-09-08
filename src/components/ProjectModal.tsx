import React, { useMemo } from 'react';
import { Todo, Project, Priority } from './types';
import TodoList from './TodoList';
import { X } from 'react-bootstrap-icons';

interface ProjectModalProps {
  project: Project;
  todos: Todo[];
  onClose: () => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, newText: string) => void;
  changeTodoPriority: (id: number, priority: Priority) => void;
  addSubTodo: (parentId: number, text: string) => void;
  toggleSubTodo: (parentId: number, subTodoId: number) => void;
  deleteSubTodo: (parentId: number, subTodoId: number) => void;
  editSubTodo: (parentId: number, subTodoId: number, newText: string) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = (props) => {
  const { project, todos, onClose } = props;

  const projectTodos = useMemo(() => {
    return todos.filter(todo => todo.view === project.name);
  }, [todos, project]);

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{project.name}</h2>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800 p-1 rounded-full"><X size={28} /></button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto -mr-3 pr-3">
          {projectTodos.length > 0 ? (
            <TodoList 
              {...props}
              todos={projectTodos}
            />
          ) : (
            <p className="text-center text-slate-500 py-10">이 작업에 할당된 할 일이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;