const showImage = function() {
    var image = document.querySelector('.proImage');
    var show = document.querySelector('.showProImage');

    image.addEventListener('change', (e)=> {
        var fileReader = new FileReader();
        var infoFile = e.target.files[0];
        
        fileReader.readAsDataURL(infoFile);

        fileReader.onload = function(e) {
            var url = fileReader.result;
            show.setAttribute('src', url);
        };
    });
}();
