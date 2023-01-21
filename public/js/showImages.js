function call (){
    const file = document.getElementById('media').value;
    const media = JSON.parse(file);    
    console.log(media.public_id);
    
    
}