import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as canvasSketch from 'canvas-sketch';
import * as tweakPane from 'tweakpane';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { DragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-mandelbrot',
  templateUrl: './mandelbrot.component.html',
  styleUrl: './mandelbrot.component.scss',
  standalone: false
})
export class MandelbrotComponent implements OnInit, AfterViewInit {
  // canvas to draw Mandelbrot set
  canvas: HTMLCanvasElement;
  // isMobile tracker
  mobileQuery: MediaQueryList;
  // bounds of complex plane for each "zoom",
  // tracked here in order to undo navigation through mandelbrot
  bounds = [];
  // sidenav for more information display
  @ViewChild('infoSidenav') infoSidenav: MatSidenav;
  // worker for mandelbrot calculations
  worker: Worker;
  // pane for UI controls
  pane: tweakPane.Pane;

  constructor(public media: MediaMatcher, public dragDropService : DragDrop) {}

  ngOnInit() {
    // Append canvas to DOM to be used in CanvasSketch
    this.canvas = document.createElement("canvas");
    this.canvas.id = "canvas";
    document.getElementById("graphContainer").appendChild(this.canvas);
    this.mobileQuery = this.media.matchMedia('(max-width: 821px)');
  }

  ngAfterViewInit(): void {
    // Get context of canvas
    let context = this.canvas.getContext("2d");  
    
    // Init settings for CanvasSketch
    const settings = {
      dimensions: this.mobileQuery.matches ? [600, 1080] : [1080, 600],
      canvas: this.canvas
    }

    // Init settings for Tweakpane Pane
    let params = {
      real_set_start: -2.0,
      real_set_end: 1.0,
      img_set_start: this.mobileQuery.matches ? -1.0 : 1.0,
      img_set_end: this.mobileQuery.matches ? 1.0 : -1.0,
      max_iterations: 150,
      zoom_factor: 10,
      write_details: true,
      a: "-0.50000000000000000",
      b: "0.0000000000000000"
    };

    /** Sketch function of CanvasSketch: 
      Initalizes WebWorker inline from Blob JS script 
      and draws Mandelbrot to canvas */
    const sketch = ({context, width, height}) => {
      const isMobile = this.mobileQuery.matches;
      const max_iterations = params.max_iterations;

      return ({context, width, height}) => {
        // create Mandelbrot Worker from an anonymous function body
        let blobURL = URL.createObjectURL( new Blob([ '(',
          // WebWorker received mandelbrot calculation request 
          // from Main thread
          function() {
            onmessage = e => {
              const data = e.data;
              const col = data.col;
              const isMobile = data.isMobile;
              const max_iterations = data.max_iterations;
              // complex plane coordinate is calculated by computing the fraction of the pixel coord
              // on width/height of canvas, then getting the proportional position on the real/complex range
              // compute for all rows in this column col
              let columnArray = [];
              for (let row = 0; row < data.height; row++) {
                let x, y;
                if (data.isMobile) {
                  // axis value == set start + fraction of axis relative to canvas * length of axis
                  x = data.img_set_start + (col / data.width) * (data.img_set_end - data.img_set_start);
                  y = data.real_set_start + (row / data.height) * (data.real_set_end - data.real_set_start);
                }
                else {
                  x = data.real_set_start + (col / data.width) * (data.real_set_end - data.real_set_start);
                  y = data.img_set_start + (row / data.height) * (data.img_set_end - data.img_set_start);
                }
                let c = {
                  x: x, 
                  y: y
                }
                // compute if c is in the mandelbrot set
                let mandelbrot_calculation = mandelbrot(c, isMobile, max_iterations);
                let column_entry = { 
                  iterations: mandelbrot_calculation[0], 
                  isMandelbrotSet: mandelbrot_calculation[1],
                }
                columnArray.push(column_entry); 
              }
              // send result of all column calculations back to main thread to draw
              postMessage([columnArray, data]);
            }
            // compute whether a given complex number c iterates to infinity given a max_iterations limit
            // mandelbrot --> f_c(n+1) = f_c(n)^2 + c, f_c(0) = 0
            function mandelbrot(c, isMobile, max_iterations) {
              let z = { x: 0, y: 0 } // initial value for f_c(0) = 0, given any c, is always set to 0
              let count = 0, magnitude = 0;
              while (magnitude <= 2 && count < max_iterations) {
                // if mobile flip real and img axes so canvas is rendered vertically
                let z_squared_real_term = Math.pow(z.x, 2) - Math.pow(z.y, 2);
                let z_squared_img_term = 2 * z.x * z.y;
                let z_squared = {
                  x: isMobile ? z_squared_img_term : z_squared_real_term,
                  y: isMobile ? z_squared_real_term : z_squared_img_term
                }
                let z_real_term = z_squared.x + c.x;
                let z_img_term = z_squared.y + c.y;
                z = {
                  x: isMobile ? z_img_term : z_real_term,
                  y: isMobile ? z_real_term : z_img_term
                }
                magnitude = Math.sqrt(Math.pow(z.x, 2) + Math.pow(z.y, 2))
                count += 1
              }
              return [count, magnitude <= 2]
            }
          }.toString(), ')()' ], { type: 'application/javascript'}));
          // Initialize WebWorker from above blob
          this.worker = new Worker(blobURL);
          // Set listener for messages from the Worker thread
          // to call draw function on canvas
          this.worker.onmessage = draw;
          // Begin the drawing by iterating through 
          // columns of canvas and sending the Mandelbrot calculation 
          // task for all columns to the worker one at a time
          for (let col = 0; col < width; col++) {
            this.worker.postMessage({
              isMobile: isMobile,
              max_iterations: max_iterations,
              col: col, 
              width: width,
              height: height,
              real_set_start: params.real_set_start,
              real_set_end: params.real_set_end,
              img_set_start: params.img_set_start,
              img_set_end: params.img_set_end,
            });
          }
      }
    }

    // Main thread WebWorker message handler to draw
    // one column of the canvas at a time
    function draw (event) {
      const column = event.data[0];
      const data = event.data[1];
      const col = data.col;
      const max_iterations = data.max_iterations;
      const isMobile = data.isMobile;
      // iterate through all rows in this column
      for (let row = 0; row < column.length; row++) {
        const isMandelbrotSet = column[row].isMandelbrotSet;
        if (isMandelbrotSet) {
          // color black
          context.fillStyle = "black";
          context.fillRect(col, row, 1, 1);
        }
        else {
          // not in set, interpolate from black to red to white
          // depending on how many iterations the mandelbrot function
          // took to be unbounded
          context.fillStyle = interpolateColor(column[row].iterations, max_iterations);
          context.fillRect(col, row, 1, 1);
        }
      }
      if (col == data.width - 1 && params.write_details) {
        // after last calculation, overlay coordinates/other info
        const center_real = (params.real_set_start + params.real_set_end) / 2;
        const center_img = (params.img_set_start + params.img_set_end) / 2;
        context.font = '16px Arial';
        context.fillStyle = 'white';
        if (isMobile) {
          context.fillText(`center point c = (a + bi)`, 20, 80);
          context.fillText(`a: ${center_real.toPrecision(17)}`, 20, 100);
          context.fillText(`b: ${center_img.toPrecision(17)}`, 20, 120);
          context.fillText(`max iterations: ${params.max_iterations}`, 20, 140);
        }
        else {
          context.fillText(`center point c = (a + bi)`, 10, 20);
          context.fillText(`a: ${center_real.toPrecision(17)}`, 10, 40);
          context.fillText(`b: ${center_img.toPrecision(17)}`, 10, 60);
          context.fillText(`max iterations: ${params.max_iterations}`, 10, 80);
        }
      }
      if (col == data.width - 1 && !!this.worker) {
        // terminate the worker after all columns are drawn
        this.worker.terminate();
      }
    };

    // Return interpolated color from black to white
    // based on value within range 0 -> n
    function interpolateColor(value, n) {
      if (value < 0) value = 0;
      if (value > n) value = n;
      let r, g, b;
      let mid = n / 2;
      // first half black to red
      if (value < mid) {
          let ratio = value / mid;
          r = Math.round(255 * (ratio));
          g = 0;
          b = 0;
      } else {
      // second half red to white
          let ratio = (value - mid) / mid;
          r = 255;
          g = Math.round(255 * ratio);
          b = Math.round(255 * ratio);
      }
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    } 

    // Initialize Tweakpane UI control
    const createPane = () => {
      this.pane = new tweakPane.Pane();
      document.getElementById("paneContainer").appendChild(this.pane.element);
      let folder;
      folder = this.pane.addFolder({ 
        title: 'Click to Zoom!',
        expanded: this.mobileQuery.matches ? false : true
      });
      // add inputs
      folder.addBinding(params, 'a');
      folder.addBinding(params, 'b');
      folder.addBinding(params, 'max_iterations', { min: 100, max: 2000, step: 1 });
      folder.addBinding(params, 'write_details');
      folder.addBinding(params, 'zoom_factor', { min: 5, max: 20});
      // add buttons and handlers
      const info = this.pane.addButton({
        title: 'About'
      });
      info.on('click', () => {
        this.infoSidenav.toggle();
        if (this.infoSidenav.opened) {
          document.getElementsByClassName('cdk-drag-handle')[0].getElementsByTagName('svg')[0].setAttribute('color', 'black');
        }
        else {
          document.getElementsByClassName('cdk-drag-handle')[0].getElementsByTagName('svg')[0].setAttribute('color', 'white');
        }
      });
      const set_center = this.pane.addButton({
        title: 'Zoom at (a + bi)'
      });
      set_center.on('click', () => {
        if (!!this.worker) {
          this.worker.terminate();
        }
        // Track the bounds of the current canvas so they can be reinitialized 
        // for unzoom
        this.bounds.push({
          real_set_start: params.real_set_start,
          real_set_end: params.real_set_end,
          img_set_start: params.img_set_start,
          img_set_end: params.img_set_end
        });
        // calculate new bounds from center
        let a = parseFloat(params.a);
        let b = parseFloat(params.b);
        // zoom amount in complex magnitude, standard real as x and img as y
        let zoom_factor_real = (params.real_set_end - params.real_set_start) / params.zoom_factor;
        let zoom_factor_img =  (params.img_set_end - params.img_set_start) / params.zoom_factor;
        // update bounds based on new center
        params.real_set_start = (a - zoom_factor_real);
        params.real_set_end = a + zoom_factor_real;
        params.img_set_start = b - zoom_factor_img;
        params.img_set_end = b + zoom_factor_img;
        // update new real and imaginary components of center in UI pane
        params.a = ((params.real_set_end + params.real_set_start) / 2.0).toPrecision(17)
        params.b = ((params.img_set_end + params.img_set_start) / 2.0).toPrecision(17);
        this.pane.refresh();
        // redraw the set at the zoomed in level
        canvasSketch(sketch, settings);
      });
      const unzoom = this.pane.addButton({
        title: 'Undo Zoom'
      });
      // unzoom by reinitializing complex plane real and img
      // bounds to previous values
      unzoom.on('click', () => {
        if (!!this.worker) {
          this.worker.terminate();
        }
        let last_coords = this.bounds.pop();
        if (last_coords) {
          params.real_set_start = last_coords.real_set_start;
          params.real_set_end = last_coords.real_set_end;
          params.img_set_start = last_coords.img_set_start;
          params.img_set_end = last_coords.img_set_end;
          // update new real and imaginary components in UI pane
          params.a = ((params.real_set_end + params.real_set_start) / 2.0).toPrecision(17)
          params.b = ((params.img_set_end + params.img_set_start) / 2.0).toPrecision(17);
          this.pane.refresh();
          canvasSketch(sketch, settings);
        }
      });
      const recompute = this.pane.addButton({
        title: 'Recompute'
      });
      recompute.on('click', () => {
        if (!!this.worker) {
          this.worker.terminate();
        }
        canvasSketch(sketch, settings);
      });
      const reset = this.pane.addButton({
        title: 'Reset'
      });
      reset.on('click', () => {
        if (!!this.worker) {
          this.worker.terminate();
        }
        this.bounds = [];
        params.real_set_start = -2.0;
        params.real_set_end = 1.0;
        params.img_set_start = this.mobileQuery.matches ? -1.0 : 1.0;
        params.img_set_end = this.mobileQuery.matches ? 1.0 : -1.0;
        params.max_iterations = 150;
        params.zoom_factor = 10;
        params.write_details = true;
        // update new real and imaginary components in UI pane
        params.a = ((params.real_set_end + params.real_set_start) / 2.0).toPrecision(17)
        params.b = ((params.img_set_end + params.img_set_start) / 2.0).toPrecision(17);
        this.pane.refresh();
        canvasSketch(sketch, settings);
      });
      const screenshot = this.pane.addButton({
        title: 'Screenshot'
      });
      screenshot.on('click', () => {
        let downloadLink = document.createElement('a');
        downloadLink.setAttribute('download', 'MandelbrotSet.png');
        this.canvas.toBlob(blob => {
          let url = URL.createObjectURL(blob);
          downloadLink.setAttribute('href', url);
          downloadLink.click();
        });
        
      });
      const coords = this.pane.addButton({
        title: 'Save Coordinates'
      });
      coords.on('click', () => {
          let downloadPositionLink = document.createElement('a');
          downloadPositionLink.setAttribute('download', 'coordinates.txt');
          let text = `a: ${params.a}\nb: ${params.b}\nmax_iterations: ${params.max_iterations}\nzoom_factor: ${params.zoom_factor}`;
          // create a text file with the coordinates of the center point
          downloadPositionLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
          downloadPositionLink.click();
      });
    };

    // Zoom on click event handler
    this.canvas.addEventListener('click', e => {
      if (!!this.worker) {
        this.worker.terminate();
      }
      // Track the bounds of the current canvas so they can be reinitialized 
      // for unzoom
      this.bounds.push({
        real_set_start: params.real_set_start,
        real_set_end: params.real_set_end,
        img_set_start: params.img_set_start,
        img_set_end: params.img_set_end
      });
      // get bounding rectangle dimensions of canvas
      const rect = this.canvas.getBoundingClientRect();
      const elementRelativeX = e.clientX - rect.left;
      const elementRelativeY = e.clientY - rect.top;
      // coordinate of point on canvas
      const canvasRelativeX = elementRelativeX * this.canvas.width / rect.width;
      const canvasRelativeY = elementRelativeY * this.canvas.height / rect.height;
      // zoom amount in complex magnitude, standard real as x and img as y
      let zoom_factor_real = (params.real_set_end - params.real_set_start) / params.zoom_factor;
      let zoom_factor_img = (params.img_set_end - params.img_set_start) / params.zoom_factor;
      let isMobile = this.mobileQuery.matches;
      // calculate coordinate of point on canvas in complex plane
      let fraction_width = canvasRelativeX/this.canvas.width;
      let fraction_height = canvasRelativeY/this.canvas.height;
      // compute relative to canvas orientation
      let real_fraction = isMobile ? fraction_height : fraction_width;
      let img_fraction = isMobile ? fraction_width : fraction_height;
      let real_difference = params.real_set_end - params.real_set_start;
      let img_difference = params.img_set_end - params.img_set_start;
      // --> coords in complex plane
      let real_value = params.real_set_start + real_fraction * real_difference;
      let img_value = params.img_set_start + img_fraction * img_difference;
      // update the real and imaginary set's start and end to create a zoomed in square
      params.real_set_start = real_value - zoom_factor_real;
      params.real_set_end = real_value + zoom_factor_real;
      params.img_set_start = img_value - zoom_factor_img;
      params.img_set_end = img_value + zoom_factor_img;
      // update new real and imaginary components in UI pane
      params.a = ((params.real_set_end + params.real_set_start) / 2.0).toPrecision(17)
      params.b = ((params.img_set_end + params.img_set_start) / 2.0).toPrecision(17);
      this.pane.refresh();
      // redraw the canvas with new bounds
      canvasSketch(sketch, settings);
    });

    // MAIN: Create the Tweakpane, Draw the Canvas
    createPane();
    canvasSketch(sketch, settings);
  }

  /** Close sidenav from the close button */
  onCloseSidenav() {
    this.infoSidenav.toggle(); 
    // change color of close button to black when sidenav is open
    document.getElementsByClassName('cdk-drag-handle')[0].getElementsByTagName('svg')[0].setAttribute('color', 'white');
  }
}
