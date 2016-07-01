(function () {
    oImgTop();
    function oImgTop() {
        var oImgTop = document.getElementById("imgTop");
        var oImg = oImgTop.getElementsByTagName("img")[0];
        var oEm = oImgTop.getElementsByTagName("em")[0];
        oEm.onclick = function () {
            this.style.display = "none";
            animate(oImg, {"opacity": 0, "height": 0}, 200, 1)
        }
    }
})()


/************轮播图**************/

function AutoBanner(curEle, aJaxUrl, interval) {
    this.oBox = document.getElementById(curEle);
    this.oImgWrap = this.oBox.getElementsByTagName('div')[0];
    this.aDiv = this.oImgWrap.getElementsByTagName('div');
    this.aImg = this.oImgWrap.getElementsByTagName('img');
    this.oUl = this.oBox.getElementsByTagName('ul')[0];
    this.aLi = this.oUl.getElementsByTagName('li');
    this.oBtnLeft = this.oBox.getElementsByTagName('a')[0];
    this.oBtnRight = this.oBox.getElementsByTagName('a')[1];
    this.data = null;
    this.step = 0;
    this.autoTimer = null;
    this.interval = interval || 2000;
    this.ajaxUrl = aJaxUrl;

    return this.init();
}

AutoBanner.prototype = {
    constructor: AutoBanner,
    init: function () {
        var _this = this;
        this.getData();
        this.bind()
        this.lazyImg();
        clearInterval(_this.autoTimer);
        this.autoTimer = setInterval(function () {
            _this.autoMove();
        }, _this.interval);
        this.setBanner();
        this.stopStart();
        this.handleChange();
        this.leftRight();

        return this;
    },
    getData: function getData() {
        var _this = this;
        var xml = new XMLHttpRequest();
        xml.open('get', this.ajaxUrl + '?_=' + Math.random(), false);
        xml.onreadystatechange = function () {
            if (xml.readyState === 4 && /^2\d{2}$/.test(xml.status)) {
                _this.data = utils.jsonParse(xml.responseText);
            }
        };
        xml.send(null);
    },
    bind: function bind() {
        var str = '';
        var str2 = '';
        var n = 0
        for (var i = 0; i < this.data.length; i++) {
            //n=n++
            var curData = this.data[i];
            str += '<div><img src="" realImg="' + curData.imgSrc + '" alt=""/></div>';
            str2 += i == 0 ? '<li class="bg">1</li>' : '<li>' + (i + 1) + '</li>';
        }
        this.oImgWrap.innerHTML += str;
        this.oUl.innerHTML += str2;
    },
    lazyImg: function lazyImg() {
        var _this = this;
        for (var i = 0; i < _this.aImg.length; i++) {
            (function (index) {
                var curImg = _this.aImg[index];
                var oImg = new Image;
                oImg.src = curImg.getAttribute('realImg');
                oImg.onload = function () {
                    curImg.src = this.src;
                    oImg = null;
                    //默认先让第一张图片显示
                    utils.css(_this.aDiv[0], 'zIndex', 1);
                    animate(_this.aDiv[0], {opacity: 1}, 600)
                }
            })(i);
        }
    },
    autoMove: function autoMove() {
        if (this.step >= this.aDiv.length - 1) {
            this.step = -1;
        }
        this.step++;
        this.setBanner();
    },
    setBanner: function setBanner() {
        var _this = this;
        for (var i = 0; i < _this.aDiv.length; i++) {
            var curDiv = _this.aDiv[i];
            if (i === _this.step) {
                utils.css(curDiv, 'zIndex', 1);
                animate(curDiv, {'opacity': 1}, 600, function () {
                    var siblings = utils.siblings(this);
                    for (var i = 0; i < siblings.length; i++) {
                        utils.css(siblings[i], 'opacity', 0);
                    }
                });
                continue;
            }
            utils.css(curDiv, 'zIndex', 0)
        }
        _this.bannerTip();
    },
    bannerTip: function bannerTip() {
        for (var i = 0; i < this.aLi.length; i++) {
            var curLi = this.aLi[i];
            i === this.step ? utils.addClass(curLi, 'bg') : utils.removeClass(curLi, 'bg');
        }
    },
    stopStart: function stopStart() {
        var _this = this;
        _this.oBox.onmouseover = function () {
            clearInterval(_this.autoTimer);
            utils.css(_this.oBtnLeft, 'display', 'block');
            utils.css(_this.oBtnRight, 'display', 'block');
        };
        _this.oBox.onmouseout = function () {
            _this.autoTimer = setInterval(function () {
                _this.autoMove();
            }, _this.interval);
            utils.css(_this.oBtnLeft, 'display', 'none');
            utils.css(_this.oBtnRight, 'display', 'none');
        };
    },
    handleChange: function handleChange() {
        var _this = this;
        for (var i = 0; i < _this.aLi.length; i++) {
            var curLi = _this.aLi[i];
            curLi.index = i;
            curLi.onclick = function () {
                _this.step = this.index;
                _this.setBanner();
            }
        }
    },
    leftRight: function () {
        var _this = this;
        _this.oBtnRight.onclick = function () {
            _this.autoMove();
        };
        _this.oBtnLeft.onclick = function () {
            if (_this.step <= 0) {
                _this.step = _this.aDiv.length;
            }
            _this.step--;
            _this.setBanner();
        }
    }
};
var banner = new AutoBanner("banner", "json/banner.json", 3000);

