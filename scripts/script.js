

class Pixel{
    constructor (position, colour){
        //array with an x and y [x,y]
        this.position = position
        //colour is a string 'black'
        this.colour = colour
    }
}

let cached_pixel_array = []

let old_cached_arrays = []

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
                   //console.log("enter" + css_pixel.id)
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
            switch(brush_stroke) {
            case "pencil":
                setPixelColor(pixel, selected_colour)
                autofill_array.push(pixel)
                if (autofill_array.length == 2) {
                    pencilAutofill()
                }
                break
            case "thin brush":
                let pixelx = pixel.position[0]
                let pixely = pixel.position[1]
                setPixelColor(pixel, selected_colour)
                autofill_array.push(pixel)
                findPixelandSetColour(pixelx - 1, pixely)
                findPixelandSetColour(pixelx + 1, pixely)

                findPixelandSetColour(pixelx, pixely + 1)
                findPixelandSetColour(pixelx, pixely - 1)
                if (autofill_array.length == 2) {
                    pencilAutofill()
                }
                break
            
            //more cases when necessary
            }
        }
    }

    onPixelClick(pixel) {
        switch(brush_stroke) {
            case "pencil":
                setPixelColor(pixel, selected_colour)
                break
            case "thin brush":
                let pixelx = pixel.position[0]
                let pixely = pixel.position[1]
                setPixelColor(pixel, selected_colour)

                findPixelandSetColour(pixelx - 1, pixely)
                findPixelandSetColour(pixelx + 1, pixely)

                findPixelandSetColour(pixelx, pixely + 1)
                findPixelandSetColour(pixelx, pixely - 1)
                break
        }
    }

    selectColour(colour){
        selected_colour = colour;
    }

    setUpPallete(){
        const colours = ["black","red","orange","#ffec3f","lime", "turquoise", "blue", "purple", "darkgreen"]

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

//USER CONTROLS
//++++++++++++++
//ALL USER OPERATIONS ARE HERE 
let is_clicked = false
let brush_stroke = 'pencil'
brush_stroke = 'thin brush'



document.body.addEventListener("mousedown", (event) => {
    if (event.button === 0) {
        if (!old_cached_arrays.includes(cached_pixel_array) && cached_pixel_array.length > 0) {
            old_cached_arrays.push(cached_pixel_array)
        }
        cached_pixel_array = []
        is_clicked = true
    }
})

document.body.addEventListener("mouseup", (event) => {
    if (event.button === 0) {
        is_clicked = false
        autofill_array = []
        if (cached_pixel_array.length > 0) {
            old_cached_arrays.push(cached_pixel_array.slice())
            cached_pixel_array = []
        }
    }
})

document.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });


let selected_colour = "black"
let saved_colour

//eraser
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

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "z") {
        event.preventDefault(); 
        undoLastStroke(); 
    }
});


function undoLastStroke() {
    if (old_cached_arrays.length > 0) {
        old_cached_arrays[old_cached_arrays.length - 1].forEach(pixel => {
            let old_colour = pixel.colour 
            let old_position = pixel.position

            setPixelColor(getPixelByPosition(old_position[0], old_position[1]), old_colour)
        })
    }
    old_cached_arrays.splice((old_cached_arrays.length - 1), 1)
}




//canvas controls
const total_rows = 100
const total_columns = 100


document.documentElement.style.setProperty('--col', total_columns);
document.documentElement.style.setProperty('--row', total_rows);

let MainCanvas = new Canvas(total_rows, total_columns)

MainCanvas.setUpPallete()
MainCanvas.setUpCanvas(MainCanvas)


//quality of life methods

function getPixelByPosition(x, y) {
    for (pixel of MainCanvas.pixel_list) {
        if (pixel.position[0] == x && pixel.position[1] == y) {
            return pixel
        }       
    }
    console.log("pixel not found")
    return -1
}

function setPixelColor(pixel, color) {
    if (pixel.colour != selected_colour) {
        let cached_pixel = new Pixel([...pixel.position], pixel.colour)
        cached_pixel_array.push(cached_pixel)
    }
    pixel.colour = color 
    document.getElementById(pixel.position).style.backgroundColor = color
}

function findPixelandSetColour(x, y) {
    let foundpixel = getPixelByPosition(x, y)
    if (foundpixel != -1) {
        setPixelColor(foundpixel, selected_colour)
    }
}

//this attempts to make sure when the mouse moves fast, it still fills in the space between in a single click
let autofill_array = []
function pencilAutofill() {
    let pixel1position = autofill_array[0].position;
    let pixel2position = autofill_array[1].position;

    let distance_x = Math.abs(pixel2position[0] - pixel1position[0])
    let distance_y = Math.abs(pixel2position[1] - pixel1position[1])
    
    if (distance_x > 1 || distance_y > 1) {
        let rise = pixel2position[1] - pixel1position[1]
        let run = pixel2position[0] - pixel1position[0]
        console.log(rise, run)
        let hyp = (Math.sqrt((distance_x * distance_x) + (distance_y * distance_y)))
        let pixels_to_draw = Math.round(hyp)

        let xinc = 0
        let yinc = 0

        if (run != 0) {
            xinc = run / pixels_to_draw
        }
        if (rise != 0) {
            yinc = rise / pixels_to_draw
        }
        let moverx = pixel1position[0]
        let movery = pixel1position[1]
        
        for(i = 0; i <= pixels_to_draw; i++) {
            moverx += xinc
            movery += yinc

            //console.log(moverx, movery, xinc, yinc)
            //console.log(Math.round(moverx), Math.round(movery))
            switch (brush_stroke) {
                case "pencil":
                    findPixelandSetColour(Math.round(moverx), Math.round(movery))
                    break
                case "thin brush":
                    //console.log('active')
                    findPixelandSetColour(Math.round(moverx), Math.round(movery))

                    findPixelandSetColour(Math.round(moverx) + 1, Math.round(movery))
                    findPixelandSetColour(Math.round(moverx) - 1, Math.round(movery))

                    findPixelandSetColour(Math.round(moverx), Math.round(movery) + 1)
                    findPixelandSetColour(Math.round(moverx), Math.round(movery) - 1)
                    break
            }
        }
    }
    autofill_array.shift()
}

