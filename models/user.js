const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
   
    email:{
        type :String,
        required:true,
    },
    address:{
        type:String,
        required:true
    },
    aadharNo:{
        type:Number,
        required:true,
        unique: true

    },
    password:{
        type:String,
        required:true
    },
    role:{
        type: String,
        required:true,
        enum:['voter','admin'],
        default :'voter'
    },
    isVoted:{
        type:Boolean,
        default:false
    }
});
userSchema.pre('save',async function(next){

    const user = this;

    if(!user.isModified('password')) return next();

    try{
        const salt = await bcrypt.genSalt(10);

        const hashedPass = await bcrypt.hash(user.password,salt);
        user.password = hashedPass;

        next();
    }catch(err){
        return next(err);
    }
})

userSchema.methods.comparePassword = async function(userPassword){

    try{
        const isMatch = await bcrypt.compare(userPassword,this.password);
        return isMatch;

    }catch(err){
        throw err;
    }
}

const user = mongoose.model('user',userSchema);

module.exports=user;