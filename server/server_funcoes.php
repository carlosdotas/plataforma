<?php

////////////////////////////////////////////////
function relatorios_list(){
	
	unset($_POST['page']);
	unset($_POST['rows']);
	
	$clientes = consultar_mysql('clientes');
	foreach ($clientes['rows'] as $key => $value) {
		$clientes_array[$value['clientes_id']] = $value;
	}

	$veiculos = consultar_mysql('veiculos');
	foreach ($veiculos['rows'] as $key => $value) {
		$veiculos_array[$value['veiculos_id']] = $value;
	}

	$aluguel = consultar_mysql('aluguel',$_GET['id']);


	foreach ($aluguel['rows'] as $key => $value) {
		$aluguel['rows'][$key]['cliente_nome'] = $clientes_array[$value['cliente']]['nome'];



		$aluguel['rows'][$key]['veiculo_placa'] = $veiculos_array[$value['veiculo']]['placa'];
	}

	return json_encode($aluguel['rows']);
}

////////////////////////////////////////////////
function login($login,$senha){
	$error['error']['login'] = 'Login ou senha Inválido';

	$buscar_mysql = buscar_mysql('users',$login,'login');

	if($buscar_mysql['senha']){
		if($buscar_mysql['senha']==$senha){
			$_SESSION['login'] = $buscar_mysql;
			return json_encode(array('logado'=>true));
		}else{
			return json_encode($error);
		}
	}else{
		return json_encode($error);
	}	
}

////////////////////////////////////////////////
function logout(){
	unset($_SESSION['login']);
	return json_encode(array('logout'=>true));
}

////////////////////////////////////////////////
class aluguel{
	public $table;
    public function __construct() {
    	$this -> table = 'aluguel';
    }  

    public function get($id){
		$buscar_mysql = buscar_mysql($this -> table,$id);
		if(!$buscar_mysql){
			$buscar_mysql['contrato_id'] = mktime().rand(10000,99999);
		}
		return json_encode($buscar_mysql);
    }

    public function set($dados){

		if($dados['status']=='finalizado'){
			$dados['data_fechamento']=date('d/m/Y H:i');
			$dados['user_fechamento']=$_SESSION['login']['login'];
		}else{
			$dados['data_fechamento']='';
			$dados['user_fechamento']='';
		}

		$salvar_mysql = salvar_mysql($this -> table,$dados, $dados['aluguel_id'],'aluguel_id');

		return json_encode($salvar_mysql);
    }

    public function list(){

		$aluguel = consultar_mysql($this -> table,$_GET['id']);
		
		unset($_POST['page']);
		unset($_POST['rows']);

		$clientes = consultar_mysql('clientes');
		foreach ($clientes['rows'] as $key => $value) {
			$clientes_array[$value['clientes_id']] = $value;
		}

		$veiculos = consultar_mysql('veiculos');
		foreach ($veiculos['rows'] as $key => $value) {
			$veiculos_array[$value['veiculos_id']] = $value;
		}

		foreach ($aluguel['rows'] as $key => $value) {
			$aluguel['rows'][$key]['cliente_nome'] = $clientes_array[$value['cliente']]['nome'];
			$aluguel['rows'][$key]['veiculo_placa'] = $veiculos_array[$value['veiculo']]['placa'];
		}

		return json_encode($aluguel);
    }
}

////////////////////////////////////////////////
class condutores{
	public $table;
    public function __construct() {
    	$this -> table = 'condutores';
    }  

    public function get($id){
		$buscar_mysql = buscar_mysql($this -> table,$id);
		unset($buscar_mysql[condutor_contrato]);
		unset($buscar_mysql[condutor_cliente]);
		return json_encode($buscar_mysql);
    }

    public function set($dados){
		if($_POST['condutor_contrato']){
			$salvar_mysql = salvar_mysql('contrato_condutores',$_POST,$_POST['contrato_condutores_id'],'contrato_condutores_id');
		}else{
			salvar_mysql('condutores',$_POST,$_POST['condutores_id'],'condutores_id');	
		}
		return json_encode($salvar_mysql);
    }

    public function list(){
		$consultar = consultar_mysql('contrato_condutores',array('condutor_contrato'=>$_GET['condutor_contrato']));
		return json_encode($consultar);
    }
}

////////////////////////////////////////////////
class servicos{
	public $table;
    public function __construct() {
    	$this -> table = 'servicos';
    }  

    public function get($id){
		$buscar_mysql = buscar_mysql($this -> table,$_GET['id']);
		unset($buscar_mysql[servicos_contratos]);
		return json_encode($buscar_mysql);
    }

    public function set(){
		if($_POST['servicos_contratos']){
			$salvar_mysql = salvar_mysql('servicos_contratos',$_POST,$_POST['servicos_contratos_id'],'servicos_contratos_id');

		}else{
			unset($_POST['servicos_contratos_id']);
			unset($_POST['servicos_contratos']);

			$salvar_mysql = salvar_mysql($this -> table,$_POST,$_POST['servicos_id'],'servicos_id');
		}

		return json_encode($salvar_mysql);
    }

    public function list(){
		if($_GET['servicos_contratos']){
			$consultar = consultar_mysql('servicos_contratos',array('servicos_contratos'=>$_GET['servicos_contratos']));
			return json_encode($consultar);
		}
    }
}

////////////////////////////////////////////////
class pagamentos{
	public $table;
    public function __construct() {
    }  

    public function get($id){
    }

    public function set($dados){
		if($_POST['pagamentos_contratos']){
			$salvar_mysql = salvar_mysql('pagamentos_contratos',$_POST,$_POST['pagamentos_contratos_id'],'pagamentos_contratos_id');
		}
		return json_encode($salvar_mysql);
    }

    public function list(){
		if($_GET['pagamentos_contratos']){
			$consultar_mysql = consultar_mysql('pagamentos_contratos',array('pagamentos_contratos'=>$_GET['pagamentos_contratos']));
			return json_encode($consultar_mysql);
		}
    }
}

////////////////////////////////////////////////
class users{
	public $table;
    public function __construct() {
    }  

    public function get($id){
    }

    public function set($dados){

		if(!$_POST['users_id']){
			$_POST[data_cadastro] = date('d/m/Y H:i:s');
			$_POST[mktime_reg] = mktime();
		}
		$salvar_mysql = salvar_mysql('users',$_POST,$_POST['users_id'],'users_id');
		return json_encode($salvar_mysql);
    }

    public function list(){
    }
}