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
* last update:2015-7-9
***********************************************************/

/*----------------------------------------------*
* flareJ.Menu
*-------*-------*-------*-------*-------*-------*
* 菜单
*-------*-------*-------*-------*-------*-------*
* [依赖]flareJ.Tooltip
*       flareJ.SelectBox
*----------------------------------------------*/
FJ.define("widget.Menu", ["widget.Tooltip", "widget.SelectBox"], function() {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                           菜单
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.MenuJ = this.MUJ = FJ.MenuJ = FJ.MUJ = FJ.TooltipJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "MUJ",
                hoverDirect: "bottom",
                cMenuDirect: "right",
                autoDirect: true,
                shiftLeft: 50,
                shiftTop: 15,
                hoverType: "click",
                isRightClick: false,
                hoverSpeed: 100,
                closeMenuDelay: 100,
                closeDelay: 100,                    //关闭延迟时间
                radius: 2,
                radiusB: 2,
                speed: 1,
                showSpeed: FJ.isIElt9 ? 1 : 100,
                loadSpeed: 1,
                onlyFirstLoad: true,
                width: 100,
                height: 24,
                forecastMenuH: 24,
                maxHeight: 0,
                hasShadow: true,
                renderTo: "body",
                showRendorBody: false,
                isRenderHF: false,
                isAutoSetHeight: false,
                selectIndex: null,  //选中一项后隐藏其余项图标
                fnHtml: function () {
                    this.pjBody.addClass("muj_pjBody");
                    return this.menuContainer;
                },
                menus:
                [
                    /*{
                        text: '菜单1',
                        icon: FJ.imgPath + "Menu/menu-parent-l.gif",
                        hasChk: false,
                        menus: [],
                        click: function () {
                            MBJ.alert("提示", "测试菜单1");
                        }
                    }*/
                ],
                colorParams: {
                    //bgColorBody: "#fefee9",
                    fontColor: null
                },
                evts: {
                    afterClose: function () {
                        if (!this.parentMenu) {  //根菜单关闭时同时关闭所有子菜单
                            this.cascade(this, function (menu) {
                                if (menu.divOut.is(":visible")) {
                                    menu.p.isHoverShow = true;
                                    menu.close();
                                }
                            }, true);
                        }
                        else {
                            this.p.isHoverShow = true;
                        }
                    },
                    afterItemRender: null   //菜单项加载完毕
                }
            }, settings));

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            this.cMenus = [];   //子菜单集合
            this.chks = [];     //子菜单复选框集合
            this.forecastH = this.p.forecastMenuH * this.p.menus.length;  //预算菜单整体高度

            this._super();
            this.divOut.attr("id", "MUJ_" + this.objId);
        },
        //#endregion

        //#region 构建菜单
        create: function () {
            var thiz = this;
            this._super();
            this.divOut.addClass("muj-ttj");

            //菜单容器
            this.menuContainer = $('<ul class="muj"></ul>');

            //项集合
            this.items = [];

            //创建各菜单
            for (var i = 0; i < this.p.menus.length; i++) {
                this.createMenuItem(this.p.menus[i], i);
            }

            if (this.cMenus.length > 0) {
                this.bindEvt("onItemMouseover", function (e, p) {   //鼠标移上时先关闭所有子菜单
                    var k = 0;
                    this.cascade(this, function (menu) {
                        if (k != 0) {
                            if (menu == p.menu) {  //不关闭当前展开的子菜单
                                return false;
                            }

                            if (menu.divOut.is(":visible")) {
                                menu.p.isHoverShow = true;
                                menu.close();
                            }
                        }
                        k++;
                    });
                });
            }

            //if(fj.isMobile) {
            //    this.menuContainer.onGestureJ(fj.Evt.click, function(e, p) {
            //        var target = p.evt.originalEvent.target;

            //        if(target.tagName === "DIV") {
            //            var t = $(target);
            //            t.trigger("mouseover");

            //            fj.lazyDo(function() {
            //                t.trigger("click");
            //            }), 25;
            //        }
            //    });
            //}

            return this;
        },
        //#endregion

        //#region 构建菜单项
        createMenuItem: function (item, inx) {
            var thiz = this,
                oLi = $('<li></li>'),
                cMenuDirect = this.p.cMenuDirect,
                selectIndex = this.p.selectIndex;

            //加入项集合
            this.items.push(oLi);

            if (this.p.colorParams.fontColor) {
                oLi.css("color", this.p.colorParams.fontColor);
            }

            if (item.title) {  //提示
                oLi.attr("title", item.title);
            }

            //图标
            var oIcon = $('<div class="muj-icon"></div>');
            if (cMenuDirect && !item.icon && !item.hasChk) {
                if (cMenuDirect === "right") {
                    oIcon.html('<i class="icon-caret-right"></i>');
                }
                else {
                    oIcon.html('<i class="icon-caret-left"></i>');
                }
            }

            if (!item.hasChk) {
                var oIcoImg = null;

                if (item.icon) {  //图标
                    oIcoImg = $(item.icon).addClass("muj-icon-custom");
                    oIcon.append(oIcoImg);

                    if (selectIndex != null && selectIndex !== inx) {
                        oIcoImg.hide();
                    }
                }

                //点击事件
                if (item.click) {
                    oLi.onGestureJ(fj.Evt.click, function (e, p) {
                        //切换选中项图标
                        thiz.changeSelectIcon(inx);

                        item.click.call(thiz, { e: p.evt, item: oLi, menuItem: item });
                        oLi.trigger("mouseleave");
                        thiz.setVisible(false);
                    }, {
                        tapHoverCls: "muj-hover"
                    });
                }
            }
            else {  //有复选框
                var oChk = SBXJ.init({
                    inputId: (item.id ? 'mujChk_' + item.id + '_' + this.objId : null),
                    initChecked: !item.noCheck ? true : false,
                    canQuery: false,
                    evts: {
                        onChecked: function (e, p) {
                            item.click.call(thiz, { checked: p.checked, chk: this });
                        }
                    }
                });
                this.chks.push(oChk);

                oLi.click(function () {
                    oChk.setChecked(oChk.checked ? false : true, null, true);
                    item.click.call(thiz, { checked: oChk.checked, chk: oChk });
                });
                oIcon.append(oChk.divOut);
            }

            var itemContent = $("<div class='muj-item-content'></div>");  //需设置div宽度，否则如果内容有折行时有些浏览器下td高度会增加导致菜单高度变大
            this.menuContainer.append(oLi.append(oIcon).append(itemContent.text(item.text)));

            //子菜单
            var oMenu;
            if (item.menus && item.menus.length > 0) {
                oMenu = oLi.MUJ($.extend(true, {
                    renderTo: this.p.renderTo,
                    showRendorBody: this.p.showRendorBody,
                    hoverType: "over",
                    hoverDirect: this.p.cMenuDirect,
                    cMenuDirect: this.p.cMenuDirect,
                    autoDirect: this.p.autoDirect,
                    shiftLeft: this.p.cMenuDirect == "left" ? -4 : 2,
                    shiftTop: thiz.p.forecastMenuH - 1,
                    maxHeight: item.maxHeight,
                    zIndex: this.p.zIndex,
                    tranOrigin: this.p.tranOrigin,
                    tranScaleShow: this.p.tranScaleShow,
                    tranScaleClose: this.p.tranScaleClose,
                    evts: {
                        afterRender: function () {
                            var thix = this;
                            this.parentMenu = thiz;  //保存父菜单引用
                            thiz.cMenus.push(this);  //保存子菜单引用
                            this.bubble(this, function (menu) {
                                if (!menu.parentMenu) {
                                    thix.rootMenu = menu;  //保存根菜单引用
                                }
                            });
                        },
                        preShow: function () {
                            var offsetH = this.currentObj.offset();
                            if (this.p.autoDirect) {  //判断横向显示位置
                                var w = this.currentObj[0].offsetWidth;
                                var s = this.p.shiftLeft;
                                var wd = this.divOut.width();

                                if (this.p.hoverDirect == "right") {
                                    var rightMax = document.documentElement.clientWidth + document.documentElement.scrollLeft + document.body.scrollLeft - (wd + parseInt(this.divOut.css("border-left-width"), 10) + parseInt(this.divOut.css("border-right-width"), 10)) - w - s;
                                    var left = offsetH.left + w + s;

                                    //                                    if (left < 0) {
                                    //                                        this.p.hoverDirect = "right";
                                    //                                        this.p.shiftLeft = 2;
                                    //                                    }
                                    if (left > rightMax) {
                                        this.p.hoverDirect = "left";
                                        this.p.shiftLeft = -4 + (w - wd);
                                    }
                                    else {
                                        this.p.hoverDirect = "right";
                                        this.p.shiftLeft = 2;
                                    }
                                }
                                else if (this.p.hoverDirect == "left") {
                                    var left = offsetH.left - w + s;
                                    if (left < 0) {
                                        this.p.hoverDirect = "right";
                                        this.p.shiftLeft = 2;
                                    }
                                    else {
                                        this.p.hoverDirect = "left";
                                        this.p.shiftLeft = -4 + (w - wd);
                                    }
                                }
                            }

                            //判断纵向显示位置
                            var top = offsetH.top + (thiz.p.forecastMenuH * item.menus.length) - document.documentElement.clientHeight;
                            if (top > 0) {  //显示位置超过页面底部则向上方调整
                                this.p.shiftTop = top * -1;
                            }
                            else {
                                this.p.shiftTop = thiz.p.forecastMenuH - 1;
                            }
                        },
                        onMouseenter: function () {
                            this.rootMenu.overByFocus = true;

                            if (this.p.hoverType == "over") {
                                this.p.isHoverShow = false;
                            }
                        },
                        onMouseleave: function () {
                            this.rootMenu.overByFocus = false;
                            if (this.rootMenu.hoverType == "focus") {
                                this.rootMenu.currentObj.focus();   //使根菜单可通过失去焦点关闭
                            }
                        }
                    }
                }, item));

                oMenu.icon = oIcon;
            }

            //鼠标移上时操作
            oLi.hover(function () {
                if (thiz.stoCloseMenu) {
                    clearTimeout(thiz.stoCloseMenu);
                }

                //执行自定义鼠标移上事件
                thiz.stoCloseMenu = setTimeout(function () {
                    thiz.fire("onItemMouseover", { item: oLi, menu: oMenu });
                }, thiz.p.closeMenuDelay);
            }, function () {
                if (thiz.stoCloseMenu) {
                    clearTimeout(thiz.stoCloseMenu);
                }

                thiz.fire("onItemMouseleave", { item: oLi });
            });

            this.fire("afterItemRender", { id: item.id, item: oLi, menu: oMenu });

            return this;
        },
        //#endregion

        //#region 级联遍历子菜单
        cascade: function (oMenu, fn, noOwn) {
            var noStop = null;
            if (!noOwn) {
                noStop = fn.call(oMenu, oMenu);
            }

            if (noStop !== false && oMenu.cMenus) {
                for (var i = 0; i < oMenu.cMenus.length; i++) {
                    this.cascade(oMenu.cMenus[i], fn);
                }
            }
        },
        //#endregion

        //#region 级联遍历父菜单
        bubble: function (oMenu, fn, noOwn) {
            var noStop = null;
            if (!noOwn) {
                noStop = fn.call(oMenu, oMenu);
            }

            if (noStop !== false && oMenu.parentMenu) {
                this.bubble(oMenu.parentMenu, fn);
            }
        },
        //#endregion

        //#region 切换选中项图标
        changeSelectIcon: function (no) {
            //切换选中项图标
            if (this.p.selectIndex != null) {
                this.menuContainer.find(".muj-icon-custom").hide();
                this.items[no].find(".muj-icon-custom").show();
            }
        }
        //#endregion
    });

    //#region 图片文件夹路径
    FJ.MUJ.imgSrc = FJ.imgPath + "Menu/";
    //#endregion

    //#region 预加载图片
    FJ.Image.preLoad(MUJ.imgSrc + "copy.gif");
    //#endregion

    //#region 绑定到jquery
    $.fn.extend({
        MenuJ: function (settings) {
            if (this && this.length > 0) {
                return new FJ.MenuJ(this, fj.MUJ_commonConfig ? $.extend(true, fj.clone(fj.MUJ_commonConfig), settings) : settings);
            }
        },
        MUJ: function (settings) {
            return $(this).MenuJ(settings);
        }
    });
    //#endregion

    /************************************************************
    *-----------------------------------------------------------*
    *                          右击菜单
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.ContextMenuJ = this.CMJ = FJ.ContextMenuJ = FJ.CMJ = FJ.MenuJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            var thiz = this;

            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "CMJ",
                isRightClick: true,
                showOnSelectText: true,
                eType: (function (j) {
                    return {
                        afterShow: j
                    };
                })("CMJ")
            }, settings));

            elemObj.bind("contextmenu", function (e) {
                var hasSelectText = false;
                if (!thiz.p.showOnSelectText) {  //判断是否有选中文本
                    var sel = "";
                    if (document.selection) {
                        sel = document.selection.createRange().text;
                    }
                    else if (window.getSelection) {
                        sel = window.getSelection().toString();
                    }
                    if (sel.length > 0) {
                        hasSelectText = true;
                    }
                }

                if (!hasSelectText) {
                    e.stopPropagation();        //阻止冒泡
                    e.returnValue = false;      //取消默认右击菜单
                    thiz.showAt(e, this);    //显示
                    return false;
                }
            });

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            this._super();
            this.divOut.attr("id", "CMJ_" + this.objId);
        },
        //#endregion

        //#region 在指定位置显示
        showAt: function (e, currentObj) {
            this.currentObj = $(currentObj);  //记录当前目标元素
            var x = e.pageX,
                y = e.pageY;

            if (y > document.documentElement.clientHeight - this.forecastH) {
                y = y - this.forecastH;
            }
            this.setVisible(true, { left: x, top: y }, true);  //在鼠标当前位置显示

            //关闭所有子菜单
            this.cascade(this, function (menu) {
                if (menu != this && menu.divOut.is(":visible")) {
                    menu.p.isHoverShow = true;
                    menu.close();
                }
            });

            this.fire("afterShow", "CMJ");
        }
        //#endregion
    });

    //#region 绑定到jquery
    $.fn.extend({
        ContextMenuJ: function (settings) {
            if (this && this.length > 0) {
                return new FJ.ContextMenuJ(this, fj.CMJ_commonConfig ? $.extend(true, fj.clone(fj.CMJ_commonConfig), settings) : settings);
            }
        },
        CMJ: function (settings) {
            return $(this).ContextMenuJ(settings);
        }
    });
    //#endregion

});