<?php 

$files1 = scandir('.');
unset($files1[0]);unset($files1[1]);unset($files1[2]);

foreach ($files1 as $key => $value) {

	if(strpos($value,'.png')){
		$name = explode('.',$value);
		$saida .= ".".$name[0]."_32{background:url('".$value."') no-repeat center center;}\n";
	}

}

file_put_contents('icons.css', $saida);

header("Content-Type: css"); // informa o tipo do arquivo ao navegador
header("Content-Disposition: attachment; filename=icons.css"); // informa ao navegador que é tipo anexo e faz abrir a janela de download, tambem informa o nome do arquivo
echo $saida;
die;

?>