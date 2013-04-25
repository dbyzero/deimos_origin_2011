//***********************************************
// COPYRIGHT : Cyril ALFARO // Presse Non Stop //
// version : 0.5                               //
// **********************************************

var Avatar = new Class({
	initialize: function(name,x,y,w,h){
		this.name = name.slice(0,12);
		this.lastActivity ;
		this.alive = true ;
		this.img = 'ananas';
		this.width = w;
		this.height = h;
		this.dire = '' ;
		this.ttl_aie = 0 ;
		this.dire_frame = tempsDeParole;
		this.cordX = x;
		this.cordY = y;
		this.velX = 0;
		this.velY = 0;
		this.pushLeft = 0;
		this.pushRight = 0;
		this.display = true;
		this.b_fly = 0;
		this.b_see = 0;
		this.b_move = 0;
		this.change_anim = false;
		this.newEtat = '0_0_0';
		this.lastEtat = '0_0_0';
		this.surPlateforme = false ;
		this.main = false ;
		this.pid = 0 ;
		this.arrayProjo = new Array ;
		this.chaineTire = '' ;
		this.nbrMort = 0 ;
	},
	survie: function(){
		if(this.lastActivity != compteurTemps) {
			arrayAvatar[this.name].alive = null ;
			site.removeChild(document.getElementById('nom_'+this.name)) ;
			site.removeChild(document.getElementById('avatar_'+this.name)) ;
			site.removeChild(document.getElementById('dire_'+this.name)) ;
			site.removeChild(document.getElementById('dial_'+this.name)) ;
			site.removeChild(document.getElementById(this.name+'_aie')) ;
			//console.log(this.name+' est mort') ;
		}
	},
	parler: function(){
		if(document.getElementById('dial_'+this.name) == null) {
			var dialou = document.createElement("textarea");
			dialou.setAttribute("class","av_dial") ;
			dialou.setAttribute("id",'dial_'+this.name) ;
			dialou.value = '' ;
			dialou.style.display = 'none' ;
			site.appendChild(dialou) ;
		}
		if(document.getElementById('dire_'+this.name) == null) {
			var bubulle = document.createElement("img");
			bubulle.setAttribute("class","bulles_gris") ;
			bubulle.setAttribute("id",'dire_'+this.name) ;
			bubulle.setAttribute("src",'img/bulles_gris.png') ;
			bubulle.setAttribute("alt",'parole de'+this.name) ;
			bubulle.style.display = 'none' ;
			site.appendChild(bubulle) ;
		}
		if((this.main && (this.dire_frame > 0) && (this.dire.length > 0)) || (!this.main && (this.dire.length > 0))) {
			//creation image
			//console.log(typeof(document.getElementById('caca'))) ;
			//console.log(site.innerHTML) ;
			//this.diaX = (parseInt(this.bulX) - 4) + 'px' ;
			//this.diaY = (parseInt(this.bulY) - 3) + 'px' ;
		//	dialogue.value = this.dire ;
		//	dialogue.style.display = 'block' ;
			document.getElementById('dire_'+this.name).style.display = 'block' ;
			document.getElementById('dire_'+this.name).style.left = (this.cordX - 60 + (this.width/2))+'px' ;
			document.getElementById('dire_'+this.name).style.top = (this.cordY - 80)+'px' ;
			document.getElementById('dial_'+this.name).style.display = 'block' ;
			document.getElementById('dial_'+this.name).value = this.dire ;
			document.getElementById('dial_'+this.name).style.left = (parseInt(document.getElementById('dire_'+this.name).style.left) + 4) + 'px' ;
			document.getElementById('dial_'+this.name).style.top = (parseInt(document.getElementById('dire_'+this.name).style.top) + 3) + 'px'  ;
			//on decremente l'affichage
			this.dire_frame-- ;
		} else {
			document.getElementById('dire_'+this.name).style.display = 'none' ;
			document.getElementById('dial_'+this.name).style.display = 'none' ;
			this.dire_frame = tempsDeParole;
			this.dire = '' ;
			//parle = false ;
		}
	},
	move: function(){
		
		//addition des vecteurs provenant du clavier
	      	if(this.main) { this.velX = this.pushLeft + this.pushRight } ;
		
		//gravite
		this.velY += gravite ;

		//deplacement
		this.cordX += parseFloat(this.velX);
		//if(this.main) {
			for(i=0; i<divColl.length; i++) {
				x2 = parseInt(divCollCoordLeft[i]) ;
				y2 = parseInt(divCollCoordTop[i]) ;
				w2 = divColl[i].offsetWidth ;
				h2 = divColl[i].offsetHeight ;
				//alert(x2+' '+y2+' '+ w2+' '+ h2) ;
				if(this.checkCollision(x2,y2,w2,h2)) {
					this.velX = 0 ;
					//coll gauche
					if(this.cordX < x2){
						//console.log('alerte gauche') ;
						this.cordX = x2 - this.width ;
					//coll droite
					} else {
						this.cordX = x2 + w2 ;
						//console.log('alerte droite') ;
					} 
				}
			}
		//}
		this.cordY += parseInt(this.velY);
		//if(this.main) {
			this.surPlateforme = false ;
			for(i=0; i<divColl.length; i++) {
				x2 = parseInt(divCollCoordLeft[i]) ;
				y2 = parseInt(divCollCoordTop[i]) ;
				w2 = divColl[i].offsetWidth ;
				h2 = divColl[i].offsetHeight ;
				if(this.checkCollision(x2,y2,w2,h2)) {
					this.velY = 0 ;
					//coll haut
					if(this.cordY > y2){
						this.cordY = y2 + h2;
						//console.log('alerte bas') ;
					//collision bas
					} else {
						this.cordY = y2 - this.height ;
						this.surPlateforme = true ;
						//console.log('alerte haut') ;
					}
				}
			}
			for(i=0; i<divPlateforme.length; i++) {
				x2 = parseInt(divPlateformeCoordLeft[i]) ;
				y2 = parseInt(divPlateformeCoordTop[i]) ;
				w2 = divPlateforme[i].offsetWidth ;
				h2 = divPlateforme[i].offsetHeight ;
				if(this.checkCollision(x2,y2,w2,h2)) {
					//coll haut
					if(this.cordY + this.height - 15 < y2 && this.velY > 0){
						this.velY = 0 ;
						this.cordY = y2 - this.height ;
						this.surPlateforme = true ;
						//console.log('alerte haut') ;
					}
				}
			}
		//}

		//bord
		//if(this.main) {
			this.cordY = this.cordY > parseInt(site.offsetHeight - this.height) ? parseInt(site.offsetHeight - this.height) : this.cordY ; 
			this.velY = this.cordY >= parseInt(site.offsetHeight - this.height) ? 0 : this.velY ; 
			this.cordX = this.cordX < 0 ? 0 : this.cordX ; 
			this.cordX = this.cordX > (site.offsetWidth - parseFloat(this.width)) ? (site.offsetWidth - parseFloat(this.width)) : this.cordX ; 
		//}

		//check etat
		this.lastEtat = this.b_move+'_'+this.b_see+'_'+this.b_fly ;
		//fly
		if(this.surPlateforme || (this.velY == 0 && (this.cordY == parseInt(site.offsetHeight - this.height)))) {
			this.b_fly = 0 ;
		} else {
			this.b_fly = 1 ;
		}
		//see
		if(this.velX < 0) {
			this.b_see = 1 ;
		}
		if(this.velX > 0) {
			this.b_see = 0 ;
		}
		//move
		if(this.velX == 0) {
			this.b_move = 0 ;
		} else {
			this.b_move = 1 ;
		}

		this.newEtat = this.b_move+'_'+this.b_see+'_'+this.b_fly ;

		if(this.newEtat == this.lastEtat) {
			this.change_anim = false ;
		} else {
			this.change_anim = true ;
		}
	},
	draw: function() {
		if(document.getElementById('avatar_'+this.name) == null){
			var montitre = document.createElement("div");
			montitre.setAttribute("class","nom") ;
			montitre.setAttribute("id",'nom_'+this.name) ;
			montitre.innerHTML = this.name ; 
			montitre.style.textAlign = 'center' ; 
			site.appendChild(montitre) ;
			var newchallenger = document.createElement("img");
			newchallenger.setAttribute("class","avatar") ;
			newchallenger.setAttribute("id",'avatar_'+this.name) ;
			//newchallenger.setAttribute("class","block") ;
			newchallenger.setAttribute("alt",this.name) ; 
			newchallenger.setAttribute("src",'img/'+this.img+'_0_0_0.gif') ;
			site.appendChild(newchallenger) ;
			var aie = document.createElement("img");
			aie.setAttribute("class","aie") ;
			aie.setAttribute("id",this.name+'_aie') ;
			//aie.setAttribute("class","block") ;
			aie.setAttribute("alt",'aie') ; 
			aie.setAttribute("src",'img/aie.png') ;
			site.appendChild(aie) ;
			//console.log('ajout') ;
		}
		if(this.ttl_aie > 0) {
			this.ttl_aie-- ;
			document.getElementById(this.name+'_aie').style.left = (this.cordX - 25 + Math.floor(Math.random() * 50))+'px' ;
			document.getElementById(this.name+'_aie').style.top = (this.cordY - 25 + Math.floor(Math.random() * 50))+'px' ;
			document.getElementById(this.name+'_aie').style.display = 'block' ;
			//console.log(this.name+' touché par '+this.arrayProjo[i].id+' de '+this.arrayProjo[i].this_name) ;
		}  else {
			document.getElementById(this.name+'_aie').style.display = 'none' ;
		}
		//console.log(typeof(document.getElementById('caca'))) ;
		//console.log(site.innerHTML) ;
		document.getElementById('nom_'+this.name).style.left = (this.cordX - (50 - (this.width/2)))+'px' ;
		document.getElementById('nom_'+this.name).style.top = (this.cordY - 20)+'px' ;
		document.getElementById('avatar_'+this.name).style.left = this.cordX+'px' ;
		document.getElementById('avatar_'+this.name).style.top = this.cordY+'px' ;
		if(this.change_anim) {
			document.getElementById('avatar_'+this.name).src = 'img/'+this.img+'_'+this.b_move+'_'+this.b_see+'_'+this.b_fly+'.gif' ;
		}

		//deplace la boite de dialogue
		if(this.main) {
			dialogue.style.left = (this.cordX - 60 + (this.width/2))+'px' ;
		//	coordX = this.cordX - (parseInt(dialogue.offsetWidth)/2) ;
		//	dialogue.style.left = (this.coordX - 90) +'px'  ;
			dialogue.style.top = (this.cordY - 80)+'px';
			bulle.style.left = (parseInt(dialogue.style.left) - 4) + 'px' ;
			bulle.style.top = (parseInt(dialogue.style.top) - 3) + 'px' ;
		}

		this.chaineTire = '@' ;
		for(i = 0;i<this.arrayProjo.length;i++) {
			if(this.arrayProjo[i] != null ) {
				//console.log(this.arrayProjo[i]) ;
				if(this.arrayProjo[i].ttl > 0) {
					if(this.arrayProjo[i].avatar_name != avatar.name && this.arrayProjo[i].collision(avatar.cordX,avatar.cordY,avatar.width,avatar.height)) { 
						avatar.ttl_aie = 15 ;
						avatar.nbrMort++ ;
					}
					if(this.main) {
						this.chaineTire += this.name+';'+this.arrayProjo[i].id+';'+this.arrayProjo[i].cordX+';'+this.arrayProjo[i].cordY+';'+this.arrayProjo[i].velX+';'+this.arrayProjo[i].velY+'@' ;
					}
					this.arrayProjo[i].draw() ;
					this.arrayProjo[i].move() ;
					for(j=0; j<divColl.length; j++) {
						if(this.arrayProjo[i].collision(divColl[j].offsetLeft,divColl[j].offsetTop,divColl[j].offsetWidth,divColl[j].offsetHeight)) {
							this.arrayProjo[i].ttl = 0 ;
						}
					}
				} else {
					//console.log(thisname+'_projo_'+this.arrayProjo[i].id) ;
					site.removeChild(document.getElementById(this.name+'_projo_'+this.arrayProjo[i].id)) ;
					this.arrayProjo[i] = null ;
				}
				
			}
		}
	},
	checkCollision: function(x2,y2,w2,h2) {
		//contre auto collision
		//console.log(this.cordX+"<>"+x2+" "+this.cordY+"<>"+y2+"// w1:"+this.width+" w2:"+w2+" h1:"+this.height+" h2:"+h2) ;
		if((this.cordX == x2) && (this.cordY == y2)) return false ;
		//check par position
		if(this.cordX+this.width<=x2) return false;
		if(x2+w2<=this.cordX) return false;
		if(this.cordY+this.height<=y2) return false;
		if(y2+h2<=this.cordY) return false;
		return true ;
	}
});
