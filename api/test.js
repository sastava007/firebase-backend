const firebase = require("firebase");
var jwt = require("jsonwebtoken");
const shortid = require("shortid");
const {
    firebase_config,
    passport_auth_config
} = require("../Config/constants");
var enterpriseHelper = require("./enterpriseAPIController");
var CompanyDetails = require("../model/companyDetails.js")
// var bcrypt = require('bcrypt');
//const logger = require("../log/logger").logger;

var db_config = {
    apiKey: firebase_config.apiKey,
    authDomain: firebase_config.authDomain,
    databaseURL: firebase_config.databaseURL,
    projectId: firebase_config.projectId,
    storageBucket: firebase_config.storageBucket,
    messagingSenderId: firebase_config.messagingSenderId
};

firebase.initializeApp(db_config);

// const getSnapShot = async function (
//  data,
//  accessToken,
//  refreshToken,
//  authChannel,
//  callback
// ) {
//  let status = 200;
//  let token = "";
//  let response = {};
//  let userID = "";
//  let name = "";
//  let setup = false;
//  var userReference = firebase.database().ref("/Users/" + authChannel);

//  switch (authChannel) {
//      case "LOCAL":
//          id = "abcd1234";
//          await userReference
//              .orderByChild("emailID")
//              .equalTo(data.emailID)
//              .once("value", function (snapshot) {
//                  console.log("snapshot value ", snapshot.val());
//                  if (snapshot.val()) {
//                      for (var key in snapshot.val()) DBdata = snapshot.val()[key];
//                      id = DBdata.id || "abcd1234";
//                  } else {
//                      id = "abcd1234";
//                  }
//              });
//          orderByInfo = "id";
//          console.log("id fetched is : ", id);
//          break;

//      case "SALESFORCE":
//          orderByInfo = "id";
//          id = data.user_id || data.id;
//          break;

//      default:
//          orderByInfo = "id";
//          id = data.id;
//          break;
//  }
//  var ref = userReference.child(id);

//  ref.once(
//      "value",
//      async function (snapshot) {
//          console.log("snapshot value ", snapshot.val());
//          if (snapshot.val()) {
//              let DBdata;

//              DBdata = snapshot.val();
//              console.log("DB data for get ", authChannel, DBdata);
//              if (authChannel === "LOCAL") {
//                  // let userPass = false;
//                  // await bcrypt.compare(data.password, DBdata.password).then(res => {
//                  //  userPass = res;
//                  // });
//                  // console.log('this is user base', userPass)
//                  if (data.emailID === DBdata.emailID && data.password === DBdata.password) {
//                      token = jwt.sign({
//                          userData: DBdata,
//                          authChannel: authChannel,
//                          accessToken: accessToken,
//                          refreshToken: refreshToken
//                      },
//                          passport_auth_config.jwt_secret
//                      );
//                      status = 200;
//                      name = DBdata.username;
//                      response.token = token;
//                      response.statusCode = status;
//                      response.setup = setup;
//                      response.user_id = id;
//                      response.name = name;
//                      response.fastSetup = DBdata.fastSetup;
//                      response.planSelected = DBdata.planSelected;
//                      response.chatShopFlag = DBdata.chatShopFlag;
//                      response.moduleSelected = DBdata.module;
//                      response.chatShopId = DBdata.chatShopId;
//                      response.addProductStatus = DBdata.addProductStatus;
//                      var api_key_list = await enterpriseHelper.getAPIKeyList(id);
//                      console.log(
//                          "Response obtained from enterprse :",
//                          JSON.stringify(api_key_list)
//                      );

