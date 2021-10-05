(function ($) {
    var _self = {};

    $.fn.build = function (options) {
        var settings = {};
        var dataObject = {};

        _self = this;
        options = options || {};
        $.extend(settings, options);
        $.fn.build.createMenu(settings);
        $('.htabs a').tabs();

        $(document.head).append('<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.3/jspdf.min.js" />');
    }

    $.fn.build.createMenu = function (s) {
        $.fn.build.clearMenu(s);
        var logo;
        var globalElem = [];

        if (s.data.logo != '') {
            logo = $('<div class="el_logo"><a class="logo" href="' + s.data.home + '"><img src="' + s.data.logo + '" title="' + s.data.name + '" alt="' + s.data.name + '" /></a></div>');
            dataObject = {home: s.data.home, name: s.data.name, logo: s.data.logo};

        }
        dataObject.fon_image = s.data.fon_image;

        $(s.menuSelector).append(logo);
        $(s.saveSelector).bind('click', $.fn.build.savePDF);
        if (s.data.data.length) {
            var item_index = 0;
            for (i = 0; i < s.data.data.length; i++) {
                html = '<div class="el" id="el' + i + '"><div class="wrap_head"><img src="' + s.data.data[i].ico + '" /><div class="head">' + s.data.data[i].name + '</div ></div>';
                $(s.menuSelector).append(html);
                if (s.data.data[i].elements.length > 0) {
                    elements = s.data.data[i].elements;
                    html = '<div class="wrap_menu" id="wm' + i + '">'
                    $('#el' + i).append(html);
                    for (e = 0; e < elements.length; e++) {
                        if (elements[e].material.length > 1) {
                            //меню с табами для типа кровли
                            html = '<div class="el_m"><div class="head_el">' + elements[e].name + '</div><div  class="htabs"  id="el_m' + e + '">';
                            $('#wm' + i).append(html);
                            materials = elements[e].material;
                            for (m = 0; m < materials.length; m++) {
                                html = '<a href="#tab' + m + '">' + materials[m].name + '</a>';
                                $('#el_m' + e).append(html);
                            }
                            for (m = 0; m < materials.length; m++) {
                                html = '<div class="el_m el_tab" id="tab' + m + '"><div class="head_el"></div>	';
                                colors = elements[e].material[m].colors;
                                html += '<ul class="value_el el_color f_tab" id="mc' + m + '">';
                                $('#wm' + i).append(html);
                                $.each(colors, function (ind, sel) {
                                    html = '<li ' + ((sel == 'selected' && m == 0) ? 'class="active"' : '') + '><span style="background-color:#' + ind + ';"></span></li>';
                                    item = $(html)
                                    var struct = new Image;
                                    struct.src = materials[m].struct;
                                    item.bind('click', {d: {
                                            color: ind,
                                            struct: struct,
                                            name: materials[m].name,
                                            index: item_index
                                        }}, $.fn.build.itemClick);
                                    $('#mc' + m).append(item);

                                    if (sel == 'selected' && m == 0) {
                                        globalElem.push({
                                            color: ind,
                                            struct: struct,
                                            name: materials[m].name
                                        });

                                    }


                                })
                            }
                        } else {
                            //просто с цветами
                            html = '<div class="el_m"><div class="head_el">' + elements[e].name + '<br></div>	';
                            colors = elements[e].material[0].colors;
                            html += '<ul class="value_el el_color" id="c' + i + e + '">';
                            $('#wm' + i).append(html);
                            $.each(colors, function (ind, sel) {
                                html = '<li ' + ((sel == 'selected') ? 'class="active"' : '') + '><span style="background-color:#' + ind + ';"></span></li>';
                                item = $(html);
                                var struct = new Image;
                                struct.src = elements[e].material[0].struct;
                                item.bind('click', {d: {
                                        color: ind,
                                        struct: struct,
                                        name: elements[e].name,
                                        index: item_index
                                    }}, $.fn.build.itemClick);
                                $('#c' + i + e).append(item);
                                if (sel == 'selected') {
                                    globalElem.push({
                                        color: ind,
                                        struct: struct,
                                        name: elements[e].name
                                    });
                                }
                            })
                        }
                        item_index++;
                    }
                }
            }

        }
        dataObject.data = globalElem;
//        logo.bind('click', {d: dataObject}, $.fn.build.logoClick);
        $.fn.build.render();

    }
    $.fn.build.clearMenu = function (s) {
        $(s.menuSelector).html('');
    }
    $.fn.build.itemClick = function (s) {
        var val = s.data.d;
        dataObject.data[val.index].color = val.color;
        dataObject.data[val.index].struct = val.struct;
        $('#' + $(s.target).parent().parent().attr('id') + ' li').removeClass('active');

        if ($(s.target).parent().parent().hasClass('f_tab')) {
            $('#' + $(s.target).parent().parent().parent().parent().attr('id') + ' .f_tab  li').removeClass('active');
        }

        $(s.target).parent().addClass('active');
        $.fn.build.render();
    }
    $.fn.build.savePDF = function () {
        var canvas = document.getElementById($(_self).attr('id'));
        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        var pdf = new jsPDF({
            orientation: 'l',
            unit: 'px',
            format: 'a3',
            hotfixes: [] // an array of hotfix strings to enable
        });

        pdf.addImage(imgData, 'JPEG', 0, 0, 2000 / 2.2, 1044 / 2.2);
        pdf.save("myhouse.pdf");
    }

    $.fn.build.render = function () {
        var canvas = document.getElementById($(_self).attr('id'));
        ctx = canvas.getContext("2d");
        $(canvas).fadeOut(0);
        var fonimage = new Image;
        fonimage.src = dataObject.fon_image;
        var load = 0;
        for (i = 0; i < dataObject.data.length; i++) {
            if (dataObject.data[i].struct.width + dataObject.data[i].struct.height > 0) {
                load++;
            }
        }
        fonimage.onload = function () {
            if (load == dataObject.data.length) {
                $.fn.build._render();
            } else {
                setTimeout($.fn.build._render, '1500');
            }

        }

        $.fn.build._render = function () {
            ctx.drawImage(fonimage, 0, 0, fonimage.width, fonimage.height);
            $('.tpl').remove();
            var nCanvas = $('<canvas class="tpl"  width="2000" height="1044" style="z-index:' + 10 * (1 + 1) + ' ;"></canvas>');
            for (i = 0; i < dataObject.data.length; i++) {
                var nctx = nCanvas[0].getContext("2d");
                nctx.clearRect(0, 0, canvas.width, canvas.height);
                var img1 = dataObject.data[i].struct;
                nctx.drawImage(img1, 0, 0, fonimage.width, fonimage.height);
                var imageData = nctx.getImageData(0, 0, img1.width, img1.height);
                var col = $.fn.build.HexToRGB(dataObject.data[i].color);
                imageDataFiltered = $.fn.build.color(imageData, col);
                nctx.putImageData(imageData, 0, 0);
                ctx.drawImage(nCanvas[0], 0, 0, fonimage.width, fonimage.height);
            }
            $('.tpl').remove();
            
        }
        $(canvas).fadeIn(0);
    }

    $.fn.build.HexToRGB = function (hex) {
        var hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
        return [hex >> 16, (hex & 0x00FF00) >> 8, (hex & 0x0000FF)];
    },
    $.fn.build.color = function (imageData, rgb_color) {
        // получаем одномерный массив, описывающий все пиксели изображения
        var pixels = imageData.data;
        // циклически преобразуем массив, изменяя значения красного, зеленого и синего каналов

        for (var i = 0; i < pixels.length; i += 4) {
            var r = pixels[i];
            var g = pixels[i + 1];
            var b = pixels[i + 2];
         /*   pixels[i] = Math.floor(rgb_color[0] * r / 255);//+rgb_color[0]+(g * 0.769)+(b * 0.189); // red
            pixels[i + 1] = Math.floor(rgb_color[1] * g / 255);//+(r * 0.349)+rgb_color[1]+(b * 0.168); // green
            pixels[i + 2] = Math.floor(rgb_color[2] * b / 255);//+(r * 0.272)+(g * 0.534)+rgb_color[2]; // blue*/
          /*  if(((pixels[i]+pixels[i+1]+pixels[i+2])/3)>250){
                pixels[i] = Math.floor(rgb_color[0] * r / 255);
                pixels[i + 1] = Math.floor(rgb_color[1] * g / 255);
                pixels[i + 2] = Math.floor(rgb_color[2] * b / 255);
            }else{
                pixels[i]=Math.floor((r+1)/255*(r+2*(rgb_color[0]+1)/255*(255-r)));
                pixels[i+1]=Math.floor((g+1)/255*(g+2*(rgb_color[1]+1)/255*(255-g)));
                pixels[i+2]=Math.floor((b+1)/255*(b+2*(rgb_color[2]+1)/255*(255-b)));
            }*/
            if(((rgb_color[0]+rgb_color[1]+rgb_color[2])/3)>240){
               rgb_color[0]=rgb_color[1]=rgb_color[2]=(rgb_color[0]+rgb_color[1]+rgb_color[2])/3-40;
            }
                pixels[i]=Math.floor((r+rgb_color[0]-128));
                pixels[i+1]=Math.floor((r+rgb_color[1]-128));
                pixels[i+2]=Math.floor((r+rgb_color[2]-128));
            if(((pixels[i]+pixels[i+1]+pixels[i])/3)<20&&pixels[i]<=0&&pixels[i+1]<=0&&pixels[i+2]<=0){
                
                pixels[i]=Math.floor((r+rgb_color[0]-128)+35);
                pixels[i+1]=Math.floor((r+rgb_color[1]-128)+35);
                pixels[i+2]=Math.floor((r+rgb_color[2]-128)+35);
            }
          /*  
            if(pixels[i]<240){
                pixels[i]=Math.floor((r+1)/255*(r+2*(rgb_color[0]+1)/255*(255-r)));
            }else{
                pixels[i] = Math.floor(rgb_color[0] * r / 255);
            }
            if(pixels[i+1]<240){
                pixels[i+1]=Math.floor((g+1)/255*(g+2*(rgb_color[1]+1)/255*(255-g)));
            }else{
                pixels[i + 1] = Math.floor(rgb_color[1] * g / 255);
            }
            if(pixels[i+2]<240){
            pixels[i+2]=Math.floor((b+1)/255*(b+2*(rgb_color[2]+1)/255*(255-b)));
            }else{
                pixels[i + 2] = Math.floor(rgb_color[2] * b / 255);
            }
            */
            
            //pixels[i + 3]=pixels[i + 3]*0.9;
        }
        return imageData;
    };

})(jQuery);

$.fn.build.logoClick = function (s) {
    //console.log(s);
    console.log(s.data.d);
    return false;
}

	