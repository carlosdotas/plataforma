<?php
/** 
 * DOTAS Sistemas de Gerenciamendo
 *
 * @copyright       DOTAS SISTEMAS
 * @license         Direito de uso
 * @package         Basico(Administrador de Provedor)
 * @since           1.0
 * @version         2.0
*/

//////////////////////////////////////////////////////////
set_time_limit(60);
ini_set('memory_limit', '-1');
date_default_timezone_set("Brazil/East");

//////////////////////////////////////////////////////////
//error_reporting(E_ERROR | E_WARNING | E_PARSE);
//error_reporting(E_ERROR | E_PARSE);
//ini_set("display_errors", 1);

//////////////////////////////////////////////////////////
session_start();

//Configuracao do banco de dados
$_SESSION['DB_HOST'] 	  = 'localhost';
$_SESSION['DB_LOGIN'] 	  = 'root';
$_SESSION['DB_SENHA'] 	  = '';
$_SESSION['DB_NAME'] 	  = 'locacao_viculos';
//$_SESSION['DB_PORT']      = 3306;
$_SERVER['url']          = 'http://localhost/locacao_veiculos';
$_SERVER['root']         = 'C:\xampp\htdocs\locacao_veiculos';

// Database Hostname
// Hostname of the database server. If you are unsure, "localhost" works in most cases.
define('XOOPS_DB_HOST', 'localhost');

// Database Username
// Your database user account on the host
define('XOOPS_DB_USER', 'root');

// Database Password
// Password for your database user account
define('XOOPS_DB_PASS', 'C@rlosdo15011');
?>