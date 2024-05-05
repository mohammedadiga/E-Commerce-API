import mongoose from 'mongoose'; // Erase if already required
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user",
    },
    isBlocked:{
        type:Boolean,
        default:false,
    },
    cart: {
        type: Array,   
        default: []
    },
    address:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
    refreshToken: {
        type: String,
    },
    passwordChangedAT: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
},{
    timestamps: true,
});


// Password encryption
userSchema.pre('save', async function (next){

    if(!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


// Compare encryption during login
userSchema.methods.isPasswordMatched = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
}


userSchema.methods.passwordReset = function () {
    
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
    
    return resetToken;
}

//Export the model
export default mongoose.model('User', userSchema);