//                      if (api_key_list && api_key_list.length > 0) {
//                          var project_data = api_key_list[0];
//                          response.api_key = project_data.api_key;
//                          response.project_id = project_data.project_id;
//                      } else {
//                          response.api_key = null;
//                          response.project_id = null;
//                      }
//                  } else {
//                      status = 401;
//                      response.statusCode = status;
//                      response.message = "Authentication Failed";
//                  }
//              } else {
//                  token = jwt.sign({
//                      userData: DBdata,
//                      authChannel: authChannel,
//                      accessToken: accessToken,
//                      refreshToken: refreshToken
//                  },
//                      passport_auth_config.jwt_secret
//                  );
//                  status = 200;
//                  setup = DBdata.setup;
//                  response.user_id = DBdata.id;
//                  response.token = token;
//                  response.statusCode = status;
//                  response.setup = setup;
//                  response.addProductStatus = DBdata.addProductStatus;
//                  response.chatShopId = DBdata.chatShopId;
//                  response.fastSetup = DBdata.fastSetup;
//                  response.planSelected = DBdata.planSelected;
//                  response.chatShopFlag = DBdata.chatShopFlag;
//                  response.name = name;
//                  response.module = DBdata.module;
//                  var api_key_list = await enterpriseHelper.getAPIKeyList(id);
//                  //console.log("Response obtained from enterprse :", api_key_list, api_key_list.length);
//                  if (api_key_list && api_key_list.length > 0) {
//                      var project_data = api_key_list[0];
//                      response.api_key = project_data.api_key;
//                      response.project_id = project_data.project_id;
//                  } else {
//                      response.api_key = null;
//                      response.project_id = null;
//                  }
//              }
//          } else {
//              //logger.error("User doesnt exist in DB");
//              status = 404;
//              response.statusCode = status;
//              response.message = "User not found. Pls signup to continue";
//          }
//          //logger.debug("response being sent is ", response)
//          callback(null, response);
//      },
//      function (errorObject) {
//          console.log("The read failed: " + errorObject.code);
//          callback(errorObject, null);
//      }
//  );
// };

