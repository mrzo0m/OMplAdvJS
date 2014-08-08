/**
 * Created by Oleg_Burshinov on 16.12.13.
 */
function Model() {
    var me = this;


    this.items_ = [];
    this.myItems_ = [];

    this.searchDataCash = [];
    this.searchParamCash = {
        keyword: "",
        shipping: ""
    };


    this.itemsOnPage = [];


    this.itemAdded = new Event(this);
    this.itemEdited = new Event(this);
    this.itmesChanged = new Event(this);
    this.itemsToShow = new Event(this);
    this.serchItemsToShow = new Event(this);
    this.userRegistred = new Event(this);
    this.wrongBid = new Event(this);

    this.userAuthorized = false;
    this.users = [];

    this.guestUser = {
        name: "guest",
        login: "guest"
    };

    this.ASC = "ASC";
    this.DESC = "DESC";
    this.NO_ORDER = "";

    this.UID = "1";
    this.TITLE = "2";
    this.DESCRIPTION = "3";

    this.itmesChanged.attach(function () {
        me.initMyItems();
    });

    this.currentUser = this.guestUser;
    this.currentPage = 0;
    this.init();

}
Model.prototype.getCurrentPage = function () {
    return this.currentPage;
};
Model.prototype.init = function () {
    this.currentPage = 1;
    var user1 = {
        name: "Alex Burn",
        email: "alex@mail.com",
        phone: "(123)312-12-23",
        address: "Ryazan Novoselov st.",
        login: "AlexBurn",
        password: "12345678"
    };

    var user2 = {
        name: "Alex",
        email: "alex@mail.rw",
        phone: "(123)312-12-43",
        address: "Ryazan Novoselov st.",
        login: "Alex",
        password: "12345678"
    };
    this.users.push(user1);
    this.users.push(user2);

    //==============items=============
    var item1 = {
        title: "Intel i5",
        description: "CPU 3.2 Mhz",
        startPrice: "233",
        startDate: "2013-12-24T06:58:54.457Z",
        bidInc: "12",
        buyItNow: "",
        timeLeft: "12:34",
        info: {
            uid: "1",
            seller: "Alex Burn",
            bestOffer: "",
            stopDate: "",
            bidders: []
        }
    };
    var item2 = {
        title: "X-Box 720",
        description: "Game console",
        startPrice: "433",
        startDate: "2013-12-24T06:58:54.457Z",
        bidInc: "41",
        buyItNow: "",
        timeLeft: "20:34",
        info: {
            uid: "2",
            seller: "Alex Burn",
            bestOffer: "700",
            stopDate: "",
            bidders: [
                {bidder: "Alex", bid: 299}
            ]
        }
    };
    var item3 = {
        title: "Sony PSP",
        description: "Portable game console",
        startPrice: "70",
        startDate: "2013-12-24T07:06:19.115Z",
        bidInc: "",
        buyItNow: "true",
        timeLeft: "",
        info: {
            uid: "3",
            seller: "Alex",
            bestOffer: "",
            stopDate: "",
            bidders: []
        }
    };
    var item4 = {
        title: "Book: Spring in action",
        description: "Guide for Java developers",
        startPrice: "31",
        startDate: "2013-12-20T07:25:12.342Z",
        bidInc: "4",
        buyItNow: "",
        timeLeft: "20:40",
        info: {
            uid: "4",
            seller: "Alex",
            bestOffer: "",
            stopDate: "",
            bidders: []
        }
    };
    var item5 = {
        title: "Book: JavaScript in action",
        description: "Guide for JavaScript developers",
        startPrice: "21",
        startDate: "2012-12-20T07:25:12.342Z",
        bidInc: "14",
        buyItNow: "",
        timeLeft: "21:40",
        info: {
            uid: "5",
            seller: "Alex",
            bestOffer: "",
            stopDate: "",
            bidders: []
        }
    };
    var item6 = {
        title: "Dandy",
        description: "Best game console ever",
        startPrice: "999",
        startDate: "2014-12-20T07:25:12.342Z",
        bidInc: "99",
        buyItNow: "",
        timeLeft: "23:23",
        info: {
            uid: "6",
            seller: "Alex",
            bestOffer: "",
            stopDate: "",
            bidders: []
        }
    };
    var item7 = {
        title: "Sega",
        description: "Another game console",
        startPrice: "21",
        startDate: "2013-12-24T07:06:19.115Z",
        bidInc: "",
        buyItNow: "true",
        timeLeft: "",
        info: {
            uid: "7",
            seller: "Alex Burn",
            bestOffer: "",
            stopDate: "",
            bidders: []
        }
    };
    var item8 = {
        title: "Zzzz",
        description: "Another game console",
        startPrice: "25",
        startDate: "2013-12-24T07:06:19.115Z",
        bidInc: "",
        buyItNow: "true",
        timeLeft: "",
        info: {
            uid: "8",
            seller: "Alex",
            bestOffer: "",
            stopDate: "",
            bidders: []
        }
    };
    var item9 = {
        title: "Zzz12z",
        description: "Another game console",
        startPrice: "11",
        startDate: "2013-12-24T07:06:19.115Z",
        bidInc: "",
        buyItNow: "true",
        timeLeft: "",
        info: {
            uid: "9",
            seller: "Alex Burn",
            bestOffer: "",
            stopDate: "",
            bidders: []
        }
    };
    var item10 = {
        title: "ZzzAAA",
        description: "Another game console",
        startPrice: "29",
        startDate: "2013-12-24T07:06:19.115Z",
        bidInc: "",
        buyItNow: "true",
        timeLeft: "",
        info: {
            uid: "10",
            seller: "Alex Burn",
            bestOffer: "",
            stopDate: "",
            bidders: []
        }
    };
    this.items_.push(item1);
    this.items_.push(item2);
    this.items_.push(item3);
    this.items_.push(item4);
    this.items_.push(item5);
    this.items_.push(item6);
    this.items_.push(item7);
    this.items_.push(item8);
    this.items_.push(item9);
    this.items_.push(item10);
    for (var j = 0; j < this.items_.length; j++) {
        this.setItemStopDate(this.items_[j]);
    }
};
Model.prototype.setAuthorized = function (flag) {
    this.userAuthorized = flag;
};
Model.prototype.isAuthorized = function () {
    return this.userAuthorized
};
Model.prototype.updateItem = function (item) {
    var this_ = this;
    for (var i = 0; i < this_.items_.length; i++) {
        if (this_.items_[i].info.uid == item.uid) {
            this_.items_[i].title = item.title;
            this_.items_[i].description = item.description;
            this_.items_[i].startPrice = item.startPrice;
            this_.items_[i].startDate = new Date().toJSON();
            this_.items_[i].bidInc = item.bidInc;
            this_.items_[i].timeLeft = item.timeLeft;
            this_.setItemStopDate(this_.items_[i]);
        }
    }
    this_.itemAdded.notify({item: item});
};


