/**
 * Created by Oleg_Burshinov on 16.12.13.
 */
function View(model) {
    this.model_ = model;
    var me = this;
    this.ITEMS_ON_PAGE = 2;
    this.ASC = "ASC";
    this.DESC = "DESC";
    this.NO_ORDER = "";
    this.BIDDING_ROW_NUMBER = 9;

    this.userRegistrationComplete = new Event(this);
    this.registrationDataSubmit = new Event(this);
    this.loginDataSubmit = new Event(this);
    this.signinComplete = new Event(this);
    this.logoutComplete = new Event(this);
    this.sellButtonClick = new Event(this);
    this.addItem = new Event(this);
    this.addItemComplete = new Event(this);
    this.itemsDataRequest = new Event(this);
    this.buyButtonClick = new Event(this);
    this.bidButtonClick = new Event(this);
    this.editButtonClick = new Event(this);
    this.deleteButtonClick = new Event(this);
    this.showMyItemsButtonClick = new Event(this);
    this.searchButtonClick = new Event(this);

//    this.itemsDataRequestComplete = new Event(this);

    this.requestPage = {
        pageNumber: 1,
        itemsCountOnPage: this.ITEMS_ON_PAGE,
        order: this.NO_ORDER,
        filter: "",
        myitems: false,
        search: {
            keyword: "",
            shipping: ""
        }
    };

//    this.firstPage = {
//        pageNumber: 1,
//        itemsCountOnPage: this.ITEMS_ON_PAGE,
//        order: this.NO_ORDER,
//        filter: "",
//        myitems: false,
//        search: {
//            keyword : "",
//            shipping: ""
//        }
//    };

    this.itemsDataRequest.attach(function () {
        hasher.setHash(this_.getURLWithParams());
//        me.itemsDataRequest.notify(JSON.stringify(me.requestPage))
    });

    this.model_.itemEdited.attach(function (sender, json) {
        me.editedItem(json);
    });
    this.model_.wrongBid.attach(function (sender, json) {
        me.wrongBid(json);
    });

    this.model_.itemsToShow.attach(function () {
        me.clearTableData();
        me.clearErrors();
        me.viewShowItemsOnPage();

    });
    this.model_.userRegistred.attach(function () {
        me.userRegistrationComplete.notify();
    });
    this.model_.itemAdded.attach(function () {
        me.addItemComplete.notify();
        me.setPagging();
    });
    this.model_.itmesChanged.attach(function () {
        me.itemsDataRequest.notify(JSON.stringify(me.requestPage));
//        hasher.setHash(this_.getURLWithParams());
    });
    this.model_.serchItemsToShow.attach(function () {
        me.clearTableData();
        me.clearErrors();
        me.viewShowItemsOnPage();
    });

}

View.prototype.setRequestPage = function (data) {
    this.requestPage = data;
};

View.prototype.getFirstPage = function () {
    return {
        pageNumber: 1,
        itemsCountOnPage: this.ITEMS_ON_PAGE,
        order: this.NO_ORDER,
        filter: "",
        myitems: false,
        search: {
            keyword: "",
            shipping: ""
        }
    };
};

