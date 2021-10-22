<?php
//////////////////////////////////////////////////////////////////
//Mysql
//////////////////////////////////////////////////////////////////
//$mysql = new mysql('dotas','root','C@rlosdo15011','localhost','prefix');
//$saida = $mysql-> listar_tabelas();
//$saida = $mysql-> lista_colunas('cartelas');
//$saida = $mysql-> criar_tabelas('nova');
//$saida = $mysql-> criar_colunas('nova',array('novacol','simplescol','Soteste','maconha'));
//$salvar[] = array(nome=>"carlos",telefone=>'62996157340');
//$salvar[] = array(nome=>"Dotas",telefone=>'6299615734023');
//$saida = $mysql-> inserir('nova',$salvar);
//$saida = $mysql-> alterar('nova',array(nome=>"ok",telefone=>'ok'),4);
//$saida = $mysql-> salvar('nova',array(nome=>"ok1",telefone=>'ok1'),19);
//$saida = $mysql-> buscar('nova',8);
//$saida = $mysql-> consultar('nova',array(nome=>'ok','nova_id'=>2),'','');
//$saida = $mysql-> excluir('nova',1);
//$saida = $mysql-> calculo('sorteios','qnt_cartelas','soma');
//$saida = $mysql-> render();
//$saida = $mysql-> limparTable($tabela)



class mysql{

    public $conection;
    public $db;
    public $table;
    public $save;
    public $cols=array();
    public $rows=array();
    public $result=array();
    public $prefix;

    //////////////////////////////////////////////////////////////////
    public function __construct($db, $login='root',$senha='',$host='localhost',$prefix="") {
    	$this -> db = $db;
    	$this -> prefix = $prefix;
        $this -> conectar($host,$login,$senha,$db);
    }

    //////////////////////////////////////////////////
    public function conectar($host,$login,$senha,$db){

      $this -> conection = mysqli_connect($host,$login,$senha);
      
      if(!mysqli_select_db($this -> conection , $db)){
          mysqli_query($this -> conection,"CREATE DATABASE ".$db);
          mysqli_select_db($this -> conection,$db,$this -> conection);
          $this -> conection = mysqli_connect($host,$login,$senha);
      }

      mysqli_select_db($this -> conection,$db);
      mysqli_set_charset($db,'utf8');
    }


    //////////////////////////////////////////////////////////////////
    //Funcoes Publicas
    //////////////////////////////////////////////////////////////////

	//////////////////////////////////////////////////
    public function listar_tabelas(){
	  $result = mysqli_query($this->conection,"show tables"); 
	  while($table = mysqli_fetch_array($result)) { 
	      $array[] = $table[0];   
	  }
	  return $array;
	}

	//////////////////////////////////////////////////
    public function criar_tabelas($tabela,$rows=false){

    	$this->table = $this->prefix.'_'.$tabela;

		return mysqli_query($this -> conection,'CREATE TABLE '.$this->table.' ( '.$this->table.'_id INT( 15 ) NOT NULL AUTO_INCREMENT PRIMARY KEY ) ENGINE = MyISAM;');

    	
	}

	//////////////////////////////////////////////////
	public function lista_colunas($tabela){

	  $this->table = $this->prefix.'_'.$tabela;

	  $result = mysqli_query($this -> conection,"SHOW full COLUMNS FROM $this->table");

	  if($result){
	    if (mysqli_num_rows($result) > 0) {
	        while ($row = mysqli_fetch_assoc($result)) {
	            $colunas[] = $row[Field];
	      }
	    }
	  }

	  return $colunas;
	}

	//////////////////////////////////////////////////
	public function criar_colunas($tabela,$arrayCols){

		$this->table = $this->prefix.'_'.$tabela;

		$colunasMysql = $this -> lista_colunas($tabela);
		$arrayCols = array_diff( $arrayCols,$colunasMysql);	

		if(!$arrayCols) return false;

		foreach ($arrayCols as $key => $value) {
			$cols[] = "ADD $value TEXT";
		}

		return mysqli_query($this -> conection,"ALTER TABLE `$this->table`".implode(',',$cols));      
	}	

	//////////////////////////////////////////////////
	public function inserir($tabela,$dados){			
		
		$this->table = $this->prefix.'_'.$tabela;

		//Cria Tabela Caso nao Exista
		$this -> criar_tabelas($tabela);		

		if(is_array(array_values($dados)[0])){
			foreach (array_values($dados) as $key => $value) {
				$salvar[] = "( '".implode("','",array_values($value))."' )";
			}
			$keys = array_keys($dados[0]);
		}else{
			$salvar[] = "( '".implode("','",array_values($dados))."' )";
			$keys = array_keys($dados);
		}
		
		$this -> criar_colunas($tabela,$keys);


	  	mysqli_query($this -> conection,"INSERT INTO $this->table (".implode(',',$keys).") VALUES ".implode(",",$salvar)." ;");

		$saida = mysqli_insert_id($this -> conection);
		$this -> result['inserir'][$this->table][] = $saida;			  
	}	

	//////////////////////////////////////////////////
	public function alterar($tabela,$dados,$id,$coluna=""){	
		
		//$coluna = $this->prefix.'_'.$coluna;
		$this->table = $this->prefix.'_'.$tabela;

		foreach ($dados as $k => $v) {
		    $itens = $itens.' '.$vergula.' '.$k.' = '."'$v'";
		    $vergula=',';
		}	   



      	if(!$coluna)$coluna = $this->table.'_id';

			$saida = mysqli_query($this -> conection,"UPDATE $this->table SET $itens WHERE $coluna = '$id';");
			$this -> result['alterar'][$tabela][] = $saida;
			return $saida;	

		}	

