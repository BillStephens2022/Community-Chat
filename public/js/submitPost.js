const public_id_list = [];

var cloudinaryWidget = cloudinary.createUploadWidget({
    cloudName: 'drmapjksn', uploadPreset: 'lkogtwek', folder: 'widgetUpload'
},(error, result) => { 
    if (!error && result && result.event === "success") { 
        public_id_list.push(result.info.public_id);        
        console.log("public ids: ", public_id_list);
      }
  }
);

// function that handles the submission of a newly created post

const submitPost = async (event) => {
    event.preventDefault();
    const title = document.querySelector('#new-post-title').value.trim();
    const content = document.querySelector('#new-post-content').value.trim();
    // const file = document.querySelector('#new-post-file');

    // console.log('file: ', file.files[0]);

    if (title && content) {
        // const formData = new FormData();
        // formData.append('title', title);
        // formData.append('content', content);

        // if (file) {
        //     formData.append('file', file.files[0]);
        // }


        const response = await fetch('/api/posts', {
            method: 'POST',
            body: JSON.stringify({ title, content, public_id_list }),
            headers: { 'Content-Type': 'application/json' },
            // body: formData,
            // headers: {
            //     "Context-type": "multipart/form-data"
            // }
        });
        if (response.ok) {
            console.log('post submitted!');
            document.location.replace('/dashboard');
        } else {
            alert('Post Failed!');
        }
    }
}

document
    .querySelector('.post-submit-button')
    .addEventListener('click', submitPost);