View.prototype.showEditItemPage = function (ietm) {
    var content = document.getElementById("omp-spa");
    if (ietm) {
        content.innerHTML = this.editItemTemplate(ietm);
    } else {
        var emptyItem = {
            title: "",
            description: "",
            startPrice: "",
            startDate: "",
            bidInc: "",
            buyItNow: "",
            timeLeft: "",
            info: {
                uid: "",
                seller: "",
                bestOffer: "",
                stopDate: "",
                bidders: []
            }
        };
        content.innerHTML = this.editItemTemplate(emptyItem);
    }

    this.execEditItemPageScript();
};
View.prototype.wrongBid = function (json) {
    this_ = this;
    var bid = JSON.parse(json);
    var errors = document.getElementById("err");
    var msg = "Bid: to low. Try: " + bid;
    errors.innerHTML = "<h4 class=\"erorrs\">" + msg + "</h4>";
    errors.style.display = "";
};
View.prototype.execEditItemPageScript = function () {
    this_ = this;
    this_.setLogutHeader(this_);
    var errors = document.getElementById("err");
    var editId = document.getElementById("itemUid");
    var uid = editId.value;


    var form = document.getElementById("editItemForm"), title = form.itemTitleInput, decription = form.descriptionInput, bidInc = form.bidIncInput, startPrice = form.startPriceInput, timeLeft = form.timeLeftInput, buyItNow = form.buyItNowCHK;
    buyItNowSetup();
    var resetButton = document.getElementById("resetButton");
    resetButton.onclick = function () {
        title.value = "";
        decription.value = "";
        bidInc.value = "";
        startPrice.value = "";
        timeLeft.value = "";
        buyItNow.checked = false;
        resetCheskBox();

    };
    var cancelButton = document.getElementById("cancelButton");
    cancelButton.onclick = function () {
        hasher.setHash("ShowItems");
    };
    var timeLeftValidate = /^[\d]{1,2}:[0-5][0-9]$/;
    timeLeft.onfocus = function () {
        errors.style.display = "none";
    };
    timeLeft.onkeyup = function (event) {
        event = event || window.event;
        if (!timeLeftValidate.test(timeLeft.value)) {
            errors.innerHTML = "<h4 class=\"erorrs\">Error: Wrong time range HH:MI</h4>";
            errors.style.display = "";
        } else {
            errors.style.display = "none";
            if (errors.firstChild) {
                errors.removeChild(errors.firstChild);
            }
        }
    };
    timeLeft.onblur = function () {
        if (!timeLeftValidate.test(timeLeft.value)) {
            errors.innerHTML = "<h4 class=\"erorrs\">Error: Wrong time range HH:MI</h4>";
            errors.style.display = "";
        } else {
            errors.style.display = "none";
            if (errors.firstChild) {
                errors.removeChild(errors.firstChild);
            }
        }
    };
    var bidIncValidate = /^\s*\d+\s*$/;
    bidInc.onfocus = function () {
        errors.style.display = "none";
    };
    bidInc.onkeyup = function (event) {
        event = event || window.event;
        if (!bidIncValidate.test(bidInc.value)) {
            errors.innerHTML = "<h4 class=\"erorrs\">Error: Wrong bid step</h4>";
            errors.style.display = "";
        } else if (bidInc.value <= 0) {
            errors.innerHTML = "<h4 class=\"erorrs\">Error: Bid step less or equal 0</h4>";
            errors.style.display = "";
        } else {
            errors.style.display = "none";
            if (errors.firstChild) {
                errors.removeChild(errors.firstChild);
            }
        }
    };
    bidInc.onblur = function () {
        if (!bidIncValidate.test(bidInc.value)) {
            errors.innerHTML = "<h4 class=\"erorrs\">Error: Wrong bid step</h4>";
            errors.style.display = "";
        } else if (bidInc.value <= 0) {
            errors.innerHTML = "<h4 class=\"erorrs\">Error: Bid step less or equal 0</h4>";
            errors.style.display = "";
        } else {
            errors.style.display = "none";
            if (errors.firstChild) {
                errors.removeChild(errors.firstChild);
            }
        }
    };
    var statrtPriceValidate = /^\d+(\.\d{1,2})?$/;
    startPrice.onfocus = function () {
        errors.style.display = "none";
    };

    startPrice.onkeyup = function (event) {
        event = event || window.event;
        if (!statrtPriceValidate.test(startPrice.value)) {
            errors.innerHTML = "<h4 class=\"erorrs\">Error: Wrong price</h4>";
            errors.style.display = "";
        } else if (startPrice.value <= 0) {
            errors.innerHTML = "<h4 class=\"erorrs\">Error: Price less or equal 0</h4>";
            errors.style.display = "";
        } else {
            errors.style.display = "none";
            if (errors.firstChild) {
                errors.removeChild(errors.firstChild);
            }
        }
    };
    startPrice.onblur = function () {
        if (!statrtPriceValidate.test(startPrice.value)) {
            errors.innerHTML = "<h4 class=\"erorrs\">Error: Wrong price</h4>";
            errors.style.display = "";
        } else if (startPrice.value <= 0) {
            errors.innerHTML = "<h4 class=\"erorrs\">Error: Price less or equal 0</h4>";
            errors.style.display = "";
        } else {
            errors.style.display = "none";
            if (errors.firstChild) {
                errors.removeChild(errors.firstChild);
            }
        }
    };

    eventUtility.addEvent(buyItNow, "click", function (evt) {
        buyItNowSetup();
    });

    function buyItNowSetup() {
        var labelBidInc = document.getElementById("labelBidInc");
        var label = document.getElementById("labelTimeLeft");
        var text = document.createTextNode("Time left:");
        if (buyItNow.checked) {
            bidInc.style.display = "none";
            bidInc.value = "";
            labelBidInc.style.display = "none";
            label.removeChild(label.firstChild);
            label.appendChild(text);

        } else {
            resetCheskBox();
        }
    }

    function resetCheskBox() {
        var form = document.getElementById("editItemForm"), bidInc = form.bidIncInput;
        var labelBidInc = document.getElementById("labelBidInc");
        var label = document.getElementById("labelTimeLeft");
        var text = document.createTextNode("Time left:");
        bidInc.value = "";
        bidInc.style.display = "";
        labelBidInc.style.display = "";
        text = document.createTextNode("Time left*:");
        if (label.firstChild) {
            label.removeChild(label.firstChild);
        }
        label.appendChild(text);
        errors.style.display = "none";
        if (errors.firstChild) {
            errors.removeChild(errors.firstChild);
        }
    }

    var publishButton = document.getElementById("publishBtn");
    publishButton.onclick = function () {
        var form = document.getElementById("editItemForm");
        var title = form.itemTitleInput, description = form.descriptionInput, statrtPrice = form.startPriceInput, bidInc = form.bidIncInput, buyItNow = form.buyItNowCHK, timeLeft = form.timeLeftInput;
        if (errors.firstChild || title.value == "" || statrtPrice.value == "") { //white space valid...
            errors.innerHTML = "<h4 class=\"erorrs\">Error: All fields with * are required</h4>";
            errors.style.display = "";
            return false;
        }
        if (!buyItNow.checked) {
            if (bidInc.value == "" || timeLeft.value == "") {
                errors.innerHTML = "<h4 class=\"erorrs\">Error: All fields with * are required</h4>";
                errors.style.display = "";
                return false;
            }
        }
        if (description.value.length >= 80) {
            errors.innerHTML = "<h4 class=\"erorrs\">Error: Description too long.</h4>";
            errors.style.display = "";
            return false;
        }
        var itemData = {
            uid: uid,
            title: title.value,
            description: description.value,
            startPrice: statrtPrice.value,
            bidInc: bidInc.value,
            buyItNow: buyItNow.value,
            timeLeft: timeLeft.value
        };
        this_.addItem.notify(JSON.stringify(itemData));

        return true;
    };
};

View.prototype.showItemsPage = function (isHasGetParams) {
    var content = document.getElementById("omp-spa");
    content.innerHTML = this.showItemsPageTemplate({});
    this.execShowItemsPageScript(isHasGetParams);
};

View.prototype.remveAllArrowsFromItemsTable = function (full) {
    var itemsTable = document.getElementById("itemTable");
    var itemsThead = itemsTable.getElementsByTagName("thead");
    for (var i = 0; i < this_.BIDDING_ROW_NUMBER; i++) {
        var element = itemsThead[0].getElementsByTagName("td")[i];
        while (element.firstChild != element.lastChild) {
            element.removeChild(element.lastChild);
        }
        if (!full) {
            var arrowsImg = document.createElement("img");
            arrowsImg.src = "../images/arrows.PNG";
            element.appendChild(arrowsImg);
        }
    }
};

View.prototype.searchInit = function () {
    var this_ = this;
    var searchButton = document.getElementById("searchButton");
    searchButton.onclick = function () {
        var searchKeywordInput = document.getElementById("keywordInput");
        var shipping = document.getElementById("shipping");
        var data = {
            keyword: searchKeywordInput.value,
            shipping: shipping.value
        };
        if (data.keyword && data.shipping) {
            this_.requestPage.search = data;
//            hasher.setHash(this_.getURLWithParams());
            this_.itemsDataRequest.notify(JSON.stringify(this_.requestPage));
//            this_.searchButtonClick.notify(JSON.stringify(data));
        }
    }
};