Model.prototype.addItem = function (json) {
    var item = JSON.parse(json);
    var this_ = this;
    if (item.uid) {
        this_.updateItem(item);
    } else {
        delete item["uid"];
        item.startDate = new Date().toJSON();
        item.info = {
            uid: this_.generateID(),
            seller: this_.currentUser.name,
            bestOffer: "",
            stopDate: "",
            bidders: []

        };
        this_.setItemStopDate(item);
        this_.items_.push(item);
        this_.myItems_.push(item);
        this_.itemAdded.notify({item: item});
        console.log(JSON.stringify(this_.items_));
    }
};

Model.prototype.registration = function (json) {
    var data = JSON.parse(json);
    this.users.push(data);
    this.currentUser = data;
    this.setAuthorized(true);
    this.initMyItems();
    this.userRegistred.notify(data);
    console.log(JSON.stringify(this.users));
};
Model.prototype.loginDataSubmit = function (json) {
    var data = JSON.parse(json);
    console.log(JSON.stringify(data));
    this.setAuthorized(false);
    for (var i = 0; i < this.users.length; i++) {
        if (this.users[i].login == data.login) {
            if (this.users[i].password == data.password) {
                this.setAuthorized(true);
                this.currentUser = this.users[i];
                this.initMyItems();
            }
        }
    }
};
Model.prototype.getCurrentUser = function () {
    return JSON.stringify(this.currentUser);
};

Model.prototype.logout = function () {
    this.setAuthorized(false);
    this.currentUser = this.guestUser;
    console.log(JSON.stringify(this.users));
};

