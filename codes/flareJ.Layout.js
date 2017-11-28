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
* last update:2015-12-18
***********************************************************/

/*----------------------------------------------*
* flareJ.Layout
*-------*-------*-------*-------*-------*-------*
* 布局控件
*-------*-------*-------*-------*-------*-------*
* [依赖]flareJ.DragDrop
*       flareJ.Tooltip
*----------------------------------------------*/
FJ.define("widget.Layout", ["widget.DragDrop", "widget.Tooltip"], function() {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                       布局控件
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    *
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    *
    ************************************************************/
    this.LayoutJ = this.LAJ = FJ.LayoutJ = FJ.LAJ = FJ.BJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //检测区域是否存在
            if (!settings.north) {
                settings.north = {
                    isExist: false,
                    hasBar: false
                };
            }
            if (!settings.west) {
                settings.west = {
                    isExist: false,
                    hasBar: false
                };
            }
            if (!settings.east) {
                settings.east = {
                    isExist: false,
                    hasBar: false
                };
            }
            if (!settings.south) {
                settings.south = {
                    isExist: false,
                    hasBar: false
                };
            }

            //参数
            this._super($.extend(true, {
                fjType: "LAJ",
                isInBody: true,
                ddPosType: "offset",  //计算拖动条位置使用的jquery方法:1、offset;2、position
                layoutDelay: 100,
                firstDelay: null,     //首次布局延时时长
                north: {
                    isExist: true,
                    size: 150,
                    isCanClose: true,
                    isCanToggle: false,
                    isResizable: true,
                    isHide: false,
                    isHideB: false,
                    hasBar: true,
                    hasToggleBtn: false,
                    barTip: null, //折叠按钮提示(收起)
                    barTipH: null, //折叠按钮提示(展开)
                    sizeB: 10,
                    minY: 50,
                    maxY: 200,
                    barTipOpen: null,
                    barTipClose: null,
                    isInO: true,  //是否在容器内
                    ocScroll: true,
                    top: 0,  //顶部距离
                    cName: "laj_north"
                },
                west: {
                    isExist: true,
                    size: 150,
                    isCanClose: true,
                    isCanToggle: false,
                    isResizable: true,
                    isHide: false,
                    isHideB: false,
                    hasBar: true,
                    hasToggleBtn: false,
                    sizeB: 10,
                    minX: 50,
                    maxX: 200,
                    isInO: true,
                    ocScroll: true,
                    offCanvas: {
                        top: 0,
                        shiftPercentH: 0
                    },
                    cName: "laj_west"
                },
                east: {
                    isExist: true,
                    size: 150,
                    isCanClose: true,
                    isCanToggle: false,
                    isResizable: true,
                    isHide: false,
                    isHideB: false,
                    hasBar: true,
                    hasToggleBtn: false,
                    sizeB: 10,
                    minX: 50,
                    maxX: 200,
                    isInO: true,
                    ocScroll: true,
                    cName: "laj_east"
                },
                south: {
                    isExist: true,
                    size: 150,
                    isCanClose: true,
                    isCanToggle: false,
                    isResizable: true,
                    isHide: false,
                    isHideB: false,
                    hasBar: true,
                    hasToggleBtn: false,
                    sizeB: 10,
                    minY: 50,
                    maxY: 200,
                    isInO: true,
                    ocScroll: true,
                    cName: "laj_south"
                },
                center: {
                    cName: "laj_center",
                    shiftWidth: 0,   //宽度补正值
                    shiftHeight: 0   //高度补正值
                },
                minW: 320, //最小布局宽度
                minH: 300, //最小布局高度
                hasDivGray: false,  //是否有容器遮罩层
                layerDelay: 400,    //浮动层初始化延迟时间
                isInBody: true,     //容器是否为body
                bodyScroll: false,  //是否使用body滚动条代替主区域局部滚动条
                bodyScrollX: true,  //是否显示body横滚动条
                responsive: false,
                responsiveParam: {  //响应式配置
                    "(max-width: 480px)|LAJ": {
                        params: {
                            north: {
                                size: 45
                            },
                            west: {
                                isHide: true,
                                isHideB: true,
                                isInO: false
                            },
                            bodyScrollX: false
                        },
                        handler: function (isInit) {
                            fj.pollDo(function () {
                                if (this.initLayer) {
                                    this.ttj && this.ttj.loadBody();
                                    return false;
                                }
                            }, null, null, this);
                        }
                    },
                    "(min-width: 481px) and (max-width: 768px)|LAJ": {
                        params: {
                            north: {
                                size: 50
                            },
                            west: {
                                isHide: true,
                                isHideB: true,
                                isInO: false
                            },
                            bodyScrollX: false
                        },
                        handler: function (isInit) {
                            fj.pollDo(function () {
                                if (this.initLayer) {
                                    this.ttj && this.ttj.loadBody();
                                    return false;
                                }
                            }, null, null, this);
                        }
                    },
                    "(min-width: 769px) and (max-width: 1024px)|LAJ": {
                        params: {
                            north: {
                                size: 50
                            },
                            west: {
                                isHide: false,
                                isHideB: false,
                                isInO: true,
                                size: 180
                            },
                            bodyScrollX: false
                        },
                        handler: function (isInit) {
                            if (!isInit) {
                                this.p.west.area.css("position", "fixed");
                                this.o.prepend(this.p.west.area);
                                if(this.ttj) {
                                    this.ttj.p.onlyFirstLoad = true;
                                    this.ttj.close(true);
                                }
                            }
                        }
                    },
                    "(min-width: 1025px)|LAJ": {
                        params: {
                            north: {
                                size: 100
                            },
                            west: {
                                isHide: false,
                                isHideB: false,
                                isInO: true,
                                size: 190
                            },
                            bodyScrollX: true
                        },
                        handler: function (isInit) {
                            if (!isInit) {
                                this.p.west.area.css("position", "fixed");
                                this.o.prepend(this.p.west.area);
                                if(this.ttj) {
                                    this.ttj.p.onlyFirstLoad = true;
                                    this.ttj.close(true);
                                }
                            }
                        }
                    }
                },
                evts: {
                    afterOpenN: null, //显示区域(末尾加大写的区域子母,以此类推)
                    afterCloseN: null, //隐藏区域
                    afterLayout: null, //布局完毕
                    afterOffCanvasLoad: null  //弹出式画布加载内容完毕
                }
            }, settings));

            this.o = elemObj;
            if (this.p.isInBody) {//检测容器是否为body
                this.p.ddPosType = "offset";
            }
            else {
                this.p.ddPosType = "position";
            }

            this.initFn();
            //初始化

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            var thiz = this;
            this._super();

            this.isFirst = true;  //是否首次布局
            this.create();

            //#region 执行首次布局
            var fn = function () {
                thiz.reLayout();

                if (thiz.p.responsive) {
                    fj.lazyDo(function () {
                        thiz.ttj = thiz.o.TTJ($.extend(true, {
                            borderWidth: 0,
                            hoverDirect: "left",
                            hoverType: "free",
                            showType: "offCanvas",
                            onlyFirstLoad: true,
                            loadAfterShow: false,
                            speed: 1,
                            showSpeed: 200,
                            loadDelay: 0,
                            width: 180,
                            height: "100%",
                            autoBodySize: true,
                            tranShiftS: 90,
                            zIndex: 499,
                            isAutoSetHeight: false,
                            hasShadow: true,
                            position: "fixed",
                            noBodyScroll: !thiz.p.west.ocScroll,
                            colorParams: {
                                borderOut: "gray"
                            },
                            loadHTML: function () {
                                return thiz.p.west.area;
                            },
                            evts: {
                                afterBodyLoad: function () {
                                    thiz.p.west.area.css({
                                        display: "block",
                                        width: "100%",
                                        height: "100%",
                                        top: 0,
                                        left: 0,
                                        position: "absolute"
                                    });

                                    this.reLayout();
                                },
                                afterFirstLoad: function () {
                                    thiz.fire("afterOffCanvasLoad", { dir: "west" });
                                }
                            }
                        }, thiz.p.west.offCanvas));

                        thiz.initLayer = true;
                    }, thiz.p.layerDelay);
                }

                //首次布局完毕事件
                thiz.fire("afterLayoutFirst", thiz.p);
            };

            if (this.p.firstDelay != null) {  //首次延时执行
                fj.lazyDo(function () {
                    fn();
                }, this.p.firstDelay);
            }
            else {
                fn();
            }
            //#endregion

            //页面尺寸改变时执行重新布局
            $(window).bind("resize", function () {
                if (!thiz.o.is(":hidden")) {
                    fj.lazyDo(function () {
                        this.reLayout();
                    }, thiz.p.layoutDelay, "ld_laj_resize", thiz);
                }
            });
        },
        //#endregion

        //#region 构建
        create: function () {
            var thiz = this,
                p = this.p,
                pN = p.north,
                pW = p.west,
                pE = p.east,
                pS = p.south,
                rp = this.p.responsive;

            //主容器
            this.o.addClass("laj");
            //$("html").css("overflow", "hidden");

            //创建分隔条
            if (pN.hasBar) {
                this.barN = $('<div class="laj_northBar laj_bar" style="height:' + pN.sizeB + 'px;left:0;"></div>');
                if (pN.hasToggleBtn) {//折叠按钮
                    this.toggleBtnN = $('<div class="laj_barTogglerBtn laj_northTogglerBtn"></div>');
                    if (pN.barTip) {
                        this.toggleBtnN.attr("title", pN.barTip);
                    }
                    this.toggleArrowN = $('<div class="laj_arrow laj_arrow_top"></div>');
                    this.barN.append(this.toggleBtnN.append(this.toggleArrowN));
                }
                else {
                    this.barN.append('<div class="laj_northToggler"></div>');
                }
                if (pN.barTipOpen) {
                    this.barN.attr("title", !pN.isHideB ? pN.barTipOpen : pN.barTipClose);
                }
                this.o.append(this.barN);

                if (pN.isHideB) {//是否隐藏分隔条
                    this.barN[0].style.display = "none";
                }
            }
            if (pW.hasBar) {
                this.barW = $('<div class="laj_westBar laj_bar" style="width:' + pW.sizeB + 'px;"></div>');
                if (pW.hasToggleBtn) {//折叠按钮
                    this.barW.addClass("cj_divCvFd1");
                    var barWrap = $('<div class="cj_divCvFd2"></div>');
                    this.toggleBtnW = $('<div class="laj_barTogglerBtn laj_westTogglerBtn cj_divCvFd3"></div>');
                    if (pW.barTip) {
                        this.toggleBtnW.attr("title", pW.barTip);
                    }
                    this.toggleArrowW = $('<div class="laj_arrow laj_arrow_left"></div>');
                    this.barW.append(barWrap.append(this.toggleBtnW.append(this.toggleArrowW)));
                }
                else {
                    this.barW.append('<div class="laj_westToggler"></div>');
                }
                if (pW.barTipOpen) {
                    this.barW.attr("title", !pW.isHideB ? pW.barTipOpen : pW.barTipClose);
                }
                this.o.append(this.barW);

                if (pW.isHideB) {//是否隐藏分隔条
                    this.barW[0].style.display = "none";
                }
            }
            if (pE.hasBar) {
                this.barE = $('<div class="laj_eastBar laj_bar" style="width:' + pE.sizeB + 'px;"></div>');
                if (pE.hasToggleBtn) {//折叠按钮
                    this.barE.addClass("cj_divCvFd1");
                    var barWrap = $('<div class="cj_divCvFd2"></div>');
                    this.toggleBtnE = $('<div class="laj_barTogglerBtn laj_eastTogglerBtn cj_divCvFd3"></div>');
                    if (pE.barTip) {
                        this.toggleBtnE.attr("title", pE.barTip);
                    }
                    this.toggleArrowE = $('<div class="laj_arrow laj_arrow_right"></div>');
                    this.barE.append(barWrap.append(this.toggleBtnE.append(this.toggleArrowE)));
                }
                else {
                    this.barE.append('<div class="laj_eastToggler"></div>');
                }
                if (pE.barTipOpen) {
                    this.barE.attr("title", !pE.isHideB ? pE.barTipOpen : pE.barTipClose);
                }
                this.o.append(this.barE);

                if (pE.isHideB) {//是否隐藏分隔条
                    this.barE[0].style.display = "none";
                }
            }
            if (pS.hasBar) {
                this.barS = $('<div class="laj_southBar laj_bar" style="height:' + pS.sizeB + 'px;left:0;"></div>');
                if (pS.hasToggleBtn) {//折叠按钮
                    this.toggleBtnS = $('<div class="laj_barTogglerBtn laj_southTogglerBtn"></div>');
                    if (pS.barTip) {
                        this.toggleBtnS.attr("title", pS.barTip);
                    }
                    this.toggleArrowS = $('<div class="laj_arrow laj_arrow_bottom"></div>');
                    this.barS.append(this.toggleBtnS.append(this.toggleArrowS));
                }
                else {
                    this.barS.append('<div class="laj_southToggler"></div>');
                }
                if (pS.barTipOpen) {
                    this.barS.attr("title", !pS.isHideB ? pS.barTipOpen : pS.barTipClose);
                }
                this.o.append(this.barS);

                if (pS.isHideB) {//是否隐藏分隔条
                    this.barS[0].style.display = "none";
                }
            }

            //创建区域参数
            pN.area = pN.isExist ? this.o.find("." + pN.cName) : null;
            pN.bar = pN.hasBar ? this.barN : null;
            pW.area = pW.isExist ? this.o.find("." + pW.cName) : null;
            pW.bar = pW.hasBar ? this.barW : null;
            pE.area = pE.isExist ? this.o.find("." + pE.cName) : null;
            pE.bar = pE.hasBar ? this.barE : null;
            pS.area = pS.isExist ? this.o.find("." + pS.cName) : null;
            pS.bar = pS.hasBar ? this.barS : null;
            p.center.area = this.o.find("." + p.center.cName);

            //设置各区域默认属性
            if (pN.isExist) {
                pN.area.height(pN.size).addClass("laj_elem").css({
                    top: 0,
                    left: 0
                });
                if (pN.hasBar) {
                    pN.bar.addClass("laj_elem");
                }
                if (this.p.bodyScroll) {
                    pN.area.addClass("laj-body-scroll");
                }
                if (pN.isHide) {
                    pN.area.hide();
                }
            }
            if (pW.isExist) {
                pW.area.width(pW.size).addClass("laj_elem laj_centerAll").css({
                    left: 0
                });
                if (pW.hasBar) {
                    pW.bar.addClass("laj_elem laj_centerAll");
                }
                if (this.p.bodyScroll) {
                    pW.area.addClass("laj-body-scroll");
                }
                if (pW.isHide) {
                    pW.area.hide();
                }
            }
            if (pE.isExist) {
                pE.area.width(pE.size).addClass("laj_elem laj_centerAll");
                if (pE.hasBar) {
                    pE.bar.addClass("laj_elem laj_centerAll");
                }
                if (pE.isHide) {
                    pE.area.hide();
                }
            }
            if (pS.isExist) {
                pS.area.height(pS.size).addClass("laj_elem").css({
                    left: 0
                });
                if (pS.hasBar) {
                    pS.bar.addClass("laj_elem");
                }
                if (pS.isHide) {
                    pS.area.hide();
                }
            }
            p.center.area.addClass("laj_elem laj_centerAll");
            if (this.p.bodyScroll) {
                p.center.area.addClass("laj-body-scroll");
            }
            p.center.allErea = this.o.find(".laj_centerAll");

            //容器遮罩层(防止iframe阻挡拖动)
            if (this.p.hasDivGray) {
                this.divG = $('<div style="display:none;position:absolute;background-color:#fff;filter:alpha(opacity=1);-moz-opacity:0.01;opacity:0.01;z-index:999;"></div>');
                this.o.append(this.divG);
            }

            //设置各区域分隔条
            if (pN.hasBar && pN.isResizable) {
                this.spjN = pN.bar.SPJ({
                    way: "v",
                    minY: 50,
                    maxY: 200,
                    oTop: pN.area,
                    oBottom: p.center.allErea,
                    abMode: true,
                    ddPosType: this.p.ddPosType
                });
                if (this.p.hasDivGray) {
                    this.spjN.bindEvt("splitStart", function (e, p) {
                        thiz.divG.show();
                    });
                    this.spjN.bindEvt("splitEnd", function (e, p) {
                        thiz.divG.hide();
                    });
                }
            }
            if (pW.hasBar && pW.isResizable) {
                this.spjW = pW.bar.SPJ({
                    minX: 50,
                    maxX: 200,
                    oLeft: pW.area,
                    oRight: p.center.area,
                    abMode: true,
                    ddPosType: this.p.ddPosType
                });
                if (this.p.hasDivGray) {
                    this.spjW.bindEvt("splitStart", function (e, p) {
                        thiz.divG.show();
                    });
                    this.spjW.bindEvt("splitEnd", function (e, p) {
                        thiz.divG.hide();
                    });
                }
            }
            if (pE.hasBar && pE.isResizable) {
                this.spjE = pE.bar.SPJ({
                    minX: 50,
                    maxX: 50,
                    oLeft: p.center.area,
                    oRight: pE.area,
                    abMode: true,
                    ddPosType: this.p.ddPosType
                });
                if (this.p.hasDivGray) {
                    this.spjE.bindEvt("splitStart", function (e, p) {
                        thiz.divG.show();
                    });
                    this.spjE.bindEvt("splitEnd", function (e, p) {
                        thiz.divG.hide();
                    });
                }
            }
            if (pS.hasBar && pS.isResizable) {
                this.spjS = pS.bar.SPJ({
                    way: "v",
                    minY: 50,
                    maxY: 50,
                    oTop: p.center.allErea,
                    oBottom: pS.area,
                    abMode: true,
                    ddPosType: this.p.ddPosType
                });
                if (this.p.hasDivGray) {
                    this.spjS.bindEvt("splitStart", function (e, p) {
                        thiz.divG.show();
                    });
                    this.spjS.bindEvt("splitEnd", function (e, p) {
                        thiz.divG.hide();
                    });
                }
            }

            //设置点击分隔条显示、隐藏区域
            if (pW.hasBar && pW.isCanToggle) {
                var barC = !pW.hasToggleBtn ? pW.bar : this.toggleBtnW;
                barC.click(function () {
                    thiz.showArea("w", null, true);
                });
            }
            if (pE.hasBar && pE.isCanToggle) {
                var barC = !pE.hasToggleBtn ? pE.bar : this.toggleBtnE;
                barC.click(function () {
                    thiz.showArea("e", null, true);
                });
            }
            if (pN.hasBar && pN.isCanToggle) {
                var barC = !pN.hasToggleBtn ? pN.bar : this.toggleBtnN;
                barC.click(function () {
                    thiz.showArea("n", null, true);
                });
            }
            if (pS.hasBar && pS.isCanToggle) {
                var barC = !pS.hasToggleBtn ? pS.bar : this.toggleBtnS;
                barC.click(function () {
                    thiz.showArea("s", null, true);
                });
            }
        },
        //#endregion

        //#region 显示/隐藏区域
        showArea: function (type, isHide, notHideB, notReLayout) {
            var o,
                p = this.p,
                barBtn,
                barArrow,
                rp = this.p.responsive;

            switch (type) {
                case "n":
                    o = p.north;
                    barArrow = this.toggleArrowN;
                    barBtn = this.toggleBtnN;
                    break;
                case "w":
                    o = p.west;
                    barArrow = this.toggleArrowW;
                    barBtn = this.toggleBtnW;
                    break;
                case "e":
                    o = p.east;
                    barArrow = this.toggleArrowE;
                    barBtn = this.toggleBtnE;
                    break;
                case "s":
                    o = p.south;
                    barArrow = this.toggleArrowS;
                    barBtn = this.toggleBtnS;
                    break;
            }

            if (isHide == null) {//不传isHide参数则设置为相反状态
                isHide = !o.isHide;
            }

            if (o.area && o.isCanClose) {
                if (isHide) {
                    if (!rp) {
                        o.area.hide();
                    }
                    if (!notHideB && o.bar) {
                        o.bar.hide();
                        o.isHideB = true;
                    }
                    if (o.barTipClose) {
                        o.bar.attr("title", o.barTipClose);
                    }
                    o.isHide = true;
                }
                else {
                    o.area.show();
                    if (!notHideB && o.bar) {
                        o.bar.show();
                        o.isHideB = false;
                    }
                    if (o.barTipOpen) {
                        o.bar.attr("title", o.barTipOpen);
                    }
                    o.isHide = false;
                }
                if (!notReLayout) {//显示或隐藏区域后重布局
                    this.reLayout();
                }

                //切换折叠按钮方向
                if (barArrow) {
                    switch (type) {
                        case "n":
                            if (isHide) {
                                barArrow.swapClassJ("laj_arrow_top", "laj_arrow_bottom");
                            }
                            else {
                                barArrow.swapClassJ("laj_arrow_bottom", "laj_arrow_top");
                            }
                            break;
                        case "w":
                            if (isHide) {
                                barArrow.swapClassJ("laj_arrow_left", "laj_arrow_right");
                            }
                            else {
                                barArrow.swapClassJ("laj_arrow_right", "laj_arrow_left");
                            }
                            break;
                        case "e":
                            if (isHide) {
                                barArrow.swapClassJ("laj_arrow_right", "laj_arrow_left");
                            }
                            else {
                                barArrow.swapClassJ("laj_arrow_left", "laj_arrow_right");
                            }
                            break;
                        case "s":
                            if (isHide) {
                                barArrow.swapClassJ("laj_arrow_bottom", "laj_arrow_top");
                            }
                            else {
                                barArrow.swapClassJ("laj_arrow_top", "laj_arrow_bottom");
                            }
                            break;
                    }
                }

                //切换折叠按钮提示
                if (o.barTip) {
                    if (isHide) {
                        barBtn.attr("title", o.barTipH);
                    }
                    else {
                        barBtn.attr("title", o.barTip);
                    }
                }

                //显示隐藏事件
                var typeU = type.toUpperCase();
                this.fire("afterShowArea" + typeU, o);
            }
        },
        //#endregion

        //#region 重新布局
        reLayout: function () {
            var p = this.p,
                oD1 = p.north.area,
                oD2 = p.north.bar,
                oD4 = p.south.bar,
                oD5 = p.south.area,
                ph,
                pw,
                rp = this.p.responsive,
                bodyScroll = p.bodyScroll;

            if (this.p.isInBody) {
                pw = fj.pageWidth();
            }
            else {
                pw = this.o.width();
            }
            if (rp && pw < p.minW) {//响应式时如果宽度小于阀值时也会进行重新计算,非响应式时不重新计算
                pw = p.minW;
            }
            if (pw >= p.minW || this.isFirst) {
                var oD1c = p.west.area;
                var oD2c = p.west.bar;
                var oD3c = p.center.area;
                var oD4c = p.east.bar;
                var oD5c = p.east.area;

                var w1 = 0, w2 = 0;
                if (oD1c) {  //左区域
                    if (!p.west.isHide) {
                        oD1c.show();
                        if (rp) {  //响应式处理时根据参数设置宽度
                            w1 = p.west.size;
                            oD1c.innerWidth(w1);
                        }
                        else {
                            w1 = oD1c.width();
                        }
                    }
                    else if (p.west.isInO) {
                        oD1c.hide();
                    }
                }
                if (oD2c) {  //左区域分隔条
                    if (!p.west.isHideB) {
                        oD2c.show();
                        if (rp) {
                            w2 = p.west.sizeB;
                            oD2c.innerWidth(w2);
                        }
                        else {
                            w2 = oD2c.width();
                        }
                    }
                    else {
                        oD2c.hide();
                    }
                }

                var w3 = oD3c.width();  //中区域

                var w4 = 0, w5 = 0;
                if (oD4c) {  //右区域分隔条
                    if (!p.east.isHideB) {
                        oD4c.show();
                        if (rp) {
                            w4 = p.east.sizeB;
                            oD4c.innerWidth(w4);
                        }
                        else {
                            w4 = oD4c.width();
                        }
                    }
                    else {
                        oD4c.hide();
                    }
                }
                if (oD5c) {  //右区域
                    if (!p.east.isHide) {
                        oD5c.show();
                        if (rp) {  //响应式处理时根据参数设置宽度
                            w5 = p.east.size;
                            oD5c.innerWidth(w5);
                        }
                        else {
                            w5 = oD5c.width();
                        }
                    }
                    else if (p.east.isInO) {
                        oD5c.hide();
                    }
                }

                if (!bodyScroll) {
                    if (oD1) {
                        oD1.width(pw);
                    }
                    if (oD2) {
                        oD2.width(pw);
                    }
                    if (oD4) {
                        oD4.width(pw);
                    }
                    if (oD5) {
                        oD5.width(pw);
                    }
                }

                var dw = pw - w1 - w2 - w4 - w5 + p.center.shiftWidth;
                var dl = w1 + w2 + dw;

                if (oD2c) {
                    oD2c.css("left", w1);

                    if (this.spjW) {
                        this.spjW.p.minX = p.west.minX;
                        this.spjW.p.maxX = p.west.maxX;
                    }
                }

                if (!bodyScroll) {
                    oD3c.innerWidth(dw).css("left", w1 + w2);
                }
                else {
                    var ca = oD3c[0],
                        ws = w1 + w2;

                    if (!this.p.bodyScrollX) {  //不允许body出现横滚动条
                        oD3c.css({
                            marginLeft: p.west.isInO ? ws : 0
                        });

                        FJ.oBody.css("overflow-x", "hidden");
                        this.o.css("width", "100%");
                    }
                    else {  //允许body出现横滚动条
                        oD3c.css({
                            marginLeft: ws
                        });

                        FJ.oBody.css("overflow-x", "auto");
                        if (ca.scrollWidth + ws > pw) {  //如果主区域滚动条内宽度大于页面宽度,则手动设置页面宽度
                            this.o.innerWidth(ws + ca.scrollWidth);
                        }
                        else {  //小于则设置为100%
                            this.o.css("width", "100%");
                        }
                    }
                }

                if (oD4c) {
                    oD4c.css("left", dl);

                    if (this.spjE) {
                        var minx = pw - p.east.maxX;
                        this.spjE.p.minX = minx >= 0 ? minx : 0;
                        var maxx = pw - p.east.minX;
                        this.spjE.p.maxX = maxx >= 0 ? maxx : 0;
                    }
                }
                if (oD5c) {
                    oD5c.css("left", dl + w4);
                }
            }

            if (this.p.isInBody) {
                ph = fj.pageHeight();
            }
            else {
                ph = this.o.height();
            }
            if (rp && ph < p.minH) {//响应式时如果高度小于阀值时也会进行重新计算,非响应式时不重新计算
                ph = p.minH;
            }
            if (ph >= p.minH || this.isFirst) {
                var oD3 = p.center.allErea;

                var h1 = 0, h2 = 0;
                if (oD1) {  //上区域
                    if (!p.north.isHide) {
                        oD1.show();
                        if (rp) {  //响应式处理时根据参数设置高度
                            h1 = p.north.size;
                            oD1.innerHeight(h1);
                        }
                        else {
                            h1 = oD1.height();
                        }
                    }
                    else if (p.north.isInO) {
                        oD1.hide();
                    }
                }
                if (oD2) {  //上区域分隔条
                    if (!p.north.isHideB) {
                        oD2.show();
                        if (rp) {
                            h2 = p.north.sizeB;
                            oD2.innerHeight(h2);
                        }
                        else {
                            h2 = oD2.height();
                        }
                    }
                    else {
                        oD2.hide();
                    }
                }

                var h3 = oD3.height();  //左、中、右区域

                var h4 = 0, h5 = 0;
                if (oD4) {  //下区域分隔条
                    if (!p.south.isHideB) {
                        oD4.show();
                        if (rp) {
                            h4 = p.south.sizeB;
                            oD4.innerHeight(h4);
                        }
                        else {
                            h4 = oD4.height();
                        }
                    }
                    else {
                        oD4.hide();
                    }
                }
                if (oD5) {  //下区域
                    if (!p.south.isHide) {
                        oD5.show();
                        if (rp) {  //响应式处理时根据参数设置高度
                            h5 = p.south.size;
                            oD5.innerHeight(h5);
                        }
                        else {
                            h5 = oD5.height();
                        }
                    }
                    else if (p.south.isInO) {
                        oD5.hide();
                    }
                }

                var dh = ph - h1 - h2 - h4 - h5 + p.center.shiftHeight,
                    dt = h1 + h2 + dh,
                    topN = p.north.top;  //顶部距离

                if(bodyScroll && oD1) {
                    oD1.css("top", topN);
                }

                if (oD2) {
                    oD2.css("top", bodyScroll ? h1 + topN : h1);

                    if (this.spjN) {
                        this.spjN.p.minY = p.north.minY;
                        this.spjN.p.maxY = p.north.maxY;
                    }
                }

                oD3.each(function () {
                    if (p.west.isHide && this.className.indexOf("laj_west") != -1) {  //左区域隐藏时不设置位置值
                        return;
                    }
                    else if (p.east.isHide && this.className.indexOf("laj_east") != -1) {  //右区域隐藏时不设置位置值
                        return;
                    }

                    if (!bodyScroll) {
                        $(this).innerHeight(dh).css("top", h1 + h2);
                    }
                    else {
                        if (this.className.indexOf("laj_center ") != -1) {  //主区域设置padding-top值,其他区域设置top值
                            p.center.area.css("padding-top", h1 + h2 + topN);
                        }
                        else {
                            $(this).innerHeight(dh - topN).css("top", h1 + h2 + topN);
                        }
                    }
                });

                if (oD4) {
                    oD4.css("top", dt);

                    if (this.spjS) {
                        var miny = ph - p.south.maxY;
                        this.spjS.p.minY = miny >= 0 ? miny : 0;
                        var maxy = ph - p.south.minY;
                        this.spjS.p.maxY = maxy >= 0 ? maxy : 0;
                    }
                }

                if (oD5) {
                    oD5.css("top", dt + h4);
                }
            }

            //计算容器遮罩层尺寸
            if (this.p.hasDivGray) {
                this.divG.css({
                    width: pw,
                    height: ph
                });
            }

            this.isFirst = false;

            //布局完毕事件
            this.fire("afterLayout", p);
        },
        //#endregion

        //#region 响应式处理
        responsiveHandle: function (isInit) {
            if (!this.o.is(":hidden")) {
                this._super(isInit);
            }
        }
        //#endregion
    });

    //#region 绑定到jquery
    $.fn.extend({
        LayoutJ: function (settings) {
            if (this && this.length > 0) {
                return new FJ.LayoutJ(this, fj.LAJ_commonConfig ? $.extend(true, fj.clone(fj.LAJ_commonConfig), settings) : settings);
            }
        },
        LAJ: function (settings) {
            return $(this).LayoutJ(settings);
        }
    });
    //#endregion

});
