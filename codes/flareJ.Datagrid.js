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
* flareJ.Datagrid
*-------*-------*-------*-------*-------*-------*
* 表格
*-------*-------*-------*-------*-------*-------*
* [依赖]flareJ.ScrollBar
*       flareJ.Menu
*       flareJ.Window
*----------------------------------------------*/
FJ.define("widget.Datagrid", ["widget.ScrollBar", "widget.Menu", "widget.Window"], function() {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                           表格
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.DatagridJ = this.DGJ = FJ.DatagridJ = FJ.DGJ = FJ.CJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "DGJ",
                renderTo: elemObj,
                renderType: "prepend",
                renderToMuj: "body",                   //渲染区域(菜单)
                layoutDelay: 500,
                columns: [                             //列模板
                    {
                        text: "ID",
                        dataIndex: 'id'
                        //align: "center",
                        //width: 100,
                        //minWidth: 50, 
                        //maxWidth: 200,
                        //noSort: null,                 //是否禁止排序
                        //sortRows: [0]
                        //renderFn: function(v,d,i) {}  
                        /*
                         v:单元格值
                        */
                    }
                ],
                showOnInit: true,                      //是否初始化后显示
                emptyTxt: "没有数据",                  //没数据时显示的字
                emptyRowH: 30,                         //没数据时行高
                hasChk: false,                         //是否有复选框
                hideChk: false,                        //是否隐藏复选框
                hasChkAll: false,                      //是否有全选框
                isChkAll: false,                       //默认是否全选
                hasChkG: false,                        //分组行是否有复选框
                hasChkGR: false,                       //每组的子行是否有复选框
                hasChkT: false,                        //树结构是否有复选框
                isCheckOne: false,                     //只能单选
                defaultH: 20,                          //默认行高
                defaultHH: 20,                         //默认行高(表头)
                defaultHF: 20,                         //默认行高(表底)
                defaultW: 150,                         //默认列宽
                defaultMinW: 30,                       //默认最小列宽
                defaultAlign: "center",                //默认对齐方式
                lockColumn: 0,                         //冻结列(左侧)
                lockColumnR: 0,                        //冻结列(右侧)
                lcMinWidth: 80,                        //冻结表最小宽度
                dynamicLockColumn: false,              //是否可动态冻结列
                hasGroup: false,                       //是否有分组行
                renderGroupRow: null,                  //构建分组行
                renderSonRow: null,                    //构建分组内行
                sonRowName: "sonRows",                 //分组行子行数组名称
                asyncLoadSonRow: false,                //是否异步加载分组内行
                collapseSonRow: false,                 //是否可以折叠分组列
                collapseAnimate: false,                //是否开启折叠动画
                collapseSpeed: 400,                    //折叠动画速度
                isTree: false,                         //是否tree结构
                isTreeGrid: false,                     //是否treegrid结构
                nodeIndex: "nodes",                    //子节点集合对象名
                idField: "id",                         //每行数据唯一标识
                nodePathField: "nodePath",             //树节点路径对象名
                nodeChkField: "nodeChk",               //树节点复选框对象名
                asyncLoadTree: false,                  //是否异步加载树
                treeUrl: null,                         //异步加载树url
                judgeLeaf: null,                       //判断是否叶子节点方法
                isRowHighlight: fj.isMobile ? false : true,  //是否有行高亮效果
                treeLocalLazy: true,                   //树加载本地数据是否延迟加载
                checkAsyncLoad: null,                  //检测异步加载树是否出错
                nodeDeepRetract: 17,                   //树节点根据深度缩进值
                easing: "easeOutExpo",                 //缓冲动画类型
                chkStyle: true,                        //复选框是否使用自定义样式
                chkCollapse: false,                    //复选框是否使用折叠图标
                groupRowH: null,                       //分组行行高
                useSingleThColor: false,               //表头使用单色
                useNewRowColor: false,                 //动态加入新行时使用特殊颜色
                chkWidth: 20,                          //全选列头宽度
                canColumeDD: fj.isMobile ? false : true,  //是否可拖动列宽
                hideColumeDD: [],                      //不可拖动列宽的列
                canSort: true,                         //是否可排序
                isCustomSort: false,                   //是否自定义排序
                noSortSp: null,                        //表行禁止排序标记
                defaultSortCol: null,                  //默认排序列名
                defaultSortAsc: true,                  //默认排序顺序
                canCopy: true,                         //是否复制行数据
                canHideCol: true,                      //是否可隐藏列
                canFullScreen: true,                   //是否可全屏显示
                canExportCsv: true,                    //是否可导出csv
                csvDot: "'",                           //csv文件中英文逗号的替换符号
                canChangeTheme: true,                  //是否可切换主题
                canRefreshPage: true,                  //是否可刷新页面
                csvMenuName: "导出excel",              //导出csv菜单名
                csvFileName: "导出表格数据",            //导出csv默认文件名
                ddPosType: "offset",                   //计算拖动条位置使用的jquery方法:1、offset;2、position
                isLazyLoad: false,                     //是否延时加载
                lazyLoadSpeed: 5,                      //延迟加载速度
                lazyInfo: "表格数据还未完全显示,您可以向下拖动滚动条继续查看,或在右键菜单中选择\"显示全部数据\"。",  //延迟加载提示信息
                lazyDataLimit: 20,                     //查询出的数据超过此值后,使用延迟加载
                lazyScrollBottom: 150,                 //滚动条距底部到达此值时执行延迟加载
                isPageCache: false,                    //分页缓存
                highLightFade: FJ.isIElt9 ? 0 : 1,     //是否有行高亮
                hasFloatBtn: true,                     //是否有右上角浮动按钮
                floatBtnImg: null,                     //浮动按钮图标
                fbSpace: fj.isMobile ? false : true,   //浮动按钮是否占右侧一定宽度
                stopHideColumn: [],                    //禁止隐藏的列
                defaultHideColumn: [],                 //默认隐藏的列
                hasSelectColor: true,                  //选中行是否有颜色
                hasGridFoot: false,                    //是否有表格底部
                isMergeCellF: false,                   //是否设置表底合并单元格
                pMergeCellF: {                         //表底合并单元格参数
                    n: 2,
                    j: 1
                },
                isMergeCellV: false,                   //是否可纵向合并单元格
                mcShift: 7,                            //合并单元格宽度补间值
                hasRowContextMenu: fj.isMobile ? false : true,  //是否有行右击菜单
                hideMenuWidth: 150,                    //隐藏列菜单宽度
                contextMenuItems: [],                  //右击菜单项
                zIndexMenu: 601,                       //自定义设置菜单z轴位置
                zIndexMenuC: 602,                      //右击菜单z轴位置
                canSelectRow: false,                   //是否可选定行
                canSelectRowR: false,                  //右击是否选中行
                isReservedSbjH: false,                 //是否为横滚动条预留位置
                hideScrollH: fj.isMobile ? true : false,  //是否隐藏横滚动条
                isAutoSetHeight: true,                 //是否自动计算高度
                isAutoSetWidth: true,                  //是否自动计算宽度 
                width: 450,                           //最大宽度
                height: "auto",                       //最大高度
                borderWidth: 0,                        //表格外层边框线宽度
                storeName: null,                       //本地存储名称
                quickRenderMode: false,                //快速渲染模式
                sortLoading: false,                    //排序时是否显示loading提示
                exportCol: null,                       //导出列集合,格式如["col1","col2"]
                noGridBorder: false,                   //是否没有网格线
                noBorder: false,                       //是否没有外边框线
                isShowNodeImg: true,                   //是否显示节点图标
                hideImgB: false,                       //是否隐藏叶子节点占位空白
                imgBw: 16,                             //节点占位空白宽度
                imgBmarginR: 2,                        //节点占位空白右侧边距
                nodeMarginL: 10,                       //树节点左侧边距
                filterTag: null,                       //隐藏列时按tr、td属性过滤
                isHideHead: false,                     //是否隐藏表头
                hasHeadTip: false,                     //是否有表头浮动提示
                headTipConfig: null,                   //表头浮动提示配置参数
                autoNo: null,                          //自增序号,设置为data集合属性名称
                cellPadding: null,                     //td设置padding值
                cellInnerPadding: null,                //td内div设置padding值
                editSetHeight: false,                  //切换可编辑时是否设置表格高度
                compatibleMode: false,                 //兼容模式
                useObjParam: false,                    //部分方法是否使用对象参数
                percentWidth: false,                   //是否设置百分比宽度
                hideBlankImg: false,                   //隐藏占位图标
                colorParams: {
                    borderOut: null,
                    bgColor: null,                     //背景色
                    highlight: null,                   //鼠标移上高亮
                    select: "#d2e1f6",                 //选中行(setRowSelect方法中使用)
                    trColor1: null,                    //奇数行颜色 #ffffff
                    trColor2: null,                    //偶数行颜色 #F8F8D3 #F3FBFE
                    //trColor3: "#F3FBFE",             //分组显示时第一个表行颜色
                    thColor: null,                     //表头颜色(不使用渐变色) #FEF6E1
                    //thColor1: "#ffffff",             //表头渐变色1
                    //thColor2: "#DEF5FD",             //表头渐变色2
                    groupRow: null,                    //分组表头颜色1 #FFF7E7
                    groupRow2: null,                   //分组表头颜色2 #ffffed
                    newRow: "#e1e1e1",                 //新添加的分组行颜色
                    spRowColor: "#FFCC00",             //特殊行颜色
                    selectColor: null,                 //选中颜色 #e1e1e1 #FBEC88 #FECCFF
                    trColorFoot: null                  //表底颜色 #66FF66 #E4F7FE
                },
                evts: {
                    dataLoaded: null,                  //数据加载完毕
                    afterSetWidth: null,               //设置宽度完毕
                    preColumnRender: null,             //列加载前事件
                    rowContextMenu: null,              //行右击菜单事件
                    beforeCopy: null,                  //复制前事件
                    beforeSortLoading: null,           //排序loading前事件
                    afterSortLoading: null             //排序loading后事件
                },
                eType: (function (j) {
                    return {
                        afterRender: j,
                        initComplete: j,
                        beforeRemove: j
                    }
                })("DGJ")
            }, settings));

            this.initFn();
            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            var thiz = this;

            this.hasAnimateHl = false;  //jquery版本小于1.8时可有高亮动画
            if (fj.jQversion) {
                if (fj.jQversion[0] < 2 && fj.jQversion[1] < 8) {
                    this.hasAnimateHl = jQuery.fx.step.backgroundColor && this.p.highLightFade;
                }
            }

            if (this.p.isTree) {
                this.p.hideChk = true;
            }

            //预加载加载中图标
            LMJ.preLoadImg(3);
            LMJ.preLoadImg(4);

            this.useMbj = true;
            this.data = [];  //数据列表
            this.data.lengthD = 0;
            this.rows = [];  //行集合
            this.pageNo = 1;   //默认当前页码为1
            //this.mergeCells = [];  //合并单元格任务集合
            this._super();
            this.isLoading = false;

            //使用分页缓存
            if (this.p.isPageCache) {
                this.pageCache = [];
                this.datas = [];
            }

            if (this.p.isLazyLoad) {
                this.lazyRowNo = 0;
            }
            else {
                this.p.lazyDataLimit = -1;
            }

            if (this.p.collapseSonRow) {  //计算分组列宽补间值
                this.shiftG = 10;
                if (FJ.isIElt8) {
                    this.shiftG = 12;
                }
                else if (FJ.isIE8 || FJ.isIE9 || FJ.isIE10 || FJ.isWebkit || FJ.isOpera) {
                    this.shiftG = 11;
                }
            }

            if (this.p.canFullScreen)
                this.isFullScreen = false;

            if (this.p.storeName) {  //从本地存储获取列隐藏状态
                try {
                    var defCol = FJ.LocalStorage.getItem({ key: this.p.storeName + "_hide" });  //获取默认隐藏列
                    if (defCol) {
                        var colState = JSON.parse(defCol);
                        //                        for (var i = 0,l = this.p.columns.length;i < l;i++) {  //先设置为全部显示状态
                        //                            this.p.columns[i].isHide = false;
                        //                        }
                        for (var i = 0, l = colState.length; i < l; i++) {  //设置需隐藏的列
                            var no = colState[i];
                            this.p.columns[no].isHide = true;
                        }
                    }
                    else {
                        this.hideColumnD();  //如果本地存储中记录了隐藏列状态，则不设置默认隐藏列
                    }

                    var defColWidth = FJ.LocalStorage.getItem({ key: this.p.storeName + "_colWidth" });  //获取默认列宽
                    if (defColWidth) {
                        var colWidth = JSON.parse(defColWidth);
                        for (var o in colWidth) {  //设置默认列宽
                            this.p.columns[o].width = colWidth[o];
                        }
                    }
                }
                catch (e) { }
            }
            else {
                this.hideColumnD();  //设置默认隐藏列
            }

            for (var i = 0, l = this.p.columns.length; i < l; i++) {
                var col = this.p.columns[i];  //设置冻结列标记
                if (this.p.lockColumn && i < this.p.lockColumn - 1) {
                    col.lockCol = "l";
                }
                else if (this.p.lockColumnR && i >= this.p.lockColumnR - 1) {
                    col.lockCol = "r";
                }

                col.colId = i;  //设置列唯一标识
            }

            var oNbsp = $("#nbspFixJ");
            if (!oNbsp.length) {  //创建隐藏域用于过滤&nbsp;
                oNbsp = $('<input type="hidden" id="nbspFixJ" value="&nbsp;" />');
                FJ.oBody.prepend(oNbsp);
            }
            this.nbspJ = oNbsp.val();

            if (this.p.isTreeGrid) {
                //tree空白节点填充块
                this.blankImg = '<img class="dgj_blank' + (this.p.hideBlankImg ? ' fj-hidden-pc' : '') + '" style="width:' + this.p.imgBw + 'px;margin-right:' + this.p.imgBmarginR + 'px;" src="' + fj.imgPath + 'Datagrid/treegrid/s.gif" />';

                if (this.p.asyncLoadTree) {  //异步加载数据与延迟加载本地数据属性不可共存
                    this.p.treeLocalLazy = false;
                }
                //this.p.canSort = false;  //禁止排序
                this.p.chkStyle = false;  //树形表格不使用复选框样式
            }
            if (this.p.isTree) {
                this.p.isHideHead = true;
            }

            if (this.p.noGridBorder) {  //无单元格边线时合并单元格补间值需要稍微减少一点
                this.p.mcShift -= 2;
            }
            if (this.p.isMergeCellV) {
                this.p.canSort = false;  //禁止排序
            }
            for (var i = 0, c = this.p.columns, l = c.length; i < l; i++) {
                if (c[i].columnGroup != null) {
                    this.columnGroup = {};  //标记有分组列
                    this.p.canHideCol = false;  //有分组列时暂时不支持隐藏列
                    break;
                }
            }

            //移动端设置
            if (fj.isMobile) {
                this.p.canExportCsv = false;
                this.p.hasRowContextMenu = false;
            }

            //构建表格
            this.create();

            if (this.p.showOnInit) {
                this.show();

                //setTimeout(function() {   //初始化表格,此处需延时处理防止界面初始化时FF下出现样式问题
                thiz.clearData(true);
                thiz.fire("initComplete", "DGJ");
                //}, 0);
            }

            if (this.p.hasGridFoot && this.p.isMergeCellF) {  //设置表底合并单元格
                this.mergeCellFn(this.p.pMergeCellF.n, this.p.pMergeCellF.j, this.trF);
            }

            if (this.p.lockColumn) {  //有冻结列时不支持折叠动画
                this.p.collapseAnimate = false;
            }

            if (fj.isFF) {
                setTimeout(function () {
                    thiz.reLayout();
                }, 1000);
            }
        },
        //#endregion

        //#region 构建
        create: function () {
            var thiz = this;
            this._super();

            //外层
            this.divOut.attr("id", "DGJ_" + this.objId).addClass("dgj").css({
                width: this.p.width,
                height: this.p.height
            });

            //移动端可横向滚动
            if (fj.isMobile) {
                this.divOut.addClass("fj-mobile");
            }

            //#region 构建表体
            //表头容器
            this.headContainer = $('<div class="dgj_headContainer"></div>');
            if (this.p.isHideHead) {
                this.headContainer.height(0);
            }
            if (this.p.borderWidth) {
                this.headContainer.addClass("dgj_headContainerB");
            }

            //表体容器
            this.bodyContainer = $('<div class="dgj_bodyContainer' + (fj.isMobile ? ' fj-mobile' : '') + '"></div>');
            if (!this.p.isTree) {
                this.bodyContainer.bind("scroll", function () {
                    if ((FJ.isIElt8) && thiz.p.lockColumn) {  //解决IE8以下IE冻结表体不随滚动条滚动问题
                        thiz.lcContainer.css("position", "static");
                        FJ.lazyDo(function () {
                            this.lcContainer.css("position", "relative");
                            var scrollL = this.sbj.getScrollLeft();
                            if (scrollL > 0) {
                                this.sbj.setScrollLeft(scrollL + 1);
                                this.sbj.setScrollLeft(scrollL - 1);
                            }
                            else {
                                this.setDDPosition(true);
                            }
                        }, 500, "ld_dgjScV", thiz);
                    }

                    FJ.lazyDo(function () {
                        this.headContainer.scrollLeft(this.bodyContainer.scrollLeft());

                        if (this.p.isLazyLoad) {   //主体滚动条拖到最下面时延迟加载行
                            if (this.lazyRowNo > this.data.length - 1) {
                                //this.p.canSort = true;
                                this.divOut.attr("title", "");
                                return;
                            }
                            this.lazyAddRow();
                            this.joinCacheData();  //连接缓存数据集
                        }
                    }, thiz.p.lazyLoadSpeed, "ld_dgjBodyC", thiz);
                });
            }

            //表头
            this.tableHead = $('<table class="dgj_tableH1"></table>');
            if (this.p.borderWidth) {
                this.tableHead.css("margin-left", -1);
            }

            //主体容器(头部)
            this.mainHeadContainer = $('<div class="dgj_mainHeadContainer"></div>');
            this.mainHeadContainer.append(this.tableHead);

            //表体
            this.table = $('<table class="dgj_table1"></table>');
            if (this.p.isHideHead) {
                this.table.css("marginTop", 0);
            }
            if (this.p.borderWidth) {
                this.table.css("margin-left", -1);
            }
            if (this.p.noBorder) {
                this.table.css("border-width", 0);
            }

            //主体容器
            this.mainContainer = $('<div class="dgj_mainContainer"></div>');
            if (this.p.percentWidth) {  //todo 表格宽度设置100%
                this.mainContainer.css("width", "100%");
                this.table.css("width", "100%");
            }
            this.mainContainer.append(this.table);

            //表格容器
            this.gridContainer = $('<div class="dgj_gridContainer"></div>');
            this.gridContainer.append(this.headContainer.append(this.mainHeadContainer)).append(this.bodyContainer.append(this.mainContainer));

            if (this.p.hasGridFoot) {  //表底
                this.footContainer = $('<div class="dgj_footContainer"></div>');
                this.tableFoot = $('<table class="dgj_tableF1"></table>');
                this.mainFootContainer = $('<div class="dgj_mainFootContainer"></div>');
                this.mainFootContainer.append(this.tableFoot);
                this.gridContainer.append(this.footContainer.append(this.mainFootContainer));
            }

            //下滚动条容器
            this.sBarHContainer = $('<div class="dgj_sBarHContainer"></div>');
            //#endregion

            //#region 冻结表
            if (this.p.lockColumn) {  //冻结表(左)
                //表头
                this.tableHead2 = $('<table class="dgj_tableH2"></table>').css("margin-left", -1);

                //锁定列表容器(头部)
                this.lcHeadContainer = $('<div class="dgj_lcHeadContainer"></div>');
                this.lcHeadContainer.append(this.tableHead2);

                //锁定列表容器
                this.lcContainer = $('<div class="dgj_lcContainer"></div>');

                this.mainHeadContainer.css("width", "auto");
                this.mainContainer.css("width", "auto");
                this.table2 = $('<table class="dgj_table2"></table>').css("margin-left", -1);
                if (this.p.isHideHead) {
                    this.table2.css("marginTop", 0);
                }
                if (this.p.noBorder) {
                    this.table2.css("border-width", 0);
                }
                this.lcContainer.append(this.table2);
                this.thead2 = $('<thead></thead>');
                this.trH2 = $('<tr></tr>');
                this.thead2.append(this.trH2);
                if (this.columnGroup) {
                    this.trHcg2 = $('<tr></tr>');
                    this.thead2.append(this.trHcg2);
                }
                this.thds2 = [];  //各冻结表头表格th内部div集合，用于设置拖动条
                this.ths2 = [];
                this.tbody2 = $('<tbody></tbody>');
                this.tableHead2.append(this.thead2);
                this.table2.append(this.tbody2);
            }

            if (this.p.lockColumnR) {  //冻结表(右)
                //表头
                this.tableHead3 = $('<table class="dgj_tableH3"></table>');

                //锁定列表容器(右,头部)
                this.rightHeadContainer = $('<div class="dgj_rightHeadContainer"></div>');
                this.rightHeadContainer.append(this.tableHead3);

                //锁定列表容器(右)
                this.rightContainer = $('<div class="dgj_rightContainer"></div>');

                this.table3 = $('<table class="dgj_table3"></table>');
                if (this.p.isHideHead) {
                    this.table3.css("marginTop", 0);
                }
                if (this.p.noBorder) {
                    this.table3.css("border-width", 0);
                }
                this.mainContainer.css("width", "auto");
                this.rightContainer.append(this.table3);
                this.thead3 = $('<thead></thead>');
                this.trH3 = $('<tr></tr>');
                this.thead3.append(this.trH3);
                if (this.columnGroup) {
                    this.trHcg3 = $('<tr></tr>');
                    this.thead3.append(this.trHcg3);
                }
                this.thds3 = [];  //各冻结表头表格th内部div集合，用于设置拖动条
                this.ths3 = [];
                this.tbody3 = $('<tbody></tbody>');
                this.tableHead3.append(this.thead3);
                this.table3.append(this.tbody3);
            }
            //#endregion

            //#region 表头
            this.thead = $('<thead></thead>');
            this.trH = $('<tr></tr>');
            this.thead.append(this.trH);
            if (this.columnGroup) {
                this.trHcg = $('<tr></tr>');
                this.thead.append(this.trHcg);
            }
            this.tableHead.append(this.thead);
            if (this.p.hasChk) {  //是否有复选框
                this.chks = [];
                this.thAll = $('<th class="dgj_cell" chkCell="true" style="text-align:center;' + (!this.p.hideChk ? '' : 'display:none;') + (this.p.borderWidth ? 'border-top:0;border-bottom:0;' : '') + '"></th>').css({
                    height: this.p.defaultHH
                });
                this.tdDivAll = $('<div chkCellDiv="true" class="dgj_tdDiv dgj_chkDiv"></div>').css({
                    width: this.p.chkWidth
                });
                this.thAll.append(this.tdDivAll);

                if (this.p.hasChkAll && !this.p.isCheckOne) {  //是否有全选框
                    this.chkAll = $('<input title="全选" id="dgj_chkall_' + this.p.objId + '" type="checkbox" hidefocus />');
                    if (this.p.chkStyle) {  //复选框使用自定义样式
                        this.sbxjAll = this.chkAll.SBXJ({
                            initClass: "dgj_chkC",
                            type: this.p.chkCollapse ? "collapse" : null,
                            isInitHide: false,
                            canQuery: false
                        });
                        this.tdDivAll.append(this.sbxjAll.divOut);
                    }
                    else {
                        this.tdDivAll.append(this.chkAll);
                    }
                    this.chkAll.click(function (e) {
                        e.stopPropagation();
                        thiz.fnChkAll(this);
                        thiz.fire("checkedAll", { checked: this.checked });
                    });
                }
                this.trH.append(this.thAll);
            }

            var renderFns = [];  //表头渲染方法集合
            this.thds = [];  //表头th内部div集合，用于确定表体列宽
            this.thds1 = [];  //各冻结表头表格th内部div集合，用于设置拖动条
            this.ths1 = [];

            //加载表头列
            for (var i = 0, cols = this.p.columns, l = cols.length, i1 = 0, i2 = 0, i3 = 0, j = 0; i < l; i++) {
                var oTrH, oTrH0, thdsT, thsT,
                    cType = this.getColType(i),
                    c = cols[i],
                    noCg = !this.columnGroup || !c.columnGroup;
                switch (cType) {
                    case 0:
                    case 1:
                        if (noCg) {
                            oTrH = this.trH;
                        }
                        else {
                            oTrH = this.trHcg;
                            oTrH0 = this.trH;
                        }
                        thdsT = this.thds1;
                        thsT = this.ths1;
                        j = i1;
                        i1++;
                        break;
                    case 2:
                        if (noCg) {
                            oTrH = this.trH2;
                        }
                        else {
                            oTrH = this.trHcg2;
                            oTrH0 = this.trH2;
                        }
                        thdsT = this.thds2;
                        thsT = this.ths2;
                        j = i2;
                        i2++;
                        break;
                    case 3:
                        if (noCg) {
                            oTrH = this.trH3;
                        }
                        else {
                            oTrH = this.trHcg3;
                            oTrH0 = this.trH3;
                        }
                        thdsT = this.thds3;
                        thsT = this.ths3;
                        j = i3;
                        i3++;
                        break;
                }

                oTrH.append((function (c, i, t) {
                    var thDiv = $('<div class="dgj_tdDiv dgj_thDiv"></div>');
                    if (!thiz.p.isHideHead) {
                        thDiv.css({
                            width: thiz.p.defaultW
                        });
                    }
                    if (c.headTip) {  //表头提示信息
                        thDiv.attr("headTip", c.headTip);
                    }

                    if (!c.headerFn) {  //渲染表头
                        thDiv.append('<span class="dgj_thSp">' + c.text + '</span>');
                    }
                    else {
                        aRf = [thDiv, c.headerFn, c.text, c, i, oTrH];
                        renderFns.push(aRf);
                        //thDiv.append(c.headerFn.call(thiz, c.text, c, i, oTrH));
                    }

                    var th = $('<th class="dgj_cell" ' + (thiz.p.borderWidth ? 'style="border-top:0;border-bottom:0;"' : '') + '></th>').css({
                        height: thiz.p.defaultHH
                    });
                    th.attr("colId", i);  //设置单元格列唯一标识

                    if (c.editable) {  //是否可编辑
                        th[0].style.padding = "0px";
                        thDiv[0].style.padding = "0px 5px 0px 1px";
                    }

                    //if (!thiz.p.hasGroup) {
                    if (thiz.p.canSort && !c.noSort) {
                        thiz.setCellSort(i, c, th, thDiv, true);
                    }
                    //}

                    if (c.width) {
                        if (!thiz.p.isHideHead) {
                            thDiv.css({
                                width: c.width
                            });
                        }
                    }
                    else {
                        thiz.columnP = i;  //记录未设置宽度的列数
                    }
                    th.append(thDiv);

                    if (thiz.columnGroup) {  //分组列
                        if (!c.columnGroup) {
                            th.attr("rowspan", 2);
                        }
                        else {
                            var cg = thiz.columnGroup[c.columnGroup];
                            if (!cg) {
                                cg = $('<th class="dgj_cell" colspan="1" dgjCs="1"><div class="dgj_tdDiv dgj_thDiv">' + c.columnGroup + '</div></th>');
                                thiz.columnGroup[c.columnGroup] = cg;
                                oTrH0.append(cg);

                                if (thiz.p.lockColumn) {
                                    switch (t) {  //标记各冻结表是否有分组列
                                        case 0:
                                        case 1:
                                            thiz.hasCg1 = true;
                                            break;
                                        case 2:
                                            thiz.hasCg2 = true;
                                            break;
                                        case 3:
                                            thiz.hasCg3 = true;
                                            break;
                                    }
                                }
                            }
                            else {
                                var cs = parseInt(cg.attr("dgjCs"), 10);
                                cg.attr("colspan", cs + 1);
                            }
                        }
                    }

                    thiz.thds.push(thDiv[0]);  //保存th对象集合
                    thdsT.push(thDiv[0]);
                    thsT.push(th[0]);
                    return th;
                })(c, i, cType));

                if (c.mergeCellH) {  //合并表头单元格
                    this.mergeCellH(c.mergeCellH, j, oTrH);
                    for (var k = i; k > i - c.mergeCellH; k--) {  //表头被合并的单元格暂时不支持拖动列宽
                        this.p.hideColumeDD[this.p.hideColumeDD.length] = k;
                    }
                }
                //                if(i == cols.length - 1){
                //                    var th = $('<th></th>').css({
                //                        height: 0,
                //                        width: 0,
                //                        padding: 0,
                //                        fontSize: 0,
                //                        border: 0
                //                    });
                //                    oTrH.append(th);
                //                }
            }

            //执行渲染方法
            for (var k = 0, l = renderFns.length; k < l; k++) {
                var rf = renderFns[k],
                    v = rf[1].call(thiz, rf[2], rf[3], rf[4], rf[5]);
                rf[0].append('<span class="dgj_thSp">' + v + '</span>');
            }

            this.thds = $(this.thds);  //将th对象集合转化为jquery元素集合
            this.thds1 = $(this.thds1);
            this.ths1 = $(this.ths1);
            if (this.p.lockColumn) {
                this.thds2 = $(this.thds2);
                this.ths2 = $(this.ths2);
            }
            if (this.p.lockColumnR) {
                this.thds3 = $(this.thds3);
                this.ths3 = $(this.ths3);
            }
            //#endregion

            //#region 表底
            if (this.p.hasGridFoot) {
                this.tfoot = $('<tfoot></tfoot>');
                this.trF = $('<tr></tr>');
                if (this.p.colorParams.trColorFoot) {
                    this.trF.css("background-color", this.p.colorParams.trColorFoot);
                }
                this.tfoot.append(this.trF);
                this.tableFoot.append(this.tfoot);
                if (this.p.hasChk) {  //是否有复选框
                    this.tdAllF = $('<td chkCell="true" style="text-align:center;"></td>').css({
                        height: this.p.defaultHF
                    });
                    this.tdDivAllF = $('<div class="dgj_tdDiv"></div>').css({
                        width: this.p.chkWidth
                    });
                    this.tdAllF.append(this.tdDivAllF);
                    this.trF.append(this.tdAllF);
                }

                //加载表头列
                for (var i = 0, cols = this.p.columns, l = cols.length; i < l; i++) {
                    var oTrF;
                    if (!this.p.lockColumn) {
                        oTrF = this.trF;
                    }
                    else {
                        //                        if (i < this.p.lockColumn - 1) {
                        //                            oTrF = this.trF;
                        //                        }
                        //                        else {
                        //                            if (this.p.lockColumnR) {
                        //                                if (i >= this.p.lockColumnR - 1) {
                        //                                    oTrF = this.trF3;
                        //                                }
                        //                                else {
                        //                                    oTrF = this.trF2;
                        //                                }
                        //                            }
                        //                            else {
                        //                                oTrF = this.trF2;
                        //                            }
                        //                        }
                    }

                    oTrF.append((function (c, i) {
                        var tdDivF = $('<div class="dgj_tdDiv"></div>').css({
                            width: thiz.p.defaultW
                        });
                        if (c.textF) {
                            tdDivF.append(c.textF);
                        }
                        if (c.align) {   //居中
                            tdDivF.css("text-align", c.align);
                        }
                        else {
                            tdDivF.css("text-align", thiz.p.defaultAlign);
                        }

                        var tdF = $('<td></td>').css({
                            height: thiz.p.defaultHF
                        });
                        tdF.attr("colId", i);  //设置单元格列唯一标识

                        tdDivF.css({
                            width: c.width
                        });
                        tdF.append(tdDivF);

                        return tdF;
                    })(cols[i], i));
                }
            }
            //#endregion

            //#region 菜单
            if (this.p.hasFloatBtn) {  //创建功能菜单按钮
                this.floatBtn = $('<input type="button" title="点击可自定义设置" onclick="this.focus()" hidefocus id="dgj_floatBtn_' + this.objId + '" class="dgj_floatBtn" />');
                if (this.p.floatBtnImg) {
                    this.floatBtn.css("background-image", "url(" + this.p.floatBtnImg + ")");
                }
                if (this.p.isTree) {
                    this.floatBtn.css({
                        top: 0,
                        right: 20
                    });
                }
                this.divOut.parent().append(this.floatBtn);
            }

            //隐藏列菜单集合
            var menusHide = [];

            //冻结列菜单集合
            var menusLockL = [];
            var menusLockR = [];

            //#region 生成各隐藏列、冻结列菜单
            for (var cn = 0, cols = this.p.columns, l = cols.length; cn < l; cn++) {
                if (this.p.stopHideColumn.length == 0 || $.inArray(cn, this.p.stopHideColumn) == -1) {
                    (function (cn) {
                        var colId = cols[cn].colId;  //列唯一标识

                        menusHide.push({
                            id: "hideCol" + cn,
                            text: cols[cn].text,
                            hasChk: true,
                            click: function (p) {
                                thiz.hideColumnMenu(cn, p.checked, p.chk);
                            }
                        });

                        //#region 动态冻结列[未完成]
                        //                            if(thiz.p.dynamicLockColumn) {  //左侧、右侧菜单点击时会同步,如左侧选中则右侧取消
                        //                                menusLockL.push({  //冻结列(左)
                        //                                    text: cols[cn].text,
                        //                                    hasChk: true,
                        //                                    noCheck: cols[cn].lockCol == "l" ? false : true,
                        //                                    click: function (p) {
                        //                                        if(p.checked) {
                        //                                            cols[cn].lockCol = "l";
                        //                                            thiz.mujLcL.chks[cn].attr("checked", true);
                        //                                            thiz.cmjLcL.chks[cn].attr("checked", true);
                        //                                            thiz.mujLcR.chks[cn].attr("checked", false);
                        //                                            thiz.cmjLcR.chks[cn].attr("checked", false);

                        //                                            var t3 = false;
                        //                                            var oTh = thiz.headContainer.find("th[colId=" + colId + "]");
                        //                                            if(thiz.p.hasChk) {
                        //                                                oTh.insertAfter(thiz.trH.find("th[chkCell]"));
                        //                                            }
                        //                                            else {
                        //                                                thiz.trH.prepend(oTh);
                        //                                            }
                        //                                            thiz.tbody2.find("tr:not(tr[loading],tr[emptyRow])").each(function(inx){
                        //                                                var oTr = $(this);
                        //                                                var oTd = oTr.find("td[colId=" + colId + "]");
                        //                                                if(oTd.length == 0) {
                        //                                                    oTd = thiz.tbody3.find("tr:not(tr[loading],tr[emptyRow]):eq(" + inx + ")").find("td[colId=" + colId + "]");
                        //                                                    if(!t3) {
                        //                                                        t3 = true;
                        //                                                        thiz.p.lockColumnR += 1;
                        //                                                    }
                        //                                                }

                        //                                                var oTrN = thiz.tbody.find("tr:not(tr[loading],tr[emptyRow]):eq(" + inx + ")");
                        //                                                if(thiz.p.hasChk) {
                        //                                                    oTd.insertAfter(oTrN.find("td[chkCell]"));
                        //                                                }
                        //                                                else {
                        //                                                    oTrN.prepend(oTd);
                        //                                                }
                        //                                            });

                        //                                            thiz.p.lockColumn += 1;
                        //                                        }
                        //                                        else {
                        //                                            cols[cn].lockCol = null;
                        //                                            thiz.mujLcL.chks[cn].attr("checked", false);
                        //                                            thiz.cmjLcL.chks[cn].attr("checked", false);

                        //                                            thiz.trH2.prepend(thiz.thead.find("th[colId=" + colId + "]"));
                        //                                            thiz.tbody.find("tr:not(tr[loading],tr[emptyRow])").each(function(inx){
                        //                                                var oTr = $(this);
                        //                                                thiz.tbody2.find("tr:not(tr[loading],tr[emptyRow]):eq(" + inx + ")").prepend(oTr.find("td[colId=" + colId + "]"));
                        //                                            });

                        //                                            thiz.p.lockColumn -= 1;
                        //                                        }

                        //                                        thiz.setTableWidth();
                        //                                    }
                        //                                });

                        //                                menusLockR.push({  //冻结列(右)
                        //                                    text: cols[cn].text,
                        //                                    hasChk: true,
                        //                                    noCheck: cols[cn].lockCol == "r" ? false : true,
                        //                                    click: function (p) {
                        //                                        if(p.checked) {
                        //                                            cols[cn].lockCol = "r";
                        //                                            thiz.mujLcR.chks[cn].attr("checked", true);
                        //                                            thiz.cmjLcR.chks[cn].attr("checked", true);
                        //                                            thiz.mujLcL.chks[cn].attr("checked", false);
                        //                                            thiz.cmjLcL.chks[cn].attr("checked", false);

                        //                                            var t1 = false;
                        //                                            thiz.trH3.prepend(thiz.headContainer.find("th[colId=" + colId + "]"));
                        //                                            thiz.tbody2.find("tr:not(tr[loading],tr[emptyRow])").each(function(inx){
                        //                                                var oTr = $(this);
                        //                                                var oTd = oTr.find("td[colId=" + colId + "]");
                        //                                                if(oTd.length == 0) {
                        //                                                    oTd = thiz.tbody.find("tr:not(tr[loading],tr[emptyRow]):eq(" + inx + ")").find("td[colId=" + colId + "]");
                        //                                                    if(!t1) {
                        //                                                        t1 = true;
                        //                                                        thiz.p.lockColumn -= 1;
                        //                                                    }
                        //                                                }
                        //                                                thiz.tbody3.find("tr:not(tr[loading],tr[emptyRow]):eq(" + inx + ")").prepend(oTd);
                        //                                            });

                        //                                            thiz.p.lockColumnR -= 1;
                        //                                        }
                        //                                        else {
                        //                                            cols[cn].lockCol = null;
                        //                                            thiz.mujLcR.chks[cn].attr("checked", false);
                        //                                            thiz.cmjLcR.chks[cn].attr("checked", false);

                        //                                            thiz.trH2.prepend(thiz.thead3.find("th[colId=" + colId + "]"));
                        //                                            thiz.tbody3.find("tr:not(tr[loading],tr[emptyRow])").each(function(inx){
                        //                                                var oTr = $(this);
                        //                                                thiz.tbody2.find("tr:not(tr[loading],tr[emptyRow]):eq(" + inx + ")").prepend(oTr.find("td[colId=" + colId + "]"));
                        //                                            });

                        //                                            thiz.p.lockColumnR += 1;
                        //                                        }

                        //                                        thiz.setTableWidth();
                        //                                    }
                        //                                });
                        //                            }
                        //#endregion
                    })(cn);
                }
            }
            //#endregion

            //#region 一级菜单集合
            var menuHideCol = {
                id: "dgjHcMuj_" + this.objId,
                text: '隐藏列',
                maxHeight: 300,
                width: this.p.hideMenuWidth,
                shiftLeft: 111 - this.p.hideMenuWidth,
                menus: menusHide,
                evts: {
                    afterBodyLoad2: function () {
                        for (var i = 0, l = this.chks.length; i < l; i++) {  //初始化复选框选中状态
                            this.chks[i].setChecked(thiz.p.columns[i].isHide ? false : true, null, true);
                        }
                    }
                }
            };

            var menus = [];
            if (!this.p.isTree && this.p.canHideCol) {
                menus.push(menuHideCol);
            }
            //#endregion

            //#region 冻结列菜单
            var lockColMenus, fnGetMenuObj;
            if (this.p.dynamicLockColumn) {
                lockColMenus =
                [
                    {
                        id: 'dgj_muj_lcL_' + this.objId,
                        text: '左侧',
                        width: this.p.hideMenuWidth,
                        shiftLeft: 96 - this.p.hideMenuWidth,
                        menus: menusLockL
                    }, {
                        id: 'dgj_muj_lcR_' + this.objId,
                        text: '右侧',
                        width: this.p.hideMenuWidth,
                        shiftLeft: 96 - this.p.hideMenuWidth,
                        menus: menusLockR
                    }
                ];

                menus.push({
                    text: '冻结列',
                    maxHeight: 300,
                    menus: lockColMenus,
                    evts: {
                        afterItemRender: function (e, p) {
                            if (thiz.p.dynamicLockColumn) {
                                fnGetMenuObj(p);
                            }
                        }
                    }
                });

                fnGetMenuObj = function (p) {  //记录冻结列菜单对象
                    if (p.id == 'dgj_muj_lcL_' + thiz.objId && !thiz.mujLcL) {
                        thiz.mujLcL = FJ.get('dgj_muj_lcL_' + thiz.objId);
                    }
                    if (p.id == 'dgj_cmj_lcL_' + thiz.objId && !thiz.cmjLcL) {
                        thiz.cmjLcL = FJ.get('dgj_cmj_lcL_' + thiz.objId);
                    }
                    if (p.id == 'dgj_muj_lcR_' + thiz.objId && !thiz.mujLcR) {
                        thiz.mujLcR = FJ.get('dgj_muj_lcR_' + thiz.objId);
                    }
                    if (p.id == 'dgj_cmj_lcR_' + thiz.objId && !thiz.cmjLcR) {
                        thiz.cmjLcR = FJ.get('dgj_cmj_lcR_' + thiz.objId);
                    }
                };
            }
            //#endregion

            //#region 其他一级菜单
            var menuStoreName, menuFullScreen, menuLazyLoad, menuExportCsv, menuChangeTheme;

            //清除本地存储状态
            if (this.p.storeName) {
                menuStoreName = {
                    text: '清除表格列状态',
                    icon: "<img src='" + FJ.imgPath + "Menu/deleteUser.gif' />",
                    click: function () {
                        FJ.LocalStorage.removeItem({ key: thiz.p.storeName + "_hide" });
                        FJ.LocalStorage.removeItem({ key: thiz.p.storeName + "_colWidth" });
                        this.setVisible(false);
                    }
                };
                menus.push(menuStoreName);
            }

            //切换全屏
            if (this.p.canFullScreen) {
                menuFullScreen = {
                    id: "dgjFs_" + this.objId,
                    text: '全屏显示',
                    icon: "<img src='" + FJ.imgPath + "Menu/imgBrowser.gif' />",
                    click: function (p) {
                        this.setVisible(false);
                        thiz.fnFullScreen();  //执行全屏事件
                    }
                };
                menus.push(menuFullScreen);
            }

            //切换主题
            if (this.p.canChangeTheme) {
                menuChangeTheme = {
                    id: "dgjCt_" + this.objId,
                    text: '切换主题',
                    shiftLeft: 11,
                    menus:
                    [
                        {
                            text: "蓝色",
                            icon: "<img src='" + FJ.imgPath + "Menu/theme_blue.gif' />",
                            click: function (p) {
                                fj.theme.change("blue");
                            }
                        }, {
                            text: "灰色",
                            icon: "<img src='" + FJ.imgPath + "Menu/theme_gray.gif' />",
                            click: function (p) {
                                fj.theme.change("gray");
                            }
                        }
                    ]
                };
                menus.push(menuChangeTheme);
            }

            //显示全部数据
            if (this.p.isLazyLoad) {
                menuLazyLoad = {
                    text: '显示全部数据',
                    icon: "<img src='" + FJ.imgPath + "Menu/load.gif' />",
                    click: function () {
                        this.setVisible(false);
                        if (thiz.useMbj) {
                            MBJ.loading("提示", "正在加载中,请稍候...", function () {
                                var thix = this;
                                setTimeout(function () {
                                    thiz.autoLoadlazyRow(true);
                                    thix.close();
                                }, 100);
                            });
                        }
                        else {
                            thiz.autoLoadlazyRow(true);
                        }
                    }
                };
                menus.push(menuLazyLoad);
            }

            //#region 导出csv
            if (this.p.canExportCsv) {
                //if(parseFloat(FJ.getFlashVer().split(".")[0]) >= 10) {
                //    $.ajax({  //预加载flash导出csv按钮控件
                //        type: "get",
                //        url: FJ.rootPath + "resources/swf/ExportCsvHelperJ.swf"
                //    });
                //}

                menuExportCsv = {
                    text: this.p.csvMenuName,
                    id: "dgjExportCsvMuj_" + this.objId,
                    icon: "<img src='" + FJ.imgPath + "FileUpload/filetype/xls.gif' />",
                    click: function () {
                        setTimeout(function () {
                            if (!fj.isLocal) {
                                if (parseFloat(FJ.getFlashVer().split(".")[0]) < 10) {
                                    thiz.alert("您的浏览器flash版本过低或没有安装flash插件,请先升级或安装flash插件(10.0以上版本)后再执行导出。");
                                }
                            }
                            else {
                                thiz.alert("本地模式不支持导出操作");
                            }
                        }, 50);
                    }
                };

                window["getCsvData_" + this.objId] = function () {  //获取表文本数据
                    return thiz.p.csvFileName + fj.Date.toFormatString(new Date(), "yyyymmddhhMMss") + "<split/>" + thiz.getGridText(true);
                };

                window["callBackCsvData_" + this.objId] = function () {  //关闭菜单
                    var muj;
                    if (!thiz.p.isTree && thiz.p.hasFloatBtn) {
                        muj = thiz.mujFbtn;
                    }
                    else {
                        muj = thiz.rowCmj;
                    }
                    muj.setVisible(false);
                };

                window["setExportBtnOver_" + this.objId] = function () {  //设置csv按钮鼠标移上样式
                    thiz.itemCsvMuj.trigger("mouseenter");
                };

                window["setExportBtnOut_" + this.objId] = function () {  //设置csv按钮鼠标移开样式
                    thiz.itemCsvMuj.trigger("mouseleave");
                };

                window["setFxCsvPosition_" + this.objId] = function (b) {  //设置csv按钮控件位置
                    if (!fj.isIE) {  //非IE浏览器下需设置弹出选择文件框时不能关闭菜单,否则浏览器会卡住
                        var muj;
                        if (!thiz.p.isTree && thiz.p.hasFloatBtn) {
                            muj = thiz.mujFbtn;
                        }
                        else {
                            muj = thiz.rowCmj;
                        }

                        if (b == 1) {
                            muj.p.canClose = false;
                        }
                        else if (b == 2) {
                            muj.p.canClose = true;
                        }
                    }
                };

                window["exportCsvError_" + this.objId] = function () {  //存储文件时出现错误
                    thiz.alert("您的系统中有已打开的同名excel文件,请先关闭该excel文件或修改文件名后再执行导出。");
                };

                menus.push(menuExportCsv);

                var fnRenderCsv = function (obj) {  //导出csv控件渲染方法
                    if (thiz.itemCsvMuj && !obj.isLoadEhj && parseFloat(FJ.getFlashVer().split(".")[0]) >= 10 && !fj.isLocal) {  //加载flash控件覆盖导出csv按钮
                        obj.isLoadEhj = true;
                        var d = "dgjCsvDivMuj_" + thiz.objId, thix = obj;
                        obj.bodyIn.append($("<div id='" + d + "'></div>"));
                        setTimeout(function () {
                            FJ.FX.create(d, FJ.rootPath + "resources/swf/ExportCsvHelperJ.swf", d, thix.p.width, 24, { getCsvData: "getCsvData_" + thiz.objId, callBackCsvData: "callBackCsvData_" + thiz.objId, setExportBtnOver: "setExportBtnOver_" + thiz.objId, setExportBtnOut: "setExportBtnOut_" + thiz.objId, setFxCsvPosition: "setFxCsvPosition_" + thiz.objId, exportCsvError: "exportCsvError_" + thiz.objId }, null, "10.0.0");
                            $("#" + d).css({
                                position: "absolute",
                                top: thiz.itemCsvMuj.position().top
                            });
                        }, 1);
                    }
                };
            }
            //#endregion
            //#endregion

            //#region 功能菜单
            if (this.p.hasFloatBtn) {
                this.mujFbtn = $(this.floatBtn).MUJ({
                    renderTo: this.p.renderToMuj,
                    showRendorBody: this.p.renderToMuj != null ? true : false,
                    hoverDirect: "left",
                    cMenuDirect: "left",
                    autoDirect: false,
                    shiftLeft: -105,
                    shiftTop: 19,
                    width: 115,
                    menus: menus,
                    zIndex: this.p.zIndexMenu,
                    tranOrigin: "85% 0%",
                    tranScaleShow: "scale(1, 0.1)",
                    tranScaleClose: "scale(1, 0.8)",
                    evts: {
                        afterItemRender: function (e, p) {
                            if (p.id == "dgjFs_" + thiz.objId) {
                                thiz.btnFs = p.item;  //保存全屏菜单按钮对象
                            }
                            if (p.id == "dgjHcMuj_" + thiz.objId) {
                                thiz.mujHc = p.menu;  //保存隐藏列菜单对象
                            }
                            if (thiz.p.canExportCsv && p.id == "dgjExportCsvMuj_" + thiz.objId) {  //导出csv按钮
                                thiz.itemCsvMuj = p.item;
                                this.bodyIn.css("position", "relative");
                            }
                        },
                        afterBodyLoad2: function () {
                            if (thiz.p.canExportCsv) {
                                fnRenderCsv(this);
                            }

                            if (thiz.p.hasRowContextMenu) {  //弹出后关闭右击菜单
                                thiz.rowCmj.setVisible(false);
                            }
                        }
                    }
                });
            }
            //#endregion

            //#region 右击菜单
            if (this.p.hasRowContextMenu) {
                menuHideCol.id = "dgjHcCmj_" + this.objId;
                if (this.p.canFullScreen) {
                    menuFullScreen.id = "dgjFsCmj_" + this.objId;
                }
                if (this.p.canChangeTheme) {
                    menuChangeTheme.id = "dgjCtCmj_" + this.objId;
                }
                if (this.p.dynamicLockColumn) {
                    lockColMenus[0].id = 'dgj_cmj_lcL_' + this.objId;
                    lockColMenus[1].id = 'dgj_cmj_lcR_' + this.objId;
                }

                //#region 复制
                if (this.p.canCopy) {
                    window["getClipboardData_" + this.objId] = function () {  //获取表文本数据
                        var t = thiz.fire("beforeCopy");
                        if (t == null) {
                            t = thiz.getGridText();
                        }
                        return t;
                    };

                    window["callBackClipboardData_" + this.objId] = function () {  //关闭菜单
                        thiz.rowCmj.setVisible(false);
                    };

                    window["setCopyBtnOver_" + this.objId] = function () {  //设置复制按钮鼠标移上样式
                        thiz.itemCopyCmj.trigger("mouseenter");
                    };

                    window["setCopyBtnOut_" + this.objId] = function () {  //设置复制按钮鼠标移开样式
                        thiz.itemCopyCmj.trigger("mouseleave");
                    };

                    if (FJ.isIE || FJ.isFF || parseFloat(FJ.getFlashVer().split(".")[0]) >= 9) {
                        //$.ajax({  //预加载flash复制按钮控件
                        //    type: "get",
                        //    url: FJ.rootPath + "resources/swf/CilpboardHelperJ.swf"
                        //});

                        menus.unshift({
                            id: "dgjCopyCmj_" + this.objId,
                            text: '复制',
                            icon: "<img src='" + FJ.imgPath + "Menu/copy.gif' />",
                            title: FJ.isIE ? "友情提示:如果您点击复制时浏览器提示是否允许访问剪贴板,您可以请依次点击进入\"工具\">\"Internet选项\">\"安全\">\"自定义级别\"将\"允许对剪贴板进行编程访问\"项设置为\"启用\"。" : null,
                            click: function (p) {
                                var txtAll = window["getClipboardData_" + thiz.objId]();

                                this.setVisible(false);
                                setTimeout(function () {
                                    //#region 复制到剪贴板
                                    if (FJ.isIE) {
                                        window.clipboardData.setData('text', txtAll);
                                    }
                                    else if (FJ.isFF) {
                                        //#region FF复制方法
                                        try {
                                            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                                        }
                                        catch (e) {
                                            thiz.alert("复制操作被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'");
                                        }
                                        var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
                                        if (!clip)
                                            return;
                                        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
                                        if (!trans)
                                            return;
                                        trans.addDataFlavor('text/unicode');
                                        var str = new Object();
                                        var len = new Object();
                                        var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
                                        var copytext = txtAll;
                                        str.data = copytext;
                                        trans.setTransferData("text/unicode", str, copytext.length * 2);
                                        var clipid = Components.interfaces.nsIClipboard;
                                        clip.setData(trans, null, clipid.kGlobalClipboard);
                                        //#endregion
                                    }
                                    else {
                                        thiz.alert("对不起，您的浏览器不支持复制操作");
                                    }
                                    //#endregion
                                }, 50);
                            }
                        });
                    }
                }
                //#endregion

                if (this.p.isTreeGrid && this.p.asyncLoadTree) {  //刷新子节点
                    menus.push({
                        text: '刷新子节点',
                        icon: "<img src='" + FJ.imgPath + "Pagination/refresh.gif' />",
                        click: function (p) {
                            this.setVisible(false);
                            thiz.refreshChildNode(thiz.currentNode);
                        }
                    });
                }

                if (this.p.canRefreshPage) {  //刷新页面
                    menus.push({
                        text: '刷新页面',
                        icon: "<img src='" + FJ.imgPath + "Pagination/refresh.gif' />",
                        click: function () {
                            this.setVisible(false);
                            setTimeout(function () {
                                location.reload(true);
                            }, 100);
                        }
                    });
                }

                $.merge(this.p.contextMenuItems, menus);  //合并到右击菜单集合

                if (!this.p.isTree && this.p.canExportCsv && this.p.hasFloatBtn) {  //右击菜单中去除导出csv(非树控件)
                    for (var i = 0, l = this.p.contextMenuItems.length; i < l; i++) {
                        if (this.p.contextMenuItems[i].id == ("dgjExportCsvMuj_" + this.objId)) {
                            fj.arr.removeAt(this.p.contextMenuItems, i);
                            break;
                        }
                    }
                }

                this.rowCmj = $(this.gridContainer).CMJ({
                    renderTo: this.p.renderToMuj,
                    showRendorBody: this.p.renderToMuj != null ? true : false,
                    zIndex: this.p.zIndexMenuC,
                    menus: this.p.contextMenuItems,
                    width: 115,
                    showOnSelectText: false,  //有选中文本时,不执行弹出右击菜单
                    tranOrigin: "50% 0%",
                    tranScaleShow: "scale(1, 0.1)",
                    tranScaleClose: "scale(1, 0.8)",
                    evts: {
                        afterShow: function () {
                            thiz.fire("rowContextMenu");
                        },
                        afterBodyLoad2: function () {
                            if (thiz.p.canCopy && thiz.itemCopyCmj && !this.isLoadChj && parseFloat(FJ.getFlashVer().split(".")[0]) >= 9 && !fj.isLocal) {  //加载flash控件覆盖复制按钮
                                this.isLoadChj = true;
                                var did = "dgjCopyDivCmj_" + thiz.objId, thix = this;
                                this.bodyIn.append($("<div id='" + did + "'></div>"));
                                setTimeout(function () {
                                    FJ.FX.create(did, FJ.rootPath + "resources/swf/CilpboardHelperJ.swf", did, thix.p.width, 24, { getClipboardData: "getClipboardData_" + thiz.objId, callBackClipboardData: "callBackClipboardData_" + thiz.objId, setCopyBtnOver: "setCopyBtnOver_" + thiz.objId, setCopyBtnOut: "setCopyBtnOut_" + thiz.objId }, null, "9.0.0");
                                    $("#" + did).css({
                                        position: "absolute",
                                        top: thiz.itemCopyCmj.position().top
                                    });
                                }, 1);
                            }

                            if ((thiz.p.isTree || !thiz.p.hasFloatBtn) && thiz.p.canExportCsv) {
                                fnRenderCsv(this);
                            }

                            if (thiz.mujFbtn) {
                                thiz.mujFbtn.setVisible(false);  //弹出后关闭功能菜单
                            }
                        },
                        afterItemRender: function (e, p) {
                            if (p.id == "dgjFsCmj_" + thiz.objId) {
                                thiz.btnFsCmj = p.item;  //保存全屏菜单按钮对象
                            }
                            if (p.id == "dgjCopyCmj_" + thiz.objId) {  //复制按钮
                                thiz.itemCopyCmj = p.item;
                                this.bodyIn.css("position", "relative");
                            }
                            if ((thiz.p.isTree || !thiz.p.hasFloatBtn) && thiz.p.canExportCsv && p.id == "dgjExportCsvMuj_" + thiz.objId) {  //导出csv按钮
                                thiz.itemCsvMuj = p.item;
                                this.bodyIn.css("position", "relative");
                            }
                        }
                    }
                });
            }
            //#endregion
            //#endregion

            //#region 加载表体
            //表体
            this.tbody = $('<tbody></tbody>');
            this.table.append(this.tbody);
            this.divOut.append(this.gridContainer).append(this.sBarHContainer);

            //#region 横向滚动条
            this.sbj = $(this.sBarHContainer).SBJ({
                width: 0,
                widthC: 0,
                style: FJ.isIE7 ? "float:left;" : null,
                evts: {
                    scroll: function (e, p) {
                        if (!thiz.p.lockColumn) {
                            thiz.headContainer[0].scrollLeft = p.s.scrollLeft;
                            thiz.bodyContainer[0].scrollLeft = p.s.scrollLeft;
                            if (thiz.p.hasGridFoot) {
                                thiz.footContainer[0].scrollLeft = p.s.scrollLeft;
                            }

                            FJ.lazyDo(function () {
                                //计算拖动条位置
                                if (this.p.canColumeDD) {
                                    this.setDDPosition();
                                }
                            }, 100, "ld_dgjScroll", thiz);
                        }
                        else {
                            thiz.lcHeadContainer[0].scrollLeft = p.s.scrollLeft;
                            thiz.lcContainer[0].scrollLeft = p.s.scrollLeft;

                            FJ.lazyDo(function () {
                                //计算拖动条位置
                                if (this.p.canColumeDD) {
                                    this.setDDPosition(true);
                                }
                            }, 100, "ld_dgjScroll", thiz);
                        }
                    }
                }
            });
            //#endregion

            //加载锁定表
            if (this.p.lockColumn) {
                this.headContainer.append(this.lcHeadContainer);
                this.bodyContainer.append(this.lcContainer);

                this.gridContainer.bind("scroll", function () {
                    if (thiz.p.lockColumn) {
                        FJ.lazyDo(function () {
                            this.setSbjPostionLc();  //设置横滚动条位置
                        }, thiz.p.lazyLoadSpeed, "ld_dgjGridC", thiz);
                    }
                });
            }

            //加载锁定表(右)
            if (this.p.lockColumnR) {
                this.headContainer.append(this.rightHeadContainer);
                this.bodyContainer.append(this.rightContainer);
            }

            //设置表头颜色
            if (this.p.useSingleThColor && this.p.colorParams.thColor) {
                this.headContainer.find("th").css({
                    backgroundImage: "none",
                    backgroundColor: this.p.colorParams.thColor
                });
            }

            //是否可拖动列宽
            if (this.p.canColumeDD) {
                this.setColumeDD();
            }

            //页面布局改变时控件重新布局
            $(window).bind("resize", function () {
                if (!thiz.divOut.is(":hidden")) {
                    FJ.lazyDo(function () {  //异步加载树时不执行同步行高;树控件不重设表格宽度
                        this.reLayout(this.p.asyncLoadTree ? true : false, this.p.isTree);
                    }, thiz.p.layoutDelay, "ld_dgjMH", thiz);
                }
            });

            //创建完毕
            this.fire("afterRender", "DGJ");
            //#endregion

            //#region 表头浮动提示
            if (this.p.hasHeadTip && !this.p.isTree) {
                var hts = this.headContainer.find("div[headTip].dgj_thDiv");
                if (hts.length > 0) {
                    var htc = this.p.headTipConfig,
                        tc = {
                            showRendorBody: true,
                            showHead: false,
                            speed: 1,
                            showSpeed: 10,
                            hoverSpeed: 100,
                            loadSpeed: 1,
                            showLoading: false,
                            zIndex: 1000,
                            isBodyEmpty: true,
                            hoverOnTip: fj.isMobile ? false : true,
                            radius: FJ.isIElt9 ? 0 : 5,
                            urlType: "html",
                            posType: "offset",
                            hoverDirect: "bottom",
                            shiftLeft: 0,
                            shiftTop: 17,
                            width: 180,
                            height: 50,
                            opacity: 0.8,
                            isAutoSetHeight: false,
                            radiusB: 4,
                            hasShadow: true,
                            //                        colorParams: {
                            //                            borderOut: "#ffb11a",                  //外层边框
                            //                            borderIn: "#ffb11a",                   //内层边框
                            //                            bgColorBody: "#fffeec",
                            //                            bgColorHead: "#ffb11a",
                            //                            bgColorHeadJ: "#ffb11a",
                            //                            bgColorHeadJT: "#ffb11a",
                            //                            bgColorHeadU: "#ffb11a"
                            //                        },
                            loadHTML: function () {
                                return "<div class='dgj_headTip'>" + this.currentObj.attr("headTip") + "</div>";
                            }
                        };
                    if (htc && htc.renderTo) {
                        tc.renderTo = htc.renderTo;
                        delete htc.renderTo;
                    }
                    else {
                        tc.renderTo = this.divOut;
                    }
                    this.ttjHeadTip = hts.TTJ($.extend(true, tc, htc));
                }
            }
            //#endregion

            return this;
        },
        //#endregion

        //#region 加载数据
        //#region 加载数据
        loadData: function (data, pageNo, total, dataF, cacheParam) {
            var thiz = this;
            this.data = data;
            if (this.data && this.data.lengthD == null) {
                this.data.lengthD = this.data.length;
            }
            this.judgeLazyDataLimit();  //数据量超过极限值后使用延迟加载
            if (this.p.isLazyLoad) {
                this.divOut.attr("title", "");
            }
            //            this.groupObj = {};  //分组标记(区分加载数据)
            //            this.groupArr = [];  //分组标记(区分计算同步行高)
            if (this.p.hasChk && this.p.hasChkAll && this.chkAll) {   //初始化全选复选框
                if (this.p.chkStyle) {
                    this.sbxjAll.setChecked(false, null, true);
                }
                else {
                    this.chkAll[0].checked = false;
                }
            }

            if (data && data.length > 0) {
                if (this.p.defaultSortCol) {  //默认排序
                    fj.Sort.execute(data, this.p.defaultSortCol, this.p.defaultSortAsc, this.p.noSortSp);
                }
                //加载行
                if (!this.p.isPageCache) {
                    this.chks = [];
                    this.rows = [];
                    if (this.p.isLazyLoad) {
                        this.lazyRowNo = 0;
                    }

                    //清空表
                    this.tbody.empty();
                    if (this.p.lockColumn) {
                        this.tbody2.empty();
                    }
                    if (this.p.lockColumnR) {
                        this.tbody3.empty();
                    }

                    //                    var pt = { thds: this.headContainer.find("div.dgj_tdDiv") };  //获取表头列容器集合，用于确定表体列宽
                    //                    if(this.p.hasChk) {
                    //                        pt.thds = pt.thds.not("div:first");
                    //                    }
                    var pt = { thds: this.thds };
                    if (!this.p.quickRenderMode) {
                        for (var i = 0, l = data.length; i < l; i++) {
                            var oTr = this.addRow(data[i], i, null, true, null, null, null, null, pt);

                            if (this.p.isLazyLoad) {  //多余显示区域外的行使用延迟加载
                                this.setMainHeight();
                                this.lazyRowNo = i + 1;

                                for (var j = 0, cols = this.p.columns, m = cols.length; j < m; j++) {  //隐藏列
                                    if (cols[j].isHide) {
                                        this.hideColumnR(oTr, j, false);
                                    }
                                }

                                if (i >= this.p.lazyDataLimit - 1 && (this.bodyContainer[0].scrollHeight > this.bodyContainer.height() + 10) && i < data.length - 1) {  //加载到滚动条可视区域时
                                    //this.p.canSort = false;
                                    this.addLoadingRow();  //加入loading行
                                    this.divOut.attr("title", this.p.lazyInfo);
                                    break;
                                }
                            }
                        }
                    }
                    else {  //快速渲染模式下用连接table字符串的方式创建表格
                        this.renderTable(data, null, true);
                    }
                }
                else {
                    this.pageNo = pageNo;   //记录当前页码
                    this.pageCacheTotal = total;   //页缓存数据总数
                    if (this.p.isLazyLoad) {  //延迟加载时每次加载竖滚动条移置最上面
                        this.bodyContainer.scrollTop(0);
                        this.lazyRowNo = 0;
                    }

                    var cache = this.getPageCache(pageNo);  //获取分页缓存
                    if (cache) {   //该页有缓存
                        var oTbody = cache[2];
                        this.chks = cache[3];
                        this.tbody.hide();
                        this.tbody = oTbody.show();

                        if (this.p.lockColumn) {
                            var oTbody2 = cache[4];
                            this.tbody2.hide();
                            this.tbody2 = oTbody2.show();
                        }
                        if (this.p.lockColumnR) {
                            var oTbody3 = cache[5];
                            this.tbody3.hide();
                            this.tbody3 = oTbody3.show();
                        }

                        if (this.p.isLazyLoad) {
                            this.lazyRowNo = cache[6];
                            this.addLoadingRow();
                            if (this.lazyRowNo <= this.data.length - 1) {
                                //this.p.canSort = false;
                                this.divOut.attr("title", this.p.lazyInfo);
                            }
                            //                            else{
                            //                                this.p.canSort = true;
                            //                            }
                            this.autoLoadlazyRow();
                            this.setMainHeight();
                        }
                    }
                    else {   //该页无缓存
                        this.chks = [];
                        this.rows = [];

                        if (this.tbody) {
                            if (this.pageCache.length <= 0) {
                                this.tbody.remove();
                                if (this.p.lockColumn) {
                                    this.tbody2.remove();
                                }
                                if (this.p.lockColumnR) {
                                    this.tbody3.remove();
                                }
                            }
                            else {
                                this.tbody.hide();
                                if (this.p.lockColumn) {
                                    this.tbody2.hide();
                                }
                                if (this.p.lockColumnR) {
                                    this.tbody3.hide();
                                }
                            }
                        }
                        this.tbody = $('<tbody></tbody>');
                        this.table.append(this.tbody);
                        if (this.p.lockColumn) {
                            this.tbody2 = $('<tbody></tbody>');
                            this.table2.append(this.tbody2);
                        }
                        if (this.p.lockColumnR) {
                            this.tbody3 = $('<tbody></tbody>');
                            this.table3.append(this.tbody3);
                        }

                        //加入分页缓存
                        var arrPage = this.addPageCache(pageNo, dataF, cacheParam);

                        //                        var pt = { thds: this.headContainer.find("div.dgj_tdDiv") };  //获取表头列容器集合，用于确定表体列宽
                        //                        if(this.p.hasChk) {
                        //                            pt.thds = pt.thds.not("div:first");
                        //                        }
                        var pt = { thds: this.thds };
                        for (var i = 0, l = data.length; i < l; i++) {
                            var oTr = this.addRow(data[i], i, null, true, null, null, pageNo, null, pt);

                            if (this.p.isLazyLoad) {  //多余显示区域外的行使用延迟加载
                                this.setMainHeight();
                                this.lazyRowNo = i + 1;
                                arrPage[6] = this.lazyRowNo;

                                for (var j = 0, cols = this.p.columns, m = cols.length; j < m; j++) {  //隐藏列
                                    if (cols[j].isHide) {
                                        this.hideColumnR(oTr, j, false);
                                    }
                                }

                                if (i >= this.p.lazyDataLimit - 1 && (this.bodyContainer[0].scrollHeight > this.bodyContainer.height() + 10) && i < data.length - 1) {  //加载到滚动条可视区域时
                                    //this.p.canSort = false;
                                    this.addLoadingRow();  //加入loading行
                                    this.divOut.attr("title", this.p.lazyInfo);
                                    break;
                                }
                            }
                        }

                        this.joinCacheData();  //连接缓存数据集
                    }
                }

                //加载底部数据
                if (this.p.hasGridFoot && dataF) {
                    this.loadDataF(dataF);
                }

                this.setTableWidth();
                this.p.canSort = true;  //开启排序
                this.mergeCellV();  //纵向合并单元格

                if (!this.p.isLazyLoad) {  //不使用延迟加载时,计算主体高度
                    this.setMainHeight();

                    //隐藏列
                    for (var i = 0, cols = this.p.columns, l = cols.length; i < l; i++) {
                        if (cols[i].isHide) {
                            this.hideColumn(i, false, true);
                        }
                    }
                }

                this.fire("dataLoaded", { data: data });
            }
            else {
                this.clearData();
            }

            this.hideSortImg();
            this.sbj.setScrollLeft(0);

            return this;
        },
        //#endregion   

        //#region 加载分组行数据
        loadDataG: function (data, pageNo, total, dataF, cacheParam) {
            var thiz = this;
            this.data = data;
            if (this.data && this.data.lengthD == null) {
                this.data.lengthD = this.data.length;
            }
            this.judgeLazyDataLimit();  //数据量超过极限值后使用延迟加载
            if (this.p.isLazyLoad) {
                this.divOut.attr("title", "");
            }
            if (this.p.hasChkG && this.p.hasChkAll && this.chkAll) {   //初始化全选复选框
                if (this.p.chkStyle) {
                    this.sbxjAll.setChecked(false, null, true);
                }
                else {
                    this.chkAll[0].checked = false;
                }
            }

            if (data && data.length > 0) {
                //加载行
                if (!this.p.isPageCache) {
                    this.chks = [];
                    this.rows = [];

                    if (this.p.isChkAll) {  //设置默认全选
                        this.setDefaultChkAll();
                    }

                    if (this.p.isLazyLoad) {
                        this.lazyRowNo = 0;
                    }
                    this.tbody.empty();   //清空表

                    //                    var pt = { thds: this.headContainer.find("div.dgj_tdDiv") };  //获取表头列容器集合，用于确定表体列宽
                    //                    if(this.p.hasChkG) {
                    //                        pt.thds = pt.thds.not("div:first");
                    //                    }
                    var pt = { thds: this.thds };
                    for (var i = 0, l = data.length; i < l; i++) {
                        var oTrs = [];
                        this.addRowGS(data[i], i, null, null, null, null, oTrs, pt);

                        if (this.p.isLazyLoad) {  //多余显示区域外的行使用延迟加载
                            this.setMainHeight();
                            this.lazyRowNo = i + 1;

                            if (oTrs.length > 0) {
                                for (var j = 0, cols = this.p.columns, m = cols.length; j < m; j++) {  //隐藏列
                                    if (cols[j].isHide) {
                                        for (var k = 0, n = oTrs.length; k < n; k++) {
                                            this.hideColumnR(oTrs[k], j, false);
                                        }
                                    }
                                }
                            }

                            if (i >= this.p.lazyDataLimit - 1 && (this.bodyContainer[0].scrollHeight > this.bodyContainer.height() + 10) && i < data.length - 1) {  //加载到滚动条可视区域时
                                this.addLoadingRow();  //加入loading行
                                this.divOut.attr("title", this.p.lazyInfo);
                                break;
                            }
                        }
                    }
                }
                else {
                    this.pageNo = pageNo;   //记录当前页码
                    this.pageCacheTotal = total;   //页缓存数据总数
                    if (this.p.isLazyLoad) {  //延迟加载时每次加载竖滚动条移置最上面
                        this.bodyContainer.scrollTop(0);
                        this.lazyRowNo = 0;
                    }

                    var cache = this.getPageCache(pageNo);  //获取分页缓存
                    if (cache) {   //该页有缓存
                        var oTbody = cache[2];
                        this.chks = cache[3];
                        this.tbody.hide();
                        this.tbody = oTbody.show();
                        this.rows = cache[7];

                        if (this.p.isLazyLoad) {
                            this.lazyRowNo = cache[6];
                            this.addLoadingRow();
                            if (this.lazyRowNo <= this.data.length - 1) {
                                this.divOut.attr("title", this.p.lazyInfo);
                            }
                            this.autoLoadlazyRow();
                            this.setMainHeight();
                        }
                    }
                    else {   //该页无缓存
                        this.chks = [];
                        this.rows = [];

                        if (this.p.isChkAll) {  //设置默认全选
                            this.setDefaultChkAll();
                        }

                        if (this.tbody) {
                            if (this.pageCache.length <= 0) {
                                this.tbody.remove();
                            }
                            else {
                                this.tbody.hide();
                            }
                        }
                        this.tbody = $('<tbody></tbody>');
                        this.table.append(this.tbody);

                        //加入分页缓存
                        var arrPage = this.addPageCache(pageNo, dataF, cacheParam);

                        //                        var pt = { thds: this.headContainer.find("div.dgj_tdDiv") };  //获取表头列容器集合，用于确定表体列宽
                        //                        if(this.p.hasChkG) {
                        //                            pt.thds = pt.thds.not("div:first");
                        //                        }
                        var pt = { thds: this.thds };
                        for (var i = 0, l = data.length; i < l; i++) {
                            var oTrs = [];
                            this.addRowGS(data[i], i, pageNo, null, null, null, oTrs, pt);

                            if (this.p.isLazyLoad) {  //多余显示区域外的行使用延迟加载
                                this.setMainHeight();
                                this.lazyRowNo = i + 1;
                                arrPage[6] = this.lazyRowNo;

                                if (oTrs.length > 0) {
                                    for (var j = 0, cols = this.p.columns, m = cols.length; j < m; j++) {  //隐藏列
                                        if (cols[j].isHide) {
                                            for (var k = 0, n = oTrs.length; k < n; k++) {
                                                this.hideColumnR(oTrs[k], j, false);
                                            }
                                        }
                                    }
                                }

                                if (i >= this.p.lazyDataLimit - 1 && (this.bodyContainer[0].scrollHeight > this.bodyContainer.height() + 10) && i < data.length - 1) {  //加载到滚动条可视区域时
                                    this.addLoadingRow();  //加入loading行
                                    this.divOut.attr("title", this.p.lazyInfo);
                                    break;
                                }
                            }
                        }

                        this.joinCacheData();  //连接缓存数据集
                    }
                }

                //加载底部数据
                if (this.p.hasGridFoot && dataF) {
                    this.loadDataF(dataF);
                }

                this.setTableWidth();
                this.p.canSort = true;  //开启排序

                if (!this.p.isLazyLoad) {  //不使用延迟加载时,计算主体高度
                    this.setMainHeight();

                    //隐藏列
                    for (var i = 0, cols = this.p.columns, l = cols.length; i < l; i++) {
                        if (cols[i].isHide) {
                            this.hideColumn(i, false, true);
                        }
                    }
                }

                this.fire("dataLoaded", { data: data });
            }
            else {
                this.clearData();
            }

            this.hideSortImg();
            this.sbj.setScrollLeft(0);

            return this;
        },
        //#endregion

        //#region 加载表底数据
        loadDataF: function (data) {
            this.dataF = data;
            var trdFs = this.trF.find("div.dgj_tdDiv");
            if (this.p.hasChk) {
                trdFs = trdFs.not("div:first");
            }

            for (var i = 0, cols = this.p.columns, l = cols.length; i < l; i++) {
                var tdDivF = trdFs.eq(i);
                if (!cols[i].renderFnFoot) {   //是否使用渲染方法
                    tdDivF.html(data[cols[i].dataIndex]);
                }
                else {
                    tdDivF.html(cols[i].renderFnFoot.call(this, data[cols[i].dataIndex], data, i, this.trF, tdDivF));
                }
            }
        },
        //#endregion

        //#region 修改表头文字
        updateHeadText: function (nos, datas) {
            var thSps = this.headContainer.find("span.dgj_thSp");
            for (var i = 0, l = nos.length; i < l; i++) {
                thSps.eq(nos[i]).html(datas[i]);
            }
        },
        //#endregion
        //#endregion

        //#region treegrid相关操作
        //#region 加载树形数据
        loadDataT: function (data) {
            var thiz = this;
            this.data = data;
            if (this.data && this.data.lengthD == null) {
                this.data.lengthD = this.data.length;
            }

            if (data && data.length > 0) {
                //加载行
                this.chks = [];
                this.rows = [];

                //清空表
                this.tbody.empty();
                if (this.p.lockColumn) {
                    this.tbody2.empty();
                }
                if (this.p.lockColumnR) {
                    this.tbody3.empty();
                }

                //                var thds = this.headContainer.find("div.dgj_tdDiv");  //获取表头列容器集合，用于确定表体列宽
                //                if(this.p.hasChk) {
                //                    thds = thds.not("div:first");
                //                }

                for (var i = 0, l = data.length; i < l; i++) {
                    var pt = { thds: this.thds };
                    var pId = data[i][this.p.idField];  //获取节点唯一标识,不存在则创建
                    if (pId == null) {
                        data[i][this.p.idField] = "dgjTg_" + new Date().getTime() + Math.random();
                    }
                    pt.deep = 0;       //深度
                    pt.path = i + ".";  //节点路径
                    pt.expand = true;
                    this.addRow(data[i], 0, null, true, null, null, null, null, pt);
                }

                this.setTableWidth();
                this.setMainHeight();

                //隐藏列
                if (!this.p.isTree) {
                    for (var i = 0, cols = this.p.columns, l = cols.length; i < l; i++) {
                        if (cols[i].isHide) {
                            this.hideColumn(i, false, true);
                        }
                    }
                }

                this.fire("dataLoaded", { data: data });
            }
            else {
                this.clearData();
            }

            this.hideSortImg();
            this.sbj.setScrollLeft(0);

            return this;
        },
        //#endregion

        //#region 加载树形数据(异步)
        loadDataTAsync: function (isInit, p, fn, nodes) {
            var thiz = this;
            this.fire("beforeTreeLoad", { node: p ? p.node : null });  //树加载前事件，此处可以设置获取数据服务参数的变更
            this.fire("treeLoad", { node: p ? p.node : null, isInit: isInit, p: p, fn: fn });  //树加载事件

            if (nodes) {  //如果第4个参数存在,则传递子节点集合
                this.loadTreeNodes(nodes, isInit, p, fn);
            }
            return this;
        },
        //#endregion

        //#region 加载树节点
        loadTreeNodes: function (data, isInit, p, fn) {
            if (this.p.checkAsyncLoad) {  //检测加载是否出错
                this.p.checkAsyncLoad.call(this, data);
            }

            if (data && data.length > 0) {
                if (isInit) {  //初始化表格
                    this.data = data;
                    if (this.data && this.data.lengthD == null) {
                        this.data.lengthD = this.data.length;
                    }
                    this.chks = [];
                    this.rows = [];

                    this.tbody.empty();  //清空表
                    if (this.p.lockColumn) {
                        this.tbody2.empty();
                    }
                    if (this.p.lockColumnR) {
                        this.tbody3.empty();
                    }
                }
                else {
                    if (this.p.asyncLoadTree) {  //将新获取的子节点集合填入总数据集中,延迟加载本地数据时没必要经此操作
                        if (data && data.lengthD == null) {
                            data.lengthD = data.length;
                        }
                        p.node[this.p.nodeIndex] = data;
                    }
                }

                //                var thds = this.headContainer.find("div.dgj_tdDiv");  //获取表头列容器集合，用于确定表体列宽
                //                if(this.p.hasChk) {
                //                    thds = thds.not("div:first");
                //                }

                var trAfter = null,
                    trsCa = [],
                    isCa = p && this.p.collapseAnimate;
                for (var i = 0, l = data.length; i < l; i++) {  //加载节点
                    var pt = { thds: this.thds };
                    var pId = data[i][this.p.idField];  //获取节点唯一标识,不存在则创建
                    if (pId == null) {
                        data[i][this.p.idField] = "dgjTg_" + new Date().getTime() + Math.random();
                    }

                    pt.expand = true;
                    if (!p) {  //初始加载时的值
                        pt.deep = 0;       //深度
                        pt.path = i + ".";  //节点路径
                    }
                    else {
                        pt.parentId = p.pId;         //父节点唯一标识
                        pt.deep = p.deep + 1;        //深度
                        pt.path = p.path + i + ".";  //节点路径
                        data[i].parentNode = p.node; //保存父节点引用
                        if (!trAfter) {
                            trAfter = p.trs;
                        }
                    }

                    if (this.p.judgeLeaf) {  //判断叶子节点方法,返回true则为叶子节点
                        if (this.p.judgeLeaf.call(this, data[i])) {
                            data[i].isLeaf = true;
                        }
                    }

                    trAfter = this.addRow(data[i], 0, trAfter, true, null, null, null, null, pt);
                    if (p && this.p.collapseAnimate) {  //首次加载不执行动画
                        trAfter.hide();          //执行动画前先隐藏行
                        trsCa.push(trAfter[0]);  //加入折叠动画集合
                    }

                    if (!this.p.isTree && !isInit && this.p.lockColumn) {  //同步单行行高
                        this.syncRowHeightR(null, trAfter[0], trAfter[1], trAfter[2]);
                    }

                    if (!this.p.isTree && !isInit) {  //隐藏列
                        for (var j = 0, cols = this.p.columns, m = cols.length; j < m; j++) {
                            if (cols[j].isHide) {
                                this.hideColumnR(trAfter, j, false);
                            }
                        }
                    }
                }

                var thiz = this, fnExp = function () {  //执行初始化展开节点
                    for (var i = 0, l = data.length; i < l; i++) {
                        var n = data[i];
                        if (n.isExpand) {
                            thiz.refreshChildNode(n, true);
                        }
                    }
                };

                if (isCa) {  //执行折叠动画
                    this.collapseAnimWrap(true, p.trs[0], $(trsCa), function () {
                        fnExp();
                    });
                }
                else {
                    fnExp();
                }

                if (fn) {  //回调方法
                    fn.call(this, true);
                }

                FJ.lazyDo(function () {
                    if (isInit) {  //只有初始化数据时执行，否则数据量大时同步行高方法可能会卡死
                        this.setTableWidth();
                    }
                    if (!isCa) {  //有折叠动画时不必重设高度否则在动画执行时会出现滚动条
                        this.setMainHeight();
                    }
                }, 200, "ld_dgjTg1", this);

                if (!this.p.isTree && isInit) {  //隐藏列
                    for (var i = 0, cols = this.p.columns, l = cols.length; i < l; i++) {
                        if (cols[i].isHide) {
                            this.hideColumn(i, false, true);
                        }
                    }
                }

                this.fire("afterTreeLoad", { data: data });
            }
            else {
                if (isInit) {
                    this.clearData();
                }

                if (fn) {  //回调方法
                    fn.call(this, false);
                }
            }

            if (isInit) {
                this.sbj.setScrollLeft(0);
            }
        },
        //#endregion

        //#region 级联遍历子节点
        cascade: function (data, fn, noOwn) {
            var noStop,
                nodes = data[this.p.nodeIndex];

            if (!noOwn) {
                noStop = fn.call(this, data);
            }
            if (noStop !== false && nodes) {
                for (var i = 0, l = nodes.length; i < l; i++) {
                    this.cascade(nodes[i], fn);
                }
            }
        },
        //#endregion

        //#region 级联遍历父节点
        bubble: function (data, fn, noOwn) {
            var noStop;

            if (!noOwn) {
                noStop = fn.call(this, data);
            }
            if (noStop !== false && data.parentNode) {
                this.bubble(data.parentNode, fn);
            }
        },
        //#endregion

        //#region 查找节点对象
        seekNode: function (path) {
            var thiz = this, node,
                d = this.data;
            if (d.length <= 0) {
                return;
            }

            //            var ps = path.split(".");
            //            for (var i = 0, l = ps.length; i < l; i++) {
            //                if (i == 0) {
            //                    d = d[ps[i]];
            //                }
            //                else {
            //                    if(d[this.p.nodeIndex]) {
            //                        d = d[this.p.nodeIndex][ps[i]];
            //                    }
            //                    else {
            //                        return;
            //                    }
            //                }
            //            }
            //            return d;
            for (var i = 0, l = d.length; i < l; i++) {
                this.cascade(d[i], function (n) {
                    if (n[thiz.p.nodePathField] == path) {
                        node = n;
                        return false;
                    }
                });
            }
            return node;
        },
        //#endregion

        //#region 获取选中节点
        getCheckedNodes: function (isOnlyLeaf) {
            var thiz = this, nodes = [];
            for (var i = 0, l = this.data.length; i < l; i++) {
                var d = this.data[i];
                this.cascade(d, function (node) {
                    if (node.isCheck) {
                        var b = 1;
                        if (isOnlyLeaf && !node.isLeaf) {  //是否只取叶子节点
                            if (thiz.p.judgeLeaf && thiz.p.judgeLeaf.call(thiz, d)) {  //判断叶子节点方法,返回true则为叶子节点
                                d.isLeaf = true;
                            }
                            else {
                                b = 0;
                            }
                        }

                        if (b) {
                            nodes.push(node);
                        }
                    }
                });
            }
            return nodes;
        },

        getCheckedNodeIds: function (field, isOnlyLeaf) {
            var nodes = this.getCheckedNodes(isOnlyLeaf),
                idf = !field ? this.p.idField : field,
                ids = STJ.init();

            for (var i = 0, l = nodes.length; i < l; i++) {
                ids.add(nodes[i][idf]);
            }
            return ids.join(",");
        },
        //#endregion

        //#region 删除子节点
        deleteChildNode: function (node) {
            if (typeof node == "string") {
                node = this.seekNode(node);
            }
            if (!node) {
                return;
            }

            this.bodyContainer.find("tr[nodeno^=" + node.nodeNo + "][nodeno!=" + node.nodeNo + "]").remove();  //删除tr
            node[this.p.nodeIndex] = null;  //删除数据集合
        },
        //#endregion

        //#region 刷新子节点
        refreshChildNode: function (node, notDelChild) {
            if (typeof node == "string") {
                node = this.seekNode(node);
            }
            if (!node) {
                return;
            }

            if (!notDelChild) {
                this.deleteChildNode(node);  //删除子节点
            }
            var ni = node.nodeIcon;      //恢复节点图标初始状态
            node.nodeImg.swapClassJ("dgj_folderOpen dgj_loadingT", "dgj_folderClose");
            node.isLeaf = false;
            node.complete = false;
            ni.setChecked(true);
        },
        //#endregion
        //#endregion

        //#region 延时加载
        //#region 判断数据量是否达到延迟加载极限
        judgeLazyDataLimit: function () {
            if (this.p.lazyDataLimit > -1) {  //数据量超过极限值后使用延迟加载
                if (this.p.isPageCache) {  //使用分页缓存时每次查询只检测第一页
                    if (this.pageCache.length > 0) {
                        return;
                    }
                }
                if (this.data.length < this.p.lazyDataLimit) {
                    this.p.isLazyLoad = false;
                }
                else {
                    this.p.isLazyLoad = true;
                }
            }
        },
        //#endregion

        //#region 创建loading行
        addLoadingRow: function () {
            if (this.lazyRowNo >= this.data.length) {
                return;
            }

            var cols = 0;
            if (!this.p.lockColumn) {
                cols = this.p.columns.length;
            }
            else {
                cols = this.p.lockColumn - 1;
            }
            if (this.p.hasChk) {
                cols += 1;
            }

            var hTr = 35, noL = 5;
            if (this.p.hasGroup) {
                hTr = 50;
                noL = 4;
            }

            if (!this.loadingRow) {
                this.loadingRow = $('<tr loading="true"></tr>').append($('<td colspan="' + cols + '" style="text-align:center;height:' + hTr + 'px;"></td>').append(LMJ.getLoadImg(noL)));
            }
            else {
                this.loadingRow.show().find("td").attr("colspan", cols);
            }
            this.tbody.append(this.loadingRow);
            if (this.table.find("td:visible").length <= 1) {
                this.loadingRow.hide();
            }
            if (this.p.lockColumn) {
                var cols2 = this.p.columns.length - this.p.lockColumn + 1;
                if (!this.loadingRow2) {
                    this.loadingRow2 = $('<tr loading="true"></tr>').append($('<td colspan="' + cols2 + '" style="text-align:center;height:' + hTr + 'px;"></td>').append(LMJ.getLoadImg(noL)));
                }
                else {
                    this.loadingRow2.show().find("td").attr("colspan", cols2);
                }
                this.tbody2.append(this.loadingRow2);
                if (this.table2.find("td:visible").length <= 1) {
                    this.loadingRow2.hide();
                }
            }
            if (this.p.lockColumnR) {
                var cols3 = this.p.columns.length - this.p.lockColumnR + 1;
                if (!this.loadingRow3) {
                    this.loadingRow3 = $('<tr loading="true"></tr>').append($('<td colspan="' + (this.p.columns.length - this.p.lockColumnR + 1) + '" style="text-align:center;height:' + hTr + 'px;"></td>').append(LMJ.getLoadImg(noL)));
                }
                else {
                    this.loadingRow3.show().find("td").attr("colspan", cols3);
                }
                this.tbody3.append(this.loadingRow3);
                if (this.table3.find("td:visible").length <= 1) {
                    this.loadingRow3.hide();
                }
            }
        },
        //#endregion

        //#region 延时加载行
        lazyAddRow: function (noScroll) {
            if (this.lazyRowNo >= this.data.length) {
                this.divOut.attr("title", "");
                return false;
            }

            if (this.bodyContainer[0].scrollTop + this.bodyContainer[0].clientHeight > this.bodyContainer[0].scrollHeight - (!this.p.hasGroup ? this.p.lazyScrollBottom + 40 : this.p.lazyScrollBottom + 55) || noScroll) {
                if (this.loadingRow) {
                    var thiz = this;
                    this.loadingRow.hide();
                    if (this.p.lockColumn) {
                        this.loadingRow2.hide();
                    }
                    if (this.p.lockColumnR) {
                        this.loadingRow3.hide();
                    }

                    if (!this.p.hasGroup) {
                        var oTr = this.addRow(this.data[this.lazyRowNo], this.getRowNoL(), null, true, null, null, this.pageNo);
                        for (var i = 0, cols = this.p.columns, l = cols.length; i < l; i++) {  //隐藏列
                            if (cols[i].isHide) {
                                this.hideColumnR(oTr, i, false);
                            }
                        }
                    }
                    else {
                        var oTrs = [];
                        this.addRowGS(this.data[this.lazyRowNo], this.getRowNoL(), this.pageNo, null, null, null, oTrs);
                        if (oTrs.length > 0) {
                            for (var i = 0, cols = this.p.columns, l = cols.length; i < l; i++) {  //隐藏列
                                if (cols[i].isHide) {
                                    for (var j = 0, m = oTrs.length; j < m; j++) {
                                        this.hideColumnR(oTrs[j], i, false);
                                    }
                                }
                            }
                        }
                    }

                    this.syncRowHeightR(this.lazyRowNo);
                    this.lazyRowNo++;
                    if (this.p.isPageCache) {
                        this.getPageCache(this.pageNo)[6] = this.lazyRowNo;
                    }
                    if (this.lazyRowNo <= this.data.length - 1) {
                        this.addLoadingRow();
                    }
                }

                return true;
            }
            else {
                return false;
            }
        },
        //#endregion

        //#region 自动将可视区域内的延时加载行加载完
        autoLoadlazyRow: function (noScroll, timeOut) {
            if (this.p.isLazyLoad) {  //延迟加载行
                var thiz = this;
                var fn = function () {
                    for (var i = 0, l = thiz.data.length; i < l; i++) {
                        if (thiz.lazyRowNo > l - 1) {
                            //this.p.canSort = true;
                            thiz.divOut.attr("title", "");
                            break;
                        }
                        if (!thiz.lazyAddRow(noScroll)) {
                            break;
                        }
                        thiz.setMainHeight();
                    }
                    thiz.joinCacheData();  //连接缓存数据集
                };

                if (timeOut) {
                    FJ.lazyDo(function () {
                        fn();
                    }, timeOut, "ld_dgjALllr", this);
                }
                else {
                    fn();
                }
            }
        },
        //#endregion
        //#endregion

        //#region 分页缓存
        //#region 添加分页缓存数据
        addPageCache: function (pageNo, dataF, cacheParam) {
            if (this.p.isPageCache) {
                //加入分页缓存(参数:页码,数据集,表体1,复选框集合,表体2,表体3,延迟加载已经加载完成的行数,行集合,底部数据集,自定义缓存参数)
                var arrPage = [pageNo, this.data, this.tbody, this.chks, this.tbody2, this.tbody3, this.p.isLazyLoad ? this.lazyRowNo : null, this.rows, dataF, cacheParam];
                this.pageCache.push(arrPage);
                return arrPage;
            }
        },
        //#endregion

        //#region 按页码获取分页缓存数据
        getPageCache: function (pageNo) {
            var cache = false,
                pc = this.pageCache;
            if (this.p.isPageCache) {
                for (var i = 0, l = pc.length; i < l; i++) {
                    if (pc[i][0] == pageNo) {
                        cache = pc[i];
                        break;
                    }
                }
            }
            return cache;
        },
        //#endregion

        //#region 清空页缓存
        clearPageCache: function () {
            if (this.p.isPageCache) {
                this.pageCache = [];
                this.datas = [];

                var tbd = this.table.find("tbody:hidden");
                if (tbd.length > 0 && tbd.children("tr").length > 0) {
                    tbd.remove();
                }
                if (this.p.lockColumn) {
                    var tbd2 = this.table2.find("tbody:hidden");
                    if (tbd2.length > 0 && tbd2.children("tr").length > 0) {
                        tbd2.remove();
                    }
                }
                if (this.p.lockColumnR) {
                    var tbd3 = this.table3.find("tbody:hidden");
                    if (tbd3.length > 0 && tbd3.children("tr").length > 0) {
                        tbd3.remove();
                    }
                }
            }
        },
        //#endregion

        //#region 将分页缓存各页数据集拼接为一个数组
        joinCacheData: function () {
            if (this.p.isPageCache) {
                this.datas = [];
                var pc = this.pageCache;
                for (var i = 0, l = pc.length; i < l; i++) {
                    $.merge(this.datas, pc[i][1]);
                }
            }
        },
        //#endregion
        //#endregion

        //#region 隐藏列
        //#region 隐藏列
        hideColumn: function (colNo, isHide, isLoaded) {
            //保持至少有一列显示
            if (!isHide && !isLoaded && this.headContainer.find("div.dgj_tdDiv:hidden").length >= this.p.columns.length - 1) {
                return false;
            }

            var thiz = this;
            var no = colNo;
            if (this.p.hasChk) {
                no += 1;
            }
            var hideOrShow = "hide",
                fTr = this.p.filterTag ? ",tr[" + this.p.filterTag + "]" : "",
                fTd = fTr ? ":not(td[" + this.p.filterTag + "])" : "";
            if (isHide) {
                hideOrShow = "show";
            }

            var colType = this.getColType(colNo);
            switch (colType) {
                case 0: {
                    this.tableHead.find("th").eq(no)[hideOrShow]();
                    this.table.find("tr:not(tr[loading],tr[groupRow],tr[emptyRow]" + fTr + ")").each(function (inx) {
                        var oTh = $(this);
                        if (!oTh.hasClass("dgj_trG1")) {
                            oTh.find("td" + fTd).eq(no)[hideOrShow]();
                        }
                    });

                    if (this.p.hasGridFoot) {   //表底
                        this.trF.find("td").eq(no)[hideOrShow]();
                    }

                    if (this.p.canColumeDD) {
                        this.colDDs[colNo][hideOrShow]();
                        var scrollL = this.sbj.getScrollLeft();  //定位拖动条
                        if (scrollL > 0) {
                            this.sbj.setScrollLeft(scrollL + 1);
                            this.sbj.setScrollLeft(scrollL - 1);
                        }
                        else {
                            this.setDDPosition();
                        }
                    }

                    this.setSbjWidth(true);   //设置下滚动条宽
                    this.setMainHeight();
                    if (thiz.p.collapseSonRow) {  //设置分组列宽
                        thiz.tbody.find("div.dgj_tdDiv").eq(thiz.p.hasChkG ? 1 : 0).width(thiz.tableHead.width() - thiz.p.chkWidth - thiz.shiftG);
                    }
                }
                    break;
                case 1: {
                    this.tableHead.find("th").eq(no)[hideOrShow]();
                    this.table.find("tr:not(tr[loading],tr[emptyRow]" + fTr + ")").each(function (inx) {
                        $(this).find("td" + fTd).eq(no)[hideOrShow]();
                    });

                    if (this.p.isLazyLoad) {  //延迟加载时控制loading行显隐
                        if (this.loadingRow) {
                            if (this.table.find("td:visible").length <= 1) {
                                this.loadingRow.hide();
                            }
                            else {
                                if (this.lazyRowNo <= this.data.length - 1) {
                                    this.loadingRow.show();
                                }
                            }
                        }

                        if (!this.p.asyncLoadTree) {  //异步加载树时不执行同步行高
                            FJ.lazyDo(function () {
                                this.syncRowHeightB();
                            }, 500, "ld_dgjSyncRH", this);
                        }
                    }

                    if (this.p.canColumeDD) {
                        this.colDDs[colNo][hideOrShow]();
                    }
                    this.setLockWidth();
                    //设置下滚动条位置                                        
                    this.setDDPosition();
                    this.setLockWidth();
                    this.sbj.left(this.table.width());
                }
                    break;
                case 2: {
                    var k = colNo - this.p.lockColumn + 1;
                    this.tableHead2.find("th").eq(k)[hideOrShow]();
                    this.table2.find("tr:not(tr[loading],tr[emptyRow]" + fTr + ")").each(function (inx) {
                        $(this).find("td" + fTd).eq(k)[hideOrShow]();
                    });

                    if (this.p.isLazyLoad) {  //延迟加载时控制loading行显隐
                        if (this.loadingRow) {
                            if (this.table2.find("td:visible").length <= 1) {
                                this.loadingRow2.hide();
                            }
                            else {
                                if (this.lazyRowNo <= this.data.length - 1) {
                                    this.loadingRow2.show();
                                }
                            }
                        }

                        if (!this.p.asyncLoadTree) {  //异步加载树时不执行同步行高
                            FJ.lazyDo(function () {
                                this.syncRowHeightB();
                            }, 500, "ld_dgjSyncRH", this);
                        }
                    }

                    if (this.p.canColumeDD) {
                        this.colDDs[colNo][0][hideOrShow]();
                        this.colDDs[colNo][1][hideOrShow]();
                    }
                    this.setDDPosition(true);
                    this.setLockWidth();
                    var scrollL = this.sbj.getScrollLeft();
                    if (scrollL > 0) {
                        this.sbj.setScrollLeft(scrollL + 1);
                        this.sbj.setScrollLeft(scrollL - 1);
                    }
                    else {
                        this.setDDPosition(true);
                    }
                }
                    break;
                case 3: {
                    var k = colNo - this.p.lockColumnR + 1;
                    this.tableHead3.find("th").eq(k)[hideOrShow]();
                    this.table3.find("tr:not(tr[loading],tr[emptyRow]" + fTr + ")").each(function (inx) {
                        $(this).find("td" + fTd).eq(k)[hideOrShow]();
                    });

                    if (this.p.isLazyLoad) {  //延迟加载时控制loading行显隐
                        if (this.loadingRow) {
                            if (this.table3.find("td:visible").length <= 1) {
                                this.loadingRow3.hide();
                            }
                            else {
                                if (this.lazyRowNo <= this.data.length - 1) {
                                    this.loadingRow3.show();
                                }
                            }
                        }

                        if (!this.p.asyncLoadTree) {  //异步加载树时不执行同步行高
                            FJ.lazyDo(function () {
                                this.syncRowHeightB();
                            }, 500, "ld_dgjSyncRH", this);
                        }
                    }

                    if (this.p.canColumeDD) {
                        this.colDDs[colNo][hideOrShow]();
                    }
                    this.setLockWidth();
                    this.sbj.left(this.table.width());
                    //设置下滚动条位置                                        
                    this.setDDPosition();
                    this.setLockWidth();
                }
                    break;
            }

            return true;
        },
        //#endregion

        //#region 隐藏列(单行)
        hideColumnR: function (oTr, colNo, isHide) {
            var oTr1;
            if (!$.isArray(oTr)) {
                oTr1 = oTr;
            }
            else {
                oTr1 = oTr[0];
            }

            if (oTr1.attr("emptyRow"))  //表格空时不操作
                return;

            var no = colNo;
            if (this.p.hasChk) {
                no += 1;
            }
            var hideOrShow = "hide";
            if (isHide) {
                hideOrShow = "show";
            }

            var colType = this.getColType(colNo);
            switch (colType) {
                case 0:
                    if (!oTr1.hasClass("dgj_trG1")) {
                        oTr1.find("td").eq(no)[hideOrShow]();
                    }
                    break;
                case 1:
                    oTr1.find("td").eq(no)[hideOrShow]();
                    break;
                case 2:
                    var k = colNo - this.p.lockColumn + 1;
                    oTr[1].find("td").eq(k)[hideOrShow]();
                    break;
                case 3:
                    var k = colNo - this.p.lockColumnR + 1;
                    oTr[2].find("td").eq(k)[hideOrShow]();
                    break;
            }
        },
        //#endregion

        //#region 菜单隐藏列方法
        hideColumnMenu: function (cn, checked, chk) {
            if (!this.hideColumn(cn, checked)) {
                if (chk) {
                    chk.setChecked(true, null, true);
                }
            }
            else {
                this.p.columns[cn].isHide = !checked;
                if (this.p.storeName) {   //将隐藏列状态存储到本地存储中
                    var data = [];
                    for (var i = 0, cols = this.p.columns, l = cols.length; i < l; i++) {
                        if (cols[i].isHide) {
                            data.push(i);
                        }
                    }
                    FJ.LocalStorage.setItem({ key: this.p.storeName + "_hide", value: JSON.stringify(data) });
                }
            }
        },
        //#endregion

        //#region 设置默认隐藏的列
        hideColumnD: function () {
            if (this.p.defaultHideColumn.length > 0) {  //默认隐藏的列
                var cols = this.p.columns;
                for (var i = 0, dhc = this.p.defaultHideColumn, l = dhc.length; i < l; i++) {
                    var no = dhc[i];
                    cols[no].isHide = true;
                    //this.p.stopHideColumn.push(no);
                }
            }
        },
        //#endregion
        //#endregion

        //#region 创建、删除行
        //#region 创建表(连字符串)
        renderTable: function (data, pageNo, hasChk, oTrG) {
            var thiz = this;
            var b = [], b2, b3;
            if (this.p.lockColumn) {
                b2 = [];
            }
            if (this.p.lockColumnR) {
                b3 = [];
            }

            this.renderRows(b, b2, b3, data, pageNo, hasChk, null);
            this.mainContainer[0].innerHTML = b.join("");
            this.table = $("#dgj_table_" + this.objId);
            this.tbody = $("#dgj_tbody_" + this.objId);

            if (b2) {
                this.lcContainer[0].innerHTML = b2.join("");
                this.table2 = $("#dgj_table2_" + this.objId);
                this.tbody2 = $("#dgj_tbody2_" + this.objId);
            }
            if (b3) {
                this.rightContainer[0].innerHTML = b3.join("");
                this.table3 = $("#dgj_table3_" + this.objId);
                this.tbody3 = $("#dgj_tbody3_" + this.objId);
            }

            //                    var trs;
            //                    if(!this.p.hasGroup && this.p.lockColumn){
            //                        trs = this.gridContainer.find("tr.dgj_trB_" + rowNo + (!pageNo ? "" : ("_" + pageNo)));
            //                    }
            //                    else{
            //                        trs = trB;
            //                    }

            var trs = this.table.find("tr.dgj_tr1"), trs2, trs3;
            if (b2) {
                trs2 = this.table2.find("tr.dgj_tr2");
            }
            if (b3) {
                trs3 = this.table3.find("tr.dgj_tr3");
            }
            trs.each(function (k) {
                var tr = trs.eq(k), tr2, tr3;
                if (trs2) {
                    tr2 = trs2.eq(k);
                }
                if (trs3) {
                    tr3 = trs3.eq(k);
                }

                //设置隔行变色
                thiz.setRowColor(k, tr, tr2, tr3, data[k].checked);

                //                if (thiz.p.colorParams.highlight) {  //鼠标移上高亮
                //                    thiz.setRowHL(tr);
                //                }

                //                var chk;
                //                if(thiz.p.hasChk) {
                //                    (function (d, rowNo) {
                //                        chk = tr.find("input[chkCell]");
                //                        chk.click(function (e, p) {
                //                            e.stopPropagation();
                //                            thiz.check(rowNo, d, p, chk, pageNo);
                //                        });
                //                        thiz.chks.push(chk);
                //                    })(data[k], k);
                //                }

                //                if (thiz.p.hasRowContextMenu) {  //右击菜单
                //                    tr.bind("contextmenu", function(e) {
                //                        if(!oTrG && (!thiz.p.hasChk || !thiz.p.canSelectRowR)) {
                //                            if(thiz.pasteRow) {  //去除粘贴状态
                //                                thiz.pasteRow.removeAttr("pasteRow");
                //                            }
                //                            thiz.pasteRow = tr;
                //                            tr.attr("pasteRow", true);
                //                        }
                //                        else if(oTrG && (!thiz.p.hasChkG || !thiz.p.canSelectRowR)) {  //有分组行时
                //                            if(thiz.pasteRowG) {  //去除粘贴状态
                //                                thiz.pasteRowG.removeAttr("pasteRowG");
                //                            }
                //                            thiz.pasteRowG = oTrG;
                //                            oTrG.attr("pasteRowG", true);
                //                        }
                //                        else if(chk && !chk.attr("checked") && thiz.p.hasChk && thiz.p.canSelectRowR) {  //右击时选中行
                //                            chk.trigger("click", { isClickRow: true });
                //                        }
                //                    });
                //                }

                //                if(thiz.p.hasChk && thiz.p.canSelectRow && chk) {
                //                    tr.bind("click", function(e) {
                //                        chk.trigger("click", { isClickRow: true });
                //                    });
                //                }
            });
        },
        //#endregion

        //#region 创建表行(连字符串)
        renderRows: function (b, b2, b3, data, pageNo, hasChk, rowNoG) {
            var thiz = this;
            var thds = this.headContainer.find("div.dgj_tdDiv");
            if (this.p.hasChk) {
                thds = thds.not("div:first");
            }

            b[b.length] = '<table id="dgj_table_' + this.objId + '" class="dgj_table1"><tbody id="dgj_tbody_' + this.objId + '">';
            if (b2) {
                b2[b2.length] = '<table id="dgj_table2_' + this.objId + '" class="dgj_table2" style="margin-left:-1px;" ><tbody id="dgj_tbody2_' + this.objId + '">';
            }
            if (b3) {
                b3[b3.length] = '<table id="dgj_table3_' + this.objId + '" class="dgj_table3"><tbody id="dgj_tbody3_' + this.objId + '">';
            }

            for (var i = 0, l = data.length; i < l; i++) {
                var rowData = data[i], rowNo = i;

                for (var o in rowData) {   //将空属性附上空字符串
                    if (rowData[o] == null) {
                        rowData[o] = "";
                    }
                }

                if (!rowData.checked) {  //初始化选中字段
                    rowData.checked = false;
                }

                b[b.length] = '<tr class="dgj_tr1 dgj_trB_' + (!this.p.hasGroup ? rowNo : rowNoG) + (!pageNo ? "" : ("_" + pageNo)) + '">';

                if (b2) {
                    b2[b2.length] = '<tr class="dgj_tr2 dgj_trB_' + rowNo + (!pageNo ? "" : ("_" + pageNo)) + '"></tr>';
                }
                if (b3) {
                    b3[b3.length] = '<tr class="dgj_tr3 dgj_trB_' + rowNo + (!pageNo ? "" : ("_" + pageNo)) + '"></tr>';
                }

                if (this.p.hasChk && hasChk) {  //是否有复选框
                    b[b.length] = '<td chkCell="true" style="text-align:center;height:' + this.p.defaultH + 'px;">';
                    b[b.length] = '<div chkCellDiv="true" class="dgj_tdDiv" style="width:' + this.p.chkWidth + 'px;">';
                    b[b.length] = '<input chkCell="true" type="checkbox" ' + (rowData.checked ? 'checked' : '') + ' />';
                    b[b.length] = '</div></td>';
                }

                for (var j = 0, cols = this.p.columns, m = cols.length; j < m; j++) {
                    var buf;
                    var cType = this.getColType(j);
                    switch (cType) {
                        case 0:
                        case 1:
                            buf = b;
                            break;
                        case 2:
                            buf = b2;
                            break;
                        case 3:
                            buf = b3;
                            break;
                    }

                    (function (c, wH) {
                        thiz.fire("preColumnRender", { rowData: rowData });  //列加载前事件

                        buf[buf.length] = '<td colId="' + j + '" style="height:' + thiz.p.defaultH + 'px;text-align:' + (c.align ? c.align : thiz.p.defaultAlign) + ';" >';
                        buf[buf.length] = '<div class="dgj_tdDiv" style="width:' + (thiz.p.noGridBorder ? wH + 1 : wH) + 'px;">';
                        buf[buf.length] = !c.renderFn ? rowData[c.dataIndex] : c.renderFn.call(thiz, rowData[c.dataIndex], rowData, rowNo);
                        buf[buf.length] = '</div></td>';

                        //                        if(c.asyncLoadFn){  //异步加载方法
                        //                            asyncLoadFns.push([c.asyncLoadFn, [rowData[c.dataIndex], rowData, rowNo, j]]);
                        //                        }
                    })(cols[j], parseInt(thds.eq(j)[0].style.width, 10));
                }

                b[b.length] = '</tr>';
                if (b2) {
                    b2[b2.length] = '</tr>';
                }
                if (b3) {
                    b3[b3.length] = '</tr>';
                }
            }

            b[b.length] = '</tbody></table>';
            if (b2) {
                b2[b2.length] = '</tbody></table>';
            }
            if (b3) {
                b3[b3.length] = '</tbody></table>';
            }

            return this;
        },
        //#endregion

        //#region 创建行
        addRow: function (rowData, rowNo, trAfter, hasChk, rowNoG, rowDataG, pageNo, oTrG, paramT) {  //参数:[行数据,行号,加在某一行后面,是否有复选框,分组行号,分组行数据,页码,分组行对象,参数对象]
            var thiz = this,
                isDynamic,
                isTg = this.p.isTreeGrid,
                aNo = this.p.autoNo;

            if (rowNo == null) {  //不填行数时为动态加载
                isDynamic = 1;
                hasChk = 1;
                if (this.isDataEmpty()) {  //清空表
                    this.tbody.empty();
                    if (this.p.lockColumn) {
                        this.tbody2.empty();
                    }
                    if (this.p.lockColumnR) {
                        this.tbody3.empty();
                    }
                    this.addPageCache(this.pageNo);  //表格为空时添加分页缓存
                }

                if (!this.p.isLazyLoad) {
                    rowNo = this.data.lengthD;
                }
                else {
                    rowNo = this.getRowNoL();
                }

                this.data.push(rowData);
                this.data.lengthD++;

                if (this.p.isLazyLoad) {
                    this.lazyRowNo++;
                    if (this.p.isPageCache) {
                        this.getPageCache(this.pageNo)[6] = this.lazyRowNo;
                    }
                }

                this.joinCacheData();
            }

            for (var o in rowData) {   //将空属性赋上空字符串
                if (rowData[o] == null) {
                    rowData[o] = "";
                }
            }

            if (!paramT) {
                paramT = {};
            }

            if (aNo) {  //自动行号
                rowData[aNo] = rowNo + 1 + ((pageNo != null && this.pageSize) ? (pageNo - 1) * this.pageSize : 0);
            }

            var trB = null,
                trB2,
                trB3,
                rNo,
                paNo = paramT.parentId ? paramT.parentId : "root",
                idF = thiz.p.idField;

            if (this.p.hasGroup) {
                rNo = rowNoG;
            }
            else if (isTg) {
                rNo = (paramT.parentId ? paramT.parentId + "_" : "") + rowData[this.p.idField] + "_";
                rowData.nodeNo = rNo;  //记录节点编号
            }
            else {
                rNo = rowNo;
            }
            rNo += !pageNo ? "" : ("_" + pageNo);

            trB = $('<tr class="dgj_tr1 dgj_trB_' + rNo + '"></tr>');
            if (isTg) {
                trB.attr({
                    nodeNo: rNo,
                    parentNo: paNo,
                    deep: paramT.deep,
                    path: paramT.path
                });

                if (rowData.isCheck == null) {
                    rowData.isCheck = 0;  //树节点复选框默认值
                }
                rowData.nodePath = paramT.path;  //保存节点路径
            }
            if (this.p.hasGroup) {
                trB.attr("rowNo", rowNoG + "_" + rowNo + (!pageNo ? "" : ("_" + pageNo)));
            }
            if (this.p.collapseSonRow && (rowDataG && !rowDataG.checked)) {
                trB.hide();
            }

            if (this.p.lockColumn) {
                trB2 = $('<tr class="dgj_tr2 dgj_trB_' + rNo + '"></tr>');
                if (isTg) {
                    trB2.attr({
                        nodeNo: rNo,
                        parentNo: paNo,
                        deep: paramT.deep,
                        path: paramT.path
                    });
                }
            }
            if (this.p.lockColumnR) {
                trB3 = $('<tr class="dgj_tr3 dgj_trB_' + rNo + '"></tr>');
                if (isTg) {
                    trB3.attr({
                        nodeNo: rNo,
                        parentNo: paNo,
                        deep: paramT.deep,
                        path: paramT.path
                    });
                }
            }

            if (!rowData.checked) {  //初始化选中字段
                rowData.checked = false;
            }

            var fm = document.createDocumentFragment(), fm2, fm3;  //创建文档碎片以供加载td，可以提高速度
            if (this.p.lockColumn) {
                fm2 = document.createDocumentFragment();
            }
            if (this.p.lockColumnR) {
                fm3 = document.createDocumentFragment();
            }

            var chk, rowNum,
                pNo = !pageNo ? "" : ("_" + pageNo);
            if (rowNoG != null) {
                rowNum = rowNoG + "_" + rowNo + pNo;
            }
            else {
                if (!isTg) {
                    rowNum = rowNo + pNo;
                }
                else {
                    rowNum = paramT.path + pNo;
                }
            }
            if (this.p.hasChk) {  //是否有复选框
                var tdChk = $('<td chkCell="true" style="text-align:center;height:' + thiz.p.defaultH + 'px;' + (!this.p.hideChk ? '' : 'display:none;') + '"><div chkCellDiv="true" class="dgj_tdDiv dgj_chkDiv" style="width:' + this.p.chkWidth + 'px"></div></td>');
                var tdDiv, oTd = tdChk[0];
                if (oTd.firstElementChild) {
                    tdDiv = $(oTd.firstElementChild);
                }
                else {
                    tdDiv = $(oTd.firstChild);
                }

                if (hasChk) {
                    (function (d, rNum, chks) {
                        chk = $('<input id="chkRow_' + rNum + "_" + thiz.objId + '" ' + (d.checked ? 'checked' : '') + ' type="checkbox" hidefocus />');
                        if (thiz.p.chkStyle) {  //复选框使用自定义样式
                            chk.sbxj = chk.SBXJ({
                                initClass: "dgj_chkC",
                                type: thiz.p.chkCollapse ? "collapse" : null,
                                canQuery: false,
                                isInitHide: false,
                                evts: {
                                    beforeClick: function (e, p) {  //用低版本jquery模拟点击复选框时会先执行事件后改变状态,所以此处需用相反的状态来改变自定义复选框的状态
                                        return p.param && (p.param.isClickRow || p.param.isAllCheck) ? !p.checked : p.checked;
                                    }
                                }
                            });
                            tdDiv.append(chk.sbxj.divOut);
                        }
                        else {
                            tdDiv.append(chk);
                        }
                        chk.click(function (e, p) {
                            e.stopPropagation();
                            if (this.paramJ != null) {  //可在dom元素上传递参数,为解决jquery1.10以上版本无法在trigger中给checkbox的click事件传参数
                                p = this.paramJ;
                                this.paramJ = undefined;  //解决IE9以下IE不支持dom元素delete属性
                                try {
                                    delete this.paramJ;
                                }
                                catch (ex) { };
                            }
                            thiz.check(!isTg ? rowNo : paramT.path, d, p, chk, pageNo);
                        });

                        if (isTg) {
                            rowData[thiz.p.nodeChkField] = chk;  //树节点保存复选框引用
                        }
                        else {
                            chks.push(chk);  //表格行加入复选框集合
                        }
                    })(rowData, rowNum, thiz.chks);
                }
                fm.appendChild(oTd);
            }

            //设置隔行变色
            this.setRowColor(rowNo, trB, trB2, trB3, rowData.checked);

            //加载行
            if (!trAfter) {
                this.tbody.append(trB);
            }
            else {   //加在某行后面
                if (!$.isArray(trAfter)) {
                    trAfter.after(trB);
                }
                else {
                    trAfter[0].after(trB);
                }
            }
            if (this.p.lockColumn) {
                if (!trAfter) {
                    this.tbody2.append(trB2);
                }
                else {
                    trAfter[1].after(trB2);
                }
            }
            if (this.p.lockColumnR) {
                if (!trAfter) {
                    this.tbody3.append(trB3);
                }
                else {
                    trAfter[2].after(trB3);
                }
            }

            var trs;
            if (!this.p.hasGroup && this.p.lockColumn) {  //有冻结列时获取当前行所有tr集合
                if (this.p.lockColumn) {
                    if (!this.p.lockColumnR) {
                        trs = trB.add(trB2);
                    }
                    else {
                        trs = trB.add(trB2).add(trB3);
                    }
                }
            }
            else {
                trs = trB;
            }


            this.setRowHL(trs);  //鼠标移上高亮

            if (this.p.hasRowContextMenu) {  //右击菜单
                trs.bind("contextmenu", function (e) {
                    if (!oTrG && (!thiz.p.hasChk || !thiz.p.canSelectRowR)) {
                        if (thiz.pasteRow) {  //去除粘贴状态
                            thiz.pasteRow.removeAttr("pasteRow");
                        }
                        thiz.pasteRow = trB;
                        trB.attr("pasteRow", true);

                        if (isTg) {
                            thiz.currentNode = rowData;  //记录当前节点
                        }
                    }
                    else if (oTrG && (!thiz.p.hasChkG || !thiz.p.canSelectRowR)) {  //有分组行时
                        if (thiz.pasteRowG) {  //去除粘贴状态
                            thiz.pasteRowG.removeAttr("pasteRowG");
                        }
                        thiz.pasteRowG = oTrG;
                        oTrG.attr("pasteRowG", true);
                    }
                    else if (chk && !chk[0].checked && thiz.p.hasChk && thiz.p.canSelectRowR) {  //右击时选中行
                        var obj = e.srcElement ? e.srcElement : e.target, o = $(obj);
                        if (!o.hasClass("dgj_chkC")) {
                            var pa = { isClickRow: true };
                            chk[0].paramJ = pa;
                            chk.trigger("click", pa);
                        }
                    }
                });
            }

            if (this.p.hasChk && this.p.canSelectRow && chk) {
                trs.onGestureJ(fj.Evt.click, function (e, p) {
                    var evt = p.evt,
                        obj = evt.srcElement ? evt.srcElement : evt.target,
                        o = $(obj);

                    if (!o.hasClass("dgj_chkC")) {
                        var pa = { isClickRow: true };
                        chk[0].paramJ = pa;
                        chk.trigger("click", pa);
                    }
                }, { preventClick: false });
            }

            //加载各列
            var thds;
            if (paramT && paramT.thds) {
                thds = paramT.thds;
            }
            else {
                thds = this.headContainer.find("div.dgj_tdDiv");
                if (this.p.hasChk) {
                    thds = thds.not("div:first");
                }
            }

            var asyncLoadFns = [],
                renderFns = [],
                oTrBs = [],
                tdDs = [],
                cellP = this.p.cellPadding,
                cellIP = this.p.cellInnerPadding;
            //#region 连接字符串的加载方式
            //            var sTr, sTr1 = [], sTr2, sTr3;
            //            if(this.p.lockColumn) {
            //                sTr2 = [];
            //            }
            //            if(this.p.lockColumnR) {
            //                sTr3 = [];
            //            }
            //            var jqDoms = [];  //jqDom元素集合
            //#endregion

            for (var j = 0, cols = this.p.columns, l = cols.length; j < l; j++) {
                var oTrB, oFm,
                    iF = 0,  //按各冻结表计算的列索引
                    cType = this.getColType(j),
                    c = cols[j];
                switch (cType) {
                    case 0:
                    case 1:
                        if (j == 0 && thiz.p.lockColumn) {
                            iF = 1;
                        }
                        else {
                            iF = 0;
                        }
                        oTrB = trB;
                        oFm = fm;
                        //#region 连接字符串的加载方式
                        //sTr = sTr1;
                        //#endregion
                        break;
                    case 2:
                        if (j - thiz.p.lockColumn + 1 == 0) {
                            iF = 1;
                        }
                        else {
                            iF = 0;
                        }
                        oTrB = trB2;
                        oFm = fm2;
                        //#region 连接字符串的加载方式
                        //sTr = sTr2;
                        //#endregion
                        break;
                    case 3:
                        if (j - thiz.p.lockColumnR + 1 == 0) {
                            iF = 1;
                        }
                        else {
                            iF = 0;
                        }
                        oTrB = trB3;
                        oFm = fm3;
                        //#region 连接字符串的加载方式
                        //sTr = sTr3;
                        //#endregion
                        break;
                }
                oTrBs[oTrBs.length] = oTrB;

                if (oTrB) {
                    (function (c, wH) {
                        thiz.fire("preColumnRender", { rowData: rowData, colNo: j });  //列加载前事件

                        //#region 连接字符串的加载方式
                        //                        var isAsync = c.isAsyncLoad && !rowData.stopAsyncLoad;
                        //                        sTr[sTr.length] = '<td colId="' + j + '" style="height:' + thiz.p.defaultH + 'px;text-align:' + (function() {
                        //                            if(isAsync) {  //异步加载设置居中
                        //                                return "center";
                        //                            }
                        //                            if(c.align) {
                        //                                return c.align;
                        //                            }
                        //                            else {
                        //                                return thiz.p.defaultAlign;
                        //                            }
                        //                        })() + ';">';
                        //                        sTr[sTr.length] = '<div id="dgj_tdDiv_' + thiz.objId + (rowNoG == null ? '' : ('_' + rowNoG)) + '_' + rowNo + '_' + j + (!pageNo ? '' : ('_' + pageNo)) + '" style="width:' + parseFloat(thds.eq(j)[0].style.width) + 'px;" ' 
                        //                            + (isAsync ? ('alignTmp="' + (c.align ? c.align : thiz.p.defaultAlign) + '"') : '')  //保存原本居中方式
                        //                            + ' class="dgj_tdDiv">';
                        //                        
                        //                        var tdTxt, isJqDom = false;
                        //                        if(!isAsync) {   //同步加载
                        //                            if (!c.renderFn) {   //是否使用渲染方法
                        //                                sTr[sTr.length] = rowData[c.dataIndex];
                        //                            }
                        //                            else {
                        //                                tdTxt = c.renderFn.call(thiz, rowData[c.dataIndex], rowData, rowNo, rowNoG, rowDataG, pageNo, trB, trB2, trB3, j, chk);
                        //                                if(typeof tdTxt == "object") {  //检测返回值是否jqdom元素
                        //                                    isJqDom = true;
                        //                                }
                        //                                else {
                        //                                    sTr[sTr.length] = tdTxt;
                        //                                }
                        //                            }
                        //                        }
                        //                        else {  //异步加载
                        //                            sTr[sTr.length] = LMJ.getLoadImg(3, true);  //显示加载中图标
                        //                        }
                        //                        
                        //                        sTr[sTr.length] = '</div></td>';
                        //                        if(isJqDom) {
                        //                            jqDoms[jqDoms.length] = [tdTxt, rowNo, j, pageNo, rowNoG];
                        //                        }
                        //#endregion

                        //#region 多次append的加载方式
                        //var tdDiv = $('<div style="width:' + wH + 'px;" class="dgj_tdDiv"></div>');  //根据表头列宽确定表体列宽,使用jquery1.4.2以后的版本时,此处IE7下若使用elem.css("width")方式获取宽度会有偏差
                        var percentW = fj.RX.percent(c.width) ? c.width : "",
                            td = $('<td colId="' + j + '" style="'
                            + (thiz.p.nodeWrap ? 'white-space:normal;' : '')  //树节点文字是否折行
                            + (cellP != null ? 'padding:' + (fj.RX.numZ2(cellP) ? cellP + 'px' : cellP) + ';' : '')  //td设置padding
                            + 'height:' + thiz.p.defaultH + 'px;' + (percentW !== "" ? ('width:' + percentW + ';') : '') + 'text-align:' + (function () {
                                var v;
                                if (c.isTreeField) { //树节点时居左
                                    v = "left";
                                }
                                else if (c.align) {
                                    v = c.align;
                                }
                                else {
                                    v = thiz.p.defaultAlign;
                                }
                                return v;
                            })() + ';"><div ' + (thiz.p.isTree ? '' : 'style="width:' + (!thiz.p.isHideHead ? ((thiz.p.noGridBorder && !iF) ? wH + 1 : wH) + 'px' : (percentW === "" ? (c.width ? c.width + 'px' : 'auto') : '100%')) + ';')  //设置单元格列唯一标识
                            + (cellIP != null ? 'padding:' + (fj.RX.numZ2(cellIP) ? cellIP + 'px' : cellIP) + ';' : '')  //td内div设置padding
                            + '" class="dgj_tdDiv"></div></td>');

                        var tdDiv, oTd = td[0];
                        if (oTd.firstElementChild) {
                            tdDiv = $(oTd.firstElementChild);
                        }
                        else {
                            tdDiv = $(oTd.firstChild);
                        }
                        oFm.appendChild(oTd);
                        tdDs[tdDs.length] = [td, tdDiv];  //保存td对象到集合中,设置单元格可排序时会用到

                        if (!c.isAsyncLoad || rowData.stopAsyncLoad) {   //加载数据
                            var elem = "", aRf, editElem, oTxt, editCbxMap;
                            if (c.editable && !c.isTreeField) {  //是否可编辑
                                oTd.style.padding = "0px";
                                tdDiv[0].style.padding = "0px 5px 0px 1px";
                                tdDiv.attr("editable", true);  //可编辑标记
                                switch (c.editType) {
                                    case "sel":  //下拉框
                                        editCbxMap = {};
                                        oTxt = $('<select class="dgj_editSel" ' + (c.hideEditTxt ? 'style="display:none;"' : '') + ' >' +
                                        (function () {
                                            var txtSel = "";
                                            for (var k = 0, m = c.editCbxData.length; k < m; k++) {
                                                var ecd = c.editCbxData[k];
                                                txtSel += '<option value="' + ecd.value + '">' + ecd.text + '</option>';
                                                editCbxMap[ecd.value] = ecd.text;  //创建编辑下拉框map
                                            }
                                            return txtSel;
                                        })()
                                        + '</select>');
                                        break;
                                    case "textarea":  //多行文本框
                                        oTxt = $('<textarea class="dgj_editTextarea" ' + (c.hideEditTxt ? 'style="display:none;"' : '') + ' ></textarea>');
                                        break;
                                    case "txt":  //文本框
                                    default:
                                        oTxt = $('<input type="text" class="dgj_editTxt" ' + (c.hideEditTxt ? 'style="display:none;"' : '') + ' />');
                                        break;
                                }
                                if (c.editHeight != null) {
                                    oTxt.css("height", c.editHeight);
                                }
                                tdDiv.append(oTxt);

                                if (!rowData.editCell) {
                                    rowData.editCell = [];
                                }
                                editElem = [oTxt, null, c.hideEditTxt ? false : true, c.dataIndex, c.editFilter, editCbxMap];  //参数依次为:可编辑文本框,单元格原数据容器,可编辑状态,列属性名,编辑过滤方法,编辑下拉框map
                                rowData.editCell.push(editElem);
                            }

                            if (!c.renderFn) {   //是否使用渲染方法
                                elem = rowData[c.dataIndex];
                                if (c.editable) {
                                    oTxt.val(elem);
                                    elem = $("<span editable='true' " + (!c.hideEditTxt ? "style='display:none;'" : "") + ">" + elem + "</span>");
                                    editElem[1] = elem;
                                }
                            }
                            else {
                                aRf = [tdDiv, c.renderFn, rowData[c.dataIndex], j, editElem, c.hideEditTxt, td, c];
                                renderFns.push(aRf);
                                //elem = c.renderFn.call(thiz, rowData[c.dataIndex], rowData, rowNo, rowNoG, rowDataG, pageNo, trB, trB2, trB3, j, chk);
                            }

                            if (c.isTreeField) {
                                //#region 树节点相关处理
                                var wrap = $("<div></div>").css({
                                    marginLeft: thiz.p.nodeMarginL + paramT.deep * thiz.p.nodeDeepRetract  //根据深度缩进
                                });

                                var spElem = $("<span class='dgj_nodeWrap'></span>");
                                spElem.click(function (e) {  //点击节点事件
                                    thiz.fire("cilckNode", { node: rowData });
                                });

                                var chkT;
                                if (thiz.p.hasChkT) {  //节点复选框
                                    var fnChk = function (d, chd) {
                                        thiz.cascade(d, function (node) {
                                            node.isCheck = chd;

                                            if (node._chkT) {  //未加载完成的节点不设置复选框元素的状态
                                                node._chkT.setChecked(chd, null, true);
                                            }

                                            if (node.isLeaf) {  //叶子节点不继续遍历
                                                return false;
                                            }
                                        });
                                    };
                                    tdDiv.addClass("dgj_chkDiv");

                                    chkT = SBXJ.init({
                                        inputId: 'dgj_chkT_' + rowNum + '_' + thiz.objId,
                                        initChecked: rowData.isCheck,
                                        initClass: "dgj_chkC",
                                        canQuery: false,
                                        style: "margin-right:2px;",
                                        evts: {
                                            onChecked: function (e, p) {
                                                var chd = p.checked ? 1 : 0,
                                                    ni = thiz.p.nodeIndex;

                                                fnChk(rowData, chd);  //级联设置子节点选中状态
                                                thiz.bubble(rowData, function (node) {  //级联设置父节点选中状态
                                                    var nodes = node[ni],
                                                        isCheckO = node.isCheck,  //记录节点原始选中状态
                                                        ch = true, ck;

                                                    for (var i = 0, l = nodes.length; i < l; i++) {  //检测子节点状态是否存在这两种情况:(1)父节点为选中,有子节点为未选中;(2)父节点为未选中,有子节点为选中
                                                        var nsi = nodes[i];
                                                        if ((chd === 1 && nsi.isCheck !== 1) || (chd === 0 && nsi.isCheck !== 0)) {
                                                            ch = false;
                                                            break;
                                                        }
                                                    }
                                                    if (ch) {   //父、子节点状态都相同则使用当前节点的状态设置父节点
                                                        ck = chd;
                                                    }
                                                    else {  //子节点未完全选中的状态标记为2
                                                        ck = 2;
                                                    }

                                                    node.isCheck = ck;
                                                    node._chkT.setChecked(ck, null, true);

                                                    if (ck === isCheckO) {  //如果节点选中状态没有改变,则无需继续向上遍历
                                                        return false;
                                                    }
                                                }, true);
                                            }
                                        }
                                    });
                                    rowData._chkT = chkT;  //保存节点复选框引用
                                }

                                var isExpand = rowData.isExpand ? true : false;
                                trB.attr({  //设置展开状态
                                    visible: paramT.expand,
                                    expand: isExpand
                                });
                                if (thiz.p.lockColumn) {
                                    trB2.attr({
                                        visible: paramT.expand,
                                        expand: isExpand
                                    });
                                }
                                if (thiz.p.lockColumnR) {
                                    trB3.attr({
                                        visible: paramT.expand,
                                        expand: isExpand
                                    });
                                }

                                //创建节点图标
                                var bi = $(thiz.blankImg),
                                    nodeImg,                //节点类别图标
                                    nodeIcon = SBXJ.init({  //节点折叠图标
                                        inputId: 'nodeIcon_' + thiz.objId + '_' + rNo,
                                        initChecked: isExpand,
                                        initClass: "dgj_chkC",
                                        cNameCheckedDisabled: thiz.p.isShowNodeImg ? null : "dgj_loadingT",
                                        type: "collapse",
                                        canQuery: false,
                                        style: "margin-right:2px;",
                                        evts: {
                                            onChecked: function (e, p) {
                                                var thix = this,
                                                    checked = p.isClickRow ? !p.checked : p.checked;  //此处的isClickRow暂时无用

                                                rowData.isExpand = checked;  //更改展开状态
                                                trB.attr("expand", checked);
                                                if (thiz.p.lockColumn) {
                                                    trB2.attr("expand", checked);
                                                }
                                                if (thiz.p.lockColumnR) {
                                                    trB3.attr("expand", checked);
                                                }

                                                if ((thiz.p.asyncLoadTree || thiz.p.treeLocalLazy) && !rowData.complete) {
                                                    //#region 加载未加载完成的节点(可异步)
                                                    this.setDisabled(true);  //正在加载中禁止折起、展开
                                                    nodeImg.swapClassJ("dgj_folderOpen dgj_folderClose", "dgj_loadingT");  //显示loading图标
                                                    thiz.loadDataTAsync(false, {
                                                        node: rowData,
                                                        pId: rNo.substr(0, rNo.length - 1),
                                                        deep: paramT.deep,
                                                        path: paramT.path,
                                                        trs: [trB, trB2, trB3]
                                                    }, function (hasData) {
                                                        rowData.complete = true;  //标记已加载完成

                                                        if (hasData) {  //有子节点切换为打开状态
                                                            thix.show(true);
                                                            bi.hide();
                                                            nodeImg.swapClassJ("dgj_loadingT dgj_leaf", "dgj_folderOpen");

                                                            if (thiz.p.hasChkT) {
                                                                var chd = rowData.isCheck ? 1 : 0;  //设置新加载的子节点复选框状态
                                                                fnChk(rowData, chd);
                                                            }
                                                        }
                                                        else {
                                                            thix.hide();  //如果无子节点，改变当前节点为叶子节点
                                                            if (!thiz.p.hideImgB) {
                                                                bi.show();
                                                            }
                                                            nodeImg.swapClassJ("dgj_loadingT dgj_folderClose dgj_folderOpen", "dgj_leaf");
                                                            rowData.isLeaf = true;
                                                        }

                                                        thix.setDisabled(false);
                                                    }, !thiz.p.treeLocalLazy ? null : rowData[thiz.p.nodeIndex]);  //如果延迟加载本地数据,则传递当前节点子节点集合
                                                    //#endregion
                                                }
                                                else {
                                                    //#region 展开、折叠子节点
                                                    var trTs = thiz.gridContainer.find("tr[nodeNo^=" + rNo + "]");
                                                    var nos = {};  //未展开节点集合
                                                    var noa = {};  //已经遍历过的节点集合(为了减少冻结表遍历次数)
                                                    var fnCheckPid = function (no) {  //向上查找父节点是否未展开
                                                        no = no.substr(0, no.length - 1);  //去掉最后一位"_"
                                                        if (no.indexOf("_") != -1) {
                                                            var pid = no.substr(0, no.lastIndexOf("_")) + "_";  //截取父节点ID
                                                            if (nos[pid]) {
                                                                return false;
                                                            }
                                                            else {
                                                                return fnCheckPid(pid);
                                                            }
                                                        }
                                                        else {
                                                            return true;
                                                        }
                                                    };

                                                    var trNs = [];  //需执行折叠动画的集合
                                                    trTs.each(function () {
                                                        var tr = $(this), no = tr.attr("nodeNo");

                                                        if (no != rNo) {  //过滤当前节点
                                                            var is2r = no.split("_").length == (rNo.split("_").length + 1);  //是否当前节点下的2级节点
                                                            if (checked) {
                                                                var b = 0;

                                                                if (noa[no] == null) {
                                                                    if (is2r) {  //当前节点的2级节点一定会显示
                                                                        b = 1;
                                                                    }
                                                                    else {  //非当前节点的2级节点
                                                                        if (tr.attr("visible") + "" == "true" && fnCheckPid(no)) {  //显示visible为true的节点，并且向上查找父节点，如果有未展开的则不显示
                                                                            b = 1;
                                                                        }
                                                                        else {
                                                                            nos[no] = 1;  //如果当前节点的上级节点未展开，则记录当前节点到未展开集合，以便减少其子节点向上查找层数
                                                                        }
                                                                    }

                                                                    noa[no] = b;
                                                                }
                                                                else {
                                                                    b = noa[no];
                                                                }

                                                                if (b) {
                                                                    tr.attr("visible", true);
                                                                    if (!thiz.p.collapseAnimate) {
                                                                        tr.show();
                                                                    }
                                                                    else {
                                                                        trNs.push(tr[0]);  //加入需执行折叠动画的集合
                                                                    }
                                                                }
                                                            }
                                                            else {
                                                                if (is2r) {  //隐藏时只设置2级节点的visible为false，然后隐藏当前节点下全部节点
                                                                    tr.attr("visible", false);
                                                                }
                                                                if (!thiz.p.collapseAnimate) {
                                                                    tr.hide();
                                                                }
                                                                else {
                                                                    trNs.push(tr[0]);  //加入需执行折叠动画的集合
                                                                }
                                                            }
                                                        }

                                                        if (tr.attr("expand") + "" == "false") {  //记录未展开的节点
                                                            nos[no] = 1;
                                                        }
                                                    });

                                                    nos = null;  //清空集合节省内存
                                                    noa = null;

                                                    if (!thiz.p.collapseAnimate) {
                                                        thiz.setMainHeight();
                                                    }
                                                    else {  //执行折叠动画
                                                        thiz.collapseAnimWrap(checked, trTs.eq(0), $(trNs));
                                                    }

                                                    if (checked) {  //切换节点图标
                                                        nodeImg.swapClassJ("dgj_folderClose", "dgj_folderOpen");
                                                    }
                                                    else {
                                                        nodeImg.swapClassJ("dgj_folderOpen", "dgj_folderClose");
                                                    }
                                                    //#endregion
                                                }
                                            }
                                        }
                                    });

                                if (rowData[thiz.p.nodeIndex] || (thiz.p.asyncLoadTree && !rowData.isLeaf)) {  //有子节点时显示折叠按钮                                    
                                    bi.hide();               //非叶子节点隐藏占位空白
                                    nodeImg = $('<img class="dgj_tgImg ' + (isExpand ? 'dgj_folderOpen' : 'dgj_folderClose') + '" style="margin-right:2px;' + (!thiz.p.isShowNodeImg ? 'display:none;' : '') + '" src="' + fj.imgPath + 'Datagrid/treegrid/s.gif" />');
                                }
                                else {
                                    rowData.isLeaf = true;   //标记为叶子节点
                                    if (thiz.p.hideImgB) {
                                        bi.hide();
                                    }
                                    nodeIcon.hide();           //叶子节点隐藏折叠按钮
                                    nodeImg = $('<img class="dgj_tgImg dgj_leaf" style="margin-right:2px;' + (!thiz.p.isShowNodeImg ? 'display:none;' : '') + '" src="' + fj.imgPath + 'Datagrid/treegrid/s.gif" />');
                                }

                                rowData.nodeIcon = nodeIcon;  //记录折叠图标对象
                                rowData.nodeImg = nodeImg;

                                tdDiv.css("overflow", "visible");
                                wrap.append(nodeIcon.divOut);  //渲染节点图标
                                wrap.append(bi).append(nodeImg);

                                if (chkT) {  //节点复选框
                                    wrap.append(chkT.divOut);
                                }

                                tdDiv.append(wrap.append(spElem.append(elem)));
                                if (c.renderFn) {  //如果使用渲染方法,则将单元格内容追加到spElem中
                                    aRf[0] = spElem;
                                }

                                if (!thiz.p.asyncLoadTree && !thiz.p.treeLocalLazy) {  //非异步加载时是否可显示判断,延迟加载本地数据时没必要检测
                                    var isOwn = true;
                                    thiz.bubble(rowData, function (d) {
                                        if (isOwn) {  //跳过当前节点
                                            isOwn = false;
                                            return;
                                        }
                                        if (!d.isExpand) {  //如果父节点有不展开的,则隐藏
                                            trB.hide();
                                            if (thiz.p.lockColumn) {
                                                trB2.hide();
                                            }
                                            if (thiz.p.lockColumnR) {
                                                trB3.hide();
                                            }
                                            return false;
                                        }
                                    });
                                }
                                //#endregion
                            }
                            else {
                                tdDiv.append(elem);
                            }
                        }
                        else {
                            tdDiv.append(LMJ.getLoadImg(3, true));  //显示加载中图标
                            td.css("text-align", "center");   //设置居中
                            tdDiv.attr("alignTmp", c.align);     //保存原本居中方式
                        }
                        //#endregion

                        if (c.asyncLoadFn) {  //异步加载方法
                            asyncLoadFns.push([c.asyncLoadFn, rowData[c.dataIndex], j]);
                        }
                    })(c, (function () {
                        var oThd = thds.eq(j),
                            mc = oThd.attr("mergecell"),
                            w = parseInt(oThd[0].style.width, 10);
                        if (!mc) {
                            return w;
                        }
                        else {  //表头有合并单元格时需计算列宽度,暂时不支持表行合并时相应列也合并
                            var c;
                            for (var h = 1; h < mc; h++) {
                                oThd = thds.eq(j - h);
                                c = cols[j - h];
                                w -= parseInt(oThd[0].style.width, 10)
                                    + (!c.editable ? 4 : 6)  //减去td的padding值
                                    + (thiz.p.noGridBorder ? 1 : 0);
                            }
                            return w;
                        }
                    })());
                }
                //                if(j == cols.length - 1){
                //                    var td = $('<td></td>').css({
                //                        height: 0,
                //                        width: 0,
                //                        padding: 0,
                //                        fontSize: 0,
                //                        border: 0
                //                    });
                //                    oTrB.append(td);
                //                }
            }

            trB[0].appendChild(fm);  //加载td文档碎片到tr
            if (this.p.lockColumn) {
                trB2[0].appendChild(fm2);
            }
            if (this.p.lockColumnR) {
                trB3[0].appendChild(fm3);
            }

            //#region 连接字符串的加载方式
            //            trB.append(sTr1.join(""));  //渲染行内元素
            //            if(this.p.lockColumn) {
            //                trB2.append(sTr2.join(""));
            //            }
            //            if(this.p.lockColumnR) {
            //                trB3.append(sTr3.join(""));
            //            }

            //            for (var k = 0; k < jqDoms.length; k++) {  //加载renderFn返回的jqdom元素
            //                $('#dgj_tdDiv_' + this.objId + (jqDoms[k][4] == null ? '' : ('_' + jqDoms[k][4])) + '_' + jqDoms[k][1] + '_' + jqDoms[k][2] + (!jqDoms[k][3] ? "" : ("_" + jqDoms[k][3]))).append(jqDoms[k][0]);
            //            }

            //            var mcs = this.mergeCells;  //合并单元格
            //            for (var k = 0; k < mcs.length; k++) {
            //                this.mergeCellFn(mcs[k][0], mcs[k][1], mcs[k][2]);
            //            }
            //            mcs.length = 0;
            //#endregion

            for (var j = 0, cols = this.p.columns, l = cols.length; j < l; j++) {  //合并表行单元格
                var c = cols[j];
                if (c.mergeCell) {
                    this.mergeCell(c.mergeCell, j, oTrBs[j]);
                }
                if (c.sortRows != null && $.inArray(rowNo, c.sortRows) != -1) {  //设置点击单元格可排序
                    this.setCellSort(j, c, tdDs[j][0], tdDs[j][1]);
                }
            }

            //执行渲染方法
            for (var k = 0, l = renderFns.length; k < l; k++) {
                var rf = renderFns[k],
                    editElem = rf[4],
                    v = null;

                if (!this.p.useObjParam) {
                    v = rf[1].call(thiz, rf[2], rowData, rowNo, rowNoG, rowDataG, pageNo, trB, trB2, trB3, rf[3], chk, editElem, rf[6], rf[0], rf[7]);
                }
                else {  //todo 使用对象参数
                    v = rf[1].call(thiz, {
                        value: rf[2],
                        data: rowData,
                        rowNo: rowNo,
                        noG: rowNoG,
                        dataG: rowDataG,
                        pageNo: pageNo,
                        tr: trB,
                        tr2: trB2,
                        tr3: trB3,
                        colNo: rf[3],
                        chk: chk,
                        editElem: editElem,
                        td: rf[6],
                        tdDiv: rf[0],
                        col: rf[7]
                    });
                }

                if (editElem) {  //单元格为可编辑时为文本框赋值
                    var elem = $("<span editable='true' " + (!rf[5] ? "style='display:none;'" : "") + ">" + v + "</span>");
                    editElem[1] = elem;
                    editElem[0].val(v);
                    rf[0].append(elem);
                }
                else {
                    rf[0].prepend(v);
                }
            }

            //执行异步加载方法
            for (var k = 0, l = asyncLoadFns.length; k < l; k++) {
                var alf = asyncLoadFns[k];
                alf[0].call(thiz, alf[1], rowData, rowNo, alf[2], pageNo, trB, trB2, trB3, rowNoG, rowDataG);
            }

            //分组创建时加入行集合
            if (rowNoG != null) {
                if (!oTrG) {
                    this.rows[rowNoG].rows.push(trB);
                }
                else {
                    for (var h = 0, l = this.rows.length; h < l; h++) {
                        if (this.rows[h].trG == oTrG) {
                            this.rows[h].rows.push(trB);
                        }
                    }
                }
            }

            if (isDynamic) {  //动态加载时重设高度
                FJ.lazyDo(function () {
                    this.setTableWidth();
                    this.setMainHeight();
                }, 200, "ld_dgjAddRow", this);
            }

            //#region 加载tree子节点行
            if (isTg) {
                var loadChild = true;
                if (this.p.treeLocalLazy) {  //使用延迟加载本地树数据时,未展开的节点先不加载子节点
                    if (rowData.isExpand) {  //如果默认展开,则认为该节点已加载完成
                        rowData.complete = true;
                    }
                    else {
                        rowData.complete = false;
                        loadChild = false;
                    }
                }

                if (loadChild) {
                    var nodes = rowData[this.p.nodeIndex];
                    if (nodes) {
                        for (var m = 0, l = nodes.length; m < l; m++) {
                            var pt = { thds: thds };
                            var id = nodes[m][this.p.idField];  //获取节点唯一标识,不存在则创建
                            if (id == null) {
                                nodes[m][this.p.idField] = "dgjTg_" + new Date().getTime() + Math.random();
                            }
                            pt.parentId = rNo.substr(0, rNo.length - 1);          //父节点唯一标识
                            pt.deep = paramT.deep + 1;       //深度
                            pt.path = paramT.path + m + "."; //节点路径
                            pt.expand = rowData.isExpand;    //父节点是否展开
                            nodes[m].parentNode = rowData;   //保存父节点引用
                            this.addRow(nodes[m], 0, null, true, null, null, null, null, pt);
                        }
                    }
                }
            }
            //#endregion

            if (!this.p.lockColumn) {
                return trB;
            }
            else {
                if (!this.p.lockColumnR) {
                    return [trB, trB2];
                }
                else {
                    return [trB, trB2, trB3];
                }
            }
        },
        //#endregion

        //#region 删除行
        removeRow: function (rowNo, rowData, tr1, tr2, tr3, chk, pageNo) {
            var data, no;
            if (!rowData) {
                data = this.data[rowNo];
                no = rowNo;
            }
            else {
                data = rowData;
                no = $.inArray(rowData, this.data);
            }

            this.fire("beforeRemoveRow", { rowData: data, rowNo: no });  //删除行前事件

            if (!rowData) {
                if (!this.p.compatibleMode) {
                    fj.arr.removeAt(this.data, no);
                    if (this.p.hasChk) {
                        fj.arr.removeAt(this.chks, no);
                    }
                }
                else {  //兼容过去版本数组项设为null
                    this.data[no] = null;
                    if (this.p.hasChk) {
                        this.chks[no] = null;
                    }
                }

                var sel = "tr:not(tr[loading]):eq(" + no + ")";
                this.tbody.find(sel).remove();
                if (this.p.lockColumn) {
                    this.tbody2.find(sel).remove();
                }
                if (this.p.lockColumnR) {
                    this.tbody3.find(sel).remove();
                }
            }
            else {
                if (!this.p.compatibleMode) {
                    fj.arr.removeAt(this.data, no);
                    if (this.p.hasChk) {
                        fj.arr.removeAt(this.chks, no);
                    }
                }
                else {  //兼容过去版本数组项设为null
                    this.data[no] = null;
                    if (this.p.hasChk) {
                        this.chks[$.inArray(chk, this.chks)] = null;
                    }
                }

                tr1.remove();
                if (tr2) {
                    tr2.remove();
                }
                if (tr3) {
                    tr3.remove();
                }
            }
            if (!this.p.compatibleMode) {
                if (this.p.isLazyLoad) {  //延时加载行号需减少1
                    this.lazyRowNo--;
                }
            }

            if (this.isDataEmpty()) {  //清空表
                this.clearData();
            }
            else {
                this.setMainHeight();
            }

            this.fire("afterRemoveRow", { rowNo: no });  //删除分组行后

            if (this.p.isLazyLoad) {
                this.autoLoadlazyRow();  //自动将可视区域内的延时加载行加载完
            }
        },
        //#endregion

        //#region 创建分组行
        addRowG: function (rowData, rowNo, trAfter, pageNo, useNewRowColor, addTop) {
            var thiz = this;
            var rowNum = rowNo + (!pageNo ? "" : ("_" + pageNo));
            var trG = $('<tr groupRow="true" class="dgj_trG1 dgj_trGB_' + rowNum + '" rowNum="' + rowNum + '"></tr>');

            if (this.p.groupRowH) {
                trG.height(this.p.groupRowH);
            }

            if (!rowData.checked) {  //复选框
                rowData.checked = false;
            }

            var chk;
            if (this.p.hasChkG) {  //是否有复选框
                var tdChk = $('<td chkCellG="true" style="text-align:center;"></td>');
                var tdDiv = $('<div chkCellDivG="true" class="dgj_tdDiv dgj_chkDiv"></div>').css({
                    width: this.p.chkWidth
                });
                chk = $('<input id="chkRowG_' + rowNum + "_" + thiz.objId + '" title="" type="checkbox" hidefocus />');
                chk[0].checked = rowData.checked;

                if (this.p.chkStyle) {  //复选框使用自定义样式
                    chk.sbxj = chk.SBXJ({
                        initClass: "dgj_chkC",
                        type: thiz.p.chkCollapse ? "collapse" : null,
                        canQuery: false,
                        isInitHide: false,
                        evts: {
                            beforeClick: function (e, p) {  //用低版本jquery模拟点击复选框时会先执行事件后改变状态,所以此处需用相反的状态来改变自定义复选框的状态
                                return p.param && (p.param.isClickRow || p.param.isAllCheck) ? !p.checked : p.checked;
                            }
                        }
                    });
                    tdDiv.append(chk.sbxj.divOut);
                }
                else {
                    tdDiv.append(chk);
                }
                chk.click(function (e, p) {
                    e.stopPropagation();
                    if (this.paramJ != null) {  //可在dom元素上传递参数,为解决jquery1.10以上版本无法在trigger中给checkbox的click事件传参数
                        p = this.paramJ;
                        this.paramJ = undefined;
                        try {
                            delete this.paramJ;
                        }
                        catch (ex) { };
                    }
                    thiz.check(rowNo, rowData, p, chk, pageNo);
                });

                tdChk.append(tdDiv);
                trG.append(tdChk);
                if (!addTop) {
                    thiz.chks.push(chk);
                }
                else {
                    thiz.chks.unshift(chk);
                }

                if (this.p.hasRowContextMenu) {  //右击菜单
                    trG.bind("contextmenu", function (e) {
                        if (!thiz.p.hasChkG || !thiz.p.canSelectRowR) {
                            if (thiz.pasteRowG) {  //去除粘贴状态
                                thiz.pasteRowG.removeAttr("pasteRowG");
                            }
                            thiz.pasteRowG = trG;
                            trG.attr("pasteRowG", true);
                        }
                        else if (!chk[0].checked && thiz.p.hasChkG && thiz.p.canSelectRowR) {  //右击时选中行
                            var obj = e.srcElement ? e.srcElement : e.target;
                            if (!$(obj).hasClass("dgj_chkC")) {
                                var pa = { isClickRow: true };
                                chk[0].paramJ = pa;
                                chk.trigger("click", pa);
                            }
                        }
                    });
                }

                if (this.p.canSelectRow) {
                    trG.css("cursor", "pointer").bind("click", function (e) {
                        var obj = e.srcElement ? e.srcElement : e.target;
                        if (!$(obj).hasClass("dgj_chkC")) {
                            var pa = { isClickRow: true };
                            chk[0].paramJ = pa;
                            chk.trigger("click", pa);
                        }
                    });
                }
            }

            //加载列数据
            var tdG = $('<td colspan="' + this.p.columns.length + '"></td>');
            var tdDivG = $('<div class="dgj_tdDiv"></div>');
            trG.append(tdG.append(tdDivG.append(this.p.renderGroupRow.call(this, rowData, rowNo, pageNo, trG, chk))));

            if (useNewRowColor) {
                trG.css("background-color", this.p.colorParams.newRow).attr("spRowColor", this.p.colorParams.newRow);
            }
            this.setRowColorG(rowNo, trG, rowData.checked);  //设置隔行变色

            //加载行
            if (!trAfter) {
                if (!addTop) {
                    this.tbody.append(trG);
                }
                else {
                    this.tbody.prepend(trG);
                }
            }
            else {   //加在某行后面
                trAfter.after(trG);
            }

            this.setRowHL(trG);  //鼠标移上高亮

            //加入行集合
            var trGInfo = {
                trG: trG,
                rows: []
            };
            if (!addTop) {
                this.rows.push(trGInfo);
            }
            else {
                this.rows.unshift(trGInfo);
            }

            return trG;
        },
        //#endregion

        //#region 创建分组行(同时创建组内行)
        addRowGS: function (rowData, rowNo, pageNo, useNewRowColor, addTop, trAfter, trGs, paramT) {
            if (this.isDataEmpty()) {  //清空表
                this.tbody.empty();
            }

            if (rowNo == null) {  //不填行数时为动态加载
                if (!this.p.isLazyLoad) {
                    rowNo = this.data.lengthD;
                }
                else {
                    rowNo = this.getRowNoL();
                }

                if (!addTop) {  //加载在最后面
                    this.data.push(rowData);
                }
                else {  //加载在最前面
                    this.data.unshift(rowData);
                }
                this.data.lengthD++;

                if (this.p.isLazyLoad) {
                    this.lazyRowNo++;
                    if (this.p.isPageCache) {
                        this.getPageCache(this.pageNo)[6] = this.lazyRowNo;
                    }
                }

                this.joinCacheData();
            }

            var thiz = this;
            //加载分组行
            var trG = this.addRowG(rowData, rowNo, trAfter, pageNo, useNewRowColor, addTop);
            var trGTmp = trG;
            var trsG = [];

            //加载分组内行
            if (this.p.asyncLoadSonRow) {  //异步
                this.p.renderSonRow.call(this, rowNo, trG);
            }
            else {
                var dataSr = rowData[this.p.sonRowName];
                if (dataSr && dataSr.length > 0) {
                    for (var j = 0, l = dataSr.length; j < l; j++) {
                        trG = this.addRow(dataSr[j], j, trG, false, rowNo, rowData, pageNo, trGTmp, paramT);
                        trsG.push(trG);
                        if (trGs) {
                            trGs.push(trG);
                        }
                    }
                }
            }

            FJ.lazyDo(function () {
                this.setTableWidth();
                this.setMainHeight();
            }, 200, "ld_dgjGS", this);

            //创建分组行后
            this.fire("afterAddRowGS", { rowData: rowData, rowNo: rowNo, pageNo: pageNo });

            var lastTr;  //返回新添加的最后一行
            if (trsG.length > 0) {
                lastTr = trsG[trsG.length - 1];
            }
            else {
                lastTr = trG;
            }
            return lastTr;
        },
        //#endregion

        //#region 删除分组行
        removeRowG: function (rowNo, rowData, oTrG, chk, pageNo) {
            var data, no;
            if (!rowData) {
                data = this.data[rowNo];
                no = rowNo;
            }
            else {
                data = rowData;
                no = $.inArray(rowData, this.data);
            }

            this.fire("beforeRemoveRowG", { rowData: data, rowNo: no });   //删除分组行前事件

            if (!rowData) {
                if (!this.p.compatibleMode) {
                    fj.arr.removeAt(this.data, no);
                    if (this.p.hasChk) {
                        fj.arr.removeAt(this.chks, no);
                    }
                }
                else {  //兼容过去版本数组项设为null
                    this.data[no] = null;
                    if (this.p.hasChk) {
                        this.chks[no] = null;
                    }
                }

                var row = this.rows[no];
                row.trG.remove();  //删除分组行
                for (var i = 0, l = row.rows.length; i < l; i++) {
                    row.rows[i].remove();
                }
            }
            else {
                if (!this.p.compatibleMode) {
                    fj.arr.removeAt(this.data, no);
                    if (this.p.hasChk) {
                        fj.arr.removeAt(this.chks, no);
                    }
                }
                else {  //兼容过去版本数组项设为null
                    this.data[no] = null;
                    if (this.p.hasChk) {
                        this.chks[$.inArray(chk, this.chks)] = null;
                    }
                }

                oTrG.remove();
                for (var h = 0, l = this.rows.length; h < l; h++) {
                    var row = this.rows[h];
                    if (row.trG == oTrG) {
                        for (var i = 0, m = row.rows.length; i < m; i++) {
                            row.rows[i].remove();
                        }
                        break;
                    }
                }
            }
            if (!this.p.compatibleMode) {
                fj.arr.removeAt(this.rows, no);
                if (this.p.isLazyLoad) {  //延时加载行号需减少1
                    this.lazyRowNo--;
                }
            }

            if (this.isDataEmpty()) {  //清空表
                this.clearData();
            }
            else {
                this.setRowWidthG();  //设置分组列宽
            }

            this.fire("afterRemoveRowG", { rowNo: no });  //删除分组行后事件

            if (this.p.isLazyLoad) {
                this.autoLoadlazyRow();  //自动将可视区域内的延时加载行加载完
            }
        },
        //#endregion
        //#endregion

        //#region 单元格操作
        //#region 填充单元格数据
        setCellData: function (rowNo, colNo, dataIndex, data, pageNo, dataHtml, rowData, oTr1, oTr2, oTr3) {
            if (this.isDataEmpty()) {
                return;
            }

            var thiz = this;
            var colNoT = colNo;
            if (this.p.hasChk) {  //是否有复选框
                colNoT += 1;
            }

            //更新表数据集
            if (!rowData) {
                if (!this.p.isPageCache) {
                    this.data[rowNo][dataIndex] = data;
                }
                else {
                    var cache = this.getPageCache(pageNo);
                    if (cache) {
                        cache[1][rowNo][dataIndex] = data;
                    }
                    else {
                        this.data[rowNo][dataIndex] = data;
                    }
                }
            }
            else {
                rowData[dataIndex] = data;
                rowNo = $.inArray(rowData, this.data);
            }

            //加载到表
            var tdDiv, colType = this.getColType(colNo);
            switch (colType) {
                case 0:
                case 1: {
                    if (!rowData) {
                        var tbody;
                        if (!this.p.isPageCache) {
                            tbody = this.tbody;
                        }
                        else {
                            var cache = this.getPageCache(pageNo);
                            if (cache) {
                                tbody = cache[2];
                            }
                            else {
                                tbody = this.tbody;
                            }
                        }
                        tdDiv = tbody.find("tr:not(tr[loading])").eq(rowNo).find("div.dgj_tdDiv").eq(colNoT);
                    }
                    else {
                        tdDiv = oTr1.find("div.dgj_tdDiv").eq(colNoT);
                    }
                }
                    break;
                case 2: {
                    var k = colNo - this.p.lockColumn + 1;
                    if (!rowData) {
                        var tbody2;
                        if (!this.p.isPageCache) {
                            tbody2 = this.tbody2;
                        }
                        else {
                            var cache = this.getPageCache(pageNo);
                            if (cache) {
                                tbody2 = cache[4];
                            }
                            else {
                                tbody2 = this.tbody2;
                            }
                        }
                        tdDiv = tbody2.find("tr:not(tr[loading])").eq(rowNo).find("div.dgj_tdDiv").eq(k);
                    }
                    else {
                        tdDiv = oTr2.find("div.dgj_tdDiv").eq(k);
                    }
                }
                    break;
                case 3: {
                    var k = colNo - this.p.lockColumnR + 1;
                    if (!rowData) {
                        var tbody3;
                        if (!this.p.isPageCache) {
                            tbody3 = this.tbody3;
                        }
                        else {
                            var cache = this.getPageCache(pageNo);
                            if (cache) {
                                tbody3 = cache[5];
                            }
                            else {
                                tbody3 = this.tbody3;
                            }
                        }
                        tdDiv = tbody3.find("tr:not(tr[loading])").eq(rowNo).find("div.dgj_tdDiv").eq(k);
                    }
                    else {
                        tdDiv = oTr3.find("div.dgj_tdDiv").eq(k);
                    }
                }
                    break;
            }

            if (tdDiv.attr("alignTmp")) {  //还原居中方式
                tdDiv.css("text-align", tdDiv.attr("alignTmp"));
            }
            if (!dataHtml) {   //填入单元格值
                tdDiv.html(data);
            }
            else {
                tdDiv.html(dataHtml);
            }

            if (this.p.lockColumn) {
                this.syncRowHeightR(rowNo, oTr1, oTr2, oTr3);  //同步行高
            }

            FJ.lazyDo(function () {
                this.setMainHeight();
            }, 500, "ld_dgjCell", this);
        },
        //#endregion

        //#region 合并单元格(横向)
        mergeCell: function (cellNum, j, oTr) {  //表行
            //this.mergeCells.push([cellNum, j, oTr]);  //加入待处理集合
            this.mergeCellFn(cellNum, j, oTr);
        },

        mergeCellH: function (cellNum, j, oTr) {  //表头
            this.mergeCellFn(cellNum, j, oTr, "th");
        },

        mergeCellFn: function (cellNum, j, oTr, td) {
            if (!td) {
                td = "td";
            }
            if (j > 0) {
                var oTds = oTr.find(td + ":not(" + td + "[chkCell]):lt(" + (j + 1) + ")");
                var h = j + 1 - cellNum, k = j;
                var oTdDiv, w = 0;   //计算合并的单元格宽度
                for (var i = 0, l = oTds.length; i < l; i++) {
                    if (k == j) {  //合并目标单元格
                        oTds.eq(k).attr("colspan", cellNum).find("div.dgj_tdDiv").attr("mergeCell", cellNum);
                        oTdDiv = oTds.eq(k).find("div.dgj_tdDiv");
                        w += oTdDiv.width();
                    }
                    else {  //隐藏其余单元格
                        var oTdDivH = oTds.eq(k).find("div.dgj_tdDiv");
                        w += oTdDivH.width() + this.p.mcShift;
                        oTdDivH.attr("mergeCellH", cellNum).attr("mergeCellN", j);
                        oTds.eq(k).hide();
                    }

                    if (k <= h) {
                        break;
                    }
                    k--;
                }
                oTdDiv.width(w);  //设置合并的单元格宽度
            }
        },
        //#endregion

        //#region 合并单元格(纵向)
        mergeCellV: function () {
            if (!this.p.isMergeCellV) {
                return;
            }

            var trs,
                noMcv = true,
                fTr,
                fnRs;
            for (var j = 0, cols = this.p.columns, l = cols.length; j < l; j++) {
                var col = cols[j],
                    tbody,
                    cType;
                if (!col.mergeCellV) {
                    continue;
                }
                else {
                    cType = this.getColType(j);
                    switch (cType) {
                        case 0:
                        case 1:
                            tbody = this.tbody;
                            break;
                        case 2:
                            tbody = this.tbody2;
                            break;
                        case 3:
                            tbody = this.tbody3;
                            break;
                    }
                    if (noMcv) {
                        fTr = this.p.filterTag ? "tr[" + this.p.filterTag + "]" : "";
                        trs = tbody.find("tr:not(tr[loading]" + (fTr ? "," + fTr : "") + ")");
                        fnRs = function (tds, h, n) {  //合并单元格并隐藏多余的单元格
                            tds[h].attr("rowspan", n);
                            for (var o = 1, p = h; o < n; o++) {
                                tds[h + o].hide();
                            }
                        };
                        noMcv = false;
                    }
                }

                var thiz = this,
                    tds = [];
                trs.each(function () {  //获取列td集合
                    var trds = $(this).find("td" + (fTr ? ":not(" + fTr + ")" : ""));
                    if (thiz.p.hasChk) {
                        trds = trds.not("td:first");
                    }
                    tds.push(trds.eq(j));
                });

                var dF,
                    n = 1,
                    h = 0;
                for (var k = 0, m = this.data.length; k < m; k++) {
                    var d = this.data[k];
                    if (k != 0 && dF === d[col.dataIndex]) {
                        n++;
                        if (k == m - 1) {  //最后一行
                            fnRs(tds, h, n);
                        }
                    }
                    else {
                        if (n != 1 || (n == 1 && k != 0)) {  //有多行重复时合并单元格，如只有一行也执行合并
                            fnRs(tds, h, n);
                            h = k;
                            n = 1;
                        }
                    }
                    dF = d[col.dataIndex];
                }
            }
        },
        //#endregion
        //#endregion

        //#region 可编辑操作
        //#region 切换可编辑状态
        switchEdit: function (rowData, b, notUpdate, notSaveTxt, rowNum) {
            var ec = rowData.editCell,
                isE = b;

            for (var i = 0, l = ec.length; i < l; i++) {
                var ee = ec[i],
                    isEdit,
                    oTxt = ee[0],
                    elem = ee[1],
                    status = ee[2],
                    filter = ee[4],
                    cbxMap = ee[5];

                if (b != null) {
                    isEdit = b;
                }
                else {
                    isEdit = !status;
                    isE = isEdit;
                }
                if (isEdit) {
                    if (!status) {
                        oTxt.show();
                        elem.hide();
                        ee[2] = true;

                        if (!notSaveTxt) {  //切换回编辑状态时,是否和表格数据同步
                            oTxt.val(rowData[ee[3]]);
                        }
                    }
                }
                else {
                    if (status) {
                        oTxt.hide();
                        elem.show();
                        ee[2] = false;

                        if (!notUpdate) {  //关闭编辑时修改表格数据
                            var v = oTxt.val(), t = v;
                            if (cbxMap) {  //如果编元素为辑下拉框则取对应的text值填在单元格中
                                t = cbxMap[v];
                            }
                            if (!filter) {
                                elem.text(t);
                            }
                            else {
                                elem.html(filter(t, rowData, rowNum));  //用过滤方法处理显示在表格单元格的文字
                            }
                            rowData[ee[3]] = v;
                        }
                    }
                }
            }

            if (this.p.editSetHeight) {
                this.setMainHeight();
            }
            this.fire("afterSwitchEdit", { isEdit: isE, rowData: rowData, rowNum: rowNum });
        },
        //#endregion

        //#region 检测表格是否全部编辑完成
        checkEdit: function () {
            var d;
            if (!this.p.isPageCache) {
                d = this.data;
            }
            else {
                d = this.datas;
            }

            for (var i = 0, l = d.length; i < l; i++) {
                var row = d[i];
                if (row.editCell) {
                    for (var j = 0, m = row.editCell.length; j < m; j++) {
                        if (row.editCell[j][2]) {
                            return false;
                        }
                    }
                }
            }
            return true;
        },
        //#endregion
        //#endregion

        //#region 清空数据
        //#region 判断表数据是否为空
        isDataEmpty: function () {
            var b = false;
            if (!this.p.isPageCache) {
                for (var i = 0, l = this.data.length; i < l; i++) {
                    if (this.data[i] != null) {
                        b = true;
                        break;
                    }
                }
            }
            else {
                for (var h = 0, l = this.pageCache.length; h < l; h++) {
                    var data = this.pageCache[h][1];
                    for (var i = 0, m = data.length; i < m; i++) {
                        if (data[i] != null) {
                            b = true;
                            break;
                        }
                    }
                }
            }
            return !b || this.data.length <= 0;
        },
        //#endregion

        //#region 清空数据
        clearData: function (isInit) {
            var thiz = this,
                isGl = this.p.noGridBorder;
            this.data = [];
            this.data.lengthD = 0;
            this.chks = [];
            if (this.p.hasGroup) {
                this.rows = [];
            }
            this.pageNo = 1;
            this.p.canSort = false;  //禁止排序
            if (this.p.isPageCache) {  //清空分页缓存
                this.clearPageCache();
            }
            this.tbody.empty();

            if (this.p.isLazyLoad) {  //重置延迟加载行号
                this.lazyRowNo = 0;
            }

            var colW = this.getColNum();
            if (!this.p.isTree && !this.p.percentWidth) {  //todo 表格宽度设置100%
                this.table.width(this.tableHead.width() + ((fj.isIEgt8 && isGl && this.p.lockColumn) ? (-1 * colW[0] + 2) : 0) + (fj.isIE8 ? -2 : 0));
            }
            this.tbody.append('<tr emptyRow="true"><td style="text-align:center;height:' + this.p.emptyRowH + 'px;">' + (!isInit ? this.p.emptyTxt : '&nbsp;') + '</td></tr>');

            if (this.p.lockColumn) {
                this.tbody2.empty();
                this.table2.width(this.tableHead2.width());
                this.tbody2.append('<tr emptyRow="true"><td style="text-align:center;height:' + this.p.emptyRowH + 'px;">&nbsp;</td></tr>');

                if (this.p.lockColumnR) {
                    this.tbody3.empty();
                    this.table3.width(this.tableHead3.width() + ((fj.isIEgt8 && isGl) ? (-1 * colW[2]) : 0));
                    this.tbody3.append('<tr emptyRow="true"><td style="text-align:center;height:' + this.p.emptyRowH + 'px;">&nbsp;</td></tr>');
                }

                //同步表头高度
                //this.syncRowHeightH();
            }

            for (var i = 0, cols = this.p.columns; i < cols.length; i++) {  //隐藏列
                if (cols[i].isHide) {
                    this.hideColumn(i, false, true);
                }
            }

            this.setTableWidth();
            this.setMainHeight(true);

            return this;
        },
        //#endregion
        //#endregion

        //#region 拖动列宽
        //#region 设置列可拖动
        setColumeDD: function () {
            var thiz = this;
            this.colDDs = [];   //拖动对象集合
            this.spjs = [];

            for (var i = 0, cols = this.p.columns, l = cols.length; i < l; i++) {
                var colType = this.getColType(i);  //列类型

                var colDD = $("<div class='dgj_ddBar noRej'></div>").css({
                    top: 0,
                    width: 5,
                    height: "100%",
                    backgroundColor: "#fff",  //如果不设置背景色,旧版IE下有时鼠标移不上去
                    opacity: 0.001,
                    position: "absolute",
                    zIndex: 1,
                    display: $.inArray(i, this.p.hideColumeDD) == -1 ? "block" : "none"
                }), colDD2;

                switch (colType) {
                    case 0:
                    case 1:
                    case 3:
                        this.colDDs.push(colDD);
                        this.headContainer.append(colDD);
                        break;
                    case 2:
                        colDD.addClass("dgj_colDD" + i);
                        colDD2 = colDD.clone();
                        this.lcHeadContainer.append(colDD);
                        this.lcContainer.append(colDD2);
                        this.colDDs.push([colDD, colDD2]);
                        break;
                }

                (function (dd, i) {
                    switch (colType) {
                        case 0:
                            {
                                var spj = $(dd).SPJ({
                                    ddPosType: thiz.p.ddPosType,
                                    oLeft: thiz.thds1.eq(i),
                                    evts: {
                                        splitEnd: function (e, p) {
                                            var cellNum, fnDD0 = function (oTr, inx) {  //设置表体、表底宽度
                                                var trds = oTr.find("div.dgj_tdDiv");
                                                if (thiz.p.hasChk) {
                                                    trds = trds.not("div:first");
                                                }
                                                var oTrd = trds.eq(i);
                                                cellNum = oTrd.attr("mergeCell");
                                                if (!cellNum) {  //无合并单元格时
                                                    var cellNumN = parseFloat(oTrd.attr("mergeCellN"));
                                                    if (!cellNumN) {  //非被合并的单元格
                                                        oTrd.width((thiz.p.noGridBorder && i != 0) ? p.l + 1 : p.l);
                                                    }
                                                    else {  //被合并的单元格
                                                        var w = p.l, k = cellNumN, cellNumH = parseFloat(oTrd.attr("mergeCellH"));
                                                        for (var j = 0; j < cellNumH; j++) {
                                                            if (k != i) {
                                                                w += thiz.thds1.eq(k).width() + thiz.p.mcShift;
                                                            }
                                                            k--;
                                                        }
                                                        trds.eq(cellNumN).width(w);
                                                    }
                                                }
                                                else {  //有合并单元格时
                                                    var w = p.l, k = i;
                                                    for (var j = 0; j < cellNum - 1; j++) {
                                                        k--;
                                                        w += thiz.thds1.eq(k).width() + thiz.p.mcShift;
                                                    }
                                                    oTrd.width(w);
                                                }
                                            };

                                            thiz.table.find("tr:not(tr[loading],tr[groupRow])").each(function (inx) {  //设置表体列宽
                                                fnDD0($(this), inx);
                                            });

                                            if (thiz.p.hasGridFoot) {   //表底
                                                fnDD0(thiz.trF);
                                            }

                                            //                                            var scrollL = thiz.sbj.getScrollLeft();  //定位拖动条
                                            //                                            if (scrollL > 0) {
                                            //                                                thiz.sbj.setScrollLeft(scrollL + 1);
                                            //                                                thiz.sbj.setScrollLeft(scrollL - 1);
                                            //                                            }
                                            //                                            else {
                                            //                                                thiz.setDDPosition();
                                            //                                            }
                                            fj.lazyDo(function () {  //定位拖动条
                                                this.setDDPosition();
                                            }, 100, "ld_dgjScroll", thiz);
                                            thiz.setSbjWidth(true);   //设置下滚动条宽
                                            thiz.countFbtnPos();
                                            thiz.setMainHeight();

                                            if (thiz.p.collapseSonRow) {  //设置分组列宽
                                                thiz.tbody.find("div.dgj_tdDiv").eq(thiz.p.hasChkG ? 1 : 0).width(thiz.tableHead.width() - thiz.p.chkWidth - thiz.shiftG);
                                            }
                                            if (!cellNum) {  //有合并单元格时暂时不支持存储列宽
                                                thiz.saveColWidth(i, p.l);  //存储列宽
                                            }
                                        }
                                    }
                                });
                            }
                            break;
                        case 1:
                            {
                                var spj = $(dd).SPJ({
                                    ddPosType: thiz.p.ddPosType,
                                    oLeft: thiz.thds1.eq(i),
                                    evts: {
                                        splitEnd: function (e, p) {
                                            thiz.table.find("tr:not(tr[loading])").each(function (inx) {  //设置表体列宽
                                                var trds = $(this).find("div.dgj_tdDiv");
                                                if (thiz.p.hasChk) {
                                                    trds = trds.not("div:first");
                                                }
                                                trds.eq(i).width((thiz.p.noGridBorder && i != 0) ? p.l + 1 : p.l);
                                            });

                                            if (!thiz.p.asyncLoadTree) {  //异步加载树时不执行同步行高
                                                thiz.syncRowHeight();
                                            }
                                            thiz.setLockWidth();
                                            //设置下滚动条位置
                                            thiz.setDDPosition();
                                            //thiz.setLockWidth();
                                            thiz.sbj.left(thiz.table.width());
                                            thiz.countFbtnPos();
                                            thiz.setMainHeight();
                                            thiz.saveColWidth(i, p.l);  //存储列宽
                                        }
                                    }
                                });
                            }
                            break;
                        case 2:
                            {
                                var k = i - thiz.p.lockColumn + 1;
                                var spj = $("div.dgj_colDD" + i).SPJ({
                                    ddPosType: thiz.p.ddPosType,
                                    oLeft: thiz.thds2.eq(k),
                                    evts: {
                                        splitEnd: function (e, p) {
                                            thiz.table2.find("tr:not(tr[loading])").each(function (inx) {  //设置表体列宽
                                                var trds = $(this).find("div.dgj_tdDiv");
                                                trds.eq(k).width((thiz.p.noGridBorder && k != 0) ? p.l + 1 : p.l);
                                            });

                                            if (!thiz.p.asyncLoadTree) {  //异步加载树时不执行同步行高
                                                thiz.syncRowHeight();
                                            }
                                            thiz.setDDPosition(true);
                                            //                                            var scrollL = thiz.sbj.getScrollLeft();
                                            //                                            if (scrollL > 0) {
                                            //                                                thiz.sbj.setScrollLeft(scrollL + 1);
                                            //                                                thiz.sbj.setScrollLeft(scrollL - 1);
                                            //                                            }
                                            //                                            else {
                                            //                                                thiz.setDDPosition(true);
                                            //                                            }
                                            thiz.setLockWidth();
                                            thiz.setDDPosition();
                                            thiz.countFbtnPos();
                                            thiz.setMainHeight();
                                            thiz.saveColWidth(i, p.l);  //存储列宽
                                        }
                                    }
                                });
                            }
                            break;
                        case 3:
                            {
                                var k = i - thiz.p.lockColumnR + 1;
                                var spj = $(dd).SPJ({
                                    ddPosType: thiz.p.ddPosType,
                                    oLeft: thiz.thds3.eq(k),
                                    evts: {
                                        splitEnd: function (e, p) {
                                            thiz.table3.find("tr:not(tr[loading])").each(function (inx) {  //设置表体列宽
                                                var trds = $(this).find("div.dgj_tdDiv");
                                                trds.eq(k).width((thiz.p.noGridBorder && k != 0) ? p.l + 1 : p.l);
                                            });

                                            if (!thiz.p.asyncLoadTree) {  //异步加载树时不执行同步行高
                                                thiz.syncRowHeight();
                                            }
                                            thiz.setLockWidth();
                                            thiz.sbj.left(thiz.table.width());
                                            //设置下滚动条位置                                        
                                            thiz.setDDPosition();
                                            //thiz.setLockWidth();
                                            thiz.countFbtnPos();
                                            thiz.setMainHeight();
                                            thiz.saveColWidth(i, p.l);  //存储列宽
                                        }
                                    }
                                });
                            }
                            break;
                    }
                    thiz.spjs.push(spj);
                })(colDD, i, thiz);
            }
        },
        //#endregion

        //#region 计算拖动条位置
        setDDPosition: function (isOnlySetTable2) {
            var thiz = this;
            var spjShiftL = 6;
            if (FJ.isIElt9) {
                spjShiftL = 7;
            }
            else if (FJ.isIE9 || FJ.isIE10 || FJ.isFF) {
                spjShiftL = 8;
            }
            else if (FJ.isWebkit) {
                spjShiftL = 12;
            }

            for (var i = 0, cols = this.p.columns; i < cols.length; i++) {
                var colType = this.getColType(i);  //列类型
                if (this.p.lockColumn && colType == 1 && isOnlySetTable2) {
                    continue;
                }

                var l = 0;
                switch (colType) {
                    case 0:
                    case 1:
                        {
                            l = thiz.ths1.eq(i)[this.p.ddPosType]().left;
                            var p = l + (!FJ.isWebkit ? thiz.ths1.eq(i).width() : thiz.ths1.eq(i)[0].clientWidth);
                            if (this.p.ddPosType == "offset") {
                                p -= spjShiftL;
                            }
                            if (thiz.p.canColumeDD) {
                                this.colDDs[i].css({
                                    left: p
                                });
                            }
                        }
                        break;
                    case 2:
                        {
                            var k = i - this.p.lockColumn + 1;
                            var sl = this.sbj.getScrollLeft();
                            l = thiz.ths2.eq(k)[this.p.ddPosType]().left - (this.p.ddPosType == "offset" ? this.tableHead.width() : 0) + sl;
                            var p = l + (!FJ.isWebkit ? thiz.ths2.eq(k).width() : thiz.ths2.eq(k)[0].clientWidth) - (this.p.ddPosType == "offset" ? spjShiftL : 0);
                            if (thiz.p.canColumeDD) {
                                this.colDDs[i][0].css({
                                    left: p
                                });
                                this.colDDs[i][1].css({
                                    left: p
                                });
                                this.spjs[i].p.shift.l = sl;
                            }
                        }
                        break;
                    case 3:
                        {
                            var k = i - this.p.lockColumnR + 1;
                            l = thiz.ths3.eq(k)[this.p.ddPosType]().left;
                            var p = l + (!FJ.isWebkit ? thiz.ths3.eq(k).width() : thiz.ths3.eq(k)[0].clientWidth);
                            if (this.p.ddPosType == "offset") {
                                p -= spjShiftL;
                            }
                            if (thiz.p.canColumeDD) {
                                this.colDDs[i].css({
                                    left: p
                                });
                            }
                        }
                        break;
                }

                //设置拖动条最小宽度
                if (this.p.canColumeDD) {
                    var minW = 0;
                    if (cols[i].minWidth) {
                        minW = cols[i].minWidth;
                    }
                    else {
                        minW = this.p.defaultMinW;
                    }
                    this.spjs[i].p.minX = l + minW;

                    //设置拖动条最大宽度
                    if (cols[i].maxWidth) {
                        this.spjs[i].p.maxX = l + cols[i].maxWidth;
                    }
                }
            }

            //表格空时
            if (this.isDataEmpty()) {
                var isGl = this.p.noGridBorder, colW;
                if (isGl) {
                    colW = this.getColNum();
                }
                if (!this.p.percentWidth) {  //todo 表格宽度设置100%
                    this.table.width(this.tableHead.width() + ((fj.isIEgt8 && isGl && this.p.lockColumn) ? (-1 * colW[0] + 1) : 0));
                }
                if (this.p.lockColumn) {
                    this.table2.width(!FJ.isFF ? this.tableHead2.width() : this.tableHead2.width() + 1);
                }
                if (this.p.lockColumnR) {
                    this.table3.width(!FJ.isFF ? this.tableHead3.width() + ((fj.isIEgt8 && isGl) ? (-1 * colW[2]) : 0) : this.tableHead3.width() + 1);
                }

                //同步表头高度
                fj.lazyDo(function () {
                    this.syncRowHeightH();
                }, 100, "ld_dgjSrhh", this);
            }
        },
        //#endregion

        //#region 存储列宽
        saveColWidth: function (no, width) {
            if (this.p.storeName) {   //存储列宽到本地存储中
                try {
                    var defColWidth = fj.LocalStorage.getItem({ key: this.p.storeName + "_colWidth" }), objC;  //获取默认列宽
                    if (defColWidth) {
                        objC = JSON.parse(defColWidth);
                    }
                    else {
                        objC = {};
                    }
                    objC[no] = width;
                    fj.LocalStorage.setItem({ key: this.p.storeName + "_colWidth", value: JSON.stringify(objC) });
                }
                catch (e) { }
            }
        },
        //#endregion
        //#endregion

        //#region 设置各部分宽、高
        //#region 设置分组列宽
        setRowWidthG: function () {
            if (!this.p.isTree && this.p.collapseSonRow) {  //设置分组列宽
                this.tbody.find("div.dgj_tdDiv").eq(this.p.hasChkG ? 1 : 0).width(this.tableHead.width() - this.p.chkWidth - this.shiftG);
            }
        },
        //#endregion

        //#region 设置横滚动条宽度
        setSbjWidth: function (isSplitEnd) {
            if (this.p.isTree) {
                return;
            }

            var thiz = this;
            var wTh = this.tableHead.width() + 2;
            var wDo = this.divOut.width();
            var wThH = wTh;
            //            if (FJ.isIE8 && isSplitEnd) {  //解决ie8下横滚动条不显示
            //                wDo -= 1;
            //                wThH += 1;
            //            }

            if (!this.p.isTree && this.p.isAutoSetWidth) {
                this.mainContainer.width(wTh);
                this.mainHeadContainer.width(wThH);
                if (this.p.hasGridFoot) {
                    this.mainFootContainer.width(wThH);
                }

                if (fj.isMobile) {  //移动端须设置容器实际宽度
                    this.bodyContainer.width(wTh);
                    this.headContainer.width(wThH);
                    this.gridContainer.width(wThH);
                }
            }

            //setTimeout(function() {
            var wBs = thiz.bodyContainer[0].scrollWidth;
            thiz.sbj.width(wDo + (!this.p.fbSpace ? 1 : 0), wBs);

            //            if (FJ.isIE8) {
            //                if (wDo >= wBs) {
            //                    thiz.sbj.divOut.hide();
            //                }
            //                else {
            //                    thiz.sbj.divOut.show();
            //                }
            //            }
            //            else {
            //                thiz.sbj.divOut.show();
            //}
            //}, 25);
        },
        //#endregion

        //#region 设置横滚动条位置(有冻结列时)
        setSbjPostionLc: function () {
            var wG = this.gridContainer.width(), w1 = this.table.width(), w;
            if (wG + (FJ.isIEgt9 ? 1 : 0) < this.gridContainer[0].scrollWidth) {  //gridContainer出现横滚动条
                var w2 = this.lcHeadContainer.width(), sL = this.gridContainer[0].scrollLeft;
                if (wG + sL - w1 - w2 < 0) {
                    w = wG - this.sbj.divOut.width();  //超过右侧屏幕极限值后正好靠右
                }
                else if (sL > w1) {
                    w = 0;  //超过左侧屏幕极限值后正好靠左
                }
                else {
                    w = w1 - sL;  //跟随table2的位置
                }
            }
            else {  //一般情况下gridContainer未出现横滚动条,则跟随table2的位置
                w = w1;
            }
            this.sbj.left(w);
        },
        //#endregion

        //#region 设置冻结表区域、滚动条宽度
        setLockWidth: function () {
            var thiz = this;

            var w = 0;
            if (!thiz.p.lockColumnR) {
                w = thiz.divOut.width() - thiz.tableHead.width() - 18
            }
            else {
                w = thiz.divOut.width() - thiz.tableHead.width() - 18 - thiz.tableHead3.width();
            }

            var wH = w, wB = w;
            if (FJ.isFF) {
                wH = w - 6;
                wB = w - 6;
            }
            else if (FJ.isWebkit) {
                wH = w - 2;
                wB = w - 2;
            }

            //table2宽度不足时的处理
            var tw2 = thiz.tableHead2.width();
            if (tw2 > 0 && tw2 < w) {
                var s = this.p.lockColumnR ? 1 : 0;
                wH = tw2 - s;
                wB = tw2 - s;
            }
            else if (tw2 <= 0) {
                wH = 0;
                wB = 0;
            }

            var isLimit = wH < this.p.lcMinWidth;
            if (isLimit) {  //低分辨率下设置table2宽度最小值
                wB = wH = this.p.lcMinWidth;
            }

            thiz.lcHeadContainer.width(wH);
            var lcc = thiz.lcContainer;
            lcc.width(wB);

            if (isLimit) {  //如果table2宽度处于最小值，gridContainer出现横滚动条
                wG = this.mainContainer.width() + this.lcHeadContainer.width();
                if (this.p.lockColumnR) {
                    wG += !(fj.isIElt8) ? this.rightContainer.width() : this.tableHead3.width();
                }
                this.headContainer.width(wG + (this.p.noGridBorder ? 1 : 0));
                this.bodyContainer.width(wG + 18);
                this.gridContainer.css("overflow-x", "auto");
            }
            else {
                this.headContainer.css("width", "auto");
                this.bodyContainer.css("width", "auto");
                this.gridContainer.css("overflow-x", "hidden");
            }

            //滚动条位置
            //            if(fj.isFF) {
            //                lcc.css("overflow", "auto");
            //            }
            this.sbj.width(lcc.width() + (this.p.noGridBorder ? 3 : 2)
//            (function() {
//                var v = 0;
//                if(fj.isFF && thiz.p.lockColumnR) {
//                    v = 2;
//                }
//                return v;
//            })()
            , lcc[0].scrollWidth + (!this.p.lockColumnR ? 3 : 0));
            //            if(fj.isFF) {
            //                lcc.css("overflow", "hidden");
            //            }

            this.fire("afterSetWidth");
        },
        //#endregion

        //#region 计算表格宽度
        setTableWidth: function (noSyncRh, noSetWidth, colW) {
            var thiz = this;
            var isEmpty = this.isDataEmpty();

            if (!this.p.lockColumn) {  //无冻结列时
                if (!noSetWidth && !this.p.isTree && this.p.isAutoSetWidth) {  //将未设置宽度的列的宽度设置自适应剩余宽度
                    var doW = this.divOut.width();
                    var headW = this.tableHead.width();
                    //var bodyW = this.table.width();
                    var w = doW - headW;
                    var columnP = 0, wd = 0, wh = 0;
                    var fbw = this.p.fbSpace ? 18 : 2;

                    var mc, odsH, fn = function (oTable, isH) {
                        var ods;
                        if (isH) {  //表头
                            ods = thiz.thds;
                        }
                        else {
                            ods = oTable.find("div.dgj_tdDiv");
                            if (this.p.hasChk) {
                                ods = ods.not("div:first");
                            }
                        }
                        if (this.columnP != null) {
                            columnP = this.columnP;
                        }
                        else {
                            columnP = ods.length - 1;
                        }

                        var od = ods.eq(columnP);
                        mc = od.attr("mergecell");
                        if (mc) {  //标记将要重设宽度的列表头有合并单元格
                            odsH = ods;
                        }
                        wd = od.width();
                        wh = w + wd - fbw;
                        if (wh > this.p.defaultW) {
                            od.width(wh);
                        }
                        else {
                            od.width(this.p.defaultW);
                        }
                    };

                    //表头
                    fn.call(this, this.tableHead, true);

                    //表底
                    if (this.p.hasGridFoot) {
                        fn.call(this, this.tableFoot);
                    }

                    var ws = 0;
                    if (mc) {  //计算表头合并单元格列的前几列宽度之和
                        for (var h = 1, col = this.p.columns; h < mc; h++) {
                            var oThd = odsH.eq(columnP - h),
                                c = col[columnP - h];
                            ws += parseInt(oThd[0].style.width, 10)
                                + (!c.editable ? 4 : 6)  //减去td的padding值
                                + (thiz.p.noGridBorder ? 1 : 0);
                        }
                    }

                    //表体
                    this.table.find("tr.dgj_tr1").each(function () {
                        var ods2 = $(this).find("div.dgj_tdDiv");
                        if (thiz.p.hasChk) {
                            ods2 = ods2.not("div:first");
                        }
                        var od2 = ods2.eq(columnP);
                        var wd2 = od2.width();
                        var wh2 = w + wd - fbw;
                        if (wh2 > thiz.p.defaultW) {  //如表头有合并单元格则需减掉前几列的宽度
                            od2.width(wh - ws);
                        }
                        else {
                            od2.width(thiz.p.defaultW - ws);
                        }
                    });
                }

                //设置横滚动条宽度
                this.setSbjWidth();

                //计算拖动条位置
                if (this.p.canColumeDD) {
                    this.setDDPosition();
                    if (FJ.isIElt8) {  //解决初始化后IE7下拖动条高度不够问题
                        this.gridContainer.css("position", "static").css("position", "relative");
                    }
                }

                this.setRowWidthG();  //设置分组列宽
            }
            else {  //有冻结列时
                //                if (isEmpty) {  //表格空时的设定
                //                    this.table.width(!FJ.isFF ? this.tableHead.width() : this.tableHead.width() + 1);
                //                }

                this.setLockWidth();  //动态设置冻结列表宽度
                if (this.p.canColumeDD) {  //计算拖动条位置
                    this.setDDPosition();
                }
                this.setSbjPostionLc();  //设置横滚动条位置
                this.countFbtnPos();

                if (!noSyncRh) {
                    fj.lazyDo(function () {
                        this.syncRowHeight();   //同步行高
                    }, 100, "ld_dgjSrh", this);
                }
            }

            if (!this.p.isTree) {
                if (isEmpty) {   //表格空时的设定
                    var isGl = this.p.noGridBorder;
                    if (isGl && colW == null) {
                        colW = this.getColNum();
                    }
                    if (!this.p.percentWidth) {  //todo 表格宽度设置100%
                        this.table.width(this.tableHead.width() + ((fj.isIEgt8 && isGl && this.p.lockColumn) ? (-1 * colW[0] + 1) : 0) + (fj.isIE8 ? -2 : 0));
                    }
                    if (this.p.lockColumn) {
                        this.table2.width(this.tableHead2.width());
                    }
                    if (this.p.lockColumnR) {
                        this.table3.width(this.tableHead3.width() + ((fj.isIEgt8 && isGl) ? (-1 * colW[2]) : 0));
                    }
                }
                else {
                    if (!this.p.percentWidth) {  //todo 表格宽度设置100%
                        this.table.css("width", "auto");
                    }
                    if (this.p.lockColumn) {
                        this.table2.css("width", "auto");
                    }
                    if (this.p.lockColumnR) {
                        this.table3.css("width", "auto");
                    }
                }
            }
        },
        //#endregion

        //#region 计算主体高度
        setMainHeight: function (isEmpty) {
            if (this.p.borderWidth && !this.p.lockColumn) {
                if (isEmpty == null) {
                    isEmpty = this.isDataEmpty();
                }
                if (this.p.noGridBorder) {  //有外层边框且数据为空时去掉表格边框
                    if (isEmpty) {
                        this.table.css({
                            borderRightWidth: 0,
                            borderBottomWidth: 0
                        });
                    }
                    else {
                        this.table.css({
                            borderRightWidth: 1,
                            borderBottomWidth: 1
                        });
                    }
                }
                else {
                    var td = this.table.find("td");
                    if (isEmpty) {
                        td.css("border-width", 0);
                    }
                    else {
                        td.css("border-width", 1);
                    }
                }
            }

            var sbjH = (!this.p.hideScrollH && !this.p.isTree && (this.p.isReservedSbjH || this.sbj.hasScrollH())) ? this.sbj.p.height : 0;  //当横滚动条需要显示时才预留位置
            if (sbjH == 0) {
                this.sBarHContainer.hide();
            }
            else {
                this.sBarHContainer.show();
            }

            if (!this.p.isAutoSetHeight) {  //是否自动计算高度
                this.bodyContainer.css("height", "auto");
                if (fj.isIEgt9) {
                    this.gridContainer.css("height", "auto");
                }
                return;
            }

            var parentH = this.divOut.parent().height();
            var headH = this.headContainer.height();
            var bodyH = this.table.height();
            var footH = 0;
            if (this.p.hasGridFoot) {
                footH = this.tableFoot.height();
            }
            if (this.p.lockColumn) {
                var bodyH2 = this.table2.height();
                var bodyH3 = 0;
                if (this.p.lockColumnR) {
                    bodyH3 = this.table3.height();
                }
                var maxH = Math.max(bodyH, bodyH2, bodyH3);
                bodyH = maxH;
            }

            var allH = headH + bodyH + footH + sbjH;
            if (allH >= parentH) {
                var h = parentH - headH - footH - sbjH;
                if (this.p.lockColumn) {
                    if (!(fj.isIElt8) && this.gridContainer.width() + (FJ.isIEgt9 ? 1 : 0) < this.gridContainer[0].scrollWidth) {  //如果gridContainer出现横滚动条，则预留table2的滚动条高度
                        h -= sbjH;
                    }

                    if (FJ.isIEgt9) {  //IE9以上版本需设置gridContainer高度,否则table2横滚动条有时会消失
                        this.gridContainer.height(parentH - sbjH);
                    }
                }
                if (this.p.borderWidth) {  //有外层边框时去掉表格底边框
                    h -= 1;
                    if (!this.p.lockColumn) {
                        var t;
                        if (this.p.noGridBorder) {
                            t = this.table;
                        }
                        else {
                            t = this.table.find("tr:last > td");
                        }
                        t.css("border-bottom-width", 0);
                    }
                }

                this.bodyContainer.height(h);
            }
            else {
                if (this.p.lockColumn) {
                    if (FJ.isIEgt9) {  //IE9以上版本需设置gridContainer高度,否则table2横滚动条有时会消失
                        if (this.gridContainer.width() + 1 < this.gridContainer[0].scrollWidth) {
                            this.gridContainer.height(allH);
                        }
                        else {
                            this.gridContainer.height(allH - sbjH + (this.p.noGridBorder ? 1 : 0));
                        }
                    }
                }
                if (this.p.borderWidth && !this.p.lockColumn && !isEmpty) {  //有外层边框时恢复表格底边框
                    var t;
                    if (this.p.noGridBorder) {
                        t = this.table;
                    }
                    else {
                        t = this.table.find("tr:last > td");
                    }
                    t.css("border-bottom-width", 1);
                }

                this.bodyContainer.height((!this.p.isTree ? bodyH + (!this.p.hasGridFoot ? (fj.isFF && this.p.isTree ? 2 : 1) : (FJ.isFF ? 0 : -1)) : parentH) + (this.p.noGridBorder ? 1 : 0));
            }
        },
        //#endregion

        //#region 重新布局
        reLayout: function (noSyncRh, noSetWidth) {
            this.setTableWidth(noSyncRh, noSetWidth);
            this.countFbtnPos();
            this.setMainHeight();
            this.autoLoadlazyRow();
        },
        //#endregion

        //#region 同步行高
        //#region 同步行高
        syncRowHeight: function () {
            var thiz = this;

            if (this.p.lockColumn) {
                //表头
                this.syncRowHeightH();

                //表体
                this.syncRowHeightB();
            }
        },
        //#endregion

        //#region 同步行高(表行)
        syncRowHeightR: function (rowNo, oTr1, oTr2, oTr3) {
            if (this.p.lockColumn) {
                var tr, tr2;
                if (!oTr1) {
                    tr = this.tbody.find("tr:not(tr[loading])").eq(rowNo);
                    tr2 = this.tbody2.find("tr:not(tr[loading])").eq(rowNo);
                }
                else {
                    tr = oTr1;
                    tr2 = oTr2;
                }
                var h1 = tr.height();   //IE9下折很多行时存在不一致问题，解决方案:单元格内的元素(input等)需要设置高度
                var h2 = tr2.height();
                var max, tr3, h3;
                if (!this.p.lockColumnR) {
                    max = Math.max(h1, h2);
                }
                else {
                    if (!oTr1) {
                        tr3 = this.tbody3.find("tr:not(tr[loading])").eq(rowNo);
                    }
                    else {
                        tr3 = oTr3;
                    }
                    h3 = tr3.height();
                    max = Math.max(h1, h2, h3);
                    tr3.height(max);
                }
                tr.height(max);
                tr2.height(max);
            }
        },
        //#endregion

        //#region 同步行高(表头)
        syncRowHeightH: function () {
            if (this.p.lockColumn) {
                if (!this.columnGroup) {
                    var h1 = this.trH.height(),
                        h2 = this.trH2.height(),
                        max, h3;
                    if (!this.p.lockColumnR) {
                        max = Math.max(h1, h2);
                    }
                    else {
                        h3 = this.trH3.height();
                        max = Math.max(h1, h2, h3);
                        this.trH3.height(max);
                    }
                    this.trH.height(max);
                    this.trH2.height(max);
                }
                else {
                    var s = (fj.isIE8 || fj.isIE9 || fj.isIE10 || fj.isWebkit) ? 1 : 0,
                        h1 = this.tableHead.height(),
                        h2 = this.tableHead2.height(),
                        max, h3;
                    if (!this.p.lockColumnR) {
                        max = Math.max(h1, h2);
                    }
                    else {
                        h3 = this.tableHead3.height();
                        max = Math.max(h1, h2, h3);
                        if (max > h3) {
                            if (this.hasCg3) {
                                this.trHcg3.height(max - this.trH3.height() - s);
                            }
                            else {
                                this.trH3.height(max - s);
                            }
                        }
                    }
                    if (max > h1) {
                        if (this.hasCg1) {
                            this.trHcg.height(max - this.trH.height() - s);
                        }
                        else {
                            this.trH.height(max - s);
                        }
                    }
                    if (max > h2) {
                        if (this.hasCg2) {
                            this.trHcg2.height(max - this.trH2.height() - s);
                        }
                        else {
                            this.trH2.height(max - s);
                        }
                    }
                }
            }
        },
        //#endregion

        //#region 同步行高(表体)
        syncRowHeightB: function () {
            var thiz = this;
            if (this.p.lockColumn) {
                var oTrs2 = this.tbody2.find("tr:not(tr[loading])"), oTrs3;
                if (this.p.lockColumnR) {
                    oTrs3 = this.tbody3.find("tr:not(tr[loading])");
                }
                this.tbody.find("tr:not(tr[loading])").each(function (inx) {
                    var tr = $(this);
                    var tr2 = oTrs2.eq(inx);
                    var h1 = tr.height();   //IE9下折很多行时存在不一致问题，待解决
                    var h2 = tr2.height();
                    var max, tr3, h3;
                    if (!thiz.p.lockColumnR) {
                        max = Math.max(h1, h2);
                    }
                    else {
                        tr3 = oTrs3.eq(inx);
                        h3 = tr3.height();
                        max = Math.max(h1, h2, h3);
                        tr3.height(max);
                    }
                    tr.height(max);
                    tr2.height(max);
                });
            }
        },
        //#endregion
        //#endregion

        //#region 计算右上角浮动按钮位置
        countFbtnPos: function () {
            if (this.p.hasFloatBtn && !this.p.borderWidth) {
                var wH = this.headContainer.width(),
                    wHm = this.mainHeadContainer.width(),
                    wHl = this.p.lockColumn ? this.lcHeadContainer.width() : 0,
                    wHr = this.p.lockColumnR ? this.rightHeadContainer.width() : 0,
                    wR = wH - wHm - wHl - wHr - 15,
                    r = wR >= 0 ? wR : 0;
                this.floatBtn.css("right", r);
            }
        },
        //#endregion
        //#endregion

        //#region 设置颜色、动画
        //#region 设置行高亮
        setRowHL: function (tr) {  //注:colorBg属性用于此处
            if (!this.p.isRowHighlight) {
                return;
            }

            var thiz = this;
            tr.unbind("mouseenter").unbind("mouseleave").hover(function () {
                var cpsHl = thiz.p.colorParams.highlight, cfDgj = fj.theme.configDgj;
                var hl = !cpsHl ? cfDgj.highlight : cpsHl;
                if (tr.attr("rownum")) {
                    hl = cfDgj.highlightG;
                }
                if (thiz.hasAnimateHl) {
                    tr.animate({ backgroundColor: hl }, 50, function () {
                        tr.css("background-color", hl);
                    });
                }
                else {
                    tr.css("background-color", hl);
                }
            }, function () {
                var color = tr.attr("spRowColor"), ct;
                if (!color || tr.attr("selected")) {
                    ct = tr.attr("colorT");
                    if (ct) {
                        color = fj.theme.configDgj[ct];
                    }
                    else {
                        color = tr.attr("colorBg");
                    }
                }

                if (thiz.hasAnimateHl) {
                    tr.stop().animate({ backgroundColor: color }, 200, function () {
                        thiz.resumeHL(color, ct, tr);
                    });
                }
                else {
                    thiz.resumeHL(color, ct, tr);
                }
            });
        },

        resumeHL: function (color, ct, tr) {
            if (ct) {
                tr.each(function () {
                    this.style.backgroundColor = "";
                });
            }
            else {
                tr.css("background-color", color);
            }
        },
        //#endregion

        //#region 设置隔行变色
        setRowColor: function (rowNo, trB, trB2, trB3, checked) {
            if (this.p.hasSelectColor && trB.attr("selected")) {   //不设置已经选中的行
                return;
            }

            var cps = this.p.colorParams, color = trB.attr("spRowColor"), sc = cps.selectColor;
            if (rowNo & 1) {  //设置隔行变色
                if (!color && sc) {  //todo 不设置选中行颜色时也应可定制奇偶行颜色
                    color = cps.trColor2;
                }
                if (!color) {
                    trB.swapClassJ("dgj_oddTr dgj_selectedTr", "dgj_evenTr").attr({
                        colorT: "even",
                        colorTY: "even"
                    });
                }
                else {
                    trB.css("background-color", color).attr({
                        colorBg: color,
                        colorBgY: color
                    });
                }

                if (this.p.lockColumn) {
                    if (!color) {
                        trB2.swapClassJ("dgj_oddTr dgj_selectedTr", "dgj_evenTr").attr({
                            colorT: "even",
                            colorTY: "even"
                        });
                    }
                    else {
                        trB2.css("background-color", color).attr({
                            colorBg: color,
                            colorBgY: color
                        });
                    }
                }
                if (this.p.lockColumnR) {
                    if (!color) {
                        trB3.swapClassJ("dgj_oddTr dgj_selectedTr", "dgj_evenTr").attr({
                            colorT: "even",
                            colorTY: "even"
                        });
                    }
                    else {
                        trB3.css("background-color", color).attr({
                            colorBg: color,
                            colorBgY: color
                        });
                    }
                }
            }
            else {
                if (!color && sc) {
                    color = cps.trColor1;
                }
                if (!color) {
                    trB.swapClassJ("dgj_evenTr dgj_selectedTr", "dgj_oddTr").attr({
                        colorT: "odd",
                        colorTY: "odd"
                    });
                }
                else {
                    trB.css("background-color", color).attr({
                        colorBg: color,
                        colorBgY: color
                    });
                }

                if (this.p.lockColumn) {
                    if (!color) {
                        trB2.swapClassJ("dgj_evenTr dgj_selectedTr", "dgj_oddTr").attr({
                            colorT: "odd",
                            colorTY: "odd"
                        });
                    }
                    else {
                        trB2.css("background-color", color).attr({
                            colorBg: color,
                            colorBgY: color
                        });
                    }
                }
                if (this.p.lockColumnR) {
                    if (!color) {
                        trB3.swapClassJ("dgj_evenTr dgj_selectedTr", "dgj_oddTr").attr({
                            colorT: "odd",
                            colorTY: "odd"
                        });
                    }
                    else {
                        trB3.css("background-color", color).attr({
                            colorBg: color,
                            colorBgY: color
                        });
                    }
                }
            }

            if (checked && this.p.hasSelectColor) {
                this.setRowColorSelected(trB, trB2, trB3);
            }
        },
        //#endregion

        //#region 设置分组行隔行变色
        setRowColorG: function (rowNo, trG, checked) {
            if (this.p.hasSelectColor && trG.attr("selected") || trG.attr("spRowColor")) {   //不设置已经选中的行
                return;
            }
            var sc = this.p.colorParams.selectColor;
            if (rowNo & 1) {
                if (this.p.colorParams.groupRow2 && sc) {
                    trG.css("background-color", this.p.colorParams.groupRow2).attr("colorBgY", this.p.colorParams.groupRow2);
                }
                else {
                    trG.removeClass("dgj_oddTrG dgj_selectedTr").addClass("dgj_evenTrG").attr("colorT", "evenG").attr("colorTY", "evenG");
                }
            }
            else {
                if (this.p.colorParams.groupRow && sc) {
                    trG.css("background-color", this.p.colorParams.groupRow).attr("colorBgY", this.p.colorParams.groupRow);
                }
                else {
                    trG.removeClass("dgj_evenTrG dgj_selectedTr").addClass("dgj_oddTrG").attr("colorT", "oddG").attr("colorTY", "oddG");
                }
            }

            if (checked && this.p.hasSelectColor) {
                this.setRowColorSelected(trG);
            }
        },
        //#endregion

        //#region 设置选中颜色
        setRowColorSelected: function (oTr, oTr2, oTr3) {
            var color = this.p.colorParams.selectColor, cg = this.p.colorParams.groupRow;
            oTr.attr("selected", true);
            if (!color && !cg) {
                if (this.p.hasGroup) {
                    oTr.removeClass("dgj_oddTrG dgj_evenTrG");
                }
                oTr.removeClass("dgj_oddTr dgj_evenTr").addClass("dgj_selectedTr").attr("colorT", "selected");
            }
            else {
                oTr.css("background-color", this.p.colorParams.selectColor).attr("colorBg", this.p.colorParams.selectColor);
            }
            if (this.p.lockColumn) {
                oTr2.attr("selected", true);
                if (!color && !cg) {
                    if (this.p.hasGroup) {
                        oTr2.removeClass("dgj_oddTrG dgj_evenTrG");
                    }
                    oTr2.removeClass("dgj_oddTr dgj_evenTr").addClass("dgj_selectedTr").attr("colorT", "selected");
                }
                else {
                    oTr2.css("background-color", this.p.colorParams.selectColor).attr("colorBg", this.p.colorParams.selectColor);
                }
            }
            if (this.p.lockColumnR) {
                oTr3.attr("selected", true);
                if (!color && !cg) {
                    if (this.p.hasGroup) {
                        oTr3.removeClass("dgj_oddTrG dgj_evenTrG");
                    }
                    oTr3.removeClass("dgj_oddTr dgj_evenTr").addClass("dgj_selectedTr").attr("colorT", "selected");
                }
                else {
                    oTr3.css("background-color", this.p.colorParams.selectColor).attr("colorBg", this.p.colorParams.selectColor);
                }
            }
        },
        //#endregion

        //#region 单选前还原选中颜色
        setColorCheckOne: function (tbody, tbody2, tbody3) {  //注:colorBgY属性用于此处
            var oTrS = tbody.find("tr[selected]");
            var colorBgY = oTrS.attr("colorBgY"), sp = oTrS.attr("spRowColor"), colorTY = oTrS.attr("colorTY"), g = this.p.hasGroup ? "G" : "";
            var cty;
            if (colorTY) {
                cty = colorTY.indexOf("G") == -1 ? colorTY : colorTY.substr(0, colorTY.length - 1);
            }
            if (sp) {
                colorBgY = sp;
            }
            if (oTrS.length > 0) {
                oTrS.removeAttr("selected");
                if (colorBgY) {
                    oTrS.css("background-color", colorBgY).attr("colorBg", colorBgY);
                }
                else {
                    if (this.p.hasGroup) {
                        oTrS.removeClass("dgj_oddTrG dgj_evenTrG");
                    }
                    oTrS.removeClass("dgj_selectedTr dgj_oddTr dgj_evenTr").addClass("dgj_" + cty + "Tr" + g).attr("colorT", colorTY);
                }
            }
            if (this.p.lockColumn) {
                var oTrS2 = tbody2.find("tr[selected]");
                if (oTrS2.length > 0) {
                    oTrS2.removeAttr("selected");
                    if (colorBgY) {
                        oTrS2.css("background-color", colorBgY).attr("colorBg", colorBgY);
                    }
                    else {
                        if (this.p.hasGroup) {
                            oTrS2.removeClass("dgj_oddTrG dgj_evenTrG");
                        }
                        oTrS2.removeClass("dgj_selectedTr dgj_oddTr dgj_evenTr").addClass("dgj_" + cty + "Tr" + g).attr("colorT", colorTY);
                    }
                }
            }
            if (this.p.lockColumnR) {
                var oTrS3 = tbody3.find("tr[selected]");
                if (oTrS3.length > 0) {
                    oTrS3.removeAttr("selected");
                    if (colorBgY) {
                        oTrS3.css("background-color", colorBgY).attr("colorBg", colorBgY);
                    }
                    else {
                        if (this.p.hasGroup) {
                            oTrS3.removeClass("dgj_oddTrG dgj_evenTrG");
                        }
                        oTrS3.removeClass("dgj_selectedTr dgj_oddTr dgj_evenTr").addClass("dgj_" + cty + "Tr" + g).attr("colorT", colorTY);
                    }
                }
            }
        },
        //#endregion

        //#region 设置行特殊颜色
        setSpRowColor: function (oTr, oTr2, oTr3) {
            var thiz = this;
            var fn = function (tr) {
                tr.css("background-color", thiz.p.colorParams.spRowColor).attr("spRowColor", thiz.p.colorParams.spRowColor);
            };

            fn(oTr);
            if (this.p.lockColumn) {
                fn(oTr2);
            }
            if (this.p.lockColumnR) {
                fn(oTr3);
            }
        },
        //#endregion

        //#region 折叠动画
        collapseAnimWrap: function (checked, oTrG, oTrsG, cb) {  //由于table中不可以同时设置多行动画,因此添加一个临时的行将要执行动画的行填充进去,动画结束后再还原
            var thiz = this;
            var oTrt, oDiv, h;
            var cs = this.p.columns.length;
            oTrt = $("<tr><td colspan='" + ((this.p.hasChk || this.p.hasChkG) ? cs + 1 : cs) + "' style='padding:0;border-top-width:0;border-right-width:0;border-bottom-width:0;'></td></tr>");
            oDiv = $("<div class='dgj_trTd' style='padding:0;margin:0;'></div>");
            var oTable = $("<table style='margin:" + (!this.p.isTree ? "-1px 0 0 -1px" : "0") + ";'><tbody></tbody></table>");
            oDiv.append(oTable);
            oTable.find("tbody").append(oTrsG);
            oTrt.find("td").append(oDiv);
            oTrG.after(oTrt);

            if (checked) {
                if (FJ.isIElt8) {   //IE7下不支持display:table-row
                    oTrsG.show();
                }
                else {
                    oTrsG.css("display", "table-row");
                }

                this.setMainHeight();  //此处要计算下表格最大高度以供动画有足够展开空间
                h = oDiv.height() - 2;

                oDiv.height(0).animate({
                    height: $.easing.easeOutQuad && this.p.easing ? [h, this.p.easing] : h
                }, this.p.collapseSpeed, function () {
                    oTrG.after(oTrsG);
                    oTrt.remove();

                    FJ.lazyDo(function () {
                        if (!fj.isMobile) {
                            this.setTableWidth();
                        }
                        this.setMainHeight();

                        if (cb) {
                            cb.call(this);
                        }
                    }, 50, "ld_dgjCSR", thiz);
                });
            }
            else {
                h = oDiv.height() - 2;
                oDiv.height(h).animate({
                    height: $.easing.easeOutQuad && this.p.easing ? [0, this.p.easing] : 0
                }, this.p.collapseSpeed, function () {
                    oTrG.after(oTrsG);
                    oTrt.remove();
                    oTrsG.hide();

                    FJ.lazyDo(function () {
                        if (!fj.isMobile) {
                            this.setTableWidth();
                        }
                        this.setMainHeight();

                        if (cb) {
                            cb.call(this);
                        }
                    }, 50, "ld_dgjCSR", thiz);
                });
            }
        },
        //#endregion
        //#endregion

        //#region 复选框操作
        //#region 设置行选中
        setRowSelect: function (tr, rowData) {
            if (!rowData.selected) {
                rowData.selected = true;
                tr.css({
                    backgroundColor: this.p.colorParams.select
                }).attr("colorBgO", tr.attr("colorBg")).attr("colorBg", this.p.colorParams.select);
            }
            else {
                rowData.selected = false;
                tr.css({
                    backgroundColor: tr.attr("colorBgO")
                }).attr("colorBg", tr.attr("colorBgO"));
            }
        },
        //#endregion

        //#region 选中
        check: function (rowNo, rowData, p, chk, pageNo, tbody, tbody2, tbody3) {
            var thiz = this,
                rowData = rowData,
                chk = chk,
                isClick = true,
                oTr,
                oTr2,
                oTr3,
                rowNum,
                isNullTb = !tbody,
                oTbody = tbody,
                oTbody2 = tbody2,
                oTbody3 = tbody3,
                useAnim = false,
                isTg = this.p.isTreeGrid,
                isG = this.p.hasGroup;

            if (isTg) {
                if (FJ.RX.numZ(rowNo)) {  //树结构自动将整数行号转换为节点路径
                    rowNo = rowNo + ".";
                }
            }
            if (!rowData) {  //no
                if (!isTg) {
                    rowData = this.data[rowNo];
                }
                else {
                    rowData = this.seekNode(rowNo);
                }
            }
            else {
                if (!isTg && !isG) {  //常规表格可根据rowData获取数组索引
                    rowNo = $.inArray(rowData, this.data);
                }
            }
            if (!chk) {  //no
                isClick = false;
                if (!isTg) {
                    chk = this.chks[rowNo];
                }
                else {
                    chk = rowData[this.p.nodeChkField];
                }
            }
            if (!p) {
                p = {};
            }
            if (!oTbody) {
                oTbody = this.tbody;
            }
            if (!oTbody2) {
                oTbody2 = this.tbody2;
            }
            if (!oTbody3) {
                oTbody3 = this.tbody3;
            }
            if (isG) {
                rowNum = rowNo + (!pageNo ? "" : ("_" + pageNo));
            }
            if (this.p.hasSelectColor) {  //查找表行对象
                if (!this.oTrsChkAll1) {   //选中单行时
                    var selCol;
                    if (!isG) {
                        if (!isTg) {
                            selCol = "tr:not(tr[loading],tr[emptyRow]):eq(" + rowNo + ")";
                        }
                        else {  //tree结构按照节点路径查找
                            selCol = "tr[path='" + rowNo + "']";
                        }
                    }
                    else {
                        selCol = "tr[rowNum=" + rowNum + "]";
                    }
                    oTr = oTbody.find(selCol);  //yes
                    if (this.p.lockColumn) {
                        oTr2 = oTbody2.find(selCol);  //yes
                    }
                    if (this.p.lockColumnR) {
                        oTr3 = oTbody3.find(selCol);  //yes
                    }
                }
                else {    //点击全选时
                    if (!isG) {
                        if (!isTg) {
                            oTr = this.oTrsChkAll1.eq(rowNo);
                        }
                        else {  //tree结构按照节点路径查找
                            oTr = this.oTrsChkAll1.filter("tr[path='" + rowNo + "']");
                        }
                    }
                    else {
                        oTr = this.oTrsChkAll1.filter("[rowNum=" + rowNum + "]");
                    }
                    if (this.p.lockColumn) {
                        if (!isTg) {
                            oTr2 = this.oTrsChkAll2.eq(rowNo);
                        }
                        else {
                            oTr2 = this.oTrsChkAll2.filter("tr[path='" + rowNo + "']");
                        }
                    }
                    if (this.p.lockColumnR) {
                        if (!isTg) {
                            oTr3 = this.oTrsChkAll3.eq(rowNo);
                        }
                        else {
                            oTr3 = this.oTrsChkAll3.filter("tr[path='" + rowNo + "']");
                        }
                    }
                }
            }

            if (isClick && !p.isAllCheck && chk[0].checked == rowData.checked && !p.isClickRow) { //防止鼠标双击时执行多次选中事件
                return;
            }

            if (rowData) {
                var oTrG, oTrsG;
                if (this.p.collapseSonRow) {   //可折叠分组行
                    oTrG = oTbody.find("tr[rowNum=" + rowNum + "]");  //yes
                    oTrsG = oTbody.find("tr.dgj_trB_" + rowNum);  //yes
                }

                if (rowData.checked) {
                    if (this.p.isCheckOne) {  //由选中改为未选中状态时,将选中对象清除
                        this.selectedItem = null;
                    }

                    if (!isClick) {  //no
                        if (this.p.chkStyle) {
                            chk.sbxj.setChecked(false, null, true);
                        }
                        else {
                            chk[0].checked = false;
                        }
                    }
                    rowData.checked = false;

                    if (this.p.hasSelectColor && oTr) {  //取消选中颜色
                        oTr.removeAttr("selected");
                        if (this.p.lockColumn)
                            oTr2.removeAttr("selected");
                        if (this.p.lockColumnR)
                            oTr3.removeAttr("selected");
                        if (!isG) {  //tree结构行号传0
                            this.setRowColor(!isTg ? rowNo : 0, oTr, oTr2, oTr3);
                        }
                        else {
                            this.setRowColorG(rowNo, oTr);
                        }
                    }

                    if (this.p.collapseSonRow) {  //隐藏分组子行
                        oTrG.removeAttr("collapse");
                        if (this.p.collapseAnimate && !p.isAllCheck) {  //开启折叠动画
                            this.collapseAnimWrap(false, oTrG, oTrsG);
                            useAnim = true;
                        }
                        else {
                            oTrsG.hide();
                        }

                        if (isNullTb) {
                            this.autoLoadlazyRow(null, 200);  //收起时执行延迟加载补齐显示区域  //no2
                        }
                    }
                }
                else {
                    if (this.p.isCheckOne) {  //是否单选  //no
                        if (!this.p.isPageCache) {
                            if (this.p.hasSelectColor) {   //先还原所有行颜色
                                this.setColorCheckOne(this.tbody, this.p.lockColumn ? this.tbody2 : null, this.p.lockColumnR ? this.tbody3 : null);
                            }
                        }
                        else {  //使用分页缓存时计算所有缓存中数据
                            for (var h = 0, l = this.pageCache.length; h < l; h++) {
                                if (this.p.hasSelectColor) {  //先还原所有行颜色
                                    var tbody = this.pageCache[h][2];
                                    var tbody2 = this.pageCache[h][4];
                                    var tbody3 = this.pageCache[h][5];
                                    this.setColorCheckOne(tbody, tbody2, tbody3);
                                }
                            }
                        }

                        if (this.p.collapseSonRow) {   //把已展开的分组行收起
                            var oTrGC = this.table.find("tr[collapse=true]");
                            if (oTrGC.length > 0) {
                                this.table.find("tr.dgj_trB_" + oTrGC.attr("rowNum")).hide();
                                oTrGC.removeAttr("collapse");
                            }
                        }

                        var si = this.selectedItem;
                        if (si) {  //取消正在选中行的选中状态
                            if (this.p.chkStyle) {
                                si.chk.sbxj.setChecked(false, null, true);
                            }
                            else {
                                si.chk[0].checked = false;
                            }
                            si.data.checked = false;
                        }

                        this.selectedItem = {  //单选时记录选中的行
                            chk: chk,
                            data: rowData
                        };
                    }

                    if (!isClick) {  //no
                        if (this.p.chkStyle) {
                            chk.sbxj.setChecked(true, null, true);
                        }
                        else {
                            chk[0].checked = true;
                        }
                    }
                    rowData.checked = true;

                    if (this.p.hasSelectColor && oTr) {  //设置选中颜色
                        this.setRowColorSelected(oTr, oTr2, oTr3);
                    }

                    if (this.p.collapseSonRow) {  //显示分组子行
                        oTrG.attr("collapse", true);
                        if (this.p.collapseAnimate && !p.isAllCheck) {  //开启折叠动画
                            this.collapseAnimWrap(true, oTrG, oTrsG);
                            useAnim = true;
                        }
                        else {
                            if (FJ.isIElt8) {   //IE7下不支持display:table-row
                                oTrsG.show();
                            }
                            else {
                                oTrsG.css("display", "table-row");
                            }
                        }
                    }
                }

                if (this.p.collapseSonRow && isNullTb && !useAnim) {   //折叠分组行后计算主体高度
                    FJ.lazyDo(function () {
                        this.setMainHeight();  //no2
                    }, 50, "ld_dgjCSR", this);
                }

                var lastTr;  //分组行的最后一行
                if (isG) {
                    if (oTrsG && oTrsG.length > 0) {
                        lastTr = oTrsG.eq(oTrsG.length - 1);
                    }
                    else {
                        lastTr = oTrG;
                    }
                }

                //选中事件
                if (!p.isAllCheck) {
                    this.fire("checkedOne", { rowData: rowData, rowNo: rowNo, checked: rowData.checked, pageNo: pageNo, lastTr: lastTr });
                }
            }
        },
        //#endregion

        //#region 全选
        fnChkAll: function (chk, isChecked, setByPageCache) {
            var checked = true;
            if (chk) {  //点击全选复选框
                checked = chk.checked;
            }
            else if (isChecked != null) {  //直接设置
                checked = isChecked;
                if (this.p.chkStyle) {
                    this.sbxjAll.setChecked(checked, null, true);
                }
                else {
                    this.chkAll[0].checked = checked;  //设置表格全选框状态
                }
            }

            var selCol;
            if (this.p.hasSelectColor) {   //有表行选中颜色时为提高效率先获取表行集合
                if (!this.p.hasGroup) {
                    selCol = "tr:not(tr[loading],tr[emptyRow])";
                }
                else {
                    selCol = "tr[rowNum]";
                }
            }

            if (!setByPageCache || !this.p.isPageCache) {  //有分页缓存时,设置所有页
                this.checkAllFn(this.data, this.chks, this.tbody, this.p.lockColumn ? this.tbody2 : null, this.p.lockColumnR ? this.tbody3 : null, selCol, checked);
                this.initTrsChkAll();
            }
            else {  //设置当前页
                for (var i = 0; i < this.pageCache.length; i++) {
                    this.checkAllFn(
                        this.pageCache[i][1],   //表体1
                        this.pageCache[i][3],   //表体2
                        this.pageCache[i][2],   //表体3
                        this.pageCache[i][4],   //数据集
                        this.pageCache[i][5],   //复选框集合
                        selCol,
                        checked);
                }
                this.initTrsChkAll();
            }
        },

        checkAll: function (isChecked, setByPageCache) {  //全选方法(对外)
            this.fnChkAll(null, isChecked, setByPageCache);
        },
        //#endregion

        //#region 设置全选方法
        checkAllFn: function (data, chks, oTbody, oTbody2, oTbody3, selCol, checked) {  //参数:数据集,复选框集合,表体1,表体2,表体3,选择条件
            if (this.p.hasSelectColor) {   //有表行选中颜色时为提高效率先获取表行集合
                this.oTrsChkAll1 = oTbody.find(selCol);
                if (this.p.lockColumn) {
                    this.oTrsChkAll2 = oTbody2.find(selCol);
                }
                if (this.p.lockColumnR) {
                    this.oTrsChkAll3 = oTbody3.find(selCol);
                }
            }

            for (var j = 0, l = chks.length; j < l; j++) {
                var oChk = chks[j];
                if (oChk) {
                    var chked = oChk[0].checked;
                    if (checked ? !chked : chked) {
                        //this.check(i, null, true);
                        var pa = { isAllCheck: true };
                        oChk[0].paramJ = pa;
                        oChk.trigger("click", pa);
                    }
                }
            }

            if (this.p.isLazyLoad) {   //延时加载时如果未加载的列是否选中和全选相关联
                for (var j = 0, l = data.length; j < l; j++) {
                    var d = data[j];
                    if (d) {
                        d.checked = checked;
                    }
                }
            }
        },
        //#endregion

        //#region 初始化表行集合
        initTrsChkAll: function () {
            if (this.p.hasSelectColor) {  //有表行选中颜色时初始化表行集合
                this.oTrsChkAll1 = null;
                if (this.p.lockColumn) {
                    this.oTrsChkAll2 = null;
                }
                if (this.p.lockColumnR) {
                    this.oTrsChkAll3 = null;
                }
            }
        },
        //#endregion

        //#region 设置默认全选
        setDefaultChkAll: function () {
            if (this.p.chkStyle) {
                this.sbxjAll.setChecked(true, null, true);
            }
            else {
                this.chkAll[0].checked = true;
            }
            for (var i = 0, l = this.data.length; i < l; i++) {
                this.data[i].checked = true;
            }
        },
        //#endregion
        //#endregion

        //#region 排序
        //#region 排序
        sort: function (isAsc, colNo, colName, data, rowNoG) {
            var thiz = this;
            if (!data || data.length <= 1) {
                return;
            }

            var isG = this.p.hasGroup;

            //先将数据集合每行标记一个原始索引,供表排序
            for (var i = 0, l = data.length; i < l; i++) {
                data[i].sortNo = i;
            }

            //排序数据集合
            fj.Sort.execute(data, colName, isAsc, this.p.noSortSp);

            //排序复选框集合
            if (!isG && this.p.hasChk) {
                var chksTmp = [];
                for (var i = 0, l = data.length; i < l; i++) {
                    var chk = this.chks[data[i].sortNo];
                    //                    (function(i, chk){   //因为行号要排序所以重新绑定事件
                    //                        chk.unbind("click");
                    //                        if(thiz.p.chkStyle) {  //复选框使用自定义样式
                    //                            chk.click(function (e, p) {
                    //                                e.stopPropagation();
                    //                                var checked = p && (p.isClickRow || p.isAllCheck) ? !this.checked : this.checked;
                    //                                chk.lblChk.css("background-position", "0 " + (checked ? "-14px" : "0"));
                    //                                thiz.check(i, data[i], p, chk, thiz.pageNo);
                    //                            });
                    //                        }
                    //                        else {
                    //                            chk.click(function (e, p) {
                    //                                e.stopPropagation();
                    //                                thiz.check(i, data[i], p, chk, thiz.pageNo);
                    //                            });
                    //                        }
                    //                    })(i, chk);
                    chksTmp.push(chk);
                }
                this.chks.length = 0;
                for (var i = 0, l = chksTmp.length; i < l; i++) {  //填充至原数组中
                    this.chks.push(chksTmp[i]);
                }
            }

            //排序表
            var pNo = this.pageNo != null ? "_" + this.pageNo : "";
            var sel = !isG ? "tr.dgj_tr1:not(tr[loading])" : "tr.dgj_trB_" + rowNoG + pNo;
            var trs = this.tbody.find(sel), trs2, trs3, tr, tr2, tr3;
            if (this.p.lockColumn) {
                trs2 = this.tbody2.find(sel.replace(/dgj_tr1/g, "dgj_tr2"));
            }
            if (this.p.lockColumnR) {
                trs3 = this.tbody3.find(sel.replace(/dgj_tr1/g, "dgj_tr3"));
            }
            //window.dSort = new Date().getTime();
            if (!isG) {
                var fm = document.createDocumentFragment(), fm2, fm3;  //将重排后的行先加到文档碎片中再一次性渲染到表格中,可提高速度
                if (this.p.lockColumn) {
                    fm2 = document.createDocumentFragment();
                }
                if (this.p.lockColumnR) {
                    fm3 = document.createDocumentFragment();
                }
                for (var i = 0, l = data.length; i < l; i++) {
                    var isChk;
                    tr = trs.eq(data[i].sortNo);
                    //this.tbody.append(tr);
                    fm.appendChild(tr[0]);

                    if (this.p.lockColumn) {
                        tr2 = trs2.eq(data[i].sortNo);
                        //this.tbody2.append(tr2);
                        fm2.appendChild(tr2[0]);
                    }
                    if (this.p.lockColumnR) {
                        tr3 = trs3.eq(data[i].sortNo);
                        //this.tbody3.append(tr3);
                        fm3.appendChild(tr3[0]);
                    }

                    //重新设置隔行变色
                    this.setRowColor(i, tr, tr2 ? tr2 : null, tr3 ? tr3 : null);
                }
                this.tbody[0].appendChild(fm);
                if (this.p.lockColumn) {
                    this.tbody2[0].appendChild(fm2);
                }
                if (this.p.lockColumnR) {
                    this.tbody3[0].appendChild(fm3);
                }
            }
            else {
                var trG = this.tbody.find("tr.dgj_trGB_" + rowNoG + pNo);
                var fm = document.createDocumentFragment();
                for (var i = 0, l = data.length; i < l; i++) {
                    var tr = trs.eq(data[i].sortNo);
                    fm.appendChild(tr[0]);

                    //重新设置隔行变色
                    this.setRowColor(i, tr);
                }
                //                for(var i = data.length;i--;){
                //                    var tr = trs.eq(data[i].sortNo);
                //                    trG.after(tr);

                //                    //重新设置隔行变色
                //                    this.setRowColor(i, tr);
                //                }
                fj.Dom.insertAfter(fm, trG[0]);
            }
            //$("#txtTest2").val(new Date().getTime() - window.dSort);
            //#region 重新设置隔行变色(已废弃,待确认后删除)
            //            var trsC2, trsC3;
            //            if (this.p.lockColumn) {
            //                trsC2 = this.tbody2.find("tr:not(tr[loading])");
            //            }
            //            if (this.p.lockColumnR) {
            //                trsC3 = this.tbody3.find("tr:not(tr[loading])");
            //            }
            //            this.tbody.find("tr:not(tr[loading])").each(function(inx){
            //                var oTr = $(this);
            //                thiz.setRowColor(inx, oTr, trsC2 ? trsC2.eq(inx) : null, trsC3 ? trsC3.eq(inx) : null);
            //                
            //                var trs;
            //                if(!thiz.p.hasGroup && thiz.p.lockColumn){
            //                    trs = thiz.gridContainer.find("tr.dgj_trB_" + inx + (!thiz.pageNo ? "" : ("_" + thiz.pageNo)));
            //                }
            //                else{
            //                    trs = oTr;
            //                }
            //                thiz.setRowHL(trs);
            //            });
            //#endregion
        },
        //#endregion

        //#region 树排序
        sortT: function (isAsc, colName, data) {
            var thiz = this;
            if (!data || data.length <= 1) {
                return;
            }

            //排序数据集合
            fj.Sort.execute(data, colName, isAsc, this.p.noSortSp);

            //排序树
            var fm = document.createDocumentFragment(), fm2, fm3, p;  //将重排后的行先加到文档碎片中再一次性渲染到表格中,可提高速度
            if (this.p.lockColumn) {
                fm2 = document.createDocumentFragment();
            }
            if (this.p.lockColumnR) {
                fm3 = document.createDocumentFragment();
            }
            for (var i = 0, l = data.length; i < l; i++) {
                p = data[i][this.p.nodePathField];
                this.tbody.find("tr[path^='" + p + "']").each(function () {
                    fm.appendChild(this);
                });

                if (this.p.lockColumn) {
                    this.tbody2.find("tr[path^='" + p + "']").each(function () {
                        fm2.appendChild(this);
                    });
                }
                if (this.p.lockColumnR) {
                    this.tbody3.find("tr[path^='" + p + "']").each(function () {
                        fm3.appendChild(this);
                    });
                }
            }
            this.tbody[0].appendChild(fm);
            if (this.p.lockColumn) {
                this.tbody2[0].appendChild(fm2);
            }
            if (this.p.lockColumnR) {
                this.tbody3[0].appendChild(fm3);
            }
        },
        //#endregion

        //#region 排序方法
        fnSort: function (i, sortImg, c, isAsc) {
            var src = sortImg.attr("sortAsc"), b;
            if ((isAsc != null && isAsc) || (isAsc == null && (!src || src == "false"))) {
                sortImg.swapClassJ("dgj_sortDesc", "dgj_sortAsc").attr("sortAsc", "true");
                b = true;
            }
            else {
                sortImg.swapClassJ("dgj_sortAsc", "dgj_sortDesc").attr("sortAsc", "false");
                b = false;
            }
            sortImg.css("display", "inline");

            var p = { isAsc: b, colNo: i, col: c, colName: c.dataIndex };
            this.fire("preOnSort", p);
            if (!this.p.isCustomSort) {
                if (this.p.isTreeGrid) {  //树表格
                    this.sortT(b, c.dataIndex, this.data);
                }
                else if (this.p.hasGroup) {  //分组行
                    for (var j = 0, l = this.data.length; j < l; j++) {
                        this.sort(b, i, c.dataIndex, this.data[j][this.p.sonRowName], j);
                    }
                }
                else {  //普通表格
                    this.sort(b, i, c.dataIndex, this.data);
                }
            }
            else {  //自定义排序
                this.fire("onSorting", p);
            }
            this.fire("finOnSort", p);
        },
        //#endregion

        //#region 表格排序
        sortGrid: function (i, isAsc) {
            if (isAsc == null) {
                isAsc = true;
            }
            this.fnSort(i, this.gridContainer.find("img[no='sortImg" + i + "']"), this.p.columns[i], isAsc);
        },
        //#endregion

        //#region 设置点击单元格可排序
        setCellSort: function (i, c, td, tdDiv, isTh) {
            var thiz = this, sortImg = $('<img class="dgj_sortImg" no="sortImg' + i + '" src="' + fj.imgPath + 'Datagrid/treegrid/s.gif" />');
            tdDiv.append(sortImg);
            if (!isTh) {
                tdDiv.addClass("dgj_tdSort");
                td.css("cursor", "pointer");
            }
            td.attr("title", "点击排序").click(function () {  //点击排序
                thiz.hideSortImg();
                if (thiz.p.isLazyLoad) {  //延迟加载时如果排序前没加载完则先全部加载表当前页数据
                    if (!(thiz.lazyRowNo > thiz.data.length - 1)) {
                        if (thiz.useMbj) {
                            MBJ.loading("提示", "正在排序中,请稍候...", function () {
                                var thix = this;
                                setTimeout(function () {
                                    thiz.autoLoadlazyRow(true);
                                    thiz.fnSort(i, sortImg, c);
                                    thix.close();
                                }, 100);
                            });
                            return;
                        }
                        else {
                            thiz.autoLoadlazyRow(true);
                        }
                    }
                }
                if (thiz.p.sortLoading) {
                    if (thiz.useMbj && !thiz.p.evts.beforeSortLoading) {
                        MBJ.loading("提示", "正在排序中,请稍候...", function () {
                            var thix = this;
                            setTimeout(function () {
                                thiz.fnSort(i, sortImg, c);
                                thix.close();
                            }, 100);
                        });
                    }
                    else {
                        thiz.fire("beforeSortLoading");  //排序loading前
                        setTimeout(function () {
                            thiz.fnSort(i, sortImg, c);
                            thiz.fire("afterSortLoading");  //排序loading后
                        }, 100);
                    }
                }
                else {
                    thiz.fnSort(i, sortImg, c);
                }
            });
        },
        //#endregion

        //#region 隐藏排序图标
        hideSortImg: function () {
            this.gridContainer.find("img.dgj_sortImg").removeClass("dgj_sortAsc dgj_sortDesc");
        },
        //#endregion
        //#endregion

        //#region 删除
        remove: function () {
            this.fire("beforeRemove", "DGJ");
            if (this.p.hasFloatBtn) {  //删除菜单
                this.mujFbtn.remove();
            }
            if (this.p.hasRowContextMenu) {
                this.rowCmj.remove();
            }

            this._super();
        },
        //#endregion

        //#region 其他工具方法
        //#region 根据列号获取列类型(为区分冻结列)
        getColType: function (colNo) {
            var colType = 1;
            if (!this.p.lockColumn) {   //无冻结列
                colType = 0;
            }
            else {   //有冻结列
                if (colNo < this.p.lockColumn - 1) {  //冻结列(左)
                    colType = 1;
                }
                else {
                    if (this.p.lockColumnR) {  //右侧有冻结列
                        if (colNo >= this.p.lockColumnR - 1) {  //冻结列(右)
                            colType = 3;
                        }
                        else {
                            colType = 2;
                        }
                    }
                    else {
                        colType = 2;
                    }
                }
            }

            return colType;
        },
        //#endregion

        //#region 获取表列数
        getColNum: function () {
            var cols = 0, cols2, cols3;
            if (!this.p.lockColumn) {
                cols = this.p.columns.length;
            }
            else {
                cols = this.p.lockColumn - 1;
                if (this.p.lockColumn) {
                    cols2 = this.p.columns.length - this.p.lockColumn + 1;
                }
                if (this.p.lockColumnR) {
                    cols3 = this.p.columns.length - this.p.lockColumnR + 1;
                }
            }
            if (this.p.hasChk) {
                cols += 1;
            }

            return [cols, cols2, cols3];
        },
        //#endregion

        //#region 获取非隐藏的总列数
        getColSum: function () {
            var l = 0;
            for (var i = 0, l = this.p.columns.length; i < l; i++) {
                if (!this.p.columns[i].isHide) {
                    l++;
                }
            }
            return l;
        },
        //#endregion

        //#region 获取隐藏列索引
        getHideCols: function () {
            var cols = [];
            for (var i = 0, l = this.p.columns.length; i < l; i++) {
                if (this.p.columns[i].isHide) {
                    cols.push(i);
                }
            }
            return cols;
        },
        //#endregion

        //#region 设置滚动条滚到最上面
        setScrollTop: function () {
            this.bodyContainer.scrollTop(0);
        },
        //#endregion

        //#region 设置滚动条滚到最下面
        setScrollBottom: function () {
            this.bodyContainer.scrollTop(this.bodyContainer[0].scrollHeight);
        },
        //#endregion

        //#region 提示框
        alert: function (msg, title) {
            if (this.useMbj) {
                if (title == null) {
                    title = "提示";
                }
                MBJ.alert(title, msg);
            }
            else {
                alert(msg);
            }
        },
        //#endregion

        //#region 全屏方法
        fnFullScreen: function () {
            if (this.p.canFullScreen && DGJ.onFullScreen) {  //执行全屏事件
                DGJ.onFullScreen.call(this);
                var oTxt = this.btnFs.find("td:eq(1) div"), oTxtC, txt;
                if (this.btnFsCmj) {
                    oTxtC = this.btnFsCmj.find("td:eq(1) div");
                }
                //改变菜单项文字
                if (!this.isFullScreen) {
                    this.isFullScreen = true;
                    txt = "退出全屏";
                }
                else {
                    this.isFullScreen = false;
                    txt = "全屏显示";
                }
                oTxt.text(txt);
                if (this.btnFsCmj) {
                    oTxtC.text(txt);
                }
            }
        },
        //#endregion

        //#region 获取一维数据集合
        getRowsData: function (d) {
            var data, thiz = this;
            if (!d) {
                data = this.data;
            }
            else {
                data = d;
            }

            if (data && data.length > 0 && this.p.hasGroup) {
                var dataR = [];
                var fn = function (data) {
                    for (var i = 0, l = data.length; i < l; i++) {
                        if (data[i] != null && data[i][thiz.p.sonRowName] != null) {
                            for (var j = 0; j < data[i][thiz.p.sonRowName].length; j++) {
                                var obj = data[i][thiz.p.sonRowName][j];
                                for (var o in data[i]) {
                                    if (o != thiz.p.sonRowName) {
                                        obj[o] = data[i][o];
                                    }
                                }
                                dataR.push(obj);
                            }
                        }
                    }
                };

                if (!this.p.isPageCache) {
                    fn(data);
                }
                else {
                    for (var h = 0, m = this.pageCache.length; h < m; h++) {
                        fn(this.pageCache[h][1]);
                    }
                }

                return dataR;
            }
            else {
                return null;
            }
        },
        //#endregion

        //#region 生成行文本数据
        fnTbd: function (tr, txt, split) {
            sp = " ", thiz = this;
            if (split) {  //设置分隔符
                sp = split;
            }

            tr.find("div.dgj_tdDiv:visible").each(function (i) {
                var oDiv = $(this), vD,
                    edit = oDiv.attr("editable"),
                    chkCol = thiz.p.hasChk && i == 0;
                if (!edit) {
                    vD = oDiv.text();
                }
                else {  //单元格可编辑时只取文字
                    vD = oDiv.find("span[editable]").text();
                }
                if (split && vD.indexOf(",") != -1) {  //过滤英文逗号
                    vD = vD.replace(/,/g, thiz.p.csvDot);
                }
                if (!edit) {
                    var inp = oDiv.find("input[type=text]");
                    if (vD !== "" || inp.length > 0) {
                        if (inp.length > 0) {
                            inp.each(function () {
                                var v = inp.val();
                                if (split && v.indexOf(",") != -1) {
                                    v = v.replace(/,/g, thiz.p.csvDot);
                                }
                                vD += " " + v;
                            });
                            //vD = vD.substr(1);
                        }
                        txt += sp + vD;
                    }
                    else {
                        if (!chkCol) {
                            txt += sp + " ";
                        }
                    }
                }
                else {
                    if (vD !== "") {
                        txt += sp + vD;
                    }
                    else {
                        if (!chkCol) {
                            txt += sp + " ";
                        }
                    }
                }
            });

            if (txt.indexOf(this.nbspJ) != -1) {  //过滤&nbsp;
                var reg = fj.execJS("/" + this.nbspJ + "/ig");
                txt = txt.replace(reg, " ");
            }
            return txt;
        },

        fnTbdQ: function (d, txt, split) {
            sp = " ", thiz = this;
            if (split) {  //设置分隔符
                sp = split;
            }

            var ec = this.p.exportCol;
            if (ec) {  //如果有导出列集合，则按其顺序生成文本
                for (var i = 0, l = ec.length; i < l; i++) {
                    txt = this.fnTbdR(d[ec[i]] + "", txt, split, sp);
                }
            }
            else {
                for (var o in d) {
                    txt = this.fnTbdR(d[o] + "", txt, split, sp);
                }
            }

            if (txt.indexOf(this.nbspJ) != -1) {  //过滤&nbsp;
                var reg = fj.execJS("/" + this.nbspJ + "/ig");
                txt = txt.replace(reg, " ");
            }
            return txt;
        },

        fnTbdR: function (vD, txt, split, sp) {
            if (split && vD.indexOf(",") != -1) {
                vD = vD.replace(/,/g, thiz.p.csvDot);
            }
            if (vD.indexOf("\r\n") != -1) {  //去除换行符
                vD = vD.replace(/\r\n/g, "");
            }
            if (vD !== "") {
                txt += sp + vD;
            }
            else {
                txt += sp + " ";
            }
            return txt;
        },
        //#endregion

        //#region 生成表文本数据
        getGridText: function (isAll) {
            var thiz = this,
                txtAll = "",
                sel,
                spT,
                ec = this.exportCol,
                fTr = this.p.filterTag ? ",tr[" + this.p.filterTag + "]" : "";

            if (isAll && !thiz.p.isTree) {  //生成列头,单列树不导出列头
                for (var i = 0, l = thiz.p.columns.length; i < l; i++) {
                    var col = thiz.p.columns[i];
                    if (!col.isHide && (!ec || ec[col.dataIndex])) {
                        txtAll += "," + col.text;
                    }
                }
                txtAll = txtAll.substr(1) + "\n";
            }

            if (thiz.p.isTreeGrid) {  //设置树深度标志
                spT = "    ";
                if (thiz.p.isTree) {
                    spT = ",";
                }
            }

            if (!thiz.p.hasGroup) {
                if (!this.p.quickRenderMode) {
                    sel = "tr:not(tr[loading],tr[groupRow],tr[emptyRow]" + fTr + "):visible";
                    thiz.tbody.find(sel).each(function (i) {  //遍历选中的表行记录
                        var oTr = $(this);
                        if (isAll || ((!thiz.p.isTreeGrid && oTr.find("td[chkCell] input:checked").length > 0) || oTr.attr("pasteRow"))) {
                            var txt = "";
                            txt = thiz.fnTbd(oTr, txt, isAll ? "," : null);
                            if (thiz.p.lockColumn) {
                                txt = thiz.fnTbd(thiz.tbody2.find(sel + ":eq(" + i + ")"), txt, isAll ? "," : null);
                            }
                            if (thiz.p.lockColumnR) {
                                txt = thiz.fnTbd(thiz.tbody3.find(sel + ":eq(" + i + ")"), txt, isAll ? "," : null);
                            }
                            txt = txt.substr(1);

                            if (isAll && thiz.p.isTreeGrid) {  //加入树深度标志
                                var deep = parseInt(oTr.attr("deep"), 10);
                                for (var i = 0; i < deep; i++) {
                                    txt = spT + txt;
                                }
                            }
                            txtAll += txt + "\n";
                        }
                    });
                }
                else {  //高速渲染模式下直接从data集合中取数据
                    var data = this.data;
                    for (var i = 0, l = data.length; i < l; i++) {
                        var txt = "";
                        txt = thiz.fnTbdQ(data[i], txt, isAll ? "," : null);
                        txt = txt.substr(1);
                        txtAll += txt + "\n";
                    }
                }
            }
            else {
                sel = "tr:not(tr[loading],tr[emptyRow],tr[rowno]" + fTr + ")";
                thiz.tbody.find(sel).each(function (i) {  //遍历选中的表行记录
                    var oTr = $(this);
                    if (isAll || (oTr.find("td[chkCellG] input:checked").length > 0 || oTr.attr("pasteRowG"))) {
                        var txt = "";
                        txt = thiz.fnTbd(oTr, txt, isAll ? "," : null);
                        txt = txt.substr(1);
                        txtAll += txt + "\n";
                        thiz.tbody.find("tr.dgj_trB_" + oTr.attr("rownum")).each(function () {  //取每组数据
                            var txt2 = "";
                            var oTr2 = $(this);
                            txt2 = thiz.fnTbd(oTr2, txt2, isAll ? "," : null);
                            txt2 = txt2.substr(1);
                            txtAll += txt2 + "\n";
                        });
                    }
                });
            }
            return txtAll;
        },
        //#endregion

        //#region 是否有复选框被选中
        hasChecked: function () {
            var d = !this.p.isPageCache ? this.data : this.datas;
            for (var i = 0, l = d.length; i < l; i++) {
                var r = d[i];
                if (r.checked) {
                    return true;
                }
            }
            return false;
        },
        //#endregion

        //#region 获取延时加载行行号
        getRowNoL: function () {
            var rowNoL;
            if (!this.p.compatibleMode) {  //如果删除行时同时减小了延时加载行号,添加的新行号应加上减小的值
                rowNoL = this.lazyRowNo + (this.data.lengthC - this.data.length);
            }
            else {
                rowNoL = this.lazyRowNo;
            }
            return rowNoL;
        }
        //#endregion
        //#endregion
    });

    //#region 预加载图片
    FJ.Image.preLoad(FJ.imgPath + "Pagination/refresh.gif");
    //#endregion

    //#region 绑定到jquery
    $.fn.extend({
        DatagridJ: function (settings) {
            if (this && this.length > 0) {
                return new FJ.DatagridJ(this, fj.DGJ_commonConfig ? $.extend(true, fj.clone(fj.DGJ_commonConfig), settings) : settings);
            }
        },
        DGJ: function (settings) {
            return $(this).DatagridJ(settings);
        }
    });
    //#endregion

});