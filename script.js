//DOM elements initialization
const skecthContainer = document.getElementById('skecth-container');
const skecthPenColor = document.getElementById('mouse-drawing-color');
const sketchBackgroundColorDOM = document.getElementById('background-color');
const gridSelectorPassThroughLine = document.getElementById('square-grids-user-choice');
const gridSelectorCircleButton = document.getElementById('circle-to-grab');
const gridRwsClsDisplayParagraph = document.getElementById('display-square-grids');
const gridRwsClsDisplaySpans = gridRwsClsDisplayParagraph.querySelectorAll('span');
const increaseOpacity = document.getElementById('increase-opacity');
const decreaseOpacity = document.getElementById('decrease-opacity');
const erasePenColor = document.getElementById('erase-pen-color');
const resetSketch = document.getElementById('reset-sketch');
let squareGrids,squareGridChilds;

//functions declarations
let setGridRwsCls,startSetPenColor,setPenColor,startPenDrawing,stopPenDrawing,setPenDrawing,penDrawingSquares,sketchBackGroundColorFN;
let setSketchBackGroundColor,checkColorBrightness,increaseOpacityFN,decreaseOpacityFN,sketchBoolTrueToDecreaseOpacity,sketchBoolTrueToIncreaseOpacity;
let squareGridChildsOpacity,stopSquareGridChildsOpacity,squareGridOpacity,stopSquareGridOpacity,decreaseSquareGridChildOpacity,decreaseSquareGridOpacity;
let erasePenColorFN;

//other data types
let boolTrackMouseMvt,boolOpacity,gridRwsCls,loop,penColor,dynamicColor,blackOpacity,backgroundColor;
boolOpacity = false;
boolTrackMouseMvt = false;
gridRwsCls = 16;
dynamicColor = '#1dad00';
skecthPenColor.value = dynamicColor;
backgroundColor = '#bfbfbf';
sketchBackgroundColorDOM.value = backgroundColor;
skecthContainer.style.backgroundColor = backgroundColor;

function stopUserChooseGridRwsCls() {
    document.removeEventListener('mousemove', userChooseGridRwsCls);
    if (boolTrackMouseMvt) {
        setGridRwsCls();
        boolTrackMouseMvt = false;
    }
}

const startUserChooseGridRwsCls = () => {
    boolOpacity = false;
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
    gridRwsClsDisplaySpans[0].innerText = gridRwsCls;
    gridRwsClsDisplaySpans[1].innerText = gridRwsCls;
    if (circlePosition >= 100) {
        gridSelectorCircleButton.style.left = `${100}%`;
        gridRwsCls = 64;
        gridRwsClsDisplaySpans[0].innerText = gridRwsCls;
        gridRwsClsDisplaySpans[1].innerText = gridRwsCls;
    }
    else if (circlePosition <= 0) {
        gridSelectorCircleButton.style.left = `${0}%`;
        gridRwsCls = 1;
        gridRwsClsDisplaySpans[0].innerText = gridRwsCls;
        gridRwsClsDisplaySpans[1].innerText = gridRwsCls;
    }
}

