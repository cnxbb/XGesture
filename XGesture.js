/* 
    手势相应 
    Code by zmz
    2020年8月26日18:43:03
    示例
        见 index.html
*/


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
        }
        else if(element.attachEvent){
            element.attachEvent('on'+type, handler);
        }else{
            element['on'+type] = handler;
        }
    };
    this.δ = 1;
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
