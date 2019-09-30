export class AppState{
    _appState = '';
    appStateListener = function(val){};
    constructor(){

    }

    get appState(){
        return this._appState;
    }

   
    set appState(val) {
        this._appState = val;
        this.appStateListener(val);
    }

    registerListener(listener) {
        this.appStateListener = listener;
    }

}