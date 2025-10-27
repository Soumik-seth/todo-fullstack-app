import React from "react";
import { Todositem } from "./Todositem";
export const Todos = (props) => {
    let mystyle = {
        minHeight: "70vh",
        margin: "40px auto"
    }
    return (
        <div className="container my-3" style={mystyle}>
            <h3 className="text-center" >Todos List</h3>
            {
                props.todos.length === 0 ? "No Todos to display" :
                    props.todos.map((todo) => {
                        return (
                            <Todositem todo={todo} onDelete={props.onDelete} />
                        )
                    })
            }
        </div>
    )
}