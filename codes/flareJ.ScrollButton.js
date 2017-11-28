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
* last update:2015-7-19
***********************************************************/

/*----------------------------------------------*
* flareJ.ScrollButton
*-------*-------*-------*-------*-------*-------*
* 滚动按钮
*-------*-------*-------*-------*-------*-------*
* 
*----------------------------------------------*/
FJ.define("widget.ScrollButton", function() {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                         滚动按钮
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.ScrollButtonJ = this.SBNJ = FJ.ScrollButtonJ = FJ.SBNJ = FJ.CJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "SBNJ",
                renderTo: elemObj,
                targetElem: elemObj,                   //目标滚动元素
                width: "100%",                         //最大宽度
                height: "100%",                        //最大高度
                borderWidth: 0,
                top: null,
                layoutDelay: 1000,
                hasAnimate: fj.isMobile ? 0 : 1        //是否有动画
            }, settings));

            this.initFn();
            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            var thiz = this;

            this._super();
            this.create();

            //首次检测是否显示按钮
            this.checkShow();

            //页面重置尺寸时检测是否显示按钮
            $(window).on("resize", { thiz: this }, this.pageResize);
        },
        //#endregion

        //#region 构建
        create: function () {
            var thiz = this,
                targetElem = thiz.p.targetElem[0],
                hasAnimate = this.p.hasAnimate;

            //左边按钮
            this.scrollBtnL = $("<div class='sbnj sbnj-left" + (hasAnimate ? " fj-has-animate" : "") + "'></div>").append("<i class='icon-chevron-left'></i>");

            //右边按钮
            this.scrollBtnR = $("<div class='sbnj sbnj-right" + (hasAnimate ? " fj-has-animate" : "") + "'></div>").append("<i class='icon-chevron-right'></i>");
            
            if (!fj.isMobile) {  //pc上按住鼠标执行滚动
                //点击左侧按钮
                this.scrollBtnL.on("mousedown", function () {
                    thiz.stopTabLeft = false;

                    (function () {
                        targetElem.scrollLeft -= 10;
                        if (thiz.checkBtnShow("left")) {
                            targetElem.scrollLeft = 0;
                        }

                        if (!thiz.stopTabLeft) {
                            setTimeout(arguments.callee, 50);
                        }
                    })();
                }).bind("mouseup", function () {
                    thiz.stopTabLeft = true;

                    if (thiz.checkBtnShow("left")) {
                        thiz.scrollBtnL.hide();
                    }
                    thiz.scrollBtnR.show();
                });

                //点击右侧按钮
                this.scrollBtnR.on("mousedown", function () {
                    thiz.stopTabRight = false;

                    (function () {
                        targetElem.scrollLeft += 10;

                        if (!thiz.stopTabRight) {
                            setTimeout(arguments.callee, 50);
                        }
                    })();
                }).bind("mouseup", function () {
                    thiz.stopTabRight = true;

                    if (thiz.checkBtnShow("right")) {
                        thiz.scrollBtnR.hide();
                    }
                    thiz.scrollBtnL.show();
                });
            }
            else {  //移动浏览器进行滚动检测
                this.p.targetElem.on("scroll", function () {
                    fj.lazyDo(function () {
                        if (this.checkBtnShow("left")) {
                            this.scrollBtnL.hide();
                        }
                        else {
                            this.scrollBtnL.show();
                        }

                        if (this.checkBtnShow("right")) {
                            this.scrollBtnR.hide();
                        }
                        else {
                            this.scrollBtnR.show();
                        }
                    }, 50, "ld_sbnj_scroll", thiz);
                });
            }

            //合并两个按钮到同一集合
            this.divOut = this.scrollBtnL.add(this.scrollBtnR);

            //上方距离
            if (this.p.top) {
                this.divOut.css("top", this.p.top);
            }

            //渲染
            this.p.renderTo.append(this.scrollBtnL).append(this.scrollBtnR);

            return this;
        },
        //#endregion

        //#region 检测是否需显示按钮
        checkShow: function (noBtn) {
            var re = this.checkBtnShow();

            if (re && !noBtn) {
                this.display(1);

                //判断左侧按钮是否显示
                if (this.checkBtnShow("left")) {
                    this.scrollBtnL.hide();
                }

                //判断右侧按钮是否显示
                if (this.checkBtnShow("right")) {
                    this.scrollBtnR.hide();
                }
            }
            else {
                this.display(0);
            }

            return re;
        },
        //#endregion

        //#region 判断按钮是否显示
        checkBtnShow: function (type) {
            var targetElem = this.p.targetElem[0],
                re = null;

            switch (type) {
                case "left":
                    re = targetElem.scrollLeft <= 0;
                    break;
                case "right":
                    re = targetElem.scrollLeft + targetElem.clientWidth >= targetElem.scrollWidth;
                    break;
                default:
                    re = targetElem.scrollWidth > targetElem.clientWidth;
                    break;
            }

            return re;
        },
        //#endregion

        //#region 重新布局
        reLayout: function () {
            this.checkShow();
        },
        //#endregion

        //#region 页面尺寸变化事件
        pageResize: function (e) {
            var thiz = e.data.thiz;

            fj.lazyDo(function () {
                this.reLayout();
            }, thiz.p.layoutDelay, "ld_sbnj_layout", thiz);
        },
        //#endregion

        //#region 删除
        remove: function () {
            this._super();

            $(window).off("resize", this.pageResize);
        }
        //#endregion
    });

    //#region 绑定到jquery
    $.fn.extend({
        ScrollButtonJ: function (settings) {
            if (this && this.length > 0) {
                return new FJ.ScrollButtonJ(this, fj.SBNJ_commonConfig ? $.extend(true, fj.clone(fj.SBNJ_commonConfig), settings) : settings);
            }
        },
        SBNJ: function (settings) {
            return $(this).ScrollButtonJ(settings);
        }
    });
    //#endregion

});