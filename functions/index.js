const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const admin = require('firebase-admin');
admin.initializeApp();

const keyword = 'fahrtenbuch4321!';

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.registerWithKeyword = functions.https.onCall((data, context) => {
    if(data.keyword === keyword){
        return admin.auth().createUser({
            email: data.email,
            password: data.password,
            displayName: data.name
        }).catch(err => {throw new functions.https.HttpsError('unknown',  err.message)});
    }else{
        throw new functions.https.HttpsError('permission-denied','Keyword is wrong!');
    }
});