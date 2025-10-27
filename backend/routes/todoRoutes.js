const express = require('express');
const Todo = require('../models/Todo');
const auth = require("../middleware/auth");
const router = express.Router();

// Get /api/todos/ -get all todos

router.get("/", auth,async(req,res)=>{
    try{
        const todos = await Todo.find({user: req.user.id}).sort({createdAt: -1});
        res.json(todos);
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Srver error"});
    }
})

//post /api/todos/ -create todo
router.post("/", auth, async (req,res)=>{
    try{
        const {title, desc} = req.body;
        if(!title & !desc){
            return res.status(400).json({message:"Title and description is required"});
        }else{
            const todo = new Todo({user:req.user.id,title,desc});
            await todo.save();
            res.status(201).json(todo);
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Server error"})
    }
})
//delete  /api/todos/:id -delete todo
router.delete("/:id", auth, async (req,res)=>{
    try{
        const todo =await Todo.findById(req.params.id);
        if(!todo){
            return res.status(404).json({message:"Todo not found"});
        }
        if(todo.user.toString() !== req.user.id){
            return res.status(401).json({message:"Not authorized"});
        }
        await todo.deleteOne();
        res.json({message:"Todo deleted"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Server error"});
    }
});
//put /api/todos/:id -update todo
router.put("/:id", auth, async (req,res)=>{
    try{
        const todo =await Todo.findById(req.params.id);
       if(!todo){
        return res.staus(404).json({message:"Todo not found "});
       }
       if(todo.user.toString() !== req.user.id){
        return res.status(401).json({message:"Not authorized"});
       }
         const {title, desc, done} = req.body;
         if(title !== undefined) todo.title = title;
         if(desc !== undefined) todo.desc = desc;
         if(done !== undefined) todo.done = done;
         await todo.save();
         res.json(todo);
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Server error"});
    }
})
module.exports = router;