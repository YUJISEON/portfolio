
'use strict';

function PageScroll(option) {    
    this.init(option);
    this.setPos();    
    this.setPage();
    this.bindingEvent();
}

PageScroll.prototype.init = (option) => {
    //console.log("PageScroll - init");
    this.page = document.querySelectorAll(option.panel);
    this.btns = document.querySelectorAll(option.btns);
    this.pageNum = this.page.length;
    this.posArr = [];
    this.speed = 1000;
    this.enableEvt = true;
    this.eventScroll = null;    
    this.pageNow = 0;
    this.pagePrev = 0;
    this.pageNext = 0;    
    this.num=0;
    this.startTime=0;
    this.currentValue=0;
}

PageScroll.prototype.bindingEvent = () => {
    const self = PageScroll.prototype;
    //console.log("PageScroll - bindingEvent");

    this.eventScroll = ('onmousewheel' in window) ? 'mousewheel' : 'DOMMouseScroll';

    window.addEventListener("resize", ()=>{
        //console.log("resize");

        self.setPos();
        let active = document.querySelector(".on").parentElement;
        let index = active.getAttribute("data-index");
        self.moveScroll(index); ;
    });

    this.btns.forEach((el, index)=>{
        el.addEventListener("click", (e)=>{
            e.preventDefault();

            let isOn = el.querySelector("a").classList.contains("on");
            if(isOn) return;
    
            if(this.enableEvt){
                this.enableEvt = false;                
                self.moveScroll(index);
            }   
        });
    })

    window.addEventListener("scroll", ()=>{
        self.setPage()
    });

    window.addEventListener(this.eventScroll, (e)=>{
        e.preventDefault();

        let delta = 0;
        if(this.enableEvt){
            this.enableEvt = false;
    
            if (this.eventScroll == 'mousewheel') {
                delta = e.wheelDelta / -150; // 표준브라우저 : 크롬, IE
            } else {
                delta = e.detail / 3; // 파이어폭스
            }

            if (delta > 0) {
                self.moveScroll(this.pageNext); // 아래로 돌림
            } else {
                self.moveScroll(this.pagePrev); // 위로 돌림
            }
        } 
    }, {passive: false});
}

PageScroll.prototype.setPos = ()=>{
    //console.log("setPos");
    this.posArr = [];
    this.page.forEach((el)=>{
        this.posArr.push(el.offsetTop);
    });
    //console.log(`this.posArr : ${this.posArr}`);;
}

PageScroll.prototype.moveScroll = (index)=>{
    //console.log("moveScroll");
    this._scrollTop = this.posArr[index];
    this.startTime = performance.now();
    this.currentValue = Math.ceil(window.scrollY);
    this.result = 0;
    this.isFrist = true;
    this.num=0;
    if(this.currentValue !== this._scrollTop) requestAnimationFrame((time)=>{PageScroll.prototype.action(time)})
    else { this.enableEvt = true; }
}

PageScroll.prototype.action = (time)=> {
    //console.log(`time : ${time} / this.startTime : ${this.startTime}`);   
    let timeLast = time - this.startTime;
    if(timeLast < 0) timeLast = timeLast - timeLast;
    let progress = timeLast / this.speed;

	if(progress < 0) progress = 0;
    if(progress > 1) { if (isFrist) { progress = 1; isFrist = false } }
      
    if(progress <= 1) {           
        //console.log("action");
        //console.log(`${this.num++}`);
        requestAnimationFrame((time)=>{PageScroll.prototype.action(time)});  
        this.result = this.currentValue + ((this._scrollTop-this.currentValue) * progress);
        window.scrollTo(0, this.result);
        //console.log(`timeLast : ${timeLast}`);   
        //console.log(`progress : ${progress}`);
        //console.log(`this.result : ${this.result}`);       
    } else {
        //cancelAnimationFrame(this.timer);
        this.enableEvt = true;
    }
}

