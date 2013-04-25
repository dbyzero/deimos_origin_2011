function getElementsByClassName(searchClass,node,tag) {
	if ( node == null )
		node = document;
	if (node.getElementsByClassName)
		return node.getElementsByClassName(searchClass);
	else {
		var classElements = new Array();
		if ( tag == null )
			tag = '*';
		var els = node.getElementsByTagName(tag);
		var elsLen = els.length;
		var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
		for (i = 0, j = 0; i < elsLen; i++) {
			if ( pattern.test(els[i].className) ) {
				classElements[j] = els[i];
				j++;
			}
		}
		return classElements;
	}
}

function getXhr(){
	var xhr = null; 
	if(window.XMLHttpRequest){
		xhr = new XMLHttpRequest(); 
	} else if(window.ActiveXObject){ 
		try {
			xhr = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	else {
		alert("Votre navigateur ne supporte pas les objets XMLHTTPRequest..."); 
		xhr = false; 
	} 
	return xhr;
}
