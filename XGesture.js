/* 
    手势相应 
    Code by zmz
    2020年8月26日18:43:03
    示例
        见 index.html
*/

//手势事件处理
function XGesture( ELID,        // 准备响应手势的元素ID
                   OptAndHandle // 参数
        /*
        {
            
            start : function( _self, e ) { },   touchstart 事件响应函数 如不需要对此事件进行处理 可无此项

            end : function( _self, e ) { },     touchstart 事件响应函数 如不需要对此事件进行处理 可无此项     

            move : function( _self,             当前XGesture对象 
                             e,                 事件参数
                             _DX,               相对开始位置X轴移动距离
                             _DY )              相对开始位置Y轴移动距离
            {
            },

            left : { //向左滑动参数
                distance : 0,                   向左滑动距离大于等于此值时 开始调用 fnc 函数
                fnc : function( _self,          当前XGesture对象  
                                _distance,      从按下的位置到当前位置的X轴上的距离
                                _speed          X轴上的移动速度
                              ) { }
            },
            right   : { 同left }，
            up      : { 同left }，
            down    : { 同left }
        }
        */

    ) {
    this.ELID = ELID;
    this.Opt = OptAndHandle;
    this.OldX = null;
    this.OldY = null;
    this.speedoldx = null;
    this.speedoldy = null;
    this.speedoldt = null;
    this.starttime = null;

    XGesture.prototype.getEvent = function(event){
        return event || window.event;
    };
    
    XGesture.prototype.addEvent = function( element, type, handler ){
        if(element.addEventListener){
            element.addEventListener(type, handler, false);
        } else if(element.attachEvent){
            element.attachEvent('on'+type, handler);
        }else{
            element['on'+type] = handler;
        }
    };
    this.makefnc = function( fn, proxy ) {
        ret = function() {
            return fn.apply( proxy, arguments );
        };
        return ret;
    };

    this.touchHandle =  function( e ) {
        if( typeof( this.Opt ) != 'object' ) {
            return;
        }
        ev = XGesture.prototype.getEvent(e);  
        switch( ev.type ){ 
            case 'touchstart' :
                this.OldX = ev.changedTouches[0].screenX;
                this.OldY = ev.changedTouches[0].screenY;
                this.starttime = ev.timeStamp;
                if( typeof( this.Opt.start ) == 'function' ) {
                    this.Opt.start( this, ev );   
                }
                break;
            case 'touchend' :
                detailX = ev.changedTouches[0].screenX - this.OldX;
                detailY = ev.changedTouches[0].screenY - this.OldY;

                if( typeof( this.Opt.left ) == 'object' && typeof( this.Opt.left.distance ) != 'undefined' &&  typeof( this.Opt.left.fnc ) == 'function' &&
                    detailX < 0 &&  Math.abs( detailX ) >= this.Opt.left.distance ) {
                    this.Opt.left.fnc( this, detailX, this.speedx );    
                } 
                if( typeof( this.Opt.right ) == 'object' && typeof( this.Opt.right.distance ) != 'undefined' && typeof( this.Opt.right.fnc ) == 'function' &&
                    detailX > 0 && Math.abs( detailX ) >= this.Opt.right.distance ) {
                    this.Opt.right.fnc( this, detailX, this.speedx );  
                } 
                if( typeof( this.Opt.up ) == 'object' && typeof( this.Opt.up.distance ) != 'undefined' && typeof( this.Opt.up.fnc ) == 'function' &&
                    detailY < 0 && Math.abs( detailY ) >= this.Opt.up.distance ) {
                    this.Opt.up.fnc( this, detailY, this.speedy );  
                } 
                if( typeof( this.Opt.down ) == 'object' && typeof( this.Opt.down.distance ) != 'undefined' && typeof( this.Opt.down.fnc ) == 'function' &&
                    detailY > 0 && Math.abs( detailY ) >= this.Opt.down.distance ) {
                    this.Opt.down.fnc( this, detailY, this.speedy ); 
                }

                if( typeof( this.Opt.end ) == 'function' ) {
                    this.Opt.end( this, ev );   
                }
                this.OldX = null;
                this.OldY = null;
                this.speedoldx = null;
                this.speedoldy = null;
                this.speedoldt = null;
                this.starttime = null;
                break;
            case 'touchmove' :
                if( this.speedoldx == null ) { this.speedoldx = this.OldX; }
                if( this.speedoldy == null ) { this.speedoldy = this.OldX; }
                if( this.speedoldt == null ) { this.speedoldt = this.starttime; }
                
                var detailT = ev.timeStamp -  this.speedoldt;
                detailX = ev.changedTouches[0].screenX - this.OldX;
                detailY = ev.changedTouches[0].screenY - this.OldY;
                
                this.speedx = ( this.speedoldx - ev.changedTouches[0].screenX ) / detailT * 1000;
                this.speedy = ( this.speedoldy - ev.changedTouches[0].screenY ) / detailT * 1000; 
                
                this.speedoldt = ev.timeStamp;
                this.speedoldx = ev.changedTouches[0].screenX;
                this.speedoldy = ev.changedTouches[0].screenY;

                if( typeof( this.Opt.move ) == 'function' ) {
                    this.Opt.move( this, ev,
                                   ( ( typeof( this.Opt.left ) != 'undefined' && typeof( this.Opt.left.distance ) != 'undefined' && typeof( this.Opt.left.distance ) == 'number' && this.Opt.left.distance > 0 && Math.abs( detailX ) >= this.Opt.left.distance ) ||
                                   ( typeof( this.Opt.right ) != 'undefined' && typeof( this.Opt.right.distance ) != 'undefined' && typeof( this.Opt.right.distance ) == 'number' && this.Opt.right.distance > 0 && Math.abs( detailX ) >= this.Opt.right.distance ) ) ? detailX : 0,
                                   ( ( typeof( this.Opt.up ) != 'undefined' && typeof( this.Opt.up.distance ) != 'undefined' && typeof( this.Opt.up.distance ) == 'number' && this.Opt.up.distance > 0 && Math.abs( detailY ) >= this.Opt.up.distance ) ||
                                   ( typeof( this.Opt.down ) != 'undefined' && typeof( this.Opt.down.distance ) != 'undefined' && typeof( this.Opt.down.distance ) == 'number' && this.Opt.down.distance > 0 && Math.abs( detailY ) >= this.Opt.down.distance ) ) ? detailY : 0 );

                }
                break;
        }
    };
    XGesture.prototype.addEvent( document.getElementById( this.ELID ), 'touchstart',    this.makefnc( this.touchHandle, this ) );
    XGesture.prototype.addEvent( document.getElementById( this.ELID ), 'touchend',      this.makefnc( this.touchHandle, this ) );
    XGesture.prototype.addEvent( document.getElementById( this.ELID ), 'touchmove',     this.makefnc( this.touchHandle, this ) );
};