PageScroll.prototype.setPage = ()=>{
    //console.log("setPage");
    let _scrollTop = window.scrollY;
    let minScroll = 0;
    let maxScroll = 0;

    this.page.forEach((el, index)=>{

        minScroll= this.posArr[index] - window.innerHeight/2;
        maxScroll= this.posArr[index] + window.innerHeight/2;

        if(minScroll < _scrollTop && _scrollTop <= maxScroll){  
            this.pageNow = index;
            this.pagePrev = index < 1 ? 0 : index - 1;
            this.pageNext = index >= this.pageNum-1 ? this.pageNum - 1 : index + 1;

            this.btns.forEach((el)=>{ el.querySelector("a").classList.remove("on"); });
            this.btns[index].querySelector("a").classList.add("on");
        }
    }); 
} 


///////////////////////////////////////////////

const panel = document.querySelector("ul.imagePanel");
const panel_list = panel.querySelectorAll("li.imagePanel__item");
const indicator = document.querySelector("ul.indicator");
const btnPrev = document.querySelector(".btnPrev");
const btnNext = document.querySelector(".btnNext");
let indicator_link;
const panel_len = panel_list.length;
let indicator_tag = '';
let slideNow = 0;
let slidePrev = 0;
let slideNext = 0;
let slideFirst = 0;
let slideGap; 
const speed = 800;
let enableClick = true;

document.addEventListener("DOMContentLoaded", ()=>{
    slideInit();
    indicatorStatus(slideFirst);
    indicator_link.forEach((link, index)=>{
    link.addEventListener("click", (e)=>{
      e.preventDefault();      
      indicatorSlide(index);      
    })  
  })
})

function slideInit() {
  panel_list.forEach((curent, index)=>{
    indicator_tag += `<li><a href="#">${index}</a></li>`;
  })
  indicator.innerHTML = indicator_tag;
  indicator_link = indicator.querySelectorAll("li");
  console.log(indicator);
  indicator_link[slideFirst].classList.add("on");

  panel.style.width = `${100*panel_len}%`;
  panel_list.forEach((list) => {
    list.style.width = `${100/panel_len}%`;
  })
  panel.prepend(panel.lastElementChild);
}
  
btnPrev.addEventListener("click", (e)=>{   
   console.log("clicked!!!! prevBtn");   
   e.preventDefault(); 
   if(enableClick) {
     enableClick = false;
     indicatorStatus(slidePrev);
     const ani = new AnimationFrame(panel, {
        prop : "left",
        value : "0%",
        duration : speed,
        callback : () => {
             panel.style["left"] = `-100%`;  
             panel.prepend(panel.lastElementChild);    
             enableClick = true;
        }
      }) 
      ani.init();  
  }
})

btnNext.addEventListener("click", (e)=>{   
   console.log("clicked!!!! nextBtn");   
   e.preventDefault();  
   if(enableClick) {
     enableClick = false;
     indicatorStatus(slideNext);
     const ani = new AnimationFrame(panel, {
        prop : "left",
        value : "-200%",
        duration : speed,
        callback : () => {
             panel.style["left"] = `-100%`;             
             panel.append(panel.firstElementChild);
             enableClick = true;
        }   
    }) 
    ani.init();  
  }
})

function indicatorSlide(index) {
      if(slideNow > index) { 
          indicatorStatus(index);
          const ani = new AnimationFrame(panel, {
            prop : "left",
            value : "0%",
            duration : speed,
            slideGap : slideGap,
            btnName : "btnPrev",
            callback : () => {
                 panel.style["left"] = `-100%`;  
                 panel.prepend(panel.lastElementChild);             
            },
            panelSet : () => {            
                 panel.prepend(panel.lastElementChild);    
                 panel.style["left"] = `${-100*slideGap}%`; 
            }
        }) 
        ani.init();  
      }
      else {  
          indicatorStatus(index);
          const ani = new AnimationFrame(panel, {
            prop : "left",
            value : "-200%",
            duration : speed,
            slideGap : slideGap,
            btnName : "btnNext",
            callback : () => {
                 panel.style["left"] = `-100%`;             
                 panel.append(panel.firstElementChild);
            },
            panelSet : () => {              
                 panel.append(panel.firstElementChild);  
                 panel.style["left"] = `0%`; 
            }
        }) 
        ani.init(); 
      } 
      
}