View.prototype.execShowItemsPageScript = function (isHasGetParams) {
    this_ = this;

//    this_.requestPage.myitems = false;
//    this_.requestPage.pageNumber = 1;
    this_.requestPage = this_.getFirstPage();
    this_.setLogutHeader(this_);
    // async request !!!!!!! params
    if (!isHasGetParams) {
//
        hasher.setHash(this_.getURLWithParams())
//        this_.itemsDataRequest.notify(JSON.stringify(this.requestPage));
    } //else?

    this_.searchInit();


    var sellButton = document.getElementById("sell");
    sellButton.onclick = function () {
        if (this_.model_.isAuthorized()) {
            this_.sellButtonClick.notify({});
        }
    };
    var showMyItemsButton = document.getElementById("myItems");
    showMyItemsButton.onclick = function () {
        if (this_.model_.isAuthorized()) {
            this_.showMyItemsButtonClick.notify({});
        }
    };


    var itemsTable = document.getElementById("itemTable");
    var itemsThead = itemsTable.getElementsByTagName("thead");
    var rows = itemsTable.getElementsByTagName("thead")[0]
        .getElementsByTagName("td").length;
    for (var i = 0; i < this_.BIDDING_ROW_NUMBER; i++) {
        var elemnt = itemsThead[0].getElementsByTagName("td")[i];
        elemnt.onclick = makeHeaderOnClickHandler(elemnt);
    }
    function makeHeaderOnClickHandler(element) {
        function generate() {
            var arrowsImg = document.createElement("img");
            if (this_.requestPage.order == this_.ASC) {
                this_.requestPage.order = this_.DESC;
                this_.requestPage.filter = element.textContent.replace(/ /g, "");
                this_.remveAllArrowsFromItemsTable();
                element.removeChild(element.lastChild);
                arrowsImg.src = "../images/1.gif";
                element.appendChild(arrowsImg);

                this_.clearTableData();
                hasher.setHash(this_.getURLWithParams());
//                this_.itemsDataRequest.notify(JSON.stringify(this_.requestPage));
            } else {
                this_.requestPage.order = this_.ASC;
                this_.requestPage.filter = element.textContent.replace(/ /g, "");
                this_.remveAllArrowsFromItemsTable();
                element.removeChild(element.lastChild);
                arrowsImg.src = "../images/0.gif";
                element.appendChild(arrowsImg);
                this_.clearTableData();
                hasher.setHash(this_.getURLWithParams());
//                this_.itemsDataRequest.notify(JSON.stringify(this_.requestPage));
            }
        }

        return generate;
    }

};
View.prototype.setPagging = function () {
    this_ = this;
    var pageNumberLabel = document.getElementById("pageNumber");
    var itemsTableData = document.getElementById("showItemsTableBody");
    var leftArrow = document.getElementById("leftArrow");
    var rightArrow = document.getElementById("rightArrow");
    leftArrow.style.display = "none";
    rightArrow.style.display = "none";
    var page = this.model_.getCurrentPage();
    pageNumberLabel.innerHTML = page;
    if (page > 0) {
        rightArrow.style.display = "";
    }
    if (page > 1) {
        leftArrow.style.display = "";
    }

    rightArrow.onclick = function () {
        var nextPage = page + 1;
        this_.requestPage.pageNumber = nextPage;
        this_.itemsDataRequest.notify(JSON.stringify(this_.requestPage));
        this_.clearTableData();
//        hasher.setHash(this_.getURLWithParams());
    };
    leftArrow.onclick = function () {
        var previousPage = page - 1;
        this_.requestPage.pageNumber = previousPage;
        this_.clearTableData();
//        hasher.setHash(this_.getURLWithParams());
        this_.itemsDataRequest.notify(JSON.stringify(this_.requestPage));
    };

};

View.prototype.clearErrors = function () {
    var errors = document.getElementById("err");
    errors.style.display = "none";
    if (errors.firstChild) {
        errors.removeChild(errors.firstChild);
    }
};

