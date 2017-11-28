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
* flareJ.Window
*-------*-------*-------*-------*-------*-------*
* 窗口
*-------*-------*-------*-------*-------*-------*
* [依赖]flareJ.Panel
*       flareJ.DragDrop
*----------------------------------------------*/
FJ.define("widget.Window", ["widget.Panel", "widget.DragDrop"], function() {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                           窗口
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.WindowJ = this.WINJ = FJ.WindowJ = FJ.WINJ = FJ.PJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "WINJ",
                renderTo: "body",                           //要加载到的容器
                title: "浮动窗口",                          //标题
                outPadding: { t: 0, r: 0, b: 0, l: 0 },     //外层补间宽度,例:{ t: 0, r: 5, b: 0, l: 5 }
                isInitShow: false,                          //初始化是否显示
                isCanFullScreen: true,                      //是否可全屏
                dragLeft: 0,                                //拖拽左边距极限值
                dragTop: 0,                                 //拖拽上边距极限值
                dragRight: 0,                               //拖拽右边距极限值
                dragBottom: 0,                              //拖拽下边距极限值
                isCanDrag: fj.isMobile ? false : true,      //是否可拖拽
                dragDir: null,                              //可拖拽方向
                isResizable: fj.isMobile ? false : true,    //是否可调整大小
                minWidth: 100,                              //调整尺寸最小宽度值
                maxWidth: null,                             //调整尺寸最大宽度值
                minHeight: 100,                             //调整尺寸最小高度值
                maxHeight: null,                            //调整尺寸最大高度值
                hasDivGray: false,                          //是否有全屏遮罩层
                zIndex: 100001,
                grayZindex: 100000,                         //全屏遮罩层的z轴位置
                grayOpacity: 80,                            //全屏遮罩层的透明度
                grayHideScroll: false,                      //开启全屏时是否隐藏页面滚动条
                showType: "fade",                           /*-------*弹出效果(待修改)*-------*
                                                             * fade:淡入淡出
                                                             * minToMax:由小变大
                                                             * slide:滑动
                                                             *-----*-----*-----*-----*/
                showLoading: true,
                speed: 1,
                showSpeed: FJ.isIElt9 ? 1 : 300,
                tranDuration: 0.3,                          //执行过渡动画持续时间
                animateOpacity: 0,                          //执行动画时是否使用透明
                loadSpeed: 1,
                //imgLoadSrc: LMJ.loadImgSrc(11),
                hasDdProxy: true,                           //是否使用拖放代理
                minOnClosing: false,                        //关闭前是否先最小化
                typeSign: "static",                         //以静态方法调用时层的标记
                closeMode: "hide",                          //关闭模式(hide:关闭时隐藏,remove:关闭时删除)
                radius: 0,                                  //圆角弧度,例:FJ.isIElt9 ? 0 : 5
                showHead: true,                             //是否显示头部
                showFoot: false,                            //是否显示底部
                showHeadImg: false,
                headHeight: 40,
                initFullScreen: false,                      //初始化全屏    
                hasSound: true,
                colorParams: {
                    grayColor: "#373737"
                },
                eType: (function (j) {
                    return {
                        afterClose: j,
                        afterRender: j,
                        beforeClose: j,
                        afterShow: j,
                        beforeShow: j
                    };
                })("WINJ")
            }, settings));

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            //过渡状态
            this.tranState = "close";

            //计算显示位置
            this.countShowPos();

            this._super();
        },
        //#endregion

        //#region 构建
        create: function () {
            var thiz = this,
                percentW = fj.RX.percent(this.p.width);

            //判断层是否已存在
            if ($("#WINJ_" + this.objId).length == 0) {  //此处判断待删
                this._super();

                //外层
                this.divOut.attr("id", "WINJ_" + this.objId).addClass("winj").css({
                    position: "absolute"
                });

                this.pjHead.css("cursor", "move");
            }

            //#region 设置缩放
            if (typeof (FJ.REJ) != "undefined") {
                if (this.p.isResizable) {
                    this.pjHead[0].cur = "move";  //设置元素原始指针样式
                    this.rej = $(this.divOut[0]).REJ({
                        d: (this.p.borderWidth > 4 ? this.p.borderWidth : 4),
                        miw: this.p.minWidth || 100,
                        mih: this.p.minHeight || 100,
                        maw: this.p.maxWidth || 1500,
                        mah: this.p.maxHeight || 1500,
                        padW: parseFloat(this.divOut.css("padding-left")) + parseFloat(this.divOut.css("padding-right")),
                        padH: parseFloat(this.divOut.css("padding-top")) + parseFloat(this.divOut.css("padding-bottom")),
                        hasProxy: this.p.hasDdProxy,
                        evts: {
                            resizeStart: function (e, p) {    //缩放开始
                                $("#moveIframe_" + thiz.objId).show();  //显示透明遮罩层
                            },
                            resizeEnd: function (e, p) {      //缩放结束
                                $("#moveIframe_" + thiz.objId).hide();   //隐藏透明遮罩层

                                //记录调整尺寸后的宽和高
                                if (thiz.p.divState == "max") {
                                    thiz.p.height = thiz.divOut.height();
                                }

                                //记录显示位置
                                thiz.p.left = parseFloat(thiz.divOut.css("left"));
                                thiz.p.top = parseFloat(thiz.divOut.css("top"));

                                thiz.setDragMaxRB();  //设置右边和下边拖放极限值为0时的值
                                thiz.reLayout();  //重新布局
                            }
                        }
                    });
                }
            }
            //#endregion

            //#region 设置拖放
            if (typeof (FJ.DRJ) != "undefined") {
                if (this.p.isCanDrag) {
                    this.drj = $(this.pjHead[0]).DRJ({
                        oRoot: this.divOut,
                        dir: this.p.dragDir,
                        minX: this.p.dragLeft,
                        maxX: this.p.dragRight,
                        minY: this.p.dragTop,
                        maxY: this.p.dragBottom,
                        hasProxy: this.p.hasDdProxy,
                        drjCls: "pj-drj",
                        isSetLeft: !percentW,
                        evts: {
                            dragStart: function (e, p) {    //拖放开始
                                $("#moveIframe_" + thiz.objId).show();  //显示透明遮罩层
                            },
                            dragEnd: function (e, p) {      //拖放结束
                                $("#moveIframe_" + thiz.objId).hide();  //隐藏透明遮罩层

                                //记录显示位置
                                thiz.p.top = parseFloat(thiz.divOut.css("top"));
                                if (!percentW) {  //宽度为百分比时不保存left值
                                    thiz.p.left = parseFloat(thiz.divOut.css("left"));
                                }

                                thiz.setDragMaxRB();  //重新设置拖放极限值
                            }
                        }
                    });
                }
            }
            //#endregion

            if (this.p.dragRight == 0) {  //浏览器滚动时重设在浏览器可视区域内拖拽的极限值
                $(window).bind("scroll", function () {
                    if (!thiz.divOut.is(":hidden")) {
                        fj.lazyDo(function () {
                            this.setDragMaxRB();
                        }, 500, "ld_winjScW", thiz);
                    }
                }).bind("resize", function () {
                    if (!thiz.divOut.is(":hidden")) {
                        fj.lazyDo(function () {
                            this.setDragMaxRB();
                        }, 500, "ld_winjRsW", thiz);
                    }
                });
            }

            this.fire("afterRender", "WINJ");
            return this;
        },
        //#endregion

        //#region 计算显示位置
        countShowPos: function () {
            //弹出位置默认为页面中心
            if (this.p.left == null) {
                this.p.left = FJ.pageWidth() / 2.0 - this.p.width / 2.0 + FJ.leftPosition();
            }
            if (this.p.top == null) {
                this.p.top = FJ.pageHeight() / 2.0 - this.p.height / 2.0 + FJ.topPosition();
                if (this.p.top < 0) {
                    this.p.top = 0;
                }
            }
        },
        //#endregion

        //#region 显示
        show: function () {
            var thiz = this;

            //显示时渲染在body下
            if (this.p.showRendorBody) {
                this.divOut.appendTo(FJ.oBody);
            }

            if (this.rej != null) {
                this.rej.p.onlyH = false;
            }

            //if (this.p.closeMode == "remove") {
                //this.create();
            //}

            //创建屏幕遮罩层
            this.addDivGray();

            //加载屏幕遮罩层
            this.renderDivGray();

            if (this.p.showType === "fade") {
                this.showReady();

                fj.Animate.fadeIn(this.divOut, {
                    duration: this.p.tranDuration,
                    evts: {
                        //start: function () {
                        //    thiz.showReady();
                        //},
                        stop: function () {
                            thiz.showFinish();
                        }
                    }
                });
            }

            return this;
        },
        //#endregion

        //#region 关闭
        close: function () {
            if (this.fire("beforeClose", "WINJ") === false) {
                return this;
            }

            var thiz = this;

            if (this.p.minOnClosing) {
                this.min(1, true);
            }

            //删除整页遮罩层
            this.deleteDivGray();

            if (this.p.showType === "fade") {
                var tranDuration = this.p.tranDuration;
                this.closeReady();

                fj.Animate.fadeOut(this.divOut, {
                    duration: tranDuration,
                    evts: {
                        //start: function () {
                        //    thiz.closeReady();
                        //},
                        stop: function () {
                            thiz.closeFinish();
                        }
                    }
                });

                //一定时间后强制执行关闭完毕操作
                fj.lazyDo(function () {
                    if (this.tranState !== "close") {
                        this.closeFinish();
                    }
                }, (tranDuration + 0.2) * 1000, "ld_forceClose", this);
            }
        },
        //#endregion

        //#region 加载内容区域完毕
        loadBodyComplete: function (type) {
            this._super(type);

            switch (type) {
                case "show":
                    break;
                case "reload":
                    break;
            }
            this.isFirstLoad = false;
        },
        //#endregion

        //#region 最大、最小化
        maxMin: function (cb, speed, notSetRej) {
            var thiz = this;
            this._super(function () {
                thiz.setDragMaxRB();
            }, speed, notSetRej);
        },
        //#endregion

        //#region 设置只能在浏览器可视区域内拖拽
        setDragMaxRB: function () {
            if (this.p.dragRight == 0 && this.drj) {
                this.drj.p.minX = document.documentElement.scrollLeft + document.body.scrollLeft;
                this.drj.p.maxX = document.documentElement.clientWidth + document.documentElement.scrollLeft + document.body.scrollLeft - (parseInt(this.divOut[0].clientWidth, 10) + parseInt(this.divOut.css("border-left-width"), 10) + parseInt(this.divOut.css("border-right-width"), 10));
                this.drj.p.minY = document.documentElement.scrollTop + document.body.scrollTop;
                //this.drj.p.maxY = document.documentElement.clientHeight + document.documentElement.scrollTop + document.body.scrollTop - (parseInt(this.divOut[0].clientHeight, 10) + parseInt(this.divOut.css("border-top-width"), 10) + parseInt(this.divOut.css("border-bottom-width"), 10));
                this.drj.p.maxY = null;
            }
        },
        //#endregion

        //#region 显示前操作
        showReady: function () {
            var dO = this.divOut;

            //先使外层显示
            dO.css({
                opacity: 0,
                display: "block"
            });

            this.fire("beforeShow", "WINJ");  //显示前事件
            this.pjBody.show();

            if (this.p.showFoot) {
                dO.css({ paddingBottom: (this.p.borderWidth > 1 ? this.p.footHeight + 2 : this.p.footHeight + 1) + "px" });
                this.pjFoot.show();
            }
        },
        //#endregion

        //#region 显示完毕操作
        showFinish: function () {
            this.tranState = "show";
            if (parseFloat(this.divOut.css("top")) < 0) {   //防止窗口超出界面顶端
                this.divOut.css("top", 0);
            }

            this.p.height = this.divOut.height();
            this.reLayout();  //重新布局

            this.fire("afterShowBeforeBodyLoad");  //显示后(在内容页显示前)事件
            if (this.p.loadAfterShow) {
                this.loadBody("show");
            }

            this.setDragMaxRB();  //设置右边和下边拖放极限值为0时的值
            this.fire("afterShow", "WINJ");  //显示后事件
            if (this.p.initFullScreen) {  //初始化全屏
                this.fullScreen(1);
            }

            if (!this.p.isAutoSetHeight) {
                this.divOut.css("height", "auto");
            }
        },
        //#endregion

        //#region 关闭前操作
        closeReady: function () {
            //this.pjBody.css({ width: "100%", height: "100%" });

            ////为满足动画要求,在关闭前须设置提示框高度为具体数值
            //if (!this.p.isAutoSetHeight) {
            //    var dO = this.divOut;
            //    dO.css("height", dO.height());
            //}
        },
        //#endregion

        //#region 关闭完毕操作
        closeFinish: function () {
            this.tranState = "close";
            this.divOut.hide();

            //关闭时移动回原标签内
            if (this.p.showRendorBody) {
                this.divOut.appendTo(this.p.renderTo);
            }
            
            //关闭层
            if (this.p.closeMode == "remove") {
                this.remove();
            }
            else {
                if (this.p.divState == "min") {  //如果关闭前处于最小化状态，则切换回普通状态
                    this.p.divState = "max";
                    this.pjBtnMin.attr("title", "最小化");
                }

                if (this.p.divStateFs == "fullscreen") {  //如果关闭前处于全屏状态，则切换回普通状态
                    this.fullScreen(true);
                }

                if (this.p.loadType == "iframe") {  //内容区域使用iframe时，关闭后清除地址
                    this.bodyIn.find("iframe").attr("src", "");
                }
            }

            //执行回调函数
            this.fire("afterClose", "WINJ");
        }
        //#endregion
    });

    //#region 静态调用方法
    FJ.WINJ.init = function (settings) {
        return new FJ.WINJ(null, $.extend(true, {
            btns: null,
            footHeight: 4,
            hasDivGray: true
        }, settings));
    };

    FJ.WINJ.show = function (settings) {
        return new FJ.WINJ(null, settings).show();
    };
    //#endregion

    //#region 右下角浮动层
    FJ.WINJ.corner = function (settings) {
        return FJ.WINJ.show($.extend(true, {
            zIndex: 100,
            left: -10000,
            top: -10000,
            width: 260,
            height: 150,
            minWidth: 260,
            minHeight: 150,
            maxWidth: 260,
            maxHeight: 150,
            minSpeed: 1500,
            minOnClosing: false,
            speed: 1,
            showSpeed: 1,
            loadSpeed: 1,
            isCanClose: false,
            isCanFullScreen: false,
            headHeight: 25,
            isCanDrag: false,
            isResizable: false,
            urlType: "html",
            footHeight: 4,
            showFoot: true,
            btns: null,
            evts: {
                afterBodyLoadShow: function (e, p) {
                    //初始状态设为最小化
                    this.min(0);

                    //浮动在右下角
                    this.divOut.fixFloatJ();
                }
            }
        }, settings));
    };
    //#endregion

    //#region 绑定到jquery
    $.fn.extend({
        WindowJ: function (settings) {
            if (this && this.length > 0) {
                return new FJ.WindowJ(this, fj.WINJ_commonConfig ? $.extend(true, fj.clone(fj.WINJ_commonConfig), settings) : settings);
            }
        },
        WINJ: function (settings) {
            return $(this).WindowJ(settings);
        }
    });
    //#endregion

    /************************************************************
    *-----------------------------------------------------------*
    *                         提示框
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.MessageBoxJ = this.MBJ = FJ.MessageBoxJ = FJ.MBJ = FJ.WINJ.extend({
        //#region 构造方法
        init: function (settings) {
            //参数
            this._super(null, $.extend(true, {
                fjType: "MBJ",
                title: "系统提示",              //标题
                outPadding: { t: 0, r: 0, b: 0, l: 0 },    //外层补间宽度,例:{ t: 0, r: 4, b: 0, l: 4 }
                msgType: "alert",               //提示框类型
                msgContent: "",                 //提示框内容
                msgImg: PJ.imgFolderSrc + "important.gif",        //提示框图标
                msgImgWidth: 100,               //图标区域宽度
                msgConHeight: null,             //内容区域高度
                msgBtns: [],                    //提示框按钮集合
                callBackOK: null,               //确定回调函数
                callBackCancel: null,           //取消回调函数
                dragTop: 0,                     //拖拽上边距极限值
                dragLeft: 0,                    //拖拽右边距极限值
                speed: 1,   //350
                showSpeed: 1,
                tranDuration: 0.1,              //执行过渡动画持续时间
                tranShiftH: 10,
                tranShiftW: 10,
                loadSpeed: 1,
                width: 320,
                height: 100,
                maxHeight: 300,
                isAutoSetHeight: false,
                hasShadow: true,
                isCanMinimize: false,
                isCanFullScreen: false,
                isResizable: false,
                showLoading: false,
                headHeight: 40,
                hasDivGray: true,
                grayZindex: 1000000,
                closeTimeout: null,
                loadType: "html",
                closeMode: "remove",
                onlyFirstLoad: true,
                loadAfterShow: false,
                footHeight: 4,
                showFoot: false,
                btns: null,
                btnTxt1: "确定",
                btnTxt2: "取消",
                loadHTML: function (p) {
                    var thiz = this;

                    this.mbjTable = $("<table class='mbj_table'></table>");
                    this.mbjTr1 = $("<tr></tr>");
                    this.mbjTr2 = $("<tr></tr>");
                    this.mbjTdL1 = $("<td class='mbj_td_left' rowspan='2'></td>");
                    if (this.p.msgImgWidth != null) {
                        this.mbjTdL1.width(this.p.msgImgWidth);
                    }
                    this.mbjTdR1 = $("<td class='mbj_td_right_1'></td>");
                    this.mbjContent = $("<div style='overflow:auto;padding-top:2px;'>" + this.p.msgContent + "</div>");
                    if (this.p.msgConHeight != null) {
                        this.mbjContent.height(this.p.msgConHeight);
                    }
                    this.mbjTdR1.append(this.mbjContent);
                    this.mbjTdR2 = $("<td class='mbj_td_right_2'></td>");

                    //提示框图标
                    this.mbjImg = $("<img class='fj-img-fill' src='" + this.p.msgImg + "' />");

                    //确定按钮
                    this.mbjBtnOK = $("<button type='button' class='btnj'>" + this.p.btnTxt1 + "</button>");
                    this.mbjBtnOK.onGestureJ(fj.Evt.click, function () {
                        if (thiz.timeoutClose) {
                            clearTimeout(thiz.timeoutClose);
                        }
                        if (thiz.p.callBackOK != null) {
                            if (thiz.p.callBackOK.call(thiz) != MBJ.FAILD) {
                                thiz.close();
                            }
                        }
                        else {
                            thiz.close();
                        }
                    });

                    this.mbjTdL1.append(this.mbjImg);
                    this.mbjTr1.append(this.mbjTdL1).append(this.mbjTdR1);
                    this.mbjTable.append(this.mbjTr1).append(this.mbjTr2);

                    //加载提示框按钮
                    switch (this.p.msgType) {
                        case "alert":
                            this.mbjTr2.append(this.mbjTdR2);
                            this.mbjTdR2.append(this.mbjBtnOK);
                            break;
                        case "confirm":
                            this.mbjTr2.append(this.mbjTdR2);
                            if (this.p.msgBtns.length == 0) {
                                //取消按钮
                                this.mbjBtnCancel = $("<button type='button' class='btnj' style='margin-left:10px;' >" + this.p.btnTxt2 + "</button>");
                                this.mbjBtnCancel.onGestureJ(fj.Evt.click, function () {
                                    if (thiz.timeoutClose) {
                                        clearTimeout(thiz.timeoutClose);
                                    }
                                    if (thiz.p.callBackCancel != null) {
                                        thiz.p.callBackCancel.call(thiz);
                                    }
                                    thiz.close();
                                });
                                this.mbjTdR2.append(this.mbjBtnOK).append(this.mbjBtnCancel);
                            }
                            else {  //自定义按钮
                                for (var i = 0, btns = this.p.msgBtns; i < btns.length; i++) {
                                    btns[i].btn = $("<button type='button' class='btnj'>" + btns[i].text + "</button>");
                                    if (i > 0) {
                                        btns[i].btn.css({
                                            marginLeft: 5
                                        });
                                    }
                                    (function (btn) {
                                        btn.btn.onGestureJ(fj.Evt.click, function () {
                                            btn.click.call(thiz);
                                        });
                                    })(btns[i]);
                                    this.mbjTdR2.append(btns[i].btn);
                                }
                            }
                            break;
                        case "prompt":
                            this.mbjTr2.append(this.mbjTdR2);
                            this.mbjBtnCancel = $("<button type='button' class='btnj' style='margin-left:10px;'>" + this.p.btnTxt2 + "</button>");
                            this.mbjBtnCancel.onGestureJ(fj.Evt.click, function () {
                                if (thiz.timeoutClose) {
                                    clearTimeout(thiz.timeoutClose);
                                }
                                if (thiz.p.callBackCancel != null) {
                                    thiz.p.callBackCancel.call(thiz);
                                }
                                thiz.close();
                            });
                            //输入文本框
                            this.mbjTxt = $("<input type='text' class='fj-form-elem' style='width:" + (this.p.width - 120) + "px;float:left;margin-bottom:5px;' />");
                            if (this.p.txtO) {
                                this.mbjTxt.val(this.p.txtO);
                            }
                            this.mbjTdR2.append(this.mbjTxt).append(this.mbjBtnOK).append(this.mbjBtnCancel);
                            this.mbjBtnOK.css("margin-bottom", 5);
                            this.mbjBtnCancel.css("margin-bottom", 5);
                            break;
                        case "loading":
                            this.mbjTdR1.attr("rowspan", "2").css("padding-top", "0");
                            this.pjBtnClose.hide();
                            if (this.btnBg1) {
                                this.btnBg1.hide();
                            }
                            break;
                    }

                    //关闭按钮
                    this.pjBtnClose.unbind("click").on("click", function () {
                        if (thiz.timeoutClose)
                            clearTimeout(thiz.timeoutClose);
                        thiz.close(true);
                    });

                    //一定时间后关闭
                    if (this.p.closeTimeout != null) {
                        this.timeoutClose = setTimeout(function () {
                            thiz.close(true);
                        }, this.p.closeTimeout);
                    }

                    return this.mbjTable;
                },
                grayOpacity: 1,
                evts: {
                    afterBodyLoad: function (e, p) {
                        this.mbjBtnOK.focus();   //使确定按钮获得焦点,便于点击回车键
                        //if (!this.p.isAutoSetHeight) {
                        //    this.divOut.css("height", "auto");   //使外层可以自动适应内容层高度
                        //    this.pjBody.css("height", "auto");
                        //}

                        //内容不能超过最大高度
                        if (this.p.msgConHeight == null) {
                            if (this.divOut.height() > this.p.maxHeight) {
                                this.mbjContent.height(this.p.maxHeight);
                            }
                            else {
                                this.mbjContent.css("height", "auto");
                            }
                        }

                        //修正弹出位置
                        var hD = this.divOut.height(),
                            hP = fj.pageHeight(),
                            t = hD <= hP ? (hP / 2.0 - hD / 2.0 + fj.topPosition()) : 0;
                        this.divOut.css("top", t);
                    },
                    afterReLayout: function (e, p) {
                        if (this.p.callBackLoad) {
                            this.p.callBackLoad.call(this);  //执行加载后回调方法
                        }
                    }
                },
                eType: (function (j) {
                    return {
                        afterRender: j
                    }
                })("MBJ")
            }, settings));
        },
        //#endregion

        //#region 构建
        create: function () {
            this._super();

            this.divOut.addClass("mbj");
            this.fire("afterRender", "MBJ");
            return this;
        },
        //#endregion

        //#region 显示
        show: function () {
            var thiz = this;

            //播放弹出声音
            if (this.p.hasSound) {
                switch (thiz.p.msgType) {
                    case "alert":
                        FJ.playSound.play("mbj2");
                        break;
                    case "confirm":
                        FJ.playSound.play("mbj1");
                        break;
                    case "prompt":
                        FJ.playSound.play("mbj1");
                        break;
                }
            }

            //渲染面板内容
            this.loadBody();

            //执行基类方法
            this._super();

            //内容页不显示滚动条
            this.bodyIn.css({
                overflowX: "hidden",
                overflowY: "hidden",
                overflow: "hidden"
            });

            return this;
        },
        //#endregion

        //#region 加载内容区域完毕
        loadBodyComplete: function (type) {
            this._super(type);
        },
        //#endregion

        //#region 关闭
        close: function (isRunCb) {
            //如果直接点击关闭按钮则执行回调函数
            if (isRunCb) {
                switch (this.p.msgType) {
                    case "alert":
                        if (this.p.callBackOK != null) {
                            this.p.callBackOK();
                        }
                        break;
                    case "confirm":
                        if (this.p.callBackCancel != null) {
                            this.p.callBackCancel();
                        }
                        break;
                }
            }

            //执行基类方法
            this._super();

            //重置弹出声音
            switch (this.p.msgType) {
                case "alert":
                    fj.playSound.reset("mbj2");
                    break;
                case "confirm":
                    fj.playSound.reset("mbj1");
                    break;
                case "prompt":
                    fj.playSound.reset("mbj1");
                    break;
            }
        }
        //#endregion
    });

    //#region 通用设置

    //返回失败标记
    FJ.MBJ.FAILD = "mbj_faild";

    //获取通用配置
    FJ.MBJ.getCommonConfig = function (settings) {
        if (FJ.MBJ_commonConfig) {
            var cc = fj.clone(FJ.MBJ_commonConfig);
            if (typeof settings == "undefined") {
                settings = cc;
            }
            else {
                settings = $.extend(true, cc, settings);
            }
        }
        return settings;
    };
    //#endregion

    //#region 一般静态调用方法
    FJ.MBJ.show = function (settings) {
        settings = MBJ.getCommonConfig(settings);
        return new FJ.MBJ(settings).show();
    };
    //#endregion

    //#region 只有确定按钮的提示框
    FJ.MBJ.alert = function (title, msgContent, callBackOK, timeout, settings) {
        settings = MBJ.getCommonConfig(settings);
        return new FJ.MBJ($.extend(true, {
            title: title,
            msgContent: msgContent,
            callBackOK: callBackOK,
            msgType: "alert",
            //msgImg: PJ.imgFolderSrc + "important.gif",
            msgImg: PJ.imgFolderSrc + "info.png",
            closeTimeout: timeout
        }, settings)).show();
    };
    //#endregion

    //#region 有确定和取消的提示框
    FJ.MBJ.confirm = function (title, msgContent, callBackOK, callBackCancel, settings) {
        settings = MBJ.getCommonConfig(settings);
        var config = $.extend(true, {
            title: title,
            msgContent: msgContent,
            msgType: "confirm",
            //msgImg: PJ.imgFolderSrc + "help.gif",
            msgImg: PJ.imgFolderSrc + "info.png"
        }, settings);

        if (typeof callBackOK == "function" || typeof callBackOK == "undefined") {
            config.callBackOK = callBackOK;
            config.callBackCancel = callBackCancel;
        }
        else {  //自定义按钮
            config.msgBtns = callBackOK;
            if (settings && settings.width != null) {
                config.width = settings.width;
            }
            else {
                config.width = 320;
            }
        }

        return new FJ.MBJ(config).show();
    };
    //#endregion

    //#region 有确定和输入文本框的提示框
    FJ.MBJ.prompt = function (title, msgContent, callBackOK, txtO, callBackCancel, settings) {
        settings = MBJ.getCommonConfig(settings);
        return new FJ.MBJ($.extend(true, {
            title: title,
            msgContent: msgContent,
            callBackOK: callBackOK,
            txtO: txtO,
            msgType: "prompt",
            //msgImg: PJ.imgFolderSrc + "info.gif",
            msgImg: PJ.imgFolderSrc + "info.png",
            height: 110
        }, settings)).show();
    };
    //#endregion

    //#region 加载中提示框
    FJ.MBJ.loading = function (title, msgContent, callBackLoad, settings) {
        settings = MBJ.getCommonConfig(settings);
        return new FJ.MBJ($.extend(true, {
            title: title,
            msgContent: msgContent,
            msgType: "loading",
            msgImg: LMJ.loadImgSrc(11),
            //            showHead: false,
            //            isRenderHF: false,
            speed: 1,
            showSpeed: 1,
            height: 50,
            hasHeadClose: false,
            callBackLoad: callBackLoad
        }, settings)).show();
    };
    //#endregion

    //#region 初始化弹出声音
    if (!fj.isMobile) {
        FJ.playSound.init("mbj1", FJ.mediaPath + "XP_dingdangsheng.wav");
        FJ.playSound.init("mbj2", FJ.mediaPath + "XP_jingtanhao.wav");
    }
    //#endregion

});