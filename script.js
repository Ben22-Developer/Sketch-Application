//DOM elements initialization
const skecthContainer = document.getElementById('skecth-container');
const skecthPenColor = document.getElementById('mouse-drawing-color');
const sketchBackgroundColorDOM = document.getElementById('background-color');
const gridSelectorPassThroughLine = document.getElementById('square-grids-user-choice');
const skecthcContainerFunctionalities = document.getElementById('skecth-container-functionalities');
const linePassThroughBG =  document.getElementById('backgroundColoring')
const gridSelectorCircleButton = document.getElementById('circle-to-grab');
const gridRwsClsDisplayParagraph = document.getElementById('display-square-grids');
const gridRwsClsDisplaySpans = gridRwsClsDisplayParagraph.querySelectorAll('span');
const increaseOpacity = document.getElementById('increase-opacity');
const decreaseOpacity = document.getElementById('decrease-opacity');
const erasePenColor = document.getElementById('erase-pen-color');
const resetSketch = document.getElementById('reset-sketch');
const footer = document.querySelector('footer');
const header = document.querySelector('header');
let squareGrids,squareGridChilds;

//All functions declarations
let buttonColorReset,setGridRwsCls,startSetPenColor,setPenColor,startPenDrawing,stopPenDrawing,setPenDrawing,penDrawingSquares,sketchBackGroundColorFN;
let setSketchBackGroundColor,checkColorBrightness,increaseOpacityFN,decreaseOpacityFN,sketchBoolTrueToDecreaseOpacity,sketchBoolTrueToIncreaseOpacity;
let squareGridChildsOpacity,stopSquareGridChildsOpacity,squareGridOpacity,stopSquareGridOpacity,decreaseSquareGridChildOpacity,decreaseSquareGridOpacity;
let erasePenColorFN,eraseSketchFN,opposeEraseSketchFN,eraseSquareGridSketch,clickEraseSquareGridSketch,resetSketchFN;

//Other data types
let boolTrackMouseMvt,buttonSketchBool,shadeSketchButtonBool,eraseOrResetSketchBool,gridRwsCls,loop,penColor,dynamicColor,blackOpacity,backgroundColor;
boolTrackMouseMvt = false; //to track the time at which the user has ended to pick up the color and it's applies changes
buttonSketchBool = false; //to track the click if on buttons or the inputs clicks
shadeSketchButtonBool = null; //to track if the user is using the shading buttons
eraseOrResetSketchBool = null; //to track if the user erases or resets the sketch
gridRwsCls = 16;
dynamicColor = '#1dad00';
skecthPenColor.value = dynamicColor;
backgroundColor = '#bfbfbf';
sketchBackgroundColorDOM.value = backgroundColor;
skecthContainer.style.backgroundColor = backgroundColor;

//Functions to set the grid squares of a sketch
function stopUserChooseGridRwsCls() {
    document.removeEventListener('mousemove', userChooseGridRwsCls);
    if (boolTrackMouseMvt) {
        setGridRwsCls();
        boolTrackMouseMvt = false;
    }
}

const startUserChooseGridRwsCls = () => {
    buttonSketchBool = false;
    eraseOrResetSketchBool = null;
    shadeSketchButtonBool = null;
    document.addEventListener('mousemove', userChooseGridRwsCls);
    boolTrackMouseMvt = true;
    document.addEventListener('mouseup', stopUserChooseGridRwsCls);
}

const userChooseGridRwsCls = (e) => {
    let mouseOverCirclePosition,circlePosition;
    mouseOverCirclePosition = (e.clientX - (gridSelectorCircleButton.offsetWidth*1.5));
    circlePosition = Math.floor((mouseOverCirclePosition/gridSelectorPassThroughLine.offsetWidth)*100);
    gridSelectorCircleButton.style.left = `${circlePosition}%`;
    gridRwsCls = Math.floor((circlePosition/100)*64);
    linePassThroughBG.style.width = `${circlePosition}%`;
    gridRwsClsDisplaySpans[0].innerText = gridRwsCls;
    gridRwsClsDisplaySpans[1].innerText = gridRwsCls;
    if (circlePosition >= 100) {
        gridSelectorCircleButton.style.left = `${100}%`;
        gridRwsCls = 64;
        gridRwsClsDisplaySpans[0].innerText = gridRwsCls;
        gridRwsClsDisplaySpans[1].innerText = gridRwsCls;
        linePassThroughBG.style.width = `${100}%`;
    }
    else if (circlePosition <= 0) {
        gridSelectorCircleButton.style.left = `${0}%`;
        gridRwsCls = 1;
        gridRwsClsDisplaySpans[0].innerText = gridRwsCls;
        gridRwsClsDisplaySpans[1].innerText = gridRwsCls;
        linePassThroughBG.style.width = `${0}%`;
    }  
}

