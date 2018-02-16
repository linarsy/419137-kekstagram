'use strict';
// Наложение фильтров на изображение.

(function () {
  var FULL_RESIZE = 1;
  var STEP_RESIZE = 0.25;
  var PREFIX_EFFECT = 'effect-';
  var FILTERS = ['none', 'chrome', 'sepia', 'marvin', 'phobos', 'heat'];
  var SIZE_CONTROL = 455;
  var sizeWindow = document.documentElement.clientWidth;
  var startPin = (sizeWindow - SIZE_CONTROL) / 2;
  var resize = FULL_RESIZE;

  var uploadFile = document.querySelector('#upload-file');
  var uploadOverlay = document.querySelector('.upload-overlay');
  var imagePreview = uploadOverlay.querySelector('.effect-image-preview');
  var effect = uploadOverlay.querySelectorAll('.upload-effect-preview');
  var filterSlider = uploadOverlay.querySelector('.upload-effect-level');
  var pin = filterSlider.querySelector('.upload-effect-level-pin');
  var valueEffectLine = filterSlider.querySelector('.upload-effect-level-val');
  var valueEffectInput = filterSlider.querySelector('.upload-effect-level-value');
  var minus = uploadOverlay.querySelector('.upload-resize-controls-button-dec');
  var plus = uploadOverlay.querySelector('.upload-resize-controls-button-inc');
  var resizeControls = uploadOverlay.querySelector('.upload-resize-controls-value');
  var uploadClose = uploadOverlay.querySelector('#upload-cancel');
  var uploadDescription = uploadOverlay.querySelector('.upload-form-description');
  var uploadHashtags = uploadOverlay.querySelector('.upload-form-hashtags');

  var scaleEffect = function (extent) {
    var scale = extent / SIZE_CONTROL;

    var filter = {
      none: 'none',
      chrome: 'grayscale(' + scale + ')',
      sepia: 'sepia(' + scale + ')',
      marvin: 'invert(' + scale * 100 + '%)',
      phobos: 'blur(' + scale * 3 + 'px)',
      heat: 'brightness(' + scale * 3 + ')'
    };

    if (scale < 0) {
      scale = 0;
    } else if (scale > 1) {
      scale = 1;
    }

    valueEffectInput.value = Math.round(scale * 100);
    valueEffectLine.style.width = valueEffectInput.value + '%';
    pin.style.left = valueEffectInput.value + '%';

    return filter;
  };

  var applyFilter = function (filter) {
    var name = imagePreview.classList[1].split(PREFIX_EFFECT);

    switch (name[1]) {
      case FILTERS[1]:
        imagePreview.style.filter = filter.chrome;
        break;
      case FILTERS[2]:
        imagePreview.style.filter = filter.sepia;
        break;
      case FILTERS[3]:
        imagePreview.style.filter = filter.marvin;
        break;
      case FILTERS[4]:
        imagePreview.style.filter = filter.phobos;
        break;
      case FILTERS[5]:
        imagePreview.style.filter = filter.heat;
        break;
      default:
        imagePreview.style.filter = filter.none;
    }
  };

  var toggleFilter = function (name) {
    var className = imagePreview.classList[1];
    imagePreview.classList.remove(className);

    if (name === FILTERS[0]) {
      filterSlider.hidden = 'hidden';
    } else {
      filterSlider.removeAttribute('hidden');
    }

    imagePreview.classList.add(PREFIX_EFFECT + name);
    applyFilter(scaleEffect(SIZE_CONTROL));
  };

  var effectClickHandler = function (evt) {
    var effectName = evt.target.parentElement.previousElementSibling.value;

    toggleFilter(effectName);
  };

  for (var i = 0; i < effect.length; i++) {
    effect[i].addEventListener('click', effectClickHandler);
  }

  // Управление ползунком.

  pin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = startCoords - moveEvt.clientX;
      startCoords = moveEvt.clientX;

      applyFilter(scaleEffect(pin.offsetLeft - shift));
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var filterSliderMouseUpHandler = function (evt) {
    var shift = (evt.clientX - startPin);

    applyFilter(scaleEffect(shift));
  };

  filterSlider.addEventListener('mouseup', filterSliderMouseUpHandler);

  // Изменение размера изображения.

  var applyResize = function (extent) {
    imagePreview.style.transform = 'scale(' + extent + ')';
    resizeControls.value = (extent * 100) + '%';
  };

  var resizeRise = function () {
    if (resize < FULL_RESIZE) {
      resize += STEP_RESIZE;
    }

    applyResize(resize);
  };

  var resizeDecline = function () {
    if (resize > STEP_RESIZE) {
      resize -= STEP_RESIZE;
    }

    applyResize(resize);
  };

  plus.addEventListener('click', function () {
    resizeRise();
  });

  minus.addEventListener('click', function () {
    resizeDecline();
  });

  // Открытие и закрытие формы редактирования изображения.

  var stopDefault = function (element) {
    element.addEventListener('keydown', function (evt) {
      window.util.isEscEvent(evt, function () {
        evt.stopPropagation();
      });
    });
  };

  var resetFilter = function () {
    resize = FULL_RESIZE;
    applyResize(FULL_RESIZE);
    toggleFilter(FILTERS[0]);
  };

  var openPopup = function () {
    resetFilter();
    uploadOverlay.classList.remove('hidden');
    stopDefault(uploadDescription);
    stopDefault(uploadHashtags);
    document.addEventListener('keydown', onPopupEscPress);
  };

  var closePopup = function () {
    uploadFile.value = '';
    uploadOverlay.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress);
  };

  var onPopupEscPress = function (evt) {
    window.util.isEscEvent(evt, closePopup);
  };

  uploadFile.addEventListener('change', function () {
    openPopup();
  });

  uploadClose.addEventListener('click', function () {
    closePopup();
  });

  uploadClose.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, closePopup);
  });
})();