const getSnapShot = async function (
    data,
    accessToken,
    refreshToken,
    authChannel,
    callback
) {
    let status = 200;
    let token = "";
    let response = {};
    let userID = "";
    let name = "";
    let setup = false;
    var userReference = firebase.database().ref("/Users/" + authChannel);
    console.log("Email address " + data.emailID)
    data.emailID = data.emailID ? data.emailID : data.email;
    switch (authChannel) {
        case "LOCAL":
            id = "abcd1234";
            await userReference
                .orderByChild("emailID")
                .equalTo(data.emailID)
                .once("value", function (snapshot) {
                    console.log("snapshot value ", snapshot.val());
                    if (snapshot.val()) {
                        for (var key in snapshot.val()) DBdata = snapshot.val()[key];
                        id = DBdata.id || "abcd1234";
                    } else {
                        id = "abcd1234";
                    }
                });
            orderByInfo = "id";
            console.log("id fetched is : ", id);
            break;

        case "SALESFORCE":
            orderByInfo = "id";
            id = data.user_id || data.id;
            break;

        default:
            orderByInfo = "id";
            id = data.id;
            break;
    }
    var ref = userReference.child(id);

    ref.once(
        "value",
        async function (snapshot) {
            console.log("snapshot value ", snapshot.val());
            if (snapshot.val()) {
                let DBdata;

                DBdata = snapshot.val();
                console.log("DB data for get ", authChannel, DBdata);
                if (authChannel === "LOCAL") {
                    // let userPass = false;
                    // await bcrypt.compare(data.password, DBdata.password).then(res => {
                    //  userPass = res;
                    // });
                    // console.log('this is user base', userPass)
                    if (data.emailID === DBdata.emailID && data.password === DBdata.password) {
                        token = jwt.sign({
                            userData: DBdata,
                            authChannel: authChannel,
                            accessToken: accessToken,
                            refreshToken: refreshToken
                        },
                            passport_auth_config.jwt_secret
                        );
                        status = 200;
                        name = DBdata.Name ? DBdata.Name : DBdata.name;
                        response.token = token;
                        response.statusCode = status;
                        response.userId = DBdata.id;
                        response.name = name;
                        var api_key_list = await enterpriseHelper.getAPIKeyList(DBdata.id);
                        console.log(
                            "Response obtained from enterprse :",
                            JSON.stringify(api_key_list)
                        );

                        if (api_key_list && api_key_list.length > 0) {
                            var project_data = api_key_list[0];
                            response.api_key = project_data.api_key;
                            response.project_id = project_data.project_id;
                        } else {
                            response.api_key = null;
                            response.project_id = null;
                        }
                    } else {
                        status = 401;
                        response.statusCode = status;
                        response.message = "Authentication Failed";
                    }
                } else {
                    token = jwt.sign({
                        userData: DBdata,
                        authChannel: authChannel,
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    },
                        passport_auth_config.jwt_secret
                    );
                    status = 200;
                    response.userId = DBdata.id;
                    response.token = token;
                    response.statusCode = status;
                    response.name = name;
                    var api_key_list = await enterpriseHelper.getAPIKeyList(DBdata.id);
                    console.log("Response obtained from enterprse :", api_key_list, api_key_list.length);
                    if (api_key_list && api_key_list.length > 0) {
                        var project_data = api_key_list[0];
                        response.api_key = project_data.api_key;
                        response.project_id = project_data.project_id;
                    } else {
                        response.api_key = null;
                        response.project_id = null;
                    }
                }
            } else {
                //logger.error("User doesnt exist in DB");
                status = 404;
                response.statusCode = status;
                response.message = "User not found. Pls signup to continue";
            }
            //logger.debug("response being sent is ", response)
            CompanyDetails.findOne({
                emailID: data.emailID
            }, async (err, resp) => {
                if (err) {
                    console.log("Error in retreiving data " + err);
                    callback(null, response);
                } else {
                    if (resp && response.status != 401) {
                        console.log("Company details response " + resp);
                        response.name = resp.name ? resp.name : undefined
                        response.setup = resp.setup ? resp.setup : undefined
                        response.country = resp.country ? resp.country : undefined
                        response.company = resp.company ? resp.company : undefined
                        response.company_size = resp.company_size ? resp.company_size : undefined
                        response.storeInfo = resp.store_info ? resp.store_info : undefined
                        response.send_mail = resp.send_mail ? resp.send_mail : undefined
                        response.module = resp.module ? resp.module : undefined
                        response.emailID = resp.emailID ? resp.emailID : resp.emailId
                        response.fastSetup = resp.fastSetup ? resp.fastSetup : undefined
                        response.planSelected = resp.planSelected ? resp.planSelected : undefined
                        response.websiteURL = resp.websiteURL ? resp.websiteURL : undefined
                        response.lang = resp.lang ? resp.lang : undefined
                        response.plan = resp.plan ? resp.plan : undefined
                        response.userId = resp.userId ? resp.userId : undefined
                        response.chatShopFlag = resp.chatShopFlag ? resp.chatShopFlag : undefined
                        response.chatShopId = resp.chatShopId ? resp.chatShopId : undefined
                        response.addProductStatus = resp.addProductStatus ? resp.addProductStatus : undefined
                        response.firstname = resp.firstname ? resp.firstname : undefined
                        response.lastname = resp.lastname ? resp.lastname : undefined
                        response.updatesServices = resp.updatesServices ? resp.updatesServices : undefined
                        response.companyDetails = true
                        var api_key_list = await enterpriseHelper.getAPIKeyList(resp.userId);
                        console.log("Response obtained from enterprse :", api_key_list, api_key_list.length);
                        if (api_key_list && api_key_list.length > 0) {
                            var project_data = api_key_list[0];
                            response.api_key = project_data.api_key;
                            response.project_id = project_data.project_id;
                        } else {
                            response.api_key = null;
                            response.project_id = null;
                        }
                    } else {
                        status = 404;
                        response.statusCode = status;
                    }
                    console.log("Response to be updated " + JSON.stringify(response))
                    callback(null, response);
                }
            })

        },
        function (errorObject) {
            console.log("The read failed: " + errorObject.code);
            callback(errorObject, null);
        }
    );
};

