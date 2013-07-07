(function($) {
    $.fn.ediTable = function(options) {
        var settings = $.extend({
            fields: null,
            onUpdate: null,
            onDestroy: null
        },options);

        $('.ediTable-edit').on('click',function(){
            var $row = $(this).parents('tr');
            var $cols = $row.find('td[class!="ediTable-exclude"]');
            $.each($cols,function(index,col){
                var value = $(col).html();
                $(col).html('');
                var field = settings.fields[index]
                var $input = null;
                if('type' in field)
                    switch(field.type){
                        case 'text':
                            $input = $('<input>').attr({type: 'text' , value: value });
                            break;

                        case 'checkbox':
                            $input = $('<input>').attr({type: 'checkbox', value: true, checked: field.labels[0] == value ? true : false});
                            var hidden_field = $('<input>').attr({name: field.name, type:'hidden',value: false });
                            $(col).append(hidden_field);
                            break;

                        case 'select':
                            $input = $('<select>')
                            $.each(field.values, function(index, value){
                                var $option = $('<option>').attr({ value: value[0] }).html(value[1]);
                                $input.append($option);
                            });
                            $input.find('option').filter(function(){ return $(this).html() == value }).attr('selected', true);
                            break;

                        case 'date':
                            var date_format = 'dateFormat' in field.options ? field.options.dateFormat : "mm/dd/yy";
                            $input = $('<input>').attr({ type: 'text', value: value }).datepicker(field.options);
                            $input.defaultDate = $.datepicker.parseDate(date_format, value)

                    }
                else
                    $input = $('<input>').attr({type: 'text' , value: value });
                $input.attr({name: field.name})
                $(col).append($input);
            })
            $row.find('.ediTable-save').attr('disabled',false);
            $(this).attr('disabled',true);
        });

        $('.ediTable-save').on('click',function(){
            var save_button = $(this);
            var $row = save_button.parents('tr');
            var update_url = $(this).data('update-url');
            $.ajax(
                {
                    url: update_url,
                    data: $row.find('input,select').serialize(),
                    success: function(response) {
                        var $cols = $row.find('td[class!="ediTable-exclude"]');
                        $.each($cols,function(index,col){
                            var input = $(col).find('input[type!="hidden"],select');
                            var value = '';
                            var field = settings.fields[index];
                            switch(input.prop('tagName')) {
                                case 'INPUT':
                                    switch(input.attr('type')) {
                                        case 'text':
                                            value = input.val();
                                            break;
                                        case 'checkbox':
                                            input.is(':checked') ? value = field.labels[0] : value = field.labels[1];
                                    }
                                    break;
                                case 'SELECT':
                                    value = input.find(':selected').text();
                            }

                            input.replaceWith(value)
                        })
                        $row.find('.ediTable-edit').attr('disabled',false);
                        save_button.attr('disabled',true);
                        if($.isFunction( settings.onUpdate ))
                            settings.onUpdate(response);
                    },
                    type: 'put',
                    dataType: 'json'
                }
            );

        });

        $(".ediTable-destroy").on('click', function(){
            var $row = $(this).parents('tr');
            $.ajax({
                url: $(this).data('destroy-url'),
                type: 'delete',
                dataType: 'json',
                success: function(response) {
                    $row.fadeOut(1000,function(){ $(this).remove(); });
                    if($.isFunction( settings.onDestroy ))
                        settings.onDestroy(response);
                }
            });

        })

        return this.each(function(){
            $(this).find('.ediTable-save').attr('disabled',true)
        })
    }
})(jQuery);
