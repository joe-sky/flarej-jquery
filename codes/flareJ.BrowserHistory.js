/**********************************************************
*-----------------------------------*
* flareJ 
*-----------------------------------*
* base on jQuery
* Copyright 2015 Joe_Sky
* Licensed under the MIT license
*-----*-----*-----*-----*-----*-----*
* author:Joe_Sky
* mail:hitomi_doax@sina.com
* last update:2015-9-11
***********************************************************/

/*----------------------------------------------*
* flareJ.BrowserHistory
*-------*-------*-------*-------*-------*-------*
* 浏览器历史控件
*-------*-------*-------*-------*-------*-------*
* 
*----------------------------------------------*/
FJ.define("widget.BrowserHistory", function() {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                       浏览器历史控件
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.BrowserHistoryJ = this.BHJ = FJ.BrowserHistoryJ = FJ.BHJ = FJ.BJ.extend({
        //#region 构造方法
        init: function (settings) {
            //参数
            this._super($.extend(true, {
                fjType: "BHJ",
                initHash: "",
                checkOldDelay: 500   //检测旧hash值是否变化的轮询间隔时间
            }, settings));

            this.initFn();   //初始化

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            this._super();
            var thiz = this;
            fj.BHJ.ctx = this;
            this.supportHashChange = "onhashchange" in window || "onhashchange" in document;
            this.isInit = true;  //是否是初始化状态

            if (fj.isIElt8) {  //IE8以下IE使隐藏用iframe
                this.oIfr = $('<iframe id="historyFrame_' + this.objId + '" height="0" frameborder="0"></iframe>').prependTo(FJ.oBody);

                var hashI;
                if (location.hash != "") {  //设置hash初始值
                    hashI = location.hash.substr(1);
                }
                else {
                    hashI = this.p.initHash;
                }
                this.oIfr.attr("src", fj.resPath + 'html/historyIE.htm?sign=' + hashI + '&ts=' + new Date().getTime());
            }
            else if (this.supportHashChange) {  //支持hashchange事件的浏览器
                $(window).bind("hashchange", function() {
                    fj.BHJ.historyChange(location.hash.substr(1), true);
                });

                if (location.hash == "") {
                    location.hash = this.p.initHash;
                }
                else {
                    fj.BHJ.historyChange(location.hash.substr(1), true);
                }
            }
            else {  //其他浏览器用定时器检测hash值变化
                this.oldHash = "initHash";

                if (location.hash == "") {
                    location.hash = this.p.initHash;
                }

                setInterval(function () {
                    thiz.checkOldHash();
                }, this.p.checkOldDelay);
            }
        },
        //#endregion

        //#region 添加历史记录
        add: function (hash) {
            if (fj.isIElt8) {
                this.oIfr.attr("src", fj.resPath + "html/historyIE.htm?sign=" + hash + "&ts=" + new Date().getTime());
            }
            else if(this.supportHashChange) {
                location.hash = hash;
            }
            else {
                location.hash = hash;
                this.checkOldHash();
            }
        },
        //#endregion

        //#region 与旧hash值进行比较
        checkOldHash: function () {
            if (this.oldHash != location.hash) {  //hash值有变化则执行历史改变
                this.oldHash = location.hash;
                fj.BHJ.historyChange(this.oldHash.substr(1), true);
            }
        }
        //#endregion
    });

    //#region 静态方法
    fj.BHJ.init = function (p) {
        return new fj.BHJ(p);
    };

    //历史改变
    fj.BHJ.historyChange = function (hash, noSetHash) {
        //执行历史改变事件
        var oBhj = fj.BHJ.ctx;
        oBhj.fire("historyChange", { hash: hash, isInit: oBhj.isInit });
        oBhj.isInit = false;

        if(!noSetHash) {
            location.hash = hash;
        }
    };
    //#endregion

});