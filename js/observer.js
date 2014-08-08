/**
 * Created by Oleg_Burshinov on 16.12.13.
 */
var Event = function (sender) {
    this.sender_ = sender;
    this.listeners_ = [];
};
Event.prototype.attach = function (listener) {
    this.listeners_.push(listener);
};
Event.prototype.notify = function (args) {
    var index = 0;
    for (key in this.listeners_){
        this.listeners_[index](this.sender_, args);
        index++;
    }
};
