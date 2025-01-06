import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,   
    },
    avatar:{
        type: String,
        default:"https://imgs.search.brave.com/hdkWTXz2ETW27pvZWqDC87DRmM1hkR13zBfnsrz8cjQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC8wMS83OC9t/YWxlLXByb2ZpbGUt/cGljdHVyZS1tYW4t/ZmFjZS1pbWFnZS13/ZWItYXZhdGFyLXZl/Y3Rvci00MjAwMDE3/OC5qcGc"
    },
},{timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;