View.prototype.clearTableData = function () {
    var itemsTableData = document.getElementById("showItemsTableBody");
    if (itemsTableData) {
        while (itemsTableData.rows[0]) {
            itemsTableData.deleteRow(0);
        }
    }
};
View.prototype.viewShowItemsOnPage = function () {
    var this_ = this;

    function editItem(id) {
        function editById() {
            this_.editButtonClick.notify(JSON.stringify({uid: id}));
        }

        return editById;
    }

    function deleteItem(id) {
        function deleteById() {
            this_.deleteButtonClick.notify(JSON.stringify({uid: id}));
        }

        return deleteById;
    }

    function bidding(id) {
        function bid() {
            var field = document.getElementById("bid" + id);
            this_.bidButtonClick.notify(JSON.stringify({uid: id, bid: field.value}));
        }

        return bid;
    }

    function getItemInfo(columnN, item) {
        switch (columnN) {
            case 0:
                return item.info.uid;
            case 1:
                return item.title;
            case 2:
                return item.description;
            case 3:
                return item.info.seller;
            case 4:
                return item.startPrice;
            case 5:
                return item.bidInc;
            case 6:
                return item.info.bestOffer;
            case 7:
                if (item.info.bidders[item.info.bidders.length - 1]) {
                    return item.info.bidders[item.info.bidders.length - 1].bidder;
                } else {
                    return "";
                }

            case 8:
                if (item.info.stopDate) {
                    var stopDate = new Date(item.info.stopDate);
                    var stopDateText = stopDate.toLocaleDateString() + " " + stopDate.toLocaleTimeString();
                    return stopDateText;
                } else {
                    return "";
                }

        }
    }

    var mainDiv = document.getElementById("showItems");
    if (mainDiv) {
        var allItems = this.model_.getItems();
        var itemsTable = document.getElementById("itemTable");
        var errors = document.getElementById("err");
        this.setPagging();
        // arrow next page hide
        var rightArrow = document.getElementById("rightArrow");
        if (allItems.length < this_.ITEMS_ON_PAGE) {
            rightArrow.style.display = "none";
        }
//        var allItmBtn = document.getElementById("allItems");
//        allItmBtn.disabled = "disabled";

        var showItmesButton = document.getElementById("allItems");
        showItmesButton.onclick = function () {
            this_.requestPage = this_.getFirstPage();
            var searchKeywordInput = document.getElementById("keywordInput");
            searchKeywordInput.value = "";
            hasher.setHash('ShowItems');
            this_.itemsDataRequest.notify(JSON.stringify(this_.requestPage));
//            hasher.setHash(this_.getURLWithParams());
        };
        var rows = itemsTable.getElementsByTagName("thead")[0]
            .getElementsByTagName("td").length;


        for (var j = 0; j < allItems.length; j++) {
            var row = itemsTable.getElementsByTagName("tbody")[0].insertRow(0);
            var notForSale = false;
            var stop = new Date(allItems[j].info.stopDate);
            if (stop.getTime() <= new Date().getTime()) {
                notForSale = true;
            }
            var biddingData = null;
            for (var i = 0; i < rows - 1; i++) {
                var cell = row.insertCell(i);
                var textData = getItemInfo(i, allItems[j]);
                biddingData = document.createTextNode(textData);
                cell.appendChild(biddingData);
            }
            var biddingCell = null;
            if (this_.model_.isAuthorized()) {
                var user = JSON.parse(this_.model_.getCurrentUser());
                biddingCell = row.insertCell(this_.BIDDING_ROW_NUMBER);
                if (this_.requestPage.myitems) {

                    var timeIsUp = notForSale;
                    if (timeIsUp && allItems[j].info.bidders.length) {
                        var div = document.createElement('div');
                        div.className = "action";
                        var span = document.createElement('span');
                        span.style.fontWeight = "bold";
                        span.style.color = "blue";
                        biddingData = document.createTextNode("sold");
                        span.appendChild(biddingData);
                        div.appendChild(span);
                        biddingCell.appendChild(div);
                    } else if (allItems[j].info.seller == user.login && !timeIsUp) {
                        var div = document.createElement('div');
                        div.className = "action";

                        var editSpan = document.createElement('span');
                        editSpan.style.fontWeight = "bold";
                        editSpan.style.color = "blue";
                        biddingData = document.createTextNode("edit");
                        editSpan.onclick = editItem(allItems[j].info.uid);
                        editSpan.appendChild(biddingData);
                        div.appendChild(editSpan);
                        var separator = document.createTextNode("|");
                        div.appendChild(separator);
                        var deleteSpan = document.createElement('span');
                        deleteSpan.style.fontWeight = "bold";
                        deleteSpan.style.color = "blue";
                        biddingData = document.createTextNode("delete");
                        deleteSpan.onclick = deleteItem(allItems[j].info.uid);
                        deleteSpan.appendChild(biddingData);
                        div.appendChild(deleteSpan);
                        biddingCell.appendChild(div);
                    } else if (timeIsUp) {
                        var div = document.createElement('div');
                        div.className = "action";
                        var span = document.createElement('span');
                        span.style.fontWeight = "bold";
                        span.style.color = "black";
                        biddingData = document.createTextNode("time is up");
                        span.appendChild(biddingData);
                        div.appendChild(span);
                        biddingCell.appendChild(div);
                    } else {
                        var div = document.createElement('div');
                        div.className = "action";
                        var span = document.createElement('span');
                        span.style.fontWeight = "bold";
                        span.style.color = "blue";
                        biddingData = document.createTextNode("bid");
                        span.appendChild(biddingData);
                        div.appendChild(span);
                        biddingCell.appendChild(div);
                    }
                } else if (notForSale) {
                    biddingData = document.createTextNode("Not for sale");
                    biddingCell.appendChild(biddingData);
                } else if (allItems[j].buyItNow && !notForSale) {

                    if (allItems[j].info.bidders.length == 0 && allItems[j].info.seller != user.login) {
                        var uid = allItems[j].info.uid;
                        biddingData = document.createElement("input");
                        biddingData.type = "button";
                        biddingData.className = "buttons";
                        biddingData.value = "Buy";
                        biddingData.onclick = function () {
                            this_.buyButtonClick.notify(JSON.stringify({uid: uid}));
                        };
//                buyForm.appendChild(biddingData);
                        biddingCell.appendChild(biddingData);
                    } else {
                        biddingData = document.createTextNode("Not for sale");
                        biddingCell.appendChild(biddingData);
                    }

                } else {
                    if (allItems[j].info.seller != user.login) {
//                    var bidForm = document.createElement("form");
//                    bidForm.method = "get";
//                    bidForm.className = "bidForm";
//                    bidForm.action = "ShowMyItems.html";
//                    bidForm.setAttribute("onsubmit", "return checkform(this)");
//                    biddingCell.appendChild(bidForm);
//
//                    biddingData = document.createElement("input");
//                    biddingData.type = "hidden";
//                    biddingData.name = "hidfield";
//                    biddingData.value = allItems[j].info.uid;
//                    bidForm.appendChild(biddingData);

                        var div = document.createElement("div");
                        div.className = "outerBid";
                        biddingCell.appendChild(div);

                        var innerDiv = document.createElement("div");
                        innerDiv.className = "fieldBid";
                        div.appendChild(innerDiv);
                        biddingData = document.createElement("input");
                        biddingData.type = "text";
                        biddingData.name = "bid";
                        biddingData.id = "bid" + allItems[j].info.uid;
                        biddingData.className = "bidField";
                        innerDiv.appendChild(biddingData);
                        var scdInnerDiv = document.createElement("div");
                        scdInnerDiv.className = "fieldBid";
                        div.appendChild(scdInnerDiv);
                        biddingData = document.createElement("input");
                        biddingData.type = "button";
                        biddingData.className = "buttons";
                        biddingData.value = "Bid";

                        var id = allItems[j].info.uid;

                        biddingData.onclick = bidding(id);
                        scdInnerDiv.appendChild(biddingData);
                        var test = "bid" + allItems[j].info.uid;
                        var field = document.getElementById(test);
                        field.onfocus = function () {
                            errors.style.display = "none";
                        };
                    } else {
                        biddingData = document.createTextNode("Not for sale");
                        biddingCell.appendChild(biddingData);
                    }


                }
            } else {
                biddingCell = row.insertCell(this_.BIDDING_ROW_NUMBER);
                biddingData = document.createElement("a");
                biddingData.innerHTML = "registration";
                biddingData.onclick = function () {
                    hasher.setHash("Registration");
                };
                biddingCell.appendChild(biddingData);
            }
        }

    }
};

View.prototype.getURLWithParams = function () {
    var this_ = this;
    var url = [
        (this_.requestPage.myitems ? "ShowMyItems" : "ShowItems" ),
        '?',
        'page', '=', this_.requestPage.pageNumber, '&',
        'show', '=', this_.requestPage.itemsCountOnPage, '&',
        (this_.requestPage.order ? 'order=' + this_.requestPage.order + "&" : ''),
//        'order', '=',  this_.requestPage.order,'&',
        (this_.requestPage.filter ? 'filter=' + this_.requestPage.filter + "&" : ''),
//        'filter', '=', this_.requestPage.filter,'&',
        (this_.requestPage.myitems ? 'my=' + this_.requestPage.myitems + "&" : ''),
//        'my', '=', this_.requestPage.myitems,'&',
        (this_.requestPage.search.keyword ? 'keyword=' + this_.requestPage.search.keyword + "&" : ''),
//        'keyword', '=', this_.requestPage.search.keyword,'&',
        (this_.requestPage.search.shipping ? 'shipping=' + this_.requestPage.search.shipping : '')
//        'shipping', '=', this_.requestPage.search.shipping
        //(this_.requestPage.order ? 'order='+ this_.requestPage.order + ","   : '')
    ].join('');
    var lastSymbol = url.length - 1;
    if (url.lastIndexOf("&") == lastSymbol) {
        url = url.substr(0, lastSymbol);
    }
    return url;
};

