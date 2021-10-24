
'use strict';

function PageScroll(option) {
    console.log("PageScroll");
    this.init(option);
    this.bindingEvent();
}

PageScroll.prototype.init = function(option) {
    console.log("init");
    this.page = $(option.panel);
    this.btns = $(option.btns);
    this.posArr;
    this.speed = 500;
    this.enableEvt = true;
    this.eventScroll;
    this.base = option.base;
    this.onWheelRepeat = false;
    this.isWheelBlocked = false;
}

PageScroll.prototype.bindingEvent = function(option) {
    console.log("bindingEvent");
    this.setPos();

    this.eventScroll = ('onmousewheel' in window) ? 'mousewheel' : 'DOMMouseScroll';

    $(window).on("resize",function(){
        this.setPos();
        var activeIndex = this.page.children("a").filter(".on").parent().index();
        this.moveScroll(activeIndex); 
    }.bind(this));

    this.btns.on("click",function(e){
        e.preventDefault();
        
        var isOn = $(e.currentTarget).children("a").hasClass("on");
        if(isOn) return;

        if(this.enableEvt){
            this.enableEvt = false;
            var i = $(e.currentTarget).index();
            this.moveScroll(i);
        }   
    }.bind(this));

    $(window).on("scroll",function(){
        var scroll = $(window).scrollTop();
        this.activation(scroll);   
    }.bind(this));

    this.page.on("mousewheel", function(e){
      e.preventDefault();

      if(this.enableEvt){
        this.enableEvt = false;
        var i = $(e.currentTarget).index();  
  
        if(e.originalEvent.deltaY > 0){
            this.moveScroll(i+1);    
        }else{
            this.moveScroll(i-1);
        }
      }   
   }.bind(this));

}

PageScroll.prototype.setPos = function(){
    console.log("setPos");
    this.posArr=[];
    this.page.each(function(index){
        this.posArr.push(this.page.eq(index).offset().top);
    }.bind(this));
    console.log(this.posArr);
}

PageScroll.prototype.moveScroll = function(index){
    console.log("moveScroll");
    $("html,body").stop().animate({scrollTop: this.posArr[index]}, this.speed, function(){
        this.enableEvt = true;
    }.bind(this)); 
}

PageScroll.prototype.activation = function(scroll){
    console.log("activation");
    this.page.each(function(index){
        var minScroll= this.posArr[index] - $(window).height()/2;
        var maxScroll= this.posArr[index] + $(window).height()/2;
        //if(scroll>= this.posArr[index]+this.base){
        if(scroll>= minScroll && scroll <= maxScroll){  
          this.btns.children("a").removeClass("on");
          this.btns.eq(index).children("a").addClass("on");

          this.page.removeClass("on");
          this.page.eq(index).addClass("on");
        }
    }.bind(this)); 
}