const getUserProfile = function (id, authChannel, callback) {
    let status = 200;
    let response = {};
    var userReference, ref;
    if (authChannel) {
        userReference = firebase.database().ref("/Users/" + authChannel);

        ref = userReference.child(id);
        ref.once(
            "value",
            function (snapshot) {
                if (snapshot.val()) {
                    let DBdata;
                    DBdata = snapshot.val();
                    console.log("DB data is ", DBdata);
                    callback(null, DBdata);
                } else {
                    callback(404, null);
                }
            },
            function (errorObject) {
                console.log("The read failed: " + errorObject.code);
                callback(errorObject, null);
            }
        );
    } else {
        var userReference = firebase.database().ref("/Users/");
        ref = userReference;
        var found = 0;
        //ref = ref.orderByKey().equalTo(id);
        console.log("logging userRef " + ref);
        ref.once(
            "value",
            function (snapshot) {
                snapshot.forEach(child => {
                    if (!found && child.child(id).val()) {
                        let DBdata;
                        DBdata = child.child(id).val();
                        found = 1;
                        console.log("DB data is ", DBdata);
                        callback(null, DBdata);
                    }
                });
                if (!found) {
                    callback(404, null);
                }
            },
            function (errorObject) {
                console.log("The read failed: " + errorObject.code);
                callback(errorObject, null);
            }
        );
    }
};

const checkIfUserExists = function (data, callback) {
    let status = 200;
    let token = "";
    let response = {};
    var userReference = firebase.database().ref("/Users/" + "LOCAL");
    orderByInfo = "emailID";
    id = data.emailID;

    userReference
        .orderByChild(orderByInfo)
        .equalTo(id)
        .once(
            "value",
            function (snapshot) {
                console.log("snapshot value ", snapshot.val());
                if (snapshot.val()) {
                    status = 200;
                } else {
                    status = 404;
                }
                response.statusCode = status;
                if (status == 404) {
                    CompanyDetails.findOne({
                        emailID: id
                    }, (err, resp) => {
                        if (err) {
                            console.log("Error in retreiving company details");
                            callback(null, response);
                        } else {
                            if (resp) {
                                response.companyPresent = true
                            }
                            callback(null, response);
                        }
                    })
                } else {
                    callback(null, response);
                }

            },
            function (errorObject) {
                console.log("The read failed: " + errorObject.code);
                callback(errorObject, null);
            }
        );
};

/*
const checkIfUserExists = function (data, callback) {
    let status = 200;
    let token = "";
    let response = {};
    var userReference = firebase.database().ref("/Users/" + "LOCAL");
    orderByInfo = "emailID";
    id = data.id;

    var ref = userReference.child(id);
    ref.once("value", 
        function (snapshot) {
            console.log("snapshot value ", snapshot.val())
            if (snapshot.val()) {
                status = 200;
            } else {

                status = 404;
            }
            response.statusCode = status
            callback(null, response);
        },
        function (errorObject) {
            console.log("The read failed: " + errorObject.code);
            callback(errorObject, null);
        });
}
*/
const updateValues = function (id, authChannel, data, callback) {
    let status = 200;
    console.log("Values to update in db" + JSON.stringify(data));

    // let response = {};
    var userReference = firebase.database().ref("/Users/" + authChannel);
    var ref = userReference.child(id);
    ref.update(data, function (err) {
        // if (err) callback(err, null);
        // else callback(null, "success");
    });

    CompanyDetails.findOneAndUpdate({
        emailID: data.emailID
    }, {
        "$set": data
    }, {
        upsert: true
    }, (err, resp) => {
        if (err) callback(err, null);
        else callback(null, "success");
    })




};

const updateSpecficValues = function (id, authChannel, data, callback) {
    var userReference = firebase.database();
    userReference
        .ref("/Users/" + authChannel + "/" + id + "/module")
        .set(data, err => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, "success");
            }
        });
};