setGridRwsCls = () => {
    let squareGrid,squareGridChild;
    squareGrids = skecthContainer.querySelectorAll('.gridSquareClass');
    if (squareGrids) {
        for (loop = 0; loop<squareGrids.length; loop ++) {
            squareGrids[loop].remove();
        }
    }
    skecthContainer.style.gridTemplateColumns = `repeat(${gridRwsCls},${1}fr)`;
    for (loop = 0; loop<(gridRwsCls*gridRwsCls); loop++) {
        squareGridChild = document.createElement('div');
        squareGrid = document.createElement('div');
        squareGrid.setAttribute('class','gridSquareClass');
        squareGrid.style.opacity = '1';
        squareGrid.style.position = 'relative';
        skecthContainer.append(squareGrid);
        squareGridChild.setAttribute('class','squareGridChild');
        squareGridChild.style.width = `${100}%`;
        squareGridChild.style.height = `${100}%`;
        squareGridChild.style.position = 'absolute';
        squareGridChild.style.opacity = '0';
        squareGridChild.style.backgroundColor = 'black';
        squareGridChild.style.pointerEvents = 'none';
        squareGrid.append(squareGridChild); 
    }
}

//Functions to select the color of the drawing pen
startSetPenColor = () => {
    buttonSketchBool = false;
    shadeSketchButtonBool = null;
    eraseOrResetSketchBool =  null;
    document.addEventListener('click',setPenColor);
    buttonColorReset();
}

setPenColor = () => {
    squareGridChilds.forEach(squareGridChild => {
        squareGridChild.style.pointerEvents = 'none';
    })
    skecthContainer.addEventListener('click',penDrawingSquares);  
}

//Functions to draw sth in the sketch
startPenDrawing = () => {
    document.removeEventListener('click',setPenColor);
    skecthContainer.removeEventListener('click',penDrawingSquares);
    if(!buttonSketchBool) {
        squareGridChilds.forEach(squareGridChild => {
            squareGridChild.style.pointerEvents = 'none';
            
        });
        dynamicColor = skecthPenColor.value;
        squareGrids = skecthContainer.querySelectorAll('.gridSquareClass');
        squareGrids.forEach(squareGrid => {
            squareGrid.addEventListener('mouseenter',penDrawingSquares);
            squareGrid.removeEventListener('click',penDrawingSquares);
        })
    }
}

stopPenDrawing = () => {
    if (!buttonSketchBool) {
        squareGrids.forEach(squareGrid => {
            squareGrid.removeEventListener('mouseenter',penDrawingSquares);
            squareGrid.addEventListener('click',penDrawingSquares);
        })
    }
}

penDrawingSquares = (squareGrid) => {
    if (!buttonSketchBool) {
        squareGridChilds.forEach (squareGridChild => {
        squareGridChild.style.pointerEvents = 'none';
    })
        penColor = dynamicColor;
        squareGrid.target.style.backgroundColor = penColor;
    }
}

//Functions to set the sketch background
sketchBackGroundColorFN = () => {
    buttonColorReset();
    buttonSketchBool = false;
    shadeSketchButtonBool = null;
    eraseOrResetSketchBool = null;
    document.addEventListener('click',setSketchBackGroundColor);
}

setSketchBackGroundColor = () => {
    skecthContainer.style.backgroundColor = sketchBackgroundColorDOM.value;
    squareGrids = skecthContainer.querySelectorAll('.gridSquareClass');
    const brigthnessLevel = checkColorBrightness(sketchBackgroundColorDOM.value);
    if (brigthnessLevel <= 110) {
        squareGrids.forEach (squareGrid => {
        squareGrid.style.borderColor = 'white';
        })
    }
    else {
        squareGrids.forEach (squareGrid => {
        squareGrid.style.borderColor = 'black';
        })
    }
}

checkColorBrightness = (colorHex) => {
    const red = parseInt(colorHex.substring(1,3),16);
    const green = parseInt(colorHex.substring(3,5),16);
    const blue = parseInt(colorHex.substring(5,7),16);
    return (red * 0.299) + (green * 0.587) + (blue * 0.144);
}

