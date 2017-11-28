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
* last update:2016-4-14
***********************************************************/

/*----------------------------------------------*
* flareJ.Calendar
*-------*-------*-------*-------*-------*-------*
* 日历控件
*-------*-------*-------*-------*-------*-------*
* [依赖]flareJ.DragDrop
*       flareJ.Tooltip
*----------------------------------------------*/
FJ.define("widget.Calendar", ["widget.DragDrop", "widget.Tooltip"], function () {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                         日历控件
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 参考自caoailin的精美js日历
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.CalendarJ = this.CDRJ = FJ.CalendarJ = FJ.CDRJ = FJ.CJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "CDRJ",
                renderTo: elemObj,                         //要加载到的容器
                width: 370,                                //最大宽度
                height: 270,                               //最大高度
                hasMonthE: true,                           //是否显示英文月份
                showMoreDay: true,                         //是否显示上月和下月的日期
                dateFormat: 'yyyy-mm-dd',                  //日期格式
                dateInit: FJ.Date.toFormatString(new Date(), "yyyy-mm-dd"),   //初始日期
                isTimeInit: true,                          //时间控件是否设置当前时间
                dayColor: [],                              //日期颜色集合
                hasGradient: false,
                borderWidth: 0,
                menuSpeed: FJ.isIElt9 ? 1 : 100,
                isShowWatermark: true,
                isShowToday: false,
                isShowSelectYear: true,
                isShowTimePicker: false,                   //是否可选时间
                fontFamily: "宋体",                        //方正综艺_GBK
                fontSizeMonth: 13,
                fontSizeMonthE: 18,
                fontSizeBody: 12,
                headPaddingH: fj.isIE7 ? 0 : 4,
                weekPaddingH: 0,
                bodyPaddingH: 0,
                cdrheadHeight: 35,
                bodyShiftH: 67,
                menuShiftT: 7,
                dateRange: null,                           //日期输入范围,格式:[date1,date2]
                hasDayTitle: true,                         //日期td是否有title
                inSameMonth: function (d1, d2) {           //判断是否在同月份方法
                    var a1 = d1.split("-"),
                        a2 = d2.split("-"),
                        r = false;

                    if (a1[0] == a2[0] && a1[1] == a2[1]) {
                        r = true;
                    }
                    return r;
                },
                colorParams: {
                    borderOut: null,                       //外层边框
                    bgColor: null,                         //背景色
                    bgColor1: null,                        //背景渐变色开始
                    bgColor2: null,                        //背景渐变色结束
                    headerBackColor: null,                 //表头背景颜色
                    headerFontColor: null,                 //表头字体颜色
                    menuOverColor: null,                   //菜单字体色
                    bodyBarBackColor: null,                //日历标题背景色
                    bodyBarFontColor: null,                //日历标题字体色
                    bodyFontColor: null,                   //日历字体色
                    bodyHolidayFontColor: null,            //假日字体色
                    borderDay: "#868686",                  //日期单元格边框色
                    watermarkColor: null,                  //背景水印色
                    moreDayColor: null                     //上月和下月日期的颜色
                },
                evts: {
                    clickDay: null,                        //点击日期事件
                    getDayColor: null,                     //获取日期颜色事件
                    afterBindDate: null,                   //绑定日期完成事件
                    leaveTimePicker: null                  //鼠标离开时间选择器事件
                }
            }, settings));

            this.date = null;       //当前日期
            this.timer = null;      //控制下拉菜单显示隐藏

            this.initFn();

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            var thiz = this;
            this._super();

            //初始化vml按钮标签
            //this.changeDrawTheme(true);

            this.dateSelect = this.p.dateInit;  //初始化选中日期
            this.create();

            //移动端轻触优化
            if (fj.isMobile) {
                this.cdrBodyOut.onGestureJ(fj.Evt.click, function (e, p) {
                    p.evt.stopPropagation();

                    var target = $(p.evt.target);
                    if (target.hasClass("fj-tap-elem")) {
                        //target.trigger("mouseover");

                        fj.lazyDo(function () {
                            target.trigger(fj.Evt.customClick);
                        });
                    }

                    ////弹出日历需修改焦点标记,以便于失去焦点时关闭层
                    //if(thiz.ttj) {
                    //    thiz.ttj.overByFocus = false;
                    //}
                }, {
                    tapHoverCls: "cdrj-tap",
                    tapHoverElem: "tap"
                });

                this.cdrMenu.on("touchend", function(e) {  //菜单触摸点击日后待优化
                    e.stopPropagation();
                });
            }

            this.show();
        },
        //#endregion

        //#region 构建
        create: function () {
            this._super();
            var thiz = this;

            //外层
            this.divOut.addClass("cdrj").attr("id", "CalendarJ" + this.objId).css({
                height: FJ.isWebkit ? thiz.p.height - 4 : thiz.p.height
            });

            //背景
            this.divOut.addClass("cdrj_bg").css({
                borderWidth: 1
            });

            if (this.p.hasGradient) {
                if (fj.isIElt9) {  //IE下新建一个用滤镜做渐变背景的层,如果直接设置在divOut上,会使内部元素在IE7下出现模糊的现象
                    this.filterBg = $('<div class="cdrj_filterBg"></div>');
                    this.divOut.append(this.filterBg);
                }
                else if (fj.isOpera || FJ.isIEgt9) {  //opera,IE9以上版本用svg做渐变背景
                    this.svgBg = $('<div class="cdrj_svgBg"></div>');
                    this.divOut.css({ borderRadius: "5px" }).append(this.svgBg);
                }
                else if (fj.isFF) {
                    this.divOut.addClass("cdrj_bg_ff");
                }
                else if (fj.isWebkit) {
                    this.divOut.addClass("cdrj_bg_wk");
                }
            }
            else {
                this.divOut.addClass("cdrj_bg_img");
            }

            //水印字
            this.cdrWmYear = $('<div class="cj_divCvFd3" >2010</div>');
            this.cdrWatermark = ($('<div class="cdrj_watermark cj_divCvFd1"></div>').css({
                height: this.p.height + "px"
            }).append($('<div class="cj_divCvFd2"></div>').append(this.cdrWmYear)));
            if (this.p.colorParams.watermarkColor) {
                this.cdrWatermark.css("color", this.p.colorParams.watermarkColor);
            }
            if (!this.p.isShowWatermark) {
                this.cdrWatermark.hide();
            }
            this.cdrBodyOut = $('<div class="cdrj_bodyOut"></div>');

            //菜单
            this.cdrMenu = $('<div style="position:absolute;z-index:10;left:0px;top:0px;display:none;" ></div>').hover(function () {
                thiz.showMenu(null, true);
            }, function () {
                thiz.hideMenu();
            });

            //渲染各部件
            this.divOut.append(this.cdrWatermark).append(this.cdrBodyOut.append(this.getHeader()).append(this.getBodyBar()).append(this.getBody()).append(this.getBodyToday())).append(this.cdrMenu);

            //#region 时间选择器
            if (this.p.isShowTimePicker) {
                this.timePicker = $('<div class="cdrj_timePicker"></div>');
                this.time = this.p.isTimeInit ? fj.Date.toFormatString(new Date(), "hh:MM:ss") : "00:00:00";
                this.timePos = 2;
                var fnUpdateInput = function () {  //更新文本框内时间
                    if (thiz.currentInput) {
                        var v = thiz.currentInput.val();
                        if (FJ.RX.datetime(v)) {
                            var date = v.split(" ")[0];
                            thiz.currentInput.val(date + " " + thiz.time);
                        }
                    }
                };
                this.timeInput = $('<input class="cdrj_timeInput" type="text" value="' + this.time + '" />');
                this.timeInput.click(function () {
                    var pos = thiz.timeInput.textPositionJ();  //获取光标位置
                    switch (pos) {
                        case 0:
                        case 1:
                        case 2:
                            thiz.timeInput.selectRangeJ(0, 2);
                            thiz.timePos = 0;
                            break;
                        case 3:
                        case 4:
                        case 5:
                            thiz.timeInput.selectRangeJ(3, 5);
                            thiz.timePos = 1;
                            break;
                        case 6:
                        case 7:
                        case 8:
                            thiz.timeInput.selectRangeJ(6, 8);
                            thiz.timePos = 2;
                            break;
                    }
                }).bind("change", function () {
                    var v = thiz.timeInput.val();

                    if (!FJ.RX.time(v)) {   //验证时间格式
                        thiz.timeInput.val(thiz.time);
                    }
                    else {
                        var h = parseFloat(v.substr(0, 2));
                        var m = parseFloat(v.substr(3, 2));
                        var s = parseFloat(v.substr(6, 2));
                        if (h >= 0 && h <= 23 && m >= 0 && m <= 59 && s >= 0 && s <= 59) {
                            thiz.time = v;
                        }
                        else {
                            thiz.timeInput.val(thiz.time);
                        }
                    }
                }).bind("mouseleave", function () {
                    thiz.timeInput.trigger("change");
                    fnUpdateInput();  //更新文本框内时间
                    thiz.fire("leaveTimePicker", { time: thiz.time });
                });

                //增减按钮
                var timeDiv = $('<div class="cdrj_timeDiv"></div>');
                //                if (FJ.isSafari || FJ.isFF) {
                //                    timeDiv.css("top", 3);
                //                }
                var btnTp1 = $('<input class="cdrj_timeBtn" type="button" />');

                var fnMouseenter = function () {
                    $(this).removeClass("cdrj_timeBtnLeave").addClass("cdrj_timeBtnHover");
                };

                var fnMouseleave = function () {
                    $(this).removeClass("cdrj_timeBtnHover").addClass("cdrj_timeBtnLeave");
                };

                var fnClick = function () {
                    var n = $(this).attr("bNum");
                    var v = thiz.timeInput.val();
                    var t = 0;

                    switch (thiz.timePos) {
                        case 0:
                            t = parseFloat(v.substr(0, 2));
                            break;
                        case 1:
                            t = parseFloat(v.substr(3, 2));
                            break;
                        case 2:
                            t = parseFloat(v.substr(6, 2));
                            break;
                    }

                    if (n == 1) {
                        t += 1;
                    }
                    else {
                        t -= 1;
                    }

                    switch (thiz.timePos) {
                        case 0:
                            if (t > 23) {
                                t = 0;
                            }
                            else if (t < 0) {
                                t = 23;
                            }
                            break;
                        case 1:
                        case 2:
                            if (t > 59) {
                                t = 0;
                            }
                            else if (t < 0) {
                                t = 59;
                            }
                            break;
                    }

                    switch (thiz.timePos) {
                        case 0:
                            thiz.time = FJ.Math.addZero(t) + v.substr(2, 6);
                            thiz.timeInput.val(thiz.time);
                            thiz.timeInput.selectRangeJ(0, 2);
                            break;
                        case 1:
                            thiz.time = v.substr(0, 3) + FJ.Math.addZero(t) + v.substr(5, 3);
                            thiz.timeInput.val(thiz.time);
                            thiz.timeInput.selectRangeJ(3, 5);
                            break;
                        case 2:
                            thiz.time = v.substr(0, 6) + FJ.Math.addZero(t);
                            thiz.timeInput.val(thiz.time);
                            thiz.timeInput.selectRangeJ(6, 8);
                            break;
                    }

                    fnUpdateInput();  //更新文本框内时间
                };

                btnTp1.css({
                    backgroundImage: "url(" + FJ.CDRJ.imgFolderSrc + "spinner_arrow_up.gif)",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "5px 1px"
                });

                var btnTp2 = btnTp1.clone().css({
                    backgroundImage: "url(" + FJ.CDRJ.imgFolderSrc + "spinner_arrow_down.gif)",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "5px 1px"
                }).attr("bNum", "2").hover(fnMouseenter, fnMouseleave).click(fnClick);
                btnTp1.attr("bNum", "1").hover(fnMouseenter, fnMouseleave).click(fnClick);
                timeDiv.append(btnTp1).append(btnTp2);

                this.divOut.append(this.timePicker.append("<img src='" + FJ.CDRJ.imgFolderSrc + "time.gif' />").append(this.timeInput).append(timeDiv));
            }
            //#endregion

            //#region 设置样式
            this.cdrHeader.find("td").css({
                fontFamily: this.p.fontFamily,
                fontSize: this.p.fontSizeMonth + "px"
            });

            this.cdrHeader.find("td.currentMonthE").css((function () {
                var obj = { fontSize: thiz.p.fontSizeMonthE + "px" };
                if (FJ.isChrome) obj.textAlign = "left";
                return obj;
            })());

            this.divOut.find(".cdrj_bodyBar span,.cdrj_bodyBar td,.cdrj_body td").css({
                fontFamily: this.p.fontFamily,
                fontSize: this.p.fontSizeBody + "px"
            });
            //#endregion

            return this;
        },
        //#endregion

        //#region 显示
        show: function () {
            this._super();

            //绑定初始日期
            this.bindDate(this.p.dateInit);
            return this;
        },
        //#endregion

        //#region 构建头部
        getHeader: function () {
            var thiz = this;

            this.cdrHeader = $('<table class="cdrj_header" cellSpacing="2" ></table>');
            this.cdrHeader.css({
                width: (this.p.width - this.p.headPaddingH * 2) + "px",
                height: this.p.cdrheadHeight + "px"
            });
            if (this.p.colorParams.headerBackColor) {
                this.cdrHeader.css("background-color", this.p.colorParams.headerBackColor);
            }
            if (this.p.colorParams.headerFontColor) {
                this.cdrHeader.css("color", this.p.colorParams.headerFontColor);
            }

            var tr_t = $('<tr align="center"></tr>');

            //#region 上年按钮
            this.previousYear = $('<td class="cdrj-previousYear" title="上一年份" style="cursor:pointer;width:10px;" ></td>').on(fj.Evt.customClick, function () {
                thiz.onChangeYear(false);
            });

            var btnLeftIY = $("<div class='cdrj-head-btn" + (fj.isMobile ? "" : " fj-pc") + " icon-chevron-left fj-tap-elem'></div>").on(fj.Evt.customClick, function (e) {
                e.stopPropagation();
                thiz.onChangeYear(false);
            });
            this.previousYear.append(btnLeftIY);
            //#endregion

            //#region 上月按钮
            this.previousMonth = $('<td class="cdrj-previousMonth" title="上一月份" style="cursor:pointer;width:10px;" ></td>');
            var btnLeftI = $("<div class='cdrj-head-btn" + (fj.isMobile ? "" : " fj-pc") + " icon-chevron-left fj-tap-elem'></div>").on(fj.Evt.customClick, function (e) {
                e.stopPropagation();
                thiz.onChangeMonth(false);
            });
            this.previousMonth.append(btnLeftI);

            this.previousMonth.on(fj.Evt.customClick, function () {
                thiz.onChangeMonth(false);
            });
            //#endregion

            //#region 当前年份
            this.currentYear = $('<td class="cdrj-currentYear fj-tap-elem" style="width:90px;cursor:pointer;" >0</td>').on(fj.Evt.customClick, function () {
                thiz.showMenu(true);
            }).on("mouseout", function () {
                thiz.hideMenu();
            });
            //#endregion

            //#region 当前月份
            this.currentMonth = $('<td class="cdrj-currentMonth fj-tap-elem" style="width:70px;cursor:pointer;" >0</td>').on(fj.Evt.customClick, function () {
                thiz.showMenu(false);
            }).on("mouseout", function () {
                thiz.hideMenu();
            });

            //英文月份
            this.currentMonthE = $('<td class="currentMonthE" style="width:100px;" >September</td>');
            //#endregion

            //#region 下月按钮
            this.nextMonth = $('<td class="cdrj-nextMonth" title="下一月份" style="cursor:pointer;width:10px;" ></td>');
            var btnRightI = $("<div class='cdrj-head-btn" + (fj.isMobile ? "" : " fj-pc") + " icon-chevron-right fj-tap-elem'></div>").on(fj.Evt.customClick, function (e) {
                e.stopPropagation();
                thiz.onChangeMonth(true);
            });
            this.nextMonth.append(btnRightI);

            this.nextMonth.on(fj.Evt.customClick, function () {
                thiz.onChangeMonth(true);
            });
            //#endregion

            //#region 下年按钮
            this.nextYear = $('<td class="cdrj-nextYear" title="下一年份" style="cursor:pointer;width:10px;" ></td>').on(fj.Evt.customClick, function () {
                thiz.onChangeYear(true);
            });

            var btnRightIY = $("<div class='cdrj-head-btn" + (fj.isMobile ? "" : " fj-pc") + " icon-chevron-right fj-tap-elem'></div>").on(fj.Evt.customClick, function (e) {
                e.stopPropagation();
                thiz.onChangeYear(true);
            });
            this.nextYear.append(btnRightIY);

            //#endregion

            this.cdrHeader.append(tr_t.append(this.previousYear).append(this.currentYear).append(this.nextYear).append((function () {
                if (thiz.p.hasMonthE) {
                    return thiz.currentMonthE;
                }
                else {
                    return null;
                }
            })).append(this.previousMonth).append(this.currentMonth).append(this.nextMonth));

            if (!this.p.isShowSelectYear) {
                this.previousYear.hide();
                this.nextYear.hide();
            }

            return this.cdrHeader;
        },
        //#endregion

        //#region 构建星期栏
        getBodyBar: function () {
            this.cdrBodyBar = $('<table class="cdrj_bodyBar" cellSpacing="2" cellPadding="0"></table>');
            this.cdrBodyBar.css({
                width: (this.p.width - this.p.weekPaddingH * 2) + "px"
            });
            if (this.p.colorParams.bodyBarBackColor) {
                this.cdrBodyBar.css("background-color", this.p.colorParams.bodyBarBackColor);
            }
            if (this.p.colorParams.bodyBarFontColor) {
                this.cdrBodyBar.css("color", this.p.colorParams.bodyBarFontColor);
            }

            var tr_t = $('<tr align="center"></tr>');
            var day = ['<span class="cdrj_holiday" ' + (this.p.colorParams.bodyHolidayFontColor ? ('style="color:' + this.p.colorParams.bodyHolidayFontColor) + '"' : '') + ' >日</span>', '一', '二', '三', '四', '五', '<span class="cdrj_holiday" ' + (this.p.colorParams.bodyHolidayFontColor ? ('style="color:' + this.p.colorParams.bodyHolidayFontColor) + '"' : '') + ' >六</span>'];
            for (i = 0; i < 7; i++) {
                tr_t.append('<td >' + day[i] + '</td>');
            }
            this.cdrBodyBar.append(tr_t);

            return this.cdrBodyBar;
        },
        //#endregion

        //#region 构建主体
        getBody: function () {
            var n = 0, oTr;
            this.cdrBody = $('<table class="cdrj_body" cellSpacing="2" cellPadding="0"></table>');
            this.cdrBody.css({
                width: (this.p.width - this.p.bodyPaddingH * 2) + "px",
                height: (this.p.height - this.p.bodyShiftH) + "px",
                borderCollapse: "separate",
                borderSpacing: "2px"
            });
            if (this.p.colorParams.bodyFontColor) {
                this.cdrBody.css("color", this.p.colorParams.bodyFontColor);
            }

            this.cdrDay = [];
            for (var i = 0; i < 6; i++) {
                oTr = $('<tr align="center"></tr>');
                for (var j = 0; j < 7; j++) {
                    this.cdrDay[n] = $('<td class="cdrj_dayOut" width="13%"></td>');
                    oTr.append(this.cdrDay[n]);
                    n++;
                }
                this.cdrBody.append(oTr);
            }

            return this.cdrBody;
        },
        //#endregion

        //#region 构建主体底部
        getBodyToday: function () {
            var thiz = this;

            this.cdrBodyToday = $('<table class="cdrj_bodyBar" style="" cellSpacing="2" cellPadding="0"></table>');
            if (!this.p.isShowToday) {
                this.cdrBodyToday.hide();
            }
            var tr_t2 = $('<tr align="center" ></tr>');
            this.cdrTodayBtn = $('<td style="cursor:pointer;" >今天：' + FJ.Date.toFormatString(new Date(), "yyyy年mm月dd日") + '</td>').bind("click", function () {
                thiz.getToday();
            });
            this.cdrBodyToday.append(tr_t2.append(this.cdrTodayBtn));

            return this.cdrBodyToday;
        },
        //#endregion

        //#region 显示菜单
        showMenu: function (isyear, isHover) {
            if (this.timer) {
                clearTimeout(this.timer);
            }

            if (isyear != null) {
                var _obj = isyear ? this.currentYear : this.currentMonth;

                if (isyear) {
                    this.getYearMenu(this.date.getFullYear() - 5);
                }
                else {
                    this.getMonthMenu();
                }

                this.cdrMenu.css({
                    top: _obj[0].offsetTop + _obj[0].offsetHeight - this.p.menuShiftT,
                    left: _obj[0].offsetLeft + this.p.headPaddingH,
                    width: _obj[0].offsetWidth
                });
            }

            //是否渐变显示
            if (!isHover) {
                if (this.p.menuSpeed > 1) {
                    this.cdrMenu.stop().css({
                        opacity: 0
                    }).show().animate({
                        opacity: 0.95
                    }, this.p.menuSpeed);
                }
                else {
                    this.cdrMenu.show();
                }
            }
            else {
                this.cdrMenu.show();
            }
        },
        //#endregion

        //#region 隐藏菜单
        hideMenu: function () {
            var thiz = this;
            this.timer = window.setTimeout(function () {
                if (thiz.p.menuSpeed > 1) {
                    thiz.cdrMenu.stop().animate({
                        opacity: 0
                    }, thiz.p.menuSpeed, function () {
                        thiz.cdrMenu.hide();
                    });
                }
                else {
                    thiz.cdrMenu.hide();
                }
            }, 500);
        },
        //#endregion

        //#region 构建年菜单
        getYearMenu: function (year) {
            var thiz = this;

            this.yearMenu = $('<table cellSpacing="0" class="cdrj_Menu" cellPadding="0"></table>');
            var str = '', oTr, oTd;
            for (var i = 1; i <= 10; i++) {
                var _year = year + i;
                var _date = new Date(_year, this.date.getMonth(), this.date.getDate());

                oTr = $('<tr align="center" ></tr>');
                str = '<td ';
                if (this.date.getFullYear() != _year) {
                    str += 'onmouseover="this.className=\'cdrj_menuOver\'" onmouseout="this.className=\'\'" ';
                }
                else {
                    str += 'class="cdrj_menuOver"';
                }
                str += '>' + _year + '年</td>';
                oTd = $(str);
                (function (date) {
                    oTd.bind("click", function () {
                        thiz.bindDate(FJ.Date.toFormatString(date, "-"));
                    });
                })(_date);
                this.yearMenu.append(oTr.append(oTd));
            }

            //#region 增加、减少年数按钮
            var tr_t1 = $('<tr align="center"></tr>');
            var td_t1 = $('<td></td>');
            var tab_t2 = $('<table style="font-size:12px;width:100%;" cellSpacing="0" cellPadding="0"></table>');
            var tr_t2 = $('<tr class="cdrj-year-menu-nav"></tr>');
            this.btnSubYear = $('<td style="height:20px;" onmouseover="this.className=\'cdrj_menuOver\'" onmouseout="this.className=\'\'" ><i class="icon-double-angle-left"></i></td>').bind("click", function () {
                thiz.getYearMenu(year - 10);
            });
            this.btnAddYear = $('<td onmouseover="this.className=\'cdrj_menuOver\'" onmouseout="this.className=\'\'" ><i class="icon-double-angle-right"></i></td>').bind("click", function () {
                thiz.getYearMenu(year + 10);
            });
            //#endregion

            this.yearMenu.append(tr_t1.append(td_t1.append(tab_t2.append(tr_t2.append(this.btnSubYear).append(this.btnAddYear)))));
            this.cdrMenu.html(this.yearMenu);
        },
        //#endregion

        //#region 构建月菜单
        getMonthMenu: function () {
            var thiz = this;

            this.monthMenu = $('<table cellSpacing="0" class="cdrj_Menu" cellPadding="0"></table>');
            var str = '', oTr, oTd;
            for (var i = 1; i <= 12; i++) {
                var _day = this.date.getDate();
                //如果月份为2月,设定日期不超过28号
                if (i == 2) {
                    _day = 28;
                }
                var _date = new Date(this.date.getFullYear(), i - 1, _day);

                oTr = $('<tr align="center"></tr>');
                str = '<td ';
                if (this.date.getMonth() + 1 != i) {
                    str += 'onmouseover="this.className=\'cdrj_menuOver\'" onmouseout="this.className=\'\'" ';
                }
                else {
                    str += 'class="cdrj_menuOver"';
                }
                str += '>' + i + '月</td>';
                oTd = $(str);
                (function (date) {
                    oTd.bind("click", function () {
                        thiz.bindDate(FJ.Date.toFormatString(date, "-"));
                    });
                })(_date);
                this.monthMenu.append(oTr.append(oTd));
            }

            this.cdrMenu.html(this.monthMenu);
        },
        //#endregion

        //#region 年改变事件
        onChangeYear: function (isnext) {
            var _year = this.date.getFullYear();
            var _month = this.date.getMonth() + 1;
            var _date = this.date.getDate();

            if (_year > 999 && _year < 10000) {
                if (isnext) {
                    _year++;
                }
                else {
                    _year--;
                }
            }
            else {
                alert("年份超出范围（1000-9999）!");
            }
            this.bindDate(_year + '-' + _month + '-' + _date);
        },
        //#endregion

        //#region 月改变事件
        onChangeMonth: function (isnext) {
            var _year = this.date.getFullYear();
            var _month = this.date.getMonth() + 1;
            var _date = this.date.getDate();

            if (isnext) {
                _month++;
            }
            else {
                _month--;
            }

            if (_year > 999 && _year < 10000) {
                if (_month < 1) {
                    _month = 12;
                    _year--;
                }
                if (_month > 12) {
                    _month = 1;
                    _year++;
                }
            }
            else {
                alert("年份超出范围（1000-9999）!");
            }

            //如果月份为2月,设定日期不超过28号
            if (_month == 2) {
                _date = 28;
            }

            this.bindDate(_year + '-' + _month + '-' + _date);
        },
        //#endregion

        //#region 绑定日期数据
        bindDate: function (date) {
            var thiz = this;
            this.dateM = date;  //记录当前月份日期

            //获取日期颜色事件
            this.fire("getDayColor", { date: date });

            var _monthDays = [31, 30, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            var _arr = date.replace(/[^\d]/ig, '-').replace(/^\-|\-$/ig, '').split('-');
            //alert(date.replace(/[^\d]/ig,'-').replace(/^\-|\-$/ig,''));
            var _date = new Date(_arr[0], _arr[1] - 1, _arr[2]);
            if (isNaN(_date))
                _date = new Date();
            this.date = _date;
            this.bindHeader();

            var _year = _date.getFullYear();
            var _month = _date.getMonth();
            var _day = 1;
            var today = new Date();  //今天日期
            var monthC = today.getMonth();
            var yearC = today.getFullYear();

            var _startDay = new Date(_year, _month, 1).getDay();
            var _previYear = _month == 0 ? _year - 1 : _year;
            var _previMonth = _month == 0 ? 11 : _month - 1;
            var _previDay = _monthDays[_previMonth];
            if (_previMonth == 1)
                _previDay = ((_previYear % 4 == 0) && (_previYear % 100 != 0) || (_previYear % 400 == 0)) ? 29 : 28;
            _previDay -= _startDay - 1;
            var _nextDay = 1;

            _monthDays[1] = ((_year % 4 == 0) && (_year % 100 != 0) || (_year % 400 == 0)) ? 29 : 28;

            for (i = 0; i < 42; i++) {
                var _dayElement = this.cdrDay[i],
                    dayBg = null;

                //去除颜色
                _dayElement.css({
                    //border: "0",
                    backgroundColor: "transparent"
                }).removeClass("hasColor_" + this.objId + " cdrj_currentDay").attr("date", "");

                _dayElement.unbind("mouseover").bind("mouseover", function () {
                    thiz.onMouseOver(this);
                }).unbind("mouseout").bind("mouseout", function () {
                    thiz.onMouseOut(this);
                });

                this.onMouseOut(_dayElement[0]);
                _dayElement.css("color", "");

                if (i < _startDay) {
                    //获取上一个月的日期
                    if (this.p.showMoreDay) {
                        var _previDate = new Date(_year, _month - 1, _previDay);
                        dayBg = $("<div class='cdrj-day-bg fj-tap-elem'>" + _previDay + "</div>");
                        _dayElement.html(dayBg).removeClass("cdrj_normalDay cdrj_normalDayN cdrj_normalDayS");
                        if (this.p.hasDayTitle) {
                            _dayElement.attr("title", FJ.Date.toFormatString(_previDate, "yyyy年mm月dd日"));
                        }
                        var dateF = FJ.Date.toFormatString(_previDate, this.p.dateFormat);
                        _dayElement.attr("value", dateF);
                        _dayElement.addClass("cdrj_moreDay");
                        if (this.p.colorParams.moreDayColor) {
                            _dayElement.css("color", this.p.colorParams.moreDayColor);
                        }

                        this.setDayColor(_previDate, _dayElement, _previDay);  //设置日期颜色
                        if (dateF == this.dateSelect) {  //设置日期选中
                            this.setDaySelect(dateF, _dayElement);
                        }

                        _previDay++;
                    }
                    else {
                        _dayElement.html("");
                        _dayElement.attr("title", "");
                    }
                }
                else {
                    if (_day > _monthDays[_month]) {
                        //获取下个月的日期
                        if (this.p.showMoreDay) {
                            var _nextDate = new Date(_year, _month + 1, _nextDay);
                            dayBg = $("<div class='cdrj-day-bg fj-tap-elem'>" + _nextDay + "</div>");
                            _dayElement.html(dayBg).removeClass("cdrj_normalDay cdrj_normalDayN cdrj_normalDayS");
                            if (this.p.hasDayTitle) {
                                _dayElement.attr("title", FJ.Date.toFormatString(_nextDate, "yyyy年mm月dd日"));
                            }
                            var dateF = FJ.Date.toFormatString(_nextDate, this.p.dateFormat);
                            _dayElement.attr("value", dateF);
                            _dayElement.addClass("cdrj_moreDay");
                            if (this.p.colorParams.moreDayColor) {
                                _dayElement.css("color", this.p.colorParams.moreDayColor);
                            }

                            //设置日期颜色
                            this.setDayColor(_nextDate, _dayElement, _nextDay);
                            if (dateF == this.dateSelect) {  //设置日期选中
                                this.setDaySelect(dateF, _dayElement);
                            }

                            _nextDay++;
                        }
                        else {
                            _dayElement.html("");
                            _dayElement.attr("title", "");
                        }
                    }
                    else {
                        if (i >= new Date(_year, _month, 1).getDay() && _day <= _monthDays[_month]) {
                            //获取本月日期,并移除上、下月的特殊颜色
                            dayBg = $("<div class='cdrj-day-bg fj-tap-elem'>" + _day + "</div>");
                            _dayElement.html(dayBg).removeClass("cdrj_moreDay cdrj_normalDayN cdrj_normalDayS");

                            var cdInfo = "";
                            if (_day == new Date().getDate()) {
                                //this.onMouseOver(_dayElement[0]);
                                //_dayElement.unbind("mouseover mouseout");
                                if (_month == monthC && _year == yearC) {  //今天设置特殊颜色
                                    _dayElement.addClass("cdrj_currentDay");
                                    cdInfo = "今天:";
                                }
                            }
                            else {
                                _dayElement.removeClass("cdrj_currentDay");
                            }

                            if (this.isHoliday(_year, _month, _day)) {
                                if (this.p.colorParams.bodyHolidayFontColor) {
                                    _dayElement.css("color", this.p.colorParams.bodyHolidayFontColor);
                                }
                                else {
                                    _dayElement.addClass("cdrj_holiday");
                                }
                            }
                            var _curDate = new Date(_year, _month, _day);
                            if (this.p.hasDayTitle) {
                                _dayElement.attr("title", cdInfo + FJ.Date.toFormatString(_curDate, "yyyy年mm月dd日"));
                            }
                            var dateF = FJ.Date.toFormatString(_curDate, this.p.dateFormat);
                            _dayElement.attr("value", dateF);
                            _dayElement.addClass("cdrj_normalDay");

                            //设置日期颜色
                            this.setDayColor(this.date, _dayElement, _day);
                            if (dateF == this.dateSelect) {  //设置日期选中
                                this.setDaySelect(dateF, _dayElement);
                            }

                            _day++;
                        }
                        else {
                            _dayElement.html("");
                            _dayElement.attr("title", "");
                        }
                    }
                }

                //绑定点击日期事件
                if (dayBg) {
                    dayBg.on(fj.Evt.customClick, function () {
                        thiz.onClick(this);
                    });
                }
            }

            this.cdrMenu.hide();

            //清空日期颜色集合
            this.p.dayColor = [];

            //绑定日期完成事件
            this.fire("afterBindDate", { date: date });
        },
        //#endregion

        //#region 绑定头部数据
        bindHeader: function () {
            this.currentYear.text(FJ.Date.toFormatString(this.date, "yyyy年"));
            var month = FJ.Date.toFormatString(this.date, "mm", true);
            this.currentMonth.text(month + "月");
            this.cdrWmYear.text(this.date.getFullYear());

            if (this.p.hasMonthE) {
                //设置英文月份
                switch (month) {
                    case "1":
                        this.currentMonthE.text("January");
                        break;
                    case "2":
                        this.currentMonthE.text("February");
                        break;
                    case "3":
                        this.currentMonthE.text("March");
                        break;
                    case "4":
                        this.currentMonthE.text("April");
                        break;
                    case "5":
                        this.currentMonthE.text("May");
                        break;
                    case "6":
                        this.currentMonthE.text("June");
                        break;
                    case "7":
                        this.currentMonthE.text("July");
                        break;
                    case "8":
                        this.currentMonthE.text("August");
                        break;
                    case "9":
                        this.currentMonthE.text("September");
                        break;
                    case "10":
                        this.currentMonthE.text("October");
                        break;
                    case "11":
                        this.currentMonthE.text("November");
                        break;
                    case "12":
                        this.currentMonthE.text("December");
                        break;
                }
            }
        },
        //#endregion

        //#region 点击日期事件
        onClick: function (obj, useTd) {
            if (obj.innerHTML != "") {
                if (this.p.isShowTimePicker) {
                    this.timeInput.blur();
                }

                //验证选中的日期是否合法
                var oTd = useTd ? $(obj) : $(obj).parent(),
                    date = oTd.attr("value"),
                    hasColor = oTd.hasClass("hasColor_" + this.objId),
                    inRange = true,
                    dr = this.p.dateRange,
                    endGtStart = true;
                this.gtLimit = false;  //是否超过极限选择天数范围

                if (dr) {
                    if ((dr[0] != null && fj.Date.dateDiff(date, fj.Date.parse(dr[0])) < 0) || (dr[1] != null && fj.Date.dateDiff(date, fj.Date.parse(dr[1])) > 0)) {
                        inRange = false;
                    }
                }
                if (this.p.verifyGt) {  //验证结束日期是否大于开始日期
                    var type = this.ttj.currentObj.attr("dpjType"),
                        start, end;
                    if (type == "start") {
                        start = date;
                        end = this.endElem.val();
                    }
                    else if (type == "end") {
                        start = this.startElem.val();
                        end = date;
                    }

                    if (fj.RX.datetimeO(start) && fj.RX.datetimeO(end)) {  //如果日期格式为空或不合法则默认通过验证
                        endGtStart = (end >= start);
                        if (endGtStart && this.p.limitDays) {  //验证结束日期和开始日期之间天数不能大于极限值
                            var lDays = fj.Date.dateDiff(end, start);
                            if (lDays > this.p.limitDays) {
                                this.gtLimit = true;
                            }
                        }
                    }
                    //                    else {
                    //                        endGtStart = false;
                    //                    }
                }

                this.setDaySelect(date);
                this.fire("clickDay", { date: date, time: this.time, inRange: inRange, hasColor: hasColor, dayElement: oTd, endGtStart: endGtStart, gtLimit: this.gtLimit });
            }
        },
        //#endregion

        //#region 选择日期
        selectDate: function (date, isGetTd) {
            for (var i = 0, l = this.cdrDay.length; i < l; i++) {
                var oTd = this.cdrDay[i];
                if (date == oTd.attr("value")) {
                    if (isGetTd) {
                        return oTd;
                    }
                    this.onClick(oTd[0], true);
                    break;
                }
            }
        },
        //#endregion

        //#region 更新绘图控件主题
        changeDrawTheme: function (isInit) {
            //            if (fj.isIEno9) {
            //                this.vmlBtnL = '<v:shape class="cj_vml" type="#cjArrowLeft" strokecolor="' + fj.theme.configCdrj.btnStroke + '" style="width:11px;height:21px;" ><v:fill class="cj_vml" type="gradient" color="' + fj.theme.configCdrj.btnColor1 + '" color2="' + fj.theme.configCdrj.btnColor2 + '" /></v:shape>';
            //                this.vmlBtnR = '<v:shape class="cj_vml" type="#cjArrowRight" strokecolor="' + fj.theme.configCdrj.btnStroke + '" style="width:11px;height:21px;" ><v:fill class="cj_vml" type="gradient" color="' + fj.theme.configCdrj.btnColor1 + '" color2="' + fj.theme.configCdrj.btnColor2 + '" /></v:shape>';
            //                if (!isInit) {
            //                    this.previousMonth[0].innerHTML = this.vmlBtnL;
            //                    this.nextMonth[0].innerHTML = this.vmlBtnR;
            //                }
            //            }
        },
        //#endregion

        //#region 刷新日期
        refresh: function (date) {
            this.bindDate(date != null ? date : fj.Date.toFormatString(this.date, "-"));
        },
        //#endregion

        //#region 设置日期颜色集合
        setDayColor: function (date, dayElement, day) {
            for (var j = 0; j < this.p.dayColor.length; j++) {
                var dayT = this.p.dayColor[j];
                if (dayT.date == fj.Date.toFormatString(date, "yyyy-mm-") + fj.Math.addZero(day)) {
                    if (dayT.borderColor) {  //边框颜色
                        dayElement.css("border-color", dayT.borderColor);
                    }
                    dayElement.css({
                        //border: "1px solid " + (dayT.borderColor ? dayT.borderColor : this.p.colorParams.borderDay),
                        backgroundColor: dayT.color,
                        color: dayT.fontColor
                    }).addClass("hasColor_" + this.objId).addClass("cdrj_normalDayN");
                    for (var o in dayT) {
                        dayElement.attr(o, dayT[o]);
                    }
                    break;
                }
            }
        },
        //#endregion

        //#region 设置日期为选中状态
        setDaySelect: function (date, dayElement) {
            this.dateSelect = date;
            this.cdrBody.find("td").removeClass("cdrj_normalDayS");
            if (!dayElement) {
                dayElement = this.selectDate(date, true);
            }
            dayElement.addClass("cdrj_normalDayS");
        },
        //#endregion

        //#region 通用方法
        getToday: function () {
            var _date = new Date();
            this.bindDate(FJ.Date.toFormatString(_date, "-"));
        },

        isHoliday: function (year, month, date) {
            var _date = new Date(year, month, date);
            return (_date.getDay() == 6 || _date.getDay() == 0);
        },

        onMouseOver: function (obj) {
            $(obj).addClass("cdrj_normalDayH");
            //obj.className = "cdrj_dayOver";
        },

        onMouseOut: function (obj) {
            $(obj).removeClass("cdrj_normalDayH");
            //obj.className = "cdrj_dayOut";
        }
        //#endregion
    });

    //#region 静态调用方法
    FJ.CDRJ.show = function (settings) {
        return new FJ.CDRJ(FJ.oBody, settings).show();
    };
    //#endregion

    //#region 绑定到jquery
    $.fn.extend({
        CalendarJ: function (settings) {
            if (this && this.length > 0) {
                return new FJ.CalendarJ(this, fj.CDRJ_commonConfig ? $.extend(true, fj.clone(fj.CDRJ_commonConfig), settings) : settings);
            }
        },
        CDRJ: function (settings) {
            return $(this).CalendarJ(settings);
        }
    });
    //#endregion

    //#region 图片文件夹路径
    FJ.CDRJ.imgFolderSrc = FJ.imgPath + "Calendar/";
    //#endregion

    /************************************************************
    *-----------------------------------------------------------*
    *                       弹出日历控件
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.DatePickerJ = this.DPJ = FJ.DatePickerJ = FJ.DPJ = FJ.CalendarJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            var thiz = this;

            //浮动层
            this.ttj = $(elemObj).TTJ($.extend(true, {
                borderWidth: 0,
                width: 360,                           //最大宽度
                height: 270,                          //最大高度
                hoverDirect: "bottom",
                shiftLeft: 10,
                shiftTop: 20,
                loadType: "html",
                hoverType: "click",
                hasShadow: true,
                onlyFirstLoad: true,
                isAsync: false,
                loadSpeed: 1,
                speed: 1,
                showSpeed: FJ.isIElt9 ? 1 : 100,
                isRenderHF: false,
                tranOrigin: "50% 0%",
                tranScaleShow: "scale(0.5, 0.5)",
                tranScaleClose: "scale(0.7, 0.7)",
                loadHTML: function () {
                    thiz.divOut.show();
                    return thiz.divOut;
                },
                colorParams: {                             //颜色参数
                    bgColorBody: "#e6e6e6",
                    bgColor: "transparent"
                },
                overflow: "hidden",
                radius: 5,
                closeCheckScroll: fj.isMobile ? true : false,  //移动端全局点击关闭层时需要判断body滚动条是否改变
                responsive: true,
                responsiveParam: {  //响应式配置
                    "(min-width: 641px)|DPJ": {
                        preHandler: function (isInit) {
                            if(!isInit) {
                                this.setVisible(false);
                            }
                        },
                        params: {
                            //hasDivGray: false,
                            zIndex: 600,
                            //showRendorBody: false,
                            onlyShiftPos: false,
                            isFixScroll: false,
                            tranOrigin: "50% 0%"
                        },
                        handler: function () {
                            var pa = this.p;
                            if(pa.shiftLeftI != null) {
                                pa.shiftLeft = pa.shiftLeftI;
                            }
                            if(pa.shiftTopI != null) {
                                pa.shiftTop = pa.shiftTopI;
                            }

                            fj.lazyDo(function() {
                                pa.hasDivGray = false;
                                pa.showRendorBody = false;
                            }, 300);
                        }
                    },
                    "(max-width: 640px)|DPJ": {
                        preHandler: function (isInit) {
                            if(!isInit) {
                                this.setVisible(false);
                            }
                        },
                        params: {
                            hasDivGray: true,  //小屏时开启遮罩层
                            zIndex: 100001,
                            showRendorBody: true,
                            onlyShiftPos: true,
                            isFixScroll: true,
                            tranOrigin: "50% 50%"
                        },
                        handler: function () {
                            var pa = this.p;
                            if(pa.shiftLeftI == null) {
                                pa.shiftLeftI = pa.shiftLeft;
                            }
                            if(pa.shiftTopI == null) {
                                pa.shiftTopI = pa.shiftTop;
                            }

                            pa.shiftLeft = fj.pageWidth() / 2.0 - pa.width / 2.0;
                            pa.shiftTop = fj.pageHeight() / 2.0 - pa.height / 2.0;
                            if(pa.shiftTop < 20) {
                                pa.shiftTop = 20;
                            }
                        }
                    }
                },
                evts: {
                    afterBodyLoad: function (e, p) {
                        if (this.p.hasShadow && !FJ.isIElt9) {  //设置阴影
                            this.divOut.css("background-color", "#e6e6e6");
                        }

                        //设置时间选择器位置居中
                        if (thiz.p.isShowTimePicker) {
                            thiz.timePicker.css("left", thiz.divOut.width() / 2 - thiz.timePicker.width() / 2);
                        }
                    },
                    afterBodyLoad2: function (e, p) {
                        if (!(thiz.p.autoDate || thiz.p.isShowTimePicker)) {
                            return;
                        }
                        var v = this.currentObj.val();

                        if (thiz.p.autoDate) {  //自动设置控件日期
                            var vM = thiz.dateM,
                                vS = thiz.dateSelect;

                            if (fj.RX.datetimeO(v)) {
                                var vD = v.split(" ")[0];  //截取日期部分
                                if (thiz.p.inSameMonth(vD, vM)) {  //如果文本框日期和当前月份日期在同一月份则执行选中日期
                                    if (vD != vS) {  //如果相等则不设置
                                        thiz.setDaySelect(vD);
                                    }
                                }
                                else {  //如果不在同一月份则重绑定日期
                                    thiz.dateSelect = vD;
                                    thiz.bindDate(vD);
                                }
                            }
                        }
                        if (thiz.p.isShowTimePicker) {  //自动设置控件时间
                            thiz.currentInput = this.currentObj;  //记录当前文本框对象
                            if (FJ.RX.datetime(v)) {
                                thiz.time = v.split(" ")[1];
                                thiz.timeInput.val(thiz.time);
                            }
                            else {
                                var type = this.currentObj.attr("dpjType"),
                                    time = fj.Date.toFormatString(new Date(), "hh:MM:ss");
                                if (type) {  //设置默认起始、结束时间值
                                    if (type == "start") {
                                        thiz.time = thiz.p.isTimeInit ? time : "00:00:00";
                                    }
                                    else if (type == "end") {
                                        thiz.time = "23:59:59";
                                    }
                                }
                                else {
                                    if (thiz.p.isTimeInit) {
                                        thiz.time = time;
                                    }
                                }
                                thiz.timeInput.val(thiz.time);
                            }
                        }
                    },
                    onMouseleave: function () {
                        if (FJ.isIE7) {  //解决隐藏后再显示菜单不消失
                            thiz.cdrMenu.hide();
                        }
                    }
                }
            }, settings));

            var shiftH = 0;
            if (FJ.isWebkit) {
                shiftH = 4;
            }

            //设置日历尺寸
            settings.width = this.ttj.p.width - 2;
            settings.height = this.ttj.p.height - 2 + shiftH;

            //执行基类构造方法
            this._super(FJ.oBody, $.extend(true, {
                fjType: "DPJ",
                canDrag: true,
                menuSpeed: FJ.isIElt9 ? 1 : 100,
                closeBySelect: true,
                menuShiftT: 10,
                autoDate: false,     //弹出时是否自动设置日期
                verifyGt: false,     //验证结束日期是否大于开始日期
                limitDays: null,     //开始、结束日期之间的最大天数
                evts: {
                    clickDay: function (e, p) {
                        var date = p.date;
                        if (p.time) {
                            date += " " + p.time;
                        }

                        //验证日期合法性
                        if (p.inRange && p.endGtStart && (this.ttj.currentObj.attr("type") == "text" || this.ttj.currentObj[0].tagName.toLowerCase() == "textarea")) {
                            this.ttj.currentObj.val(date).blur();
                        }
                        if (this.p.closeBySelect) {
                            this.ttj.closeByFocus = true;
                            //elemObj.val(p.date);
                            //点击后关闭
                            this.ttj.p.hoverSpeed = 0;
                            this.ttj.close();
                            p.dayElement.trigger("mouseleave");  //执行失去焦点,否则有的浏览器下hover效果仍存在
                            this.ttj.p.hoverSpeed = 777;

                            //移动端触发输入文本框失去焦点
                            if (fj.isMobile) {
                                this.ttj.currentObj.blur();
                            }
                        }

                        //点击日期事件
                        this.fire("clickDayP", { date: p.date, time: p.time, inRange: p.inRange, endGtStart: p.endGtStart, gtLimit: p.gtLimit });

                        if (fj.isIElt8) {  //解决隐藏后再显示菜单不消失
                            this.cdrMenu.hide();
                        }
                    }
                }
            }, settings));

            //设置拖动
            if (this.p.canDrag) {
                this.drj = $(this.cdrBodyOut).DRJ({
                    oRoot: this.ttj.divOut,
                    drjCls: "dpj-drj"
                });
            }

            //只读
            if (this.p.readOnly) {
                this.ttj.p.obj.attr("readonly", true);
            }

            //内容页不显示滚动条
            this.ttj.bodyIn.css({
                overflowX: "hidden",
                overflowY: "hidden"
            });

            //保存开始、结束日期文本框
            if (this.p.verifyGt) {
                elemObj.each(function () {
                    var o = $(this),
                        dType = o.attr("dpjType");
                    if (dType == "start") {
                        thiz.startElem = o;
                    }
                    else if (dType == "end") {
                        thiz.endElem = o;
                    }
                });
            }

            this.divOut.hide();

            return this;
        },
        //#endregion

        //#region 删除
        remove: function () {
            this.ttj.remove();
            this._super();
        }
        //#endregion
    });

    //#region 绑定到jquery
    $.fn.extend({
        DatePickerJ: function (settings) {
            if (this && this.length > 0) {
                return new DatePickerJ(this, fj.DPJ_commonConfig ? $.extend(true, fj.clone(fj.DPJ_commonConfig), settings) : settings);
            }
        },
        DPJ: function (settings) {
            return $(this).DatePickerJ(settings);
        }
    });
    //#endregion
});