Model.prototype.setItemStopDate = function (item) {
    if (item.timeLeft) {
        var startDate = new Date(item.startDate);
        if (item.timeLeft) {
            var hours = parseInt(item.timeLeft.substr(0, 2));
            var minutes = parseInt(item.timeLeft.substr(3));
            startDate.setHours(startDate.getHours() + hours);
            startDate.setMinutes(startDate.getMinutes() + minutes);
            item.info.stopDate = startDate.toJSON();
        }

    }
    return item;
};
Model.prototype.getItems = function () {
    return this.itemsOnPage;
};

Model.prototype.getFullInfoItems = function (json) {
    var this_ = this;
    var parameters = JSON.parse(json);

    if (parameters.myitems) {
        if (parameters.search.shipping && parameters.search.keyword) {
            this_.prepareSearchData(this.myItems_, parameters);
        } else {
            var startItem = ((parameters.pageNumber - 1) * parameters.itemsCountOnPage) + 1;
            var endItemm = startItem + parameters.itemsCountOnPage - 1;
            var data = [];
            var i = startItem;
            i--;//ArrayData
            if (this.myItems_[i]) {
                for (i; i < endItemm; i++) {
                    if (this.myItems_[i]) {
                        data.push(this.myItems_[i]);
                    }
                }
                this.currentPage = parameters.pageNumber;
                this.itemsOnPage = data.reverse(); // simple order ASC
            }
            this.itemsToShow.notify();
        }
    } else {


        //search
        if (parameters.search.shipping && parameters.search.keyword) {
            this_.prepareSearchData(this_.items_, parameters);

        } else {
            this_.prepareStoredData(this_.items_, parameters);
        }
    }
};
Model.prototype.prepareSearchData = function (arr, parameters) {
    var this_ = this;
    switch (parameters.search.shipping) {
        case this_.UID:
            this_.itemsOnPage = [];
            for (var j = 0; j < arr.length; j++) {
                if (arr[j].info.uid == parameters.search.keyword) {
                    this_.currentPage = 1; //bad
                    this_.itemsOnPage = [].concat(arr[j]);
                }
            }
            this_.serchItemsToShow.notify();
            break;
        case  this_.TITLE:
            //work with cash
            if (this_.searchParamCash.keyword == parameters.search.keyword && this_.searchParamCash.shipping == parameters.search.shipping && this_.searchDataCash.length) {
                this_.prepareStoredData(this_.searchDataCash, parameters);
            } else {
                this_.itemsOnPage = [];
                this_.searchDataCash = [];
                this_.searchParamCash = parameters.search;
                this_.currentPage = 1;
                parameters.pageNumber = 1;
                for (var n = 0; n < arr.length; n++) {
                    var itemTitle = arr[n].title;
                    var searchText = parameters.search.keyword;
                    var check = new RegExp(searchText, "gi");
                    if (itemTitle.match(check)) {
                        this_.searchDataCash.push(arr[n]);
                    }
                }
                this_.prepareStoredData(this_.searchDataCash, parameters);
            }
            break;
        case  this_.DESCRIPTION:
            if (this_.searchParamCash.keyword == parameters.search.keyword && this_.searchParamCash.shipping == parameters.search.shipping && this_.searchDataCash.length) {
                this_.prepareStoredData(this_.searchDataCash, parameters);
            } else {
                this_.itemsOnPage = [];
                this_.searchDataCash = [];
                this_.searchParamCash = parameters.search;
                this_.currentPage = 1;
                parameters.pageNumber = 1;
                for (var n = 0; n < arr.length; n++) {
                    var itemDescription = arr[n].description;
                    var searchText = parameters.search.keyword;
                    var check = new RegExp(searchText, "gi");
                    if (itemDescription.match(check)) {
                        this_.searchDataCash.push(arr[n]);
                    }
                }
                this_.prepareStoredData(this_.searchDataCash, parameters);
            }
            break;
    }
};

