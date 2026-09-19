const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const { type } = require("os")

const userSchema = new mongoose.Schema({
    name :{
        type: String,
        required: [true , "Please enter your name"],
        trim : true,
        maxLength : [50 , "your name cannot be longer than 50 characters"]
    },
    email : {
        type: String,
        required : [true , "Email is required"],
        unique : true,
        lowercase : true,
        trim : true,
        validate : [validator.isEmail , "Please enter validate email address"]
    },
    password : {
        type : String,
        required : [true, "Please enter password"],
        minlength : [6 , "Your password must be longer than 6 characters"],
        select : false
    },
    passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
        validator: function (el) {
        return el === this.password;
        },
        message: "Password & confirm password should match"
    }
    },
    phoneNumber : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    role : {
        type : String ,
        enum : ["User" , "Admin"],
        default : "User"
    },
    avatar : {
        url : {type : String},
        public_id : {type : String}
    },
    passwordChangedAt : {
        type : Date
    },
    passwordResetToken : {
        type : String ,
        select : false,
        index : true
    },
    passwordResetExpires : {
        type : Date,
        select : false
    },
},
{timestamps:true}
)

userSchema.set("toJSON" , {
    transform:function(doc,ret){
        delete ret.password,
        delete ret.passwordConfirm,
        delete ret.passwordResetToken,
        delete ret.passwordResetExpires;
        delete ret.__v;
        return ret
    }
})

//pre means before
userSchema.pre("save" , async function(){
    if(!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password,12) 
    this.passwordConfirm = undefined;
    
})

userSchema.methods.correctPassword = async function(candidatePassword , userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTimestamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime()/1000,
            10
        )
        return JWTimestamp < changedTimeStamp
    }
    return false
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex")
    this.passwordResetToken = crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex")

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000
    return resetToken
}

const userModel = mongoose.model("user" , userSchema)

module.exports = userModel