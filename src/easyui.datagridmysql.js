/**
 * Desktop Extension for jQuery EasyUI
 * version: 1.0.1
 * 		
 *		
		$('.datagridMysql').datagridMysql({
			table:'marcas',
			url:'${urlSever}?json=marcas',
			del:true,
			edit:true,
			onSave:function(){ 
				alert()
			},
			onDel:function(){ 
				alert()
			},

			//edit:false,			
			//del:false,
			form:"modulos/marcas/form.html",
			columns:[[
				{field:'nome',title:'Nome',sortable:true},
				{field:'telefone',title:'telefone',sortable:true}
			]],

		})
 */


(function($){

	function getRandomInt(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min)) + min;
	}

	function buildEditor(target){
		
		var opts = $.data(target, 'datagridMysql').options;
		var ids='dialog_'+getRandomInt(10000, 99999);
		
		$.getJSON( `${urlSever}?json=`+opts.table, function( data ) {	

			var columns = []	
			//$.each(Object.keys(data.rows[0]), function( index, value ) {
			if(!opts.columns){
				$.each(Object.keys(data.rows[0]), function( index, value ) {
					columns.push({field:value,title:value})
				});
				opts.columns = [columns];
				//console.log(opts.columns)
			}

			//});

			if(opts.del!=false){
				opts.columns[0].unshift({field:'Del',title:"#",width:38,
					align:"center",
					formatter: function(value,row,index){
						//console.log(row)
						return `<a href="#" class="btn_del_${ids} easyui-linkbutton" ${opts.table}_id="${row[opts.table+'_id']}" data-options="iconCls:'icon-clear'"></a>`;
					},	
					styler: function(value,row,index){
						return 'background-color:#ddd';
					}								
				});
			}
			if(opts.edit!=false){
				opts.columns[0].unshift({field:'Edit',title:"#",width:38,
					align:"center",
					formatter: function(value,row,index){
						return `<a href="#" class="btn_edit_${ids} easyui-linkbutton" ${opts.table}_id="${row[opts.table+'_id']}" data-options="iconCls:'icon-search'"></a>`;
					},
					styler: function(value,row,index){
						return 'background-color:#ddd';
					}								
				});
			}


			$(target).datagrid($.extend({}, opts, {
				onLoadSuccess:function(data){
					var server = '';

					if(opts.onLoadSuccess){
						opts.onLoadSuccess(data)
					}
					//$('.easyui-linkbutton').linkbutton()
					$.parser.parse()

					$('.btn_edit_'+ids).click(function(){
						if(!opts.server){
							server = `${urlSever}?buscar_mysql=${opts.table}&${opts.table}_id=${$(this).attr(opts.table+'_id')}`;
						}else{
							server = opts.server+$(this).attr(opts.table+'_id');
						}						
						$().dialogForm({
							href:opts.form,
							server:server,
							onSave:function(dados){
								$(target).datagrid('reload')
								if(opts.onSave){
									opts.onSave(dados)
								}
							},
							onClose:function(){

							}
						});
					});
					$('.btn_del_'+ids).click(function(){
						var btn_del = this
						$.messager.confirm('Confirme',`Tem certeza que deseja exluir o Item ${$(this).attr(opts.table+'_id')} ?`,function(r){
						    if (r){
						    	$.messager.progress();
								$.get( `${urlSever}?exclui_mysql=${opts.table}&id=${$(btn_del).attr(opts.table+'_id')}`, function( data ) {
									$.messager.progress('close');
									if(opts.onDel){
										opts.onDel($(btn_del).attr(opts.table+'_id'))
									}								
									$(target).datagrid('reload')
								});						        
						    }
						});						
					});

				},

				//columns:[columns],
				toolbar: [{
					iconCls: 'icon-add',
					text:'Adicionar',
					handler: function(){
						if(!opts.server){
							server = `${urlSever}?buscar_mysql=${opts.table}&${opts.table}_id=${$(this).attr(opts.table+'_id')}`;
						}else{
							server = opts.server+$(this).attr(opts.table+'_id');
						}						
						$().dialogForm({
							href:opts.form,
							server:server,
							onSave:function(dados){
								$(target).datagrid('reload')
								if(opts.onSave){
									opts.onSave(dados)
								}								
							}		
						});
					}
				},'-',{
					iconCls: 'icon-search',
					text:'Buscar',
					handler: function(){
						if($(target).datagrid('isFilterEnabled')){
							$(target).datagrid('disableFilter')
						}else{
							$(target).datagrid('enableFilter');
						}
					}
				}]					
			}));
			$(target).datagrid('enableFilter', [
				{
					field:'Del',
					type:'label',
				},
				{
					field:'Edit',
					type:'label',
				}					
			]);
			$(target).datagrid('disableFilter')


		});




		//var getData = $(target).datagrid('getData');
		


		
		
	}

	$.fn.datagridMysql = function(options, param){

		if (typeof options == 'string'){
			var method = $.fn.datagridMysql.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.dialog(options, param);
			}
		}

		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'datagridMysql');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'datagridMysql', {
					options: $.extend({}, $.fn.datagridMysql.defaults, $.fn.datagridMysql.parseOptions(this), options)
				});
			}
			buildEditor(this);
		});
	};

	$.fn.datagridMysql.methods = {
		options: function(jq){
			return jq.data('datagridMysql').options;
		},
		getEditor: function(jq){
			return jq.closest('.datagridMysql').children('.datagridMysql-body');
		},
		destroy: function(jq){
			return jq.each(function(){
				var opts = $(this).datagridMysql('options');
				$(opts.dlgToolbar).panel('clear');
				$(this).dialog('destroy');
			});
		},
	};

	$.fn.datagridMysql.parseOptions = function(target){
		return $.extend({}, $.fn.datagrid.parseOptions(target), {

		});
	};

	$.fn.datagridMysql.defaults = $.extend({}, $.fn.datagrid.defaults, {
		fit:true,
		pagination:true,
		singleSelect:true,
		remoteFilter:true,
		defaultFilterType:'textbox'


		//title: 'null',
		//cls: 'datagridMysql',
		//bodyCls: 'datagridMysql-body',
		//draggable: false,
		//shadow: false,
		//closable: false,
		//inline: true,
		//border: 'thin',
		//modal:true,

	});

	$.parser.plugins.push('datagridMysql');

})(jQuery);