function AutoBanner2(id, ajaxUrl, interval) {
    this.oBox = document.getElementById(id);
    this.oImgWrap = this.oBox.getElementsByTagName('div')[0];
    this.aUl = this.oImgWrap.getElementsByTagName('ul');
    this.aImg = this.oImgWrap.getElementsByTagName('img');
    this.btn = this.oBox.getElementsByTagName('span')[0];
    this.oBtnLeft = this.btn.getElementsByTagName('a')[0];
    this.oBtnRight = this.btn.getElementsByTagName('a')[1];
    this.step = 0;
    this.data = null;
    this.ajaxUrl = ajaxUrl;
    return this.init();
}
AutoBanner2.prototype = {
    constructor: AutoBanner,
    init: function () {
        var _this = this;
        this.getData();
        this.bind();
        this.oImgWrap.style.width = this.aUl.length * this.aUl[0].offsetWidth + 'px';
        this.setTimer = setTimeout(function () {
            _this.lazyImg();
        }, 500);

        this.leftRight();
    },
    getData: function getData() {
        var _this = this;
        var xml = new XMLHttpRequest();
        xml.open('get', this.ajaxUrl + '?_=' + Math.random(), false);
        xml.onreadystatechange = function () {
            if (xml.readyState === 4 && /^2\d{2}$/.test(xml.status)) {
                _this.data = utils.jsonParse(xml.responseText);
            }
        };
        xml.send(null);
    },
    bind: function bind() {
        var str = '';
        for (var i = 0; i < this.data.length; i++) {
            str += '<ul>\
 <li><a href="javascript:;"><img src="" realImg="' + this.data[i][0] + '" alt=""/></a></li>\
 <li><a href="javascript:;"><img src="" realImg="' + this.data[i][1] + '" alt=""/></a></li>\
 <li><a href="javascript:;"><img src="" realImg="' + this.data[i][2] + '" alt=""/></a></li>\
 <li><a href="javascript:;"><img src="" realImg="' + this.data[i][3] + '" alt=""/></a></li>\
 </ul>';
        }
        str += '<ul>\
 <li><a href="javascript:;"><img src="" realImg="' + this.data[0][0] + '" alt=""/></a></li>\
 <li><a href="javascript:;"><img src="" realImg="' + this.data[0][1] + '" alt=""/></a></li>\
 <li><a href="javascript:;"><img src="" realImg="' + this.data[0][2] + '" alt=""/></a></li>\
 <li><a href="javascript:;"><img src="" realImg="' + this.data[0][3] + '" alt=""/></a></li>\
 </ul>';
        this.oImgWrap.innerHTML = str;
    },
    lazyImg: function lazyImg() {
        var _this = this;
        for (var i = 0; i < _this.aImg.length; i++) {
            (function (index) {
                var curImg = _this.aImg[index];
                var oImg = new Image;
                oImg.src = curImg.getAttribute('realImg');
                oImg.onload = function () {
                    curImg.src = this.src;
                    oImg = null;
                }
            })(i);
        }
    },
    leftRight: function leftRight() {
        var _this = this;
        _this.oBtnRight.onclick = function () {
            if (_this.step >= _this.aUl.length - 1) {
                _this.step = 0;
                utils.css(_this.oImgWrap, 'left', 0);
            }
            _this.step++;
            animate(_this.oImgWrap, {'left': -_this.step * 1000}, 500);
        };
        _this.oBtnLeft.onclick = function () {
            if (_this.step <= 0) {
                _this.step = _this.aUl.length - 1;
                utils.css(_this.oImgWrap, 'left', -_this.step * 1000)
            }
            _this.step--;
            animate(_this.oImgWrap, {'left': -_this.step * 1000}, 500);
        };
    }
};
var imgBanner = new AutoBanner2("img-banner", "json/img-banner.json");


