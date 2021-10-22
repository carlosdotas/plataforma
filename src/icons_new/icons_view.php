<?php 

$files1 = scandir('.');
unset($files1[0]);unset($files1[1]);unset($files1[2]);

foreach ($files1 as $key => $value) {

	if(strpos($value,'.png')){
		$name = explode('.',$value);
		$saida .= "<span><img src='".$value."' width='30' >".$name[0]."</span>";
	}

}

?>
<html>
<body>
	<?php echo $saida; ?>
</body>
</html>