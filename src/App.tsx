import React, { useState, useMemo } from 'react';
import { Todo, Project } from './components/types'; // Project 타입 임포트
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';
import Navbar from './components/Navbar';
import CalendarView from './components/CalendarView';
import { ClipboardCheck } from 'react-bootstrap-icons';
import ProjectModal from './components/ProjectModal'; // 새로 만들 모달 컴포넌트

const initialTodos: Todo[] = [
  { id: 1, text: 'React 공부하기', completed: false, date: '2025-09-08', subTodos: [], view: '관리함' },
  { id: 2, text: 'TypeScript 복습하기', completed: true, subTodos: [], view: '관리함' },
  { id: 3, text: '장보기', completed: false, date: '2025-09-10', subTodos: [], view: '관리함' },
];

function App() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [projects, setProjects] = useState<Project[]>([]); // ❗ 이 줄을 추가해주세요.
  const [currentView, setCurrentView] = useState('관리함');
  const [isAdding, setIsAdding] = useState(false);
  const [modalTodo, setModalTodo] = useState<Todo | null>(null);

  // --- Project 관리 함수 ---
  const addProject = (name: string) => {
    const newProject = { id: Date.now(), name };
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
    // 프로젝트는 Navbar에서 삭제, 관련 할 일들은 '관리함'으로 이동
    setProjects(projects.filter(p => p.id !== projectId));
    setTodos(todos.map(t => t.view === projectToMove.name ? { ...t, view: '관리함' } : t));
  };

  const addTodo = (text: string, date?: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      date: date,
      subTodos: [],
      view: currentView, // 현재 뷰를 할 일에 할당
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

  // 현재 뷰에 따라 보여줄 할 일을 필터링합니다.
  const filteredTodos = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    if (currentView === '오늘') {
      return todos.filter(todo => todo.date === today);
    }
    // '달력'이나 '검색' 뷰에서는 TodoList를 보여주지 않으므로 빈 배열 반환
    if (currentView === '달력' || currentView === '검색') {
      return [];
    }
    // 그 외의 경우(관리함, 사용자 생성 작업 등)는 view 이름으로 필터링
    return todos.filter(todo => todo.view === currentView);
  }, [todos, currentView]);

  // 관리함에서 항목 클릭 시 모달 열기
  const handleInboxItemClick = (todo: Todo) => {
    if (currentView === '관리함') {
      setModalTodo(todo);
    }
  };

 return (
    <div className="flex h-screen bg-white font-sans">
      <Navbar 
        projects={projects}
        setCurrentView={setCurrentView}
        addProject={addProject}
        deleteProject={deleteProject}
        renameProject={renameProject}
        moveProjectToInbox={moveProjectToInbox}
      />
      <main className="flex-grow p-8 overflow-y-auto bg-gray-50/50">
        {currentView === '달력' ? (
          <CalendarView 
            todos={todos}
            addTodo={addTodo}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            addSubTodo={addSubTodo}
            toggleSubTodo={toggleSubTodo}
            deleteSubTodo={deleteSubTodo}
            editSubTodo={editSubTodo}
          />
        ) : (
          // 불필요한 중첩 구조를 제거하고 단순화합니다.
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg border border-gray-200">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">{currentView}</h1>
            
            {/* '관리함'이 아닐 때만 '새 항목 추가' 폼을 보여줍니다. */}
            {currentView !== '관리함' && <AddTodoForm addTodo={(text) => addTodo(text)} />}

            {filteredTodos.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <ClipboardCheck size={48} className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold">
                  {currentView === '관리함' ? '관리함이 비어있습니다' : '할 일이 없습니다'}
                </h3>
                <p className="mt-2">
                  {currentView === '관리함' ? '다른 작업의 항목을 이곳으로 옮길 수 있습니다.' : '새로운 할 일을 추가하여 시작해보세요.'}
                </p>
              </div>
            ) : (
              <TodoList 
                todos={filteredTodos}
                onItemClick={currentView === '관리함' ? handleInboxItemClick : undefined}
                toggleTodo={toggleTodo} 
                deleteTodo={deleteTodo} 
                editTodo={editTodo} 
                addSubTodo={addSubTodo}
                toggleSubTodo={toggleSubTodo}
                deleteSubTodo={deleteSubTodo}
                editSubTodo={editSubTodo}
              />
            )}
          </div>
        )}
      </main>
      {/* 모달 렌더링 */}
      {modalTodo && <ProjectModal todo={modalTodo} onClose={() => setModalTodo(null)} />}
    </div>
  );
}

export default App;