import React, { useState } from 'react';
import { Todo } from './components/types';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';
import DayTabs from './components/DayTabs'; // DayTabs 컴포넌트 import
import Navbar from './components/Navbar';

const initialTodos: Todo[] = [
  { id: 1, text: 'React 공부하기', completed: false, day: 'Mon' },
  { id: 2, text: 'TypeScript 복습하기', completed: true, day: 'Tue' },
  { id: 3, text: '장보기', completed: false, day: 'Wed' },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function App() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [selectedDay, setSelectedDay] = useState<string>('Mon'); // 선택된 요일 상태

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      day: selectedDay, // 현재 선택된 요일로 할 일 추가
    };
    setTodos([...todos, newTodo]);
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

  // 선택된 요일에 해당하는 할 일만 필터링
const filteredTodos = todos.filter(todo => todo.day === selectedDay);

 return (
    <div className="flex h-screen bg-white font-sans">
      <Navbar />
      <main className="flex-grow p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">My Notion Board</h1>
          <DayTabs days={days} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
          <AddTodoForm addTodo={addTodo} />
          <TodoList 
            todos={filteredTodos} 
            toggleTodo={toggleTodo} 
            deleteTodo={deleteTodo} 
            editTodo={editTodo} 
          />
        </div>
      </main>
    </div>
  );
}

export default App;