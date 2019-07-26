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
                                    'background-image': 'url(' + src + ')'
                                }).find('> div').css({
                                    'padding-bottom': paddingBottom + '%'
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


});


