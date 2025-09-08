import React, { useState } from 'react';
import { Project } from './types';
// react-icons 대신 react-bootstrap-icons를 사용합니다.
import { Search, Inbox, CalendarDate, Calendar3, Plus, ListTask, ThreeDots } from 'react-bootstrap-icons';

interface NavbarProps {
  projects: Project[];
  setCurrentView: (view: string) => void;
  addProject: (name: string) => void;
  deleteProject: (id: number) => void;
  renameProject: (id: number, newName: string) => void;
  moveProjectToInbox: (id: number) => void;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const { projects, setCurrentView, addProject, deleteProject, renameProject, moveProjectToInbox } = props;
  const [isAdding, setIsAdding] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // 아이콘을 Bootstrap 아이콘으로 교체합니다.
  const navItems = [
    { icon: Search, text: '검색', action: () => setCurrentView('검색') },
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
    <aside className="w-72 flex-shrink-0 bg-gray-50 p-4 border-r flex flex-col">
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
              <button
                onClick={item.action}
                className="flex items-center w-full p-2 text-left text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
              >
                <item.icon className="mr-3 text-lg" />
                <span className="text-sm font-medium">{item.text}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="flex justify-between items-center mt-6 mb-2">
          <h3 className="text-xs font-bold text-gray-500 uppercase">작업</h3>
          <button 
            type="button"
            onClick={() => setIsAdding(!isAdding)} 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md" aria-label="새 작업 추가"
          >
            <Plus size={20} />
          </button>
        </div>

        <ul>
          {projects.map((project) => (
            <li key={project.id} className="group flex items-center justify-between rounded-md hover:bg-gray-200">
              <button onClick={() => setCurrentView(project.name)} className="flex-grow flex items-center p-2 text-left">
                <ListTask className="mr-3 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{project.name}</span>
              </button>
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setOpenMenuId(openMenuId === project.id ? null : project.id)} 
                  className="p-2 text-gray-500 opacity-0 group-hover:opacity-100"
                  aria-label={`More options for ${project.name}`}
                >
                  <ThreeDots />
                </button>
                {openMenuId === project.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                    <ul className="py-1 text-sm text-gray-700">
                      <li><button onClick={() => handleRename(project.id)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">이름 바꾸기</button></li>
                      <li><button onClick={() => { moveProjectToInbox(project.id); setOpenMenuId(null); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">관리함으로 이동</button></li>
                      <li><button onClick={() => { deleteProject(project.id); setOpenMenuId(null); }} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">삭제</button></li>
                    </ul>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {isAdding && (
        <div className="mt-auto p-2 bg-white rounded-lg shadow-md border">
          <form onSubmit={handleCreateProject}>
            <p className="text-sm font-semibold mb-2">새 작업 생성</p>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="작업 이름..."
              className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-blue-500 text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-600">생성</button>
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-gray-200 text-gray-700 px-3 py-1.5 text-sm rounded-md hover:bg-gray-300">취소</button>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
};

export default Navbar;