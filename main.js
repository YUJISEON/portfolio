
'use strict';

function PageScroll(option) {
    // console.log("PageScroll");
    this.init(option);
    this.bindingEvent();
}

PageScroll.prototype.init = function(option) {
    // console.log("PageScroll - init");
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
    // console.log("PageScroll - bindingEvent");
    this.setPos();

    this.eventScroll = ('onmousewheel' in window) ? 'mousewheel' : 'DOMMouseScroll';

    $(window).on("resize", ()=>{
        this.setPos();
        var activeIndex = this.page.children("a").filter(".on").parent().index();
        this.moveScroll(activeIndex); 
    });

    this.btns.on("click", (e)=>{
        e.preventDefault();
        
        var isOn = $(e.currentTarget).children("a").hasClass("on");
        if(isOn) return;

        if(this.enableEvt){
            this.enableEvt = false;
            var i = $(e.currentTarget).index();
            this.moveScroll(i);
        }   
    });

    $(window).on("scroll",()=>{
        var scroll = $(window).scrollTop();
        this.activation(scroll);   
    });

    this.page.on("mousewheel", (e)=>{
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
   });

}

PageScroll.prototype.setPos = function(){
    // console.log("setPos");
    this.posArr=[];
    this.page.each((index)=>{
        this.posArr.push(this.page.eq(index).offset().top);
    });
    // console.log(this.posArr);
}

PageScroll.prototype.moveScroll = function(index){
    // console.log("moveScroll");
    $("html,body").stop().animate({scrollTop: this.posArr[index]}, this.speed, ()=>{
        this.enableEvt = true;
    }); 
}

PageScroll.prototype.activation = function(scroll){
    // console.log("activation");
    this.page.each((index)=>{
        var minScroll= this.posArr[index] - $(window).height()/2;
        var maxScroll= this.posArr[index] + $(window).height()/2;
        //if(scroll>= this.posArr[index]+this.base){
        if(scroll>= minScroll && scroll <= maxScroll){  
          this.btns.children("a").removeClass("on");
          this.btns.eq(index).children("a").addClass("on");

          this.page.removeClass("on");
          this.page.eq(index).addClass("on");
        }
    }); 
}

///////////////////////////////////////////////


var $page1_top = $('#page1').offset().top;
var $page2_top = $('#page2').offset().top;
var $page3_top = $('#page3').offset().top;
var $page2_Ht =  $('#page2').height();
var $page2_img = $(".page2__img");
var onAnimation = true;

var _scale = 2;
var minScale = 1;
var maxScale = 2;
var baseS = 0.1;

var yyy=0;
var xxx=0;
var tansY = -100;
var minTansY = -$page2_Ht/2;
var maxTansY = -100;
var baseY = 50;

var tansX = -200;
var minTansX = 100;
var maxTansX = -200;
console.log($page2_top);
console.log($page2_Ht);

var eventScroll = ('onmousewheel' in window) ? 'mousewheel' : 'DOMMouseScroll';

$(window).on(eventScroll, function(e) {
    console.log("wheel!!!!!!!!!!!")
    const pageY = $(window).scrollTop();    
    console.log("pageY " + pageY);
    console.log('eventScroll : ' + eventScroll);
    onAnimation = false;
   var delta = 0;
    if (eventScroll === 'mousewheel') { 
          console.log("e.wheelDelta : " +e.originalEvent.wheelDelta);
          delta = e.originalEvent.wheelDelta / -150;
    } else {
          console.log("e.detail : " + e.originalEvent.detail);
          //delta = e.detail / 3;
   }
   console.log("delta >> " + delta);
    if (delta > 0) {
         console.log("wheel down");  
          //tansY -= baseY;
          _scale >= minScale ? _scale -= baseS : _scale = minScale ;
          tansX >= minTansX ? tansX -= baseY : tansX = minTansX ;
          tansY >= minTansY ? tansY -= baseY : tansY = minTansY ;
          console.log(tansY);   
          yyy = yyy + 100;
          xxx = xxx + 10;
    } else {
         console.log("wheel up");   
          //tansY += baseY;
          _scale <= maxScale ? _scale += baseS : _scale = maxScale;
          tansX <= maxTansX ? tansX += baseY : tansX = maxTansX ;
          tansY <= maxTansY ? tansY += baseY : tansY = maxTansY ;
          console.log(tansY); 
          yyy = yyy - 100;
          xxx = xxx - 10;
    }
    
    if(pageY > 300) {
        $page2_img.animate({
          bottom : `${yyy}px`
        }, 0, function() {
            onAnimation = true;
        })
    } else if(pageY > 500) {
        $page2_img.animate({
          
          left : `${xxx}px`
        }, 0, function() {
            onAnimation = true;
        })
    }
  
})



