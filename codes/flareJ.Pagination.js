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
* last update:2015-10-14
***********************************************************/

/*----------------------------------------------*
* flareJ.Pagination
*-------*-------*-------*-------*-------*-------*
* 分页控件
*-------*-------*-------*-------*-------*-------*
* [依赖]flareJ.AutoComplete
*----------------------------------------------*/
FJ.define("widget.Pagination", ["widget.AutoComplete"], function() {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                         分页控件
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.PaginationJ = this.PNJ = FJ.PaginationJ = FJ.PNJ = FJ.CJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "PNJ",
                renderTo: elemObj,                      //要加载到的容器
                width: "auto",                          //最大宽度
                height: 30,                             //最大高度
                borderWidth: 0,
                dataCount: 0,                           //数据总数
                noCount: false,                         //为true则在无法获取数据总数时使用
                pageSize: 10,                           //每页数据数
                isSetPageSize: false,                   //是否可以设置每页数据数
                pageSizes: [15, 30, 50],                //可选择的每页数据数
                storeName: null,                        //本地存储名称
                pageCount: 0,                           //总页数
                curPage: 0,                             //当前页码
                cpWidth: 45,                            //当前页文本框宽度
                pageInputCache: true,                   //是否有已加载页数缓存
                sort: "",                               //排序字段
                dir: "ASC",                             //排序方向
                showOnInit: false,                      //初始化时是否执行分页
                initDelay: 300,                         //初始化执行分页延迟时间
                pageInit: false,                        //分页数据是否初始化
                initData: {                             //分页初始化数据
                    page: null,
                    data: null,
                    count: null,
                    total: null
                },
                totalTxt: "条数据",
                url: null,                              //后台获取数据页面url
                urlData: {
                    type: "Get"
                },
                btnGoName: "确定",                      //跳转按钮上的字
                hasPages: true,                         //是否显示页数链接
                isLocal: false,                         //是否本地分页
                isAutoPageLocal: false,                 //是否本地数据自动分页
                data: null,                             //本地数据集
                showDataCount: true,                    //是否显示数据总数
                showPageSize: true,                     //是否显示每页数据数
                showPageCount: true,                    //是否显示总页数
                showRefresh: true,
                renderToAcj: "body",
                colorParams: {
                    bgColor: "transparent"              //背景色
                },
                evts: {
                    onPaging: null,                     //分页中事件
                    preOnPage: null,                    //执行分页前事件
                    finOnPage: null,                    //执行分页完成事件
                    preRefresh: function (e, p) {
                        if (typeof oDgj != "undefined") {
                            oDgj.clearPageCache();  //默认清空表格缓存
                        }
                    }
                }
            }, settings));

            this.initFn();

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            this._super();

            if (this.p.noCount) {  //如果获取不到总数,创建变量
                this.countC = 1;   //当前总数
                this.pagesC = {};  //记录已获取过的页码
                this.isComplete = false;
            }

            //检测是否存在自动提示控件
            if(fj.isMobile) {
                this.p.pageInputCache = false;
            }

            this.create();

            if (this.p.storeName) {  //从本地存储获取每页数据数
                var pageSize = fj.LocalStorage.getItem({ key: "pnj_pagesize_" + this.p.storeName });
                if (pageSize) {
                    this.p.pageSize = pageSize;
                }
            }

            //设置信息是否显示
            if (!this.p.showDataCount) {
                this.pnjDataCount.hide();
            }
            if (!this.p.showPageSize) {
                this.pnjPageSize.hide();
            }
            if (!this.p.showPageCount) {
                this.pnjPageCount.hide();
            }
            if (!this.p.showRefresh) {
                this.pnjRefresh.hide();
            }

            //默认加载数据
            if (this.p.showOnInit) {
                this.show();
            }
            else {
                if (this.p.pageInit) {
                    this.show(1);
                }
                else {
                    this.setVisible(false);
                }
            }
            
            //绑定滚动按钮
            this.sbnj = this.divOut.ScrollButtonJ({
                targetElem: this.pnjBody,
                top: 2,
                hasAnimate: true
            });
        },
        //#endregion

        //#region 构建
        create: function () {
            this._super();
            var thiz = this,
                hasPages = this.p.hasPages,
                pnjBody = null;

            //外层
            this.divOut.addClass("pnj").attr("id", "PNJ_" + this.objId).css({
                height: this.p.height,
                width: this.p.width
            });

            //主体
            this.pnjBody = pnjBody = $('<div class="pnj-body"></div>');

            //移动端设置
            if (fj.isMobile) {
                pnjBody.addClass("fj-mobile");
            }

            //数据总数
            this.pnjDataCount = $('<div class="pnj_info"></div>');
            this.pnjDataCountN = $('<span>' + this.p.dataCount + '</span>');
            this.pnjDataCount.append("共").append(this.pnjDataCountN).append(this.p.totalTxt);

            //每页数据数
            this.pnjPageSize = $('<div class="pnj_info"></div>');
            if (this.p.isSetPageSize) {
                this.pnjPageSizeN = $("<select class='fj-form-elem pnj_pageSize'></select>");
                for (var i = 0; i < this.p.pageSizes.length; i++) {
                    this.pnjPageSizeN.append("<option value=" + this.p.pageSizes[i] + ">" + this.p.pageSizes[i] + "</option>");
                }
                this.pnjPageSizeN.val(this.p.pageSize);

                //每页数据数改变后重刷新事件
                this.pnjPageSizeN.bind("change", function () {
                    thiz.p.pageSize = thiz.pnjPageSizeN.val();
                    if (thiz.p.storeName) {   //将每页数据数存储到本地存储中
                        fj.LocalStorage.setItem({ key: "pnj_pagesize_" + thiz.p.storeName, value: thiz.p.pageSize });
                    }

                    if (!thiz.p.noCount) {
                        //计算修改后的总页数,如果当前页超过总页数,跳转到最后一页
                        var pageCount = parseInt(thiz.p.dataCount % thiz.p.pageSize > 0 ? thiz.p.dataCount / thiz.p.pageSize + 1 : thiz.p.dataCount / thiz.p.pageSize, 10);
                        if (thiz.p.curPage <= pageCount) {
                            thiz.refresh();
                        }
                        else {
                            thiz.refresh(pageCount);
                        }
                    }
                    else {  //无法获取总数时翻回第一页
                        thiz.refresh();
                    }
                });
            }
            else {
                this.pnjPageSizeN = $('<span>' + this.p.pageSize + '</span>');
            }
            this.pnjPageSize.append("每页").append(this.pnjPageSizeN).append("条");

            //总页数
            this.pnjPageCount = $('<div class="pnj_info"></div>');
            this.pnjPageCountN = $('<span>' + this.p.pageCount + '</span>');
            this.pnjPageCount.append("共").append(this.pnjPageCountN).append("页");

            //分割线
            //this.pnjSplit = '<div class="pnj_split"></div>';

            //首页
            this.pnjFirst = $('<div class="pnj_btn pnj_btn_first" title="首页">首页</div>').bind("click", function () {
                if (thiz.pnjFirst.hasClass("pnj_btn_first")) {
                    thiz.onPage(1);
                }
            }).addClass("pnj_btn_first_g");

            //上一页
            this.pnjPrev = $('<div class="pnj_btn pnj_btn_prev" title="上一页"></div>').bind("click", function () {
                if (thiz.pnjPrev.hasClass("pnj_btn_prev")) {
                    thiz.onPage(parseFloat(thiz.p.curPage) - 1);
                }
            }).addClass("pnj_btn_prev_g");

            //下一页
            this.pnjNext = $('<div class="pnj_btn pnj_btn_next" title="下一页"></div>').bind("click", function () {
                if (thiz.pnjNext.hasClass("pnj_btn_next")) {
                    thiz.onPage(parseFloat(thiz.p.curPage) + 1);
                }
            }).addClass("pnj_btn_next_g");

            //末页
            this.pnjLast = $('<div class="pnj_btn pnj_btn_last" title="末页">末页</div>').bind("click", function () {
                if (thiz.pnjLast.hasClass("pnj_btn_last")) {
                    thiz.onPage(thiz.p.pageCount);
                }
            }).addClass("pnj_btn_last_g");

            //刷新
            this.pnjRefresh = $('<div class="pnj-btn-refresh" title="刷新"><i class="icon-refresh" ></i></div>').bind("click", function () {
                //thiz.onPage(thiz.p.curPage);
                thiz.refresh(thiz.p.curPage);
            });

            //当前页
            this.pnjTxt = $('<div class="pnj_txt"></div>');
            this.pnjCurPage = $('<input class="fj-form-elem pnj_curPage" type="text" value="' + this.p.curPage + '" />').bind("focus", function () {
                var thiz = this;
                setTimeout(function () {
                    thiz.select();
                }, 50);
            }).bind("blur", function () {
                if (thiz.p.dataCount > 0) {
                    if (!FJ.RX.ep.num.test(this.value)) {  //必须输入大于0的正整数
                        this.value = 1;
                    }
                }
            }).width(this.p.cpWidth);

            //页数缓存
            if (this.p.pageInputCache) {
                this.acjCp = this.pnjCurPage.ACJ({
                    renderTo: this.p.renderToAcj,
                    width: this.p.cpWidth,
                    shiftTop: 17,
                    maxHeight: 150,
                    loadMode: "local",
                    dataLimit: 100,
                    itemAlign: "right",
                    autoTurn: true,
                    zIndex: this.p.zIndex,
                    evts: {
                        afterSelect: function (e, p) {
                            thiz.onPage(Number(p.val));  //点击页码跳转
                        }
                    }
                });
            }

            this.pnjGo = $('<button type="button" class="btnj pnj-btn-go">' + this.p.btnGoName + '</button>').bind("click", function () {
                if (thiz.p.dataCount > 0) {
                    var cNum = parseFloat(thiz.pnjCurPage.val());
                    if (cNum <= parseFloat(thiz.p.pageCount)) {
                        thiz.onPage(cNum);
                    }
                    else {   //输入大于总页数时跳转到最后页
                        thiz.onPage(thiz.p.pageCount);
                    }
                }
            });
            this.pnjTxt.append('<div class="pnj_txt_div">到</div>').append(this.pnjCurPage).append('<div class="pnj_txt_div">页</div>').append(this.pnjGo);

            //渲染部件
            this.divOut.append(pnjBody.append(this.pnjFirst).append(this.pnjPrev));

            if (hasPages) {
                this.pnjPages = $('<div class="pnj_pages"></div>');  //页数列表
                pnjBody.append(this.pnjPages);
            }
            else {
                pnjBody.append(this.pnjTxt);
            }
            pnjBody.append(this.pnjNext).append(this.pnjLast).append(this.pnjPageCount).append(this.pnjDataCount).append(this.pnjPageSize);

            if (hasPages) {
                pnjBody.append(this.pnjTxt);
            }
            pnjBody.append(this.pnjRefresh);

            return this;
        },
        //#endregion

        //#region 显示
        show: function (pageInit) {
            var thiz = this;
            this._super();

            if (!pageInit) {  //如果不初始化分页数据则执行分页
                setTimeout(function () {
                    thiz.onPage(1);
                }, this.p.initDelay);
            }
            else {  //初始化分页数据
                var d = this.p.initData;
                this.fire("beforeInitData", d);
                this.update(d.page, d.data, d.count, d.total, null, null, 1);
            }
            return this;
        },
        //#endregion

        //#region 执行分页事件
        onPage: function (page, ex) {
            var thiz = this;
            this.pnjRefresh.find("i").swapClassJ("icon-refresh", "icon-spinner");

            //执行分页前事件
            this.fire("preOnPage");

            //修改参数
            this.p.urlData = $.extend(this.p.urlData, {
                curPage: page,
                pageSize: this.p.pageSize,
                sort: this.p.sort,
                dir: this.p.dir
            });

            //本地数据分页
            var allData, data;
            if (this.p.isLocal) {
                var size = parseInt(this.p.pageSize, 10);
                page = parseInt(page, 10);
                allData = this.p.data;
                data = [];

                if (allData && allData.length > 0) {
                    for (var i = (page - 1) * size, l = i + size; i < l; i++) {
                        var d = allData[i];
                        if (d) {
                            data.push(d);
                        }
                    }
                }
            }

            //分页中事件
            var p = { page: page, data: data, total: (allData != null ? allData.length : null), ex: ex };
            if (!this.p.isAutoPageLocal) {
                if (this.p.evts.OnPaging) {  //兼容旧版本事件名
                    this.fire("OnPaging", p);
                }
                else {
                    this.fire("onPaging", p);
                }
            }
            else {  //本地数据自动分页
                if (p.data && p.data.length > 0) {
                    this.update(p.page, p.data, p.data.length, p.total);
                }
                else {
                    this.update(p.page, [], 0, 0);
                }
            }

            //检测滚动按钮是否显示
            fj.lazyDo(function () {
                thiz.sbnj.checkShow();
            }, 500);
        },
        //#endregion

        //#region 更新分页数据
        update: function (page, data, count, total, dataF, params, noFinishEvt) {
            var thiz = this;

            if (!thiz.p.noCount) {
                thiz.p.dataCount = total;
            }
            else {  //取不到数据总数时
                if (!thiz.pagesC[page]) {
                    thiz.pagesC[page] = 1;  //计入已获取过的页码,存在则不更新
                    thiz.countC += count;   //累计获取数据数,比真实的总数多1

                    if (count < this.p.pageSize) {  //如果当前页获取数量小于每页数量,则认为本次查询信息已经全部获取完毕
                        thiz.countC -= 1;   //减去多加的1个
                        thiz.isComplete = true;
                    }
                    thiz.p.dataCount = thiz.countC;
                }
            }

            var pdcn = this.pnjDataCountN, dCount = this.p.dataCount;
            if (!thiz.p.noCount) {
                pdcn.text(dCount);
            }
            else {
                pdcn.text((dCount > 0 && !thiz.isComplete) ? dCount - 1 : dCount);  //取不到数据总数时将显示给用户看的总数-1
            }
            if (this.p.isSetPageSize) {  //可选择每页数据数
                this.pnjPageSizeN.val(this.p.pageSize);
            }
            else {
                this.pnjPageSizeN.text(this.p.pageSize);
            }

            //计算总页数
            this.p.pageCount = parseInt(this.p.dataCount % this.p.pageSize > 0 ? this.p.dataCount / this.p.pageSize + 1 : this.p.dataCount / this.p.pageSize, 10);
            this.pnjPageCountN.text(this.p.pageCount);

            var noOpe = false;  //不做操作标记

            if (count > 0) {
                this.setPageC(page);
            }
            else {
                if (!thiz.p.noCount) {
                    this.setPageC(0);
                }
                else {
                    if (page != 1) {
                        noOpe = true;
                    }
                    else {
                        this.setPageC(0);
                    }
                }
            }

            //设置按钮状态
            if (dCount > 0) {
                this.pnjFirst.removeClass("pnj_btn_first_g").addClass("pnj_btn_first");
                this.pnjPrev.removeClass("pnj_btn_prev_g").addClass("pnj_btn_prev");
                this.pnjNext.removeClass("pnj_btn_next_g").addClass("pnj_btn_next");
                this.pnjLast.removeClass("pnj_btn_last_g").addClass("pnj_btn_last");

                if (this.p.pageCount <= 1) {  //只有一页
                    this.pnjFirst.removeClass("pnj_btn_first").addClass("pnj_btn_first_g");
                    this.pnjPrev.removeClass("pnj_btn_prev").addClass("pnj_btn_prev_g");
                    this.pnjNext.removeClass("pnj_btn_next").addClass("pnj_btn_next_g");
                    this.pnjLast.removeClass("pnj_btn_last").addClass("pnj_btn_last_g");
                }
                else if (this.p.curPage == 1) {  //首页
                    this.pnjFirst.removeClass("pnj_btn_first").addClass("pnj_btn_first_g");
                    this.pnjPrev.removeClass("pnj_btn_prev").addClass("pnj_btn_prev_g");
                }
                else if (this.p.curPage == this.p.pageCount) {  //尾页
                    this.pnjNext.removeClass("pnj_btn_next").addClass("pnj_btn_next_g");
                    this.pnjLast.removeClass("pnj_btn_last").addClass("pnj_btn_last_g");
                }

                if (this.p.hasPages) {  //页数链接
                    this.pnjPages.empty();

                    if (this.p.pageCount <= 10) {  //页面总数小于等于10，全部显示
                        for (var i = 1; i <= this.p.pageCount; i++) {
                            (function (pa) {
                                thiz.pnjPages.append($("<div class='" + (i == thiz.p.curPage ? "pnj_pagesNoC" : "pnj_pagesNo") + "' title='第" + i + "页'>" + i + "</div>").click(function () {
                                    thiz.onPage(pa);
                                }));
                            })(i);
                        }
                    }
                    else {
                        //当前页码 <=  4,左侧显示所有 +  当前页码  +  右侧2个页码 + ... + 尾页
                        if (this.p.curPage <= 4) {
                            for (var i = 1; i <= this.p.curPage + 2; i++) {
                                (function (pa) {
                                    thiz.pnjPages.append($("<div class='" + (i == thiz.p.curPage ? "pnj_pagesNoC" : "pnj_pagesNo") + "' title='第" + i + "页'>" + i + "</div>").click(function () {
                                        thiz.onPage(pa);
                                    }));
                                })(i);
                            }
                            this.pnjPages.append($("<div>...</div>").click(function () {
                                thiz.onPage(parseFloat(thiz.p.curPage) + 1);
                            }));
                            this.pnjPages.append($("<div class='" + (thiz.p.pageCount == thiz.p.curPage ? "pnj_pagesNoC" : "pnj_pagesNo") + "' title='第" + thiz.p.pageCount + "页'>" + this.p.pageCount + "</div>").click(function () {
                                thiz.onPage(thiz.p.pageCount);
                            }));
                        }
                            //当前页码 > 4 且<= 页面总数(n) - 3,首页  + ... + 左侧2个页码  + 当前页码  + 右侧2个页码  + ...  +  尾页
                        else if (this.p.curPage > 4 && this.p.curPage <= this.p.pageCount - 3) {
                            this.pnjPages.append($("<div class='" + (1 == thiz.p.curPage ? "pnj_pagesNoC" : "pnj_pagesNo") + "' title='第1页'>1</div>").click(function () {
                                thiz.onPage(1);
                            }));
                            this.pnjPages.append($("<div>...</div>").click(function () {
                                thiz.onPage(parseFloat(thiz.p.curPage) - 1);
                            }));
                            for (var i = this.p.curPage - 2; i <= this.p.curPage + 2; i++) {
                                (function (pa) {
                                    thiz.pnjPages.append($("<div class='" + (i == thiz.p.curPage ? "pnj_pagesNoC" : "pnj_pagesNo") + "' title='第" + i + "页'>" + i + "</div>").click(function () {
                                        thiz.onPage(pa);
                                    }));
                                })(i);
                            }
                            this.pnjPages.append($("<div>...</div>").click(function () {
                                thiz.onPage(parseFloat(thiz.p.curPage) + 1);
                            }));
                            this.pnjPages.append($("<div class='" + (thiz.p.pageCount == thiz.p.curPage ? "pnj_pagesNoC" : "pnj_pagesNo") + "' title='第" + thiz.p.pageCount + "页'>" + this.p.pageCount + "</div>").click(function () {
                                thiz.onPage(thiz.p.pageCount);
                            }));
                        }
                            //当前页码 > 页面总数(n) - 3,首页 + ... +  左侧2个页面 +  当前页码  +  右侧显示所有
                        else if (this.p.curPage > this.p.pageCount - 3) {
                            this.pnjPages.append($("<div class='" + (1 == thiz.p.curPage ? "pnj_pagesNoC" : "pnj_pagesNo") + "' title='第1页'>1</div>").click(function () {
                                thiz.onPage(1);
                            }));
                            this.pnjPages.append($("<div>...</div>").click(function () {
                                thiz.onPage(parseFloat(thiz.p.curPage) - 1);
                            }));
                            for (var i = this.p.curPage - 2; i <= this.p.pageCount; i++) {
                                (function (pa) {
                                    thiz.pnjPages.append($("<div class='" + (i == thiz.p.curPage ? "pnj_pagesNoC" : "pnj_pagesNo") + "' title='第" + i + "页'>" + i + "</div>").click(function () {
                                        thiz.onPage(pa);
                                    }));
                                })(i);
                            }
                        }
                    }
                }
            }
            else {  //没有数据
                this.pnjFirst.removeClass("pnj_btn_first").addClass("pnj_btn_first_g");
                this.pnjPrev.removeClass("pnj_btn_prev").addClass("pnj_btn_prev_g");
                this.pnjNext.removeClass("pnj_btn_next").addClass("pnj_btn_next_g");
                this.pnjLast.removeClass("pnj_btn_last").addClass("pnj_btn_last_g");
                if (this.p.hasPages) {
                    this.pnjPages.empty();
                }
            }

            //页数缓存
            if (this.p.pageInputCache && !noOpe) {
                var arr = this.acjCp.p.data,
                    isExist = false;
                this.acjCp.isAllLastTime = false;  //保证每次更新都刷新数据

                for (var k = 0; k < arr.length; k++) {  //已存在的页数不加入集合
                    if (arr[k].text == page) {
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) {
                    arr.push({ text: page, value: page });
                }

                //排序
                arr.sort(function (a, b) {
                    return fj.Sort.compareNumber(a.text, b.text, true);
                });
            }

            //执行分页后事件
            if (!noFinishEvt) {
                this.fire("finOnPage", { data: data, page: page, total: total, dataF: dataF, params: params, noOpe: noOpe });
            }
            this.stopRefresh();
        },
        //#endregion

        //#region 刷新
        refresh: function (page, isInit, ex) {
            //刷新前
            this.fire("preRefresh", { page: page, data: this.p.data, isInit: isInit, ex: ex });

            //清除页数缓存
            if (this.p.pageInputCache) {
                this.acjCp.p.data.length = 0;
            }

            if (this.p.noCount) {  //取不到数据总数时，在刷新前执行初始化
                page = 1;
                this.isComplete = false;
                this.pagesC = {};
                this.countC = 1;
                this.p.dataCount = 0;
            }

            if (page == null) {
                this.onPage(this.p.curPage, ex);
            }
            else {
                this.onPage(page, ex);
            }
        },
        //#endregion

        //#region 清空数据
        clearData: function (page) {
            this.update(page ? page : 1, [], 0, 0);
        },
        //#endregion

        //#region 设置当前页数
        setPageC: function (page) {
            this.p.curPage = page;
            this.pnjCurPage.val(page);
        },
        //#endregion

        //#region 终止刷新图标
        stopRefresh: function () {
            this.pnjRefresh.find("i").swapClassJ("icon-spinner", "icon-refresh");
        }
        //#endregion
    });

    //#region 绑定到jquery
    $.fn.extend({
        PaginationJ: function (settings) {
            if (this && this.length > 0) {
                return new FJ.PaginationJ(this, fj.PNJ_commonConfig ? $.extend(true, fj.clone(fj.PNJ_commonConfig), settings) : settings);
            }
        },
        PNJ: function (settings) {
            return $(this).PaginationJ(settings);
        }
    });
    //#endregion

    //#region 图片文件夹路径
    FJ.PNJ.imgSrc = FJ.imgPath + "Pagination/";
    //#endregion

});