const addUser = function (
    accessToken,
    refreshToken,
    user,
    authChannel,
    callback
) {
    var referencePath = "/Users/" + authChannel + "/";
    let response = {};
    console.log("referencepath is in add user ", user);
    userReference = firebase.database().ref(referencePath);
    var userObj = {};
    var companyObj = {}
    switch (authChannel) {
        case "GOOGLE":
            userObj = {
                name: user.displayName,
                id: user.id,
                emailID: user.emails[0].value,
                fastSetup: false,
                planSelected: false
            };
            if (user.companyDetails) {
                companyObj = user.companyDetails
                userObj.id = user.companyDetails.userId
            } else {
                companyObj = {
                    name: user.displayName,
                    userId: user.id,
                    emailID: user.emails[0].value,
                    fastSetup: false,
                    planSelected: false
                }
            }

            break;
        case "LOCAL":
            let name = user.firstname + " " + user.lastname
            userObj = {
                name: name,
                id: shortid.generate(),
                emailID: user.emailID,
                password: user.password,
                country: user.country,
                company: user.company,
                company_size: user.company_size,
                store_info: user.store_info,
                send_mail: user.send_mail,
                module: user.module,
                firstname: user.firstname,
                lastname: user.lastname,
                updatesServices: user.updatesServices ? user.updatesServices : true,
                fastSetup: false,
                planSelected: false
            };
            companyObj = {
                userId: userObj.id,
                name: name,
                emailID: user.emailID,
                country: user.country,
                company: user.company,
                company_size: user.company_size,
                store_info: user.store_info,
                send_mail: user.send_mail,
                module: user.module,
                firstname: user.firstname,
                lastname: user.lastname,
                fastSetup: false,
                updatesServices: user.updatesServices ? user.updatesServices : true,
                planSelected: false
            }
            break;

        case "EVERNOTE":
            userObj = {
                id: user.id
            };
            break;

        case "SALESFORCE":
            userObj = {
                id: user.user_id,
                name: user.name,
                email: user.email
            };
            break;
        case "FACEBOOK":
            userObj = {
                name: user.displayName,
                id: user.id,
                emailID: user.emails[0].value,
                fastSetup: false,
                planSelected: false
            };
            companyObj = {
                emailID: user.emails[0].value,
                userId: user.id,
                fastSetup: false,
                planSelected: false
            }
            break;

        case "SLACK":
            userObj = {
                name: user.displayName,
                id: user.id,
                email: user.user.email
            };
            break;
    }
    if (!companyObj.setup) companyObj.setup = false;

    userReference.child(userObj.id).set(userObj, function (error) {
        if (error) {
            console.log(
                "User couldnt be added  ",
                accessToken,
                profile.id,
                profile.displayName
            );
            callback(error, null);
        } else {
            let tokenObj = { ...userObj, ...companyObj }
            response = tokenObj
            console.log("Data saved successfully. ", JSON.stringify(response));
            response.token = jwt.sign({
                userData: tokenObj,
                authChannel: authChannel,
                accessToken: accessToken,
                refreshToken: refreshToken
            },
                passport_auth_config.jwt_secret
            );
            response.statusCode = 200;
            response.user_id = companyObj.userId;
            response.setup = companyObj.setup;
            uploadCompanyDetails(companyObj);
            if (user.api_key) {
                response.api_key = user.api_key
            }

            callback(null, response);
        }
    });
};

const uploadCompanyDetails = (data) => {
    console.log("To upload Company Details to mongo db ", JSON.stringify(data));
    let companyStr = JSON.stringify(data);
    let company = JSON.parse(companyStr);
    delete company['_id']
    CompanyDetails.findOneAndUpdate({
        emailID: company.emailID
    }, company, {
        upsert: true
    }, (err, resp) => {
        if (err) {
            console.log("Error in updating details " + err);
        } else {
            console.log("Sucessfully uploaded")
        }
    })
}

