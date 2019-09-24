import {User} from './User.js';
import { Ride } from './Ride.js';

// Firebase objects
const auth = firebase.auth();
const firestore = firebase.firestore();

// DOM Vars
const loginForm = document.querySelector('.loginForm');
const loginContainer = document.querySelector('.login-container');
const appContainer = document.querySelector('.app-container');
const signOutBtn = document.querySelector('.signOut-btn');
// Vars
let isLoggedIn = false;

// Functions
const login = (email, password) => {
    auth.signInWithEmailAndPassword(email, password)
    .then(userCred => console.log(userCred))
    .catch(err => console.log(err));
};

const toggleLoginForm = (isLoggedIn) => {
    if(isLoggedIn){
        loginContainer.classList.add('d-none');
        loginForm.reset();
        appContainer.classList.toggle('d-none');
    }else{
        loginContainer.classList.remove('d-none');
        loginForm['login-email'].focus();
    }
}

//  Event Listeners
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    login(loginForm['login-email'].value, loginForm['login-password'].value);
});

signOutBtn.addEventListener('click', e => {
    auth.signOut();
    appContainer.classList.add('d-none');
});


// Auth state listener
auth.onAuthStateChanged(user => {
    isLoggedIn = (user !== null ? true : false);
    
    toggleLoginForm(isLoggedIn);
});