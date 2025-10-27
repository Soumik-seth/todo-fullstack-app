import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Header";  
import { About } from "./components/About";
import { AddTodo } from "./components/AddTodo";
import { Todos } from "./components/Todos";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };

  // Load todos from backend
  const loadTodos = async () => {
    if (!isAuthenticated()) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/todos", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const todosData = await response.json();
        setTodos(todosData);
      }
    } catch (error) {
      console.error("Error loading todos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      loadTodos();
    } else {
      setLoading(false);
    }
  }, []);

  // Add todo to backend
  const addTodo = async (title, desc) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, desc })
      });

      if (response.ok) {
        const newTodo = await response.json();
        setTodos([...todos, newTodo]);
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Delete todo from backend
  const onDelete = async (todo) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/todos/${todo._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTodos(todos.filter((t) => t._id !== todo._id));
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/" />;
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <Router>
      <Header /> 
      <Routes>
        <Route path="/" element={isAuthenticated() ? <Navigate to="/home" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated() ? <Navigate to="/home" /> : <Signup />} />
        
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }/>
        
        <Route path="/addTodo" element={
          <ProtectedRoute>
            <AddTodo addTodo={addTodo} />
            <Todos todos={todos} onDelete={onDelete} />
          </ProtectedRoute>
        }/>
        
        <Route path="/about" element={
          <ProtectedRoute>
            <About name="Soumik seth" />
          </ProtectedRoute>
        }/>
      </Routes>
    </Router>
  );
}

export default App;