function AutoBanner3(id, ajaxUrl, interval) {
    this.oBox = document.getElementById(id);
    this.oImgWrap = this.oBox.getElementsByTagName('div')[0];
    this.aDiv = this.oImgWrap.getElementsByTagName('div');
    this.aImg = this.oImgWrap.getElementsByTagName('img');
    this.oUl = this.oBox.getElementsByTagName('ul')[0];
    this.aLi = this.oUl.getElementsByTagName('li');
    this.oBtnLeft = this.oBox.getElementsByTagName('a')[0];
    this.oBtnRight = this.oBox.getElementsByTagName('a')[1];
    this.autoTimer = null;
    this.step = 0;
    this.data = null;
    this.setTimer = null;
    this.ajaxUrl = ajaxUrl;
    this.interval = interval || 3000;
    return this.init();
}

AutoBanner3.prototype = {
    constructor: AutoBanner,
    init: function () {
        var _this = this;
        this.getData();
        this.bind();
        this.oImgWrap.style.width = this.aDiv.length * this.aDiv[0].offsetWidth + 'px';
        this.setTimer = setTimeout(function () {
            _this.lazyImg();
        }, 500);
        clearInterval(_this.autoTimer);
        this.autoTimer = setInterval(function () {
            _this.autoMove();
        }, _this.interval);
        this.bannerTip();
        this.stopStart();
        this.handleChange();
        this.leftRight();
    },
    getData: function getData() {
        var _this = this;
        var xml = new XMLHttpRequest();
        xml.open('get', this.ajaxUrl + '?_=' + Math.random(), false);
        xml.onreadystatechange = function () {
            if (xml.readyState === 4 && /^2\d{2}$/.test(xml.status)) {
                _this.data = utils.jsonParse(xml.responseText);
            }
        };
        xml.send(null);
    },
    bind: function bind() {
        var str = '';
        var str2 = '';
        for (var i = 0; i < this.data.length; i++) {
            str += '<div><a href="javascript:;"><img src="" realImg="' + this.data[i].imgSrc + '" alt=""/></a></div>';
            str2 += i === 0 ? '<li class="bg"></li>' : '<li></li>';
        }
        str += '<div><a href="javascript:;"><img src="" realImg="' + this.data[0].imgSrc + '" alt=""/></a></div>';
        this.oImgWrap.innerHTML = str;
        this.oUl.innerHTML = str2;
    },
    lazyImg: function lazyImg() {
        var _this = this;
        for (var i = 0; i < _this.aImg.length; i++) {
            (function (index) {
                var curImg = _this.aImg[index];
                var oImg = new Image;
                oImg.src = curImg.getAttribute('realImg');
                oImg.onload = function () {
                    curImg.src = this.src;
                    oImg = null;
                }
            })(i);
        }
    },
    autoMove: function autoMove() {
        if (this.step >= this.aDiv.length - 1) {
            this.step = 0;
            utils.css(this.oImgWrap, 'left', 0);
        }
        this.step++;
        animate(this.oImgWrap, {'left': -this.step * this.aDiv[0].offsetWidth}, 500);
        this.bannerTip();
    },
    bannerTip: function bannerTip() {
        var tempStep = this.step >= this.aLi.length ? 0 : this.step;
        for (var i = 0; i < this.aLi.length; i++) {
            var curLi = this.aLi[i];
            i === tempStep ? utils.addClass(curLi, 'bg') : utils.removeClass(curLi, 'bg');
        }
    },
    stopStart: function stopStart() {
        var _this = this;
        _this.oBox.onmouseover = function () {
            clearInterval(_this.autoTimer);
            utils.css(_this.oBtnLeft, 'display', 'block');
            utils.css(_this.oBtnRight, 'display', 'block');
        };
        _this.oBox.onmouseout = function () {
            _this.autoTimer = setInterval(function () {
                _this.autoMove();
            }, _this.interval);
            utils.css(_this.oBtnLeft, 'display', 'none');
            utils.css(_this.oBtnRight, 'display', 'none');
        };
    },
    handleChange: function handleChange() {
        var _this = this;
        for (var i = 0; i < _this.aLi.length; i++) {
            var curLi = _this.aLi[i];
            curLi.index = i;
            curLi.onclick = function () {
                _this.step = this.index;
                animate(_this.oImgWrap, {'left': -_this.step * _this.aDiv[0].offsetWidth}, 500, 1);
                _this.bannerTip();
            }
        }
    },
    leftRight: function leftRight() {
        var _this = this;
        _this.oBtnRight.onclick = function () {
            _this.autoMove();
            console.log(_this)
        };
        _this.oBtnLeft.onclick = function () {
            if (_this.step <= 0) {
                _this.step = _this.aDiv.length - 1;
                utils.css(_this.oImgWrap, 'left', -_this.step * _this.aDiv[0].offsetWidth)
            }
            _this.step--;
            animate(_this.oImgWrap, {'left': -_this.step * _this.aDiv[0].offsetWidth}, 500);
            _this.bannerTip();
        };
    }
};
var box1 = new AutoBanner3("box1", "json/floor.json", 5000);
var box = new AutoBanner3("box", "json/floor1.json", 5000);


