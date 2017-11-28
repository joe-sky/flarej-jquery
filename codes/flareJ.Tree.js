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
* last update:2015-6-12
***********************************************************/

/*----------------------------------------------*
* flareJ.Tree
*-------*-------*-------*-------*-------*-------*
* 树控件
*-------*-------*-------*-------*-------*-------*
* [依赖]flareJ.Datagrid
*----------------------------------------------*/
FJ.define("widget.Tree", ["widget.Datagrid"], function() {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                           树控件
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.TreeJ = this.TJ = FJ.TreeJ = FJ.TJ = FJ.DGJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            this.nodeConfig = $.extend(true, {  //树节点模板
                isTreeField: true,
                text: "treeField",
                dataIndex: 'id'
                //align: "center",
                //width: 100,
                //minWidth: 50, 
                //maxWidth: 200,
                //renderFn: function(v,d,i) {}
            }, settings.nodeConfig);
            delete settings.nodeConfig;

            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "TJ",
                renderTo: elemObj,
                width: 200,
                height: "100%",
                defaultH: 20,
                isTree: true,
                isTreeGrid: true,
                treeLocalLazy: true,
                asyncLoadTree: true,
                treeUrl: "",
                isReservedSbjH: false,
                isRowHighlight: fj.isMobile ? false : true,
                hasFloatBtn: false,
                canColumeDD: false,
                canSelectRow: true,
                canSelectRowR: false,
                hasSelectColor: true,
                collapseAnimate: true,             //是否使用折叠动画
                hasRowContextMenu: true,
                canFullScreen: false,
                canRefreshPage: false,
                hasChk: true,
                isCheckOne: true,
                csvFileName: "导出树数据",         //导出csv默认文件名
                nodeWrap: false,                   //树节点文字是否折行
                columns: [this.nodeConfig],        //树节点模板
                evts: {
                    beforeTreeLoad: null,          //树加载前事件
                    treeLoad: null,                 //树加载事件
                    cilckNode: null                //点击节点
                }
            }, settings));

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            this._super();
        },
        //#endregion

        //#region 构建
        create: function () {
            this._super();

            //外层
            this.divOut.attr("id", "TJ_" + this.objId).addClass("tj");
        }
        //#endregion
    });

    //#region 绑定到jquery
    $.fn.extend({
        TreeJ: function (settings) {
            if(this && this.length > 0) {
                return new FJ.TreeJ(this, fj.TJ_commonConfig ? $.extend(true, fj.clone(fj.TJ_commonConfig), settings) : settings);
            }
        },
        TJ: function (settings) {
            return $(this).TreeJ(settings);
        }
    });
    //#endregion

});