View.prototype.showLoginPage = function () {
    var content = document.getElementById("omp-spa");
    content.innerHTML = this.loginPageTemplate({});
    this.execLoginPageScript();
};
View.prototype.execLoginPageScript = function () {
    this_ = this;
    var errors = document.getElementById("err");
    var signinButton = document.getElementById("signinButton");
    var loginValidate = /^[\w]{0,20}$/;

    var passwordValidate = /^[\w]{6,20}$/;
    var passwordField = document.getElementById("passwordInput");
    passwordField.onfocus = function () {
        errors.style.display = "none";
    };
    passwordField.onkeyup = function (event) {
        event = event || window.event;
        if (!passwordValidate.test(passwordField.value)) {
            errors.innerHTML = "<h4 class=\"erorrs\">Error: Password must be minimum 6 character without spaces.</h4>";
            errors.style.display = "";
        } else {
            errors.style.display = "none";
            if (errors.firstChild) {
                errors.removeChild(errors.firstChild);
            }
        }

    };

    var loginField = document.getElementById("loginInput");
    loginField.onfocus = function () {
        errors.style.display = "none";
    };
    loginField.onkeyup = function (event) {
        event = event || window.event;
        if (!loginValidate.test(loginField.value)) {
            errors.innerHTML = "<h4 class=\"erorrs\">Error: Login must be minimum 1 character without spaces.</h4>";
            errors.style.display = "";
        } else {
            errors.style.display = "none";
            if (errors.firstChild) {
                errors.removeChild(errors.firstChild);
            }
        }
    };

    loginField.onblur = function () {
        if (!loginValidate.test(loginField.value)) {
            errors.innerHTML = "<h4 class=\"erorrs\">Error: Login must be minimum 1 character without spaces.</h4>";
            errors.style.display = "";
        } else {
            errors.style.display = "none";
            if (errors.firstChild) {
                errors.removeChild(errors.firstChild);
            }
        }
    };
    signinButton.onclick = function () {
        var whitespaces = /[\s]+/;
        var form = document.getElementById("loginForm"), login = form.loginInput, pass = form.passwordInput;
        if (errors.firstChild || login.value == "" || pass.value == ""
            || whitespaces.test(login.value) || whitespaces.test(pass.value)) {
            errors.innerHTML = "<h4 class=\"erorrs\">Error: Field has incomplete data</h4>";
            errors.style.display = "";
            return false;
        } else {
            var signinData = {
                login: login.value,
                password: pass.value
            };
            this_.loginDataSubmit.notify(JSON.stringify(signinData));
            if (this_.model_.isAuthorized()) {
                this_.signinComplete.notify({});
            } else {
                errors.innerHTML = "<h4 class=\"erorrs\">Error: can't logon, check login,password</h4>";
                errors.style.display = "";
            }
            return false;
        }
    }

};
View.prototype.showMyItemsPage = function () {
    var content = document.getElementById("omp-spa");
    content.innerHTML = this.showItemsPageTemplate();
    this.execShowMyItemsPageScript();
};

View.prototype.execShowMyItemsPageScript = function () {
    var this_ = this;
    this_.setLogutHeader(this_);
    this_.requestPage.myitems = true;
    this_.requestPage.pageNumber = 1;
    this_.clearTableData();
    this_.searchInit();
    this_.itemsDataRequest.notify(JSON.stringify(this_.requestPage));
//    hasher.setHash(this_.getURLWithParams());
    var sellButton = document.getElementById("sell");
    sellButton.style.display = "none";
    var showMyItemsButton = document.getElementById("myItems");
    showMyItemsButton.style.display = "none";
    this_.remveAllArrowsFromItemsTable(true);
    var itemsTable = document.getElementById("itemTable");
    var itemsThead = itemsTable.getElementsByTagName("thead");
    var element = itemsThead[0].getElementsByTagName("td")[this_.BIDDING_ROW_NUMBER];
    element.innerHTML = "Action";

};

