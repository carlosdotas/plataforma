<?php
function list_modulos(){
	$path 	 = dirname(__DIR__,1).'/modulos/';
	$scandir = scandir($path);
	foreach ($scandir as $key => $value) {
		if(($value != '..' && $value != '.') and is_dir($path.$value) ){
			include_once($path.$value.'/config.php');
		}
	}
	return $_SERVER['modulos_config'];
}