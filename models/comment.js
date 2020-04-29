var mongoose = require("mongoose");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//Schema setup
var commentSchema = new mongoose.Schema({
	text: String,
	// createdAt: { type: Date, default: Date.now }, // changes by ian
	author :{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
			
		   },
		username:String,
	} 
	
});

module.exports = mongoose.model("Comment",commentSchema);