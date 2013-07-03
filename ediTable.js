(function($) {
    $.fn.ediTable = function(options) {
        var settings = $.extend({
            attributes: null
        },options);

        return this.each(function(){
            var $rows = $(this).find('tbody').find('tr');
            $.each($rows, function(index,$row){
                var $form = $('<form>').attr({
                    style: 'display: none;'
                });
                $.each(settings.attributes,function(index,value){
                    $('<input>').attr({
                        name: value
                    }).appendTo($form);
                });
                $form.insertAfter($row);
            })
        })
    }
})(jQuery);