function indicatorStatus(index) {
   indicator_link.forEach((curent, index)=>{
        curent.classList.remove("on");
   })
   indicator_link[index].classList.add("on");  
   indexControl(index);  
}

function indexControl(index) {    
  slideGap = index - slideNow;
  if(slideGap < 0) { slideGap = Math.abs(slideGap); }
    
  slideNow = index;
  slidePrev = index < 1 ? panel_len-1 : index - 1;
  slideNext = index >= panel_len-1 ? 0 : index + 1;  
}
 
 
 function AnimationFrame(selector, option) {
   //console.log("AnimationFrame start!!");
   this.element = selector;
   this.parent = this.element.parentElement;
   this.parent_size = parseInt(getComputedStyle(this.parent)["width"]);
   this.start = performance.now();  
   this.cancel = null;
   this.currentValue;
   this.progress;
   this.prop = option.prop ;
   this.option_value = option.value;
   this.value = parseInt(this.option_value);
   (this.option_value.indexOf("px") === -1) ? this.type = "%" : this.type = "px";
   this.duration = option.duration;
   this.callback = option.callback; 
   if(option.slideGap !== null) this.slideGap = option.slideGap ;
   if(option.panelSet !== null) this.panelSet = option.panelSet; 
   if(option.btnName !== null) (option.btnName === "btnNext") ? this.btnName = "btnNext" : this.btnName = "btnPrev";
   this.addValue = 0;
   this.isFrist = true;
   
   AnimationFrame.prototype.init = () => {       
     if(this.slideGap >= 2 && this.btnName == "btnNext") {
         console.log("this.btnName == btnNext");
         this.panelSet();
         if(this.slideGap >= 3) this.addValue = -100;
         console.log("this.addValue >>> " + this.addValue);
     } else if (this.slideGap >= 2 && this.btnName == "btnPrev") {
         console.log("this.btnName == btnPrev");        
         if(this.slideGap >= 3) { this.addValue = 0; 
             for(let i=2;i<=this.slideGap;i++) this.panelSet();
         } else {
             this.panelSet();
         }
     } 
     
     if(this.type === "%") { this.currentValue = parseInt(getComputedStyle(this.element)[this.prop])/this.parent_size*100;}
     else { this.currentValue = parseInt(getComputedStyle(this.element)[this.prop]) }     
     this.cancel = window.requestAnimationFrame((time)=>this.run(time)); 
   }  
   
   AnimationFrame.prototype.run = (timestamp) =>{
       const timeLast  = timestamp - this.start;
       this.progress  = timeLast /this.duration;  
 
       if(this.progress  < 0) this.progress  = 0;
       if(this.progress > 1) { if (this.isFrist) { this.progress = 1; this.isFrist = false } }
 
       if(this.progress  <= 1){
         window.requestAnimationFrame(this.run);
         let result = this.currentValue + (((this.value + this.addValue)-this.currentValue) * this.progress);
         this.element.style[this.prop] = `${result}%`;   
       } else {
         cancelAnimationFrame(this.cancel);
         setTimeout(()=>{
           if(this.slideGap >= 3) { 
             if(this.btnName == "btnPrev") for(let i=this.slideGap-1;i<this.slideGap;i++) { this.callback(); }
             if(this.btnName == "btnNext") for(let i=this.slideGap-1;i<=this.slideGap;i++) { this.callback(); }
           } else { this.callback(); }         
         }, 0)
       }
   }
   
 }
