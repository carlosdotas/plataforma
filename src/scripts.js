//////////////////////////////////////////////////////////////
function desktop(modulos,server){

	set_theme_wallpaper_init();

	function menu_modulos(data){
		var menus = [];
		$.each(data, function( index, value ) {	
			var insert = {};
			insert['text'] = value.name
			insert['iconCls'] = value.iconCls					
			insert['handler'] = function(){
				$('body').desktop('openApp', value)
			}
			menus.push(insert);	
	    });	
	    return menus;
	}

	function set_theme_wallpaper_init(){
		if(localStorage.getItem('theme')){
			var themes = localStorage.getItem('theme');
			var link = $('head').find('link:first');
			link.attr('href', 'src/easyui/themes/'+themes+'/easyui.css');
		}else{
			localStorage.setItem('theme','bootstrap')
		}

		if(localStorage.getItem('wallpaper')){
			var wallpaper = localStorage.getItem('wallpaper');
		}else{
			localStorage.setItem('wallpaper','wallpaper/bg (14).jpg')
		}

	}

	function configs_modulos(modulosInstall){
  		var php_data=[];
		$.each(modulosInstall, function( index, value ) {
		   	php_data.push(ajaxAsync(value))		
		});
		return php_data;
	}

	$('body').desktop({
		apps: modulos,
		wallpaper:localStorage.getItem('wallpaper'),
		buttons: '#buttons',
		menus: [{
				text: 'Dotas Sistemas',
				iconCls:'www_page_32',
				handler: function(){
					alert('DOTAS SISTEMAS\n-----------------------\nFone/Whatsapp: 62 99615-7340\nEmail: carlosdotas@gmail.com\nSite: www.dotas.com.br')
				}
			},{
				text: 'Modulos',
				iconCls:'plugin_32',
				menus: menu_modulos(modulos)
			},{
				text: 'Configurações',
				iconCls: 'cog_32',
				handler: function(){
					$.get( `modulos/configuracoes/index.html`, function( data ) {	
						console.log(data);
						$(data).appendTo('body');								
					})
				}
			},{
				text: 'Logout',
				iconCls: 'icon-lock',
				handler: function(){
					$.messager.confirm({
						title:'Confirmar',
						msg:'Deseja fazer logout?',
						border: 'thin',
						fn:function(){
							$.getJSON( `${urlSever}?op=logout`, function( data ) {					
								document.location.reload(true);								
							})
						}
					})
				}
		}],			
	})
}


//////////////////////////////////////////////////////////////
function session(url){
	return ajaxAsync(url);
}

////////////////////////////////////////////////
function modulos(funcao){
	getJsonServer(`${urlSever}?json=modulos&status=true`,function(data){
		funcao(data.rows);
	})
}

//////////////////////////////////////////////////////////////
function wallpapersJson(url){
	return ajaxAsync(url);
}

//////////////////////////////////////////////////////////////
function ajaxAsync(url){
  var retorno;
  $.ajax({
    url: url,
    async: false, 
    dataType: 'json',
    success: function (json) {
    	retorno = json
    }
  });
  return retorno;	
}


////////////////////////////////////////////////
function dialog_login() {
	$().dialogForm({
		href:'modulos/login/form.html',
		closable:false,
		saveble:false,	
		cls:'dialog_login',
		buttons:[{
			text:'ENTRAR',
			iconCls:'lock_open_32',
			handler:function(){
					$.messager.progress();
					$.getJSON( urlSever+"?op=login&user="+$('.login').textbox('getValue')+'&senha='+$('.senha').passwordbox('getValue'), function( data ) {
						
						if(data.error){
							$.messager.alert('Erro',data.error.login); 
						}
						if(data.logado==true){
							$(dialogForm).dialogForm('close'); 
						}
						$.messager.progress('close');
					})
					$('#form_login').form('reset');
				}
			}],
	});
}


////////////////////////////////////////////////
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

