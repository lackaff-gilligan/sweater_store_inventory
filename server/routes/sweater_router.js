var express = require('express');
var router = express.Router();
var sweaters = []; //do I need this if I have db?

var pg = require('pg');
var config = {
    database: 'my_practice', //name of the db
    host: 'localhost', //where is the db?
    port: 5432, //the port number for the db, 5432 is default
    max: 10, //how many connections at one time
    idleTimeoutMillis: 30000 //close idle connections to db after 30 sec
}

//create pool
var pool = new pg.Pool(config);

//express removed the '/sweater' when it does an app.use
router.post('/', function(req, res){
    var sweater = req.body; //the data sent in the POST request
    console.log('req.body now sweater:', sweater); //has a name, size, price
    
    //Attempt to connect to the database
    pool.connect(function (errorConnectingToDb, db, done){
        if(errorConnectingToDb){
            //there was an error and no connection was made
            console.log('Error connecting to db:', errorConnectingToDb);
            res.sendStatus(500);
        } else {
            //we connected to the db!! pool -1
            var queryText = 'INSERT INTO "sweaters" ("name", "size", "price") VALUES ($1, $2, $3);';
            db.query(queryText, [sweater.name, sweater.size, sweater.price], function (errorMakingQuery, result){
                //we have received an error or result at this point
                done(); //pool +1
                if(errorMakingQuery){
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    //send back success!!
                    res.sendStatus(201);
                }
            }); // END QUERY
        }
    }); // END POOL
});

// http://localhost:5000/sweater will go here
router.get('/', function(req, res){
   //attempt to connect to the database
   pool.connect(function(errorConnectingToDb, db, done){
       if(errorConnectingToDb){
           //There was an error and no connection was made
           console.log('Error connecting:', errorConnectingToDb);
           res.sendStatus(500);
       } else {
           //successful connection to db!! pool -1
           var queryText = 'SELECT * FROM "sweaters" ORDER BY "id" ASC;';
           db.query(queryText, function(errorMakingQuery, result){
               //we have received an error or result at this point
               done(); //pool + 1
               if(errorMakingQuery){
                   console.log('Error making query:', errorMakingQuery);
                   res.sendStatus(500);
               } else {
                   res.send(result.rows);
               }
           }); //END QUERY
       }
   }); //END POOL
}); //END GET ROUTE

//GET ROUTE for a single sweater
router.get('/:sid', function(req, res){
    // sweater/3 will assign req.params.sid = 3
    var sweaterId = req.params.sid;
    //attempt to connect to the database
    pool.connect(function(errorConnectingToDb, db, done){
        if(errorConnectingToDb){
            //There was an error and no connection was made
            console.log('Error connecting:', errorConnectingToDb);
            res.sendStatus(500);
        } else {
            //successful connection to db!! pool -1
            var queryText = 'SELECT * FROM "sweaters" WHERE "id" = $1;';
            db.query(queryText, [sweaterId], function(errorMakingQuery, result){
                //we have received an error or result at this point
                done(); //pool + 1
                if(errorMakingQuery){
                    console.log('Error making query:', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.send(result.rows);
                }
            }); //END QUERY
        }
    }); //END POOL
 }); //END GET ROUTE


// PUT ROUTE
router.put('/:id', function(req, res){
   console.log('req.params in PUT route:', req.params);
   var sweaterId = req.params.id;
   var sweater = req.body;
   console.log('req.body now sweater:', sweater);
    
    //Attempt to connect to the database
    pool.connect(function (errorConnectingToDb, db, done){
        if(errorConnectingToDb){
            //there was an error and no connection was made
            console.log('Error connecting to db:', errorConnectingToDb);
            res.sendStatus(500);
        } else {
            //we connected to the db!! pool -1
            var queryText = 'UPDATE "sweaters" SET "name" = $1, "size" = $2, "price" = $3 WHERE "id" = $4;';
            db.query(queryText, [sweater.name, sweater.size, sweater.price, sweaterId], function (errorMakingQuery, result){
                //we have received an error or result at this point
                done(); //pool +1
                if(errorMakingQuery){
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    //send back success!!
                    res.sendStatus(201);
                }
            }); // END QUERY
        }
    }); // END POOL
})

module.exports = router;