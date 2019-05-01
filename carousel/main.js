const CAROUSEL_SETTINGS = {
  activeClass: 'active',
  disabledClass: 'disabled',
  btnPrev: 'a.btn-prev',
  btnNext: 'a.btn-next',
  currentStep: 0,
  step: 1,
  visibleSlide: 3
}

window.addEventListener('load', function() {
	new Carousel();
});

function Carousel() {
  this.$el = document.getElementsByClassName('carousel-holder');
  this.$element = document.getElementsByClassName('carousel');
	this.$mask = document.getElementsByClassName('mask');
  this.$slideset = document.getElementsByClassName('slideset');
  this.$slides = document.getElementsByClassName('slide');

  this.currentStep = CAROUSEL_SETTINGS.currentStep;

	this.init();
	this.registerEvents();
}

Carousel.prototype = {
  init: function() {
    this.setSlideWidth();
    this.addButtons();
    this.calculateOffsets();
    this.refreshDisabledState();
  },

  setSlideWidth: function() {
    const maskSize = this.$mask[0].offsetWidth;
    const slideWidth =  Math.round(maskSize / CAROUSEL_SETTINGS.visibleSlide);

    for (var i = 0; i < this.$slides.length; i++) {
      this.$slides[i].style.width = slideWidth +"px";
    }
  },

  addButtons: function() {
    if(true) {
      this.$prev = document.createElement('a');
      this.$prev.setAttribute('class', 'slide__btn slide__btn--prev');
      this.$prev.setAttribute('href', '#');
      this.$element[0].appendChild(this.$prev);

      this.$next = document.createElement('a');
      this.$next.setAttribute('class', 'slide__btn slide__btn--next');
      this.$next.setAttribute('href', '#');
      this.$element[0].appendChild(this.$next);
    }
    
  },

  calculateOffsets: function() {
    const slideSize = this.$slides[0].offsetWidth;
    let sumSize = this.getSlidesetSize();
    this.maxOffset = slideSize*CAROUSEL_SETTINGS.visibleSlide - sumSize;

    if (typeof CAROUSEL_SETTINGS.step === 'number' && CAROUSEL_SETTINGS.step > 0) {
      let tmpOffset = tmpStep = 0;
      this.stepOffsets = [0];
      this.stepsCount = 0;
      this.slideDimensions = [];

      for (var i = 0; i < this.$slides.length; i++) {
        this.slideDimensions.push(this.$slides[i].offsetWidth)
      }

      while (tmpOffset > this.maxOffset) {
        tmpOffset -= this.getSlideSize(tmpStep, tmpStep + CAROUSEL_SETTINGS.step);
        tmpStep += CAROUSEL_SETTINGS.step;
        this.stepOffsets.push(Math.max(tmpOffset, this.maxOffset));
        this.stepsCount++;
      }

      this.$slideset[0].style.marginLeft = this.stepOffsets[this.currentStep] +"px";
    }
  },

  getSlidesetSize: function() {
    let sum = 0;

    for (var i = 0; i < this.$slides.length; i++) {
      sum += this.$slides[i].offsetWidth
    }
    this.$slideset[0].style.width = sum +"px";
    return sum;
  },

  getSlideSize: function(i1, i2) {
    let sum = 0;

    for (var i = i1; i < Math.min(i2, this.$slides.length); i++) {
      sum += this.slideDimensions[i];
    }
    return sum;
  },

  registerEvents: function() {
    this.$next.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.nextSlide();
    });
    this.$prev.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.prevSlide();
    });
  },
  
  prevSlide: function() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.switchSlide();
    }
  },

  nextSlide: function() {
    if (this.currentStep < this.stepsCount) {
      this.currentStep++;
      this.switchSlide();
    }
  },

  switchSlide: function() {
    this.tmpPosition = this.getStepOffset();
    this.$slideset[0].style.marginLeft = this.tmpPosition +"px";
    this.refreshDisabledState();
  },

  getStepOffset: function(step) {
    if (typeof CAROUSEL_SETTINGS.step === 'number') {
      return this.stepOffsets[this.currentStep];
    } else {
      return Math.min(0, Math.max(-this.currentStep * this.stepSize, this.maxOffset));
    }
  },

  refreshDisabledState: function() {
    if (this.currentStep === 0) {
      this.$prev.classList.add(CAROUSEL_SETTINGS.disabledClass);
    } else {
      this.$prev.classList.remove(CAROUSEL_SETTINGS.disabledClass);
    }

    if (this.currentStep === this.stepsCount) {
      this.$next.classList.add(CAROUSEL_SETTINGS.disabledClass);
    } else {
      this.$next.classList.remove(CAROUSEL_SETTINGS.disabledClass);
    }
  }
}
