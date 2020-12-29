function sliderInit(slider) {
    let thumb = slider.querySelector(".thumb");

    let startPosition = parseInt(getComputedStyle(thumb).left);
    let endPosition = slider.clientWidth - startPosition * 2;

    slider.dataset.value = Math.max(0, slider.dataset.value);
    slider.dataset.value = Math.min(100, slider.dataset.value)

    thumb.style.left = (endPosition - startPosition) * slider.dataset.value / 100 + startPosition + "px";

    thumb.addEventListener("mousedown", (event) => {
        let shift = event.clientX - thumb.getBoundingClientRect().left;

        function moveAt(pageX) {
          let left = pageX - shift - startPosition - slider.getBoundingClientRect().left - pageXOffset + thumb.offsetWidth;

          left = Math.max(left, startPosition);
          left = Math.min(left, endPosition);

          slider.dataset.value = 100 * (left - startPosition) / (endPosition - startPosition);
          thumb.style.left = left + 'px';
        }

        function onMouseMove(event) {
          moveAt(event.pageX);
        }

        document.addEventListener('mousemove', onMouseMove);
        
        function destructor(){
          document.removeEventListener('mousemove', onMouseMove);
          thumb.onmouseup = null;
        }

        thumb.addEventListener("mouseup", destructor);
        document.addEventListener("mouseup", destructor);

      });

      thumb.addEventListener("dragstart", (event) => {
        event.preventDefault();
      });
}

function slidersInit(){
    for(let slider of document.querySelectorAll(".slider")){
      sliderInit(slider)
    }
}

slidersInit();