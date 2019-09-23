export class Ride {
    constructor(startLoc, endLoc, driver, startKM, endKM, passengers = null){
        this.startLoc = startLoc;
        this.endLoc = endLoc;
        this.driver = driver;
        this.startKM = startKM;
        this.endKM = endKM;
        this.passengers = passengers;
    }
}