class Pixel{
    constructor (position, colour){
        //array with an x and y [x,y]
        this.position = position
        //colour is a string 'black'
        this.colour = colour
    }
}

class Canvas {
    constructor(total_rows, total_columns) {
        this.total_rows = total_rows
        this.total_columns = total_columns

        this.pixel_list = []

        
    }


    setUpCanvas(canvasObject) {
        const default_colour = 'red'

        let grid = document.createElement('div');
        grid.className = 'grid';
        for (let i = 1; i<=total_rows; i++) {
            for (let j = 1; j<=total_columns; j++) {
                let new_pixel = new Pixel([i,j], default_colour);
                let css_pixel = document.createElement('div');
                css_pixel.className = 'pixel'; 
                css_pixel.id = new_pixel.position
                document.documentElement.style.setProperty('--pixel-colour', new_pixel.colour);
                css_pixel.addEventListener('click', () => {
                   this.onPixelClick(new_pixel);
                });  
                grid.appendChild(css_pixel);
                canvasObject.pixel_list.push(new_pixel); 
            }
        }
        document.body.appendChild(grid);
    }

    onPixelClick(pixel) {
        pixel.colour = "black"
        document.getElementById(pixel.position).style.backgroundColor = pixel.colour
    }
}

const total_rows = 10
const total_columns = 10

document.documentElement.style.setProperty('--col', total_columns);
document.documentElement.style.setProperty('--row', total_rows);

let MainCanvas = new Canvas(total_rows, total_columns)
MainCanvas.setUpCanvas(MainCanvas)

//MainCanvas.pixel_list.forEach(printer)

//function printer(item) {
//    console.log(item)
//}