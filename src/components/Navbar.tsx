import React, { useState } from 'react';
import { FaSearch, FaInbox, FaRegCalendarAlt, FaRegCalendar, FaPlus, FaTasks } from 'react-icons/fa';

interface NavbarProps {
  setCurrentView: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setCurrentView }) => {
  const [projects, setProjects] = useState<{ icon: any; text: string }[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const navItems: { icon: any; text: string; action?: () => void }[] = [
    { icon: FaPlus, text: '작업 추가', action: () => setIsAdding(true) },
    { icon: FaSearch, text: '검색', action: () => setCurrentView('검색') },
    { icon: FaInbox, text: '관리함', action: () => setCurrentView('관리함') },
    { icon: FaRegCalendarAlt, text: '오늘', action: () => setCurrentView('오늘') },
    { icon: FaRegCalendar, text: '달력', action: () => setCurrentView('달력') },
  ];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      setProjects([...projects, { icon: FaTasks, text: newProjectName.trim() }]);
      setNewProjectName('');
      setIsAdding(false);
    }
  };

  return (
    <aside className="w-60 flex-shrink-0 bg-gray-100 p-4 border-r flex flex-col">
      <div className="mb-8">
        <h2 
          className="text-xl font-semibold text-gray-700 cursor-pointer"
          onClick={() => setCurrentView('My Notion Board')}
        >
          My Workspace
        </h2>
      </div>

      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.text} className="mb-2">
                <button
                  onClick={item.action}
                  className="flex items-center w-full p-2 text-left text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Icon className="mr-3 text-lg" />
                  <span className="text-sm font-medium">{item.text}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <hr className="my-4 border-gray-300" />

        <ul>
          {projects.map((project) => {
            const Icon = project.icon;
            return (
              <li key={project.text} className="mb-2">
                <button 
                  onClick={() => setCurrentView(project.text)}
                  className="flex items-center w-full p-2 text-left text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Icon className="mr-3 text-lg" />
                  <span className="text-sm font-medium">{project.text}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 작업 추가 입력 폼 */}
      {isAdding && (
        <div className="mt-auto p-2 bg-white rounded-lg shadow-md">
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
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-600"
              >
                생성
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-3 py-1.5 text-sm rounded-md hover:bg-gray-300"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
};

export default Navbar;