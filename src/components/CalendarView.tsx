import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { Todo } from './types';
import TodoList from './TodoList';
import AddTodoForm from './AddTodoForm';
import './CalendarView.css'; // 방금 만든 CSS 파일 임포트

interface CalendarViewProps {
  todos: Todo[];
  addTodo: (text: string, date: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, newText: string) => void;
}

// 날짜를 'YYYY-MM-DD' 형식의 문자열로 변환하는 함수
const toDateString = (date: Date) => date.toISOString().split('T')[0];

const CalendarView: React.FC<CalendarViewProps> = ({ todos, addTodo, toggleTodo, deleteTodo, editTodo }) => {
  const [currentDate, setCurrentDate] = useState<Date | null>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 날짜 클릭 핸들러: 모달을 열고 선택된 날짜를 설정
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  // 각 날짜 타일에 콘텐츠(할 일 목록)를 렌더링하는 함수
  const renderTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateString = toDateString(date);
      const todosForDay = todos.filter(todo => todo.date === dateString);
      return (
        <div className="day-tile-content" onClick={() => handleDateClick(date)}>
          <ul>
            {todosForDay.slice(0, 3).map(todo => ( // 최대 3개까지만 표시
              <li key={todo.id} className="day-tile-todo-item">
                {todo.text}
              </li>
            ))}
          </ul>
          {todosForDay.length > 3 && <div className="text-xs text-gray-500 mt-1">+{todosForDay.length - 3} more</div>}
        </div>
      );
    }
    return null;
  };

  const selectedDateString = selectedDate ? toDateString(selectedDate) : '';
  const todosForSelectedDate = todos.filter(todo => todo.date === selectedDateString);

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setCurrentDate(value);
    }
  };

  return (
    <div className="w-full">
      <Calendar
        onChange={handleDateChange}
        value={currentDate}
        tileContent={renderTileContent}
        className="custom-calendar"
        onClickDay={handleDateClick} // 날짜 칸 전체 클릭 시 모달 열기
      />

      {/* 날짜별 할 일 관리를 위한 모달 */}
      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedDate.toLocaleDateString()}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl font-bold">&times;</button>
            </div>
            <p className="mb-4 text-gray-600">할 일 목록</p>
            <AddTodoForm addTodo={(text) => addTodo(text, selectedDateString)} />
            <div className="mt-4 max-h-80 overflow-y-auto">
              <TodoList
                todos={todosForSelectedDate}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
                editTodo={editTodo}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;