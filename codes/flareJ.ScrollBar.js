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
* last update:2015-6-12
***********************************************************/

/*----------------------------------------------*
* flareJ.ScrollBar
*-------*-------*-------*-------*-------*-------*
* 滚动条
*-------*-------*-------*-------*-------*-------*
* 
*----------------------------------------------*/
FJ.define("widget.ScrollBar", function() {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                           滚动条
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.ScrollBarJ = this.SBJ = FJ.ScrollBarJ = FJ.SBJ = FJ.CJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "SBJ",
                renderTo: elemObj,
                width: 450,                           //最大宽度
                height: 17,                           //最大高度
                widthC: 1000,                          //内容宽度
                direction: "h",                        /*------*方向*------*
                                                        * h:横向
                                                        * v:纵向
                                                        *-----*-----*-----*/
                borderWidth: 0,
                colorParams: {
                    borderOut: "#d0d8e8",
                    bgColor: "#fff"                    //背景色
                },
                evts: {
                    scroll: null                       //滚动条滚动
                }
            }, settings));

            this.initFn();

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            this._super();
            this.create();

            //移动端不显示自定义滚动条
            if (!fj.isMobile) {
                this.show();
            }
        },
        //#endregion

        //#region 构建
        create: function () {
            var thiz = this;
            this._super();

            //解决IE8下div高度小于35时滚动条不显示
            this.container = $("<div></div>").css({
                width: "100%",
                height: this.p.height + 18,
                position: "relative",
                top: -19,
                overflowX: "auto",
                overflowY: "hidden",
                clear: "both"
            });

            //内容层
            this.content = $('<div></div>').css({
                height: this.p.height,
                width: this.p.widthC
            });

            //外层
            this.divOut.attr("id", "SBJ_" + this.objId).css({
                width: this.p.width,
                height: this.p.height,
                clear: "both"
            }).append(this.container.append(this.content));

            //设置隐藏另一方向的滚动条,否则旧版IE下高度有问题
            switch (this.p.direction) {
                case "h":
                    this.divOut.css("overflow-y", "hidden");
                    break;
                case "v":
                    this.divOut.css("overflow-x", "hidden");
                    break;
            }

            //滚动事件
            this.container.bind("scroll", function () {
                thiz.fire("scroll", { s: this });
            });

            return this;
        },
        //#endregion

        //#region 获取滚动条横向值
        getScrollLeft: function () {
            return this.container.scrollLeft();
        },
        //#endregion

        //#region 设置滚动条横向值
        setScrollLeft: function (p) {
            return this.container.scrollLeft(p);
        },
        //#endregion

        //#region 设置宽度
        width: function (p1, p2) {
            this.divOut.width(p1);
            this.content.width(p2);
        },
        //#endregion

        //#region 设置横向位置
        left: function (p) {
            this.divOut.css("margin-left", p);
        },
        //#endregion

        //#region 横滚动条是否出现
        hasScrollH: function () {
            return this.content.width() > this.divOut.width();
        }
        //#endregion
    });

    //#region 绑定到jquery
    $.fn.extend({
        ScrollBarJ: function (settings) {
            if (this && this.length > 0) {
                return new FJ.ScrollBarJ(this, fj.SBJ_commonConfig ? $.extend(true, fj.clone(fj.SBJ_commonConfig), settings) : settings);
            }
        },
        SBJ: function (settings) {
            return $(this).ScrollBarJ(settings);
        }
    });
    //#endregion

});