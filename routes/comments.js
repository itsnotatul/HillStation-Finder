var express = require("express");
var router  = express.Router();
var mongoose = require("mongoose");

var Hillstation = require("../models/hillstation");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// COMMENTS ROUTES

router.get("/hillstations/:id/comments/new",middleware.isLoggedIn,function(req,res){
	//find campground by id
	var id =  mongoose.Types.ObjectId(req.params.id);
	Hillstation.findById(id,function(err,hillstation){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{hillstation:hillstation});
		}
	}) 
	
})

router.post("/hillstations/:id/comments",middleware.isLoggedIn,function(req,res){
	// find campground by id
	var id =  mongoose.Types.ObjectId(req.params.id);
	Hillstation.findById(id,function(err,hillstation){
		if(err){
			console.log(err);
			res.redirect("/hillstations");
		}else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error","Something went wrong")
					console.log(err);
				}else{
//we'll get here inly if its logged in so, req.user contain our user					
					//add username n id to comment
					comment["author"]["id"]=req.user._id;
					comment["author"]["username"]=req.user.username;
					//save comment
					comment.save();
					hillstation.comments.push(comment);
					hillstation.save();
					req.flash("success","Successfully added comment");
					res.redirect("/hillstations/"+id);
				}
			});
			
		}
	})
});

//edit route
router.get("/hillstations/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	
	var hillstation_id =  mongoose.Types.ObjectId(req.params.id);
	var id =  mongoose.Types.ObjectId(req.params.comment_id);
	
// someone can change the camp id in the url and broke our app so 
	Hillstation.findById(hillstation_id,function(err,foundHillstation){
		if(err || !foundHillstation){
			req.flash("error","Hillstation not found");
			return res.redirect("back");
		}
		//error handling is done now
		
		Comment.findById(id,function(err,foundComment){
		if(err){
			res.redirect("back");
		}else{
	res.render("comments/edit",{hillstation_id:hillstation_id,comment:foundComment});
		}
	})
});
	});
	
	
//Comment UPDATE Route
router.put("/hillstations/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
	var id =  mongoose.Types.ObjectId(req.params.comment_id);
	var id2 =  mongoose.Types.ObjectId(req.params.id);
	Comment.findByIdAndUpdate(id,req.body.comment,function(err,updatedComment){	
	if(err){
		res.redirect("back");
	}else{
		res.redirect("/hillstations/"+id2);
	}
	     })
	
});
//DELETE COMMENT Route
router.delete("/hillstations/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
	var id =  mongoose.Types.ObjectId(req.params.comment_id);
	var id2 =  mongoose.Types.ObjectId(req.params.id);
	
	 Comment.findByIdAndRemove(id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/hillstations/" + id2);
       }
    });
});

module.exports= router;