	//////////////////////////////////////////////////
	public function salvar($tabela,$dados,$id="",$coluna=""){	
		

		if($id){
			if(!$coluna)$coluna = $this->table.'_id';

			$buscar = $this -> buscar($tabela,$id,$coluna);

			//print_r($buscar);die;

			if($buscar[$this->table.'_id']){
				$this -> alterar($tabela,$dados,$id,$coluna);
				return $buscar[$tabela.'_id'];
			}

		}

		$saida = $this -> inserir($tabela,$dados);
		$this->save = $dados;
		return $saida;
	}	

	//////////////////////////////////////////////////
	public function buscar($tabela, $buscar='', $coluna=''){

		$this->table = $this->prefix.'_'.$tabela;

		if(!$coluna)$coluna = $this->table.'_id';
		
	    if($buscar) $busca = "WHERE $coluna LIKE '$buscar'";
	    $query = mysqli_query($this -> conection,"SELECT * FROM $this->table $busca");

	    if($query ){
	       while($myrow = mysqli_fetch_assoc($query) ){
	        $linha[]=$myrow;
	    }}

	    $this -> result['buscar'][$tabela][] = $linha[0];
	    return $linha[0];
	}	

	//////////////////////////////////////////////////
	public function consultar($tabela, $buscar=array(),$limite='',$pagina=0, $ordem='', $orient=''){

		$this->table = $this->prefix.'_'.$tabela;

		if(!$orient)	$orient='DESC';	
		if(!$ordem)		$ordem=$this->table.'_id';
		$ordem = "ORDER BY ".$ordem." ".$orient;

		if($limite){
			$limite = "LIMIT $pagina ,". $limite;
		}

		
		if($buscar){
			foreach ($buscar as $key => $value) {
				$tipo = explode('|',$key);
				if(!$tipo[1]){
					$tipo[1] = "LIKE '%$value%'";
				}else{
					$tipo[1] = "$tipo[1] '$value'";
				}
				$busca[] = " $tipo[0] $tipo[1] ";
			}
			$WHERE = 'WHERE';
		}

	    $query = mysqli_query($this -> conection,"SELECT * FROM $this->table $WHERE".implode('AND',$busca)." $limite $ordem");
	    if($query ){
	       while($myrow = mysqli_fetch_assoc($query) ){
	        $linha[]=$myrow;
	    }}

	    //Total
	    ///////////////////////////////////
	  	$select = mysqli_query($this -> conection,"SELECT * FROM $this->table $WHERE".implode('AND',$busca));
	  	if($select)$cont = mysqli_num_rows($select);		

	    $saida[rows] = $linha;
	    $saida[total][0] = $cont;

	    $this -> result['consultar'][$tabela][] = $saida;    
	    return $saida;
	}	

	//////////////////////////////////////////////////
	public function excluir($tabela,$id,$coluna=''){

		$this->table = $this->prefix.'_'.$tabela;
		
		if(!$coluna)$coluna = $tabela.'_id';

		$saida = mysqli_query($this -> conection,"DELETE FROM $this->table WHERE ".$coluna."=".$id);

    $this -> result['excluir'][$tabela][] = $saida;    
    return $saida;
	}	

	//////////////////////////////////////////////////
	public function limparTable($tabela){
		$this->table = $this->prefix.'_'.$tabela;
		mysqli_query($this -> conection,"DELETE FROM $this->table");
	}	


	//////////////////////////////////////////////////
	public function calculo($tabela,$coluna,$calc = 'soma',$buscar=array()){

		
		$this->table = $this->prefix.'_'.$tabela;
		
		if($calc=='soma')$calcSis = 'SUM';
		if($calc=='media')$calcSis = 'AVG';
		if($calc=='min')$calcSis = 'min';
		if($calc=='max')$calcSis = 'max';

		if($buscar){
			foreach ($buscar as $key => $value) {
				$tipo = explode('|',$key);
				if(!$tipo[1]){
					$tipo[1] = "LIKE '%$value%'";
				}else{
					$tipo[1] = "$tipo[1] '$value'";
				}
				$busca[] = " $tipo[0] $tipo[1] ";
			}
			$WHERE = 'WHERE';
		}

		$select = mysqli_query($this -> conection,"SELECT * FROM $this->table $WHERE".implode('AND',$busca));
		if($select)$cont = mysqli_num_rows($select);

	  	$select = mysqli_query($this -> conection,"SELECT $calcSis($coluna) FROM $this->table $WHERE".implode('AND',$busca).";");
			while($linhas = mysqli_fetch_array($select)){
	    	if($linhas[0])$saida = $linhas[0]; 
	    }

	    $this -> result[calculo][$tabela][$coluna][qnt] = $cont;
	    $this -> result[calculo][$tabela][$coluna][$calc] = $saida; 
	    
	    return $saida;
	}	


	//////////////////////////////////////////////////
	public function render($tipo=''){

		if($tipo=='json'){
			die(json_encode($this->result)); 
		}
		mysql_close($this -> conection);
		return $this->result;

	}		

}