var tbells, tswells;
var bellsOn=false, swellsOn=false;
var rbells=1000, rswells=1000;
function load_data(){
  var data1 =$.getJSON("data/data_bells.json", function(data) {
    tbells = data;})
  var data2 = $.getJSON("data/data_swells.json", function(data) {
    tswells = data;})
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function start_bells(){
  bellsOn=true;
  ring_bell();
}
function stop_bells(){
  bellsOff=true;
}
function ring_bell(item=[1,1,0]){
  if(bellsOn){
    //console.log("New ring",item[0]);
    play_sound(item[1],"add",1);
    var item = tbells[Math.floor(Math.random()*tbells.length)];
    setTimeout(()=>ring_bell(item),item[0]*rbells);
  }
}
function start_swells(){
  swellsOn=true;
  ring_swell();
}
function stop_swells(){
  swellsOff=true;
}
function ring_swell(item=[10,0,1]){
  if(swellsOn){
    //console.log("New swell",item[0]);
    play_random_swell();
    var item = tswells[Math.floor(Math.random()*tswells.length)];
    setTimeout(()=>ring_swell(item),item[0]*rswells);
  }
}

load_data()
