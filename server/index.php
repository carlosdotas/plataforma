<?php 
include_once('funcoes.php');
include_once('server_funcoes.php');
include_once('modulos/funcoes.php');
include_once('wallpapers/funcoes.php');

//Rodas do sistema
////////////////////////////////////////////////
if($_GET['op'] == 'session'){	
	echo json_encode($_SESSION);
	die;
}

////////////////////////////////////////////////
if($_GET['op'] == 'login'){	
	echo login($_GET['user'],$_GET['senha']);
	die;
}

////////////////////////////////////////////////
if($_GET['op'] == 'logout'){
	echo logout();	
	die;
}

////////////////////////////////////////////////
if($_GET['op'] == 'aluguel_get'){
	$aluguel = new aluguel();
	echo $aluguel -> get($_GET['id']);
	die;
}

////////////////////////////////////////////////
if($_GET['op'] == 'aluguel_set'){
	$aluguel = new aluguel();
	echo $aluguel -> set($_POST);
	die;
}

////////////////////////////////////////////////
if($_GET['op'] == 'aluguel_list'){
	$aluguel = new aluguel();
	echo $aluguel -> list();
	die;
}

////////////////////////////////////////////////
if($_GET['op'] == 'relatorios_list'){
	echo relatorios_list();
	die;
}

////////////////////////////////////////////////
if($_GET['op'] == 'condutores_get'){
	$condutores = new condutores();
	echo $condutores -> get($_GET['id']);
	die;	
}

////////////////////////////////////////////////
if($_GET['op'] == 'condutores_set'){
	$condutores = new condutores();
	echo $condutores -> set($_GET['id']);
	die;
}

///////////////////////////////////////////////
if($_GET['op'] == 'condutores_list'){
	$condutores = new condutores();
	echo $condutores -> list();
	die;
}

///////////////////////////////////////////////
if($_GET['op'] == 'servicos_get'){
	$servicos = new servicos();
	echo $servicos -> get($_GET['id']);	
	die;	
}

///////////////////////////////////////////////
if($_GET['op'] == 'servicos_set'){
	$servicos = new servicos();
	echo $servicos -> set($_GET['id']);	
	die;		
}

///////////////////////////////////////////////
if($_GET['op'] == 'servicos_list'){
	$servicos = new servicos();
	echo $servicos -> list();	
	die;
}

///////////////////////////////////////////////
if($_GET['op'] == 'pagamentos_set'){
	$pagamentos = new pagamentos();
	echo $pagamentos -> set($_GET['id']);	
	die;
}

///////////////////////////////////////////////
if($_GET['op'] == 'pagamentos_list'){
	$pagamentos = new pagamentos();
	echo $pagamentos -> list();	
	die;
}

///////////////////////////////////////////////
if($_GET['op'] == 'users_set'){
	$users = new users();
	echo $users -> set($_GET['id']);	
	die;
}
