//************************************************
// COPYRIGHT : Cyril ALFARO // Division by Zero //
// version : 0.5                                //
// ***********************************************

//var globale moteur
var gravite = 2 ;
var cycle = 37 ;
var maj = 1  ;

//var globale pour collision
var x2 ;
var y2 ;
var w2 ;
var h2 ;
		
//var globale pour les objets
var timerBoucle ; 
var parle = false ; 
var test_box ;
var test_box2 ;
var test_box3 ;
var block_test ;
var avatar ;
var evtobj ;
var keyCode ;
var dialogue ;
var tempsDeParole ;
var bulle ;
var site ;
var temp_avatar ;
var compteurPost = 0 ;
var compteurTemps = 0 ;
var nbr_guest = 0 ;
var arrayAvatar = new Array() ;
var divColl = new Array() ;
var divCollCoordLeft = new Array() ;
var divCollCoordTop = new Array() ;
var divPlateforme = new Array() ;
var divPlateformeCoordLeft = new Array() ;
var divPlateformeCoordTop = new Array() ;
var projectileLaunched = null ;

function updatePage(name,x,y,w,h,vx,vy,dire,chaineTire,ttl_aie){
	var xhrSelect = getXhr();
	xhrSelect.onreadystatechange = function(){
		if(xhrSelect.readyState == 4 && xhrSelect.status == 200){
			//dire = '' ;
			compteurTemps++ ;
			var data_csv = xhrSelect.responseText;
			var splittage = data_csv.split('#')  ;
			for(i=0; i<splittage.length; i++) {
				var element = splittage[i].split('@') ;
				var fields = element[0].split(';') ;
				var chaineTire = new Array () ;
				//console.log(element[0]) ;
				if((name != fields[0]) && (fields[0].length > 0) ) {
					for(j=1;j<element.length;j++) {
						if(element[j].length > 0) {
							//console.log(tire_prop[4]) ;
							tire_prop = element[j].split(';') ;
							arrayAvatar[fields[0]].arrayProjo[parseInt(tire_prop[1])] = (new Projectile(tire_prop[0],parseInt(tire_prop[1]),parseInt(tire_prop[2]),parseInt(tire_prop[3]),parseInt(tire_prop[4]),parseInt(tire_prop[5])) ) ;
							//alert("x="+parseInt(tire_prop[2])+"y="+parseInt(tire_prop[3])+"vx="+parseInt(tire_prop[4])+"vy="+parseInt(tire_prop[5])) ;
						}
					}
					if(typeof(arrayAvatar[fields[0]]) != "undefined") {
						arrayAvatar[fields[0]].cordX = parseInt(fields[1]) ;
						arrayAvatar[fields[0]].cordY = parseInt(fields[2]) ;
						arrayAvatar[fields[0]].velX = parseInt(fields[5]) ;
						arrayAvatar[fields[0]].velY = parseInt(fields[6]) ;
						arrayAvatar[fields[0]].dire = fields[7] ;
						arrayAvatar[fields[0]].ttl_aie = fields[8] ;
						arrayAvatar[fields[0]].alive = true ;
						arrayAvatar[fields[0]].lastActivity = compteurTemps ;
					} else {
						temp_avatar = new Avatar(fields[0],parseInt(fields[1]),parseInt(fields[2]),parseInt(fields[3]),parseInt(fields[4]));

						temp_avatar.velX = parseInt(fields[5]) ;
						temp_avatar.velY = parseInt(fields[6]) ;
						temp_avatar.dire = fields[7] ;
						temp_avatar.ttl_aie = fields[8] ;
						temp_avatar.lastActivity = compteurTemps ;
						temp_avatar.arrayProjo = chaineTire ;
						arrayAvatar[temp_avatar.name] = temp_avatar ;
					}
				}
			}
		}
	}
	xhrSelect.open("POST","server.php",true);
	xhrSelect.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhrSelect.send("ttl_aie="+ttl_aie+"&x="+x+"&y="+y+"&w="+w+"&h="+h+"&vx="+vx+"&vy="+vy+"&name="+name+"&dire="+dire+"&chaineTire="+chaineTire);
}

function checkName(name){
	var xhrSelect = getXhr();
	xhrSelect.onreadystatechange = function(){
		if(xhrSelect.readyState == 4 && xhrSelect.status == 200){
			var data_csv = xhrSelect.responseText;
			var splittage = data_csv.split('#')  ;
			var ok = true ;
			for(i=0; i<splittage.length; i++) {
				fields = splittage[i].split(';') ;
				if(name.trim() == fields[0]) {
					ok = false ;
					alert('Nom déjà pris') ;
				}
			}
			document.getElementById('form_start').style.display = ok ? 'block' : 'none' ;
		}
	}
	xhrSelect.open("POST","server.php",true);
	xhrSelect.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhrSelect.send();
}

function keyHandlerUp(e) {
	evtobj = window.event? event : e ;
	keyCode = evtobj.keyCode ;
	test_box2.value = 'stop '+keyCode ;
	switch(keyCode) {
		case 37 :
			avatar.pushLeft = 0 ;
			break ;
		case 39 :
			avatar.pushRight = 0 ;
			break ;
		case 13 :
			dialogue.value = '' ;
			break ;
	}
}


