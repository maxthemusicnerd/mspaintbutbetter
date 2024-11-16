

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
        const default_colour = 'white'

        let grid = document.createElement('div');
        grid.className = 'grid';
        for (let i = 1; i<=total_rows; i++) {
            for (let j = 1; j<=total_columns; j++) {
                let new_pixel = new Pixel([i,j], default_colour);
                let css_pixel = document.createElement('div');
                css_pixel.className = 'pixel'; 
                css_pixel.id = new_pixel.position
                document.documentElement.style.setProperty('--pixel-colour', new_pixel.colour);
                css_pixel.addEventListener('mouseenter', () => {
                   this.onPixelHover(new_pixel);
                   console.log("enter" + css_pixel.id)
                });  
                css_pixel.addEventListener('click', () => {
                    this.onPixelClick(new_pixel);
                 });
                grid.appendChild(css_pixel);
                canvasObject.pixel_list.push(new_pixel); 
            }
        }
        document.body.appendChild(grid);
    }

    onPixelHover(pixel) {
        if (is_clicked == true) {
            pixel.colour = selected_colour
            document.getElementById(pixel.position).style.backgroundColor = pixel.colour
            edited_array.push(pixel)
        }
    }

    onPixelClick(pixel) {
        pixel.colour = selected_colour
        document.getElementById(pixel.position).style.backgroundColor = pixel.colour
    }

    selectColour(colour){
        selected_colour = colour;
    }

    setUpPallete(){
        const colours = ["black","red","orange","yellow","green", "turquoise", "blue", "brown", "purple"]

        let pallete = document.createElement('div');
        pallete.className = 'pallete';

        for(let i = 0; i < colours.length; i++){
            let palleteColour = document.createElement('div');
            palleteColour.className = 'colours'; 
            pallete.appendChild(palleteColour);
            
            palleteColour.style.backgroundColor = colours[i]
            palleteColour.addEventListener("click", (e) =>{
                this.selectColour(colours[i])
            })
        }
        document.body.appendChild(pallete)
    }
}

//user controls
let is_clicked = false

document.body.addEventListener("mousedown", (event) => {
    if (event.button === 0) {
        is_clicked = true
        console.log('in')
    }
})

document.body.addEventListener("mouseup", (event) => {
    if (event.button === 0) {
        is_clicked = false
        console.log('out')
    }
})


let selected_colour = "black"
let saved_colour
//this is test code to be removed, just wanna be able to change colours
document.body.addEventListener("contextmenu", (event) => {
    // Prevent the default context menu
    event.preventDefault();
    if (selected_colour != "white") {
        saved_colour = selected_colour
        selected_colour = "white"
    } else {
        selected_colour = saved_colour
    }

  });

//canvas controls
const total_rows = 100
const total_columns = 100


document.documentElement.style.setProperty('--col', total_columns);
document.documentElement.style.setProperty('--row', total_rows);

let MainCanvas = new Canvas(total_rows, total_columns)

MainCanvas.setUpPallete()
MainCanvas.setUpCanvas(MainCanvas)









//test code

function getPixelByPosition(x, y) {
    MainCanvas.pixel_list.forEach(pixel => {
        if (pixel.position[0] == x && pixel.position[1] == y)
            return pixel
    })
    console.log("pixel not found")
}



let edited_array = []

function test() {
    let x = false
    let y = false

    pixel1position = edited_array[0].position;
    pixel2position = edited_array[1].position;
    distance_x = pixel1position[0] - pixel2position[0]
    distance_y = pixel1position[1] - pixel2position[1]
    if (-1 <= distance_x && distance_x <= 1) {
        x = true
    }
    if (-1 <= distance_y && distance_y <= 1) {
        y = true
    }

    if (x == false | y == false) {
        let x_fill = []
        let y_fill = []

        for (i = pixel1position[0]; i != pixel2position[0]; i += (distance_x / Math.abs(distance_x))) {
            x_fill.push(i)
        }
        for (i = pixel1position[1]; i != pixel2position[1]; i += (distance_y / Math.abs(distance_y))) {
            y_fill.push(i)
        }
        if (x_fill.length > y_fill.length) {

        } else if (x_fill.length < y_fill.length) {

        } else {
            for (i = x_fill[0]; i != 1; i++) {}
        }
    }
    
    edited_array = []
}
//MainCanvas.pixel_list.forEach(printer)

//function printer(item) {
//    console.log(item)
//}

