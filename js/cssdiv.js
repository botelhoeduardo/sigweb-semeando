var draggable;
var camadas;


window.onload = function(){

	var btn_menu = document.getElementById("btn_menu");
	btn_menu.onclick = exibeDiv;

	var btn_close = document.getElementById("btn_close");
	btn_close.onclick = escondeDiv;
}

draggable.classList.add("escondido");


function exibeDiv(){
	draggable = document.getElementById("draggable");
	$("#draggable").css("display", "block");
}

function escondeDiv(){
	draggable = document.getElementById("draggable");
	$("#draggable").css("display", "none");
}

window.onload = function(){

}
