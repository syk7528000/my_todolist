import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // 캘린더 기본 스타일
import { Todo } from './types';
import TodoList from './TodoList';
import AddTodoForm from './AddTodoForm';

interface CalendarViewProps {
  todos: Todo[];
  addTodo: (text: string, date: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, newText: string) => void;
}

// 날짜를 'YYYY-MM-DD' 형식의 문자열로 변환하는 함수
const toDateString = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const CalendarView: React.FC<CalendarViewProps> = ({ todos, addTodo, toggleTodo, deleteTodo, editTodo }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const selectedDateString = toDateString(selectedDate);
  const todosForSelectedDate = todos.filter(todo => todo.date === selectedDateString);

  const handleAddTodoForDate = (text: string) => {
    addTodo(text, selectedDateString);
  };

  return (
    <div className="flex flex-col items-center">
      <Calendar
        onChange={(value) => setSelectedDate(value as Date)}
        value={selectedDate}
        className="mb-8 border-2 rounded-lg p-2"
      />
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">{selectedDate.toLocaleDateString()}의 할 일</h2>
        <AddTodoForm addTodo={handleAddTodoForDate} />
        <TodoList
          todos={todosForSelectedDate}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
        />
      </div>
    </div>
  );
};

export default CalendarView;