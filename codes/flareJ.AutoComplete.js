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
* last update:2016-4-21
***********************************************************/

/*----------------------------------------------*
* flareJ.AutoComplete
*-------*-------*-------*-------*-------*-------*
* 自动提示控件
*-------*-------*-------*-------*-------*-------*
* [依赖]flareJ.Tooltip
*----------------------------------------------*/
FJ.define("widget.AutoComplete", ["widget.Tooltip"], function() {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                       自动提示控件
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.AutoCompleteJ = this.ACJ = FJ.AutoCompleteJ = FJ.ACJ = FJ.CJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            var thiz = this;
            this.widthE = elemObj.width();  //文本框宽度

            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "ACJ",
                renderTo: "body",
                width: "auto",
                height: "auto",
                shiftWidth: 4,                             //选项列表宽度补正值
                shiftTop: elemObj.height(),
                borderWidth: 0,
                inputPName: "txtValue",
                delaySpeed: 300,                           //执行每次查询的延迟时间
                showSpeed: 10,                             //显示延迟时间
                maxHeight: 200,                            //最大高度
                loadMode: "remote",                        /*------获取数据方式-------*
                                                            * remote: 远程
                                                            * local: 本地
                                                            *-----*-----*-----*-----*/
                data: [],                                  //本地数据集
                dataLimit: 100,                            //数据最大值,超过则不显示
                showAllData: true,                         //使用本地数据集时,输入空值显示全部数据
                showOnFocus: true,                         //文本框获取焦点时展示数据
                onlyShowAllData: false,                    //使用本地数据集时,只显示所有数据
                isOnlySelect: false,                       //只能选择列表中数据,不可直接输入
                initLoadData: false,                       //是否首次点击加载数据
                textField: "text",                         //数据文本字段
                valueField: "value",                       //数据值字段
                actualTextField: "data-acj-text",          //文本框标签文本属性
                actualValueField: "data-acj-value",        //文本框标签值属性
                textRule: "{0}",                           //文本显示规则
                defaultText: null,                         //默认文本
                defaultValue: null,                        //默认值
                itemAlign: null,                           //列表项对齐方式
                autoTurn: false,
                scrollViewShift: 0,                        //滚动到可视区域偏移值
                colorParams: {
                    //                    text: "#1A6EC7",                       //字体颜色
                    //                    bgColor: "#fff"                        //背景色
                },
                evts: {
                    customUpdate: null                     //自定义更新列表
                }
            }, settings));

            this.input = elemObj;
            this.input.attr("autocomplete", "off");  //关闭文本框默认的提示
            this.input.addClass("acj_input");

            this.initFn();

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            var thiz = this;
            this._super();

            //是否首次加载
            this.isFirstLoad = true;

            //是否鼠标移上选中
            this.canHover = true;

            //是否自定义更新列表
            this.customUpdate = this.p.evts.customUpdate != null;

            this.create();
            this.bindKeyUp();

            //设置文本框默认值
            this.resetValue();

            //是否需要使文本框滚动到可视区域
            this.needScrollView = fj.isMobile && !this.p.autoTurn;

            //            //解决IE下连续执行两次focus的bug
            //            this.fixIeFocus = false;

            if (!this.customUpdate) {
                //文本框内容为空获取焦点时,展示全部数据(仅限本地数据集)
                if (this.p.showOnFocus) {
                    this.input.on("focus", function (e) {
                        if (!thiz.focusOnScroll) {  //非滚动条移动后触发才执行初始化
                            //                        if(!thiz.fixIeFocus) {  //因IE下会连续触发两次focus事件所以跳过第2次
                            if (thiz.p.loadMode === "local") {
                                if (!thiz.p.initLoadData || thiz.initLoaded) {
                                    thiz.afterInput(true);
                                }
                                else {  //首次点击加载数据
                                    thiz.acjUl.html("<li></li>");
                                    thiz.display(1);
                                    thiz.fire("initLoadData");
                                }
                            }
                            else {
                                if (thiz.p.data && thiz.p.data.length > 0) {
                                    thiz.display(1);
                                }
                            }
                            //                        }

                            //                        //第一次执行完后将IE焦点标记复原
                            //                        thiz.fixIeFocus = false;
                        }
                        //                    else {
                        //                        if(fj.isIE) {  //IE下滚动条移动后需标记连续的下一次触发时不执行
                        //                            thiz.fixIeFocus = true;
                        //                        }
                        //                    }

                        //执行完将滚动条移动后标记复原
                        thiz.focusOnScroll = false;
                    });
                }
            }
            else {
                //使用自定义更新列表时首次加载数据
                if (this.p.initLoadData) {
                    this.initLoadComplete(this.p.data);
                }

                //移动端使文本框滚动到可视区域
                if (this.needScrollView) {
                    this.input.on("focus", function () {
                        thiz.scrollView();
                    }).on("blur", function () {
                        fj.body.scrollTop = 0;
                    });
                }
            }
        },
        //#endregion

        //#region 构建
        create: function () {
            this._super();
            var thiz = this,
                customUpdate = this.customUpdate,
                width = this.p.width;

            //外层
            this.divOut.addClass("acj").attr("id", "ACJ_" + this.objId);

            //提示层宽度
            if (width != null && width !== "auto") {
                this.widthE = width;
            }

            //选项列表容器
            this.acjUl = $("<ul></ul>").addClass("acj_ul");
            this.divOut.append(this.acjUl);

            //提示浮动层
            if (!customUpdate) {
                this.ttj = $(this.input).TTJ({
                    renderTo: this.p.renderTo,
                    showRendorBody: this.p.renderTo == "body" ? false : true,
                    imgLoadSrc: LMJ.loadImgSrc(10),
                    showLoading: thiz.p.initLoadData ? false : true,  //首次点击加载默认不可显示loading
                    borderWidth: 1,
                    width: this.widthE + this.p.shiftWidth,
                    height: "auto",
                    hoverDirect: "bottom",
                    shiftLeft: -1,
                    shiftTop: this.p.shiftTop - 3,
                    hoverType: "click",
                    hasShadow: true,
                    onlyFirstLoad: true,
                    loadSpeed: 1,
                    speed: 1,
                    showSpeed: this.p.showSpeed,
                    isAcjClick: true,
                    isRenderHF: false,
                    autoTurn: this.p.autoTurn,
                    zIndex: this.p.zIndex,
                    closeCheckScroll: true,
                    fnHtml: function (param) {
                        this.currentObj = thiz.input;  //记录当前目标元素
                        this.bodyIn.css({
                            overflowY: "auto",
                            overflowX: "hidden"
                        }).on("scroll", function () {
                            fj.lazyDo(function () {
                                this.focusOnScroll = true;  //滚动条移动后触发文本框焦点标记(因jquery1.10以上版本无法在trigger方法中传递自定义参数，故改为建立变量做标记)
                                this.input.trigger("focus");  //滚动条移动后,焦点要回到文本框上
                            }, 50, "acj_inputFocus", thiz);
                        });

                        this.divOut.addClass("acj_ttj");
                        thiz.divOut.show();
                        return thiz.divOut;
                    },
                    colorParams: {
                        bgColorBody: "transparent"
                    },
                    evts: {
                        afterBodyLoad2: function (e, p) {
                            if (thiz.isFirstLoad) {
                                thiz.isFirstLoad = false;
                                thiz.countHeight();
                                thiz.countPosition(this);
                            }

                            if (thiz.p.loadMode == "local" && thiz.p.initLoadData && !thiz.initLoaded) {  //首次点击加载显示loading
                                this.p.showLoading = true;
                                thiz.showLoading(true);
                            }

                            //移动端使文本框滚动到可视区域
                            if (thiz.needScrollView) {
                                fj.lazyDo(function () {
                                    thiz.scrollView();
                                }, 300);
                            }
                        },
                        afterShowFn: function (e, p) {
                            if (!thiz.isFirstLoad) {
                                thiz.countHeight();
                                thiz.countPosition(this);
                            }
                        },
                        afterCloseClick: function (e, p) {
                            if (thiz.p.loadMode == "local" && thiz.p.isOnlySelect && thiz.runCloseClick) {
                                thiz.runCloseClick = false;
                                if ($.trim(thiz.input.val()) != "") {  //如果没有选中列表中数据，则文本框"失去焦点"时恢复为已选中的值
                                    thiz.input.val(thiz.input.attr(thiz.p.actualTextField));
                                }
                                else {  //如果文本被清空，则恢复默认值
                                    thiz.resetValue();
                                }
                            }
                        },
                        afterClose: function () {
                            if (thiz.needScrollView) {
                                fj.body.scrollTop = 0;
                            }
                        }
                    }
                });
            }

            return this;
        },
        //#endregion

        //#region 显示
        show: function () {
            var offSet = this.input.offset();
            this.divOut.css({
                width: this.input.width() + this.p.shiftWidth,
                left: offSet.left,
                top: offSet.top + this.input.height() + this.p.shiftTop
            });
            this.divOut.show();
        },
        //#endregion

        //#region 绑定键盘事件
        bindKeyUp: function () {
            var thiz = this;
            this.input.on(fj.isMobile ? "input" : "keyup", function (e) {
                thiz.KeyUpFn(e);
            });
        },
        //#endregion

        //#region 键盘事件方法
        KeyUpFn: function (e) {
            var thiz = this,
                customUpdate = this.customUpdate;

            switch (FJ.Evt.fix(e).key) {
                case 13:  //回车
                    if (!customUpdate) {
                        var oSi = this.acjUl.find("li.acj_selectedItem");
                        if (oSi.length > 0) {
                            oSi.trigger("click");
                        }
                    }
                    break;
                case 27:  //ESC
                    if (!customUpdate) {
                        this.display(0);
                        this.runCloseClick = true;
                    }
                    break;
                case 38:  //上方向键
                    if (!customUpdate && !this.divOut.is(":hidden")) {
                        var oLi = this.acjUl.find("li");
                        var oLiM = this.acjUl.find("li.acj_selectedItem");
                        if (oLiM.length > 0) {
                            var oPrev = oLiM.removeClass("acj_selectedItem").prev();
                            oPrev.addClass("acj_selectedItem");

                            if (oPrev.length > 0) {  //超过显示区域自动滚动滚动条
                                var top = oPrev.position().top + this.ttj.bodyIn.scrollTop();
                                if (top < this.ttj.divOut.height() + this.ttj.bodyIn.scrollTop() - 20) {
                                    this.ttj.bodyIn.scrollTop(top);
                                }
                            }
                        }
                        else {
                            oLi.eq(oLi.length - 1).addClass("acj_selectedItem");
                            this.ttj.bodyIn.scrollTop(this.ttj.bodyIn[0].scrollHeight);
                        }
                        //this.input.val(this.acjUl.find("li.acj_selectedItem").text());
                        if (fj.isFF || fj.isWebkit) {  //解决点击上方向键时文本框光标回到最前面
                            this.input.textPositionJ(this.input.val().length);
                        }
                        this.canHover = false;  //禁止鼠标移上选中
                    }
                    break;
                case 40:  //下方向键
                    if (!customUpdate && !this.divOut.is(":hidden")) {
                        var oLi = this.acjUl.find("li");
                        var oLiM = this.acjUl.find("li.acj_selectedItem");
                        if (oLiM.length > 0) {
                            var oNext = oLiM.removeClass("acj_selectedItem").next();
                            oNext.addClass("acj_selectedItem");

                            if (oNext.length > 0) {  //超过显示区域自动滚动滚动条
                                var top = oNext.position().top + this.ttj.bodyIn.scrollTop();
                                if (top > this.ttj.divOut.height() + this.ttj.bodyIn.scrollTop() - 20) {
                                    this.ttj.bodyIn.scrollTop(top);
                                }
                            }
                        }
                        else {
                            oLi.eq(0).addClass("acj_selectedItem");
                            this.ttj.bodyIn.scrollTop(0);
                        }
                        //this.input.val(this.acjUl.find("li.acj_selectedItem").text());
                        this.canHover = false;  //禁止鼠标移上选中
                    }
                    break;
                default:  //查询数据
                    fj.lazyDo(function () {  //每次查询数据时延迟一定时间
                        if (!customUpdate && this.ttj.p.hasShadow && FJ.isIEgt9) {  //解决IE9以上版本下层高度变小时背景有残影
                            this.ttj.divOut.css("box-shadow", "0px 0px 0px " + this.ttj.p.colorParams.shadow);
                        }

                        var v = this.input.val();
                        if (v != this.valL) {
                            this.afterInput();
                        }
                        this.valL = v;
                    }, this.p.delaySpeed, "acj_delay", this);
                    break;
            }

            fj.lazyDo(function () {
                this.canHover = true;  //恢复鼠标移上选中
            }, 200, "acj_canHover", this);
        },
        //#endregion

        //#region 输入信息
        afterInput: function (isFocus) {
            var thiz = this;
            var val = this.input.val();

            //使用本地数据
            if (this.p.loadMode === "local") {
                var data = [],
                    b = null,
                    fnE = function () {
                        if (thiz.p.showAllData) {
                            data = thiz.p.data;
                            b = true;
                        }
                    };

                if (!isFocus) {  //点击键盘
                    if (val.length != 0 && !this.p.onlyShowAllData) {
                        for (var i = 0, l = this.p.data.length; i < l; i++) {
                            if ((this.p.data[i][this.p.textField] + "").toLowerCase().indexOf(val.toLowerCase()) != -1) {
                                data[data.length] = this.p.data[i];
                            }
                        }
                        b = false;
                        this.isAllLastTime = b;  //只要点击键盘就一定重新加载
                    }
                    else {
                        fnE();
                    }
                }
                else {  //点击文本框
                    fnE();
                }

                if (this.isAllLastTime == null || !this.isAllLastTime || data.length == 0) {  //检测上次加载的是否是全部数据,是的话不再重新加载直接显示
                    this.update(data);
                }
                else {  //如果本次筛选后的数据和上次获取的全部数据相同,则直接显示上次已加载完的数据
                    this.display(1);
                    this.runCloseClick = true;
                }

                this.isAllLastTime = b;  //记录上一次是否显示全部
            }

            //执行输入信息事件
            this.fire("afterInput", { input: val });
        },
        //#endregion

        //#region 更新选项列表完毕
        update: function (data, saveData, clickFirst) {
            var thiz = this,
                l = data ? data.length : 0,
                dl = this.p.dataLimit;

            if (saveData || this.p.loadMode === "remote") {  //远程模式下保存数据集
                this.p.data = data;
            }

            if (dl && l > dl) {  //超过最大值,截取部分数据
                data = data.slice(0, dl);
            }

            if (!this.customUpdate) {
                if (l > 0) {
                    var selectFirst = false;

                    //先清空列表
                    this.clearItems();

                    for (var i = 0, m = data.length; i < m; i++) {
                        (function (d) {
                            var tf = thiz.p.textField,
                                vf = thiz.p.valueField,
                                tr = thiz.p.textRule,
                                t = d[tf],
                                v = d[vf];

                            //创建项文本
                            tr = tr.replace(/\{0\}/g, t);
                            tr = tr.replace(/\{1\}/g, v);
                            var oItem = $("<li class='acj-item' " + (thiz.p.itemAlign ? "style='text-align:" + thiz.p.itemAlign + ";'" : "") + "><span class='acj-item-txt'>" + tr + "</span></li>").bind("click", function (e) {
                                e.stopPropagation();
                                var txt = d[tf],
                                    val = d[vf];

                                thiz.input.val(txt);
                                if (txt != null) {
                                    thiz.input.attr(thiz.p.actualTextField, txt);
                                }
                                else {
                                    thiz.input.attr(thiz.p.actualTextField, "");
                                }
                                if (val != null) {
                                    thiz.input.attr(thiz.p.actualValueField, val);
                                }
                                else {
                                    thiz.input.attr(thiz.p.actualValueField, "");
                                }
                                thiz.display(0);
                                thiz.runCloseClick = false;

                                //选中事件
                                thiz.fire("afterSelect", { txt: txt, val: val });
                                thiz.input.blur();
                            });

                            oItem.hover(function () {
                                if (thiz.canHover) {
                                    thiz.acjUl.find("li.acj_selectedItem").removeClass("acj_selectedItem");
                                    $(this).addClass("acj_selectedItem");
                                }
                            }, function () {
                                //if(thiz.canHover) {
                                //    $(this).removeClass("acj_selectedItem");
                                //}
                            });

                            thiz.acjUl.append(oItem);

                            //是否默认点击第一项
                            if(clickFirst != null) {
                              if (selectFirst != null) {
                                selectFirst = true;
                              }

                              if (clickFirst === v) {
                                oItem.click();
                                selectFirst = null;
                              }
                            }
                        })(data[i]);
                    }

                    if (selectFirst) {
                      thiz.acjUl.children('li:eq(0)').click();
                    }

                    //更新后是否显示
                    if (!saveData) {
                        this.display(1);

                        if (fj.isIE7) {  //解决IE7下第一次加载数据后不显示滚动条
                            var b = this.ttj.bodyIn, w = b.width();
                            b.width(w + 1);
                            setTimeout(function () {
                                b.width(w);
                            }, 200);
                        }
                    }
                }
                else {
                    this.display(0);
                }
            }
            else {  //自定义更新列表
                this.fire("customUpdate", { data: data });
            }

            thiz.runCloseClick = true;
        },
        //#endregion

        //#region 清空列表
        clearItems: function () {
            this.acjUl.empty();
        },
        //#endregion

        //#region 恢复默认值
        resetValue: function () {
            if (this.p.defaultText != null) {
                this.input.val(this.p.defaultText);
                this.input.attr(this.p.actualTextField, this.p.defaultText);
            }
            if (this.p.defaultValue != null) {
                this.input.attr(this.p.actualValueField, this.p.defaultValue);
            }
        },
        //#endregion

        //#region 显示、关闭loading层
        showLoading: function (b) {
            if (this.customUpdate) {
                return;
            }

            this.ttj.showLoad(b);
        },
        //#endregion

        //#region 显示、隐藏提示
        display: function (b) {
            if (this.customUpdate) {
                return;
            }

            if (b === true || b === 1 || b == null) {
                this.ttj.setVisible(true);
            }
            else {
                this.ttj.setVisible(false);
            }
        },
        //#endregion

        //#region 首次加载完毕
        initLoadComplete: function (data) {
            this.p.data = data;
            if (data.length == 0) {
                this.clearItems();
            }
            this.initLoaded = true;
            this.isAllLastTime = null;
            this.showLoading(false);
            this.p.showLoading = false;
            this.afterInput(true);
        },
        //#endregion

        //#region 计算提示层高度
        countHeight: function () {
            var h = this.divOut.height(),
                mh = this.p.maxHeight,
                t = this.ttj,
                pb = t.pjBody,
                bi = t.bodyIn,
                dt = t.divOut;

            if (h <= mh) {
                pb.css("height", "auto");
                bi.css("height", "auto");
            }
            else {
                pb.css("height", mh);
                bi.css("height", mh);
            }
        },
        //#endregion

        //#region 计算提示层显示位置
        countPosition: function (ttj) {
            var osInp = this.input.offset(),
                top = 0,
                dH = 0,
                autoTurn = this.p.autoTurn;

            if (autoTurn) {
                dH = ttj.divOut.height();
            }
            if (autoTurn && (osInp.top - $("html").scrollTop()) > document.documentElement.clientHeight - dH - 20) {   //如果在下方没有空间显示则改为在上方显示
                top = osInp.top - dH - ttj.p.shiftTop + 9;
            }
            else {
                top = osInp.top + this.input[0].offsetHeight / 2 + ttj.p.shiftTop;
            }
            ttj.divOut.css("top", top);
        },
        //#endregion

        //#region 移动端使文本框滚动到可视区域
        scrollView: function () {
            this.input[0].scrollIntoView();

            var scrollViewShift = this.p.scrollViewShift;
            if (scrollViewShift) {
                fj.lazyDo(function () {
                    fj.body.scrollTop -= scrollViewShift;
                });
            }
        }
        //#endregion
    });

    //#region 绑定到jquery
    $.fn.extend({
        AutoCompleteJ: function (settings) {
            if (this && this.length > 0) {
                return new FJ.AutoCompleteJ(this, fj.ACJ_commonConfig ? $.extend(true, fj.clone(fj.ACJ_commonConfig), settings) : settings);
            }
        },
        ACJ: function (settings) {
            return $(this).AutoCompleteJ(settings);
        }
    });
    //#endregion

});