//Functions to increase the opacity of the sketch
increaseOpacityFN = (squareGridChild) => { 
    if (shadeSketchButtonBool === true && buttonSketchBool === true) {
        let opacity = parseFloat(squareGridChild.target.style.opacity);
        opacity = opacity + 0.1;
    if (opacity <= 1) {
        squareGridChild.target.style.opacity = opacity;
    }
    }
}
squareGridChildsOpacity = () => {
    if (shadeSketchButtonBool === true && buttonSketchBool === true) {
        squareGridChilds.forEach(squareGridChild => {
        squareGridChild.addEventListener('mouseenter',increaseOpacityFN);
        squareGridChild.removeEventListener('click',increaseOpacityFN);
        })
    }
}
stopSquareGridChildsOpacity = () => {
    if (shadeSketchButtonBool === true && buttonSketchBool === true) {
        squareGridChilds.forEach(squareGridChild => {
            squareGridChild.addEventListener('click',increaseOpacityFN);
            squareGridChild.removeEventListener('mouseenter',increaseOpacityFN);
        })
    }
}

sketchBoolTrueToIncreaseOpacity = () => {
    buttonSketchBool = true;
    shadeSketchButtonBool = true;
    eraseOrResetSketchBool = null;
    increaseOpacity.style.backgroundColor = '#00007d';
    increaseOpacity.style.color = '#f0f8ff';
    erasePenColor.style.backgroundColor = '';
    erasePenColor.style.color = '';
    resetSketch.style.backgroundColor = '';
    resetSketch.style.color = '';
    decreaseOpacity.style.backgroundColor = '';
    decreaseOpacity.style.color = '';
    squareGridChilds = document.querySelectorAll('.squareGridChild');
    squareGridChilds.forEach(squareGridChild => {
        squareGridChild.style.pointerEvents = 'auto';
    })
    skecthContainer.addEventListener('mousedown',squareGridChildsOpacity);
    skecthContainer.addEventListener('mouseup',stopSquareGridChildsOpacity);
}

//Functions to decrease the opacity of the sketch
sketchBoolTrueToDecreaseOpacity = () => {
    buttonSketchBool = true;
    shadeSketchButtonBool = false;
    eraseOrResetSketchBool = null;
    decreaseOpacity.style.backgroundColor = '#00007d';
    decreaseOpacity.style.color = '#f0f8ff';
    increaseOpacity.style.backgroundColor = '';
    increaseOpacity.style.color = '';
    erasePenColor.style.backgroundColor = '';
    erasePenColor.style.color = '';
    resetSketch.style.backgroundColor = '';
    resetSketch.style.color = '';
    squareGridChilds = document.querySelectorAll('.squareGridChild');
    squareGridChilds.forEach(squareGridChild => {
        squareGridChild.style.pointerEvents = 'auto';
    })
    skecthContainer.addEventListener('mousedown',squareGridOpacity);
    skecthContainer.addEventListener('mouseup',stopSquareGridOpacity);
}

squareGridOpacity = () => {
    if (buttonSketchBool === true && shadeSketchButtonBool === false) {
        squareGridChilds.forEach(squareGridChild => {
            squareGridChild.addEventListener('mouseenter',decreaseSquareGridChildOpacity);
            squareGridChild.removeEventListener('click',decreaseSquareGridChildOpacity);
        })
    }
}

stopSquareGridOpacity = () => {
    if (buttonSketchBool === true && shadeSketchButtonBool === false) {
        squareGridChilds.forEach(squareGridChild => {
            squareGridChild.addEventListener('click',decreaseSquareGridChildOpacity);
            squareGridChild.removeEventListener('mouseenter',decreaseSquareGridChildOpacity);
        })
    }
}

decreaseSquareGridChildOpacity = (squareGridChild) => {
    if (buttonSketchBool === true && shadeSketchButtonBool === false) {
        let opacity;
        if (squareGridChild.target.style.opacity > 0) {
            opacity = parseFloat(squareGridChild.target.style.opacity);
            opacity -= 0.1;
            squareGridChild.target.style.opacity = opacity;
        }
    }
}

