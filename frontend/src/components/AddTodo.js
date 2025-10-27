
 import React, { useState } from "react";
 export const AddTodo = (props) => {
 const [title , setTitle] = useState("");
 const [desc , setDesc] = useState("");
    const submit =(e)=>{
        e.preventDefault();
        if(!title || !desc){
            alert("Title or description can't be blank");
        }
        else{
        props.addTodo(title,desc);
        setTitle("");
        setDesc("");
        }
    }
    return(
        <div className="container my-3">
        <h3>Add your todo</h3>
<form onSubmit={submit}>
  <div className="mb-3">
    <label htmlFor="Title" className="form-label">Title</label>
    <input  className="form-control"  type="text" value={title} onChange={(e) => setTitle(e.target.value)}
           
            id="Title"/>
   
  </div>
  <div className="mb-3">
    <label htmlFor="desc" className="form-label" >Description</label>
    <input type="text" className="form-control" id="desc" value={desc} onChange={(e)=>setDesc(e.target.value)}/>
  </div>

  <button type="submit" className="btn btn-primary">Submit</button>
</form>
</div>
    );
}