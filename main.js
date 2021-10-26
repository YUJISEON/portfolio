
'use strict';

function PageScroll(option) {
    console.log("PageScroll");
    this.init(option);
    this.bindingEvent();
}

PageScroll.prototype.init = function(option) {
    console.log("PageScroll - init");
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
    console.log("PageScroll - bindingEvent");
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


function ImageSlide(option) {
    console.log("imageSlide");
    this.init(option);
    this.bindingEvent();
}

ImageSlide.prototype.init = function(option) {
    console.log("ImageSlide - init");
    this.$imgSildeWrap = $(option.wrap);
    this.$panel = $(option.panel);
    this.$indicator = $(option.indicator);
    this.$indicatorBtn =  this.$indicator.find("li");
    this.slideTotal = this.$panel.find("li").length;
    this.$prev = $(".prev");
    this.$next = $(".next");
    this.slidePrev = 0;
    this.slideNext = 0;
    this.slideNow = 0;
    this.slideFirst = 1;
    this.speed = option.speed;
    this.indicatorCount = 0;
}

ImageSlide.prototype.bindingEvent = function(option) {
    console.log("ImageSlide - bindingEvent");
    this.setSildeWrap();
    this.setSlide(this.slideFirst);

    $("body").on('click', "ul.indicator li a", function(e) {
        e.preventDefault();
        var index = $(this).attr("data-index");
        this.showSlide(index);
    });

    this.$next.on("click",function(e){
        e.preventDefault();
        this.slideShowNext(null);
    });
    
    this.$prev.on("click",function(e){
        e.preventDefault();
        this.slideShowPrev(null);
    });
    
}

ImageSlide.prototype.setSildeWrap = function () {    
    console.log("setSildeWrap");
    this.$panel.css({
        width : 100*this.slideTotal + "%",
        marginLeft : "-100%",
        height : "100%"
    })
    this.$panel.find("li").css({
        width : 100/this.slideTotal + "%",
        height : "100%"
    })
    this.$panel.find("li").last().prependTo(this.$panel);

    this.$panel.find('li').each(function(i) {
        $(this).css({'left': (i * 100) + '%'}); /* , 'display': 'block' */
        this.$indicator.append('<li><a href="#" data-index=' + (i+1) +'>' + (i + 1) + '</a></li>\n');   
    }.bind(this));
}

ImageSlide.prototype.setSlide = function(_index) {
    console.log("setSlide");
    if (this.slideNow === 0) {
        this.$panel.css({'transition': 'none', 'left': -((_index) * 100) + '%'});
        this.setSlideStatus(_index);
    } else {
        this.indicatorCount = _index - this.slideNow ;
        if(this.indicatorCount > 0) {
            this.slideShowNext(this.indicatorCount)
        } else {
            this.slideShowPrev(this.indicatorCount);
        }        
    }
}

ImageSlide.prototype.setSlideStatus = function(_index) {
    console.log("setSlideStatus");
    this.slideNow = _index;
    this.slidePrev = (_index - 1) < 1 ? this.slideTotal : _index - 1;
    this.slideNext = (_index + 1) > this.slideTotal ? 1 : _index + 1;

    this.$imgSildeWrap.find("ul.indicator li").children("a").removeClass("on");
    this.$imgSildeWrap.find("ul.indicator li").eq(_index - 1).children("a").addClass("on");
    
    //console.clear();
    console.log(`_index : ${_index}`);
    console.log(`slideNow : ${this.slideNow}`);
    console.log(`slidePrev : ${this.slidePrev}`);
    console.log(`slideNext : ${this.slideNext}`);
}

ImageSlide.prototype.slideShowNext = function (_indicatorCount) {
    console.log("slideShowNext");
    if(_indicatorCount !== null) {
        this.$panel.stop().animate({marginLeft: -((_indicatorCount+1) * 100) + '%'}, this.speed, function(){            
            for(let i=0;i<_indicatorCount;i++) {
                $(this).find("li").first().appendTo(this);
                this.setSlideStatus(this.slideNext);
                $(this).css({marginLeft: "-100%"});
            }               
        }.bind(this));
    } else {
        this.$panel.stop().animate({marginLeft: "-200%"}, this.speed, function(){
            $(this).find("li").first().appendTo(this);
            this.setSlideStatus(this.slideNext);
            $(this).css({marginLeft: "-100%"});
        }.bind(this));
    }
}

ImageSlide.prototype.slideShowPrev = function (_indicatorCount) {
    console.log("slideShowPrev");
    if(_indicatorCount !== null) {
        this.$panel.stop().animate({marginLeft: 0 + '%'}, this.speed, function(){     
            for(let i=0;i<-(_indicatorCount);i++) {
                $(this).find("li").last().prependTo(this);
                this.setSlideStatus(this.slidePrev);
                $(this).css({marginLeft: "-100%"});
            }               
        }.bind(this));
    } else {
        this.$panel.stop().animate({marginLeft: "0%"}, this.speed, function(){
            $(this).find("li").last().prependTo( this );
            this.setSlideStatus(this.slidePrev);
            $(this).css({marginLeft: "-100%"});
        }.bind(this));
    }
}

/*
var $imgSildeWrap = $(".imgSildeWrap");
var $panel = $imgSildeWrap.find("ul.imgContents");
var $indicator =  $imgSildeWrap.find("ul.indicator li a");
var numSlide = $panel.find("li").length;
var $prev = $(".prev");
var $next = $(".next");
var slidePrev = 0;
var slideNext = 0;
var slideNow = 0;
var slideFirst = 1;
var speed = 500;
var indicatorCount = 0;

init($panel);
showSlide(slideFirst);

$("body").on('click', "ul.indicator li a", function(e) {
    e.preventDefault();
    var index = $(this).attr("data-index");
    showSlide(index);
});

$next.on("click",function(e){
    e.preventDefault();
    next(null);
});

$prev.on("click",function(e){
    e.preventDefault();
    prev(null);
});


function init(_panel){
    var len = _panel.find("li").length;
    _panel.css({
        width : 100*len + "%",
        marginLeft : "-100%",
        height : "100%"
    })
    _panel.find("li").css({
        width : 100/len + "%",
        height : "100%"
    })
    _panel.find("li").last().prependTo(_panel);

    $imgSildeWrap.find('ul.imgContents li').each(function(i) {
        $(this).css({'left': (i * 100) + '%'}); 
        $imgSildeWrap.find('ul.indicator').append('<li><a href="#" data-index=' + (i+1) +'>' + (i + 1) + '</a></li>\n');   
    });
}

function next(_indicatorCount){
    if(_indicatorCount !== null) {
        $panel.stop().animate({marginLeft: -((_indicatorCount+1) * 100) + '%'},speed,function(){            
            for(let i=0;i<_indicatorCount;i++) {
                $(this).find("li").first().appendTo(this);
                slideStatus(slideNext);
                $(this).css({marginLeft: "-100%"});
            }               
        });
    } else {
        $panel.stop().animate({marginLeft: "-200%"},speed,function(){
            $(this).find("li").first().appendTo(this);
            slideStatus(slideNext);
            $(this).css({marginLeft: "-100%"});
        });
    }

}

function prev(_indicatorCount){
   if(_indicatorCount !== null) {
        $panel.stop().animate({marginLeft: 0 + '%'},speed,function(){     
            for(let j=0;j<-(_indicatorCount);j++) {
                $(this).find("li").last().prependTo(this);
                slideStatus(slidePrev);
                $(this).css({marginLeft: "-100%"});
            }               
        });
    } else {
        $panel.stop().animate({marginLeft: "0%"},speed,function(){
            $(this).find("li").last().prependTo( this );
            slideStatus(slidePrev);
            $(this).css({marginLeft: "-100%"});
        });
    }
    
}

function showSlide(_index) {    
    if (slideNow === 0) {
        $panel.css({'transition': 'none', 'left': -((_index) * 100) + '%'});
        slideStatus(_index);
    } else {
        indicatorCount = _index - slideNow ;
        if(indicatorCount > 0) {
            next(indicatorCount)
        } else {
            prev(indicatorCount);
        }        
    } 
}

function slideStatus(_index) {    
    slideNow = _index;
    slidePrev = (_index - 1) < 1 ? numSlide : _index - 1;
    slideNext = (_index + 1) > numSlide ? 1 : _index + 1;

    $imgSildeWrap.find("ul.indicator li").children("a").removeClass("on");
    $imgSildeWrap.find("ul.indicator li").eq(_index - 1).children("a").addClass("on");
    
    console.clear();
    console.log(`_index : ${_index}`);
    console.log(`slideNow : ${slideNow}`);
    console.log(`slidePrev : ${slidePrev}`);
    console.log(`slideNext : ${slideNext}`);
}
*/