//JavaScript Document by wondger[at]gmail[dot]com
(function(){
    var S = function(selector,context){
        return new SL(selector,context);
    };
    var doc = document,win = window;
    var SL = function(selector,context){
        this.eles = SL.fn.query(selector,context);
        this.length = this.eles.length;
    };
    SL.prototype = {
        size:function(){
            return this.length; 
        },
        each:function(fn){
            if(fn.constructor == Function){
                var i = 0;
                while(this.eles[i]){
                    //set current element as this,and the index as the first default param
                    fn.call(this.eles[i],i);
                    ++i;
                }
            }
            return this;
        },
        on:function(evt,fn){
            this.each(function(i){
                alert(SL.fn.addEvent.toString());
                SL.fn.addEvent(this,evt,fn,i);
            })
        }
    };
    /*
     * @private{should}
     * @static
     * @description 提供基本功能函数
     * @Obeject
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
                    return doc.querySelectorAll(selector);
                };
                return doc.querySelectorAll(selector);
            }
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
                ele.addEventListener(evt,function(){fn.call(ele,index)},false);
                this.addEvent = function(ele,evt,fn,index){
                    ele.addEventListener(evt,function(){fn.call(ele,index)},false);
                };
                return;
            }else if(ele.attachEvent){
                ele.attachEvent('on'+evt,function(){fn.call(ele,index)},false);
                this.addEvent = function(ele,evt,fn,index){
                    ele.attachEvent(evt,function(){fn.call(ele,index)},false);
                };
                return;
            }
        }
    }
    window.S = window.SL = S;
})();
