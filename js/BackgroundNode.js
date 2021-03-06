'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var BackgroundNode = (function () {
  function BackgroundNode(positions, id) {
    _classCallCheck(this, BackgroundNode);

    this.id = id;
    this.size = App.backgroundSizes[this.id];

    this.initializeContainer();
    this.initializeAnimations(positions);

    this.draw();
    this.container.x = positions[0][0];
    this.container.y = positions[0][1];
    this.animate();
  }

  _createClass(BackgroundNode, [{
    key: 'initializeContainer',
    value: function initializeContainer(container) {
      this.container = new createjs.Container();
    }
  }, {
    key: 'initializeAnimations',
    value: function initializeAnimations(positions) {
      this.animation = positions.map(function (position) {
        return { x: position[0], y: position[1] };
      });
    }
  }, {
    key: 'globalCoords',
    value: function globalCoords() {
      return this.path.container.localToGlobal(this.container.x, this.container.y);
    }
  }, {
    key: 'color',
    value: function color() {
      return App.colors.backgroundNodes;
    }
  }, {
    key: 'draw',
    value: function draw() {
      this.container.removeAllChildren();
      clearTimeout(this.timeout);

      if (this.activity() && this.activity().level) {
        this.drawActiveCircle(this.activity().level);
      }

      var node = new createjs.Shape();
      if (this.size < 3) {
        node.graphics.beginFill(this.color()).drawCircle(0, 0, 2 + 2 * this.size);
      } else {
        node.graphics.setStrokeStyle(1).beginStroke(this.color()).drawCircle(0, 0, 15);
      }

      this.container.addChild(node);

      // let text = new createjs.Text(this.id, "10px Open Sans", App.colors.black);
      // text.set({
      //   textAlign: 'center'
      // });
      // text.y = -8;
      // this.container.addChild(text);
    }
  }, {
    key: 'x',
    value: function x() {
      return this.container.x;
    }
  }, {
    key: 'y',
    value: function y() {
      return this.container.y;
    }
  }, {
    key: 'drawActiveCircle',
    value: function drawActiveCircle(level) {
      var _this = this;

      if (level == 2) {
        this.drawCircle();
        this.timeout = setTimeout(function () {
          return _this.drawCircle();
        }, 1000);
      } else {
        this.drawCircle(Math.random() * 5000);
      }
    }
  }, {
    key: 'drawCircle',
    value: function drawCircle(wait) {
      var size = 6;

      if (!wait) wait = 0;

      var circle = new createjs.Shape();
      circle.graphics.beginRadialGradientFill([createjs.Graphics.getRGB(819, 0), this.color()], [0, 1], 100, 100, size / 2, 100, 100, size).drawCircle(100, 100, size);
      circle.regX = 100;
      circle.regY = 100;
      circle.alpha = 0.75;
      var scale = 1 + Math.sqrt(this.size) * 3;
      createjs.Tween.get(circle, { loop: true }).wait(wait).to({ scaleX: scale, scaleY: scale, alpha: 0 }, 2000, createjs.Ease.cubicOut());

      this.container.addChild(circle);
      this.container.setChildIndex(circle, 0);
    }
  }, {
    key: 'animate',
    value: function animate() {
      var points = [];
      this.animation.forEach(function (point) {
        return points.push(point.x, point.y);
      });

      var curvePoints = Array.prototype.slice.call(getCurvePoints(points, 1, 20, true));
      curvePoints.push(points[0], points[1]);
      curvePoints = _.chunk(curvePoints, 2);

      var convertedPoints = [this.container.x, this.container.y];;

      for (var i = 0; i < curvePoints.length - 2; i++) {
        var point = curvePoints[i];
        var nextPoint = curvePoints[i + 1];

        var xc = (point[0] + nextPoint[0]) / 2;
        var yc = (point[1] + nextPoint[1]) / 2;

        convertedPoints.push(xc, yc, nextPoint[0], nextPoint[1]);
      }

      createjs.Tween.get(this.container, { loop: true, useTicks: true }).to({ guide: { path: convertedPoints } }, 3000);
    }
  }, {
    key: 'activity',
    value: function activity() {
      return App.activity[this.id];
    }
  }, {
    key: 'title',
    value: function title() {
      return this.activity().title;
    }
  }, {
    key: 'count',
    value: function count() {
      return this.activity().count;
    }
  }, {
    key: 'openPage',
    value: function openPage() {
      var event = new CustomEvent('openPage', { detail: { node: this } });
      document.dispatchEvent(event);
    }
  }, {
    key: 'update',
    value: function update() {
      if (this.opened) {
        $('body .popup').css({ left: this.globalCoords().x, top: this.globalCoords().y });
      }
    }
  }]);

  return BackgroundNode;
})();