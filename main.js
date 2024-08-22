const backButton = document.createElement("button");
backButton.textContent = "Voltar"
backButton.style.position = "absolute"
backButton.style.top = "20px"
backButton.style.left = "150px"
backButton.style.padding = "10px"
backButton.style.fontSize = "16px"
backButton.style.cursor = "pointer"
backButton.style.backgroundColor = "transparent";
backButton.style.color = "#fff"
backButton.style.border = "none"
backButton.style.borderRadius = "5px"
backButton.style.transition = "background-color 0.3s ease";
backButton.style.fontStyle = "bold"
document.body.appendChild(backButton)

backButton.addEventListener("mouseenter", function () {
  backButton.style.backgroundColor = "#1d4d34"
});

backButton.addEventListener("mouseleave", function () {
  backButton.style.backgroundColor = "transparent"
});

backButton.addEventListener("click", function () {
  window.history.back()
});


const canvasEl = document.querySelector("canvas"),

        canvasCtx = canvasEl.getContext("2d"),
        gapX = 10  

      const mouse = { x: 0, y: 0 }

      const field = {
        w: window.innerWidth,
        h: window.innerHeight,
        draw: function () {
          canvasCtx.fillStyle = "#286047"
          canvasCtx.fillRect(0, 0, this.w, this.h)
        },
      }

      const line = {
        w: 15,
        h: field.h,
        draw: function () {
          canvasCtx.fillStyle = "#ffffff"
          canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h)
        },
      }

      const leftPaddle = {
        x: gapX,
        y: 0,
        w: line.w,
        h: 200,
        _move: function () {
          this.y = mouse.y - this.h / 2
        },
        draw: function () {
          canvasCtx.fillStyle = "#ffffff"
          canvasCtx.fillRect(this.x, this.y, this.w, this.h)

          this._move()
        },
      }

      const rightPaddle = {
        x: field.w - line.w - gapX,
        y: 0,
        w: line.w,
        h: 200,
        speed: 3,
        _move: function () {
          if (this.y + this.h / 2 < ball.y + ball.r) {
            this.y += this.speed
          } else {
            this.y -= this.speed
          }
        },
        speedUp: function () {
          this.speed += 1
        },
        draw: function () {
          canvasCtx.fillStyle = "#ffffff"
          canvasCtx.fillRect(this.x, this.y, this.w, this.h)
          this._move()
        },
      }

      const score = {
        human: 0,
        computer: 0,
        increaseHuman: function () {
          this.human++
        },
        increaseComputer: function () {
          this.computer++
        },
        draw: function () {
          canvasCtx.font = "bold 72px Arial"
          canvasCtx.textAlign = "center"
          canvasCtx.textBaseline = "top"
          canvasCtx.fillStyle = "#01341D"
          canvasCtx.fillText(this.human, field.w / 4, 50)
          canvasCtx.fillText(this.computer, field.w / 4 + field.w / 2, 50)
        },
      }

      const ball = {
        x: field.w / 2,
        y: field.h / 2,
        r: 20,
        speed: 5,
        directionX: 1,
        directionY: 1,
        _calcPosition: function () {
          if (this.x > field.w - this.r - rightPaddle.w - gapX) {
            if (
              this.y + this.r > rightPaddle.y &&
              this.y - this.r < rightPaddle.y + rightPaddle.h
            ) {
              this._reverseX()
            } else {
              score.increaseHuman()
              this._pointUp()
            }
          }

          if (this.x < this.r + leftPaddle.w + gapX) {
            if (
              this.y + this.r > leftPaddle.y &&
              this.y - this.r < leftPaddle.y + leftPaddle.h
            ) {
              this._reverseX()
            } else {
              score.increaseComputer()
              this._pointUp()
            }
          }

          if (
            (this.y - this.r < 0 && this.directionY < 0) ||
            (this.y > field.h - this.r && this.directionY > 0)
          ) {
            this._reverseY()
          }
        },
        _reverseX: function () {
          this.directionX *= -1
        },
        _reverseY: function () {
          this.directionY *= -1
        },
        _speedUp: function () {
          this.speed += 1
        },
        _pointUp: function () {
          this._speedUp()
          rightPaddle.speedUp()

          this.x = field.w / 2
          this.y = field.h / 2
        },
        _move: function () {
          this.x += this.directionX * this.speed
          this.y += this.directionY * this.speed
        },
        draw: function () {
          canvasCtx.fillStyle = "#ffffff"
          canvasCtx.beginPath()
          canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
          canvasCtx.fill()

          this._calcPosition()
          this._move()
        },
      }

      function setup() {
        canvasEl.width = canvasCtx.width = field.w
        canvasEl.height = canvasCtx.height = field.h
      }

      function draw() {
        field.draw()
        line.draw()

        leftPaddle.draw()
        rightPaddle.draw()

        score.draw()

        ball.draw()
      }

      window.animateFrame = (function () {
        return (
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function (callback) {
            return window.setTimeout(callback, 1000 / 60)
          }
        )
      })()

      function main() {
        animateFrame(main)
        draw()
      }

      setup()
      main()

      canvasEl.addEventListener("mousemove", function (e) {
        mouse.x = e.pageX
        mouse.y = e.pageY
      })