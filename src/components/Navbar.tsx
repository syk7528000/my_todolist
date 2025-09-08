import React, { useState, useRef } from 'react';
import { Project } from './types';
// react-icons 대신 react-bootstrap-icons를 사용합니다.
import { Search, Inbox, CalendarDate, Calendar3, Plus, ListTask, ThreeDots } from 'react-bootstrap-icons';
import { useOutsideClick } from './useOutsideClick';

interface NavbarProps {
  projects: Project[];
  currentView: string;
  setCurrentView: (view: string) => void;
  addProject: (name: string) => void;
  deleteProject: (id: number) => void;
  renameProject: (id: number, newName: string) => void;
  moveProjectToInbox: (id: number) => void;
  onSearchClick: () => void; // 검색 버튼 클릭 핸들러 추가
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const { projects, currentView, setCurrentView, addProject, deleteProject, renameProject, moveProjectToInbox, onSearchClick } = props;
  const [isAdding, setIsAdding] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useOutsideClick<HTMLDivElement>(() => setOpenMenuId(null));

  // 아이콘을 Bootstrap 아이콘으로 교체합니다.
  const navItems = [
    { icon: Search, text: '검색', action: onSearchClick },
    { icon: Inbox, text: '관리함', action: () => setCurrentView('관리함') },
    { icon: CalendarDate, text: '오늘', action: () => setCurrentView('오늘') },
    { icon: Calendar3, text: '달력', action: () => setCurrentView('달력') },
  ];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      addProject(newProjectName.trim());
      setNewProjectName('');
      setIsAdding(false);
    }
  };

  const handleRename = (id: number) => {
    const newName = prompt("새 작업 이름을 입력하세요:");
    if (newName) renameProject(id, newName);
    setOpenMenuId(null);
  };

  return (
    <aside className="w-72 flex-shrink-0 bg-slate-100/80 p-4 border-r border-slate-200 flex flex-col">
      <div className="mb-8">
        <h2 
          className="text-xl font-semibold text-gray-700 cursor-pointer"
          onClick={() => setCurrentView('관리함')}
        >
          My Workspace
        </h2>
      </div>

      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.text} className="mb-1">
              <button type="button"
                onClick={item.action}
                className={`flex items-center w-full p-2 text-left rounded-md transition-colors ${
                  currentView === item.text ? 'bg-sky-100 text-sky-700' : 'text-slate-600 hover:bg-slate-200'
                }`}>
                <item.icon className="mr-3 text-lg" />
                <span className="text-sm font-medium">{item.text}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="flex justify-between items-center mt-6 mb-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">작업</h3>
          <button 
            type="button"
            onClick={() => setIsAdding(!isAdding)} 
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md" aria-label="새 작업 추가"
          >
            <Plus size={20} />
          </button>
        </div>

        <ul>
          {projects.filter(p => !p.inbox).map((project) => ( 
            <li key={project.id} className="group flex items-center justify-between rounded-md hover:bg-slate-200 w-full">
              <button onClick={() => setCurrentView(project.name)} 
                className={`flex-grow flex items-center p-2 text-left rounded-md transition-colors w-full ${
                  currentView === project.name ? 'bg-sky-100 text-sky-700' : 'text-slate-600'
                }`}>
                <ListTask className="mr-3 text-slate-500" />
                <span className="text-sm font-medium">{project.name}</span>
              </button>
              <div className="relative" ref={menuRef}>
                <button 
                  type="button"
                  onClick={() => setOpenMenuId(openMenuId === project.id ? null : project.id)} 
                  className="p-2 text-slate-500 opacity-0 group-hover:opacity-100"
                  aria-label={`More options for ${project.name}`}
                >
                  <ThreeDots />
                </button>
                {openMenuId === project.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                    <ul className="py-1 text-sm text-gray-700">
                      <li><button type="button" onClick={() => handleRename(project.id)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">이름 바꾸기</button></li>
                      <li><button type="button" onClick={() => { moveProjectToInbox(project.id); setOpenMenuId(null); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">관리함으로 이동</button></li>
                      <li><button type="button" onClick={() => { deleteProject(project.id); setOpenMenuId(null); }} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">삭제</button></li>
                    </ul>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {isAdding && (
        <div className="mt-auto p-3 bg-white rounded-lg shadow-md border">
          <form onSubmit={handleCreateProject}>
            <p className="text-sm font-semibold mb-2">새 작업 생성</p>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="새로운 작업 이름"
              className="w-full p-2 mb-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-sky-500 text-white px-3 py-1.5 text-sm rounded-md hover:bg-sky-600">생성</button>
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-slate-200 text-slate-700 px-3 py-1.5 text-sm rounded-md hover:bg-slate-300">취소</button>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
};

export default Navbar;