function XGestureOption( selector,         //父容器选择器
              selector_inner,   //拖动的内容选择器
              acceleration,     //运动加速度
              left_distance,    //上下左右触发手势的最小移动距离
              right_distance, 
              up_distance, 
              down_distance ) {
    this.start = function( self, e ) { //开始滑动手势
        //如果在移动中先停止
        if( self.XTimeHandle ) {
            clearInterval( self.XTimeHandle );
            self.XTimeHandle = null;
        }
        if( self.YTimeHandle ) {
            clearInterval( self.YTimeHandle );
            self.YTimeHandle = null;
        }
        //记录原始位置
        self._left = parseInt( document.querySelector(selector_inner).offsetLeft );
        self._top = parseInt( document.querySelector(selector_inner).offsetTop ); 
        //计算left最小值
        self._minx = parseInt( document.querySelector(selector).offsetWidth ) - parseInt( document.querySelector(selector_inner).offsetWidth );
        //计算top最小值
        self._miny = parseInt( document.querySelector(selector).offsetHeight ) - parseInt( document.querySelector(selector_inner).offsetHeight  );
    };
    this.end = function( self, e ) { //滑动手势结束
        
    };
    this.move = function( self, e, dx, dy ) { //手势滑动中
        var nx = self._left + dx;
        if( nx > 0 )  nx = 0;
        if( nx < self._minx )  nx = self._minx;
        document.querySelector(selector_inner).style.left = nx +'px';

        var ny = self._top + dy;
        if( ny > 0 )  ny = 0;
        if( ny < self._miny )  ny = self._miny;
        document.querySelector(selector_inner).style.top = ny +'px';
    };

    //上下左右手势事件处理
    this.left = {
        distance : left_distance,
        fnc : function( self, _distance, _speed ) {
            self.Opt.inertia( self, _speed, 'left' );    
        }
    };
    this.right = {
        distance : right_distance,
        fnc : function( self, _distance, _speed ) {
            self.Opt.inertia( self, _speed, 'left' ); 
        }
    };
    this.up = {
        distance : up_distance,
        fnc : function( self, _distance, _speed ) {
            self.Opt.inertia( self, _speed, 'top' ); 
        }
    };
    this.down = {
        distance : down_distance,
        fnc : function( self, _distance, _speed ) {
            self.Opt.inertia( self, _speed, 'top' ); 
        }
    };

    
    this.inertiafnc = function( self, _speed, _cssname ) {  //手势惯性阻尼减速运动
        return function() {
            //方向系数
            var xs = _speed > 0 ? 1 : -1;
            if( _cssname == 'left' ) {
                var t = ( (new Date()).getTime() - self.timestampX ) / 1000;
                var DetailT = t > self.stopTX ? self.stopTX : t;
                if( DetailT == self.stopTX ) {
                    if( self.XTimeHandle ) {
                        clearInterval( self.XTimeHandle );
                        self.XTimeHandle = null;
                    }
                }
                var h = self.HX - acceleration * ( self.stopTX - DetailT ) * ( self.stopTX - DetailT ) / 2;
                var nx = self._left - h * xs;
                if( nx > 0 )  nx = 0;
                if( nx < self._minx )  nx = self._minx;
                if( nx == 0 || nx == self._minx ) {
                    if( self.XTimeHandle ) {
                        clearInterval( self.XTimeHandle );
                        self.XTimeHandle = null;
                    } 
                }
                document.querySelector(selector_inner).style.left = nx +'px';
            } else if( _cssname == 'top' ) {
                var t = ( (new Date()).getTime() - self.timestampY ) / 1000;
                var DetailT = t > self.stopTY ? self.stopTY : t; 
                if( DetailT == self.stopTY ) {
                    if( self.YTimeHandle ) {
                        clearInterval( self.YTimeHandle );
                        self.YTimeHandle = null;
                    }
                }
                var h = self.HY - acceleration * ( self.stopTY - DetailT ) * ( self.stopTY - DetailT ) / 2;
                var ny = self._top - h * xs;
                if( ny > 0 )  ny = 0;
                if( ny < self._miny )  ny = self._miny;
                if( ny == 0 || ny == self._miny ) {
                    if( self.YTimeHandle ) {
                        clearInterval( self.YTimeHandle );
                        self.YTimeHandle = null;
                    } 
                }
                document.querySelector(selector_inner).style.top = ny +'px';
            }
        }
    };
    this.inertia = function( self, _speed, _cssname ) { //惯性相关计算
        if( _cssname == 'left' ) {
            //计算速度将到0需要的时间                    
            self.stopTX =  Math.abs( _speed / acceleration );
            //计算速度降到0 理想情况下需要移动的距离
            self.HX = acceleration * self.stopTX * self.stopTX / 2;
            //记录时间戳
            self.timestampX = (new Date()).getTime();
            //记录当前位置
            self._left = parseInt( document.querySelector(selector_inner).offsetLeft );
            if( self.XTimeHandle ) {
                clearInterval( self.XTimeHandle );
                self.XTimeHandle = null;
            }
            self.XTimeHandle = setInterval( self.Opt.inertiafnc( self, _speed, _cssname ), 5 );
        } else if( _cssname == 'top' ) {
            //计算速度将到0需要的时间                    
            self.stopTY =  Math.abs( _speed / acceleration );
            //计算速度降到0 理想情况下需要移动的距离
            self.HY = acceleration * self.stopTY * self.stopTY / 2;
            //记录时间戳
            self.timestampY = (new Date()).getTime();
            //记录当前位置
            self._top = parseInt( document.querySelector(selector_inner).offsetTop ); 
            if( self.YTimeHandle ) {
                clearInterval( self.YTimeHandle );
                self.YTimeHandle = null;
            }
            self.YTimeHandle = setInterval( self.Opt.inertiafnc( self, _speed, _cssname ), 5 );
        }
    };
    
};
