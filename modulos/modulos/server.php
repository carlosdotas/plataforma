<?php 
include_once('../../server/funcoes.php');

function list_modulos(){
	$path 	 = dirname(__DIR__,2).'/modulos/';
	$scandir = scandir($path);
	$modulos_config = array();
	foreach ($scandir as $key => $value) {		
		if(($value != '..' && $value != '.') ){
			$file = $path.$value.'/config.json';
			if(is_file($file)){
				$file_config = file_get_contents($file);
				$json_decode = json_decode($file_config,1);
				salvar_mysql('modulos',$json_decode,$json_decode['href'],href);
			}
		}
	}
	return $json_decode;
}


function status($href,$status){
	$save[status] = $status;
	$salvar_mysql = salvar_mysql('modulos',$save,$href,href);
	return $salvar_mysql;
}


function gera_form($name,$iconCls,$tabela,$width){
		$file_form = '<meta title=" Adicionar '.$name.'" iconCls="'.$iconCls.'" width="500" >
<form id="form_veiculos" action="server/index.php"  method="post">
<div class="easyui-tabs" border=0>
    <div title="Inicio" class="dialog_form"  >
        <input class="easyui-textbox" required label="Nome" name="name" >
    </div> 
</div>
<input type="hidden" name="salvar" value="'.$tabela.'" >
<input type="hidden" name="'.$tabela.'_id">
</form>  
<script language="Javascript" type="text/javascript">
</script>';
		return $file_form;
}

function gera_index($id,$tabela){
	$file_index = '<div class="easyui-layout" fit="true">
	<div data-options="region:\'center\'"  border=0 >
		<table id="datagrid_'.$id.'" border="0"></table>
	</div>
</div>
<script type="text/javascript">
$("#datagrid_'.$id.'").datagridMysql({
	    table:"'.$tabela.'",
	    url:`${urlSever}?json='.$id.'`,
	    form:"modulos/'.$id.'/form.html",
	    columns:[[
	        {field:\'name\',title:\'Nome\'},
	    ]]
	})
</script>';
	return 	$file_index;
}

function gera_config($id,$name,$icon,$iconCls,$tabela,$width,$height,$href,$form,$windows,$maximized){
	$file_config = '{"name":"'.$name.'",
		"id":"'.$id.'",
		"icon":"'.$icon.'",
		"iconCls":"'.$iconCls.'",
		"tabela":"'.$tabela.'",
		"width":"'.$width.'",
		"height":"'.$height.'",
		"href":"'.$href.'",
		"form":"'.$form.'",
		"windows":"'.$windows.'",
		"maximized":"'.$maximized.'"
	}';	
	return $file_config;
}

function create_modulo(
	$local,
	$id,
	$name,
	$icon,
	$iconCls,
	$tabela,
	$width,
	$height,
	$href,
	$form,
	$windows,
	$maximized
){

	if(!is_dir($local)){
		mkdir($local, 0777, true);
	}

	if(!is_file($local.'/server.php')){
		$file_server = "<?php \n include_once('../../server/funcoes.php'); \n";
		file_put_contents($local.'/server.php', $file_server);
	}

	if(!is_file($local.'/index.html')){
		$file_index = gera_index($id,$tabela);
		file_put_contents($local.'/index.html', $file_index);
	}

	if(!is_file($local.'/form.html')){
		$file_form = gera_form($name,$iconCls,$tabela,$width);
		file_put_contents($local.'/form.html', $file_form);		
	}

	$file_config = gera_config(
		$id,
		$name,
		$icon,
		$iconCls,
		$tabela,
		$width,
		$height,
		$href,
		$form,
		$windows,
		$maximized
	);
	
	file_put_contents($local.'/config.json', $file_config);

}



///////////////////////////////////////////////////
if($_GET['op'] == 'modulos'){
	list_modulos();
	$consultar_mysql = consultar_mysql('modulos');
	echo json_encode($consultar_mysql);
	die;
}

if($_GET['op'] == 'status'){

	if(
		$_POST['href']=='modulos/modulos/index.html' or
		$_POST['href']=='modulos/users/index.html' 
	){
		$return = array('error'=>'Esse modulo não pode ser modificado');
	}else{
		$return = status($_POST['href'],$_POST['status']);
	}

	echo json_encode($return);
	die;
}

if($_GET['op'] == 'create_modulo'){

	$local = '../'.$_POST['id'];

	create_modulo(
		$local,
		$_POST['id'],
		$_POST['name'],
		$_POST['icon'],
		$_POST['iconCls'],
		$_POST['tabela'],
		$_POST['width'],
		$_POST['height'],
		$_POST['href'],
		$_POST['form'],
		$_POST['windows'],
		$_POST['maximized']
		
	);

	echo json_encode('ok');
	die;
}