///////////////////////////////////////////////
function calcula_data(data_ini,data_fim,hora_ini='',hora_fim=''){
    var date1 = new Date(data_ini.replace( /(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3 "+hora_ini));
    var date2 = new Date(data_fim.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3 "+hora_fim));
    var timeDiff = date2.getTime() - date1.getTime();
    var diffDays = timeDiff / (1000 * 3600 * 24); 

    return diffDays;
}

///////////////////////////////////////////////
function dataAtualFormatada(){
    var data = new Date(),
        dia  = data.getDate().toString().padStart(2, '0'),
        mes  = (data.getMonth()+1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
        ano  = data.getFullYear();
    return dia+"/"+mes+"/"+ano;
}

//////////////////////////////////////////////////
function postPrint(data,url){

    $('body').append('<iframe name="iframePrint" style="display:none" id="iframePrint" src="'+url+'"></iframe>');
    $('body').append('<form action="'+url+'" method="post" target="iframePrint" id="postToIframe"></form>');
    $('#postToIframe').append('<input type="hidden" name="post" value=\''+data+'\' />');
    $('#postToIframe').submit().remove();;

	setTimeout(function(){ 

		document.getElementById("iframePrint").contentWindow.print();

	}, 500);
}

var dialog_id = 0;

///////////////////////////////////////////////
function dialog_open(href,id='',onClose=function(){}){

	event.preventDefault();

	if(!id){
		dialog_id = getRandomInt(100000, 999999);
	}else{
		dialog_id = id;
	}


	$.get( href, function( data ) {
		
		$('body').append('<div class="dialog_'+dialog_id+'" id="dialog_'+dialog_id+'">'+data+'</div>');

		$('.dialog_'+dialog_id).dialog({
			title: $('.dialog_'+dialog_id+' meta').attr('title'),
			iconCls: $('.dialog_'+dialog_id+' meta').attr('iconCls'),
			width: $('.dialog_'+dialog_id+' meta').attr('width'),
			height: $('.dialog_'+dialog_id+' meta').attr('height'),
			modal:true,
			border:0,
			bodyCls:'dialog',
			onClose:function(data){
				
				$('.dialog_'+dialog_id).dialog('destroy');
				$('.dialog_'+dialog_id).remove();

				onClose(dialog_id,data);
			}
		})

		$.parser.parse('.dialog_'+dialog_id);
	});

}

////////////////////////////////////////////////
function datagrid_del(datagrid,table){

	if(!$(datagrid).datagrid('getSelected')){
		alert('Selecione o item para exluir');
		return false;
	}

	var row = $(datagrid).datagrid('getSelected')[table+'_id'];
	$.messager.confirm({
		title: 'Confirmar',
		msg: `Tem certeza que deseja Excluir o item ${row} ?`,
		fn: function(r){
			if (r){
	
				$.messager.progress(); 
				$.get( "server.php?exclui_mysql="+table+'&id='+row, function( data ) {
					$(datagrid).datagrid('reload');
					$.messager.show({
						title:'Excluido',
						msg:'Item Excluido com sucesso!',
						timeout:1000,
						showType:'slide'
					});			
				  	$.messager.progress('close');
				});

			}
		}
	});
}

////////////////////////////////////////////////
function dialog_save(dialog_id,form_id,datagrid){

    $.messager.progress();  
    $(form_id).form('submit', {
        ajax:true,        
        onSubmit: function(){
            var isValid = $(this).form('validate');
            if (!isValid){
                $.messager.progress('close'); 
                $(this).form('enableValidation');
                alert('Preencha todos os Campos Obrigatórios!');
            }
            return isValid; 
        },
        success: function(){
            $(datagrid).datagrid('reload');
            $.messager.progress('close');   
            dialog_close(dialog_id);
            $.messager.show({
                    title:'Salvo',
                    msg:'Item Salvo com sucesso!',
                    timeout:1000,
                    showType:'slide'
                });                 
        }
    });
}

////////////////////////////////////////////////
function dialog_close(dialog_id){
    $('.dialog_'+dialog_id).dialog('close');
}

//////////////////////////////////////////////////////////////
function postServer(url,inputs,funcion){
	$.post(url,inputs, function( data ) {
		if(data.error){
			alert(data.error)
		}
	  	if(funcion)funcion(data)
	},'json');	
}

//////////////////////////////////////////////////////////////
function getJsonServer(url,funcion){
	$.getJSON(url, function( data ) {
		if(data.error){
			alert(data.error)
		}
	  	if(funcion)funcion(data)
	});	
}

///////////////////////////////////////////////////
///////// Outras Funcoes
//////////////////////////////////////////////////
function mikrotime(){
	var date  = new Date();
	var timestamp = Math.round(date.getTime()/1000 | 0); 
	return timestamp;
}

///////////////////////////////////////////////////
///////// Outras Funcoes
//////////////////////////////////////////////////
function dataHota(){
	return new Date();	
}

///////////////////////////////////////////////////
///////// Outras Funcoes
//////////////////////////////////////////////////
function getRandomInt(min=1000, max=9999) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

///////////////////////////////////////////////////
///////// Outras Funcoes
//////////////////////////////////////////////////
function getCodTimer(min=1000, max=9999) {
  min = Math.ceil(min);
  return mikrotime()+''+getRandomInt(min, max);
}


///////////////////////////////////////////////////
///////// Outras Funcoes
//////////////////////////////////////////////////
function geraCodigo(){
	return calcMD5(mikrotime()+'_'+getRandomInt(1000, 9999));
}



