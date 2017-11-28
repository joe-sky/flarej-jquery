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
* last update:2015-12-4
***********************************************************/

/*----------------------------------------------*
* flareJ.Tabs
*-------*-------*-------*-------*-------*-------*
* 选项卡
*-------*-------*-------*-------*-------*-------*
* [依赖]flareJ.Panel
*       flareJ.ScrollButton
*----------------------------------------------*/
FJ.define("widget.Tabs", ["widget.Panel", "widget.ScrollButton"], function() {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                           选项卡
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.TabsJ = this.TBJ = FJ.TabsJ = FJ.TBJ = FJ.CJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "TBJ",
                renderTo: elemObj,
                layoutDelay: 500,
                width: 300,                            //最大宽度
                height: 150,                           //最大高度
                heightTabs: 30,                        //tab按钮区域高度
                hasTabsBg: false,                      //是否有tab按钮区域背景
                heightTabsBg: 22,                      //tab按钮区域背景高度
                hideTabBtns: false,                    //是否隐藏tab按钮
                radius: 0,                             //圆角弧度
                borderWidth: 1,
                panelBorder: null,                     //面板边框宽度
                showLoading: false,                    //是否显示loading层
                showTabBottom: false,                  //是否显示tab按钮底边缘
                asyncLoading: false,                   //是否异步显示loading层
                emptyPanelOnChange: false,             //切换面板时是否清空内容
                selectInit: 0,                         //默认选中项
                selectIndex: 0,                        //选中项
                btnMarginLeft: 15,                     //tab按钮区域左侧补间
                panels: [],                            //tab面板集合
                initLoadPanel: false,                  //默认加载面板内容页
                btnShiftW: 12,                         //计算tab按钮区域宽度补间值
                scrollBtnTop: null,                    //溢出箭头按钮距离上方值
                isLazyLoad: false,                     //是否延时加载tab面板
                isAutoSetHeight: true,                 //是否自动设置高度
                items:
                [
                    /*{
                        text: 'tab1',                  //tab按钮文字
                        icon: "test.gif",              //tab按钮图标
                        id: null,                      //面板ID
                        iframe: true,                  //是否使用iframe
                        iframeId: null,                //iframeID
                        url: "http://www.baidu.com",   //iframe地址
                        html: "test",                  //面板内容html
                        canClose: true                 //是否可关闭
                    }*/
                ],
                colorParams: {
                    bgColor: null,
                    tabBtnArea: null
                },
                evts: {
                    onSelect: null                     //选择面板
                },
                eType: (function (j) {
                    return {
                        afterRender: j
                    };
                })("TBJ")
            }, settings));

            this.initFn();

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            var thiz = this,
                isLazyLoad = this.p.isLazyLoad,
                selectInit = this.p.selectInit;

            this.tbjId = "TBJ_" + this.objId;
            this._super();

            //tab按钮集合
            this.tabBtns = [];

            //id对应索引值对象
            this.idToIndex = {};

            //初始化vml按钮标签
            //this.changeDrawTheme(true);

            if (this.p.hideTabBtns) {
                this.p.hasTabsBg = false;
            }

            //计算tab按钮高度补正值
            this.shiftTop = this.p.hasTabsBg ? 4 : 2;

            this.create();
            this.show();

            //设置tab按钮区域高度
            if (this.p.isAutoSetHeight) {
                this.areaTabPanels.height(this.divOut.height() - this.p.heightTabs);
            }

            //加载各tab面板
            if(isLazyLoad) {  //使用延时加载tab面板时,只在初始化时加载第一个
                this.addItem(this.p.items[selectInit]);
            }
            else {
                for (var i = 0, l = this.p.items.length; i < l; i++) {
                    this.addItem(this.p.items[i], i);
                }
            }

            //页面布局改变时控件重新布局
            $(window).bind("resize", function () {
                if (!thiz.divOut.is(":hidden")) {
                    fj.lazyDo(function () {
                        this.reLayout();
                    }, thiz.p.layoutDelay, "ld_tbj_layout", thiz);
                }
            });

            //渲染完毕事件
            this.fire("afterRender", "TBJ");

            //设置默认选中项
            if (this.p.items.length) {
                this.tabBtns[isLazyLoad ? 0 : selectInit].trigger(fj.Evt.click);
            }

            //检测tab按钮是否溢出
            fj.lazyDo(function () {
                thiz.countTabBottom();
                thiz.checkScrollBtn();
            }, 100);
        },
        //#endregion

        //#region 构建
        create: function () {
            var thiz = this;
            this._super();

            //外层
            this.divOut.attr("id", "TBJ_" + this.objId).addClass("tbj");

            //高度是否自适应
            if (!this.p.isAutoSetHeight) {
                this.divOut.css("height", "auto");
            }

            //tab按钮区域
            this.areaTabBtns = $('<div class="tbj_areaTabBtns"></div>').css("height", this.p.heightTabs);
            if (this.p.hasTabsBg) {  //有tab按钮区域背景
                this.areaTabBtnsBg = $('<div class="tbj-area-tabbtns-bg"></div>').css({ height: thiz.p.heightTabsBg, top: thiz.p.heightTabs - thiz.p.heightTabsBg });
                this.areaTabBtns.append(this.areaTabBtnsBg);
            }
            if (this.p.colorParams.tabBtnArea) {
                this.areaTabBtns.css("background-color", this.p.colorParams.tabBtnArea);
            }
            if (this.p.hideTabBtns) {  //是否隐藏tab按钮
                this.areaTabBtns.hide();
                this.p.heightTabs = 0;
            }

            this.atbBorder = $('<div class="tbj-atb-border"></div>').css("top", thiz.p.heightTabs - 1);  //areaTabBtns底部边线
            this.areaTabBtnsBody = $('<div class="tbj_areaTabBtnsBody' + (fj.isMobile ? ' fj-mobile' : '') + '"></div>').css({
                marginLeft: this.p.btnMarginLeft
            });
            this.areaTabBtns.append(this.areaTabBtnsBody.append(this.atbBorder));

            //tab溢出时滚动按钮
            if (!this.p.hideTabBtns) {
                this.sbnj = this.areaTabBtns.SBNJ({
                    targetElem: this.areaTabBtnsBody,
                    top: this.p.scrollBtnTop
                });
            }

            //面板区域
            this.areaTabPanels = $('<div class="tbj_areaTabPanels"></div>');
            if (this.p.colorParams.bgColor) {
                this.areaTabPanels.css("background-color", this.p.colorParams.bgColor);
            }

            //渲染
            this.divOut.append(this.areaTabBtns).append(this.areaTabPanels);

            return this;
        },
        //#endregion

        //#region 切换面板
        changePanel: function (no, oBtn, p) {
            var btn, thiz = this;
            if (!oBtn) {
                btn = this.tabBtns[no];
            }
            else {
                btn = oBtn;
                no = $.inArray(oBtn, this.tabBtns);  //获取tab按钮索引
            }

            if (btn && !this.checkSelectBtn(btn)) {
                var tds = btn.find("td"),
                    panels = this.p.panels;

                //选中面板前事件
                this.fire("beforeSelect", { no: no, panel: panels[no] });

                btn.swapClassJ("tbj_tabBtnNormal", "tbj_tabBtnDown");
                if (this.selectedBtn) {  //设置正在选中状态的tab按钮
                    this.selectedBtn.swapClassJ("tbj_tabBtnDown", "tbj_tabBtnNormal");
                }
                this.selectedBtn = btn;

                //切换面板
                var pjOld = panels[this.p.selectIndex],
                    noFirst = this.p.selectIndex != no;
                if (pjOld) {
                    if (!this.p.asyncLoading) {
                        if (this.p.emptyPanelOnChange && noFirst) {  //清空原面板,首次加载第一个面板时不清空
                            pjOld.bodyIn.empty();
                        }
                        pjOld.hide();   //先隐藏原选中项
                    }
                    else {
                        if (noFirst) {
                            pjOld.showLoad(true);  //异步显示loading时,先开启原面板loading层
                        }
                    }
                }
                //                for(var i = 0, l = panels.length;i < l;i++) {  //先隐藏所有面板
                //                    panels[i].divOut[0].style.display = "none";
                //                }
                var oPj = panels[no];
                this.p.selectIndex = no;         //设置选中面板索引
                this.selectId = oPj.p.bodyInId;  //设置选中面板ID
                if (!this.p.asyncLoading || !noFirst) {
                    oPj.show(null, null, p);
                }
                else {
                    oPj.loadBody("show", function () {  //异步显示loading时
                        if (pjOld) {
                            if (thiz.p.emptyPanelOnChange && noFirst) {  //清空原面板,首次加载第一个面板时不清空
                                var param = { no: no, panelId: pjOld.p.bodyInId, panel: pjOld, p: p };
                                thiz.fire("beforeClearPanel", param);
                                pjOld.bodyIn.empty();
                                thiz.fire("afterClearPanel", param);  //原面板内容清除完毕事件
                            }
                            pjOld.showLoad(false).hide();  //关闭原面板loading层后再填充内容页并显示选中面板
                        }
                        this.show(true);
                    }, null, p);
                }

                //选中面板事件
                var item = this.getItem(no);
                this.fire("onSelect", { no: no, panelId: oPj.p.bodyInId, panel: oPj, p: p, isOpened: item ? item.isOpened : null });
                if (item) {
                    item.isOpened = true;                     //标记面板已被打开过
                }
            }
        },
        //#endregion

        //#region 选中面板
        select: function (no, p, cb) {
            var id, item;
            if (!fj.RX.numZ(no)) {
                id = no;
                no = this.idToIndex[no];  //按id获取索引
            }
            if (no == null && this.p.isLazyLoad) {  //延迟加载面板
                item = this.getItemById(id);  //按id获取项参数
                if (!item) {
                    return;
                }
                this.addItem(item, null, true);  //添加面板
                no = this.tabBtns.length - 1;  //设置编号为最新的
            }

            var btn = this.tabBtns[no];
            if (btn) {
                if (cb) {
                    var thiz = this;
                    this.cbPjLoad = function () {
                        cb.call(thiz, no, id);
                    };
                }
                btn.trigger(fj.Evt.click, [p]);

                if (item) {  //延迟加载时需在此处执行重布局
                    this.reLayout();
                }
                return this;
            }
            else {
                return false;
            }
        },
        //#endregion

        //#region 获取面板
        getPanel: function (no) {
            no = this.getNoById(no);
            if (no != null) {
                return this.p.panels[no];
            }
        },
        //#endregion

        //#region 刷新面板
        reloadPanel: function (no, url) {
            var oPj = this.getPanel(no);
            this.fire("beforeReloadPanel", { no: no, panelId: oPj.p.bodyInId, panel: oPj });
            oPj.reload(url);
            return this;
        },
        //#endregion

        //#region 添加面板
        addItem: function (p, inx, noLayout) {
            var thiz = this,
                isDynamic = false;

            if (inx == null) {  //加入面板配置项集合
                isDynamic = true;
                if (!this.p.isLazyLoad) {  //非延迟加载tab面板时更新配置项集合
                    inx = this.p.items.length;
                    this.p.items.push(p);
                }
                else {
                    inx = this.tabBtns.length;
                }
            }

            //创建tab按钮            
            var hTabs = this.p.heightTabs - this.shiftTop,
                oBtn = $('<div class="tbj_tabBtn tbj_tabBtnNormal" style="height:' + hTabs + 'px;line-height:' + hTabs + 'px;top:' + this.shiftTop + 'px;">'
            		+ (p.icon ? '<img class="tbj_btnC1" src="' + p.icon + '" />' : '') + '</span><span class="tbj_btnC2" >' + p.text + '</span><span>&nbsp;</span>'
                    + '</div>');

            if (this.p.hasTabsBg) {
                oBtn.arrow = $("<div class='tbj_btnArrow'></div>");
                oBtn.append(oBtn.arrow);
                oBtn.addClass("tbj_tbg");
            }

            //关闭按钮
            if (p.canClose) {
                var oBtnR = $('<img class="tbj_closeBtn tbj_btnC3" src="' + fj.imgPath + 'Datagrid/treegrid/s.gif" />');
                oBtnR.onGestureJ(fj.Evt.click, function (e, pa) {
                    pa.evt.stopPropagation();

                    //删除面板
                    thiz.removeItem(null, oBtn);
                });

                oBtn.append(oBtnR);
            }

            this.tabBtns[this.tabBtns.length] = oBtn;  //加入tab按钮集合

            //绑定tab按钮点击事件
            oBtn.onGestureJ(fj.Evt.click, function (e, pa) {
                thiz.changePanel(null, oBtn, pa.param);
            });

            //渲染tab按钮
            this.atbBorder.before(oBtn);
            //this.areaTabBtnsBody.append(oBtn);  

            //创建tab面板
            var oPj = this.areaTabPanels.PJ($.extend(true, p, {
                width: !(fj.isIElt8) ? "100%" : "99.7%",
                height: "100%",
                isAutoSetHeight: this.p.isAutoSetHeight,
                showHead: false,
                showFoot: false,
                bodyPadding: p.bodyPadding,
                isRenderHF: false,
                borderWidth: 0,
                borderWidthB: this.p.panelBorder,
                isInitShow: false,
                onlyFirstLoad: p.loadOnShow ? null : true,  //是否只首次加载内容区
                showLoading: this.p.showLoading,
                loadType: (function () {
                    var ty;
                    if (p.iframe) {
                        ty = "iframe";
                    }
                    else if (p.ajax) {
                        ty = "ajax";
                    }
                    else {
                        ty = "html";
                    }
                    return ty;
                })(),
                bodyInId: p.id,
                iframeId: p.iframeId,
                bodyUrl: p.url,
                ajaxParams: p.ajaxParams,
                fnHtml: function () {
                    return p.html ? p.html : "";
                },
                colorParams: {
                    bgColor: "#ffffff"
                },
                evts: $.extend(true, {
                    afterBodyLoadTabs: function (e, pa) {  //内容页加载完毕
                        thiz.fire("afterTabPageLoad", { no: inx, panelId: this.p.bodyInId, panel: this, type: p.type, p: pa });
                        if (thiz.cbPjLoad) {
                            thiz.cbPjLoad();
                            thiz.cbPjLoad = null;
                        }
                    }
                }, p.evts)
            }));

            oBtn.pj = oPj;  //在按钮对象中保存面板对象
            this.p.panels[this.p.panels.length] = oPj;

            if (fj.isWebkit) {  //解决chrome下第一次加载滚动条失效问题
                oPj.bodyIn.bind("scroll", function () {
                    fj.lazyDo(function () {
                        this.reLayout();
                    }, 500, "ld_tbj_fixWebkitScroll", thiz);
                });
            }

            if (p.id != null) {
                this.idToIndex[p.id] = inx;  //按id记录索引
            }

            if (this.p.initLoadPanel && inx != this.p.selectInit) {  //默认加载各内容页
                oPj.show(null, function () {
                    this.hide();
                });
            }

            if (isDynamic && !noLayout) {
                fj.lazyDo(function () {  //动态加载时部分元素需重计算尺寸
                    thiz.countTabBottom();
                    thiz.checkScrollBtn();
                }, 50, "ld_tbj_addItemD", this);
            }
        },
        //#endregion

        //#region 删除面板
        removeItem: function (no, oBtn) {
            if (this.tabBtns.length <= 1) {  //至少有一个tab页
                return;
            }
            if (!oBtn) {
                oBtn = this.tabBtns[no];
            }
            else {
                no = $.inArray(oBtn, this.tabBtns);  //获取tab按钮索引
            }

            oBtn.remove();                       //删除tab按钮
            fj.arr.removeAt(this.tabBtns, no);   //清理tab按钮集合
            oBtn.pj.remove();                    //删除面板
            fj.arr.removeAt(this.p.panels, no);  //清理面板集合
            if (!this.p.isLazyLoad) {
                fj.arr.removeAt(this.p.items, no);   //清理项集合
            }
            else {
                var item = this.getItemById(no);
                if (item) {
                    item.isOpened = false;
                }
            }

            //清理id对应索引值对象
            this.loopIdToIndex(function (inx, o, itd) {
                if (inx == no) {
                    delete itd[o];
                }
                else if (inx > no) {
                    itd[o] = inx - 1;
                }
            });

            if (no == this.p.selectIndex) {
                var n = no,
                    len = this.tabBtns.length;
                if (no >= len) {
                    n = len - 1;
                }

                this.p.selectIndex -= 1;  //已删除的面板就是当前选中的面板,则需将当前选中的索引-1
                this.changePanel(n);
            }
            else if (no < this.p.selectIndex) {
                this.p.selectIndex -= 1;  //已删除的面板索引在当前选中的面板前面,则需将当前选中的索引-1
            }
            if (this.p.selectIndex < 0) {
                this.p.selectIndex = 0;
            }

            this.countTabBottom();
            this.checkScrollBtn();
        },
        //#endregion

        //#region 重新布局
        reLayout: function () {
            var rp = this.p.responsive,
                hTabs = this.p.heightTabs;

            //设置tab按钮区域是否隐藏
            if (!this.p.hideTabBtns) {
                this.areaTabBtns.show();
                this.countTabBottom();
                this.checkScrollBtn();

                //响应式设置
                if (rp) {
                    var hTabsBg = this.p.heightTabsBg,
                        ht = hTabs - this.shiftTop;
                    this.areaTabBtns.height(hTabs)[0].offsetHeight;
                    this.atbBorder.css("top", hTabs - 1);

                    if (this.p.hasTabsBg) {  //有tab按钮区域背景
                        this.areaTabBtnsBg.css({
                            height: hTabsBg,
                            top: hTabs - hTabsBg
                        });
                    }

                    //重置tab按钮尺寸
                    for (var i = 0, l = this.tabBtns.length; i < l; i++) {
                        var btn = this.tabBtns[i];
                        btn.css({
                            height: ht,
                            lineHeight: ht + "px",
                            top: this.shiftTop
                        });
                    }
                }
            }
            else {
                this.areaTabBtns.hide();
            }

            //重置tab面板大小
            if (this.p.isAutoSetHeight) {
                var h = this.divOut.height() - (this.areaTabBtns.is(":visible") ? hTabs : 0);
                this.areaTabPanels.height(h);
            }
        },
        //#endregion

        //#region 检测是否显示tab溢出滚动按钮
        checkScrollBtn: function (noBtn) {
            var re = false;
            if (!this.p.hideTabBtns) {
                re = this.sbnj.checkShow();
            }

            return re;
        },
        //#endregion

        //#region 判断是否选中的tab按钮
        checkSelectBtn: function (btn) {
            var re = btn.hasClass("tbj_tabBtnDown");
            return re;
        },
        //#endregion

        //#region 获取面板参数
        getItem: function (no) {
            if (!this.p.isLazyLoad) {  //非延时加载时按索引编号返回item
                no = this.getNoById(no);
                if (no != null) {
                    return this.p.items[no];
                }
            }
            else {
                if (no != null) {  //延时加载时按id返回item
                    return this.getItemById(no);
                }
                else {  //不传参数时返回选中索引对应的item
                    var id = this.getIdByNo(this.p.selectIndex);
                    return this.getItemById(id);
                }
            }
        },
        //#endregion

        //#region 根据id获取面板参数
        getItemById: function (id) {
            if (fj.RX.numZ(id)) {  //如传入编号则获取对应id
                id = this.getIdByNo(id);
            }
            for (var i = 0, l = this.p.items.length; i < l; i++) {
                var item = this.p.items[i];
                if (id == item.id) {
                    return item;
                }
            }
        },
        //#endregion

        //#region 遍历id对应索引值对象
        loopIdToIndex: function (fn) {
            var itd = this.idToIndex;
            for (var o in itd) {
                var inx = itd[o];
                if (fn.call(this, inx, o, itd) === false) {
                    break;
                }
            }
        },
        //#endregion

        //#region 按id获取编号
        getNoById: function (no) {
            if (no != null) {
                if (!fj.RX.numZ(no)) {
                    no = this.idToIndex[no];  //按id获取索引
                }
            }
            else {
                no = this.p.selectIndex;  //默认为选中的
            }
            return no;
        },
        //#endregion

        //#region 按编号获取id
        getIdByNo: function (no) {
            var id;
            this.loopIdToIndex(function (inx, o, itd) {  //不传参数时返回选中索引对应的item
                if (inx == no) {
                    id = o;
                    return false;
                }
            });
            return id;
        },
        //#endregion

        //#region 计算tab按钮区域下边线宽度
        countTabBottom: function () {
            this.atbBorder.css("width", 0).width(this.areaTabBtnsBody[0].scrollWidth);
        },
        //#endregion

        //#region 更新绘图控件主题
        changeDrawTheme: function (isInit) {
            //            if(fj.isIEno9 && !this.p.hideTabBtns) {
            //                this.vmlBtnL = '<v:shape class="cj_vml" type="#cjArrowLeft" strokecolor="' + fj.theme.configTbj.btnStroke + '" style="width:8px;height:16px;" ><v:fill class="cj_vml" type="gradient" color="' + fj.theme.configTbj.btnColor1 + '" color2="' + fj.theme.configTbj.btnColor2 + '" /></v:shape>';
            //                this.vmlBtnR = '<v:shape class="cj_vml" type="#cjArrowRight" strokecolor="' + fj.theme.configTbj.btnStroke + '" style="width:8px;height:16px;" ><v:fill class="cj_vml" type="gradient" color="' + fj.theme.configTbj.btnColor1 + '" color2="' + fj.theme.configTbj.btnColor2 + '" /></v:shape>';
            //                if(!isInit) {
            //                    this.scrollBtnL[0].innerHTML = this.vmlBtnL;
            //                    this.scrollBtnR[0].innerHTML = this.vmlBtnR;
            //                }
            //            }
        }
        //#endregion
    });

    //#region 绑定到jquery
    $.fn.extend({
        TabsJ: function (settings) {
            if (this && this.length > 0) {
                return new FJ.TabsJ(this, fj.TBJ_commonConfig ? $.extend(true, fj.clone(fj.TBJ_commonConfig), settings) : settings);
            }
        },
        TBJ: function (settings) {
            return $(this).TabsJ(settings);
        }
    });
    //#endregion

});