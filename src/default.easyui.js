///////////////////////////////////////////////////////////////////////////////////////////////
$.fn.datebox.defaults.formatter = function(date){
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    return (d<10?('0'+d):d)+'/'+(m<10?('0'+m):m)+'/'+y;
}
$.fn.datebox.defaults.parser = function(s){
    if (!s) return new Date();
    var ss = (s.split('/'));
    var y = parseInt(ss[2],10);
    var m = parseInt(ss[1],10);
    var d = parseInt(ss[0],10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
        return new Date(y,m-1,d);
    } else {
        return new Date();
    }
}

$.extend($.fn.validatebox.defaults.rules, {
    minLength: {
        validator: function(value, param){
            return value.length >= param[0];
        },
        message: 'Deve ter no Minimo {0} caracteres.'
    }
});    

//numberbox
$.fn.numberbox.defaults.precision = 2
$.fn.numberbox.defaults.decimalSeparator = ","
$.fn.numberbox.defaults.iconCls = 'bullet_arrow_left_32'
$.fn.numberbox.defaults.width = '100%'
$.fn.numberbox.defaults.labelWidth = '100'

//textBox
$.fn.textbox.defaults.iconCls = 'bullet_arrow_left_32'
$.fn.textbox.defaults.width = '100%'
$.fn.textbox.defaults.labelWidth = '100'
//$.fn.textbox.defaults.labelPosition = 'top'

$.fn.switchbutton.defaults.width = '100'
$.fn.switchbutton.defaults.labelWidth = '100'



//datagrid
$.fn.datagrid.defaults.pagination = true
$.fn.datagrid.defaults.rownumbers = true
$.fn.datagrid.defaults.singleSelect = true
$.fn.datagrid.defaults.remoteFilter = true
$.fn.datagrid.defaults.fit = true
$.fn.datagrid.defaults.onLoadSuccess = function(s){

	var datagrid = $(this);
	var options = datagrid.datagrid('options');
	var urlModulo = options.url
	var toolbar = []

	//var options.onCloseDialog()
	//console.log(options);

	const btn_add = {
		iconCls: 'add_32',
		text:'Adicionar',
		handler: function(){
			dialog_open(options.form,'',function(){
               datagrid.datagrid('reload');               
            });;
		}
	}

	const  btn_edit = {
		iconCls: 'icon-edit',
		text:'Editar',
		handler: function(){	
			if(datagrid.datagrid('getSelected')){
				var rowsId = datagrid.datagrid('getSelected')[`${options.tableMysql}_id`];
				dialog_open(options.form,rowsId,function(){
	               datagrid.datagrid('reload');
	               if(options.onCloseEdit)options.onCloseEdit();
	            });
			}else{
				alert('Selecione 1 item para editar');
			}
		}
	}	

	const btn_del = {
		iconCls: 'cross_32',
		text:'Excluir',
		handler: function(){
			datagrid_del(`.${options.id}`,options.tableMysql)
		}
	}

	const btn_search = {
		iconCls: 'icon-search',
		text:'Buscar',
		handler: function(){
			if(datagrid.datagrid('isFilterEnabled')){
				datagrid.datagrid('disableFilter')
			}else{
				datagrid.datagrid('enableFilter')
			}
		}
	}

	if(options.btn_add!=false){
		toolbar.push(btn_add); 
	}
	if(options.btn_edit!=false){
		toolbar.push('-'); 
		toolbar.push(btn_edit); 
	}
	if(options.btn_del!=false){
		toolbar.push('-'); 
		toolbar.push(btn_del); 
	}
	if(options.btn_search!=false){
		toolbar.push('-'); 
		toolbar.push(btn_search); 
	}		

	$(this).datagrid({
		url:'',
		toolbar: toolbar,
		onLoadSuccess:function(){
			$('.easyui-linkbutton').linkbutton();
			if(options.onCloseDialog){
				options.onCloseDialog();
			}
		}
	});

	$(this).datagrid({
		url:urlModulo,			  
	});	
    //console.log(urlModulo);
}
