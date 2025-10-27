const mongoose=require("mongoose");
const todoSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    desc:{type:String, trim:true,required:true},
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    done:{type:Boolean,default:false}
},{timestamps:true});

module.exports=mongoose.model("Todo",todoSchema);
    
    