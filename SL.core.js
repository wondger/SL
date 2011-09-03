//JavaScript Document by wondger[at]gmail[dot]com
(function(){
    var doc = document,
        win = window;
    var S = function(selector,context){
        //return SO(SL Object)
        return new SL(selector,context);
    };
    var SL = function(selector,context){
        this.eles = SL.fn.query(selector,context);
        this.length = this.eles.length;
        SL.fn.add(this,this.eles,0);
    };
    /*
     * @note:原型方法尽量只进行对基本功能函数的简单调用
     *       逻辑处理皆放在基本功能函数中实现
     *       原型方法尽可能返回this供链式调用
     */
    SL.prototype = {
        get:function(i){
            return this.eles[i];
        },
        size:function(){
            return this.length; 
        },
        each:function(fn){
            SL.fn.each(this.eles,fn);
            return this;
        },
        on:function(evt,fn){
            this.each(function(i){
                SL.fn.addEvent(this.get(0),evt,fn,i);
            });
            return this;
        },
        addClass:function(cls){
            this.each(function(){
                SL.fn.addClass(this.get(0),cls);
            });
            return this;
        },
        removeClass:function(cls){
            this.each(function(){
                SL.fn.replaceClass(this.get(0),cls,'');
            });
            return this;
        },
        replaceClass:function(oldCls,newCls){
            this.each(function(){
                SL.fn.replaceClass(this.get(0),oldCls,newCls);
            });
            return this;
        },
        toggleClass:function(cls){
            this.each(function(){
                var ele = this.get(0);
                if(ele.className.indexOf(cls)>=0) SL.fn.replaceClass(ele,cls,'');
                else SL.fn.addClass(ele,cls);
            });
            return this;
        },
        show:function(){
            return this;
        },
        hide:function(){
            this.each(function(){
                this.get(0).style.display = 'none';
            });
            return this;
        },
        
    };
    /*
     * @private
     * @static
     * @description 提供不对外部开放的基本功能函数
     * @Object
     * @note 对象成员方法不要使用this，避免外部调用使用apply、call改写this
     * @note 切勿添加不必要的功能函数，该处的函数设计的初衷都是为原型方法调用，能在原型方法中实现尽量在原型方法中实现
     * @note 添加功能函数原则：
     *          1.可能在不同的原型方法中多次调用，如：replaceClass
     *          2.实现复杂，分离到功能函数便于维护，如：query
     *          3.功能函数需要使用到S构造器，如：each,addEvent
     *          4.可能在其他功能函数中调用
     */
    SL.fn = {
        /*
         * @function
         * @description 元素选择器
         * @param selector DOMElement|String
         * @param context DOMElement|String
         */
        query:function(selector,context){
            var type,eles,selector;
            if(doc.querySelectorAll){
                /*
                 * uncaught exception
                 * query = doc.querySelectorAll;
                 */
                this.query = function(selector,context){
                    if(typeof(selector)=='object') return [selector];
                    return doc.querySelectorAll(selector);
                };
                return doc.querySelectorAll(selector);
            }
            //暂时只针对实现了querySelectAll的浏览器，后续尝试实现选择器或引入sizzle
            type = selector.indexOf('#')==0 ? 'ID' (selector.indexOf('.')==0 ? 'CLASS' : 'TAG') : 'TAG';
            eles = [];
            selector = selector.replace(/^[#\.]/,'');
            switch(type){
                case 'ID':
                    return [doc.getElementById(selector)];
                case 'CLASS':
                    //
                    return doc.getElementByClassName(selector);
                case 'TAG':
                default:
                    return doc.getElementsByTagName(selector);
            }
            return eles;
        },
        /*
         * @description 将from中的元素/属性追加到to(Object)中
         */
        add:function(to,from,start){
            if(!S.isObject(to) || (!S.isObject(from)&&!S.isArray(from))) return;
            var i = (S.isNumber(start) && start<to.length) ? start : (to.length ? 0 : to.length),
                j = 0;
            if(S.isObject(from)){
                while(from[j]) to[i++] = from[j++];
            }else if(S.isArray(from)){
                for(var l=from.length;j<l;j++){
                    to[i++] = from[j];
                }
            }
            return to;
        },
        each:function(eles,fn){
            if(eles && fn.constructor == Function){
                var i = 0;
                while(eles[i]){
                    //set current element as this,and the index as the first default param
                    //note:是否需要将this指向一个SO对象，还是仅指向ele
                    //     指向SO对象后，定义原型方法时都需要使用get(0)
                    fn.call(S(eles[i]),i);
                    ++i;
                }
            }
        },
        /*
         * @function
         * @description 事件添加
         * @param ele DOMElement
         * @param evt Event
         * @param fn handle
         * @param index the order in collection
         */
        addEvent:function(ele,evt,fn,index){
            if(ele.addEventListener){
                //set SO as this
                ele.addEventListener(evt,function(){fn.call(S(ele),index)},false);
                SL.fn.addEvent = function(ele,evt,fn,index){
                    ele.addEventListener(evt,function(){fn.call(S(ele),index)},false);
                };
            }else if(ele.attachEvent){
                ele.attachEvent('on'+evt,function(){fn.call(S(ele),index)},false);
                SL.fn.addEvent = function(ele,evt,fn,index){
                    ele.attachEvent('on'+evt,function(){fn.call(S(ele),index)},false);
                };
            }
        },
        addClass:function(ele,cls){
            if(ele.className.indexOf(cls)>=0) return;
            else ele.className += (ele.className && /\s$/.test(ele.className) ? cls : ' '+cls);
        },
        replaceClass:function(ele,oldCls,newCls){
            var reCls = new RegExp('^|\\b'+oldCls+'\\b|$','g');
            ele.className = ele.className.replace(reCls,newCls);
        }
    };
    /*
     * @description 核心的功能函数
     */
    SL.core = {
        /*
         * @note: 会覆盖掉同名属性/方法
         * @note: 与SL.fn.add方法有点重复，考虑优化
         */
        mix:function(r,s){
            if(!r||!s) return;
            for(var i in s){
                r[i] = s[i];
            }
        }
    };
    /*
     * @description 对外开放静态方法，通过SL.core.mix拷贝到S对象
     *              如类型判断type
     */
    SL.lang = {
        mix:SL.core.mix,
        type:function(obj){
            if(typeof obj == 'string') return 'string';
            if(typeof obj == 'boolean') return 'boolean';
            if(typeof obj == 'function') return 'function';
            // typeof NaN Number
            if(isNaN(obj)) return 'NaN';
            if(typeof obj == 'number') return 'number';
            if(obj.constructor == Array) return 'array';
            if(obj.constructor == Object) return 'object';
            switch(obj){
                case null:
                    return 'null';
                case undefined:
                    return 'undefined';
                default:
                    return obj;
            }
        },
        isString:function(obj){
            return SL.lang.type(obj) === 'string';
        },
        isBoolean:function(obj){
            return SL.lang.type(obj) === 'boolean';
        },
        isFunction:function(obj){
            return SL.lang.type(obj) === 'function';
        },
        isNumber:function(obj){
            return SL.lang.type(obj) === 'number';
        },
        isArray:function(obj){
            return SL.lang.type(obj) === 'array';
        },
        isObject:function(obj){
            return SL.lang.type(obj) === 'object';
        },
        isNull:function(obj){
            return SL.lang.type(obj) === 'null';
        },
        isUndefined:function(obj){
            return SL.lang.type(obj) === 'undefined';
        },
        isNaN:function(obj){
            return SL.lang.type(obj) === 'NaN';
        }
    };
    SL.core.mix(S,SL.lang);
    window.S = window.SL = S;
})();
