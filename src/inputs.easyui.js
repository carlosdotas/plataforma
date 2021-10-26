//Inputs
///////////////////////////////////////////////////////////////////////////////////////
(function($){

	function addInputs(target){

		var state = $.data(target, 'inputs');
		var opts = state.options;

		$(target).find('.formRows').html('');
		$.each(opts.fields[0], function( index, value ) {

			var inputs_types = ["hidden","validatebox","textbox","passwordbox","maskedbox","combo","combobox","combotree","combogrid","combotreegrid","tagbox","numberbox","datebox","datetimebox","datetimespinner","calendar","spinner","numberspinner","timespinner","timepicker","slider","filebox","checkbox","radiobutton"];

			if(!value.label) value.label = value.title;
			if(!value.type) value.type="textbox"
			if(!value.value) value.value=""
			if(!value.col) value.col="12"	
			if(!value.labelPosition) value.labelPosition="top"
			//if(!value.cls) value.cls=value.field	

			if(search (inputs_types, value.type)){

				if(value.type=='hidden'){
					$(target).find('.formRows').append(`<input type="hidden" class="${value.field}" name="${value.field}" value="${value.value}" >`);
				}else{

					$(target).find('.formRows').append(`<div class="col-${value.col}"><input class="${value.field}" name="${value.field}" ></div>`);
					eval(`$(target).find('.formRows').find('input[name="${value.field}"]' ).${value.type}(value);`);

				}
			}
		});		
	}	

	function getData(target){
		return $(target).find('.formRows :input').serializeArray();
	}	

	function setData(target,data){
		$(target).find(`.formRows`).form('load',data);
	}		

	function buildEditor(target){
		var opts = $.data(target, 'inputs').options;
		$(target).append(`<div class="row formRows"></div>`);
		addInputs(target)
	}

	$.fn.inputs = function(options, param){

		if (typeof options == 'string'){
			var method = $.fn.inputs.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.dialog(options, param);
			}
		}

		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'inputs');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'inputs', {
					options: $.extend({}, $.fn.inputs.defaults, $.fn.inputs.parseOptions(this), options)
				});
			}
			buildEditor(this);
		});
	};

	$.fn.inputs.methods = {
		options: function(jq){
			return jq.data('inputs').options;
		},
		getData: function(jq){
			return getData(jq);
		},		
		setData: function(jq,data){
			return setData(jq,data);
		},			
		destroy: function(jq){
			return jq.each(function(){
				var opts = $(this).inputs('options');
				$(opts.dlgToolbar).panel('clear');
				$(this).dialog('destroy');
			});
		},
	};

	$.fn.inputs.parseOptions = function(target){
		return $.extend({}, $.fn.textbox.parseOptions(target), {

		});
	};

	$.fn.inputs.defaults = $.extend({}, $.fn.textbox.defaults, {
	});

	$.parser.plugins.push('inputs');

})(jQuery);
	