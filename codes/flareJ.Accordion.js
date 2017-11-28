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
* flareJ.Accordion
*-------*-------*-------*-------*-------*-------*
* 折叠菜单
*-------*-------*-------*-------*-------*-------*
* [依赖]flareJ.Panel
*----------------------------------------------*/
FJ.define("widget.Accordion", ["widget.Panel"], function() {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                          折叠菜单
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.AccordionJ = this.ADJ = FJ.AccordionJ = FJ.ADJ = FJ.CJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "ADJ",
                renderTo: elemObj,
                width: 200,
                height: "100%",
                borderWidth: null,
                btnHeight: 31,
                itemHeight: 40,
                minConHeight: 38,
                minAreaHeight: null,
                selectIndex: 0,                        //选中项
                expandOne: true,                       //是否只能展开一个菜单
                showLoading: false,
                itemAlign: "center",
                itemMarginLeft: 0,
                showHead: true,                        //是否显示头部按钮
                showFoot: true,                        //是否显示底部按钮
                hasSound: false,
                hasSelectColor: true,                  //是否设置选中项颜色
                hasAnimate: fj.isMobile ? 0 : 1,       //是否有动画
                isAutoSetHeight: true,
                emptyTxt: "没有数据",
                items: [
                    /*{
                        text: 'menu1',                 //菜单文字
                        id: null,                      //面板ID
                        iframe: true,                  //是否使用iframe
                        iframeId: null,                //iframeID
                        url: "http://www.baidu.com",   //iframe地址
                        html: "test",                  //面板内容html
                        expand: false                  //是否展开
                    }*/
                ],
                colorParams: {
                    borderOut: null,
                    bgColor: "#fff"                    //背景色
                },
                evts: {
                    afterItemPageLoad: null
                }
            }, settings));

            this.initFn();
            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            var thiz = this,
                eo = this.p.expandOne,
                autoSetH = this.p.isAutoSetHeight;

            this._super();
            this.create();
            this.show();

            //计算折叠菜单区高度
            if (autoSetH || !this.p.items.length) {
                var hB = this.p.btnHeight * 2;
                if (!this.p.showHead) {
                    hB -= this.p.btnHeight;
                }
                if (!this.p.showFoot) {
                    hB -= this.p.btnHeight;
                }

                //自适应高度时，如无数据则使用固定高度设置内容区域
                this.contentArea.css("height", autoSetH ? this.divOut.height() - hB : "auto");
            }

            //内容区域最小高度
            if(this.p.minAreaHeight) {
                this.contentArea.css("min-height", this.p.minAreaHeight);
            }

            //可同时展开多个时一定有滚动条
            if (!this.p.expandOne) {
                this.contentArea.css("overflow-y", "auto");
                this.hasScroll = true;
            }

            //菜单对象集合
            this.items = [];
            this.panels = [];

            //加载菜单
            if (this.p.items && this.p.items.length > 0) {
                for (var i = 0, l = this.p.items.length; i < l; i++) {
                    var item = this.p.items[i],
                        isEp = eo ? i == thiz.p.selectIndex : item.expand,  //判断是否展开
                        oItem = $('<div class="adj_item' + ((this.p.hasSelectColor && isEp) ? ' adj_selectedItem' : '') + '"><span style="margin-left:' + this.p.itemMarginLeft + 'px">' + item.text + '</span></div>').css({  //1级菜单
                            height: this.p.itemHeight,
                            lineHeight: this.p.itemHeight + "px",
                            textAlign: this.p.itemAlign
                        });

                    this.contentArea.append(oItem);
                    this.items[this.items.length] = oItem;

                    (function (inx, it, isEp) {  //菜单内容面板
                        oItem.onGestureJ(fj.Evt.click, function () {
                            if (!thiz.isOnChange) {
                                thiz.expandItem(inx);
                            }
                        });

                        if (it.html == null) {
                            it.html = "";
                        }

                        //是否有搜索框
                        if (it.canSearch) {
                            it.html = StringBuilderJ.join([
                                "<div class='adj-auto-complete'>",
                                "<div class='adj-search-icon glaj-col-pc1'><i class='icon-search'></i></div>",
                                "<div class='adj-search-input glaj-col-pc11'><input type='text' class='fj-form-elem'></div>",
                                "</div><div class='adj-search-list'>" + it.html + "</div>"
                            ]);
                            it.noBodyScroll = true;
                        }

                        var autoH = it.isAutoSetHeight,
                            autoW = it.isAutoSetWidth,
                            oPj = thiz.contentArea.PJ($.extend(true, it, {  //内容区域面板
                                width: "100%",
                                height: isEp ? (autoH === false ? "auto" : thiz.countContentH()) : 0,
                                divState: isEp ? "max" : "min",
                                showOnInit: isEp ? true : false,
                                showHead: false,
                                showFoot: false,
                                bodyPadding: it.bodyPadding,
                                isRenderHF: false,
                                borderWidth: it.borderWidth == null ? { t: 0, r: 0, b: isEp ? 1 : 0, l: 0 } : it.borderWidth,
                                isInitShow: false,
                                onlyFirstLoad: it.loadOnShow ? null : true,  //是否只首次加载内容区
                                showLoading: thiz.p.showLoading,
                                isAutoSetHeight: autoH == null ? true : autoH,
                                isAutoSetWidth: autoW == null ? true : autoW,
                                loadType: (function () {
                                    var ty;
                                    if (it.iframe) {
                                        ty = "iframe";
                                    }
                                    else if (it.ajax) {
                                        ty = "ajax";
                                    }
                                    else {
                                        ty = "html";
                                    }
                                    return ty;
                                })(),
                                bodyInId: it.id,
                                iframeId: it.iframeId,
                                bodyUrl: it.url,
                                ajaxParams: it.ajaxParams,
                                fnHtml: function () {
                                    return it.html;
                                },
                                colorParams: {
                                    bgColor: "#ffffff"
                                },
                                evts: $.extend(true, {
                                    afterBodyLoadTabs: function (e, p) {  //内容页加载完毕
                                        thiz.fire("afterItemPageLoad", { no: i, panel: this, type: p });
                                    },
                                    afterBodyLoadI: function () {
                                        if (it.canSearch) {  //是否有搜索框
                                            var bi = this.bodyIn;
                                            bi.css("padding-top", 30).addClass("fj-border-box");

                                            //保存文本框、数据列表对象
                                            this.searchInput = bi.find("input.fj-form-elem");
                                            this.searchList = bi.find("div.adj-search-list");
                                        }
                                    }
                                }, it.evts)
                            }));

                        if (!oPj.p.isAutoSetHeight) {
                            oPj.bodyIn.css("height", "auto");
                        }
                        thiz.panels[thiz.panels.length] = oPj;
                    })(i, item, isEp);
                }

                if (this.hasScroll) {
                    this.panels[this.p.selectIndex].reLayout();
                }
            }
            else {
                this.clearData();
            }

            //标记布局完毕
            this.initLayer = true;
        },
        //#endregion

        //#region 构建
        create: function () {
            var thiz = this;
            this._super();
            this.adjId = "ADJ_" + this.objId;

            //外层
            this.divOut.attr("id", this.adjId).addClass("adj").css({
                width: this.p.width,
                height: this.p.height
            });

            //头部按钮
            if (this.p.showHead) {
                this.headBtn = $('<div class="adj_headBtn adj_btnNoHover"><div class="adj_headBtnArrow' + (this.p.hasAnimate ? " fj-has-animate" : "") + '"><i class="icon-chevron-up" ></i></div></div>').hover(function () {
                    $(this).swapClassJ("adj_btnNoHover", "adj_btnHover");
                }, function () {
                    $(this).swapClassJ("adj_btnHover", "adj_btnNoHover");
                }).onGestureJ(fj.Evt.click, function () {
                    if (thiz.items.length && !thiz.isOnChange) {
                        var inx = thiz.p.selectIndex - 1;

                        if(inx < 0) {
                            inx = 0;
                        }
                        thiz.expandItem(inx);
                    }
                });
            }

            //折叠菜单区域
            this.contentArea = $('<div class="adj_contentArea"></div>');

            //底部按钮
            if (this.p.showFoot) {
                this.footBtn = $('<div class="adj_footBtn adj_btnNoHover"><div class="adj_footBtnArrow' + (this.p.hasAnimate ? " fj-has-animate" : "") + '"><i class="icon-chevron-down" ></i></div></div>').hover(function () {
                    $(this).swapClassJ("adj_btnNoHover", "adj_btnHover");
                }, function () {
                    $(this).swapClassJ("adj_btnHover", "adj_btnNoHover");
                }).onGestureJ(fj.Evt.click, function () {
                    if (thiz.items.length && !thiz.isOnChange) {
                        var inx = thiz.p.selectIndex + 1,
                            iL = thiz.items.length;

                        if(inx >= iL) {
                            inx = iL - 1;
                        }
                        thiz.expandItem(inx);
                    }
                });
            }

            //渲染
            if (this.p.showHead) {
                this.divOut.append(this.headBtn);
            }
            this.divOut.append(this.contentArea);
            if (this.p.showFoot) {
                this.divOut.append(this.footBtn);
            }
            return this;
        },
        //#endregion

        //#region 展开菜单
        expandItem: function (no) {
            var eo = this.p.expandOne;
            if (eo && no == this.p.selectIndex) {
                return;
            }

            var thiz = this,
                item = this.p.items[no],
                oItem = this.items[no],
                oPj = this.panels[no],
                hasColor = this.p.hasSelectColor,
                ep = item.expand,
                AutoHeightOnMax = true;

            //标记正在切换展开状态中
            this.isOnChange = true;

            //播放折叠声音
            if (this.p.hasSound) {
                fj.lazyDo(function () {
                    fj.playSound.play("adj1");
                });
            }

            //设置已选中面板展开高度
            if (!item.expand) {
                oPj.show();

                if (!oPj.p.isAutoSetHeight) {
                    oPj.divOut.height(0);
                    oPj.pjBody.show();

                    var sh = oPj.pjBody[0].scrollHeight,
                        mh = this.p.minConHeight,
                        dh = 0;

                    //如果设置了最小高度,则内容高度须大于最小高度
                    if(mh == null || sh >= mh) {
                        dh = sh;
                    }
                    else {
                        dh = mh;
                        AutoHeightOnMax = false;  //如使用最小高度,则设置面板高度为定值
                    }

                    oPj.p.height = dh;
                }
                else {
                    oPj.p.height = this.countContentH();
                }
            }
            oPj.bodyIn.css("overflow", "hidden");  //执行动画时隐藏滚动条

            //收起已展开面板
            if (eo) {
                var oPjS = this.panels[this.p.selectIndex];
                oPjS.bodyIn.css("overflow", "hidden");  //执行动画时隐藏滚动条
                oPjS.maxMin(function () {
                    this.divOut.css("border-width", 0);
                    oPjS.bodyIn.css("overflow", "auto");
                });
            }

            //展开或收起已选中面板
            oPj.maxMin(function () {
                if (!ep) {
                    this.divOut.css("border-bottom-width", 1);
                }
                else {
                    this.divOut.css("border-width", 0);
                }

                if (AutoHeightOnMax && this.p.divState === "max" && !this.p.isAutoSetHeight) {
                    this.divOut.css("height", "auto");
                }

                oPj.bodyIn.css("overflow", "auto");
                thiz.isOnChange = false;
                thiz.fire("afterExpandItem", { no: no, panel: oPj });
            });

            //切换菜单头部颜色
            if (eo) {  //过去的选中项取消选中
                var oItemS = this.items[this.p.selectIndex];
                if (hasColor) {
                    oItemS.removeClass("adj_selectedItem");
                }
                oItemS.expand = false;
            }

            //设置选中项
            if (!item.expand) {
                if (hasColor) {
                    oItem.addClass("adj_selectedItem");
                }

                if (!eo) {  //可以同时展开多个菜单时才设置expand为true
                    item.expand = true;
                }
            }
            else {
                if (hasColor) {
                    oItem.removeClass("adj_selectedItem");
                }
                item.expand = false;
            }

            //设置选中编号
            this.p.selectIndex = no;
        },
        //#endregion

        //#region 清空数据
        clearData: function () {
            this.p.items.length = 0;
            if (this.p.showFoot && !fj.isIE7) {
                this.footBtn.css("margin-top", -1);
            }
            this.contentArea.html($('<div style="width:100%;height:100%;position:absolute;text-align:center;"></div>').append($('<div style="width:100%;height:100%;" class="cj_divCvFd1"></div>').append($('<div style="text-align:center;" class="cj_divCvFd2"></div>').append($('<div class="cj_divCvFd3 adj_emptyTxt"></div>').append(this.p.emptyTxt)))));
        },
        //#endregion

        //#region 计算内容区高度
        countContentH: function () {
            var h;
            if (!this.hasScroll) {
                var l = this.p.items.length,
                    h = this.contentArea.height() - this.p.itemHeight * l - (fj.isIE7 ? l : (1 + l));

                if (h < this.p.minConHeight) {  //如果展开的面板高度小于面板最小高度,则使用面板最小高度
                    h = this.p.minConHeight;
                    this.contentArea.css("overflow-y", "auto");
                    this.hasScroll = true;
                }
            }
            else {
                h = this.p.minConHeight;
            }
            return h;
        }
        //#endregion
    });

    //#region 绑定到jquery
    $.fn.extend({
        AccordionJ: function (settings) {
            if (this && this.length > 0) {
                return new FJ.AccordionJ(this, fj.ADJ_commonConfig ? $.extend(true, fj.clone(fj.ADJ_commonConfig), settings) : settings);
            }
        },
        ADJ: function (settings) {
            return $(this).AccordionJ(settings);
        }
    });
    //#endregion

    //#region 图片文件夹路径
    FJ.ADJ.imgSrc = FJ.imgPath + "Accordion/";
    //#endregion

    //#region 初始化折叠声音
    if(!fj.isMobile) {
        fj.playSound.init("adj1", FJ.mediaPath + "XP_kaishi.wav");
    }
    //#endregion

});