function keyHandlerDown(e) {
	evtobj = window.event? event : e
	keyCode = evtobj.keyCode ;
	test_box2.value = 'go '+keyCode ;
	switch(keyCode) {
		case 17 :
			if(avatar.b_see) {
				avatar.arrayProjo.push(new Projectile(avatar.name,avatar.arrayProjo.length,avatar.cordX,avatar.cordY + 20,-25,0) ) ;
			}else {
				avatar.arrayProjo.push(new Projectile(avatar.name,avatar.arrayProjo.length,avatar.cordX + 20,avatar.cordY + 20,25,0) ) ;
			}
			return false ;
			break ;
		case 37 :
			avatar.pushLeft = -11 ;
			return false ;
			break ;
		case 39 :
			avatar.pushRight = +11 ;
			return false ;
			break ;
		case 32 :
			/*if(avatar.b_fly == 0 && (!parle)) {
				avatar.velY = -26 ;
			}*/
			//return false ;
			break ;
		case 38 :
			if(avatar.b_fly == 0) {
				avatar.velY = -26 ;
			}
			return false ;
			break ;
		case 13 :
			if(dialogue.style.display == 'block') {
				//valid le texte
				//window.focus();
				dialogue.blur() ;
				avatar.dire = dialogue.value ;
				avatar.dire_frame = tempsDeParole ;
				//fix focus chrome
				dialogue.style.display = 'none' ;
				bulle.style.display = 'none' ;
				parle = false ;
			} else {
				//prepare nouveau texte
				dialogue.style.display = 'block' ;
				bulle.style.display = 'block' ;
				parle = true ;
				dialogue.value = '' ;
				dialogue.focus() ;
			}
			return false ;
			break ;
	}
}

var boucle = function () {
	test_box.value = (parseFloat(test_box.value) + 1) ;

	document.onkeydown = keyHandlerDown;
	document.onkeyup = keyHandlerUp;

//	var temp = new Array() ;
//	temp['avatar'] = avatar ;
//	temp['avatar'].draw() ;
//	temp['avatar'].move() ;

	avatar.parler() ;
	avatar.move() ;
	avatar.draw() ;
	if(parle == true) {
		avatar.dire = dialogue.value ;
		avatar.dire_frame = tempsDeParole ;
	}
	//avatar.survie() ;


	nbr_guest = 1 ;
	for(av in arrayAvatar) {
		if(arrayAvatar[av].alive != null) {
			nbr_guest++ ;
			arrayAvatar[av].parler();
			arrayAvatar[av].move();
			arrayAvatar[av].draw();
			arrayAvatar[av].survie();
			
		}
	}

	test_box3.value = nbr_guest+' '+avatar.arrayProjo.length ;

	if(compteurPost >= parseInt(maj)) {
		updatePage(avatar.name,avatar.cordX,avatar.cordY,avatar.width,avatar.height,avatar.velX,avatar.velY,avatar.dire,avatar.chaineTire,avatar.ttl_aie) ;
		compteurPost = 0 ;
	} else {
		compteurPost++ ;
	}
}

var engineStart = function() {

	//TODO configuration
	var main_content = "main" ;
	divPlateforme = getElementsByClassName('ship',document,'div') ;
	divColl = getElementsByClassName('block',document,'img') ;

	//var main_content = "container" ;
	test_box = document.getElementById('test_box') ;
	test_box2 = document.getElementById('test_box2') ;
	test_box3 = document.getElementById('test_box3') ;
	block_test = document.getElementById('block_test') ;

	site = document.getElementById(main_content) ;
	dialogue = document.getElementById('dialogue') ;
	bulle = document.getElementById('bulle') ;
	tempsDeParole = 200 ;

	//divColl get Coords
	for(i=0; i<divColl.length; i++) {
		var currentParent = divColl[i].offsetParent ;
		var coordLeft = divColl[i].offsetLeft  ;
		var coordTop = divColl[i].offsetTop ;
		var secure = 0 ;
		while(!(currentParent.id == main_content) && secure < 20) {
			coordLeft = coordLeft + currentParent.offsetLeft ;
			coordTop = coordTop + currentParent.offsetTop ;
			console.log(currentParent.id) ;
			currentParent = currentParent.offsetParent ;
			secure++ ;
		}
		divCollCoordLeft[i] = parseInt(coordLeft) ;
		divCollCoordTop[i] = parseInt(coordTop) ;
		//console.log(divColl[i].offsetLeft+" "+divColl[i].offsetTop+" => "+parseInt(divCollCoordLeft[i])+" "+parseInt(divCollCoordTop[i])) ;
	}
	//divColl get Platforme
	for(i=0; i<divPlateforme.length; i++) {
		var currentParent = divPlateforme[i].offsetParent ;
		var coordLeft = divPlateforme[i].offsetLeft  ;
		var coordTop = divPlateforme[i].offsetTop ;
		var secure = 0 ;
		while(!(currentParent.id == main_content) && secure < 20) {
			coordLeft = coordLeft + currentParent.offsetLeft ;
			coordTop = coordTop + currentParent.offsetTop ;
			console.log(currentParent.id) ;
			currentParent = currentParent.offsetParent ;
			secure++ ;
		}
		divPlateformeCoordLeft[i] = parseInt(coordLeft) ;
		divPlateformeCoordTop[i] = parseInt(coordTop) ;
		//console.log(divPlateforme[i].offsetLeft+" "+divPlateforme[i].offsetTop+" => "+parseInt(divPlateformeCoordLeft)+" "+parseInt(divPlateformeCoordTop)) ;
	}

	avatar = new Avatar(document.getElementById('form_nom').value,95,100,30,49) ;
	avatar.main = true ;

	timerBoucle = boucle.periodical(parseInt(cycle)) ;
}

var engineStop = function() {
	document.getElementById('avatallr_'+avatar.name).style.display = 'none' ;
	document.getElementById('nom_'+avatar.name).style.display = 'none' ;
	for(av in arrayAvatar) {
		if(arrayAvatar[av].alive != null) {
			arrayAvatar[av].lastActivity = 0;
			arrayAvatar[av].survie();
		}
	}
	timerBoucle = $clear(timerBoucle) ;
}
