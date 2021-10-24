
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


function imageSlide(option) {
    console.log("imageSlide");
    this.init(option);
    this.bindingEvent();
}



imageSlide.prototype.init = function(option) {
    console.log("init");
    this.img = $(option.panel);
    this.btns = $(option.btns);
    this.posArr;
    this.speed = 500;
    this.enableEvt = true;
    this.eventScroll;
    this.base = option.base;
    this.onWheelRepeat = false;
    this.isWheelBlocked = false;
}

imageSlide.prototype.bindingEvent = function(option) {
    console.log("bindingEvent");
    this.setPos();
}

var $imgSildeWrap = $(".imgSildeWrap");
var $panel = $imgSildeWrap.find("ul.imgContents");
var $indicator =  $imgSildeWrap.find("ul.indicator li a");
var numSlide = $panel.find("li").length;
var slidePrev = 0;
var slideNext = 0;
var slideNow = 0;
var slideFirst = 1;
var $prev = $(".prev");
var $next = $(".next");
var speed = 500;

init($panel);
showSlide(slideFirst);


$imgSildeWrap.find('ul.imgContents li').each(function(i) {
    $(this).css({'left': (i * 100) + '%'}); /* , 'display': 'block' */
    $imgSildeWrap.find('ul.indicator').append('<li data-index=' + (i+1) +'><a href="#">' + (i + 1) + '</a></li>\n');
});

$("body").on('click', "ul.indicator li a", function(e) {
    e.preventDefault();
    var index = $(this).parent().index();
    showSlide(index+1);
});


$next.on("click",function(e){
    e.preventDefault();
    stop();
    next($panel);
});

$prev.on("click",function(e){
    e.preventDefault();
    stop();
    prev($panel);
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
}

function next(_panel){
    _panel.stop().animate({marginLeft: "-200%"},speed,function(){
        $(this).find("li").first().appendTo(this);
        $(this).css({marginLeft: "-100%"});
    });
    slideStatus(slideNext);
}

function prev(_panel){
    _panel.stop().animate({marginLeft: "0%"},speed,function(){
        $(this).find("li").last().prependTo( this );
        $(this).css({marginLeft: "-100%"});
    });
    slideStatus(slidePrev);
}

function showSlide(_index) {
    
    //if( _index < slideNow) { console.log("move~~~1"); prev($panel); }
    //else if ( _index > slideNow ) { console.log("move~~~2"); next($panel); }

    if (slideNow === 0) {
        console.log("move~~~1");
        $panel.css({'transition': 'none', 'left': -((_index - 1) * 100) + '%'});
    } else {
        console.log("move~~~2");
        $panel.stop().animate({marginLeft: -((_index - 1) * 100) + '%'},speed);
    }

    /*
    $panel.stop().animate({marginLeft: -((_index - 1) * 100) + '%'},speed, function() {
        console.log("move~~~")
        $panel.find("li").last().prependTo($panel); 
        if( _index < slideNow) { console.log("move~~~1"); //$panel.find("li").last().prependTo($panel); 
        }
        else if ( _index > slideNow) {  console.log("move~~~2"); // $panel.find("li").first().appendTo($panel); 
        }
    });
    */
    slideStatus(_index);
    
}

function slideStatus(_index) {

    
    slideNow = _index;
    slidePrev = (_index - 1) < 1 ? numSlide : _index - 1;
    slideNext = (_index + 1) > numSlide ? 1 : _index + 1;
    
    console.log(`_index : ${_index}`);
    console.log(`slideNow : ${slideNow}`);
    console.log(`slidePrev : ${slidePrev}`);
    console.log(`slideNext : ${slideNext}`);
}

function stop() {
    
}