import {User} from './User.js';
import { Ride } from './Ride.js';
const user = new User('savo', '12345');
const ride = new Ride('Linz','Marchtrenk', user, 1234,1245);
console.log(user);
console.log(ride);