Model.prototype.prepareStoredData = function (arr, parameters) {
    var this_ = this;
    var startItem = ((parameters.pageNumber - 1) * parameters.itemsCountOnPage) + 1;
    var endItemm = startItem + parameters.itemsCountOnPage - 1;
    if (parameters.order && parameters.filter) {
        switch (parameters.filter) {
            case 'UID':
                if (parameters.order == this_.ASC) {
                    arr.sort(function (a, b) {
                        return a.info.uid - b.info.uid
                    });
                } else {
                    arr.sort(function (a, b) {
                        return b.info.uid - a.info.uid
                    });
                }
                break;
            case 'Title':
                if (parameters.order == this_.ASC) {
                    arr.sort(function (a, b) {
                        var A = a.title.toLowerCase();
                        var B = b.title.toLowerCase();
                        if (A < B) {
                            return -1;
                        } else if (A > B) {
                            return  1;
                        } else {
                            return 0;
                        }
                    });
                } else {
                    arr.sort(function (a, b) {
                        var A = a.title.toLowerCase();
                        var B = b.title.toLowerCase();
                        if (A > B) {
                            return -1;
                        } else if (A < B) {
                            return  1;
                        } else {
                            return 0;
                        }
                    });
                }
                break;
            case 'Description':
                if (parameters.order == this_.ASC) {
                    arr.sort(function (a, b) {
                        var A = a.description.toLowerCase();
                        var B = b.description.toLowerCase();
                        if (A < B) {
                            return -1;
                        } else if (A > B) {
                            return  1;
                        } else {
                            return 0;
                        }
                    });
                } else {
                    arr.sort(function (a, b) {
                        var A = a.description.toLowerCase();
                        var B = b.description.toLowerCase();
                        if (A > B) {
                            return -1;
                        } else if (A < B) {
                            return  1;
                        } else {
                            return 0;
                        }
                    });
                }
                break;
            case 'Seller':
                if (parameters.order == this_.ASC) {
                    arr.sort(function (a, b) {
                        var A = a.info.seller.toLowerCase();
                        var B = b.info.seller.toLowerCase();
                        if (A < B) {
                            return -1;
                        } else if (A > B) {
                            return  1;
                        } else {
                            return 0;
                        }
                    });
                } else {
                    arr.sort(function (a, b) {
                        var A = a.info.seller.toLowerCase();
                        var B = b.info.seller.toLowerCase();
                        if (A > B) {
                            return -1;
                        } else if (A < B) {
                            return  1;
                        } else {
                            return 0;
                        }
                    });
                }
                break;
            case 'Startprice':
                if (parameters.order == this_.ASC) {
                    arr.sort(function (a, b) {
                        return a.startPrice - b.startPrice
                    });
                } else {
                    arr.sort(function (a, b) {
                        return b.startPrice - a.startPrice
                    });
                }
                break;
            case 'BidInc':
                if (parameters.order == this_.ASC) {
                    arr.sort(function (a, b) {
                        return a.bidInc - b.bidInc
                    });
                } else {
                    arr.sort(function (a, b) {
                        return b.bidInc - a.bidInc
                    });
                }
                break;
            case 'Bestoffer':
                if (parameters.order == this_.ASC) {
                    arr.sort(function (a, b) {
                        return a.info.bestOffer - b.info.bestOffer
                    });
                } else {
                    arr.sort(function (a, b) {
                        return b.info.bestOffer - a.info.bestOffer
                    });
                }
                break;
            case 'Bidder':
                if (parameters.order == this_.ASC) {
                    arr.sort(function (a, b) {
                        var A = a.info.seller.toLowerCase();
                        var B = b.info.seller.toLowerCase();
                        if (A < B) {
                            return -1;
                        } else if (A > B) {
                            return  1;
                        } else {
                            return 0;
                        }
                    });
                } else {
                    arr.sort(function (a, b) {
                        var A = a.info.seller.toLowerCase();
                        var B = b.info.seller.toLowerCase();
                        if (A > B) {
                            return -1;
                        } else if (A < B) {
                            return  1;
                        } else {
                            return 0;
                        }
                    });
                }
                break;
            case 'Stopdate':
                if (parameters.order == this_.ASC) {
                    arr.sort(function (c, d) {
                        if (this_.isStringValidDate(c.info.stopDate) && this_.isStringValidDate(d.info.stopDate)) {
                            var a = new Date(c.info.stopDate);
                            var b = new Date(d.info.stopDate);
                            return (a > b) ? 1 : (a < b) ? -1 : 0;
                        } else {
                            var aIsDate = this_.isStringValidDate(c.info.stopDate);
                            var bIsDate = this_.isStringValidDate(d.info.stopDate);
                            return (!aIsDate && !bIsDate ) ? 0 : (aIsDate && !bIsDate) ? 1 : -1;
                        }
                    });
                } else {
                    arr.sort(function (c, d) {
                        if (this_.isStringValidDate(c.info.stopDate) && this_.isStringValidDate(d.info.stopDate)) {
                            var a = new Date(c.info.stopDate);
                            var b = new Date(d.info.stopDate);
                            return (a > b) ? -1 : (a < b) ? 1 : 0;
                        }
                        else {
                            var aIsDate = this_.isStringValidDate(c.info.stopDate);
                            var bIsDate = this_.isStringValidDate(d.info.stopDate);
                            return (!aIsDate && !bIsDate ) ? 0 : (aIsDate && !bIsDate) ? -1 : 1;
                        }
                    });
                }
                break;
        }
    }
    var data = [];
    var i = startItem;
    i--;//ArrayData
    if (arr[i]) {
        for (i; i < endItemm; i++) {
            if (arr[i]) {
                data.push(arr[i]);
            }
        }
        this_.currentPage = parameters.pageNumber;
        this_.itemsOnPage.length = 0; //clear
        this_.itemsOnPage = data.reverse(); // simple order ASC
    }
    this_.itemsToShow.notify();
};
Model.prototype.isStringValidDate = function (ds) {
    var d = new Date(ds);
    if (d && d.getFullYear() > 0)
        return true;
    else
        return false;
};
Model.prototype.generateID = function () {
//     return '_' + Math.random().toString(36).substr(2, 9);
    return this.items_.length + 1;
};
Model.prototype.buyItNowRequest = function (json) {
    var this_ = this;
    var data = JSON.parse(json);
    for (var i = 0; i < this_.items_.length; i++) {
        if (this_.items_[i].info.uid == data.uid) {
            this_.items_[i].info.bidders.push({bidder: this_.currentUser.name, bid: this_.items_[i].startPrice});
            this_.items_[i].info.bestOffer = this_.items_[i].startPrice;
            this.myItems_.push(this_.items_[i]);
            this_.itmesChanged.notify();
        }
    }
};