//核心内容的选项卡
(function () {
    var oTab = utils.getByClass(body, "nav");
    for (var i = 0; i < oTab.length; i++) {
        tab(oTab[i]);
    }

    function tab(ele) {
        var oUl = utils.children(ele, "ul")[0];
        var oLis = utils.children(oUl, "li");
        for (var i = 0; i < oLis.length; i++) {
            oLis[i].onmouseover = function () {
                var index = utils.index(this);
                this.className = "tab-item select-tab";
                var siblings = utils.siblings(this);

                for (var i = 0; i < siblings.length; i++) {
                    siblings[i].className = "tab-item"
                }
                var oDivP = utils.next(ele);
                var oDivs = utils.getByClass(oDivP, "main");
                for (var j = 0; j < oDivs.length; j++) {
                    if (j == index) {
                        oDivs[j].className = "main main-selected";
                    } else {
                        oDivs[j].className = "main "
                    }
                }
            }
        }
    }
})();

/*********  穿 墙  ****************/
~(function () {
    function ThroughWall(curEle) {
        this.ele = curEle;
        this.oMark = this.ele.getElementsByTagName("div")[0];
        return this.init();
    }

    ThroughWall.prototype = {
        constructor: ThroughWall,
        init: function () {
            this.maskMove(this.ele);
        },

        maskMove: function maskMove(ele) {
            var that = this;
            ele.onmouseenter = function (ev) {
                ev = ev || window.event;
                var dir = that.hoverDir(ele, ev);
                switch (dir) {
                    case 0:
                        that.oMark.style.left = that.oMark.offsetWidth + 'px';
                        that.oMark.style.top = 0;
                        break;
                    case 1:
                        that.oMark.style.left = 0;
                        that.oMark.style.top = that.oMark.offsetWidth + 'px';
                        break;
                    case 2:
                        that.oMark.style.left = -that.oMark.offsetWidth + 'px';
                        that.oMark.style.top = 0;
                        break;
                    case 3:
                        that.oMark.style.left = 0;
                        that.oMark.style.top = -that.oMark.offsetWidth + 'px';
                        break;
                }
                animate(that.oMark, {top: 0, left: 0}, 300);
            };
            ele.onmouseleave = function (ev) {
                ev = ev || event;
                var dir = that.hoverDir(ele, ev);
                switch (dir) {
                    case 0:
                        animate(that.oMark, {left: that.oMark.offsetWidth, top: 0}, 300);
                        break;
                    case 1:
                        animate(that.oMark, {left: 0, top: that.oMark.offsetWidth}, 300);
                        break;
                    case 2:
                        animate(that.oMark, {left: -that.oMark.offsetWidth, top: 0}, 300);
                        break;
                    case 3:
                        animate(that.oMark, {left: 0, top: -that.oMark.offsetWidth}, 300);
                        break;
                }
            };
        },
        hoverDir: function hoverDir(ele, ev) {
            var eleL = utils.offset(ele).left, eleT = utils.offset(ele).top;
            var x = eleL + ele.offsetWidth - ev.pageX;
            var y = eleT + ele.offsetHeight - ev.pageY;
            var result = Math.atan2(y, x);
            if (result < 0.05) {
                return 1;
            } else if (result >= 0.05 && result < Math.atan2(ele.offsetHeight, ele.offsetWidth)) {
                return 2
            } else if (result >= Math.atan2(ele.offsetHeight, ele.offsetWidth) && result < 1.45) {
                return 3
            } else {
                return 0
            }
        }
    };
    var oUlTro = document.getElementById("I-thrUl");
    var oLi = oUlTro.getElementsByTagName("li");
    for (var i = 0; i < oLi.length; i++) {
        new ThroughWall(oLi[i])
    }
}());


