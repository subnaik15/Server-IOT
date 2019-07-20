const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const CONNECTION_URL = "mongodb+srv://new_admin:admin@cluster0-hvt29.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "test";

// const MongoClient = require("mongodb").MongoClient;
// const uri = "mongodb+srv://new_admin:<password>@cluster0-hvt29.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
// // perform actions on the collection object
// client.close();
// });

let app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

let database, collection, loginCollection;

app.post("/addUser", (request, response) => {
    // console.log(request.headers);
    collection.find({ userId: request.headers.userid}).limit(1).next(async function (err, doc) {
        if (doc === null) {
            let insertData = {
                userId: request.headers.userid,
                houses: [
                ]
            };

            collection.insert(insertData, async function (error, result) {
                if(error) {
                    response.status(500).json({ Error: "Internal server error" }).send(error);
                }
                response.send(result);
            });
        } else {
            response.status(500).json({ Error: "UserId already exists" }).send(err);
        }
    });
});

app.post("/addHouse", (request, response) => {
    collection.find({ userId: request.headers.userid}).limit(1).next(async function (err, doc) {
        if (doc === null) {
            response.status(500).json({ Error: "UserId does not exists" }).send(err);
        } else {
            // console.log(collection.find({ houses: {$elemMatch: {houseid: request.headers.houseid}}}));
            collection.find({ houses: {$elemMatch: {houseId: request.headers.houseid}}}).limit(1).next(async function (errr, docc) {
                // console.log(docc);
                if (docc === null) {

                    collection.update(
                        { 'userId': request.headers.userid },
                        { $push: {'houses': {'houseId': request.headers.houseid, 'rooms': []}}},
                        async function (error, result) {
                            if(error) {
                                response.status(500).json({ Error: "Internal server error" }).send(error);
                            }
                            response.send(result);
                        }
                    );
                } else {
                    response.status(500).json({ Error: "HouseId already exists" }).send(errr);
                }
            });

        }
    });
});

app.post("/addRoom", (request, response) => {
    collection.find({ userId: request.headers.userid}).limit(1).next(async function (err, doc) {
        if (doc === null) {
            response.status(500).json({ Error: "UserId does not exists" }).send(err);
        } else {
            // console.log(collection.find({ houses: {$elemMatch: {houseid: request.headers.houseid}}}));
            collection.find({ houses: {$elemMatch: {houseId: request.headers.houseid}}}).limit(1).next(async function (errr, docc) {
                // console.log(docc);
                if (docc === null) {
                    response.status(500).json({ Error: "HouseId does not exists" }).send(errr);

                } else {
                    collection.find({ houses: {$elemMatch: {houseId: request.headers.houseid, rooms: {$elemMatch: {roomId: request.headers.roomid}}}}}).limit(1).next(async function (errrr, doccc) {
                        if(doccc === null) {
                            collection.update(
                                { 'userId': request.headers.userid, 'houses.houseId': request.headers.houseid},
                                { $push: {'houses.$.rooms': {'roomId': request.headers.roomid, 'appliances': []}}},
                                async function (error, result) {
                                    if(error) {
                                        response.status(500).json({ Error: "Internal server error" }).send(error);
                                    }
                                    response.send(result);
                                }
                            );
                        } else {
                            response.status(500).json({ Error: "RoomId already exists" }).send(errr);
                        }
                    });

                }
            });
        }
    });
});

