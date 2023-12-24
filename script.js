const n=50;
const array=[];

let audioCtx=null;

init();

function init(){
    for(let i=0;i<n;i++){
        array[i]=Math.random();
    }
    showBars();
}

function play(){
    const swaps=bubbleSort([...array]);
    animate(swaps);
}

function animate(swaps){
    if(swaps.length==0){
        showBars();
        return;
    }
    const [i,j]=swaps.shift(0);
    [array[i],array[j]]=[array[j],array[i]];
    showBars([i,j]);
    playNote(10+array[i]*8000);
    playNote(10+array[j]*100);

    setTimeout(function(){
        animate(swaps);
    },20);
}

function bubbleSort(array){
    const swaps=[];
    do{
        var swapped=false;
        for(let i=1;i<array.length;i++){
            if(array[i-1]>array[i]){
                swaps.push([i-1,i]);
                swapped=true;
                [array[i-1],array[i]]=[array[i],array[i-1]];
            }
        }
    }while(swapped);
    return swaps;
}

function showBars(indices){
    container.innerHTML="";
    for(let i=0;i<array.length;i++){
        const bar=document.createElement("div");
        bar.style.height=array[i]*100+"%";
        bar.classList.add("bar");
        if(indices && indices.includes(i)){
            bar.style.backgroundColor="cyan";
        }
        container.appendChild(bar);
    }   
}

function playNote(freq){
    if(audioCtx==null){
        audioCtx=new(
            AudioContext || 
            webkitAudioContext || 
            window.webkitAudioContext
        )();
    }
    const dur=0.1;
    const osc=audioCtx.createOscillator();
    osc.frequency.value=freq;
    osc.start();
    osc.stop(audioCtx.currentTime+dur);
    const node=audioCtx.createGain();
    node.gain.value=0.1;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime+dur
    );
    osc.connect(node);
    node.connect(audioCtx.destination);
}