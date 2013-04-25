<?php

ini_set('display_errors',0); 
//error_reporting(E_ALL ^ E_NOTICE);

//connection
$memcache = new Memcache();
$memcache->connect('localhost', 11211) or die ("Connexion impossible");


//creation du tableau d'avatar

global $gens ;

$gens = $memcache->get('gens') ;
//if($gens = $memcache->get('gens')) {
//	$memcache->add('gens',array()) ;
//	$gens = $memcache->get('gens') ;
//}
//
//if($projos = $memcache->get('projos')) {
//	$memcache->add('projos',array()) ;
//	$projos = $memcache->get('projos') ;
//}

if($_GET['gens'] == 'show') {
	echo "<pre>" ;
	print_r($gens);
	print_r($memcache->getStats());
	echo "</pre>" ;
}

if($_GET['flush'] == 'evil') {
	$memcache->flush();
	echo "RAZ" ;
}

if(count($gens) > 0 ) {
	foreach($gens as $people) {
		if(!$memcache->get('live_'.$people->name)) {
			unset($gens[$people->name]) ;
		}
		//echo $people->name.";".$people->x.";".$people->y.";".$people->w.";".$people->h.";".$people->vx.";".$people->vy.";".$people->dire.$people->chaineTire.'#' ;
//if($_GET['gens'] == 'show2') {
		echo $people->name.";".$people->x.";".$people->y.";".$people->w.";".$people->h.";".$people->vx.";".$people->vy.";".$people->dire.";".$people->ttl_aie.$people->chaineTire.'#' ;
}
//	}
}


if(strlen($_POST['name']) > 0) {
	$_POST['name'] = str_replace(array(";","#","%","@"),array(" "," "," "," "),strip_tags(substr($_POST['name'],0,12))) ;
	
	$avatar = new stdClass;
	$avatar->x = $_POST['x'] ;
	$avatar->y = $_POST['y'] ;
	$avatar->h = $_POST['h'] ;
	$avatar->w = $_POST['w'] ;
	$avatar->vx = $_POST['vx'] ;
	$avatar->vy = $_POST['vy'] ;
	$avatar->ttl_aie = $_POST['ttl_aie'] ;
	$avatar->name = $_POST['name'] ;
	$avatar->dire = strip_tags($_POST['dire']) ;
	$avatar->chaineTire = strip_tags($_POST['chaineTire']) ;
	$gens[$avatar->name] = $avatar ;
	$memcache->set('live_'.$avatar->name, 'oui', false, 5) or die ("Echec de la sauvegarde des données sur le serveur");
}

$memcache->set('gens', $gens, false, 2) or die ("Echec de la sauvegarde des données sur le serveur");

//$memcache->set($avatar->name.'_parlotte', $_POST['text'], false, 5) or die ("Echec de la sauvegarde des données sur le serveur");

$memcache->close();

?>
