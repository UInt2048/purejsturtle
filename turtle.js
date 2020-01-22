//jshint esversion: 5
function Turtle(turtleCan, tImageCan, commandInput, definitionInput, resetButton) {
  "use strict";
  this.reset();

  this.reset = function reset() {
    // Canvas Variables
    this.turtleCan = turtleCan;
    this.turtleCon = turtleCan.getContext('2d');
    this.tImageCan = tImageCan;
    this.tImageCon = tImageCan.getContext('2d');
    this.tImageCon.textAlign = "center";
    this.tImageCon.textBaseline = "middle";
    this.turtleCon.globalCompositeOperation = "destination-over"; // Turtle takes precedence
    this.tImageCon.lineWidth = 1;
    this.tImageCon.globalAlpha = 1
    this.commandInput = commandInput;
    this.definitionInput = definitionInput;
    this.resetButton = resetButton;

    // Drawing Variables
    this.pos = {};
    this.pos.x = 0;
    this.pos.y = 0;
    this.angle = 0;
    this.penDown = true;
    this.width = 1;
    this.visible = true;
    this.redraw = true;
    this.wrap = true;
    this.color = {};
    this.color.r = 0;
    this.color.g = 0;
    this.color.b = 0;
    this.color.a = 1;

    // Declare Functions
    this.declareCanvasFuncs();
    this.declareDrawFuncs();
    this.clear();
  };

  // Canvas Functions

  this.declareCanvasFuncs = function declareCanvasFuncs() {
    this.createCanvas = function createCanvas(id, width, height, display) {
      var canvas = document.createElement('canvas');
      canvas.id = id;
      canvas.width = width || 300;
      canvas.height = height || 300;
      if (!display) canvas.setAttribute("style", "display:none;"); // Hide if display = false
      document.getElementById("canvas").appendChild(canvas);
      if (!display) this.scaleCanvas(id, width, height);
    };
    this.scaleCanvas = function scaleCanvas(id, width, height) {
      var _id = typeof id == "string" ? document.getElementById(id) : id;
      _id.style.width = width + "px";
      _id.style.height = height + "px";
      this.turtleCan.style.width = _id.style.width < this.turtleCan.style.width ?
        this.turtleCan.style.width : _id.style.width; // Ensure not larger than turtle canvas
    };
    this.setActiveCanvas = function setActiveCanvas(id) {
      this.tImageCan = document.getElementById(id);
      this.tImageCon = document.getElementById(id).getContext('2d');
    };
    // Draws a line in context; must have context.beginPath() and context.stroke()
    this.line = function line(x1, y1, x2, y2, context) {
      context = context || this.tImageCon;
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
    };
    // Draws a circle in context; must have context.beginPath() and context.stroke()
    this.circle = function circle(x, y, radius, context) {
      context = context || this.tImageCon;
      context.arc(x, y, radius, 0, 2 * Math.PI);
    };
    // Draws a rect in context with top-left corner at x,y; must have context.beginPath() and context.stroke()
    this.rect = function rect(x, y, width, height, context) {
      context = context || this.tImageCon;
      context.rect(x, y, width, height);
    };
    // Alters canvas line width
    this.setWidth = function setWidth(width, context) {
      context = context || this.tImageCon;
      context.lineWidth = width;
    };
    // Alters canvas line color
    this.setColor = function setColor(r, g, b, a, context) {
      context = context || this.tImageCon;
      context.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
    };
    // Alters canvas fill color
    this.fillColor = function fillColor(r, g, b, a, context) {
      context = context || this.tImageCon;
      context.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
    };
    // Inserts image on canvas; CORS is used to allow images from other sites
    this.addImage = function addImage(url, _x, _y, _context) {
      var x = _x || 0,
        y = _y || 0,
        context = _context || this.tImageCon,
        i = new Image();
      i.crossOrigin = "Anonymous";
      i.src = url;
      i.onload = function() {
        context.drawImage(i, x, y);
        this.drawIf();
      };
    };
    // Returns image data from canvas
    this.getImage = function getImage(x, y, width, height, context) {
      context = context || this.tImageCon;
      context.getImageData(x, y, width, height);
    };
    // Put image data onto canvas
    this.putImage = function putImage(data, x, y, context) {
      context = context || this.tImageCon;
      context.putImageData(data, x, y);
      this.drawIf();
    };
    // Gets red from pixel in image data
    this.getRed = function getRed(data, x, y) {
      var pos = 4 * data.width * y + 4 * x;
      return data.data[pos];
    };
    // Gets green from pixel in image data
    this.getGreen = function getGreen(data, x, y) {
      var pos = 4 * data.width * y + 4 * x;
      return data.data[pos + 1];
    };
    // Gets blue from pixel in image data
    this.getBlue = function getBlue(data, x, y) {
      var pos = 4 * data.width * y + 4 * x;
      return data.data[pos + 2];
    };
    // Gets alpha from pixel in image data
    this.getAlpha = function getAlpha(data, x, y) {
      var pos = 4 * data.width * y + 4 * x;
      return data.data[pos + 3];
    };
    // Sets red to pixel in image data
    this.setRed = function setRed(data, x, y, r) {
      var pos = 4 * data.width * y + 4 * x;
      data.data[pos] = r;
    };
    // Sets green to pixel in image data
    this.setGreen = function setGreen(data, x, y, g) {
      var pos = 4 * data.width * y + 4 * x;
      data.data[pos + 1] = g;
    };
    // Sets blue to pixel in image data
    this.setBlue = function setBlue(data, x, y, b) {
      var pos = 4 * data.width * y + 4 * x;
      data.data[pos + 2] = b;
    };
    // Sets alpha to pixel in image data
    this.setAlpha = function setAlpha(data, x, y, a) {
      var pos = 4 * data.width * y + 4 * x;
      data.data[pos + 3] = a;
    };
    // Sets RGB to pixel in image data
    this.setRGB = function setRGB(data, x, y, r, g, b, a) {
      var pos = 4 * data.width * y + 4 * x;
      data.data[pos] = r;
      data.data[pos + 1] = g;
      data.data[pos + 2] = b;
      data.data[pos + 3] = a;
    };
    // clear the display, don't move the turtle
    this.clear = function clear() {
      this.clearContext();
      this.drawIf();
    };
    this.clearContext = function clearContext(context) {
      context = context || this.tImageCon;
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      context.restore();
    };
  };

  // Drawing Functions

  this.declareDrawFuncs = function declareDrawFuncs() {
    // draw the turtle and the current image if redraw is true
    // for complicated drawings it is much faster to turn redraw off
    this.drawIf = function drawIf() {
      if (this.redraw) this.draw();
    };

    // use canvas centered coordinates facing upwards
    this.centerCoords = function centerCoords(context) {
      context = context || this.tImageCon;
      var width = context.canvas.width,
        height = context.canvas.height;
      context.translate(width / 2, height / 2);
      context.transform(1, 0, 0, -1, 0, 0);
    };

    // draw the turtle and the current image
    this.draw = function draw() {
      this.clearContext(this.turtleCon);
      if (this.visible) {
        var x = this.pos.x;
        var y = this.pos.y;
        var w = 10;
        var h = 15;
        this.turtleCon.save();
        // use canvas centered coordinates facing upwards
        this.centerCoords(this.turtleCon);
        // move the origin to the turtle center
        this.turtleCon.translate(x, y);
        // rotate about the center of the turtle
        this.turtleCon.rotate(-this.angle);
        // move the turtle back to its position
        this.turtleCon.translate(-x, -y);
        // draw the turtle icon
        this.turtleCon.beginPath();
        this.turtleCon.moveTo(x - w / 2, y);
        this.turtleCon.lineTo(x + w / 2, y);
        this.turtleCon.lineTo(x, y + h);
        this.turtleCon.closePath();
        this.turtleCon.fillStyle = "red";
        this.turtleCon.fill();
        this.turtleCon.restore();
      }
      this.turtleCon.drawImage(this.tImageCan, 0, 0, 300, 300, 0, 0, 300, 300);
    };

    // Trace the forward motion of the turtle, allowing for possible
    // wrap-around at the boundaries of the canvas.
    this.forward = function forward(distance) {
      if (distance < 0) return this.backward(-distance);

      var xWrap = function(cutBound, otherBound) { // wrap on the X boundary
          var distanceToEdge = Math.abs((cutBound - this.pos.x) / sinAngle);
          var edgeY = cosAngle * distanceToEdge + this.pos.y;
          this.tImageCon.lineTo(cutBound, edgeY);
          distance -= distanceToEdge;
          this.pos.x = otherBound;
          this.pos.y = edgeY;
        },
        yWrap = function(cutBound, otherBound) { // wrap on the Y boundary
          var distanceToEdge = Math.abs((cutBound - this.pos.y) / cosAngle);
          var edgeX = sinAngle * distanceToEdge + this.pos.x;
          this.tImageCon.lineTo(edgeX, cutBound);
          distance -= distanceToEdge;
          this.pos.x = edgeX;
          this.pos.y = otherBound;
        },
        noWrap = function() { // don't wrap the turtle on any boundary
          this.tImageCon.lineTo(newX, newY);
          this.pos.x = newX;
          this.pos.y = newY;
          distance = 0;
        };
      this.tImageCan.save();
      this.centerCoords(this.tImageCan);
      this.tImageCan.beginPath();
      // get the boundaries of the canvas
      var maxX = this.tImageCan.canvas.width / 2,
        minX = -this.tImageCan.canvas.width / 2,
        maxY = this.tImageCan.canvas.height / 2,
        minY = -this.tImageCan.canvas.height / 2;
      // trace out the forward steps
      while (distance > 0) {
        // move the to current location of the turtle
        this.tImageCon.moveTo(this.pos.x, this.pos.y);
        // calculate the new location of the turtle after doing the forward movement
        var cosAngle = Math.cos(this.angle);
        var sinAngle = Math.sin(this.angle);
        var newX = this.pos.x + sinAngle * distance;
        var newY = this.pos.y + cosAngle * distance;
        // if wrap is on, trace a part segment of the path and wrap on boundary if necessary
        if (this.wrap) {
          if (newX > maxX) xWrap(maxX, minX);
          else if (newX < minX) xWrap(minX, maxX);
          else if (newY > maxY) yWrap(maxY, minY);
          else if (newY < minY) yWrap(minY, maxY);
          else noWrap();
        } else noWrap(); // wrap is not on.
      }
      // only draw if the pen is currently down.
      if (this.penDown) this.activeContext.stroke();
      this.activeContext.restore();
      this.drawIf();
    };

    // Move backward
    this.backward = function backward(distance) {
      if (distance < 0) return this.forward(-distance);
      this.left(180);
      this.forward(distance);
      this.left(180);
    };

    // turn edge wrapping on/off
    this.setWrap = function setWrap(bool) {
      this.wrap = bool;
    };

    // show/hide the turtle
    this.hideTurtle = function hideTurtle() {
      this.visible = false;
      this.drawIf();
    };

    // show/hide the turtle
    this.showTurtle = function showTurtle() {
      this.visible = true;
      this.drawIf();
    };

    // turn on/off redrawing
    this.redrawOnMove = function redrawOnMove(bool) {
      this.redraw = bool;
    };

    // lift up the pen (don't draw)
    this.setPenUp = function setPenUp() {
      this.penDown = false;
    };
    // put the pen down (do draw)
    this.setPenDown = function setPenDown() {
      this.penDown = true;
    };

    // turn right by an angle in degrees
    this.right = function right(angle) {
      this.angle += this.degToRad(angle);
      this.drawIf();
    };

    // turn left by an angle in degrees
    this.left = function left(angle) {
      this.angle -= this.degToRad(angle);
      this.drawIf();
    };

    // move the turtle to a particular coordinate (don't draw on the way there)
    this.goto = function goto(x, y) {
      this.pos.x = x;
      this.pos.y = y;
      this.drawIf();
    };

    // set the angle of the turtle in degrees
    this.setAngle = function setAngle(angle) {
      this.angle = this.degToRad(angle);
    };

    // convert degrees to radians
    this.degToRad = function degToRad(deg) {
      return deg / 180 * Math.PI;
    };
    // convert radians to degrees
    this.radToDeg = function radToDeg(rad) {
      return rad * 180 / Math.PI;
    };

    // set the width of the line
    this.setWidth = function setWidth(w) {
      this.width = w;
      this.tImageCon.lineWidth = w;
    };

    // write some text at the turtle position facing up
    this.write = function write(msg) {
      this.tImageCon.save();
      this.centerCoords(this.activeContext);
      this.tImageCon.translate(this.pos.x, this.pos.y);
      this.tImageCon.transform(1, 0, 0, -1, 0, 0);
      this.tImageCon.translate(-this.pos.x, -this.pos.y);
      this.tImageCon.fillText(msg, this.pos.x, this.pos.y);
      this.tImageCon.restore();
      this.drawIf();
    };

    // sets text font
    this.setFont = function setFont(font) {
      this.activeContext.font = font;
    };

    // set the colour of the line using RGB values in the range 0 - 255.
    this.colour = function colour(r, g, b, a) {
      this.tImageCon.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
      this.tImageCon.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
      this.colour.r = r;
      this.colour.g = g;
      this.colour.b = b;
      this.colour.a = a;
    };

    // Create an arc going counterclockwise from turtle's position
    this.arc = function arc(radius, angle, clockwise) {
      this.tImageCon.save();
      this.centerCoords(this.tImageCon);
      this.tImageCon.beginPath();
      var startangle = this.angle - 0.5 * Math.PI,
        endangle = clockwise ? startangle - this.degToRad(angle) : startangle + this.degToRad(angle);
      this.tImageCon.arc(this.pos.x + Math.sin(this.angle) * radius,
        this.pos.y + Math.cos(this.angle) * radius, radius, startangle, endangle, clockwise);
      if (this.penDown) this.activeContext.stroke();
      this.tImageCon.restore();
      this.drawIf();
    };

    // Create a filled-in circle centered at turtle's position
    this.dot = function dot(radius) {
      this.tImageCon.save();
      this.centerCoords(this.tImageCon);
      this.tImageCon.beginPath();
      this.tImageCon.arc(this.pos.x, this.pos.y, radius, 0, 2 * Math.PI, false);
      this.tImageCon.fill();
      if (this.penDown) this.tImageCon.stroke();
      this.tImageCon.restore();
      this.drawIf();
    };

    // Generate a random integer between low and hi
    this.random = function random(low, hi) {
      return Math.floor(Math.random() * (hi - low + 1) + low);
    };
    // Calls f after given ms
    this.animate = function animate(f, ms) {
      setInterval(f, ms);
    };
  };

  // UI Functions
  this.commandFunction = function commandFunction() {
    // Navigate command history	
    var commandList = [];
    var currentCommand = 0;
    // Moves up and down in command history	
    this.commandInput.addEventListener("keydown", function(e) {
      if (e.key == "ArrowUp") {
        currentCommand--;
        if (currentCommand < 0) currentCommand = 0;
        this.commandInput.value = commandList[currentCommand];
      } else if (e.key == "ArrowDown") {
        currentCommand++;
        if (currentCommand > commandList.length) currentCommand = commandList.length;
        var command = commandList[currentCommand] == undefined ? "" : commandList[currentCommand];
        this.commandInput.value = command;
      }
    }, false);
    // Execute the program when the command box is changed	
    // (when the user presses enter)	
    this.commandInput.addEventListener("change", function() {
      var commandText = this.commandInput.value;
      commandList.push(commandText);
      var definitionsText = this.definitionInput.value;
      try {
        // execute code
        eval(definitionsText + "\n" +commandText);
      } catch (e) {
        window.alert('Exception thrown:\n' + e);
        throw e;
      } finally {
        // clear the command box	
        this.commandInput.value = "";
      }
    });
    this.resetButton.addEventListener("click", this.reset);
  };
}