setGridRwsCls = () => {
    let squareGrid,squareGridChild;
    squareGrids = skecthContainer.querySelectorAll('.gridSquareClass');
//    let squareGridChilds = document.querySelectorAll('.squareGridChild');
    if (squareGrids) {
        for (loop = 0; loop<squareGrids.length; loop ++) {
            squareGrids[loop].remove();
        }
        // for (loop = 0; loop<squareGridChilds.length; loop ++) {
        //     squareGridChilds[loop].remove();
        // }
        
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

startSetPenColor = () => {
    boolOpacity = false;
    document.addEventListener('click',setPenColor);
}

setPenColor = () => {
    squareGridChilds.forEach(squareGridChild => {
        squareGridChild.style.pointerEvents = 'none';
    })
    skecthContainer.addEventListener('click',penDrawingSquares);
    //console.log('in setPenColor Fn');    
}

startPenDrawing = () => {
    document.removeEventListener('click',setPenColor);
    skecthContainer.removeEventListener('click',penDrawingSquares);
    if(!boolOpacity) {
        console.log('in else');
        squareGridChilds.forEach(squareGridChild => {
            squareGridChild.style.pointerEvents = 'none';
            squareGridChild.removeEventListener('click',increaseOpacityFN);
            squareGridChild.removeEventListener('mouseenter',increaseOpacityFN);
            squareGridChild.removeEventListener('click',decreaseSquareGridChildOpacity);
            squareGridChild.removeEventListener('mouseEnter',decreaseSquareGridChildOpacity);
            
        });
        dynamicColor = skecthPenColor.value;
        squareGrids = skecthContainer.querySelectorAll('.gridSquareClass');
        squareGrids.forEach(squareGrid => {
            squareGrid.addEventListener('mouseenter',penDrawingSquares);

            squareGrid.removeEventListener('click',penDrawingSquares);
            squareGrid.removeEventListener('click',decreaseSquareGridOpacity);
            
        })
    }
}

stopPenDrawing = () => {
    if (!boolOpacity) {
        squareGrids.forEach(squareGrid => {
            squareGrid.removeEventListener('mouseenter',penDrawingSquares);
            squareGrid.addEventListener('click',penDrawingSquares);
        })
    }
}

penDrawingSquares = (squareGrid) => {
    if (!boolOpacity) {
        console.log('in pen ...',boolOpacity);
        squareGridChilds.forEach (squareGridChild => {
        squareGridChild.style.pointerEvents = 'none';
    })
        penColor = dynamicColor;
        squareGrid.target.style.backgroundColor = penColor;
    }
}

sketchBackGroundColorFN = () => {
    boolOpacity = false;
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

increaseOpacityFN = (squareGridChild) => { 
    let opacity = parseFloat(squareGridChild.target.style.opacity);
    opacity = opacity + 0.1;
    if (opacity <= 1) {
        squareGridChild.target.style.opacity = opacity;
    }
    console.log(squareGridChild.target.style.opacity);
}

squareGridChildsOpacity = () => {
    // squareGrids.forEach(squareGrid => {
    //     squareGrid.removeEventListener('mouseenter',penDrawingSquares);
    //     squareGrid.removeEventListener('click',penDrawingSquares);
    //     squareGrid.removeEventListener('click',decreaseSquareGridOpacity);
    // })
    squareGridChilds.forEach(squareGridChild => {
        squareGridChild.addEventListener('mouseenter',increaseOpacityFN);
        squareGridChild.removeEventListener('click',decreaseSquareGridChildOpacity);
        squareGridChild.removeEventListener('mouseEnter',decreaseSquareGridChildOpacity);
        squareGridChild.removeEventListener('click',increaseOpacityFN);
    })
}

stopSquareGridChildsOpacity = () => {
    // squareGrids.forEach(squareGrid => {
    //     squareGrid.removeEventListener('mouseenter',penDrawingSquares);
    //     squareGrid.removeEventListener('click',penDrawingSquares);
    //     squareGrid.removeEventListener('click',decreaseSquareGridOpacity);
    // })
    squareGridChilds.forEach(squareGridChild => {
        squareGridChild.addEventListener('click',increaseOpacityFN);
        squareGridChild.removeEventListener('click',decreaseSquareGridChildOpacity);
        squareGridChild.removeEventListener('mouseEnter',decreaseSquareGridChildOpacity);
        squareGridChild.removeEventListener('mouseenter',increaseOpacityFN);
    })
}


sketchBoolTrueToIncreaseOpacity = () => {
    boolOpacity = true;
    //if (boolOpacity) {
        squareGridChilds = document.querySelectorAll('.squareGridChild');
        squareGridChilds.forEach(squareGridChild => {
            squareGridChild.style.pointerEvents = 'auto';
        })
        skecthContainer.addEventListener('mousedown',squareGridChildsOpacity);
        skecthContainer.addEventListener('mouseup',stopSquareGridChildsOpacity);
    //}
}



sketchBoolTrueToDecreaseOpacity = () => {
    boolOpacity = true;
    squareGridChilds = document.querySelectorAll('.squareGridChild');
    squareGrids.forEach(squareGrid => {
        squareGrid.removeEventListener('mouseenter',penDrawingSquares);
        squareGrid.removeEventListener('click',penDrawingSquares);
    })
    // squareGridChilds.forEach(squareGridChild => {

    // })
    squareGridChilds.forEach(squareGridChild => {
        squareGridChild.style.pointerEvents = 'auto';
    })
    skecthContainer.addEventListener('mousedown',squareGridOpacity);
    skecthContainer.addEventListener('mouseup',stopSquareGridOpacity);
}


squareGridOpacity = () => {
    squareGridChilds.forEach(squareGridChild => {
        squareGridChild.addEventListener('mouseenter',decreaseSquareGridChildOpacity);
        squareGridChild.removeEventListener('click',increaseOpacityFN);
        squareGridChild.removeEventListener('mouseenter',increaseOpacityFN);
        squareGridChild.removeEventListener('click',decreaseSquareGridChildOpacity);
    })
}

stopSquareGridOpacity = () => {
    squareGridChilds.forEach(squareGridChild => {
        squareGridChild.addEventListener('click',decreaseSquareGridChildOpacity);
        squareGridChild.removeEventListener('mouseenter',decreaseSquareGridChildOpacity);
        squareGridChild.removeEventListener('click',increaseOpacityFN);
        squareGridChild.removeEventListener('mouseenter',increaseOpacityFN);
    })
}

decreaseSquareGridChildOpacity = (squareGridChild) => {
    let opacity;
    console.log('substrating 2'+squareGridChild.target.style.opacity);
    if (squareGridChild.target.style.opacity > 0) {
        opacity = parseFloat(squareGridChild.target.style.opacity);
        console.log('substrating'+opacity);
        opacity -= 0.1;
        squareGridChild.target.style.opacity = opacity;
        console.log(squareGridChild.target.style.opacity);
    }
}

// decreaseSquareGridOpacity = (squareGrid) => {
//     squareGrid.target.style.backgroundColor = backgroundColor;
// }



//functions which are called when program runs at that time 
setGridRwsCls();
squareGrids = skecthContainer.querySelectorAll('.gridSquareClass');
squareGridChilds = document.querySelectorAll('.squareGridChild');



decreaseOpacity.addEventListener('click',sketchBoolTrueToDecreaseOpacity);
increaseOpacity.addEventListener('click',sketchBoolTrueToIncreaseOpacity);
skecthContainer.addEventListener('mousedown',startPenDrawing);
skecthContainer.addEventListener('mouseup',stopPenDrawing);
document.addEventListener('mouseup',stopPenDrawing);

skecthPenColor.addEventListener('click',startSetPenColor);
gridSelectorCircleButton.addEventListener('mousedown',startUserChooseGridRwsCls);
sketchBackgroundColorDOM.addEventListener('click',sketchBackGroundColorFN);