/***********  下方滚动评论***********/
~function () {
    var oRoll = document.getElementById("roll-ul");
    var timer = null;
    var cur = utils.css(oRoll, "top");

    function rollMove() {
        if (oRoll.offsetTop == -240) {
            oRoll.style.top = -960 + "px";
        }
        cur = utils.css(oRoll, "top");
        animate(oRoll, {top: cur + 120}, 500);
    }

    timer = setInterval(rollMove, 4000);
    oRoll.onmouseover = function () {
        clearInterval(timer)
    };
    oRoll.onmouseout = function () {
        timer = setInterval(rollMove, 4000)
    };
}();

/**********  万恶的小东西    ************/
(function () {
    var oMc = document.getElementById("mc");
    var oUlTab = oMc.getElementsByTagName("ul")[0];
    var oHid = document.getElementById("mc-hidden");
    var oLi = utils.getByClass(oUlTab, "tabLi");
    var oUl = utils.children(oHid, "ul")[0];
    var oLis = utils.children(oUl, "li");
    var oDiv = utils.next(oUl);
    var oDivs = utils.children(oDiv);
    for (var i = 0, len = oLi.length; i < len; i++) {
        var cur = oLi[i];
        cur.index = i;
        cur.onclick = function () {
            var that = this;
            animate(oHid, {top: 70}, 200, function () {
                var timer = setTimeout(function () {
                    animate(oHid, {top: 0}, 100, function () {
                        animate(oUl, {height: 27}, 100);
                        tab2(that.index)
                    });
                }, 300);
            });
        }
    }
    var oClose = document.getElementById("close");
    oClose.onclick = function () {

        animate(oHid, {top: 70}, 100, function () {
            animate(oHid, {top: 210}, 200, function () {
                utils.css(oUl, "height", 0);
                for (var i = 0; i < oLis.length; i++) {
                    oLis[i].className = "";
                    oDivs[i].className = "firDiv";
                }
            })
        })
    };
    function tab2(index) {
        oLis[index].className = "bg";
        oDivs[index].className = "firDiv show";
        for (var i = 0; i < oLis.length; i++) {
            oLis[i].onmouseover = function () {
                var index = utils.index(this);
                console.log(index);
                this.className = "bg";
                var siblings = utils.siblings(this);
                for (var i = 0; i < siblings.length; i++) {
                    siblings[i].className = ""
                }
                for (var j = 0; j < oDivs.length; j++) {
                    if (j == index) {
                        oDivs[j].className = "firDiv show";
                    } else {
                        oDivs[j].className = "firDiv"
                    }
                }
            }
        }
    }

    var oFirDiv = utils.getByClass(oHid, "firDiv");
    for (var i = 0, len = oFirDiv.length; i < len; i++) {
        tab3(oFirDiv[i])
    }
    function tab3(ele) {
        var oUl = utils.children(ele, "ul")[0];
        var oLis = utils.children(oUl, "li");
        var oDiv = utils.next(oUl);
        var oDivs = utils.children(oDiv);
        for (var i = 0; i < oLis.length; i++) {
            oLis[i].onmouseover = function () {
                var index = utils.index(this);
                this.className = "bg";
                var siblings = utils.siblings(this);
                for (var i = 0; i < siblings.length; i++) {
                    siblings[i].className = ""
                }
                for (var j = 0; j < oDivs.length; j++) {
                    if (j == index) {
                        oDivs[j].className = "show";
                    } else {
                        oDivs[j].className = ""
                    }
                }
            }
        }
    }
})();


