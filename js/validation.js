'use strict';
// Валидация формы.

(function () {
  var NEW_HASHTAG = '#';
  var POSITION_HASHTAG = 0;
  var SHORT_STROKE = 2;
  var NORM_STROKE = 20;
  var NORM_HASHTAG = 5;
  var CHANCE_ERROR = 0;

  var hashTagField = document.querySelector('.upload-form-hashtags');

  var test = {
    hach: CHANCE_ERROR,
    unique: CHANCE_ERROR,
    amount: CHANCE_ERROR,
    long: CHANCE_ERROR
  };

  var checkTag = function (tags) {
    tags.forEach(function (stroke) {
      if (tags.indexOf(stroke) !== -1) {
        test.unique++;
      }
      if (stroke[POSITION_HASHTAG] !== NEW_HASHTAG) {
        test.hach++;
      }
      if (stroke.length < SHORT_STROKE || stroke.length > NORM_STROKE) {
        test.long++;
      }
    });

    if (tags.length > NORM_HASHTAG) {
      test.amount++;
    }

    return test;
  };

  var onInputСhange = function (evt) {
    checkTag(hashTagField.value.toLowerCase().split(/\s{1,}/));

    if (test.hach !== CHANCE_ERROR) {
      evt.target.setCustomValidity('Хэш-теги должны начинаться с ' + NEW_HASHTAG);
    } else if (test.long !== CHANCE_ERROR) {
      evt.target.setCustomValidity('Длинна хэш-тега от ' + SHORT_STROKE + ' до ' + NORM_STROKE + ' символов.');
    } else if (test.amount !== CHANCE_ERROR) {
      evt.target.setCustomValidity('Введите не более ' + NORM_HASHTAG + ' хэш-тегов.');
    } else if (test.unique !== CHANCE_ERROR) {
      evt.target.setCustomValidity('Хэш-теги не должны повторяться.');
    } else {
      evt.target.setCustomValidity('');
    }

    test = {
      hach: CHANCE_ERROR,
      unique: CHANCE_ERROR,
      amount: CHANCE_ERROR,
      long: CHANCE_ERROR
    };
  };

  hashTagField.addEventListener('change', onInputСhange);
})();
