(function($) {
    $.fn.ediTable = function(options) {
        var settings = $.extend({
            fields: null,
            onUpdate: null
        },options);

        $('.ediTable-edit').on('click',function(){
            var $row = $(this).parents('tr');
            var $cols = $row.find('td[class!="action"]');
            $.each($cols,function(index,col){
                var value = $(col).html();
                $(col).html('');
                var field = settings.fields[index]
                var $input = $('<input>').attr({name: field.name, type: 'text' , value: value });
                if('type' in field)
                    switch(field.type){
                        case 'checkbox':
                            $input.attr({type: 'checkbox', value:true, checked: field.labels[0] == value ? true : false})
                            var hidden_field = $('<input>').attr({name: field.name, type:'hidden',value: false });
                            $(col).append(hidden_field)
                    }
                $(col).append($input);
            })
            $row.find('.ediTable-save').attr('disabled',false);
            $(this).attr('disabled',true);
        });

        $('.ediTable-save').on('click',function(){
            var save_button = $(this);
            var $row = save_button.parents('tr');
            $.ajax(
                {
                    url: $row.data('update-url'),
                    data: $row.find('input').serialize(),
                    success: function(response) {
                        var $cols = $row.find('td[class!="action"]');
                        $.each($cols,function(index,col){
                            var input = $(col).find('input[type!="hidden"]');
                            var value = '';
                            var field = settings.fields[index];
                            switch(input.attr('type')) {
                                case 'checkbox':
                                    input.is(':checked') ? value = field.labels[0] : value = field.labels[1];
                                    break;
                                default:
                                    value = input.val();
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

        })

        return this.each(function(){
            var $rows = $(this).find('tbody tr');
            $.each($rows, function(index,row){
                var id = $(row).data('id')
                $(row).find('.ediTable-edit, .ediTable-save').attr('data-id',id);
                $('.ediTable-save').attr('disabled',true)
            })
        })
    }
})(jQuery);
