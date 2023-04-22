const canvas=document.querySelector("canvas"),
toolBtns=document.querySelectorAll(".tool"),
fillColor=document.querySelector("#fill-color"),
sizeSlider=document.querySelector("#size-slider"),
colorBtns=document.querySelectorAll(".colors .option"),
colorPicker=document.querySelector("#color-picker"),
clearCanvas=document.querySelector(".clear-canvas"),
saveImg=document.querySelector(".save-img");
undobtn=document.getElementById("undo");
redobtn=document.getElementById("redo");
ctx=canvas.getContext("2d");

window.addEventListener("load",()=>{
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
    setCanvasBackground();
})
let prevMouseX,prevMouseY,snapshot,
 isDrawing=false,
selectedTool="brush",
selectedColor="#000",
brushsize=5;
let undo_array=[];
let index=-1;

const setCanvasBackground=()=>{
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=selectedColor;
}
const drawRect=(e)=>{
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX,e.offsetY,prevMouseX-e.offsetX,prevMouseY-e.offsetY);
       
    }
    ctx.fillRect(e.offsetX,e.offsetY,prevMouseX-e.offsetX,prevMouseY-e.offsetY);
}

const drawCircle=(e)=>{
    ctx.beginPath();
    let radius=Math.sqrt(Math.pow((prevMouseX-e.offsetX),2)+Math.pow((prevMouseY-e.offsetY),2));
    ctx.arc(prevMouseX,prevMouseY,radius,0,2*Math.PI);
    ctx.stroke();
    fillColor.checked?ctx.fill():ctx.stroke();
}

const drawTriangle=(e)=>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX,prevMouseY);
    ctx.lineTo(e.offsetX,e.offsetY);
    ctx.lineTo(prevMouseX*2-e.offsetX,e.offsetY);
    ctx.closePath();
    ctx.stroke();
    fillColor.checked?ctx.fill():ctx.stroke();

}
const startDraw=(e)=>{
    isDrawing=true;
    prevMouseX=e.offsetX;
    prevMouseY=e.offsetY;
    ctx.beginPath();
    ctx.lineWidth=brushsize;
    ctx.strokeStyle=selectedColor;
    ctx.fillStyle=selectedColor;
    snapshot=ctx.getImageData(0,0,canvas.width,canvas.height);
}

const drawing=(e)=>{
    if(!isDrawing)return;
    ctx.putImageData(snapshot,0,0);

    if(selectedTool==="brush" || selectedTool==="eraser"){
        ctx.strokeStyle= selectedTool ==="eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX,e.offsetY);//creating line acc to mouse pointer
        ctx.stroke();//drawing /filling line with color
    }
    else if(selectedTool==="rectangle"){
          drawRect(e);
    }
    else if(selectedTool==="circle"){
          drawCircle(e);
    }
    else {
        drawTriangle(e);
    }

}

toolBtns.forEach(btn => {
   btn.addEventListener(
    "click",()=>{
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool=btn.id;
        console.log(selectedTool);
    }
   )
});

sizeSlider.addEventListener("change",()=>{
    brushsize=sizeSlider.value;
})

colorBtns.forEach(btn =>{
    btn.addEventListener("click",()=>{
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor= window.getComputedStyle(btn).getPropertyValue("background-color");
    })
})
 
colorPicker.addEventListener(
    "change",()=>{
      colorPicker.parentElement.style.background=colorPicker.value;
      colorPicker.parentElement.click();
    }
)
clearCanvas.addEventListener("click",()=>{
   ctx.clearRect(0,0,canvas.width,canvas.height);
   setCanvasBackground();
   undo_array=[]
   index=-1;
});

saveImg.addEventListener("click",()=>{
    
    const link=document.createElement("a");
    link.download=`${Date.now()}.jpg`;
    link.href=canvas.toDataURL();
    
    link.click();

})
function stopdrawing(){
    isDrawing=false;

    if(event.type !="mouseout" ){
        undo_array.push(ctx.getImageData(0,0,canvas.width,canvas.height));
        index+=1;
        console.log(undo_array);
    }
    
}
function undo_last(){
    if(index===0){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            setCanvasBackground();
            undo_array=[]
            index=-1;
    }
    else{
        index-=1;
        // undo_array.pop();
        ctx.putImageData(undo_array[index],0,0);
    }
   
}

function redo_last(){
    if(index==undo_array.length)return;
    index++;
    ctx.putImageData(undo_array[index],0,0);
}
undobtn.addEventListener("click",undo_last);
redobtn.addEventListener("click",redo_last);
canvas.addEventListener("mousemove",drawing);
canvas.addEventListener("mousedown",startDraw);
canvas.addEventListener("mouseup",stopdrawing);