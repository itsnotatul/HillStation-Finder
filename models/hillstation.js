var mongoose = require("mongoose");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//Schema setup
var hillstationSchema = new mongoose.Schema({
	name: String,
	price: String, // ian code: cost:Number, 
	image : String,
	description:String,
	author:{
		id:{
		      type:mongoose.Schema.Types.ObjectId,
		      ref:"User"
		
	          },
	username:String
	},
	comments    :[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	]
});

module.exports = mongoose.model("Hillstation",hillstationSchema);




