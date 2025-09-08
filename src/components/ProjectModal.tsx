import React, { useMemo } from 'react';
import { Todo, Project, Priority } from './types';
import TodoList from './TodoList';
import { X } from 'react-bootstrap-icons';

interface ProjectModalProps {
  project: Project;
  todos: Todo[];
  onClose: () => void;
  deleteProject?: (projectId: number) => void; // deleteProject를 optional로 변경
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
  const { project, todos, onClose, deleteProject } = props;

  const projectTodos = useMemo(() => {
    return todos.filter(todo => todo.view === project.name);
  }, [todos, project]);

  const handleDeleteProject = () => {
    if (deleteProject) { // deleteProject 함수가 있는지 확인
      if (window.confirm(`'${project.name}' 작업을 정말로 삭제하시겠습니까? 이 작업에 속한 모든 할 일도 함께 삭제됩니다.`)) {
        deleteProject(project.id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">{project.name}</h2>
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
        {deleteProject && ( // deleteProject prop이 전달된 경우에만 버튼을 렌더링
          <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={handleDeleteProject}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              작업 삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectModal;