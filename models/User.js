const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
   username:{
    type:String,
    required:true,
    min:3,
    max:20,
    unique:true
   },
   email:{
    type:String,
    required:true,
    max:50,
    unique:true
   },
   password:{
       type:String,
       required:true,
       min: 6
   },
   profilePicture:{
       type:String,
       default:""
   },
   coverPicture:{
       type:String,
       default:""
   },
   followers:{
      type:Array,
      default:[]
   },
   followins:{
       type:Array,
       default:[]
   },
   subscriptions:{
       type:Array,
       default:[]
   },
   isAdmin:{
       type:Boolean,
       default:false
   },
   desc: {
       type: String,
       max:50
   },
   city: {
    type: String,
    max:50
    },
    from: {
        type: String,
        max:50
    },
    relationship: {
        type: String,
        enum: [1, 2, 3, 4]
    },
 },
{ timestamps:true}
);

module.exports = mongoose.model("User", UserSchema);
// {
//     "endpoint": "https://fcm.googleapis.com/fcm/send/cb1H0eMtWqc:APA91bGRQphQJWmdvvmxYZG1BqM7o2bjh5Ekj5wxryMZ1m_KY2BR_a9kfsvW2yZ4nrcaLnQ-df7yJ2xUMkb52JmQEVtCrGJCy4h2UMX8viMfbzPNL_RZaD25mI8QDWtF9Tl3vH_aI24U",
//     "expirationTime": null,
//     "keys": {
//         "p256dh": "BHdSi-I8-7xbPK3zcSnfZZtlMz5z6vjTnG3RJKTBBigOWnhdIPrWk7_3azeieGxzrKANatsmAqMmc0Ks6s91mLQ",
//         "auth": "WhcoUULiCaukFfONidsj_Q"
//     }
// }