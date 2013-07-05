(function($) {
    $.fn.ediTable = function(options) {
        var settings = $.extend({
            attributes: null,
            onUpdate: null
        },options);

        $('.ediTable-edit').on('click',function(){
            var $row = $(this).parents('tr');
            var $cols = $row.find('td[class!="action"]');
            $.each($cols,function(index,col){
                var $input = $('<input>').attr({name: settings.attributes[index], type: 'text', value: $(col).html() });
                $(col).html($input);
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
                    data: $row.find('input[type="text"]').serialize(),
                    success: function(response) {
                        var $cols = $row.find('td[class!="action"]');
                        $.each($cols,function(index,col){
                            var input = $(col).find('input');
                            input.replaceWith(input.val())
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