///////////////////////////////////////////////

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
    this.slideList = this.$panel.find("li");
    this.slideTotal = this.$panel.find("li").length;
    this.$prev = $(".prev");
    this.$next = $(".next");
    this.slidePrev = 0;
    this.slideNext = 0;
    this.slideNow = 0;
    this.slideFirst = 1;
    this.isFirst = true;
    this.speed = option.speed;
    this.indicatorCount = 0;
    this.enableActive = true;
}

ImageSlide.prototype.bindingEvent = function(option) {
    console.log("ImageSlide - bindingEvent");
    this.setSildeWrap();
    this.setSlide(this.slideFirst);

    $("body").on('click', "ul.indicator > li > a", (e) => {
        e.preventDefault();
        //var index = $(this).attr("data-index");

        var isOn = $(e.currentTarget).hasClass("on");
        if(isOn) return;

        var index = $(e.currentTarget).attr("data-index");
        if(this.enableActive) {
            this.enableActive = false;
            this.setSlide(index);
        }
        
    });

    this.$next.on("click", (e) => {
        e.preventDefault();

        if(this.enableActive) {
            this.enableActive = false;
            this.slideShowNext(null);
        }
    });
    
    this.$prev.on("click", (e) => {
        e.preventDefault();
        if(this.enableActive) {
            this.enableActive = false;
            this.slideShowPrev(null);
        }
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

    this.$panel.find('li').each((i) => {
        $(this).css({'left': (i * 100) + '%'}); /* , 'display': 'block' */
        this.$indicator.append('<li><a href="#" data-index=' + (i+1) +'>' + (i + 1) + '</a></li>\n');   
    });
}

ImageSlide.prototype.setSlide = function(_index) {
    if (this.slideNow === 0) {
        this.$panel.css({'transition': 'none', 'left': -((_index) * 100) + '%'});
        this.setSlideStatus(_index);
    } else {
        this.indicatorCount = _index - this.slideNow ;
        if(this.indicatorCount > 0 ) {
            this.slideShowNext(this.indicatorCount)
        } else {
            this.slideShowPrev(Math.abs(this.indicatorCount));
        }        
    }
}

ImageSlide.prototype.setSlideStatus = function(_index) {
    console.log("setSlideStatus");
    
    this.slideNow = _index = _index > this.slideTotal ? 1 : _index ;
    this.slideNow = _index = _index < 1 ? this.slideTotal : _index ;
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

    var leftValue;
    if(_indicatorCount === null) { leftValue  = 1; }
    else { leftValue = _indicatorCount }

    setTimeout(() => {
            this.$panel.find("li").first().appendTo(this.$panel);
            this.$panel.css({marginLeft: "0%"});
            setTimeout(() => {                
                    this.$panel.stop().animate({marginLeft: -((leftValue) * 100) + '%'}, this.speed, () =>  {
                          for(let i=2;i<=leftValue;i++) {
                              this.$panel.find("li").first().appendTo(this.$panel);   
                              this.$panel.css({marginLeft: -((i) * 100) + '%'});
                          }                            
                          this.setSlideStatus(this.slideNow+leftValue); ///////                     
                          this.$panel.css({marginLeft: "-100%"});
                          this.enableActive = true;                  
                    });              
            })
    });
}

ImageSlide.prototype.slideShowPrev = function (_indicatorCount) {
    console.log("slideShowPrev");
    
    var rightValue;
    if(_indicatorCount === null) { rightValue = 1; }
    else { rightValue = _indicatorCount; console.log(rightValue); }

    setTimeout(() => {
            for(let i=2;i<=rightValue;i++) {
                //$panel.find("li").first().appendTo($panel);   
                this.$panel.find("li").last().prependTo(this.$panel);
                this.$panel.css({marginLeft: -((i) * 100) + '%'});
            }
            setTimeout(() => {      
                this.$panel.stop().animate({marginLeft: -((0) * 100) + '%'}, this.speed, () => {
                     this.$panel.find("li").last().prependTo(this.$panel); 
                      this.$panel.css({marginLeft: "-100%"});
                      this.setSlideStatus(this.slideNow-rightValue);  
                      this.enableActive = true;  
                });
            });
    });      
}

