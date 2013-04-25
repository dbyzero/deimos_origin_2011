//***********************************************
// COPYRIGHT : Cyril ALFARO // Presse Non Stop //
// version : 0.5                               //
// **********************************************

var Projectile = new Class({
	initialize: function(name,id,x,y,velX,velY){
		this.id = id ;
		this.ttl = 40 ;
		this.cordX = x;
		this.cordY = y;
		this.velX = velX;
		this.velY = velY;
		this.width = 20;
		this.height = 5;
		this.avatar_name = name ;
		//console.log(this.id) ;
	},
	move: function(){
		
		//deplacement
		this.cordX += parseFloat(this.velX);
		this.cordY += parseInt(this.velY);

		this.ttl = this.cordY < 0 ? 0 : this.ttl ; 
		this.ttl = this.cordX < 0 ? 0 : this.ttl ; 
		this.ttl = this.cordY > parseInt(site.offsetHeight) - this.height ? 0 : this.ttl ; 
		this.ttl = this.cordX > parseInt(site.offsetWidth) - this.width ? 0 : this.ttl ; 
		},
	draw: function() {
		if(document.getElementById(this.avatar_name+'_projo_'+this.id) == null) {
			var projo = document.createElement("img");
			projo.setAttribute("class","projectile") ;
			projo.setAttribute("id",this.avatar_name+'_projo_'+this.id) ;
			//projo.setAttribute("class","block") ;
			projo.setAttribute("alt","") ; 
			projo.setAttribute("src",'img/projectile.png') ;
			projo.style.left = parseInt(this.cordX)+'px' ;
			projo.style.top  = parseInt(this.cordY)+'px' ;
			site.appendChild(projo) ;
			//alert('creation de '+avatar.name+'_projo_'+this.id) ;
		}
		document.getElementById(this.avatar_name+'_projo_'+this.id).style.left = this.cordX+'px' ;
		document.getElementById(this.avatar_name+'_projo_'+this.id).style.top = this.cordY+'px' ;
		
		//deplace la boite de dialogue
	},
	collision: function(x,y,w,h) {
		//contre auto collision
		//if((this.cordX == avatar.cordX) && (this.cordY == y2)) return false ;
		//check par position
		if(this.cordX+this.width<x) return false;
		if(x+w<this.cordX) return false;
		if(this.cordY+this.height<y) return false;
		if(y+h<this.cordY) return false;
		return true ;
	}
});
