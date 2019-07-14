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
                            $('.js-images').removeClass('hidden');
                            for (let i = 0; data.galleryImages.length > i; i++) {
                                $('.js-add-images').append(`<img src="${data.galleryImages[i].url}" data-full="${data.galleryImages[i].url}" class="m-p-g__thumbs-img" />`);
                            }
                            let elem = document.querySelector('.m-p-g');
                            let gallery = new MaterialPhotoGallery(elem);
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