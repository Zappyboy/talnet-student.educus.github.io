(function(a){jQuery.fn.dropDownChoice=function(b){b=jQuery.extend({autoselect:false},b);if(b.autoselect){var d=this.find("option[value!='']");if(d.length==1){var c=this.val();var e=d.attr("value");if(c!=e){this.val(e);this.change();if(b.ajax){b.ajax()}}}}}})(jQuery);