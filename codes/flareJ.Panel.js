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
* flareJ.Panel
*-------*-------*-------*-------*-------*-------*
* 面板
*-------*-------*-------*-------*-------*-------*
* [依赖]flareJ.LoadMask
*----------------------------------------------*/
FJ.define("widget.Panel", ["widget.LoadMask"], function () {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                           面板
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.PanelJ = this.PJ = FJ.PanelJ = FJ.PJ = FJ.CJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "PJ",
                renderTo: elemObj,                         //要加载到的容器
                renderType: "append",
                layoutDelay: 500,
                title: "面板",                             //标题
                imgTitleSrc: PJ.imgFolderSrc + "HeadIcon1.png",        //标题图片路径
                imgCloseSrc: PJ.imgFolderSrc + "FDnewButton.gif",    //关闭按钮图片路径
                imgSize: { w: 16, h: 16 },                    //标题图片大小
                showHeadImg: false,                        //是否显示标题图标
                //imgLoadSrc: LMJ.loadImgSrc(11),          //Loading条图片路径
                isCanClose: true,                          //是否可关闭
                isCanMinimize: true,                       //是否可最小化
                isCanFullScreen: false,                    //是否可全屏
                divState: "max",                           //层状态(最大或最小化)
                divStateFs: "normal",                      //层状态(全屏)
                isInitShow: true,                          //初始化是否显示
                borderWidth: 1,                            //边框宽度
                borderWidthB: null,                        //内容层边框宽度[默认值:0]
                speed: 500,                                //弹出,收回速度
                showSpeed: 300,                            //显示、隐藏速度
                loadSpeed: 1,                              //加载内容页的速度
                iframeTimeout: 5,                          //内容页iframe加载超时时间
                minSpeed: 500,                             //最小化速度
                left: null,                                //弹出后左边距
                top: null,                                 //弹出后上边距
                widthB: null,                              //内容层最大宽度[默认值:100%]
                heightB: null,                             //内容层最大高度[默认值:100%]
                shiftPercentH: 0,                          //高度为百分比时会减去该值
                isAutoSetHeight: true,                     //是否自动设置高度
                isAutoSetWidth: true,                      //是否自动设置宽度
                bodyPadding: null,                         //内容层补间宽度[默认值:{ t: 0, r: 0, b: 0, l: 0 }]
                outPadding: { t: 0, r: 0, b: 0, l: 0 },    //外层补间宽度
                zIndex: 10,                                //层在页面中的Z轴位置
                zIndexL: 1,                                //loading层Z轴位置
                loadType: "html",                          /*-------loadBody方法加载内容页方式--------*
                                                            * html:装填html形式加载
                                                            * ajax:ajax形式加载
                                                            * iframe:iframe形式加载
                                                            *-----*-----*-----*-----*-----*-----*-----*/
                onlyFirstLoad: null,                       /*-------loadBody方法是否加载内容页--------*
                                                            * null:每次都加载
                                                            * true:首次执行时加载
                                                            * false:不加载
                                                            *-----*-----*-----*-----*-----*-----*-----*/
                loadAfterShow: true,                       //是否在展示后加载内容页
                loadOnInit: false,                         //是否在初始化后加载内容页
                ajaxParams: {},                            //ajax参数
                bodyInId: null,                            //内容层ID
                noBodyScroll: false,                       //内容层是否不显示滚动条
                noBodyScrollX: false,                      //内容层是否不显示横滚动条
                noBodyScrollY: false,                      //内容层是否不显示纵滚动条
                iframeId: null,                            //内容层iframeID
                fnHtml: null,                              //加载html到内容层方法
                pHtml: null,                               //加载html到内容层方法参数
                bodyUrl: null,                             //加载内容层路径(用ajax、iframe方式加载)
                isAsync: true,                             //用ajax加载内容层时是否同步
                showLoading: false,                        //加载内容页时是否显示loading层
                headHeight: 25,                            //头部高度
                footHeight: 27,                            //底部高度
                hasShadow: false,                          //是否有阴影
                showHead: true,                            //是否显示头部
                showFoot: true,                            //是否显示底部
                isRenderHF: true,                          //是否渲染头部和底部
                radius: 0,                                 //圆角弧度
                canClose: true,                            //是否可被关闭
                autoBodySize: false,                       //浏览器大小改变时面板大小是否一起变化
                showOnInit: false,                         //初始化后是否显示
                showRendorBody: false,                     //显示时总是渲染在body标签下
                hasHeadClose: true,                        //是否有头部按钮
                btns: [                                    //按钮
                    {
                        txt: "按钮1",
                        fn: null
                    }
                ],
                hasDivGray: false,                         //是否有全屏遮罩层
                grayZindex: 100000,                        //全屏遮罩层的z轴位置
                grayOpacity: 80,                           //全屏遮罩层的透明度
                grayHideScroll: false,                     //开启全屏时是否隐藏页面滚动条
                colorParams: {                             //颜色参数
                    //borderOut: "#A2CEF1",
                    //bgColor: "#50B7E4",
                    bgColorBody: null,                     //内容层背景 #e6f5fa
                    borderBody: null,                      //内容层边框 #0f7cad
                    fontColorBody: null,                   //内容层字体颜色 #036ec1
                    shadow: null,                          //阴影颜色
                    bgColorHead: null,                     //头部背景色 #50B7E4
                    bgColorHeadJ: null,                    //头部背景渐变色(下) #3CA4D7
                    bgColorHeadJT: null,                   //头部背景渐变色(上) #6DD5FA
                    bgColorFoot: null,                     //底部背景色 #50B7E4
                    bgColorFootJ: null,                    //底部背景渐变色(下) #6DD5FA
                    bgColorFootJT: null,                   //底部背景渐变色(上) #3CA4D7
                    fontColorHead: null,                   //头部字体颜色 #ffffff
                    buttonColor: null,                     //按钮颜色 transparent
                    buttonColorG: null,                    //鼠标悬停按钮颜色 #ffffff
                    grayColor: "#373737"
                },
                evts: {
                    afterBodyLoadShow: null,               //内容加载完毕前(显示)
                    afterBodyLoadReload: null,             //内容加载完毕前(重刷)
                    afterBodyLoad: null,                   //内容加载完毕
                    afterClose: null,                      //关闭完毕
                    afterReLayout: null,                   //重布局完毕
                    beforeClose: null                      //关闭前
                },
                eType: (function (j) {
                    return {
                        afterBodyLoadShow: j,
                        afterBodyLoadReload: j,
                        afterBodyLoad: j,
                        afterBodyLoadI: j,
                        afterClose: j,
                        afterRender: j,
                        beforeClose: j,
                        beforeBodyLoad: j,
                        afterFirstLoad: j
                    };
                })("PJ")
            }, settings));

            //建立参数别名
            if (this.p.loadHTML != null) {
                this.p.fnHtml = this.p.loadHTML;
            }
            if (this.p.loadHTMLParams != null) {
                this.p.pHtml = this.p.loadHTMLParams;
            }
            if (this.p.urlType != null) {
                this.p.loadType = this.p.urlType;
            }
            if (this.p.url != null) {
                this.p.bodyUrl = this.p.url;
            }
            if (this.p.id != null) {
                this.p.bodyInId = this.p.id;
            }
            if (this.p.modal != null) {
                this.p.hasDivGray = this.p.modal;
            }

            this.pjBody = null;     //内容层
            this.pjLoad = null;     //loading半透明层
            this.objId = null;    //选中元素ID
            this.objOff = null;   //选中元素边距对象
            this.pjHead = null;   //头部
            this.pjTitle = null;  //标题
            this.pjBtnClose = null;  //关闭按钮
            this.pjBtnMin = null;    //最小化按钮
            this.isFirstLoad = true;    //是否第一次加载内容页
            this.fDdivGray = null;  //整页遮罩层

            //执行初始化
            this.initFn();

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            var thiz = this;
            this._super();
            this.create();

            if (this.p.loadOnInit) {
                this.loadBody();
            }
            if (this.p.showOnInit) {
                this.show();
            }
        },
        //#endregion

        //#region 构建
        create: function (isShow) {
            var thiz = this;
            this._super(isShow != null ? isShow : this.p.isInitShow);
            var isFilter = FJ.isIElt9 || (FJ.isIEgt9 && this.p.radius <= 0);// || FJ.isWebkit || FJ.isFF;

            //#region 外层
            this.divOut.attr("id", "PJ_" + this.objId).addClass("pj").css({
                paddingTop: (this.p.borderWidth > 1 ? this.p.headHeight + 2 : this.p.headHeight + 1) + "px",
                paddingBottom: (this.p.borderWidth > 1 ? this.p.footHeight + 2 : this.p.footHeight + 1) + "px",
                paddingLeft: this.p.outPadding.l,
                paddingRight: this.p.outPadding.r,
                zIndex: this.p.zIndex,
                width: this.p.width,
                height: this.p.isAutoSetHeight ? this.p.height : "auto",
                left: this.p.right == null ? this.p.left : "auto",
                top: this.p.bottom == null ? this.p.top : "auto",
                right: this.p.right != null ? this.p.right : "auto",
                bottom: this.p.bottom != null ? this.p.bottom : "auto"
            });
            if (this.p.colorParams.bgColorHeadJ) {
                this.divOut.css("background-color", this.p.colorParams.bgColorHeadJ);
            }
            //#endregion

            //#region 头部
            //面板头部
            this.pjHead = $('<div id="pj_head_' + this.objId + '" class="pj_head"></div>');
            this.pjHead.css("height", this.p.headHeight + "px");
            if (this.p.colorParams.bgColorHead) {
                this.pjHead.css("background-color", this.p.colorParams.bgColorHead);
            }

            //头部渐变色
            if (fj.isIElt9) {
                this.pjHead.addClass("pj_filterBgHead");
            }
            else if (fj.isOpera || fj.isIEgt9) {  //opera,IE9以上版本用svg做渐变背景
                this.pjHead.addClass("pj_svgBgHead");
            }
            else if (fj.isFF) {
                this.pjHead.addClass("pj_bgHead_ff");
            }
            else if (fj.isWebkit) {
                this.pjHead.addClass("pj_bgHead_wk");
            }

            this.pjHead.css({
                borderBottomWidth: this.p.borderWidth >= 3 ? this.p.borderWidth - 1 : this.p.borderWidth
            });
            if (this.p.colorParams.bgColorHeadJ) {
                this.pjHead.css("border-bottom-color", this.p.colorParams.bgColorHeadJ);
            }

            //是否显示头部
            if (!this.p.showHead) {
                this.divOut.css({ paddingTop: 0 });
                this.pjHead.hide();
            }

            this.pjHeadImg = $('<img style="width:' + this.p.imgSize.w + 'px;height:' + this.p.imgSize.h + 'px;' + (!this.p.showHeadImg ? 'display:none;' : '') + '" class="pj_img" src="' + this.p.imgTitleSrc + '" />');
            this.pjTitle = $('<div id="pj_title_' + this.objId + '" class="pj_title" >' + this.p.title + '</div>');
            if (this.p.colorParams.fontColorHead) {
                this.pjTitle.css("color", this.p.colorParams.fontColorHead);
            }

            //关闭按钮
            this.pjBtnClose = $('<div title="关闭" class="pj_btnR pj-head-btn pj-close" ><i class="icon-remove-circle" ></i></div>').onGestureJ(fj.Evt.click, function () {
                thiz.close();
            });

            //最小化按钮
            this.pjBtnMin = $('<div title="最小化" class="pj_btnR pj-head-btn pj-min" ><i class="icon-resize-small" ></i></div>').onGestureJ(fj.Evt.click, function (e, p) {
                thiz.maxMin();
                p.evt.stopPropagation();
            });

            //全屏按钮
            this.pjBtnFullScreen = $('<div title="全屏" class="pj_btnR pj-head-btn pj-fullscreen" ><i class="icon-fullscreen" ></i></div>').onGestureJ(fj.Evt.click, function (e, p) {
                thiz.fullScreen(thiz.p.showSpeed > 1 ? 0 : 1);
                p.evt.stopPropagation();
            });

            var btnColor = this.p.colorParams.buttonColor;
            if (btnColor) {
                this.pjBtnClose.css("background-color", btnColor);
                this.pjBtnMin.css("background-color", btnColor);
                this.pjBtnFullScreen.css("background-color", btnColor);
            }
            var btnColorG = this.p.colorParams.buttonColorG;
            if (btnColorG) {
                this.pjBtnClose.css("border-color", btnColorG);
                this.pjBtnMin.css("border-color", btnColorG);
                this.pjBtnFullScreen.css("border-color", btnColorG);
            }

            //绘制头部
            this.pjHead.addClass("pj-drj").append(this.pjHeadImg.addClass("pj-drj")).append(this.pjTitle.addClass("pj-drj"));
            if (this.p.hasHeadClose) {
                this.pjHead.append(this.pjBtnClose).append(this.pjBtnFullScreen).append(this.pjBtnMin);
            }
            this.pjHead.css("cursor", "auto");

            //设置是否可关闭
            if (!this.p.isCanClose) {
                this.pjBtnClose.hide();
            }

            //设置是否可最小化
            if (!this.p.isCanMinimize) {
                this.pjBtnMin.hide();
            }

            //设置是否可全屏
            if (!this.p.isCanFullScreen) {
                this.pjBtnFullScreen.hide();

                if (this.p.autoBodySize) {  //非全屏状态时页面大小改变时同时改变面板大小
                    $(window).bind("resize", function () {
                        if (!thiz.divOut.is(":hidden")) {
                            fj.lazyDo(function () {
                                this.reLayout();
                            }, thiz.p.layoutDelay, "ld_pj_layout", thiz);
                        }
                    });
                }
            }
            else {
                $(window).bind("resize", function () {  //全屏状态时页面大小改变时同时改变面板大小
                    if (!thiz.divOut.is(":hidden") && thiz.p.divStateFs == "fullscreen") {
                        fj.lazyDo(function () {
                            var h = fj.pageHeight() - (this.p.borderWidth * 2) - parseFloat(this.divOut.css("padding-top")) - parseFloat(this.divOut.css("padding-bottom"));
                            var w = fj.pageWidth() - (this.p.borderWidth * 2) - parseFloat(this.divOut.css("padding-left")) - parseFloat(this.divOut.css("padding-right"));
                            this.alterSize({
                                height: h,
                                width: w
                            });
                        }, thiz.p.layoutDelay, "ld_pjFS", thiz);
                    }
                });
            }
            //#endregion

            //#region 内容区域
            var bwb = this.p.borderWidthB;
            this.pjBody = $('<div id="pj_body_' + this.objId + '" class="pj_body" ></div>');

            if (this.p.bodyPadding) {
                this.pjBody.css("padding", this.p.bodyPadding.t + "px " + this.p.bodyPadding.r + "px " + this.p.bodyPadding.b + "px " + this.p.bodyPadding.l + "px");
            }
            if (this.p.widthB != null) {
                this.pjBody.css("width", this.p.widthB);
            }
            if (this.p.heightB != null) {
                this.pjBody.css("height", this.p.heightB);
            }
            if (bwb != null) {
                if (fj.RX.numZ(bwb)) {
                    this.pjBody.css("border-width", bwb);
                }
                else if (typeof bwb === "object") {
                    this.pjBody.css({
                        borderTopWidth: bwb.t,
                        borderRightWidth: bwb.r,
                        borderBottomWidth: bwb.b,
                        borderLeftWidth: bwb.l
                    });
                }
            }
            if (this.p.colorParams.bgColorBody) {
                this.pjBody.css("background-color", this.p.colorParams.bgColorBody);
            }
            if (this.p.colorParams.fontColorBody) {
                this.pjBody.css("color", this.p.colorParams.fontColorBody);
            }
            if (this.p.colorParams.borderBody) {
                this.pjBody.css("border-color", this.p.colorParams.borderBody);
            }

            //实际存放内容html的层
            this.bodyIn = $('<div class="pj_bodyIn"></div>');
            if (this.p.bodyInId) {
                this.bodyIn.attr("id", this.p.bodyInId);
            }
            if (this.p.noBodyScroll) {
                this.bodyIn.css("overflow", "hidden");
            }
            else {
                if (this.p.noBodyScrollX) {
                    this.bodyIn.css("overflow-x", "hidden");
                }
                if (this.p.noBodyScrollY) {
                    this.bodyIn.css("overflow-y", "hidden");
                }
            }

            //loading半透明层
            this.pjLoad = $(this.pjBody).LMJ({
                imgSrc: this.p.imgLoadSrc,
                zIndex: this.p.zIndexL
            });
            //#endregion

            //#region 底部
            //面板底部
            this.pjFoot = $('<div id="pj_foot_' + this.objId + '" class="pj_foot"></div>');
            this.pjFoot.css("height", this.p.footHeight + "px");
            if (this.p.colorParams.bgColorFoot) {
                this.pjFoot.css("background-color", this.p.colorParams.bgColorFoot);
            }

            //底部渐变色
            if (fj.isIElt9) {
                this.pjFoot.addClass("pj_filterBgFoot");
            }
            else if (fj.isOpera || fj.isIEgt9) {  //opera,IE9下用svg做渐变背景
                this.pjFoot.addClass("pj_svgBgFoot");
            }
            else if (fj.isFF) {
                this.pjFoot.addClass("pj_bgFoot_ff");
            }
            else if (fj.isWebkit) {
                this.pjFoot.addClass("pj_bgFoot_wk");
            }

            this.pjFoot.css({
                borderTopWidth: this.p.borderWidth >= 3 ? this.p.borderWidth - 1 : this.p.borderWidth
            });
            if (this.p.colorParams.bgColorFootJT) {
                this.pjFoot.css("border-top-color", this.p.colorParams.bgColorFootJT);
            }

            //是否显示底部
            if (!this.p.showFoot) {
                this.divOut.css({ paddingBottom: 0 });
                this.pjFoot.hide();
            }

            //按钮
            if (this.p.btns != null) {
                for (var i = 0; i < this.p.btns.length; i++) {
                    this["pjBtn" + (i + 1)] = $("<input type='button' value='" + this.p.btns[i].txt + "' class='pj_btn' />").addClass("pj_btnBottom");
                    (function (i) {
                        thiz["pjBtn" + (i + 1)].click(function () {
                            if (thiz.p.btns[i].fn != null) {
                                thiz.p.btns[i].fn.call(thiz);
                            }
                        });
                    })(i);
                    this.pjFoot.append(this["pjBtn" + (i + 1)]);
                }
            }
            //#endregion

            //#region 设置圆角
            var radius;
            if (FJ.isFF) {
                if (!FJ.isFFgt4) {
                    radius = "-moz-border-radius";
                }
                else {
                    radius = "border-radius";
                }
            }
            else if (FJ.isWebkit) {
                radius = "-webkit-border-radius";
            }
            else if (FJ.isOpera || FJ.isIEgt9) {
                radius = "border-radius";
            }
            if (radius && this.p.radius > 0) {
                this.divOut.css(radius, this.p.radius + "px");
                this.pjHead.css(radius, this.p.radius + "px " + this.p.radius + "px 0 0");
                this.pjFoot.css(radius, "0 0 " + this.p.radius + "px " + this.p.radius + "px");
            }
            this.radiusStyle = radius;
            //#endregion

            //#region 设置阴影
            var shadow;
            if (this.p.hasShadow && this.p.showType !== "slide") {
                this.divOut.addClass("pj_shadow");
                if (this.p.colorParams.shadow) {
                    if (FJ.isFF) {
                        if (!FJ.isFFgt4) {
                            shadow = "-moz-box-shadow";
                        }
                        else {
                            shadow = "box-shadow";
                        }
                    }
                    else if (FJ.isWebkit) {
                        shadow = "-webkit-box-shadow";
                    }
                    else if (FJ.isOpera || FJ.isIEgt9) {
                        shadow = "box-shadow";
                    }
                    if (shadow) {
                        this.divOut.css(shadow, "0px 0px 5px " + this.p.colorParams.shadow);
                    }
                }
            }
            //#endregion

            if (this.p.isRenderHF) {
                this.divOut.append(this.pjHead);
            }
            this.divOut.append(this.pjBody.append(this.bodyIn));
            if (this.p.isRenderHF) {
                this.divOut.append(this.pjFoot);
            }
            this.fire("afterRenderI");
            this.fire("afterRender", "PJ");

            return this;
        },
        //#endregion

        //#region 显示
        show: function (noLoadBody, cb, p) {
            this._super();

            if (this.p.loadAfterShow && !noLoadBody) {  //是否加载内容页
                this.loadBody("show", null, cb, p);
            }

            this.reLayout();
            return this;
        },
        //#endregion

        //#region 关闭
        close: function () {
            if (this.fire("beforeClose", "PJ") === false) {
                return this;
            }
            this._super();
            this.fire("afterClose", "PJ");
        },
        //#endregion

        //#region 操作内容区域
        //#region 加载内容区域
        loadBody: function (type, cb, cb2, p) {
            if (type == null) {
                type = "show";
            }
            if (type !== "reload" && this.p.onlyFirstLoad != null) {  //执行reload方法时不会考虑每次都强制刷新
                if (this.p.onlyFirstLoad) {
                    this.p.onlyFirstLoad = false;
                }
                else {
                    if (cb) {
                        cb.call(this);  //只有在onlyFirstLoad为false时执行第一个回调方法
                    }

                    this.fire("afterFirstLoad");  //在onlyFirstLoad为false,和内容页第一次加载完成后执行此事件
                    return this;
                }
            }

            var thiz = this;
            if (!cb) {  //如果第一个回调方法参数不为null则展示loading层
                this.showLoad(true);               //显示loading
            }
            this.fire("beforeBodyLoad", "PJ"); //加载前事件

            var fn = function () {
                switch (thiz.p.loadType) {
                    //#region 装填html形式加载
                    case "html":
                        if (thiz.p.fnHtml != null) {
                            var html = thiz.p.fnHtml.call(thiz, thiz.p.pHtml);
                            if (cb != null) {
                                cb.call(thiz);
                            }

                            var fm = document.createDocumentFragment();  //此处使用文档碎片,因jquery的html方法如加载多次相同节点时节点绑定的事件会自动移除
                            thiz.bodyIn.contents().each(function () {
                                fm.appendChild(this);
                            });

                            thiz.bodyIn.append(html);
                            var children = fm.childNodes;  //装填html后再将文档碎片清空
                            for (var i = 0, l = children.length; i < l; i++) {
                                if (children[i]) {
                                    fm.removeChild(children[i]);
                                }
                            }
                            fm = null;
                        }

                        thiz.loadBodyComplete(type, cb, cb2, p);  //执行回调函数
                        break;
                        //#endregion

                        //#region ajax形式加载
                    case "ajax":
                        $.ajax($.extend(true, {
                            type: "get",
                            url: thiz.p.bodyUrl,
                            cache: false,
                            async: thiz.p.isAsync,  //是否同步
                            success: function (resp) {
                                if (cb != null) {
                                    cb.call(thiz);
                                }
                                var re = thiz.fire("ajaxLoadComplete", { data: resp });
                                if (!re) {
                                    re = resp;
                                }
                                thiz.bodyIn.html(re);
                                thiz.loadBodyComplete(type, cb, cb2, p);  //执行回调函数
                            },
                            error: function (xhr, status) {
                                if (cb != null) {
                                    cb.call(thiz);
                                }
                                var re = thiz.fire("ajaxLoadError", { xhr: xhr, status: status });
                                if (!re) {
                                    re = "";
                                }
                                thiz.bodyIn.html(re);
                                thiz.loadBodyComplete(type, cb, cb2, p);  //执行回调函数
                            }
                        }, thiz.p.ajaxParams));
                        break;
                        //#endregion

                        //#region iframe形式加载
                    case "iframe":
                        var urlI = thiz.p.bodyUrl.indexOf("?") != -1 ? (thiz.p.bodyUrl + "&ts=" + new Date().getTime()) : (thiz.p.bodyUrl + "?ts=" + new Date().getTime());
                        var ifrId = !thiz.p.iframeId ? "iframe_" + thiz.objId : thiz.p.iframeId;
                        thiz.bodyIn.html("<iframe id='" + ifrId + "' style='position:absolute;z-index:0;border:0;' src='" + urlI + "' frameborder=none width=100% height=100%></iframe><div id='moveIframe_" + thiz.objId + "' style='display:none;width:100%;height:100%;position:absolute;z-index:100003;'></div>");

                        //iframe加载完毕回调函数
                        var oIfr = thiz.bodyIn.find("#" + ifrId), ifr = oIfr[0], loadOk = false;
                        thiz.bodyIframe = oIfr;  //保存iframe对象
                        if (ifr.attachEvent) {
                            ifr.attachEvent("onload", function () {
                                if (!timeOut) {
                                    if (cb != null) {
                                        cb.call(thiz);
                                    }
                                    thiz.loadBodyComplete(type, cb, cb2, p);
                                    loadOk = true;
                                }
                            });
                        }
                        else {
                            ifr.onload = function () {
                                if (!timeOut) {
                                    if (cb != null) {
                                        cb.call(thiz);
                                    }
                                    thiz.loadBodyComplete(type, cb, cb2, p);
                                    loadOk = true;
                                }
                            };
                        }

                        //为防止网络问题无法加载完毕,n秒后如果没有加载完毕就调用回调函数
                        var i = 0, timeOut = false;
                        var interval = setInterval(function () {
                            if (loadOk) {
                                clearInterval(interval);
                            }

                            i++;
                            if (i >= thiz.p.iframeTimeout) {
                                timeOut = true;
                                if (cb != null) {
                                    cb.call(thiz);
                                }
                                thiz.loadBodyComplete(type, cb, cb2, p);
                                clearInterval(interval);
                            }
                        }, 1000);
                        break;
                        //#endregion
                }
            };

            if (thiz.p.loadSpeed > 1) {
                fj.lazyDo(function () {   //加载内容层
                    fn();
                }, thiz.p.loadSpeed);
            }
            else {
                fn();
            }

            return thiz;
        },
        //#endregion

        //#region 加载内容区域完毕
        loadBodyComplete: function (type, cb, cb2, p) {
            switch (type) {
                case "show":
                    this.fire("afterBodyLoadShow", "PJ");
                    break;
                case "reload":
                    this.fire("afterBodyLoadReload", "PJ");
                    break;
            }

            //加载完毕后内容页滚动条移动到最上面
            this.bodyIn.scrollTop(0);

            this.fire("afterBodyLoadI", "PJ");
            this.fire("afterBodyLoad", "PJ");
            this.fire("afterFirstLoad", "PJ");  //在内容第一次加载完成后执行,窗口、浮动提示控件在onlyFirstLoad为false时也会执行此事件
            if (!cb) {
                this.showLoad(false);
            }
            this.isFirstLoad = false;
            this.fire("afterBodyLoadTabs", { type: type, p: p });  //为选项卡页提供加载完成事件
            if (cb2) {
                cb2.call(this);
            }
        },
        //#endregion

        //#region 刷新内容区域
        reload: function (url, ajaxP, cb) {
            if (url) {  //修改内容区域url
                this.p.bodyUrl = url;
            }
            if (ajaxP) {  //修改ajax参数
                this.p.ajaxParams = $.extend(true, this.p.ajaxParams, ajaxP);
            }

            this.loadBody("reload", null, cb);
        },
        //#endregion
        //#endregion

        //#region 显示、关闭loading遮罩层
        showLoad: function (isShow) {
            if (this.p.showLoading && this.pjLoad != null) {
                if (isShow === true || isShow === 1 || isShow == null) {
                    this.pjLoad.show();
                }
                else {
                    this.pjLoad.hide();
                }
            }
            return this;
        },
        //#endregion

        //#region 修改面板参数
        //#region 修改标题
        alterTitle: function (str) {
            if (this.pjTitle != null) {
                this.pjTitle.html(str);
            }
        },
        //#endregion

        //#region 修改面板大小
        alterSize: function (p, speed) {
            var thiz = this;
            this.alterP(p);

            if (speed != null && !fj.isIElt9) {  //旧版IE下动画效果不好，暂时不支持动画
                this.divOut.animate({
                    width: this.p.width,
                    height: this.p.height,
                    left: this.p.left,
                    top: this.p.top
                }, speed, function () {
                    fj.lazyDo(function () {
                        this.reLayout();
                    }, 200, "ld_pjAS", thiz);
                });
            }
            else {
                this.divOut.css({
                    width: this.p.width,
                    height: this.p.height,
                    left: this.p.left,
                    top: this.p.top
                });

                this.reLayout();
            }
        },
        //#endregion
        //#endregion

        //#region 窗体状态操作
        //#region 最小化
        min: function (speed, notSetRej) {
            if (this.pjBtnMin != null) {
                if (this.p.divState == "max") {
                    this.maxMin(null, speed, notSetRej);
                }
            }
        },
        //#endregion

        //#region 最大化
        max: function (speed, notSetRej) {
            if (this.pjBtnMin != null) {
                if (this.p.divState == "min") {
                    this.maxMin(null, speed, notSetRej);
                }
            }
        },
        //#endregion

        //#region 最小化相关操作
        minFn: function (cb, notSetRej) {
            if (this.rej != null && !notSetRej) {
                this.rej.p.onlyH = true;
            }

            this.divOut.css({
                borderBottomWidth: this.p.borderWidth >= 3 ? this.p.borderWidth - 2 : 1,
                borderBottomStyle: "solid"
            });

            this.pjBtnMin.attr("title", "最大化");

            if (this.p.showFoot) {
                this.divOut.css({ paddingBottom: 0 });
                this.pjFoot.hide();
            }

            this.pjBody.hide();
            this.p.divState = "min";
            if (cb) {
                cb.call(this);
            }
        },
        //#endregion

        //#region 最大化相关操作
        maxFn: function (cb, notSetRej) {
            if (this.rej != null && !notSetRej) {
                this.rej.p.onlyH = false;
            }

            this.divOut.css({
                borderBottomWidth: this.p.borderWidth,
                borderBottomStyle: "solid"
            });

            this.pjBtnMin.attr("title", "最小化");

            if (this.p.showFoot) {
                this.divOut.css({ paddingBottom: (this.p.borderWidth > 1 ? this.p.footHeight + 2 : this.p.footHeight + 1) + "px" });
                this.pjFoot.show();
            }
            this.p.divState = "max";

            if (cb) {
                cb.call(this);
            }
        },
        //#endregion

        //#region 最大、最小化
        maxMin: function (cb, speed, notSetRej) {
            var thiz = this,
                autoSetH = this.p.isAutoSetHeight,
                dO = this.divOut;

            if (speed == null) {
                speed = this.p.minSpeed;
            }
            if (this.pjBtnMin != null && this.p.divStateFs == "normal") {
                if (this.p.divState == "max") {
                    if (speed > 1) {
                        //this.divOut.animate({ height: [0/*, 'easeInCubic'*/] }, speed, function () {
                        //    thiz.minFn(cb, notSetRej);
                        //});

                        if (!autoSetH) {
                            dO.css("height", dO.height());
                        }
                        fj.lazyDo(function () {
                            dO.transitionJ({
                                //duration: speed,
                                height: 0,
                                evts: {
                                    stop: function () {
                                        thiz.minFn(cb, notSetRej);
                                    }
                                }
                            });
                        }, 25);
                    }
                    else {
                        this.divOut.height(0);
                        this.minFn(cb, notSetRej);
                    }
                }
                else if (this.p.divState == "min") {
                    this.pjBody.show();

                    if (speed > 1) {
                        //this.divOut.animate({ height: [this.actualHeight/*, 'easeOutBounce'*/] }, speed, function () {
                        //    thiz.maxFn(cb, notSetRej);
                        //});

                        dO.transitionJ({
                            //duration: speed,
                            height: this.p.height,
                            evts: {
                                stop: function () {
                                    thiz.maxFn(cb, notSetRej);
                                }
                            }
                        });
                    }
                    else {
                        this.divOut.height(this.p.height);
                        this.maxFn(cb, notSetRej);
                    }
                }
            }
        },
        //#endregion

        //#region 全屏
        fullScreen: function (noSpeed) {
            if (this.pjBtnFullScreen != null && this.p.divState == "max") {  //最小化状态时不能全屏
                if (this.p.divStateFs == "normal") {
                    this.pjBtnFullScreen.attr("title", "退出全屏");

                    //隐藏页面滚动条以便全屏显示
                    var oHtml = $("html"),
                        topS = oHtml.scrollTop(),
                        leftS = oHtml.scrollLeft();
                    this.ofO = oHtml.css("overflow");
                    oHtml.css("overflow", "hidden");

                    this.topO = parseFloat(this.divOut.css("top"));
                    this.leftO = parseFloat(this.divOut.css("left"));
                    this.hO = this.divOut.height();
                    this.wO = this.divOut.width();
                    var h = fj.pageHeight() - (this.p.borderWidth * 2) - parseFloat(this.divOut.css("padding-top")) - parseFloat(this.divOut.css("padding-bottom"));
                    var w = fj.pageWidth() - (this.p.borderWidth * 2) - parseFloat(this.divOut.css("padding-left")) - parseFloat(this.divOut.css("padding-right"));

                    this.alterSize({
                        height: h,
                        width: w,
                        top: topS != null ? topS : 0,
                        left: leftS != null ? leftS : 0
                    }, !noSpeed ? 300 : null);

                    if (this.p.fjType != "PJ" && typeof DRJ != "undefined") {
                        if (this.drj) {
                            this.drj.p.canDD = false;
                        }
                        if (this.rej) {
                            this.rej.p.canDD = false;
                        }
                    }
                    this.p.divStateFs = "fullscreen";
                }
                else if (this.p.divStateFs == "fullscreen") {
                    this.pjBtnFullScreen.attr("title", "全屏");

                    this.alterSize({
                        height: this.hO,
                        width: this.wO,
                        top: this.topO,
                        left: this.leftO
                    }, !noSpeed ? 300 : null);

                    //恢复页面滚动条原始状态
                    var oHtml = $("html");
                    oHtml.css("overflow", this.ofO);

                    if (this.p.fjType != "PJ" && typeof DRJ != "undefined") {
                        if (this.drj) {
                            this.drj.p.canDD = true;
                        }
                        if (this.rej) {
                            this.rej.p.canDD = true;
                        }
                    }
                    this.p.divStateFs = "normal";
                }
            }
        },
        //#endregion
        //#endregion

        //#region 全屏遮罩层
        //#region 加载全屏遮罩层
        addDivGray: function () {
            var thiz = this;
            if (!thiz.p.hasDivGray) {
                return;
            }

            if (!this.winjStoGrayFn) {  //使遮罩层适应页面大小变大
                this.winjStoGrayFn = function () {
                    fj.lazyDo(function () {
                        this.fDdivGray.css({ width: fj.pageWidth(), height: "100%" });
                    }, 300, "ld_winjModal", thiz);
                }
            }

            this.divOut.css("z-index", this.p.grayZindex + 2);
            this.fDdivGray = $('<div id="divDg_' + this.objId + '" style="background-color:' + this.p.colorParams.grayColor + ';filter:alpha(opacity=' + this.p.grayOpacity + ');opacity:' + this.p.grayOpacity / 100.0 + ';position:fixed;top:0;left:0;z-index:' + this.p.grayZindex + ';"></div>');
            //this.fDdivGray.css({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight });   $(document).width()
            this.fDdivGray.css({ width: fj.pageWidth(), height: "100%" });
            $(window).bind("resize", this.winjStoGrayFn);
        },
        //#endregion

        //#region 渲染全屏遮罩层
        renderDivGray: function () {
            var thiz = this;
            if (!thiz.p.hasDivGray) {
                return;
            }

            if (thiz.p.grayHideScroll) {  //隐藏页面滚动条以便全屏显示
                var oHtml = $("html");
                thiz.ofOW = oHtml.css("overflow");
                oHtml.css("overflow", "hidden");
            }

            FJ.oBody.prepend(thiz.fDdivGray);
        },
        //#endregion

        //#region 删除全屏遮罩层
        deleteDivGray: function () {
            var thiz = this;
            if (!thiz.p.hasDivGray) {
                return;
            }

            fj.lazyDo(function () {
                if (thiz.p.grayHideScroll) {  //恢复页面滚动条原始状态
                    var oHtml = $("html");
                    oHtml.css("overflow", thiz.ofOW);
                }

                if ($("#divDg_" + thiz.objId).length > 0) {
                    thiz.divOut.css("z-index", thiz.p.zIndex);

                    if (thiz.p.showSpeed > 1) {
                        thiz.fDdivGray.animate({
                            opacity: 0
                        }, 300, function () {
                            thiz.fDdivGray.remove();
                        });
                    }
                    else {
                        thiz.fDdivGray.remove();
                    }

                    if (thiz.winjStoGrayFn) { //去除使遮罩层适应页面大小变大事件
                        $(window).unbind("resize", thiz.winjStoGrayFn);
                    }
                }
                //else {
                //    thiz.deleteDivGray();  //未能删除时,继续递归删除
                //}
            }, 100);
        },
        //#endregion
        //#endregion

        //#region 重新布局
        reLayout: function () {
            var thiz = this,
                pa = thiz.p,
                shiftPercentH = pa.shiftPercentH,
                divOut = thiz.divOut;

            if (shiftPercentH && fj.RX.percent(pa.height)) {  //高度为百分比时会减去该值
                divOut.height(pa.height).height(divOut.height() - shiftPercentH);
            }

            thiz.fire("afterReLayout");
            if (pa.evts.afterFixSize) {  //兼容旧版本事件名
                thiz.fire("afterFixSize");
            }

            return thiz;
        }
        //#endregion
    });

    //#region 绑定到jquery
    $.fn.extend({
        PanelJ: function (settings) {
            if (this && this.length > 0) {
                return new FJ.PanelJ(this, fj.PJ_commonConfig ? $.extend(true, fj.clone(fj.PJ_commonConfig), settings) : settings);
            }
        },
        PJ: function (settings) {
            return $(this).PanelJ(settings);
        }
    });
    //#endregion

    //#region 图片文件夹路径
    PJ.imgFolderSrc = FJ.imgPath + "Panel/";
    //#endregion

});