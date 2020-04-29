var express = require("express");
var router  = express.Router();
var Hillstation = require("../models/hillstation");
var mongoose   = require("mongoose");
var middleware = require("../middleware");


//INDEX ROUTE - show all campgrounds
router.get("/hillstations",function(req,res){
	
			//get all campgrounds from db
		  Hillstation.find({},function(err,allhillstations){
			   if(err){
				  console.log(err);
				 }else{
					 res.render("hillstations/index",{
						
						 hillstations:allhillstations ,
					    								
													});
					 }
		     });
     });


//NEW Route - show form to create a new campground
router.get("/hillstations/new",middleware.isLoggedIn,function(req,res){
	res.render("hillstations/new");
})

// CREATE Route - add new campground to db
router.post("/hillstations",middleware.isLoggedIn,function(req,res){
	
			//get data from form and add it to db
			var name = req.body.name;
	        var price = req.body.price;
			var image = req.body.image;
			var desc = req.body.description;
	        var author={
				 id:req.user._id,
				username:req.user.username
			}

	
    var newHillstation = {name: name, image: image, description: desc, price: price, author:author};
	
     
			Hillstation.create(newHillstation,function(err,newlyCreated){
				if(err){
					console.log(err);
				}else{
					//redirect back to campgrounds page
					res.redirect("/hillstations");
				}
			});
	
  }); 


//SHOW route - shows info about chosen campground
router.get("/hillstations/:id",function(req,res){
	//find the campground with the provided id
	
	 var id = mongoose.Types.ObjectId(req.params.id); 
	
	
	Hillstation.findById(id).populate("comments").exec(function(err,foundHillstation){
		if(err || !foundHillstation){
			req.flash("error","Hillstation not found");
			res.redirect("back");
		}else{
			//render show template with campground
	      res.render("hillstations/show",{hillstation :foundHillstation});
		}
	});
});

//EDIT Route
router.get("/hillstations/:id/edit",middleware.checkHillStationOwnership,function(req,res){
	var id = mongoose.Types.ObjectId(req.params.id);
	Hillstation.findById(id,function(err,foundHillstation){
		res.render("hillstations/edit",{hillstation:foundHillstation} );
		
	});
	
});
//UPDATE Route
router.put("/hillstations/:id",middleware.checkHillStationOwnership,function(req,res){
	var id = mongoose.Types.ObjectId(req.params.id);

		
Hillstation.findByIdAndUpdate(id,req.body.hillstation,function(err,updatedHillstation){
		if(err){
			//changes here too in if and else statement
			req.flash("error", err.message);
            res.redirect("back");
		}else{
			req.flash("success","Successfully Updated!");
            res.redirect("/hillstations/" + id);
		}
	});
});	

	
//DESTROY Campground Route
	
router.delete("/hillstations/:id",middleware.checkHillStationOwnership,function(req,res){
	Hillstation.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/hillstations");
      } else {
          res.redirect("/hillstations");
      }
   });
});

module.exports= router;




