'use strict';
    var multiItemSlider = (function (){
      return function (selector, config) {
        var
          _mainElement = document.querySelector(selector), // основный элемент блока
          _sliderWrapper = _mainElement.querySelector('.slider__wrapper'), // обертка для .slider-item
          _sliderItems = _mainElement.querySelectorAll('.slider__item'), // элементы (.slider-item)
          _sliderControls = _mainElement.querySelectorAll('.slider__control'), // элементы управления
          _sliderControlLeft = _mainElement.querySelector('.slider__control_left'), // кнопка "LEFT"
          _sliderControlRight = _mainElement.querySelector('.slider__control_right'), // кнопка "RIGHT"
          _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
          _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента    
          _positionLeftItem = 0, // позиция левого активного элемента
          _transform = 0, // значение транфсофрмации .slider_wrapper
          _step = _itemWidth / _wrapperWidth * 100, // величина шага (для трансформации)
          _items = []; // массив элементов
        // наполнение массива _items
        _sliderItems.forEach(function (item, index) {
          _items.push({ item: item, position: index, transform: 0 });
        });

        var position = {
          getMin: 0,
          getMax: _items.length - 1,
        }

        var _transformItem = function (direction) {
          if (direction === 'right') {
            if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) >= position.getMax) {
              return;
            }
            if (!_sliderControlLeft.classList.contains('slider__control_show')) {
              _sliderControlLeft.classList.add('slider__control_show');
            }
            if (_sliderControlRight.classList.contains('slider__control_show') && (_positionLeftItem + _wrapperWidth / _itemWidth) >= position.getMax) {
              _sliderControlRight.classList.remove('slider__control_show');
            }
            _positionLeftItem++;
            _transform -= _step;
          }
          if (direction === 'left') {
            if (_positionLeftItem <= position.getMin) {
              return;
            }
            if (!_sliderControlRight.classList.contains('slider__control_show')) {
              _sliderControlRight.classList.add('slider__control_show');
            }
            if (_sliderControlLeft.classList.contains('slider__control_show') && _positionLeftItem - 1 <= position.getMin) {
              _sliderControlLeft.classList.remove('slider__control_show');
            }
            _positionLeftItem--;
            _transform += _step;
          }
          _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
        }

        // обработчик события click для кнопок "назад" и "вперед"
        var _controlClick = function (e) {
          if (e.target.classList.contains('slider__control')) {
            e.preventDefault();
            var direction = e.target.classList.contains('slider__control_right') ? 'right' : 'left';
            _transformItem(direction);
          }
        };

        var _setUpListeners = function () {
          // добавление к кнопкам "назад" и "вперед" обрботчика _controlClick для событя click
          _sliderControls.forEach(function (item) {
            item.addEventListener('click', _controlClick);
          });
        }

        // инициализация
        _setUpListeners();

        return {
          right: function () { // метод right
            _transformItem('right');
          },
          left: function () { // метод left
            _transformItem('left');
          }
        }

      }
    }());

    var slider = multiItemSlider('.slider')

/*
    Thumbelina Content Slider
    V1.0 Rev 1302190900

    A lightweight horizontal and vertical content slider designed for image thumbnails.
    http://www.starplugins.com/thumbelina

    Developed by Star Plugins
    http://www.starplugins.com

    Copyright 2013, Star Plugins, www.starplugins.com
    License: GNU General Public License, version 3 (GPL-3.0)
    http://www.opensource.org/licenses/gpl-3.0.html
*/
;(function($) {
    $.fn.Thumbelina = function(settings) {
        var $container = this,      // Handy reference to container.
            $list = $('ul',this),   // Handy reference to the list element.
            moveDir = 0,            // Current direction of movement.
            pos = 0,                // Current actual position.
            destPos = 0,            // Current destination position.
            listDimension = 0,      // Size (width or height depending on orientation) of list element.
            idle = 0,
            outerFunc,
            orientData;              // Stores function calls and CSS attribute for horiz or vert mode.
        
        // Add thumblina CSS class, and create an inner wrapping container, within which the list will slide with overflow hidden.
        $list.addClass('thumbelina').wrap('<div style="position:absolute;overflow:hidden;width:100%;height:100%;">');
        // Create settings by merging user settings into defaults.
        settings = $.extend({}, $.fn.Thumbelina.defaults, settings);
        
        // Depending on vertical or horizontal, get functions to call and CSS attribute to change.
        if(settings.orientation === 'vertical') 
            orientData = {outerSizeFunc:  'outerHeight', cssAttr: 'top', display: 'block'};
        else
            orientData = {outerSizeFunc:  'outerWidth', cssAttr: 'left', display: 'inline-block'};
       
        // Apply display type of list items.
        $('li',$list).css({display: orientData.display});
        
        // Function to bind events to buttons.
        var bindButEvents = function($elem,dir) {
            $elem.bind('mousedown mouseup touchend touchstart',function(evt) {
                if (evt.type==='mouseup' || evt.type==='touchend') moveDir = 0;
                else moveDir = dir;
                return false;
            });
        };
        
        // Bind the events.
        bindButEvents(settings.$bwdBut,1);
        bindButEvents(settings.$fwdBut,-1);
        
        // Store ref to outerWidth() or outerHeight() function.
        outerFunc = orientData.outerSizeFunc; 
   
        // Function to animate. Moves the list element inside the container.
        // Does various bounds checks.
        var animate = function() {
            var minPos;
            
            // If no movement or resize for 100 cycles, then go into 'idle' mode to save CPU.
            if (!moveDir && pos === destPos && listDimension === $container[outerFunc]() ) {  
                idle++;
                if (idle>100) return;
            }else {
                 // Make a note of current size for idle comparison next cycle.
                listDimension = $container[outerFunc]();
                idle = 0;
            }
          
            // Update destination pos.
            destPos += settings.maxSpeed * moveDir;
     
            // Work out minimum scroll position.
            // This will also cause the thumbs to drag back out again when increasing container size.
            minPos = listDimension - $list[outerFunc]();
            
          
            // Minimum pos should always be <= 0;
            if (minPos > 0) minPos = 0;
            // Bounds check (maximum advance i.e list moving left/up)
            if (destPos < minPos) destPos = minPos;
            // Bounds check (maximum retreat i.e list moving right/down)
            if (destPos>0) destPos = 0;
            
            // Disable/enable buttons depending min/max extents.
            if (destPos === minPos) settings.$fwdBut.addClass('disabled');
            else settings.$fwdBut.removeClass('disabled');
            if (destPos === 0) settings.$bwdBut.addClass('disabled');
            else settings.$bwdBut.removeClass('disabled');
            
            // Animate towards destination with a simple easing calculation.
            pos += (destPos - pos) / settings.easing;
            
            // If within 1000th of a pixel to dest, then just 'snap' to exact value.
            // Do this so pos will end up exactly == destPos (deals with rounding errors).
            if (Math.abs(destPos-pos)<0.001) pos = destPos;
            
            $list.css(orientData.cssAttr, Math.floor(pos));
        };
        
        setInterval(function(){
            animate();
        },1000/60);
    };
    
    $.fn.Thumbelina.defaults = {
        orientation:    "horizontal",   // Orientation mode, horizontal or vertical.
        easing:         8,              // Amount of easing (min 1) larger = more drift.
        maxSpeed:       5,              // Max speed of movement (pixels per cycle).
        $bwdBut:   null,                // jQuery element used as backward button.
        $fwdBut:    null                // jQuery element used as forward button.
    };
    
})(jQuery);