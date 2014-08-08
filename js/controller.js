/**
 * Created by Oleg_Burshinov on 16.12.13.
 */
function Controller(model, view) {
    this.model_ = model;
    this.view_ = view;
    var me = this;
    this.view_.registrationDataSubmit.attach(function (sender, json) {
        me.model_.registration(json);
    });
    this.view_.userRegistrationComplete.attach(function (sender, json) {
        me.registrationComplete(json);
    });
    this.view_.loginDataSubmit.attach(function (sender, json) {
        me.loginDataSubmit(json);
    });
    this.view_.signinComplete.attach(function (sender, json) {
        me.signinComplete(json);
    });
    this.view_.logoutComplete.attach(function (sender, json) {
        me.logoutComplete(json);
    });
    this.view_.sellButtonClick.attach(function (sender, json) {
        me.sellButtonClick(json);
    });
    this.view_.addItem.attach(function (sender, json) {
        me.addItem(json);
    });
    this.view_.addItemComplete.attach(function (sender, json) {
        me.addItemComplete(json);
    });
    this.view_.itemsDataRequest.attach(function (sender, json) {
        me.itemsDataRequest(json);
    });
    this.view_.buyButtonClick.attach(function (sender, json) {
        me.model_.buyItNowRequest(json);
    });
    this.view_.bidButtonClick.attach(function (sender, json) {
        me.model_.bidRequest(json);
    });
    this.view_.showMyItemsButtonClick.attach(function (sender, json) {
        me.showMyItemsButtonClick();
    });
    this.view_.editButtonClick.attach(function (sender, json) {
        me.model_.editRequest(json);
    });
    this.view_.deleteButtonClick.attach(function (sender, json) {
        me.model_.deleteRequest(json);
    });
    this.view_.searchButtonClick.attach(function (sender, json) {
        me.model_.search(json);
    });
}

// Public, non-privileged methods.
Controller.prototype.addItem = function (item) {
    this.model_.addItem(item);
};
//Controller.prototype.removeItem = function (index) {
//    this.model_.removeItem(index);
//};
//Controller.prototype.showAction = function () {
//    this.view_.showView();
//};
Controller.prototype.hashChangeEvent = function (newHash, oldHash) {
    var me = Ompspa.getController();

    //first time enter with hash
    if(oldHash == undefined) {
        hasher.changed.add(Ompspa.getController().hashChangeEvent, Ompspa); //add hash change listener
        hasher.initialized.add(Ompspa.getController().hashChangeEvent, Ompspa); //add initialized listener (to grab initial value in case it is already set)
        hasher.init(); //initialize hasher (start listening for history changes)
    }
    var tempHash = newHash;
    var showItemsHash = new RegExp('^ShowItems[?]', "gi");
    var skipReview = false;
    var isHasGetParams = false;
    if (newHash == oldHash) {
        skipReview = true;
    }
    if (newHash.match(showItemsHash)) {
        tempHash = 'ShowItems';
        skipReview = true;
        isHasGetParams = true;
        if(oldHash == undefined){
            me.view_.showItemsPage(isHasGetParams);
        }
//        me.view_.showItemsPage(isHasGetParams);
        var json = me.getJSONHashParams(newHash);
        me.itemsDataRequest(json);
    }
    var showMyItmesHash = new RegExp('^ShowMyItems[?]', "gi");
    if (newHash.match(showMyItmesHash)) {
        tempHash = 'ShowMyItems';
//        me.view_.showMyItemsPage(isHasGetParams);
        var json = me.getJSONHashParams(newHash);
        skipReview = true;
        me.itemsDataRequest(json);
    }

    if (!skipReview) {
        switch (tempHash) {
            case 'login':
                me.view_.showLoginPage();
                break;
            case 'Registration':
                me.view_.showRegistrationPage();
                break;
            case 'ShowItems' :
                me.view_.showItemsPage(isHasGetParams);
                break;
            case 'ShowMyItems' :
                me.view_.showMyItemsPage();
                break;
            case 'EditItem' :
                me.view_.showEditItemPage();
                break;
            default :
                me.view_.show404Page(tempHash);
                break;
        }
    }
};
Controller.prototype.registration = function (json) {
    this.model_.registration(json);
};

Controller.prototype.registrationComplete = function (json) {
    this.model_.setAuthorized(true);
    hasher.setHash('ShowItems');
};

Controller.prototype.loginDataSubmit = function (json) {
    this.model_.loginDataSubmit(json);
};

Controller.prototype.signinComplete = function () {
    hasher.setHash('ShowItems');
};

Controller.prototype.logoutComplete = function () {
    this.model_.logout();
    hasher.setHash('login');
};

Controller.prototype.sellButtonClick = function () {
    hasher.setHash('EditItem');
};
Controller.prototype.addItem = function (json) {
    this.model_.addItem(json);
};
Controller.prototype.addItemComplete = function (json) {
    hasher.setHash('ShowItems');
};
Controller.prototype.itemsDataRequest = function (json) {
    var this_ = this;

    function go() {
        this_.model_.getFullInfoItems(json);
    }

    function on() {
        timeoutId = setTimeout(go, 350); // Emulation response late
    }

    on();
};
Controller.prototype.showMyItemsButtonClick = function () {
    hasher.setHash("ShowMyItems");
};

Controller.prototype.getJSONHashParams = function (hash) {
    function getParameterByName(hash) {
        hash = hash.replace(/ShowItems\?/, '').replace(/ShowMyItems\?/, '');
        if (hash) {
            try {
                var data = JSON.parse('{"' + decodeURI(hash).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
                var json = {
                    pageNumber: (data.page ? data.page : ""),
                    itemsCountOnPage: (data.show ? data.show : ""),
                    order:  (data.order ? data.order : ""),
                    filter: (data.filter ? data.filter : ""),
                    myitems: (data.my ? data.my : "false"),
                    search: {
                        keyword: (data.keyword ? data.keyword : ""),
                        shipping: (data.shipping ? data.shipping : "")
                    }
                };
                if (json.myitems == "false"){
                    json.myitems = false;
                } else {
                    json.myitems = true;
                }
                json.pageNumber = Number(json.pageNumber);
                json.itemsCountOnPage = Number(json.itemsCountOnPage);
            } catch (e) {
                return JSON.stringify(Ompspa.getView().getFirstPage());
            }
            Ompspa.getView().setRequestPage(json); // Replace view state
            return JSON.stringify(json);
        } else {
            return JSON.stringify(Ompspa.getView().getFirstPage());
        }

    }

    return getParameterByName(hash);
};