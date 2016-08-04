// Dependencies
const mongoose 			= require('mongoose');
const Profile			= require('./model.js');



// Opens App Routes
module.exports = function(app) {


	/*
		GET Routes
	*/

	// Retrieve a payload of info about a users profile
	app.get("/userProfile/:id", (req, res) => {



		let accountId = null;

		if (!req.params.id){
			accountId = 1
		}
		else {
			accountId = req.params.id;
		}

		const mockData = {
				accountId: 1,
				userWidgetMeta: {
					"todo": [
						{
							title: "Build this website",
							added: "today"
						},
						{
							title: "Finish this website",
							added: "stfu"
						}
					]
				},
				createdAt: "27/07/2016"
		}

		res.json(mockData);


		/*
		// Uses Mongoose schema to run the search (empty conditions)
		const query = model.find({});

		// Execute
		query.exec((err, userMetadata) => {

			// Test for errors
			if(err)	res.send(err);

			// If no errors are found, it responds with a JSON of all skateparks
			res.json(userMetadata);
		});
		*/
	});


	// POST Routes
	// --------------------------------------------------------
	// Provides method for saving new users to the db
	app.post("/userProfile", (req, res) => {

		console.log("body:");
		console.log(req.body);

		// Creates a new skatepark based on the Mongoose Schema
		const newUser = new Profile(req.body);

		console.log("schema: " , newUser);

		// New skatepark is saved to the db
		newUser.save((err) => {
			
			console.log("attempting save...");

			// Test for errors
			if(err) res.send(err);

			// If no errors are found, it responds with the _id of the newly saved obj
			res.json(newUser);
		});
	});

	/*
		PUT ROUTES
	*/

	app.put("/userProfile/:id", (req, res) => {



		console.log(req.body);

		res.json({});

	});






};  