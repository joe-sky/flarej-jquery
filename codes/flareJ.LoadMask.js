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
* last update:2015-8-4
***********************************************************/

/*----------------------------------------------*
* flareJ.LoadMask
*-------*-------*-------*-------*-------*-------*
* 加载层
*-------*-------*-------*-------*-------*-------*
* 
*----------------------------------------------*/
FJ.define("widget.LoadMask", function() {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                         加载层
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.LoadMaskJ = this.LMJ = FJ.LoadMaskJ = FJ.LMJ = FJ.CJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "LMJ",
                renderTo: elemObj,                        //要加载到的容器
                renderType: "prepend",
                imgSrc: LMJ.loadImgSrc(11),               //loading图片路径
                isCover: true,                            //是否遮盖
                width: "100%",                           //最大宽度
                height: "100%",                          //最大高度
                borderWidth: 0,
                zIndex: 1,                                //z轴位置
                colorParams: {
                    bgColor: "transparent"                //背景色
                }
            }, settings));

            this.initFn();

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            this._super();
            this.create();
        },
        //#endregion

        //#region 构建
        create: function () {
            this._super();
            var thiz = this;

            //外层
            this.divOut.addClass("lmj").attr("id", "LMJ_" + this.objId);

            //构建loading层
            this.createLoading();

            return this;
        },
        //#endregion

        //#region 构建loading层
        createLoading: function () {
            //loading半透明层
            this.loadH1 = $('<div class="lmj_loadH1"></div>');
            this.loadH2 = $('<div class="lmj_loadH2"><div style="width:100%;height:100%;" class="cj_divCvFd1"><div class="cj_divCvFd2"><img class="cj_divCvFd3" src="' + this.p.imgSrc + '" /></div></div></div>');
            this.loading = $('<div></div>').append(this.loadH1).append(this.loadH2);

            //是否遮盖
            if(!this.p.isCover) {
                this.loadH1.hide();
                this.loadH2.css("position", "static");
            }

            //加载
            this.divOut.append(this.loading).css({ zIndex: this.p.zIndex });
        },
        //#endregion

        //#region 显示
        show: function (zInx) {
            this.divOut.show();

            return this;
        },
        //#endregion

        //#region 隐藏
        hide: function (isRebuild) {
            this.divOut.hide();

            return this;
        }
        //#endregion
    });

    //#region 获取加载图标标签

    //获取图标路径
    FJ.LMJ.loadImgSrc = function(n) {
        return LMJ.imgSrc + 'loading' + n + '.gif';
    };

    //预加载图片
    FJ.LMJ.preLoadImg = function(n) {
        FJ.Image.preLoad(LMJ.loadImgSrc(n));
    };

    //获取图标标签
    FJ.LMJ.getLoadImg = function(n, isHtml) {
        var img = '<img src="' + LMJ.loadImgSrc(n) + '" />';
        if(!isHtml) {  //是否只返回文本
            return $(img);
        }
        else {
            return img;
        }
    };

    //#endregion

    //#region 绑定到jquery
    $.fn.extend({
        LoadMaskJ: function (settings) {
            if(this && this.length > 0) {
                return new FJ.LoadMaskJ(this, fj.LMJ_commonConfig ? $.extend(true, fj.clone(fj.LMJ_commonConfig), settings) : settings);
            }
        },
        LMJ: function (settings) {
            return $(this).LoadMaskJ(settings);
        }
    });
    //#endregion

    //#region 图片文件夹路径
    FJ.LMJ.imgSrc = FJ.imgPath + "LoadMask/";
    //#endregion
});