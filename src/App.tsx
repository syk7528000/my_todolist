import React, { useState, useMemo } from 'react';
import { Todo, Project, Priority } from './components/types'; // Project, Priority 타입 임포트
import TodoList from './components/TodoList';
import Navbar from './components/Navbar';
import CalendarView from './components/CalendarView';
import { ClipboardCheck, Search } from 'react-bootstrap-icons';
import AddTodoForm from './components/AddTodoForm'; 
import SearchModal from './components/SearchModal'; // 검색 모달 임포트
import ProjectModal from './components/ProjectModal'; // ProjectModal 임포트

const initialTodos: Todo[] = [
  { id: 1, text: 'React 공부하기', completed: false, date: '2025-09-08', subTodos: [], view: '오늘', priority: '높음' },
  { id: 2, text: 'TypeScript 복습하기', completed: true, subTodos: [], view: '오늘', priority: '중간' },
  { id: 3, text: '장보기', completed: false, date: '2025-09-10', subTodos: [], view: '오늘', priority: '낮음' },
];

function App() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [projects, setProjects] = useState<Project[]>([]); // ❗ 이 줄을 추가해주세요.
  const [currentView, setCurrentView] = useState('관리함');
  const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false); // 검색 모달 상태 추가
  const [inboxProjectModal, setInboxProjectModal] = useState<Project | null>(null); // 관리함 작업 모달 상태

  // --- Project 관리 함수 ---
  const addProject = (name: string) => {
    const newProject = { id: Date.now(), name, inbox: false };
    setProjects([...projects, newProject]);
  };

  const deleteProject = (projectId: number) => {
    const projectToDelete = projects.find(p => p.id === projectId);
    if (!projectToDelete) return;
    // 프로젝트와 해당 프로젝트에 속한 모든 할 일 삭제
    setProjects(projects.filter(p => p.id !== projectId));
    setTodos(todos.filter(t => t.view !== projectToDelete.name));
  };

  const renameProject = (projectId: number, newName: string) => {
    const oldName = projects.find(p => p.id === projectId)?.name;
    if (!oldName || !newName.trim()) return;
    // 프로젝트 이름 변경 및 관련 할 일들의 view 속성 업데이트
    setProjects(projects.map(p => p.id === projectId ? { ...p, name: newName } : p));
    setTodos(todos.map(t => t.view === oldName ? { ...t, view: newName } : t));
    if (currentView === oldName) {
      setCurrentView(newName);
    }
  };

  const moveProjectToInbox = (projectId: number) => {
    const projectToMove = projects.find(p => p.id === projectId);
    if (!projectToMove) return;
    // 프로젝트의 inbox 상태를 true로 변경합니다.
    setProjects(projects.map(p => p.id === projectId ? { ...p, inbox: true } : p));
    if (currentView === projectToMove.name) {
      setCurrentView('관리함'); // 현재 보던 작업이 이동되면 관리함으로 뷰 전환
    }
  };

  const addTodo = (text: string, date?: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      date: date,
      subTodos: [],
      view: currentView, // 현재 뷰를 할 일에 할당
      priority: '중간', // 기본 우선순위 '중간'으로 설정
    };
    setTodos([...todos, newTodo]);
    setIsAdding(false);
  };

  const addSubTodo = (parentId: number, text: string) => {
    const newSubTodo: Todo ={
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos(
      todos.map(todo =>
        todo.id === parentId
          ? { ...todo, subTodos: [...(todo.subTodos || []), newSubTodo] }
          : todo
      )
    );
  };

  const toggleSubTodo = (parentId: number, subTodoId: number) => {
    setTodos(todos.map(todo => 
      todo.id === parentId
        ? { ...todo, subTodos: todo.subTodos?.map(sub => 
            sub.id === subTodoId ? { ...sub, completed: !sub.completed } : sub
          )}
        : todo
    ));
  };

  const deleteSubTodo = (parentId: number, subTodoId: number) => {
    setTodos(todos.map(todo =>
      todo.id === parentId
        ? { ...todo, subTodos: todo.subTodos?.filter(sub => sub.id !== subTodoId) }
        : todo
    ));
  };

  const editSubTodo = (parentId: number, subTodoId: number, newText: string) => {
    setTodos(todos.map(todo =>
      todo.id === parentId
        ? { ...todo, subTodos: todo.subTodos?.map(sub =>
            sub.id === subTodoId ? { ...sub, text: newText } : sub
          )}
        : todo
    ));
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id: number, newText: string) => {
    setTodos(
      todos.map(todo => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  const changeTodoPriority = (id: number, priority: Priority) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, priority } : todo
      )
    );
  };

  // 현재 뷰에 따라 보여줄 할 일을 필터링합니다.
  const filteredTodos = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    let viewFilteredTodos: Todo[];

    if (currentView === '오늘') {
      viewFilteredTodos = todos.filter(todo => todo.date === today);
    } else if (currentView === '달력') {
      viewFilteredTodos = [];
    } else {
      viewFilteredTodos = todos.filter(todo => todo.view === currentView);
    }

    if (priorityFilter) {
      return viewFilteredTodos.filter(todo => todo.priority === priorityFilter);
    }
    return viewFilteredTodos;
  }, [todos, currentView, priorityFilter]);

  // 관리함으로 이동된 프로젝트 목록
  const inboxProjects = useMemo(() => projects.filter(p => p.inbox), [projects]);

 return (
    <div className="flex h-screen bg-white font-sans">
      <Navbar
        projects={projects}
        setCurrentView={setCurrentView}
        addProject={addProject}
        deleteProject={deleteProject}
        renameProject={renameProject}
        moveProjectToInbox={moveProjectToInbox}
        onSearchClick={() => setIsSearchModalOpen(true)} // 검색 모달 열기 함수 전달
        currentView={currentView} // 현재 뷰를 Navbar에 전달
      />
      <main className="flex-grow p-8 overflow-y-auto bg-slate-50">
        {currentView === '달력' ? (
          <CalendarView 
            todos={todos}
            addTodo={addTodo}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            addSubTodo={addSubTodo}
            changeTodoPriority={changeTodoPriority}
            toggleSubTodo={toggleSubTodo}
            deleteSubTodo={deleteSubTodo}
            editSubTodo={editSubTodo}
          />
        ) : (
          // 메인 콘텐츠 영역
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mt-10 mb-10">
              <h1 className="text-2xl font-bold text-slate-800 ">{currentView}</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">우선순위:</span>
                {(['높음', '중간', '낮음'] as Priority[]).map(p => (
                  <button type="button" key={p} onClick={() => setPriorityFilter(priorityFilter === p ? null : p)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                      priorityFilter === p ? 'text-white shadow-sm' : 'text-slate-600 bg-slate-200/80 hover:bg-slate-300/80'
                    } ${p === '높음' && priorityFilter === p ? 'bg-red-500' : ''} ${p === '중간' && priorityFilter === p ? 'bg-sky-500' : ''} ${p === '낮음' && priorityFilter === p ? 'bg-slate-500' : ''}`}>
                    {p}
                  </button>
                ))}
                {priorityFilter && <button type="button" onClick={() => setPriorityFilter(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">✕</button>}
              </div>
            </div>
            {currentView === '관리함' ? (
              <div>
                {inboxProjects.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <ClipboardCheck size={48} className="mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700">관리함이 비어있습니다</h3>
                    <p className="mt-2 text-slate-500">완료했거나 보관할 작업을 이곳으로 옮길 수 있습니다.</p>
                  </div>
                ) : (
                  <ul className="space-y-3 mt-4">
                    {inboxProjects.map(p => (
                      <li key={p.id} onClick={() => setInboxProjectModal(p)}
                          className="p-4 bg-white border rounded-lg hover:bg-slate-50 hover:shadow-sm cursor-pointer transition-all">
                        <span className="font-semibold text-lg">{p.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <>
                <AddTodoForm addTodo={(text) => {
                  const date = currentView === '오늘' ? new Date().toISOString().split('T')[0] : undefined;
                  addTodo(text, date);
                }} />
                {filteredTodos.length === 0 ? (
                  <div className="text-center py-16 text-slate-500">
                    <ClipboardCheck size={48} className="mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700">할 일이 없습니다</h3>
                    <p className="mt-2">새로운 할 일을 추가하여 시작해보세요.</p>
                  </div>
                ) : (
                  <TodoList 
                    todos={filteredTodos}
                    toggleTodo={toggleTodo} 
                    deleteTodo={deleteTodo} 
                    editTodo={editTodo} 
                    changeTodoPriority={changeTodoPriority}
                    addSubTodo={addSubTodo}
                    toggleSubTodo={toggleSubTodo}
                    deleteSubTodo={deleteSubTodo}
                    editSubTodo={editSubTodo}
                  />
                )}
              </>
            )}
          </div>
        )}
      </main>
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        todos={todos}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        editTodo={editTodo}
        changeTodoPriority={changeTodoPriority}
        addSubTodo={addSubTodo}
        toggleSubTodo={toggleSubTodo}
        deleteSubTodo={deleteSubTodo}
        editSubTodo={editSubTodo}
      />
      {inboxProjectModal && (
        <ProjectModal
          project={inboxProjectModal}
          todos={todos}
          deleteProject={deleteProject}
          onClose={() => setInboxProjectModal(null)}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
          changeTodoPriority={changeTodoPriority}
          addSubTodo={addSubTodo}
          toggleSubTodo={toggleSubTodo}
          deleteSubTodo={deleteSubTodo}
          editSubTodo={editSubTodo}
        />
      )}
    </div>
  );
}

export default App;