import {
    User
} from './User.js';
import {
    Ride
} from './Ride.js';

// Firebase objects
const auth = firebase.auth();
const firestore = firebase.firestore();

// DOM Vars
const loginForm = document.querySelector('.loginForm');
const registerForm = document.querySelector('.registerForm');
const loginContainer = document.querySelector('.login-container');
const registerContainer = document.querySelector('.register-container');
const appContainer = document.querySelector('.app-container');
const signOutBtn = document.querySelector('.signOut-btn');
const goToRegisterBtn = document.querySelector('.goToRegister-btn');
const backToLoginBtn = document.querySelector('.backToLogin-btn');
const registerErrors = document.querySelector('.register-errors');
const loginErrors = document.querySelector('.login-errors');
const headerUsername = document.querySelector('.header-username');
const addRideForm = document.querySelector('.addRide-form');
const addRideAlert = document.querySelector('.addRide-alert');
// Vars
let isLoggedIn = false;
let appUser = null;
let alertTimer = null;

// Functions
const login = (email, password) => {
    auth.signInWithEmailAndPassword(email, password)
        .then(userCred => {
            loginErrors.classList.add('d-none');
            loginErrors.textContent = '';
        })
        .catch(err => {
            loginErrors.classList.remove('d-none');
            loginErrors.textContent = err.message;
        });
};
const register = (email, password, name) => {
    console.log(email, password, name);
    auth.createUserWithEmailAndPassword(email, password)
        .then(userCred => {
            firestore.collection('users').doc(userCred.user.uid).set({
                username: name
            });
            registerForm.reset();
            registerErrors.textContent = '';
            registerErrors.classList.add('d-none');
            registerContainer.classList.add('d-none');
        })
        .catch(err => {
            registerErrors.classList.remove('d-none');
            registerErrors.textContent = err.message;
        });
};

const toggleLoginForm = (isLoggedIn) => {
    if (isLoggedIn) {
        loginContainer.classList.add('d-none');
        loginForm.reset();
        appContainer.classList.toggle('d-none');
    } else {
        loginContainer.classList.remove('d-none');
        loginForm['login-email'].focus();
    }
}

const updateNameUI = (user) => {
    firestore.collection('users')
        .doc(user.uid)
        .get()
        .then(docSnap => {
            headerUsername.textContent = docSnap.data().username;
        });

};

const addRide = (kmBefore, startLoc, kmAfter, endLoc) => {
    const timestamp = new Date();
    console.log(appUser);
    firestore.collection('rides')
        .add({
            startKM: parseInt(kmBefore),
            startLoc: startLoc,
            endKM: parseInt(kmAfter),
            endLoc: endLoc,
            driver: 'users/' + appUser.uid,
            passengers: [],
            timestamp: timestamp
        })
        .then(dr => {
            addRideForm.reset();
            loadLastRide();
            addRideAlert.classList.remove('d-none');
            addRideAlert.classList.add('alert-primary');
            addRideAlert.innerHTML = ` 
            <h4>Sucess!</h4>
            <hr>
            Your entry was saved!`;
            addRideForm['addR-endKM'].focus();

            alertTimer = setInterval(() => {
                addRideAlert.innerHTML = '';
                addRideAlert.classList.remove('alert-primary');
                addRideAlert.classList.add('d-none');
                clearInterval(alertTimer);
            }, 4000);
        });
};

const loadLastRide = () => {
    firestore.collection('rides').orderBy('timestamp', 'desc').get()
    .then(snap => {
        const {endKM, endLoc} = snap.docs[0].data();
        addRideForm['addR-startKM'].value = endKM;
        addRideForm['addR-start'].value = endLoc;
    });
};

//  Event Listeners
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    login(loginForm['login-email'].value, loginForm['login-password'].value);
});
registerForm.addEventListener('submit', e => {
    e.preventDefault();
    register(registerForm['register-email'].value, registerForm['register-password'].value, registerForm['register-name'].value);
});

goToRegisterBtn.addEventListener('click', e => {
    e.preventDefault();
    loginContainer.classList.add('d-none');
    loginForm.reset();
    loginErrors.textContent = '';
    loginErrors.classList.add('d-none');

    registerContainer.classList.remove('d-none');
});
backToLoginBtn.addEventListener('click', e => {
    e.preventDefault();
    registerContainer.classList.add('d-none');
    registerForm.reset();
    registerErrors.textContent = '';
    registerErrors.classList.add('d-none');
    loginContainer.classList.remove('d-none');
});

signOutBtn.addEventListener('click', e => {
    auth.signOut();
    appContainer.classList.add('d-none');
});

addRideForm.addEventListener('submit', e => {
    e.preventDefault();
    const kmBefore = addRideForm['addR-startKM'].value;
    const startLoc = addRideForm['addR-start'].value;
    const kmAfter = addRideForm['addR-endKM'].value;
    const endLoc = addRideForm['addR-end'].value;

    addRide(kmBefore, startLoc, kmAfter, endLoc);
});

// Auth state listener
auth.onAuthStateChanged(user => {
    isLoggedIn = (user !== null ? true : false);
    appUser = user;

    toggleLoginForm(isLoggedIn);

    if (isLoggedIn) {
        loadLastRide();
        updateNameUI(user);
    }
});

firestore.collection('rides').onSnapshot({
    next(snapshot){
        loadLastRide();
    },
    error(err){
        console.log(err);
    }
});