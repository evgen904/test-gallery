$(function(){

    let urlList = [];

    $(document).on('click','.js-btn-loader',function(){

        if ($('.js-url-loader').val()!='') {

            let url = $('.js-url-loader').val();
            let urlArray = url.split('.');

            if (urlArray[urlArray.length-1].toLowerCase() == 'json') {
                
                let findUrl = urlList.find((item) => item == url);

                if (findUrl === undefined) {
                    urlList.push(url);
                    $('.js-hint-loader').addClass('hidden');

                    (async () => {
                        let data = await fetch(url).then((data) => data.json());

                        if (data.galleryImages.length) {
                            $('.js-add-images').removeClass('hidden');
                            for (let i = 0; data.galleryImages.length > i; i++) {

                                $('.js-slider-zoom').append(`<div><img src="${data.galleryImages[i].url}"></div>`);
                                $('.js-add-images').append(`
                                    <img 
                                        data-height="${data.galleryImages[i].height}" 
                                        data-width="${data.galleryImages[i].width}" 
                                        src="${data.galleryImages[i].url}" />
                                `);
                            }

                            $('.js-add-images img').each(function(i) {
                                var src = $(this).attr('src'),
                                    h = parseInt($(this).data('height')),
                                    w = parseInt($(this).data('width')),
                                    flexGrow = (w * 100) / h,
                                    flexBasis = (w * 160) / h,
                                    paddingBottom = (h / w) * 100;
                                $(this)
                                    .css({
                                        'opacity': 0
                                    })
                                    .wrap('<figure>')
                                    .before('<div>');

                                var figure = $(this).parent('figure');

                                figure.css({
                                    'flex-grow': flexGrow,
                                    'flex-basis': flexBasis + 'px',
                                }).find('> div').css({
                                    'padding-bottom': paddingBottom + '%',
                                    'background-image': 'url(' + src + ')'
                                });
                            });

                        }

                    })();

                } else {
                    $('.js-hint-loader').removeClass('hidden').text('По указанному урлу картинки уже загружены.');
                }
            } else {
                $('.js-hint-loader').removeClass('hidden').text('Указанный адрес не ссылается на json файл');
            }            
        } else {
            $('.js-hint-loader').removeClass('hidden').text('Не указан путь до json файла');
        }
        
    });

    $(document).on('click','.js-write-text',function(){
        navigator.clipboard.writeText($(this).text())
        .then(() => {
            let textBufer = confirm('Ссылка скопирована в буфер обмена,\nуказать ее как путь до json файла ?');
            if (textBufer) {
                $('.js-url-loader').val($(this).text());
            }
        })
        .catch(err => {
            console.log('Что-то пошло не так', err);
        });
    });


    /* Увеличение картинки */

    function slider(selector, nav) {
        var widthSlide = $(selector).parent().width() // Ширина видимой области для слайда
            , lengthImages = $(selector).find('> div').length // Кол-во картинок
            , activeEl = $(selector).attr('data-active') // Выбранный слайд
            , animationTime = (nav == 'next' || nav == 'prev') ? '0.5' : '0'; // Когда применять анимацию

        if (nav == 'next') {
            (activeEl >= lengthImages-1) ? activeEl = activeEl : activeEl++;
        }
        else if (nav == 'prev') {
            (activeEl == 0) ? activeEl = 0 : activeEl--;
        }
        $(selector)
            .attr('data-active', activeEl)
            .css({
                'width':widthSlide*lengthImages,
                'transform':'translate3d(-'+widthSlide*activeEl+'px, 0px, 0px)',
                'transition':'all '+animationTime+'s ease'
            })
            .find('> div').css({'width':widthSlide});

    };

    $(document).on('click','.js-add-images figure',function(){
        $('.js-slider-zoom').attr('data-active',$(this).index());
        $('.js-slider').removeClass('hidden');
        setTimeout(function(){
            $('.js-slider > div').css({'opacity':'1'});
        },100);
        $('.gallery').addClass('gallery_blur');
        slider('.js-slider-zoom');
    });
    $(document).on('click','.js-slider-close',function(){
        $('.js-slider > div').css({'opacity':'0'});
        setTimeout(function(){
            $('.js-slider').addClass('hidden');
            $('.js-slider-zoom').removeAttr('style');
            $('.gallery').removeClass('gallery_blur');
        },500);
    });

    $(document).on('click','.js-slider-prev',function(){
        slider('.js-slider-zoom', 'prev');
    });
    $(document).on('click','.js-slider-next',function(){
        slider('.js-slider-zoom', 'next');
    });

    $(window).resize(function(){
        slider('.js-slider-zoom');
    });

});