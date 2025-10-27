import React from "react";
export  const  Todositem = (props) => {
    return (
        <>
        <h3>{props.todo.title}</h3>
        <p>{props.todo.desc}</p>
        <button type="button" className="btn btn-primary" onClick={()=>{props.onDelete(props.todo)}}>Delete</button>
     </>
    );
}