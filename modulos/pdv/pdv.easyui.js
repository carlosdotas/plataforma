(function($){


	function getRowSelec(target){
		var tab = target.find('.tab_pdv').tabs('getSelected');
		return tab.find('.list_carrinho').datagrid('getSelected');
	}

	function updateRow(target,data){


		var tab = target.find('.tab_pdv').tabs('getSelected');
		var getSelected = tab.find('.list_carrinho').datagrid('getSelected');
        var rowIndex = tab.find('.list_carrinho').datagrid("getRowIndex", getSelected);		
       	tab.find('.list_carrinho').datagrid('updateRow',{
			index: rowIndex,
			row: {cod: data.cod, 
				nome: data.nome, 
				preco: data.preco,
				qnt:getSelected.qnt,
				total: somaRow(data.preco,getSelected.qnt-0)
			}
		});   
       	calculoTotal(target)

	}

	function deleteRow(target){
		var tab = target.find('.tab_pdv').tabs('getSelected');
		var getSelected = tab.find('.list_carrinho').datagrid('getSelected');
        var rowIndex = tab.find('.list_carrinho').datagrid("getRowIndex", getSelected);		
       	if(rowIndex>=0)tab.find('.list_carrinho').datagrid('deleteRow',rowIndex);       	
       	if(rowIndex>=0)tab.find('.list_carrinho').datagrid('selectRow',rowIndex-1);
       	calculoTotal(target)
	}

	function arrowLeft(target){
		var getTabIndex = target.find('.tab_pdv').tabs('getSelected');
		var index = target.find('.tab_pdv').tabs('getTabIndex',getTabIndex)-0;
		target.find('.tab_pdv').tabs('select',index-1);
	}

	function arrowRight(target){
		var getTabIndex = target.find('.tab_pdv').tabs('getSelected');
		var index = target.find('.tab_pdv').tabs('getTabIndex',getTabIndex)-0;
		target.find('.tab_pdv').tabs('select',index+1);
	}

	function arrowUp(target){
		var tab = target.find('.tab_pdv').tabs('getSelected');
		var getSelected = tab.find('.list_carrinho').datagrid('getSelected');
        var rowIndex = tab.find('.list_carrinho').datagrid("getRowIndex", getSelected);
        
        if(rowIndex<=0)rowIndex=0;

        tab.find('.list_carrinho').datagrid('selectRow',rowIndex-0-1);
	}

	function arrowDown(target){
		var tab = target.find('.tab_pdv').tabs('getSelected');
		var getSelected = tab.find('.list_carrinho').datagrid('getSelected');
        var rowIndex = tab.find('.list_carrinho').datagrid("getRowIndex", getSelected);
        
        tab.find('.list_carrinho').datagrid('selectRow',rowIndex-0+1);
	}

	function somaMais(target){
		var tab = target.find('.tab_pdv').tabs('getSelected');
		var getSelected = tab.find('.list_carrinho').datagrid('getSelected');
		var rowIndex = tab.find('.list_carrinho').datagrid("getRowIndex", getSelected);	

		tab.find('.list_carrinho').datagrid('updateRow',{
			index: rowIndex,
			row: {cod: getSelected.cod, 
				nome: getSelected.nome, 
				preco: getSelected.preco, 
				qnt: getSelected.qnt-0+1,
				total: somaRow(getSelected.preco,getSelected.qnt-0+1)
			}
		})
		calculoTotal(target)
	}

	function somaMenos(target){
		var tab = target.find('.tab_pdv').tabs('getSelected');
		var getSelected = tab.find('.list_carrinho').datagrid('getSelected');
		var rowIndex = tab.find('.list_carrinho').datagrid("getRowIndex", getSelected);	

		if(getSelected.qnt>=2){
			tab.find('.list_carrinho').datagrid('updateRow',{
				index: rowIndex,
				row: {cod: getSelected.cod, 
					nome: getSelected.nome, 
					preco: getSelected.preco, 
					qnt: getSelected.qnt-0-1,
					total: somaRow(getSelected.preco,getSelected.qnt-0-1)
				}
			})
		}
		calculoTotal(target)
	}

	function multimipar(target){
		var valor = prompt("Digite o valor");
		if(valor){
			var tab = target.find('.tab_pdv').tabs('getSelected');
			var getSelected = tab.find('.list_carrinho').datagrid('getSelected');
			var rowIndex = tab.find('.list_carrinho').datagrid("getRowIndex", getSelected);	

			if((valor-0)<=1)valor = 1;
			if(isNaN(valor))return;

			tab.find('.list_carrinho').datagrid('updateRow',{
				index: rowIndex,
				row: {cod: getSelected.cod, 
					nome: getSelected.nome, 
					preco: getSelected.preco, 
					qnt: valor-0,
					total: somaRow(getSelected.preco,valor-0)
				}
			})
		}
		calculoTotal(target)
	}	
	
	function dividir(target){
		var valor = prompt("Digite o valor");
		if(valor){
			var tab = target.find('.tab_pdv').tabs('getSelected');
			var getSelected = tab.find('.list_carrinho').datagrid('getSelected');
			var rowIndex = tab.find('.list_carrinho').datagrid("getRowIndex", getSelected);	

			if((valor-0)<=1)valor = 1;
			if(isNaN(valor))return;

			tab.find('.list_carrinho').datagrid('updateRow',{
				index: rowIndex,
				row: {cod: getSelected.cod, 
					nome: getSelected.nome, 
					preco: getSelected.preco, 
					qnt: (getSelected.qnt/valor-0).toFixed(2),
					total: somaRow(getSelected.preco,(getSelected.qnt/valor-0))
				}
			})
		}
		calculoTotal(target)
	}	

	function somaRow(preco,qnt){
		return retorno = (preco * qnt).toFixed(2);
	}	

	function calculoTotal(target){
		var tab = target.find('.tab_pdv').tabs('getSelected');
		var getRows = tab.find('.list_carrinho').datagrid('getRows');

		var total = 0
		var pago = 0
		var troco = 0

		$.each(getRows, function( index, value ) {
			if(value.total>=0)total = value.total-0 + total;
			if(value.total<=0)pago = value.total-0 + pago;
		});	

		troco = total+pago;

		tab.find('.total').textbox('setValue', 'R$ '+total.toFixed(2));
		tab.find('.pago').textbox('setValue', 'R$ '+(-pago).toFixed(2));
		tab.find('.troco').textbox('setValue', 'R$ '+(-troco).toFixed(2));
		
		if(troco<=0){
			tab.find('.troco').textbox({
				cls:'cls_trocoNegativo'
			})
			$('.cls_trocoNegativo').removeClass('cls_trocoPositivo')
		}else{
			tab.find('.troco').textbox({
				cls:'cls_trocoPositivo'
			})
			$('.cls_trocoPositivo').removeClass('cls_trocoNegativo')
		}	
	}


	function appendRow(target,opts){
		var tab = target.find('.tab_pdv').tabs('getSelected');

		if(!tab){
			add_tab(target,opts);
			appendRow(target,opts);
			return;
		}

		var getRows = tab.find('.list_carrinho').datagrid('getRows');
		var edit = false;
		var index_edit = 0;

		$.each(getRows, function( index, value ) {
			if(opts.cod===value.cod){
				opts.qnt = (value.qnt-0)+1;
				edit = true;
				index_edit = index;
			}
		});		

		opts.total = somaRow(opts.preco,opts.qnt);

		if(edit==true){
			tab.find('.list_carrinho').datagrid('updateRow',{
				index: index_edit,
				row: opts
			})
			tab.find('.list_carrinho').datagrid('selectRow',index_edit);
		}else{
			tab.find('.list_carrinho').datagrid('appendRow',opts);
			tab.find('.list_carrinho').datagrid('selectRow',getRows.length-1);			
		}

		calculoTotal(target);
	}
	
	function closeTab(target){
		var getTabIndex = target.find('.tab_pdv').tabs('getSelected');
		var index = target.find('.tab_pdv').tabs('getTabIndex',getTabIndex)-0;
		target.find('.tab_pdv').tabs('close',index)		
	}

	var tabs = 0
	function add_tab(target,opts){

		var getTabIndex = target.find('.tab_pdv').tabs('getSelected');
		var index = target.find('.tab_pdv').tabs('getTabIndex',getTabIndex)-0;

		tabs++;
		target.find('.tab_pdv').tabs('add',{
			title:(tabs),
			iconCls:'cart_32',
			border:0,
			content:'<div class="easyui-layout"></div>',
			closable:true,
			onOpen:function(){		
				target.find('.easyui-layout').layout({
					border:0,
					fit:true
				});
				target.find('.easyui-layout').layout('add',{
				    region: 'center',
				    content:'<div class="list_carrinho" ></div>',
				    onOpen:function(){
				    	target.find('.list_carrinho').datagrid({
				    		border:0,
							columns:[[
						        {field:'cod',title:'CODIGO',width:100, align:'center'},
						        {field:'nome',title:'NOME DO PRODUTO',width:250},
						        {field:'preco_form',title:'PREÇO',width:100, align:'center',
						        formatter:function(val,row){
						        	return "R$ "+row.preco
						        }},
						        {field:'qnt',title:'QNT',width:50},
						        {field:'total_form',title:'TOTAL',width:100, align:'center',
						        formatter:function(val,row){
						        	return "R$ "+row.total
						        }},					        
						    ]]
				    	});
				    },
				    border:0
				});	
				target.find('.easyui-layout').layout('add',{
				    region: 'east',
				    title: 'Informações',
				    content:`<div class="easyui-panel total_carrinho" style="padding:3px; background-color:#ddd" fit="true" >
				    <input class="easyui-textbox total" readonly data-options="cls:'cls_total'" labelPosition="top" label="Valor Total:" >
				    <input class="easyui-textbox pago" readonly data-options="cls:'cls_pago'" labelPosition="top" label="Valor Pago:" >
				    <input class="easyui-textbox troco" readonly data-options="cls:'cls_troco'" labelPosition="top" label="Valor Troco:" >
				    </div>`,
				    border: 0,
				    width: 180
				});	


			}			
		});	
	}

	function buildEditor(target){
		
		var state = $.data(target, 'pdv');
		var opts = state.options;

		state.layoutDialog = $(target).panel({
			fit:true,
		    content:'<div class="tab_pdv"></div>',
		    border:0
		});

		state.layoutDialog.find('.tab_pdv').tabs({
			boder:0,
			fit:true
		})


	}

	$.fn.pdv = function(options, param){

		if (typeof options == 'string'){
			var method = $.fn.pdv.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.dialog(options, param);
			}
		}

		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'pdv');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'pdv', {
					options: $.extend({}, $.fn.pdv.defaults, $.fn.pdv.parseOptions(this), options)
				});
			}
			buildEditor(this);
		});
	};

	$.fn.pdv.methods = {
		options: function(jq){
			return jq.data('pdv').options;
		},
		addTab: function(jq,opts){			
			return add_tab(jq,opts);
		},	
		appendRow:function(jq,opts){			
			return appendRow(jq,opts);
		},	
		somaMais:function(jq,opts){			
			return somaMais(jq);
		},
		somaMenos:function(jq,opts){			
			return somaMenos(jq);
		},		
		arrowUp: function(jq){
			return arrowUp(jq);
		},
		arrowDown: function(jq){
			return arrowDown(jq);
		},		
		arrowLeft: function(jq){
			return arrowLeft(jq);
		},		
		arrowRight: function(jq){
			return arrowRight(jq);
		},	
		deleteRow: function(jq){
			return deleteRow(jq);
		},
		multimipar: function(jq){
			return multimipar(jq);
		},
		dividir: function(jq){
			return dividir(jq);
		},
		closeTab: function(jq){
			return closeTab(jq);
		},
		getRowSelec: function(jq){
			return getRowSelec(jq);
		},	
		updateRow: function(jq,data){
			return updateRow(jq,data);
		},
		destroy: function(jq){
			return jq.each(function(){
				var opts = $(this).pdv('options');
				$(opts.dlgToolbar).panel('clear');
				$(this).dialog('destroy');
			});
		},
	};

	$.fn.pdv.parseOptions = function(target){
		return $.extend({}, $.fn.datagrid.parseOptions(target), {

		});
	};

	$.fn.pdv.defaults = $.extend({}, $.fn.panel.defaults, {
//		fit:true,
//		pagination:true,
//		singleSelect:true,
//		remoteFilter:true,
//		defaultFilterType:'textbox'
		//title: 'null',
		//cls: 'pdv',
		//bodyCls: 'pdv-body',
		//draggable: false,
		//shadow: false,
		//closable: false,
		//inline: true,
		//border: 'thin',
		//modal:true,

	});

	$.parser.plugins.push('pdv');

})(jQuery);
