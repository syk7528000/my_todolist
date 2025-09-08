import React, { useState } from 'react';
import { Todo } from './components/types';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';
import Navbar from './components/Navbar';
import CalendarView from './components/CalendarView'; // CalendarView 임포트

const initialTodos: Todo[] = [
  { id: 1, text: 'React 공부하기', completed: false, date: '2025-09-08' },
  { id: 2, text: 'TypeScript 복습하기', completed: true },
  { id: 3, text: '장보기', completed: false, date: '2025-09-10' },
];

function App() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [currentView, setCurrentView] = useState('My Notion Board');
  const [isAdding, setIsAdding] = useState(false);

  // addTodo 함수가 날짜를 인자로 받도록 수정
  const addTodo = (text: string, date?: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      date: date, // 날짜 정보 추가
    };
    setTodos([...todos, newTodo]);
    setIsAdding(false);
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

 return (
    <div className="flex h-screen bg-white font-sans">
      <Navbar setCurrentView={setCurrentView} />
      <main className="flex-grow p-8 overflow-y-auto">
        {currentView === '달력' ? (
          <CalendarView 
            todos={todos}
            addTodo={addTodo}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
          />
        ) : (
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">{currentView}</h1>
            {currentView === '오늘' ? (
              isAdding ? (
                <AddTodoForm addTodo={(text) => addTodo(text)} />
              ) : (
                <button
                  onClick={() => setIsAdding(true)}
                  className="flex items-center w-full p-2 text-left text-gray-500 rounded-md hover:bg-gray-100 transition-colors mb-4"
                >
                  <span className="text-lg mr-2">+</span>
                  <span>새 항목 추가</span>
                </button>
              )
            ) : (
              <AddTodoForm addTodo={(text) => addTodo(text)} />
            )}
            
            <TodoList 
              todos={todos.filter(todo => !todo.date)} // 날짜가 없는 할 일만 표시
              toggleTodo={toggleTodo} 
              deleteTodo={deleteTodo} 
              editTodo={editTodo} 
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;