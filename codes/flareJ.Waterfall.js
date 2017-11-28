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
* flareJ.Waterfall
*-------*-------*-------*-------*-------*-------*
* 瀑布流控件
*-------*-------*-------*-------*-------*-------*
* 
*----------------------------------------------*/
FJ.define("widget.Waterfall", function() {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                         瀑布流控件
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 参考自fzxa<nonb.cn>写的瀑布流逻辑
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.WaterfallJ = this.WFJ = FJ.WaterfallJ = FJ.WFJ = FJ.CJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "WFJ",
                renderTo: elemObj,          //要加载到的容器
                renderType: "prepend",      //渲染方式
                width: 960,                //容器最大宽度
                height: "auto",            //容器最大高度
                borderWidth: 0,             //边框宽度
                isOnLoading: false,         //是否正在加载中
                colWidth: 240,              //每行列宽
                colCount: 4,                //每行列数
                maxCount: null,             //最大项数
                itemCls: "wfj_item",        //项类名
                initItems: [],              //初始化项集合
                itemWidth: 225,             //项宽度
                colHeight: [],              //累计列高
                initDelay: 100,             //初始化延迟时间
                loadDelay: 100,             //每次加载延迟时间
                scrollDelay: 300,           //每次滚动到底延迟时间
                addItemDelay: 100,          //加载项延迟时间
                addItemSpeed: "normal",     //加载项动画速度,可为毫秒数
                bottomRange: 80,            //加载时滚动条离底部距离
                colorParams: {
                    bgColor: "transparent"  //背景色
                },
                evts: {
                    scrollBottom: null      //滚动条到底部事件
                    /*scrollBottom: function(e, p) {
                        this.addItems(items);
                    }*/
                }
            }, settings));

            this.initFn();

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            this._super();

            //项模板
            this.itemModel = $('<div class="' + this.p.itemCls + '"></div>').width(this.p.itemWidth);

            //项集合
            this.items = [];

            //是否初始化完成
            this.isInitComplete = false;

            this.create();
            this.bindScrollEvent();
        },
        //#endregion

        //#region 构建
        create: function () {
            this._super();
            var thiz = this;

            //外层
            this.divOut.addClass("wfj").attr("id", "WFJ_" + this.objId).show();
            if(this.p.style != null) {
                this.divOut.attr("style", this.p.style);
            }

            this.container = $("<div class='wfj_container'></div>");
            this.loading = $('<div id="loading" style="text-align: center;visibility:hidden;"><img src="' + FJ.imgPath + 'LoadMask/loading1.gif" alt="加载中" /></div>');
            this.divOut.append(this.container).append(this.loading);

            //初始化加载项
            this.initItems();

            return this;
        },
        //#endregion

        //#region 初始化加载项
        initItems: function(){
            var thiz = this;

            //填入初始化数据
            for(var i = 0;i < this.p.initItems.length;i++) {
                this.items[i] = this.createItem(this.p.initItems[i]).attr("style", "visibility:hidden;opacity:0;filter:alpha(opacity=0);");
            }

            var col = thiz.p.colHeight;
			for(var i = 0; i < this.p.colCount; i++){
				col[i] = 0;  //初始化列高
			}

            //加载初始项
            var i = 0;
            setTimeout(function(){
                if(i == thiz.items.length) {
                    thiz.isInitComplete = true;
                    thiz.fire("initComplete");  //初始化加载项完毕事件
                    return;
                }
                else{
                    thiz.addItem(thiz.items[i]);
                }

                i++;
                setTimeout(arguments.callee, 0);
            }, this.p.initDelay);
        },
        //#endregion

        //#region 添加项
        addItem: function(item){
            this.container.append(item);
            var ming = this.getMinColInx(this.p.colHeight);
            item.css("left", ming * this.p.colWidth);
            item.css("top", this.p.colHeight[ming]);
			this.p.colHeight[ming] += item.height() + parseFloat(item.css("margin-bottom")) + parseFloat(item.css("padding-bottom"));
			this.container.height(this.getMaxCol(this.p.colHeight));
            item.css('visibility','visible').animate({opacity:1}, this.p.addItemSpeed);
        },
        //#endregion

        //#region 添加多项
        addItems: function(items){
            var thiz = this;

            var k = 0;
            (function(){
                if(k == items.length) {
                    thiz.p.isOnLoading = false;
                    thiz.loading.css("visibility", "hidden");
                    thiz.fire("afterAddItems");  //加载项完毕事件
                    return;
                }
                else{
                    var item = thiz.createItem(items[k]).attr("style", "visibility:hidden;opacity:0;filter:alpha(opacity=0);");
                    thiz.items[thiz.items.length] = item;
                    thiz.addItem(item);

                    if(thiz.p.maxCount && thiz.items.length >= thiz.p.maxCount) {
                        thiz.p.isOnLoading = true;
                        thiz.loading.css("visibility", "hidden");
                        thiz.fire("afterAddItems");  //加载项完毕事件
                        thiz.fire("addItemsLimit");  //加载项到达极限事件
                        return;
                    }
                }

                k++;
                setTimeout(arguments.callee, thiz.p.addItemDelay);
            })();
        },
        //#endregion

        //#region 构建项
        createItem: function(elem){
            return this.itemModel.clone().append(elem);
        },
        //#endregion

        //#region 绑定滚动条事件
        bindScrollEvent:function(){
			var thiz = this;

			$(window).bind("scroll", function(){
				fj.lazyDo(function() {
                    if(this.isInitComplete) {  //未初始化完成则不执行滚动到底部加载
                        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				        var oHeight = document.documentElement.clientHeight;

                        if(scrollTop + oHeight > document.documentElement.scrollHeight - this.p.bottomRange){
						    if(!this.p.isOnLoading){
							    this.p.isOnLoading = true;  //此处记录加载中标记,确保正在加载中时不会执行加载
                                this.loading.css("visibility", "visible");
							
                                //执行滚动条到底部事件
                                setTimeout(function() {
                                    thiz.fire("scrollBottom");
                                }, this.p.loadDelay);
						    }
                        }
                    }
                }, thiz.p.scrollDelay, "ld_wfjSc", thiz);
			});
		},
        //#endregion

        //#region 获取最大列高
		getMaxCol:function(arr){
			var temp = arr[0];
			for(var i = 1;i < arr.length;i++){
				if(temp < arr[i]){
					temp = arr[i];
				}
			}
			return temp;
		},
        //#endregion
		
        //#region 获取最小列高索引
		getMinColInx:function(arr){
			var temp = arr[0], minc = 0;
			for(var i = 0; i < arr.length; i++){
				if(temp > arr[i]){
					temp = arr[i];
					minc = i;
				}
			}
			return minc;
		}
        //#endregion
    });

    //#region 绑定到jquery
    $.fn.extend({
        WaterfallJ: function (settings) {
            if(this && this.length > 0) {
                return new FJ.WaterfallJ(this, settings);
            }
        },
        WFJ: function (settings) {
            return $(this).WaterfallJ(settings);
        }
    });
    //#endregion

    //#region 加载css
    FJ.CSS.create("WaterfallJStyle", FJ.cssPath + "flareJ.Waterfall.css");
    //#endregion

});