app.post("/addAppliance", (request, response) => {

    collection.find({ userId: request.headers.userid}).limit(1).next(async function (err, doc) {
        if (doc === null) {
            response.status(500).json({ Error: "UserId does not exists" }).send(err);
        } else {
            // console.log(collection.find({ houses: {$elemMatch: {houseid: request.headers.houseid}}}));
            collection.find({ houses: {$elemMatch: {houseId: request.headers.houseid}}}).limit(1).next(async function (errr, docc) {
                // console.log(docc);
                if (docc === null) {
                    response.status(500).json({ Error: "HouseId does not exists" }).send(errr);

                } else {
                    collection.find({ houses: {$elemMatch: {houseId: request.headers.houseid, rooms: {$elemMatch: {roomId: request.headers.roomid}}}}}).limit(1).next(async function (errrr, doccc) {
                        if(doccc === null) {
                            response.status(500).json({ Error: errrr.errmsg }).send(errrr);
                        } else {
                            collection.find({ houses: {$elemMatch: {houseId: request.headers.houseid, rooms: {$elemMatch: {roomId: request.headers.roomid, appliances: {$elemMatch: {applianceId: request.headers.applianceid}}}}}}}).limit(1).next(async function (errrrr, docccc) {
                                if (docccc === null) {
                                    collection.update(
                                        { 'userId': request.headers.userid, 'houses.houseId': request.headers.houseid, 'houses.rooms.roomId': request.headers.roomid},
                                        { $addToSet: {'houses.$[].rooms.$[].appliances': {'applianceId': request.headers.applianceid, 'status': false}}},
                                        async function (error, result) {
                                            if(error) {
                                                response.status(500).json({ Error: error.errmsg }).send(error);
                                            }
                                            response.send(result);
                                        }
                                    );
                                } else {
                                    response.status(500).json({ Error: "ApplianceId already exists" }).send(errrr);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

app.post("/updateAppliance", (request, response) => {
    collection.find({ userId: request.headers.userid}).limit(1).next(async function (err, doc) {
        if (doc === null) {
            response.status(500).json({ Error: "UserId does not exists" }).send(err);
        } else {
            // console.log(collection.find({ houses: {$elemMatch: {houseid: request.headers.houseid}}}));
            collection.find({ houses: {$elemMatch: {houseId: request.headers.houseid}}}).limit(1).next(async function (errr, docc) {
                // console.log(docc);
                if (docc === null) {
                    response.status(500).json({ Error: "HouseId does not exists" }).send(errr);

                } else {
                    collection.find({ houses: {$elemMatch: {houseId: request.headers.houseid, rooms: {$elemMatch: {roomId: request.headers.roomid}}}}}).limit(1).next(async function (errrr, doccc) {
                        if(doccc === null) {
                            response.status(500).json({ Error: "RoomId does not exists" }).send(errr);
                        } else {
                            collection.find({ houses: {$elemMatch: {houseId: request.headers.houseid, rooms: {$elemMatch: {roomId: request.headers.roomid, appliances: {$elemMatch: {applianceId: request.headers.applianceid}}}}}}}).limit(1).next(async function (errrrr, docccc) {
                                // if (docccc === null) {
                                //     response.status(500).json({ Error: "ApplianceId does not exists" }).send(errrrr);
                                // } else {
                                //
                                // }

                                collection.update(
                                    { 'userId': request.headers.userid, 'houses.houseId': request.headers.houseid, 'houses.rooms.roomId': request.headers.roomid, 'houses.rooms.appliances.applianceId': request.headers.applianceid},
                                    { $set: {'houses.$[].rooms.$[].appliances.$[elm].status':  request.headers.status}},
                                    {
                                        arrayFilters: [ { "elm.applianceId": { $eq: request.headers.applianceid } } ]
                                    },
                                    async function (error, result) {
                                        if(error) {
                                            response.status(500).json({ Error: error.errmsg }).send(error);
                                        }
                                        response.send(result);
                                    }
                                );
                            });
                        }
                    });
                }
            });
        }
    });
});

app.get("/getAppliance", (request, response) => {
    collection.find({ houses: {$elemMatch: {houseId: request.headers.houseid, rooms: {$elemMatch: {roomId: request.headers.roomid, appliances: {$elemMatch: {applianceId: request.headers.applianceid}}}}}}})
        .project({'houses.rooms.appliances.status': 1}).toArray(async function (errrrr, docccc) {
        if(errrrr) {
            response.status(500).json({ Error: errrrr.errmsg }).send(errrrr);
        }
        if (docccc === null || docccc === []) {
            response.status(404).json({ Error: 'Not Found' }).send(docccc);
        }
        console.log(docccc);
        docccc.forEach((item1) => {
            if (item1.houses.length > 0) {
                item1.houses.forEach((item2) => {
                    if (item2.rooms.length > 0) {
                        item2.rooms.forEach((item3) => {
                            if (item3.appliances.length > 0) {
                                item3.appliances.forEach((item4) => {
                                    console.log(item4);
                                    if (item4.status !== null || item4.status !== undefined) {
                                        return response.send(item4.status);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
        response.status(404).json({ Error: 'Not Found' }).send(docccc);
    });
});

app.get("/login", (request, response) => {
    loginCollection.find({ username: request.headers.username, password: request.headers.password} ).limit(1).next(async function (error, result) {
        if(error) {
            return response.status(500).send(error);
        }
        if (result === null || result === []) {
            response.status(404).json({ Error: 'Not Found' }).send(result);
        }
        response.send(result);
    });
});

app.post("/addLoginCredential", (request, response) => {
    // console.log(request.headers);
    loginCollection.find({ username: request.headers.username, password: request.headers.password}).limit(1).next(async function (err, doc) {
        if (doc === null) {
            let loginData = {
                username: request.headers.username,
                password: request.headers.password
            };

            loginCollection.insert(loginData, async function (error, result) {
                if(error) {
                    response.status(500).json({ Error: "Internal server error" }).send(error);
                }
                response.send(result);
            });
        } else {
            response.status(500).json({ Error: "UserId already exists" }).send(err);
        }
    });
});

app.listen(3000, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("people");
        loginCollection = database.collection("login");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});
