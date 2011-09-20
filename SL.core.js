//JavaScript Document by wondger[at]gmail[dot]com
(function(){
    var doc = document,
        win = window;
    var S = function(selector,context){
        //return SO(SL Object)
        return new SL(selector,context);
    };
    var SL = function(selector,context){
        this.__eles__ = SL.fn.query(selector,context);
        this.length = this.__eles__.length;
        SL.fn.add(this,this.__eles__,0);
    };
    /*
     * @note 原型方法尽量只进行对基本功能函数的简单调用
     *       逻辑处理皆放在基本功能函数中实现
     *       原型方法尽可能返回this供链式调用
     * @note 无参方法可传递索引以对选择列表进行过滤，如：show()、hide()、toggle()
     * @note 参数类型多元化，如：attr()、data()、css()
     */
    SL.prototype = {
        /*
         * @description get DOMElement by index
         * 内部获取皆用此方法
         */
        get:function(i){
            return this.__eles__[i];
        },
        /*
         * @description get SO by index
         */
        item:function(i){
            return S(this.get(i));
        },
        size:function(){
            return this.__eles__.length; 
        },
        add:function(selector,context){
            var __eles__ = SL.fn.query(selector,context);
            SL.fn.add(this.__eles__,__eles__);
            SL.fn.add(this,__eles__);
            return this;
        },
        /*
         * @note 默认将当前元素(封装为SO(出于性能考虑，舍弃此写法))作为第一个参数传递
         */
        each:function(fn){
            S.each(this.__eles__,fn);
            return this;
        },
        on:function(evt,fn){
            this.each(function(i){
                SL.fn.addEvent(this,evt,fn,i);
            });
            return this;
        },
        addClass:function(cls){
            this.each(function(){
                SL.fn.addClass(this,cls);
            });
            return this;
        },
        removeClass:function(cls){
            this.each(function(){
                SL.fn.replaceClass(this,cls,'');
            });
            return this;
        },
        replaceClass:function(oldCls,newCls){
            this.each(function(){
                SL.fn.replaceClass(this,oldCls,newCls);
            });
            return this;
        },
        toggleClass:function(cls){
            this.each(function(){
                if(this.className.indexOf(cls)>=0) SL.fn.replaceClass(this,cls,'');
                else SL.fn.addClass(this,cls);
            });
            return this;
        },
        attr:function(name,value){
            return this;
        },
        /*
         * @note data值存储在什么地方
         *       如何索引每个对象的data
         */
        data:function(name,value){
            var ele = this.length ? this.get(0) : null;
            if(!ele) return;
            //每个元素具有一个唯一expando值
            if(!ele[S.expando]) ele[S.expando] = ++S.uid;
            if(S.isUndefined(S.cache[ele[S.expando]])) S.cache[ele[S.expando]] = {};
            if(!S.isUndefined(value)){
                S.cache[ele[S.expando]][name] = value;
            }else{
                return S.cache[ele[S.expando]][name];
            }
            return this;
        },
        css:function(name,value){
            return this;
        },
        /*
         * @note 此处应该判断元素类型，原生不具有value属性的元素，不能调用val()方法
         * @note select的value值如何返回
         */
        val:function(name,value){
            if(S.isUndefined(value)){
                return this.value;
            }else{

                return this;
            }
        },
        html:function(value){
            if(S.isUndefined(value)){
                return this.get(0).innerHTML;
            }else if(S.isString(value)){
                this.get(0).innerHTML = value;
            }
        },
        empty:function(){
            this.each(function(){
                this.innerHTML = '';
            })
        },
        parent:function(selector){
            var eles = [];
            if(S.isUndefined(selector)){
                this.each(function(){
                    //使用merge合并数组，去重
                    if(this.parentNode) eles = S.merge(eles,[this.parentNode]);
                })
            }
            return S(eles);
        },
        sibings:function(selector){
        },
        next:function(selector){
        },
        prev:function(selector){
        },
        /*
         * @description 当前集合中除去selector后的元素，默认出去自身
         */
        other:function(index){
        },
        /*
         * @description 显示元素
         * @note 如何为不同类型元素设置不同的display
         */
        show:function(){
            this.each(function(){
                this.style.display = 'block';
            });
            return this;
        },
        /*
         * @description 隐藏元素
         */
        hide:function(){
            this.each(function(){
                this.style.display = 'none';
            });
            return this;
        },
        toggle:function(i){
            return this;
        }
    };
    /*
     * @private
     * @static
     * @description 提供不对外部开放的基本功能函数，主要供原型方法调用
     * @Object
     * @note 基本功能函数方法不要使用this，避免原型方法调用使用apply、call改写this
     * @note 切勿添加不必要的功能函数，该处的函数设计的初衷都是为原型方法调用，能在原型方法中实现尽量在原型方法中实现
     * @note 添加功能函数原则：
     *          1.可能在不同的原型方法中多次调用，如：replaceClass
     *          2.实现复杂，分离到功能函数便于维护，如：query
     *          3.可能在其他功能函数中调用
     *          4.不包含对SO对象的操作
     */
    SL.fn = {
        /*
         * @function
         * @description 元素选择器
         * @param selector DOMElement|String
         * @param context DOMElement|String
         */
        query:function(selector,context){
            var ele,eles=[],type,selector=S.isString(selector) ? S.trim(selector) : selector;
            if(!selector) return [];
            if(selector.nodeType) return [selector];
            if(doc.querySelectorAll){
                /*
                 * uncaught exception
                 * query = doc.querySelectorAll;
                 * query方法copy一份_query
                 */
                var _query = function(selector,context){
                    if(!selector) return [];
                    if(selector.nodeType) return [selector];
                    if(S.isArray(selector)) return selector;
                    if(S.isNode(selector)) return selector;
                    if(S.isString(selector)){
                        var r = doc.querySelectorAll(selector);
                        var eles = [],i = 0;
                        while(r[i]) eles.push(r[i++]);
                        return eles;
                    }
                };
                this.query = _query;
                return _query(selector,context);
            }
            //暂时只针对实现了querySelectAll的浏览器，后续尝试实现选择器或引入sizzle
            type = selector.indexOf('#')==0 ? 'ID' (selector.indexOf('.')==0 ? 'CLASS' : 'TAG') : 'TAG';
            switch(type){
                case 'ID':
                    ele = SL.fn.$(selector);
                    return ele ? [ele] : [];
                case 'CLASS':
                    //
                    return doc.getElementByClassName(selector);
                case 'TAG':
                default:
                    return doc.getElementsByTagName(selector);
            }
            return eles;
        },
        $:function(id){
            if(!S.isString(id)) return;
            var id = S.trim(id);
            if(id.indexOf('#')!=0||id.indexOf(/\s/)) return;
            return doc.getElementById(id);
        },
        $$:function(cls,context){
            //context:类数组
            //未完待续
            if(!S.isString(cls)) return;
            var cls = S.trim(cls);
            var context = S.isObject(context) && context.length ? context : doc;
        },
        $$$:function(tag,context){
            //context:类数组
            //未完待续
            if(!S.isString(tag)) return;
            var eles = [];
            var tag = S.trim(tag);
            var context = S.isObject(context) && context.length ? context : doc;
            if(context === doc) return doc.getElementsByTagName(tag);
            else if(context.length){
                var i = 0;
                while(context[i]){
                    i++;
                }
            }
        },
        /*
         * @description 将from(array)中的元素/属性追加到to(object/array)中
         */
        add:function(to,from,start){
            if(!S.isArray(from) || (!S.isObject(to)&&!S.isArray(to))) return;
            var i = (S.isNumber(start) && start<to.length) ? start : to.length,
                j = 0;
            for(var l=from.length;j<l;j++){
                to[i++] = from[j];
            }
            return to;
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
     * @description 对外开放静态方法，通过SL.lang.mix拷贝到S对象
     *              如类型判断type
     */
    SL.lang = {
        /*
         * @note 会覆盖掉同名属性/方法
         * @note 与SL.fn.add方法有点重复，考虑优化
         */
        mix:function(r,s){
            if(!r||!s) return;
            for(var i in s){
                r[i] = s[i];
            }
        },
        type:function(obj){
            /*
             * @note 注意判断先后顺序
             */
            if(obj && obj.nodeType) return 'node';
            if(obj === null) return 'null';
            if(obj === undefined) return 'undefined';
            if(typeof obj == 'string') return 'string';
            if(typeof obj == 'boolean') return 'boolean';
            if(typeof obj == 'function') return 'function';
            if(obj.constructor == Array) return 'array';
            if(obj.constructor == Object) return 'object';
            // typeof NaN Number
            if(isNaN(obj)) return 'NaN';
            if(typeof obj == 'number') return 'number';
        },
        isNode:function(obj){
            return S.type(obj) === 'node';
        },
        isString:function(obj){
            return S.type(obj) === 'string';
        },
        isBoolean:function(obj){
            return S.type(obj) === 'boolean';
        },
        isFunction:function(obj){
            return S.type(obj) === 'function';
        },
        isNumber:function(obj){
            return S.type(obj) === 'number';
        },
        isArray:function(obj){
            return S.type(obj) === 'array';
        },
        isObject:function(obj){
            return S.type(obj) === 'object';
        },
        isEmptyObject:function(obj){
            if(!S.isObject(obj)) return false;
            for(var i in obj){
                return false;
            }
            return true;
        },
        isNull:function(obj){
            return S.type(obj) === 'null';
        },
        isUndefined:function(obj){
            return S.type(obj) === 'undefined';
        },
        isNaN:function(obj){
            return S.type(obj) === 'NaN';
        },
        now:function(){
            return new Date().getTime();
        },
        trim:function(s){
            return s.replace(/^\s+/g,'').replace(/\s$/,'');
        },
        /*
         * o:Array|Object
         */
        each:function(o,fn){
            if(!S.isArray(o) && !S.isObject(o) || !S.isFunction(fn)) return;
            if(S.isArray(o)){
                var i = 0;
                while(o[i]){
                    //i:index in array
                    fn.call(o[i],i);
                    i++;
                }
            }else{
                for(var i in o){
                    //i:key
                    fn.call(o[i],i);
                }
            }
        },
        /*
         * @description 深拷贝
         * @return copy
         */
        deepCopy:function(o){
            if(!S.isArray(o) || !S.isObject(o)) return o;
            var t;
            if(S.isArray(o)){
                t = [],i = 0,l = o.length;
                while(i<l){
                    t.push(o[i++]);
                }
            }else if(S.isObject(o)){
                t = {};
                for(var i in o){
                    t[i] = o[i];
                }
            }
            return t;
        },
        /*
         * @description 合并数组或对象
         * @param o:origin
         * @param s:source
         * @param f:force
         */
        merge:function(o,s,f){
            if(S.type(o)!=S.type(s) || !S.isObject(o) && !S.isArray(o)) return;
            var t = S.deepCopy(o),isArray = S.isArray(o);
            if(isArray && !o.length || S.isEmptyObject(o)) return S.deepCopy(s);
            //if force overwrite
            if(f){
                //数组比较值
                //对象比较key
                S.each(s,function(i){
                    var si = this;
                    S.each(o,function(j){
                        if(isArray){
                            if(si===this) t[i] = this;
                            else t.push(this);
                        }else{
                            if(i===j) t[i] = this;
                            else t[j] = this;
                        }
                    })
                })
            }else{
                S.each(s,function(i){
                    var si = this;
                    S.each(o,function(j){
                        if(isArray){
                            if(si!==this) t.push(this);
                        }else{
                            if(i!==j) t[j] = this;
                        }
                    })
                })
            }
            return t;
        }
    };
    SL.extend = {
        /*
         * 原型不是共用的?
         *为毛uid,expando,cache在原型中定义会错？
         */
        uid:0,
        expando:'SL'+new Date().getTime(),
        cache:{}
    };
    SL.lang.mix(S,SL.lang);
    SL.lang.mix(S,SL.extend);
    window.S = window.SL = S;
})();
