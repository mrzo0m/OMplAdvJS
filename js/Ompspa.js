/**
 * Created by Oleg_Burshinov on 10.01.14.
 */
function OmpspaClass() {
    if (ompspa){
        return ompspa;
    }
    var ompspa = this;

    this.model_ = new Model();
    this.view_ = new View(this.model_);
    this.controller_ = new Controller(this.model_, this.view_);

    this.ITEMS_ON_PAGE = 2;
    this.ASC = "ASC";
    this.DESC = "DESC";
    this.NO_ORDER = "";
    this.BIDDING_ROW_NUMBER = 9;

// Public static method.
    this.getModel = function () {
        return this.model_;
    };
    this.getView = function () {
        return this.view_;
    };
    this.getController = function () {
        return this.controller_;
    };
}

