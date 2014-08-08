/**
 * Created by Oleg_Burshinov on 16.12.13.
 */
var Ompspa = new OmpspaClass();
function initHandler() {
    if (!window.location.hash) {
        hasher.changed.add(Ompspa.getController().hashChangeEvent, Ompspa); //add hash change listener
        hasher.initialized.add(Ompspa.getController().hashChangeEvent, Ompspa); //add initialized listener (to grab initial value in case it is already set)
        hasher.init(); //initialize hasher (start listening for history changes)
        hasher.setHash('login'); //change hash value (generates new history record)
    } else {
        var hash = window.location.hash.toString().slice(2);
        Ompspa.getController().hashChangeEvent(hash);
    }
}