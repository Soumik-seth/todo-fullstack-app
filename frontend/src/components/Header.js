import React from "react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token") !== null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav style={{ 
      backgroundColor: '#333', 
      padding: '1rem', 
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h2 style={{ margin: 0 }}>Todo App</h2>
      
      {isAuthenticated && (
        <div>
          <button 
            onClick={() => navigate("/home")}
            style={{ marginRight: '10px' }}
          >
            Home
          </button>
          <button 
            onClick={() => navigate("/addTodo")}
            style={{ marginRight: '10px' }}
          >
            Todos
          </button>
          <button 
            onClick={() => navigate("/about")}
            style={{ marginRight: '10px' }}
          >
            About
          </button>
          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};