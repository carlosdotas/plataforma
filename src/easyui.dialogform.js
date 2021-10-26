/**
 * Desktop Extension for jQuery EasyUI
 * version: 1.0.1
 * 		
 *	$('').dialogForm({
		href:"modulos/marcas/form.html",
		server:'server.php?buscar_mysql=marcas&marcas_id=1',
		formData:{nome:'Nometeste'},
		onSend:function(data,dialog){
			alert($(data).serialize());
			$(dialog).dialogForm('close');
		},			
		onClose:function(){
			//alert();
		},
		onSave:function(dados){
			console.log(dados);
		},
		onError:function(dados){
			console.log(dados);
		}			
	});
 */
(function($){


	function sendForm(target,onSend,onSave,onError){
		var opts = $.data(target, 'dialogForm').options;
		const form =  $(target).dialog('dialog').find('form');

		$.messager.progress();  

        if(opts.post==false){
            var isValid = $(form).form('validate');
            if (!isValid){
            	
            	$.messager.alert({
					title: 'Erro!',
					msg: 'Preencha todos os Campos Obrigatórios!',
					fn: function(){
						$(form).form('validate'); 
					}
				});
                
                
                $.messager.progress('close');
                return isValid;   

            }
			var serialize = {}
			$.each($(form).serializeArray(), function( index, value ) {						
            	serialize[value.name] = value.value;
            });

			opts.onSend(serialize);
 			//$(target).dialog('close')
			//$(target).dialog('destroy');  
			$.messager.progress('close');			
			return;
		}
	        		
	    $(form).form('submit', {
	        ajax:true,        
	        onSubmit: function(){
	            var isValid = $(form).form('validate');
	            if (!isValid){
	            	
	            	$.messager.alert({
						title: 'Erro!',
						msg: 'Preencha todos os Campos Obrigatórios!',
						fn: function(){
							$(form).form('validate'); 
						}
					});
	                
	                
	                $.messager.progress('close');

	            }
	            return isValid; 
	        },
	        success: function(dados){
	        	
	        	var retorno = {}




				try {
				   	retorno = JSON.parse(dados);

				   	if(retorno==null){
				   		var retorno = {}
				   		retorno.error = {'Comunicação':"Servicdor não responde"}
				   	}
				}
				catch (e) {				   
				   //retorno.error = {Json:"Servicdor não responde Json"}
				}

	        	$.messager.progress('close');  

	        	if(retorno.error){
					$.each(retorno.error, function( index, value ) {						
		            	$.messager.alert(index,value);	
	                });				
					if(onSave){onError(retorno)}
	        	}else{


					if(onSend){
						var serialize = {}
						$.each($(form).serializeArray(), function( index, value ) {						
			            	serialize[value.name] = value.value;
		                });
						$( "body" ).unbind( "keyup");
						$( "body" ).unbind( "keydown");	
						onSend(serialize);
						$(target).dialog('close')
						$(target).dialog('destroy')	
							
						return;
					}

	        		if(onSave){onSave(retorno)}
		            $.messager.show({
		                    title:'Salvo',
		                    msg:'Item Salvo com sucesso!',
		                    timeout:1000,
		                    showType:'slide'
		                });    
 					$(target).dialog('close')
					$(target).dialog('destroy');  
					$(target).remove(); 
	        	}
                           
	        }
	    });
		

	}

	function onPost(target){
		var opts = $.data(target, 'dialogForm').options;

		sendForm(target,
		opts.onSend,
		function(dados){
			opts.onSave(dados);
		},
		function(dados){
			opts.onError(dados);
		})		
	}


	function getRandomInt(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min)) + min;
	}

	function buildEditor(target){
		
		var opts = $.data(target, 'dialogForm').options;
		var content = '';
		var ids='dialog_'+getRandomInt(10000, 99999);

		$(opts.dlgToolbar).panel('clear').remove();


	    $('body').teclas({
	        Enter:function(){
	   			onPost(target);
 			
	        },  
	        Escape:function(){
				$( "body" ).unbind( "keyup");
				$( "body" ).unbind( "keydown");	 
				$(target).dialog('close');
				$(target).dialog('destroy');
	        },
	    })


		$.get( opts.href, function( data ) {

			if(opts.onSend)var onSend = function(dados){
				opts.onSend(dados,target)
			}
			
			var btn_close = {
					text:'Fechar',
					iconCls:'cancel_32',
					handler:function(){
						$(target).dialog('close')
						$(target).dialog('destroy')
					}
				}

			var btn_save = {
					text:'Salvar',
					iconCls:'diskette_32',
					handler:function(){

						onPost(target);

					}
				}

			if(opts.buttons){
				var buttons = opts.buttons;
			}else{
				var buttons = [];
			}

			if(opts.closable!=false){
				buttons.push(btn_close)
			}
			if(opts.saveble!=false){
				buttons.push(btn_save)
			}
			var params_meta = {
				href:'',
				content:data,
				buttons:buttons,
				onOpen:function(){
					const form =  $(target).dialog('dialog').find('form');
					
					if(opts.formData){
						setTimeout(function(){ 
							$(form).form('load',opts.formData);
						 }, 100);
						
					}else{
						$(form).form('load',opts.server);
					}

					$(this).prepend('<script>var dialogForm = '+$(this).attr('id')+';</script>');					
				},			
				onClose:function(){
					if(opts.onClose){
						opts.onClose()
					}
					  	
					//$("#"+opts.id).dialog('destroy');  
				}
			}

			const meta =  $(data).children('meta');
			$.each(meta.prevObject[0].attributes, function( index, value ) {				
				params_meta[value.name] = value.value;	
            });		

			//

			$(target).dialog($.extend({}, opts, params_meta));

		});
		
	}

	$.fn.dialogForm = function(options, param){

		if(!this[0]){
			var ids='dialog_'+getRandomInt(10000, 99999);
			$('body').append('<div id="'+ids+'"></div>');
			$('#'+ids).dialogForm(options,param);
			return
		}

		if (typeof options == 'string'){
			var method = $.fn.dialogForm.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.dialog(options, param);
			}
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'dialogForm');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'dialogForm', {
					options: $.extend({}, $.fn.dialogForm.defaults, $.fn.dialogForm.parseOptions(this), options)
				});
			}
			buildEditor(this);
		});
	};

	$.fn.dialogForm.methods = {
		options: function(jq){
			return jq.data('dialogForm').options;
		},
		getEditor: function(jq){
			return jq.closest('.dialogForm').children('.dialogForm-body');
		}
	};

	$.fn.dialogForm.parseOptions = function(target){
		return $.extend({}, $.fn.dialog.parseOptions(target), {

		});
	};

	$.fn.dialogForm.defaults = $.extend({}, $.fn.dialog.defaults, {
		//title: 'null',
		cls: 'dialogForm',
		bodyCls: 'dialogForm-body',
		//draggable: false,
		//shadow: false,
		//closable: false,
		//inline: true,
		//border: 'thin',
		modal:true,
		onLoad: function(object){
			
		},		
		onSave: function(){
			
		},
		onError: function(){
			
		},

	});


	$.parser.plugins.push('dialogForm');
})(jQuery);
