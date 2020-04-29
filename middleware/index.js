var Hillstation= require("../models/hillstation");
var Comment= require("../models/comment");
var mongoose = require("mongoose");

var middlewareObj={};

middlewareObj.checkHillStationOwnership=function(req,res,next){
	
	if(req.isAuthenticated()){ // meaning whether its logged in or not
		var id = mongoose.Types.ObjectId(req.params.id);
		Hillstation.findById(id,function(err,foundHillstation){
			if(err || !foundHillstation){
				req.flash("error","Hillstation not found");
				res.redirect("back");
			}else{
				//does user own tha campground
				if(foundHillstation["author"]["id"].equals(req.user._id)){
				  next();
				} else{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
			}
				})
		
			}else{ // if hes not logged in
				req.flash("error","You need to be logged in to do that");
				res.redirect("back");
			}
}
	
middlewareObj.checkCommentOwnership = function(req,res,next){
	
	if(req.isAuthenticated()){ // meaning whether its logged in or not
		var id = mongoose.Types.ObjectId(req.params.comment_id);
		Comment.findById(id,function(err,foundComment){
			if(err || !foundComment){
				req.flash("error","Comment not found");
				res.redirect("back");
			}else{
				//does user own the comment
				if(foundComment["author"]["id"].equals(req.user._id)){
				  next();
				} else{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
			}
				})
		
			}else{ // if hes not logged in
				req.flash("error","You need to be logged in to do that");
				res.redirect("back");
			}
}

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
	   return next();
	   }
	req.flash("error","You need to be logged in to do that");
	res.redirect("/login");
}

// //=======================
// //updates after last lecture
// ///=======================

// middlewareObj.isAdmin = function(req, res, next) {
//     if(req.user.isAdmin) {
//       next();
//     } else {
//       req.flash('error', 'This site is now read only thanks to spam and trolls.');
//       res.redirect('back');
//     }
//   }

// //only safe images are allowed
//   middlewareObj.isSafe=  function(req, res, next) {
//     if(req.body.image.match(/^https:\/\/images\.unsplash\.com\/.*/)) {
//       next();
//     }else {
//       req.flash('error', 'Only images from images.unsplash.com allowed.\nSee https://youtu.be/Bn3weNRQRDE for how to copy image urls from unsplash.');
//       res.redirect('back');
//     }
//   }


module.exports=middlewareObj;