const importFromFb = (authChannel) => {
    let userReference = firebase.database().ref("/Users/" + authChannel);
    let errorFlag = false;
    userReference.on("value", function (snapshot) {

        let id = Object.keys(snapshot.val())
        for (let i = 0; i < id.length; i++) {
            console.log("Id to be saved " + id[i])
            let fireDbDetails = snapshot.val()[id[i]]
            console.log("FIrebase details " + JSON.stringify(fireDbDetails));
            let companyDetails = {
                setup: fireDbDetails.setup,
                country: fireDbDetails.country,
                company: fireDbDetails.company,
                company_size: fireDbDetails.company_size,
                store_info: fireDbDetails.store_info,
                send_mail: fireDbDetails.send_mail,
                module: fireDbDetails.module,
                emailID: fireDbDetails.emailID ? fireDbDetails.emailID : fireDbDetails.email,
                fastSetup: fireDbDetails.fastSetup,
                planSelected: fireDbDetails.planSelected,
                websiteURL: fireDbDetails.websiteURL,
                lang: fireDbDetails.lang,
                plan: fireDbDetails.plan,
                userId: fireDbDetails.id,
                firstname: fireDbDetails.firstname,
                lastname: fireDbDetails.lastname,
                name: fireDbDetails.firstname + " " + fireDbDetails.lastname,
                chatShopFlag: fireDbDetails.chatShopFlag,
                chatShopId: fireDbDetails.chatShopId,
                updatesServices: fireDbDetails.updatesServices ? fireDbDetails.updatesServices : null
            }
            console.log("import From Fb " + JSON.stringify(companyDetails));
            CompanyDetails.findOneAndUpdate({
                emailID: companyDetails.emailID
            }, companyDetails, { upsert: true }, (err, res) => {
                if (err) {
                    errorFlag = true
                }
            })

        }
        return errorFlag
    })
}

// const addUser = function (
//  accessToken,
//  refreshToken,
//  user,
//  authChannel,
//  callback
// ) {
//  var referencePath = "/Users/" + authChannel + "/";
//  let response = {};
//  console.log("referencepath is in add user ", user);
//  userReference = firebase.database().ref(referencePath);
//  var userObj = {};
//  switch (authChannel) {
//      case "GOOGLE":
//          userObj = {
//              Name: user.displayName,
//              id: user.id,
//              email: user.emails[0].value,
//              setup: false,
//              fastSetup: false,
//              planSelected: false
//          };
//          break;
//      case "LOCAL":
//          userObj = {
//              firstname: user.firstname,
//              lastname: user.lastname,
//              country: user.country,
//              company: user.company,
//              company_size: user.company_size,
//              store_info: user.store_info,
//              send_mail: user.send_mail,
//              module: user.module,
//              password: user.password,
//              emailID: user.emailID,
//              id: shortid.generate(),
//              setup: false,
//              fastSetup: false,
//              planSelected: false
//          };
//          break;

//      case "EVERNOTE":
//          userObj = {
//              id: user.id
//          };
//          break;

//      case "SALESFORCE":
//          userObj = {
//              id: user.user_id,
//              Name: user.name,
//              email: user.email
//          };
//          break;
//      case "FACEBOOK":
//          userObj = {
//              Name: user.displayName,
//              id: user.id,
//              email: user.emails[0].value
//          };
//          break;

//      case "SLACK":
//          userObj = {
//              Name: user.displayName,
//              id: user.id,

//              email: user.user.email
//          };
//          break;
//  }
//  if (!userObj.setup) userObj.setup = false;

//  userReference.child(userObj.id).set(userObj, function (error) {
//      if (error) {
//          console.log(
//              "User couldnt be added  ",
//              accessToken,
//              profile.id,
//              profile.displayName
//          );
//          callback(error, null);
//      } else {
//          console.log("Data saved successfully.");

//          response.token = jwt.sign({
//                  userData: userObj,
//                  authChannel: authChannel,
//                  accessToken: accessToken,
//                  refreshToken: refreshToken
//              },
//              passport_auth_config.jwt_secret
//          );
//          response.statusCode = 200;
//          response.user_id = userObj.id;
//          response.setup = userObj.setup;
//          callback(null, response);
//      }
//  });
// };

module.exports = {
    addUser: addUser,
    getUserData: getSnapShot,
    checkIfUserExists: checkIfUserExists,
    getUserProfile: getUserProfile,
    updateValues: updateValues,
    updateSpecficValues: updateSpecficValues,
    importFromFb: importFromFb
};