/********** 楼层切换  **********/
(function () {
    var floorAry = [
        {id: "firFloor", text: "服装", top: null},
        {id: "secFloor", text: "美妆", top: null},
        {id: "sale", text: "折扣", top: null}
    ];

    var floorIndex = document.getElementById("floorIndex"), oLis = null;
    ~function () {
        var str = "";
        for (var i = 0, len = floorAry.length; i < len; i++) {
            var curFloor = floorAry[i];
            var curFloorEle = document.getElementById(curFloor["id"]);
            curFloor["top"] = utils.offset(curFloorEle).top;

            str += "<li myText='" + curFloor["text"] + "' myTop='" + curFloor["top"] + "'>" + (i + 1) + "F</li>";
        }
        floorIndex.innerHTML = str;

        utils.css(floorIndex, "marginTop", -len * 31 / 2);

        oLis = utils.children(floorIndex);
    }();

    ~function () {
        for (var i = 0, len = oLis.length; i < len; i++) {
            var curLi = oLis[i];
            curLi.index = i;
            curLi.onmouseover = function () {
                utils.css(this, {
                    background: "red",
                    color: "#fff"
                });
                this.innerHTML = this.getAttribute("myText");
            };
            curLi.onmouseout = function () {
                if (this.getAttribute("isLoad") === "true") {
                    utils.css(this, {
                        background: "",
                        color: "red"
                    });
                    return;
                }
                utils.css(this, {
                    background: "",
                    color: "#000"
                });
                this.innerHTML = (this.index + 1) + "F";
            };
        }
    }();
    function showFloor() {
        var curTop = utils.win("scrollTop"), curHeight = utils.win("clientHeight");

        floorIndex.style.display = curTop + curHeight > oLis[0].getAttribute("myTop") ? "block" : "none";

        for (var i = 0, len = oLis.length; i < len; i++) {
            var curLi = oLis[i], curLiTop = curLi.getAttribute("myTop"), curLiText = curLi.getAttribute("myText"), curLiF = (i + 1) + "F";
            curLi.index = i;

            var aa = i === 0 ? curHeight : (curHeight / 2);
            if (curTop + aa > curLiTop) {
                utils.css(curLi, "color", "red");
                curLi.setAttribute("isLoad", true);
                curLi.innerHTML = curLiText;
                var curSiblings = utils.siblings(curLi);
                for (var k = 0; k < curSiblings.length; k++) {
                    utils.css(curSiblings[k], "color", "#000");
                    curSiblings[k].setAttribute("isLoad", false);
                    curSiblings[k].innerHTML = (curSiblings[k].index + 1) + "F";
                }
            }
        }
    }

    window.onscroll = showFloor;

    var timer = null;
    for (var i = 0; i < oLis.length; i++) {
        var curLi = oLis[i];
        curLi.onclick = function () {
            window.onscroll = null;
            var target = this.getAttribute("myTop");
            move(target);
        }
    }
    function move(target) {
        var begin = utils.win("scrollTop"), duration = 500;
        var step = Math.abs((target - begin) / duration * 10);
        _move();
        function _move() {
            window.clearTimeout(timer);
            var cur = utils.win("scrollTop");
            if (target > begin) {//->向下
                if (cur + step >= target) {
                    window.onscroll = showFloor;
                    utils.win("scrollTop", target);
                    return;
                }
                utils.win("scrollTop", cur + step);
            } else if (target < begin) {
                if (cur - step <= target) {
                    window.onscroll = showFloor;
                    utils.win("scrollTop", target);
                    return;
                }
                utils.win("scrollTop", cur - step);
            } else {
                window.onscroll = showFloor;
                return;
            }
            timer = window.setTimeout(_move, 10);
        }
    }
})();

~(function () {
    var oDropDown = document.getElementById("dropDown");
    var oContent = utils.getByClass(oDropDown, "content")[0];
    var oLi = oDropDown.getElementsByTagName("ul")[0].getElementsByTagName("li");
    for (var i = 0, len = oLi.length; i < len; i++) {
        var cur = oLi[i];
        cur.onclick = function () {
            this.className = "bg";
            var siblings = utils.siblings(this);
            for (var i = 0, len = siblings.length; i < len; i++) {
                siblings[i].className = "";
            }
            var oA = this.getElementsByTagName("a")[0];
            oContent.innerHTML = oA.innerHTML;
        }
    }
})();

/**************回到顶部******************/
~function () {
    var oBtn = document.getElementById('btn');
    window.addEventListener("scroll", computedDisplay, false);
    function computedDisplay() {
        if (utils.win('scrollTop') >= utils.win('clientHeight')) {
            utils.setCss(oBtn, 'display', 'block');
        } else {
            utils.setCss(oBtn, 'display', 'none');
        }
    }

    oBtn.onclick = function () {
        utils.setCss(oBtn, 'display', 'none');
        window.removeEventListener("scroll", computedDisplay, false);
        var target = utils.win('scrollTop');
        var duration = 500;
        var interval = 10;
        var step = (target / duration) * interval;
        var timer = setInterval(function () {
            var curT = utils.win('scrollTop');
            if (curT <= 0) {
                clearInterval(timer);
                window.addEventListener("scroll", computedDisplay, false);
                return;
            }
            curT -= step;
            utils.win('scrollTop', curT);
        }, interval)
    }
}()





