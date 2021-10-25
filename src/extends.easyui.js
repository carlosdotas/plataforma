(function($){


	function addInputs(target){

		var state = $.data(target, 'inputs');
		var opts = state.options;

		$(target).find('form').html('');
		$.each(opts.fields[0], function( index, value ) {

			value.label = value.title;
			$(target).find('form').append(`<div class="inputsEasyui"><input name="${value.field}" ></div>`);
			eval(`$(target).find('form').find( 'input[name="${value.field}"]' ).${value.type}(value);`);

		});		

	}	

	function buildEditor(target){
		
		var opts = $.data(target, 'inputs').options;

		$(target).append('<form border="0" >Formulario</form>');

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
//		fit:true,
//		pagination:true,
//		singleSelect:true,
//		remoteFilter:true,
//		defaultFilterType:'textbox'
		//title: 'null',
		//cls: 'inputs',
		//bodyCls: 'inputs-body',
		//draggable: false,
		//shadow: false,
		//closable: false,
		//inline: true,
		//border: 'thin',
		//modal:true,

	});

	$.parser.plugins.push('inputs');

})(jQuery);
	