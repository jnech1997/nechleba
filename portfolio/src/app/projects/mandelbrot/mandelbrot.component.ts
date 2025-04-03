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
      img_set_start: 1.0,
      img_set_end: -1.0, 
      max_iterations: 150,
      zoom_factor: 10,
      show_coordinates: true
    };

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
      if (col == data.width - 1 && params.show_coordinates) {
        // draw coordinates after finishing mandelbrot drawing
        const center_real = (params.real_set_start + params.real_set_end) / 2;
        const center_img = (params.img_set_start + params.img_set_end) / 2;
        context.font = '16px Arial';
        context.fillStyle = 'white';
        context.fillText(`center point c = (a + bi)`, isMobile ? 20 : 10, isMobile ? 80 : 20);
        context.fillText(`a: ${center_real.toFixed(2)}`, isMobile ? 20 : 10, isMobile ? 100 : 40);
        context.fillText(`b: ${center_img.toFixed(2)}`, isMobile ? 20 : 10, isMobile ? 120 : 60);
      }
      if (col == data.width - 1 && !!this.worker) {
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

    // Sketch function of CanvasSketch: 
    // Initalizes WebWorker inline from Blob JS script 
    // to process mandelbrot calculations
    const sketch = ({context, width, height}) => {
      const isMobile = this.mobileQuery.matches;
      const max_iterations = params.max_iterations;
      // set canvas dimensions
          return ({context, width, height}) => {
            // create new mandelbrot worker from an anonymous function body
            let blobURL = URL.createObjectURL( new Blob([ '(',
              // WebWorker received mandelbrot calculation request 
              // from Main thread
              function() {
                onmessage = e => {
                  const data = e.data;
                  const col = data.col;
                  const isMobile = data.isMobile;
                  const max_iterations = data.max_iterations;
                  const width = data.width;
                  // complex plane coordinate is calculated by computing the fraction of the pixel coord
                  // on width/height of canvas, then getting the proportional position on the real/complex range
                  let columnArray = [];
                  for (let row = 0; row < data.height; row++) {
                    let x, y;
                    if (data.isMobile) {
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
                    let mandelbrot_calculation = mandelbrot(c, isMobile, max_iterations);
                    let column_entry = { 
                      iterations: mandelbrot_calculation[0], 
                      isMandelbrotSet: mandelbrot_calculation[1],
                    }
                    columnArray.push(column_entry); 
                  }
                  postMessage([columnArray, data]);
                }
                // compute whether a given complex number c iterates to infinity given a max_iterations limit
                // mandelbrot --> f_c(n+1) = f_c(n)^2 + c, f_c(0) = 0
                function mandelbrot(c, isMobile, max_iterations) {
                  let z = { x: 0, y: 0 } // initial value for f_c(0) = 0, given any c, is always set to 0
                  let count = 0, magnitude = 0;
                  while (magnitude <= 2 && count < max_iterations) {
                    // if mobile flip x and y axes so canvas is rendered vertically
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
              }.toString(), ')()' ], { type: 'application/javascript' }) );
          // Initialize WebWorker
          this.worker = new Worker(blobURL);
          // Listen for messages from the worker
          // to call draw function on canvas
          this.worker.onmessage = draw;
          // Begin the drawing by iterating through 
          // columns of canvas and calculating Mandelbrot in WebWorker one
          // column at a time
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

    // Initialize Tweakpane UI control
    const createPane = () => {
      const pane = new tweakPane.Pane();
      document.getElementById("paneContainer").appendChild(pane.element);
      let folder;
      folder = pane.addFolder({ 
        title: 'Click to Zoom!',
        expanded: this.mobileQuery.matches ? false : true
      });
      const info = pane.addButton({
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
      folder.addBinding(params, 'max_iterations', { min: 100, max: 5000, step: 1 });
      folder.addBinding(params, 'show_coordinates');
      folder.addBinding(params, 'zoom_factor', { min: 5, max: 20});
      const unzoom = pane.addButton({
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
          canvasSketch(sketch, settings);
        }
      });
      const recompute = pane.addButton({
        title: 'Recompute'
      });
      recompute.on('click', () => {
        if (!!this.worker) {
          this.worker.terminate();
        }
        canvasSketch(sketch, settings);
      });
      const reset = pane.addButton({
        title: 'Reset'
      });
      reset.on('click', () => {
        if (!!this.worker) {
          this.worker.terminate();
        }
        this.bounds = [];
        params.real_set_start = -2.0;
        params.real_set_end = 1.0;
        params.img_set_start = 1.0;
        params.img_set_end = -1.0;
        params.max_iterations = 150;
        params.zoom_factor = 10;
        params.show_coordinates = true;
        pane.refresh();
        canvasSketch(sketch, settings);
      });
      const screenshot = pane.addButton({
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
    };

    // Set Zoom on click function to define "zoomed in"
    // bounds of complex plane based on zoom factor
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
      let zoom_factor_real = ((params.real_set_end - params.real_set_start) / params.zoom_factor);
      let zoom_factor_img = ((params.img_set_end - params.img_set_start) / params.zoom_factor);
      let isMobile = this.mobileQuery.matches;
      // coount for flip of axes if on mobile
      zoom_factor_real = isMobile ? zoom_factor_img : zoom_factor_real; 
      zoom_factor_img = isMobile ? zoom_factor_real : zoom_factor_img;
      // calculate coordinate of point on canvas in complex plane
      let fraction_width = canvasRelativeX/this.canvas.width;
      let fraction_height = canvasRelativeY/this.canvas.height;
      let real_value = params.real_set_start + (isMobile ? fraction_height : fraction_width) * (params.real_set_end - params.real_set_start);
      let img_value = params.img_set_start + (isMobile ? fraction_width : fraction_height) * (params.img_set_end - params.img_set_start);
      // update the real and imaginary set's start and end to create a zoomed in square
      params.real_set_start = real_value - zoom_factor_real;
      params.real_set_end = real_value + zoom_factor_real;
      params.img_set_start = img_value - zoom_factor_img;
      params.img_set_end = img_value + zoom_factor_img;
      canvasSketch(sketch, settings);
    });

    // MAIN: Create the Tweakpane, Draw the Canvas
    createPane();
    canvasSketch(sketch, settings);
  }

  onCloseSidenav() {
    this.infoSidenav.toggle(); 
    document.getElementsByClassName('cdk-drag-handle')[0].getElementsByTagName('svg')[0].setAttribute('color', 'white');
  }
}
