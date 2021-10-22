<?php 
include_once('../../server/funcoes.php');


if($_GET[op]=='list_imgs'){

    $files = list_files($_SERVER['root'].'/src/icons_new','png');

    if($_GET['buscar']!=''){
        foreach ($files as $key => $value) {
            if(strpos($value, $_GET['buscar'])!== false){
                $list_files[] = $value;
            }
        }
    }else{
        $list_files = $files;
    }

    $retorno[rows] = array_slice($list_files, ($_GET['pageNumber']-1)*$_GET['pageSize'], $_GET['pageSize']);
    $retorno[total] = count($list_files);
    echo json_encode($retorno);
}