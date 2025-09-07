import React from 'react';

// 아이콘은 이모지를 사용하거나 react-icons 같은 라이브러리를 설치하여 사용할 수 있습니다.
const navItems = [
  { icon: '🔍', text: '검색' },
  { icon: '📥', text: '관리함' },
  { icon: '📅', text: '오늘' },
  { icon: '🗓️', text: '달력' },
  { icon: '✨', text: '작업 추가' },
];

const Navbar: React.FC = () => {
  return (
    <aside className="w-60 flex-shrink-0 bg-gray-50 p-4 border-r">
      <div className="mb-8">
        {/* 사용자 프로필이나 로고를 추가할 수 있습니다. */}
        <h2 className="text-lg font-semibold text-gray-700">My Workspace</h2>
      </div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.text} className="mb-2">
              <button className="flex items-center w-full p-2 text-left text-gray-600 rounded-md hover:bg-gray-200 transition-colors">
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Navbar;