View.prototype.showRegistrationPage = function () {
    var content = document.getElementById("omp-spa");
    content.innerHTML = this.registrationPageTemplate({});
    this.execRegistrationPageScript();
};
View.prototype.execRegistrationPageScript = function () {
    this_ = this;
    var FULL_NAME = "Your name";
    var EMAIL = "E-mail";
    var PHONE = "(xxx) xxx-xx-xx";
    var ADRESS = "Your adress";
    var LOGIN = "Your login";
    var PASSWORD = "Your password";
    var CONFIRM_PASSWORD = "Confirm password";

// Error messages
    var ERROR_MESSAGE_FULL_NAME = "Error: Full name example: John Doe";
    var ERROR_MESSAGE_EMAIL = "Error: Bad e-mail";
    var ERROR_MESSAGE_PHONE = "Error: Phone format must be: (xxx) xxx-xx-xx";
    var ERROR_MESSAGE_ADRESS = "Error: Address wrong";
    var ERROR_MESSAGE_LOGIN = "Error: Login must be minimum 1 character without spaces.";
    var ERROR_MESSAGE_PASSWOED = "Error: Password must be minimum 6 character, include upper, lower case letters and digits.";
    var ERROR_MESSAGE_CONFIRM_PASSWOED = "Error: Password does not match the confirm password.";
    var ERROR_MESSAGE_REQUIED_FILDS = "Error: All fields with * are required or has incomplete data";

// error class
    var ERRORS_CLASS = "validateErorrs";

//style
    var HINT_COLOR = "#CCC";
    var TYPE_COLOR = "#000";
    var errors = document.getElementById("err");


    //get elemnents by id
    var fullName = document.getElementById("fullNameInput");
    var emailField = document.getElementById("email");
    var phoneField = document.getElementById("phone");
    var addressField = document.getElementById("billingAddressInput");
    var loginField = document.getElementById("loginInput");
    var passField = document.getElementById("passwordInput");
    var confirmPass = document.getElementById("confirmPasswordInput");
    var registrationButton = document.getElementById("regButton");

    // class names
    var FULL_NAME_ERROR_CLASS = "fullNameError";
    var EMAIL_ERROR_CLASS = "emalError";
    var PHONE_ERROR_CLASS = "phoneError";
    var ADDRESS_ERROR_CLASS = "adressError";
    var LOGIN_ERROR_CLASS = "loginError";
    var PASSWORD_ERROR_CLASS = "passwordError";
    var CONFIRM_PASSWORD_ERROR_CLASS = "confPassError";


    fullName.value = FULL_NAME;
    fullName.style.color = HINT_COLOR;
    emailField.value = EMAIL;
    emailField.style.color = HINT_COLOR;
    phoneField.value = PHONE;
    phoneField.style.color = HINT_COLOR;
    addressField.value = ADRESS;
    addressField.style.color = HINT_COLOR;
    loginField.value = LOGIN;
    loginField.style.color = HINT_COLOR;


    var fullNameValidate = /^([A-Z][A-Za-z.'\-]+) (?:([A-Z][A-Za-z.'\-]+) )?([A-Z][A-Za-z.'\-]+)$/;
    fullName.onclick = function () {
        fullName.style.color = TYPE_COLOR;
    };
    fullName.onfocus = function () {
        fullName.style.color = TYPE_COLOR;
        if (fullName.value == FULL_NAME
            ) {
            fullName.value = "";
        }
        if (document.getElementsByClassName(FULL_NAME_ERROR_CLASS)) {
            removeElementsByClass(FULL_NAME_ERROR_CLASS);
        }
        if (document.getElementsByClassName(ERRORS_CLASS)) {
            removeElementsByClass(ERRORS_CLASS);
        }

    };
    fullName.onblur = function () {
        var elem = getErrorNode(ERROR_MESSAGE_FULL_NAME, FULL_NAME_ERROR_CLASS);
        if (!fullName.value) {
            errors.appendChild(elem);
            fullName.value = FULL_NAME;
            fullName.style.color = HINT_COLOR;
        }
        if (!fullNameValidate.test(fullName.value)) {
            errors.appendChild(elem);
        } else {
            if (document.getElementsByClassName(FULL_NAME_ERROR_CLASS)) {
                removeElementsByClass(FULL_NAME_ERROR_CLASS);
            }
        }
    };

    var emailValidate = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    emailField.onclick = function () {
        emailField.style.color = TYPE_COLOR;
    };
    emailField.onfocus = function () {
        emailField.style.color = TYPE_COLOR;

        if (emailField.value == EMAIL
            ) {
            emailField.value = "";
        }
        if (document.getElementsByClassName(EMAIL_ERROR_CLASS)) {
            removeElementsByClass(EMAIL_ERROR_CLASS);
        }
        if (document.getElementsByClassName(ERRORS_CLASS)) {
            removeElementsByClass(ERRORS_CLASS);
        }
    };
    emailField.onblur = function () {
        var elem = getErrorNode(ERROR_MESSAGE_EMAIL, EMAIL_ERROR_CLASS);
        if (!emailField.value) {
            errors.appendChild(elem);
            emailField.value = EMAIL;
            emailField.style.color = HINT_COLOR;
        }
        if (!emailValidate.test(emailField.value)) {
            errors.appendChild(elem);
        } else {
            if (document.getElementsByClassName(EMAIL_ERROR_CLASS)) {
                removeElementsByClass(EMAIL_ERROR_CLASS);
            }
        }
    };

    var phoneValidate = /^\([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/;
    phoneField.onfocus = function () {
        phoneField.style.color = TYPE_COLOR;
        if (phoneField.value == PHONE
            ) {
            phoneField.value = "";
        }
        if (document.getElementsByClassName(PHONE_ERROR_CLASS)) {
            removeElementsByClass(PHONE_ERROR_CLASS);
        }
        if (document.getElementsByClassName(ERRORS_CLASS)) {
            removeElementsByClass(ERRORS_CLASS);
        }

    };
    phoneField.onblur = function () {
        var elem = getErrorNode(ERROR_MESSAGE_PHONE, PHONE_ERROR_CLASS);
        if (!phoneField.value) {
            errors.appendChild(elem);
            phoneField.value = PHONE;
            phoneField.style.color = HINT_COLOR;
        }
        if (!phoneValidate.test(phoneField.value)) {
            errors.appendChild(elem);
        } else {
            if (document.getElementsByClassName(PHONE_ERROR_CLASS)) {
                removeElementsByClass(PHONE_ERROR_CLASS);
            }
        }
    };

    var addressValidate = /^([\w\s\W]+[\w\W]?)\s([\d\-\\\/\w]*)?/;
    addressField.onclick = function () {
        addressField.style.color = TYPE_COLOR;
    };
    addressField.onfocus = function () {
        addressField.style.color = TYPE_COLOR;
        if (addressField.value == ADRESS) {
            addressField.value = "";
        }
        if (document.getElementsByClassName(ADDRESS_ERROR_CLASS)) {
            removeElementsByClass(ADDRESS_ERROR_CLASS);
        }
        if (document.getElementsByClassName(ERRORS_CLASS)) {
            removeElementsByClass(ERRORS_CLASS);
        }
    };
    addressField.onblur = function () {
        var elem = getErrorNode(ERROR_MESSAGE_ADRESS, ADDRESS_ERROR_CLASS);
        if (!addressField.value) {
            addressField.value = ADRESS;
            addressField.style.color = HINT_COLOR;
            errors.appendChild(elem);
        }
        if (!addressValidate.test(addressField.value)) {
            addressField.value = ADRESS;
            addressField.style.color = HINT_COLOR;
            errors.appendChild(elem);
        } else {
            if (document.getElementsByClassName(ADDRESS_ERROR_CLASS)) {
                removeElementsByClass(ADDRESS_ERROR_CLASS);
            }
        }
    };
    var loginValidate = /^[\w]{1,20}$/;
    loginField.onfocus = function () {
        loginField.style.color = TYPE_COLOR;
        if (loginField.value == LOGIN) {
            loginField.value = "";
        }
        if (document.getElementsByClassName(LOGIN_ERROR_CLASS)) {
            removeElementsByClass(LOGIN_ERROR_CLASS);
        }
        if (document.getElementsByClassName(ERRORS_CLASS)) {
            removeElementsByClass(ERRORS_CLASS);
        }
    };


    loginField.onblur = function () {
        var elem = getErrorNode(ERROR_MESSAGE_LOGIN, LOGIN_ERROR_CLASS);
        if (!loginField.value) {
            errors.appendChild(elem);
            loginField.value = LOGIN;
            loginField.style.color = HINT_COLOR;
        }
        if (!loginValidate.test(loginField.value)) {
            errors.appendChild(elem);
        } else {
            if (document.getElementsByClassName(LOGIN_ERROR_CLASS)) {
                removeElementsByClass(LOGIN_ERROR_CLASS);
            }
        }
    };

    var passVal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\S{6,15}$/;
    passField.onfocus = function () {
        if (document.getElementsByClassName(PASSWORD_ERROR_CLASS)) {
            removeElementsByClass(PASSWORD_ERROR_CLASS);
        }
        if (document.getElementsByClassName(ERRORS_CLASS)) {
            removeElementsByClass(ERRORS_CLASS);
        }
    };
    passField.onblur = function () {
        var elem = getErrorNode(ERROR_MESSAGE_PASSWOED, PASSWORD_ERROR_CLASS);
        if (!passVal.test(passField.value)) {
            errors.appendChild(elem);
        } else {
            if (document.getElementsByClassName(PASSWORD_ERROR_CLASS)) {
                removeElementsByClass(PASSWORD_ERROR_CLASS);
            }
        }
    };

    confirmPass.onfocus = function () {
        if (document.getElementsByClassName(CONFIRM_PASSWORD_ERROR_CLASS)) {
            removeElementsByClass(CONFIRM_PASSWORD_ERROR_CLASS);
        }
        if (document.getElementsByClassName(ERRORS_CLASS)) {
            removeElementsByClass(ERRORS_CLASS);
        }
    };
    confirmPass.onblur = function () {
        var elem = getErrorNode(ERROR_MESSAGE_CONFIRM_PASSWOED, CONFIRM_PASSWORD_ERROR_CLASS);
        if (passField.value !== confirmPass.value) {
            errors.appendChild(elem);
        } else {
            if (document.getElementsByClassName(CONFIRM_PASSWORD_ERROR_CLASS)) {
                removeElementsByClass(CONFIRM_PASSWORD_ERROR_CLASS);
            }
        }
    };
    var cancelButton = document.getElementById("cancelButton");
    cancelButton.onclick = function () {
        hasher.setHash("login");
    };
    var resetButton = document.getElementById("resetButton");
    resetButton.onclick = function () {
        errors.innerHTML = "";
    };
    registrationButton.onclick = function () {
        if (document.getElementsByClassName(ERRORS_CLASS)) {
            removeElementsByClass(ERRORS_CLASS);
        }
        var elem;
        var form = document.getElementById("regForm");
        if (errors.hasChildNodes()) {
            elem = getErrorNode(ERROR_MESSAGE_REQUIED_FILDS, ERRORS_CLASS);
            errors.appendChild(elem);
            return false;
        }
        var whitespaces = /^\s$/;
        var name = form.fullNameInput, email = form.email, phone = form.phone, address = form.billingAddressInput, login = form.loginInput, passowrd = form.passwordInput, confirmPass = form.confirmPasswordInput;
        if (name.value == FULL_NAME
            || name.value == ""
            || email.value == "" || email.value == EMAIL
            || address.value == "" || address.value == ADRESS
            || login.value == "" || passowrd.value == ""
            || confirmPass.value == "" || whitespaces.test(email.value)
            || whitespaces.test(address.value)
            || whitespaces.test(passowrd.value)
            || whitespaces.test(confirmPass.value)) {
            elem = getErrorNode(ERROR_MESSAGE_REQUIED_FILDS, ERRORS_CLASS);
            errors.appendChild(elem);
            return false;
        }
        var registrationDataJSON = {
            name: name.value,
            email: email.value,
            phone: phone.value,
            address: address.value,
            login: login.value,
            password: passowrd.value
        };
        this_.registrationDataSubmit.notify(JSON.stringify(registrationDataJSON));
    };
    function removeElementsByClass(className) {
        elements = document.getElementsByClassName(className);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    }

    function getErrorNode(message, errorClass) {
        var errorMsg = document.createTextNode(message);
        var element = document.createElement("h4");
        element.className = errorClass;
        element.appendChild(errorMsg);
        return element;
    }


};


View.prototype.show404Page = function (hash) {
    var content = document.getElementById("omp-spa");
    content.innerHTML = this.page404Template(hash);
    this.exec404PageScript();
};
View.prototype.exec404PageScript = function () {
    canvas = document.getElementById('c');
    ctx = canvas.getContext('2d');
    canvas.width = 560;
    canvas.height = 350;
    start();
};
View.prototype.setLogutHeader = function (ctx) {
    var userName = document.getElementById("userLogin");
    var userInfo = JSON.parse(this_.model_.getCurrentUser());
    var userNameLabel = document.createTextNode(userInfo.login);
    userName.appendChild(userNameLabel);
    var logoutLink = document.getElementById("logout");
    logoutLink.onclick = function () {
        ctx.logoutComplete.notify({});
    };
};

View.prototype.editedItem = function (item) {
//    hasher.setHash("EditItem");
    this.showEditItemPage(item);
};


View.prototype.itemTemplate = function (base) {
    return [
        '<li>',
        '<div class="todo', (base.done ? ' done' : ''), '">', base.text, '</div>',
        '</li>'
    ].join('');
};

View.prototype.editItemTemplate = function (item) {
    return [
        '<div class="editItem">',
        '<input type="hidden" name="itemUid" id="itemUid" value="', item.info.uid, '" />',
        '<div class="loginInfo">',
        '<label>',
        'You are logged in as:',
        '</label>', '<label id="userLogin">', '</label>', '<label>', '<a id="logout" >', 'logout', '</a>', '</label>',
        '</div>',
        '<h1>',
        'Online Marketplace',
        '</h1>',
        '<p>', '</p>',
        '<div>',

        '<form method="get" name="editItemForm" id="editItemForm">',

        '<div class="outer">',
        '<div class="field">',
        '<label for="itemTitleInput">',
        'Title of item*:',
        '</label>',
        '<input  name = "itemTitleInput" type = "text" id = "itemTitleInput" value="', item.title, '"/>',
        '</div>',
        '<div class="field">',
        '<label for="descriptionInput">', 'Description:', '</label>',
        '<textarea name="descriptionInput" id="descriptionInput" cols="20" rows = "3">', item.description, '</textarea>',
        '</div>',
        '<div class="field">',
        '<label for="startPriceInput">', 'Start price*:', '</label>',
        '<input name = "startPriceInput"  type = "text"  id = "startPriceInput" value="', item.startPrice, '"/>',
        '</div>',
        '<div class="field">', '<label for="bidIncInput" id="labelBidInc">',
        'Bid Increment*:', '</label>', '<input  name = "bidIncInput" type = "text"  id = "bidIncInput" value="', item.bidInc, '"/>',
        '</div>',
        '<div class="field">',
        '<label for="buyItNowCHK">', 'Buy it now', '</label>', '<input type="checkbox"   name = "buyItNowCHK"', (item.buyItNow ? ' checked="true"' : ''), ' > ', ' </input > ',
        '</div>',
        '<div class="field">',
        '<label for="timeLeftInput" id="labelTimeLeft">', 'Time left*:', '</label>', '<input   name = "timeLeftInput"  type = "text"  id = "timeLeftInput" value="', item.timeLeft, '"/>',
        '<div class="clear">', '</div>',
        '</div>',
        '</div>',
        '</form>',
        '</div>',
        '<div class="buttonLine">',
        '<input class="buttons" type="submit" id="publishBtn" value="Publish/Save" />',
        '<input class="buttons" type="reset" id="resetButton" value="Reset"/>',
        '<input class="buttons"  id="cancelButton" name="cancelButton" type="button" value="Cancel" />',
        '</div>',
        '<div id="err">', '</div>',
        '</div>'

    ].join('');
};

View.prototype.showItemsPageTemplate = function (base) {
    return [
        '<div id="showItems">',
        '<div class="loginInfo">',
        '<label>',
        'You are logged in as:',
        '</label>', '<label id="userLogin">', '</label>', '<label>', '<a id="logout" >', 'logout', '</a>', '</label>',
        '</div>',
        '<h1>', 'Online Marketplace', '</h1>',
        '<p>', '</p>',
        '<div class="itemsMain">',

        '<h3>', 'Search parameters', '</h3>',
        '<h3 id="tabh3">', 'Keyword:', '</h3>',
        '<div class="searchStuff">',
        '<input name="keywordInput" type="text" id="keywordInput" />', '<select name="shipping" id="shipping">',
        '<option value="1">', 'UID', '</option>',
        '<option value="2">', 'TITLE', '</option>',
        '<option value="3">', 'DESCRIPTION', '</option>',
        '</select>',
        '</div>',
        '<div class="btn">',
        '<button id="searchButton" class="linkLookBtn" type="button" value="search">','Search','</button>',
        '</div>',
        '<div class="clear">', '</div>',
        '<div class="outer">',
        '<div class="inner">',

        '<button  id="allItems" value="Show All Items">','Show All Items','</button>',
        '</div>',
        '<div class="inner">',
        '<button id="myItems" class="linkbtn" type="button" value="Show my items">','Show My Items','</button>',
        '</div>',
        '<div class="inner">',
        '<button id="sell" class="linkbtn" type="button" value="Sell">','Sell','</button>',
        '</div>',
        '</div>',
        '<div id="err">', '</div>',
        '<table class="sort" id="itemTable">',
        '<caption>', 'Items', '</caption>',
        '<thead>',
        '<tr>',
        '<td>', 'UID', '<img src="../images/arrows.PNG" />', '</td>',
        '<td>', 'Title', '<img src="../images/arrows.PNG" />', '</td>',
        '<td>', 'Description', '<img src="../images/arrows.PNG" />', '</td>',
        '<td>', 'Seller', '<img src="../images/arrows.PNG" />', '</td>',
        '<td>', 'Start price', '<img src="../images/arrows.PNG" />', '</td>',
        '<td>', 'BidInc', '<img src="../images/arrows.PNG" />', '</td>',
        '<td>', 'Best offer', '<img src="../images/arrows.PNG" />', '</td>',
        '<td>', 'Bidder', '<img src="../images/arrows.PNG" />', '</td>',
        '<td>', 'Stop date', '<img src="../images/arrows.PNG" />', '</td>',
        '<td>', 'Bidding', '</td>',
        '</tr>',
        '</thead>',
        '<tbody id="showItemsTableBody">',
        '</tbody>',
        '</table>',
        '</div>',
        '<ul class="nav">',
        '<li>', '<input type="image" id="leftArrow" src="../images/arrow-left.png"  value="back"/>', '</li>',
        '<li class="paggingLine" id="pageNumber" >', '</li>',
        '<li>', '<input type="image" id="rightArrow" src="../images/arrow-right.png"  value="forward"/>', '</li>',
        '</ul>',
        '<div id="err" class="erorrs">', '</div>',
        '</div>'
    ].join('');
};
View.prototype.registrationPageTemplate = function (base) {
    return [
        '<div id="content">',
        '<h1>',
        'Online Marketplace',
        '</h1>',
        '<h1>',
        'Registration',
        '</h1>',
        '<form method="get" name="regForm" id="regForm" action="#/ShowItems">',
        '<div class="main">',
        '<div class="field">',
        '<label for="fullNameInput">', 'Full name*:', '</label>',
        '<input	name="fullNameInput" type="text" id="fullNameInput" />',
        '</div>',
        '<div class="field">',
        '<label for="email">',
        'Email*:',
        '</label>',
        '<input name="email" type="text" id="email" />',
        '</div>',
        '<div class="field">',
        '<label for="phone">',
        'Contact phone:',
        '</label>', '<input name="phone" type="text" id="phone" />',
        '</div>',
        '<div class="field">',
        '<label for="billingAddressInput">',
        'Billing Address*:',
        '</label>', '<input	name="billingAddressInput" type="text" id="billingAddressInput" />',
        '</div>',
        '<div class="field">',
        '<label for="loginInput">',
        'Login*:',
        '</label>', '<input name="loginInput"	type="text" id="loginInput" />',
        '</div>',
        '<div class="field">',
        '<label for="passwordInput">',
        'Password*:',
        '</label>', '<input	name="passwordInput" type="password" id="passwordInput" />',
        '</div>',
        '<div class="field">',
        '<label class="info">',
        '6 characters minimum',
        '</label>',
        '</div>',
        '<div class="clear">', '</div>',
        '<div class="field">',
        '<label for="confirmPasswordInput">',
        'Confirm password*:',
        '</label>', '<input  name="confirmPasswordInput" type="password" id="confirmPasswordInput" />', '</div>',
        '<div class="">',
        '<input class="buttons" id="regButton" name="regButton" type="button" value="Registration" />',
        '<input class="buttons" name="resetButton" type="reset" id="resetButton" value="Reset" />',
        '<input class="buttons" id="cancelButton" name="cancelButton" type="button" value="Cancel" />',
        '</div>',
        '</div>',
        '</form>',
        '<div id="err" class="erorrs">', '</div>',
        '</div>'
    ].join('');
};
View.prototype.loginPageTemplate = function (base) {
    return [
        '<h1>',
        'Online Marketplace',
        '</h1>',
        '<p>', '</p>',
        '<h1>',
        'Login',
        '</h1>',
        '<form name="loginForm" id="loginForm" action="#/ShowItems">',
        '<div class="main">',
        '<div class="field">',
        '<label for="loginInput">',
        'Login:',
        '</label>',
        '<input name="loginInput" type="text" id="loginInput" class="loginInput" />',
        '</div>',
        '<div class="field">',
        '<label for="passwordInput">',
        'Password:',
        '</label>',
        '<input name="passwordInput" type="password" id="passwordInput" />',
        '</div>',
        '</div>',
        '<table>',
        '<div class="linkLooksButtons">',
        '<tr>',
        '<td>',
        '<button id="signinButton" class="linkLookBtn" type="button" value="sign in">','Sign in','</button>',
        '</td>',
        '</tr>',
        '<tr>',
        '<td>', '<a href="#/ShowItems">',
        '<button id="showItemsBtn" class="linkLookBtn" type="button" value="Enter as guest">','Enter as guest','</button>',
        '</a>', '</td>',
        '</tr>',
        '<tr>',
        '<td>',
        '<a href="#/Registration">',
        '<button id="registerBtn" class="linkLookBtn" type="button" value="Register">','Register','</button>',
        '</a>',
        '</td>',
        '</tr>',
        '</div>',
        '</table>',
        '</form>',
        '<div id="err">', '</div>'].join('');
};
View.prototype.page404Template = function (page) {
    return [
        '<div class="page404">',
        '<h1>',
        '404',
        '</h1>',
        '<h3>',
        'Page: "',
        page.toString(),
        '" not found.',
        '</h3>',
        '<canvas id="c">', '</canvas>',
        '</div>'
    ].join('');
};