//Functions to clear pen coloring or drawings
erasePenColorFN = () => {
    erasePenColor.style.backgroundColor = '#00007d';
    erasePenColor.style.color = '#f0f8ff';
    resetSketch.style.backgroundColor = '';
    resetSketch.style.color = '';
    decreaseOpacity.style.backgroundColor = '';
    decreaseOpacity.style.color = '';
    increaseOpacity.style.backgroundColor = '';
    increaseOpacity.style.color = '';
    buttonSketchBool = true; 
    shadeSketchButtonBool = null;
    eraseOrResetSketchBool = true;
    squareGridChilds.forEach(squareGridChild => {
    squareGridChild.style.pointerEvents = 'none';
    }) 
    skecthContainer.addEventListener('mousedown',eraseSketchFN);
    skecthContainer.addEventListener('mouseup',opposeEraseSketchFN);
}

eraseSketchFN = () => {
    if (buttonSketchBool === true && eraseOrResetSketchBool === true) {   
        squareGrids.forEach(squareGrid => {
            squareGrid.removeEventListener('click',clickEraseSquareGridSketch);
            squareGrid.addEventListener('mouseenter',eraseSquareGridSketch);
        })
    }
}

opposeEraseSketchFN = () => {
    if (buttonSketchBool === true && eraseOrResetSketchBool === true) { 
        squareGrids.forEach(squareGrid => {
            squareGrid.addEventListener('click',clickEraseSquareGridSketch);
            squareGrid.removeEventListener('mouseenter',eraseSquareGridSketch);
        })   
    }
}

clickEraseSquareGridSketch = squareGrid => {
    if (buttonSketchBool === true && eraseOrResetSketchBool === true) {
    if (squareGrid.target.style.backgroundColor !== sketchBackgroundColorDOM.value) {
        squareGrid.target.style.backgroundColor = '';
        if (squareGrid.target.children[0].style.opacity !== 0) {
            squareGrid.target.children[0].style.opacity = 0;
            }
        }
    }
}

eraseSquareGridSketch = squareGrid => {
    if (buttonSketchBool === true && eraseOrResetSketchBool === true) {
    if (squareGrid.target.style.backgroundColor !== sketchBackgroundColorDOM.value) {
        squareGrid.target.style.backgroundColor = '';
        if (squareGrid.target.children[0].style.opacity !== 0) {
            squareGrid.target.children[0].style.opacity = 0;
            }
        }
    }
}

//Function to reset sketch from 0
resetSketchFN = () => {
    resetSketch.style.backgroundColor = '#00007d';
    resetSketch.style.color = '#f0f8ff';
    decreaseOpacity.style.backgroundColor = '';
    decreaseOpacity.style.color = '';
    increaseOpacity.style.backgroundColor = '';
    increaseOpacity.style.color = '';
    erasePenColor.style.backgroundColor = '';
    erasePenColor.style.color = '';
    gridRwsCls = 16;
    setGridRwsCls();
    sketchBackgroundColorDOM.value = '#bfbfbf';
}

//Buttons color resetting
buttonColorReset = () => {
    decreaseOpacity.style.backgroundColor = '';
    decreaseOpacity.style.color = '';
    increaseOpacity.style.backgroundColor = '';
    increaseOpacity.style.color = '';
    erasePenColor.style.backgroundColor = '';
    erasePenColor.style.color = '';
    resetSketch.style.backgroundColor = '';
    resetSketch.style.color = '';
}
footer.addEventListener('click', () => {
    buttonColorReset();
})
header.addEventListener('click', () => {
    buttonColorReset();
})


//functions which are called when program runs at that time 
setGridRwsCls();
squareGrids = skecthContainer.querySelectorAll('.gridSquareClass');
squareGridChilds = document.querySelectorAll('.squareGridChild');
linePassThroughBG.style.width = `${50}%`;
if (document.querySelector('body').offsetWidth < `${2024}`) {
    alert("Hi 👋👋 Welcome!\nThis application is more flexible on computer devices because it relies on using mouse events like clicks to function better");
}

//Global Listeners
resetSketch.addEventListener('click',resetSketchFN);
erasePenColor.addEventListener('click',erasePenColorFN);
decreaseOpacity.addEventListener('click',sketchBoolTrueToDecreaseOpacity);
increaseOpacity.addEventListener('click',sketchBoolTrueToIncreaseOpacity);
skecthContainer.addEventListener('mousedown',startPenDrawing);
skecthContainer.addEventListener('mouseup',stopPenDrawing);
document.addEventListener('mouseup',stopPenDrawing);
skecthPenColor.addEventListener('click',startSetPenColor);
gridSelectorCircleButton.addEventListener('mousedown',startUserChooseGridRwsCls);
sketchBackgroundColorDOM.addEventListener('click',sketchBackGroundColorFN);