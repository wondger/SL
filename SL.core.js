//JavaScript Document by wondger[at]gmail[dot]com
(function(){
    var S = function(selector,context){
        //return SO(SL Object)
        return new SL(selector,context);
    };
    var doc = document,win = window;
    var SL = function(selector,context){
        this.eles = SL.fn.query(selector,context);
        this.length = this.eles.length;
    };
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
        }
    };
    /*
     * @private{should}
     * @static
     * @description 提供基本功能函数
     * @Object
     * @note 对象成员方法不要使用this，避免外部调用使用apply、call该写this
     * @note 切勿添加不必要的功能函数，该处的函数设计的初衷都是为原型方法调用，能在原型方法中实现尽量在原型方法中实现
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
        },
        each:function(eles,fn){
            if(fn.constructor == Function){
                var i = 0;
                while(eles[i]){
                    //set current element as this,and the index as the first default param
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
                return;
            }else if(ele.attachEvent){
                ele.attachEvent('on'+evt,function(){fn.call(S(ele),index)},false);
                SL.fn.addEvent = function(ele,evt,fn,index){
                    ele.attachEvent(evt,function(){fn.call(S(ele),index)},false);
                };
                return;
            }
        },
        addClass:function(ele,cls){
            if(ele.className.indexOf(cls)>=0) return;
            else ele.className += (ele.className ? ' '+cls : cls);
            return;
        },
        replaceClass:function(ele,oldCls,newCls){
            var reCls = new RegExp('^\\s|\\b'+oldCls+'\\b|\\s$','g');
            ele.className = ele.className.replace(reCls,newCls);
            return;
        },
        toggleClass:function(ele,cls){
            return;
        }
    }
    window.S = window.SL = S;
})();
