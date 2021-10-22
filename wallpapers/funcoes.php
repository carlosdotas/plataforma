<?php	

function wallpapers(){
	$path 	 = dirname(__DIR__,1).'/wallpapers';
	$scandir = scandir($path);
	foreach ($scandir as $key => $value) {
		if(pathinfo($path.$value)['extension']=='jpg' ){
			$retorno[] = array(
				'text'=>'Wallpaper '.($key+1),
				'img'=>'wallpapers/'.$value
			);
		}
	}
	return $retorno;
}