Model.prototype.editRequest = function (json) {
    var this_ = this;
    var data = JSON.parse(json);
    var editItem = {};
    for (var i = 0; i < this_.items_.length; i++) {
        if (this_.items_[i].info.uid == data.uid) {
            editItem = this_.items_[i];
        }
    }

    this.itemEdited.notify(editItem);
    this_.itmesChanged.notify();
    console.log(JSON.stringify(data));

};
Model.prototype.deleteRequest = function (json) {
    var this_ = this;
    var data = JSON.parse(json);
    for (var i = 0; i < this_.items_.length; i++) {
        if (this_.items_[i].info.uid == data.uid) {
            this.items_.splice(i, 1);
        }
    }
    this_.itmesChanged.notify();
    console.log(JSON.stringify(data));
};
Model.prototype.bidRequest = function (json) {
    var this_ = this;
    var data = JSON.parse(json);
    for (var i = 0; i < this_.items_.length; i++) {
        if (this_.items_[i].info.uid == data.uid) {
            var validValue;
            if (this_.items_[i].info.bestOffer) {
                validValue = Number(this_.items_[i].info.bestOffer) + Number(this_.items_[i].bidInc);
            } else {
                validValue = Number(this_.items_[i].startPrice) + Number(this_.items_[i].bidInc);
            }
            if (validValue <= Number(data.bid)) {
                this_.items_[i].info.bidders.push({bidder: this_.currentUser.name, bid: data.bid});
                this_.items_[i].info.bestOffer = data.bid;
                this.myItems_.push(this_.items_[i]);
                this_.itmesChanged.notify();
            } else {
                this_.wrongBid.notify(JSON.stringify(validValue));
            }
        }
    }
    console.log(JSON.stringify(data));
};

Model.prototype.initMyItems = function () {
    this.myItems_ = [];
    for (var j = 0; j < this.items_.length; j++) {
        var tmp;
        if (this.items_[j].info.seller == this.currentUser.name) { // lazy  need
            this.myItems_.push(this.items_[j]);
            tmp = this.items_[j];
        }
        for (var k = 0; k < this.items_[j].info.bidders.length; k++) {
            if (this.items_[j].info.bidders[k].bidder == this.currentUser.name) {
                if (tmp != this.items_[j]) {
                    this.myItems_.push(this.items_[j]);
                }
            }
        }
    }
};
//Model.prototype.search = function (json) {
//    var this_ = this;
//    var data = JSON.parse(json);
//
//
//    console.log(JSON.stringify(data));
//};