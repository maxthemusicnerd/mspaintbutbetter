

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
                pixel.colour = selected_colour
                document.getElementById(pixel.position).style.backgroundColor = pixel.colour
                autofill_array.push(pixel)
                if (autofill_array.length == 2) {
                    //pencilAutofill()
                }
            //more cases when necessary
            }
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

let cached_pixel_array

document.body.addEventListener("mousedown", (event) => {
    if (event.button === 0) {
        cached_pixel_array = MainCanvas.pixel_list.map(pixel => 
            new Pixel([...pixel.position], pixel.colour)
        );
        is_clicked = true
        //console.log('in')
    }
})

document.body.addEventListener("mouseup", (event) => {
    if (event.button === 0) {
        is_clicked = false
        autofill_array = []
        //console.log('out')
    }
})

document.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });


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

document.addEventListener("keydown", (event) => {
    if (event.key == "u") {
        undoLastStroke()
    }
})


function undoLastStroke() {
    
    cached_pixel_array.forEach(pixel => {
        //console.log(pixel.position)
        let old_colour = pixel.colour
        let old_position = pixel.position

        setPixelColor(getPixelByPosition(old_position[0], old_position[1]), old_colour)
    })
}




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
    let correct_pixel = -1;
    MainCanvas.pixel_list.forEach(pixel => {
        //console.log(pixel.position[0],pixel.position[1], x, y)
        if (pixel.position[0] == x && pixel.position[1] == y)
            //console.log(pixel.position[0],pixel.position[1], x, y)
            correct_pixel = pixel
    })
    if (correct_pixel == -1) {
        console.log("pixel not found")
    }
    return correct_pixel 
}

function setPixelColor(pixel, color) {
    pixel.colour = color 
    document.getElementById(pixel.position).style.backgroundColor = color
}

let autofill_array = []


//this attempts to make sure when the mouse moves fast, it still fills in the space between in a single click
function pencilAutofill() {
    let x = false
    let y = false
    //console.log(edited_array)
    pixel1position = autofill_array[0].position;
    pixel2position = autofill_array[1].position;

    distance_x = pixel2position[0] - pixel1position[0]
    distance_y = pixel2position[1] - pixel1position[1]
    if (-1 <= distance_x && distance_x <= 1) {
        x = true
    }
    if (-1 <= distance_y && distance_y <= 1) {
        y = true
    }

    if (x == false || y == false) {
        let counterx = pixel1position[0]
        let countery = pixel1position[1]
        let xincrement; 

        
        if (Math.abs(distance_x) > Math.abs(distance_y)) {
            while (counterx != pixel2position[0]) {
                if (counterx < pixel2position[0]) {
                    xincrement = 1
                } else {
                    xincrement = -1
                }
                counterx += xincrement
                

                //console.log(counterx, countery)
                let thispixel = getPixelByPosition(counterx, countery)
                
                if (thispixel != -1) {
                    //console.log(thispixel.position)
                    thispixel.colour = selected_colour
                    
                    //console.log(document.getElementById(thispixel.position).style.backgroundColour)
                    document.getElementById(thispixel.position).style.backgroundColor = selected_colour
                }
            }
        } else if (Math.abs(distance_x) < Math.abs(distance_y)){
            while (countery != pixel2position[1]) {
                if (countery < pixel2position[1]) {
                    yincrement = 1
                } else {
                    yincrement = -1
                }
                
                countery += yincrement

                //console.log(counterx, countery)
                let thispixel = getPixelByPosition(counterx, countery)
                
                if (thispixel != -1) {
                    //console.log(thispixel.position)
                    thispixel.colour = selected_colour
                    
                    //console.log(document.getElementById(thispixel.position).style.backgroundColour)
                    document.getElementById(thispixel.position).style.backgroundColor = selected_colour
                }
            }
        } else if (Math.abs(distance_x) == Math.abs(distance_y)) {
            while (countery != pixel2position[1] && counterx != pixel2position[0]) {
                if (countery < pixel2position[1]) {
                    yincrement = 1
                } else {
                    yincrement = -1
                }
                if (counterx < pixel2position[0]) {
                    xincrement = 1
                } else {
                    xincrement = -1
                }
                
                counterx += xincrement
                countery += yincrement

                //console.log(counterx, countery)
                let thispixel = getPixelByPosition(counterx, countery)
                
                if (thispixel != -1) {
                    //console.log(thispixel.position)
                    thispixel.colour = selected_colour
                    
                    //console.log(document.getElementById(thispixel.position).style.backgroundColour)
                    document.getElementById(thispixel.position).style.backgroundColor = selected_colour
                }
            }
        }
    }
    //edited_array = []
    autofill_array.shift()
}
//MainCanvas.pixel_list.forEach(printer)

//function printer(item) {
//    console.log(item)
//}

