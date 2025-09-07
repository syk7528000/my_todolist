import React from 'react';

interface DayTabsProps {
  days: string[];
  selectedDay: string;
  setSelectedDay: (day: string) => void;
}

const DayTabs: React.FC<DayTabsProps> = ({ days, selectedDay, setSelectedDay }) => {
  const dayKorean = {
    'Mon': '월',
    'Tue': '화',
    'Wed': '수',
    'Thu': '목',
    'Fri': '금',
    'Sat': '토',
    'Sun': '일'
  };

   return (
    <nav className="mb-5 flex border-b">
      {days.map(day => (
        <button
          key={day}
          onClick={() => setSelectedDay(day)}
          className={`px-4 py-2 text-sm font-medium transition-colors
            ${selectedDay === day 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:bg-gray-100'
            }
          `}
        >
          {dayKorean[day as keyof typeof dayKorean]}
        </button>
      ))}
    </nav>
  );
};

export default DayTabs;