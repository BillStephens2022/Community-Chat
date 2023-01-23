const public_id_list = [];
const imageContainer = document.getElementById('image-show');
const fileContainer = document.getElementById('file-show');

// Maxium: 20 files and 100Mb
var cloudinaryWidget = cloudinary.createUploadWidget({
    cloudName: 'drmapjksn', uploadPreset: 'lkogtwek', max_files: '20', maxFileSize: '100000000', folder: 'widgetUpload'
},(error, result) => {     
    if (!error && result && result.event === "success") { 
        console.log("result info ", result.info);
        if(result.info.resource_type !== 'raw'){            
            if(result.info.resource_type === 'image'){
                const imgEl = document.createElement("img");
                let src;
                if(result.info.format === 'pdf'){
                    console.log('pdf!!!');
                    src = `https://res.cloudinary.com/drmapjksn/image/upload/c_fill,h_100,w_100,pg_1/${result.info.public_id}.jpg`;
                    public_id_list.push(result.info.public_id +'!'+result.info.secure_url + '!'+ result.info.original_filename+'.'+result.info.format +'?'+'raw');
                }else {
                    src = `https://res.cloudinary.com/drmapjksn/image/upload/c_fill,h_100,w_100/${result.info.public_id}`;
                    public_id_list.push(result.info.public_id +'?'+result.info.resource_type);
                }
                imgEl.setAttribute("src", src);
                imageContainer.appendChild(imgEl);
            } else if(result.info.resource_type === 'video') {
                const imgEl = document.createElement("img");
                const src = `https://res.cloudinary.com/drmapjksn/video/upload/c_fill,h_100,w_100/${result.info.public_id}.jpg`;
                imgEl.setAttribute("src",src);
                imageContainer.appendChild(imgEl);
            }
        }else {
            const fileFormat = result.info.path.split('.').reverse()[0];

            public_id_list.push(result.info.public_id +'!'+result.info.secure_url + '!'+ result.info.original_filename + '.'+fileFormat+'?'+result.info.resource_type);
            const fileName = document.createElement("p");
            fileName.textContent = '📂'+ result.info.original_filename+'.'+fileFormat;
            const url = document.createElement("a");
            url.setAttribute('href',result.info.secure_url);
            url.appendChild(fileName)
            // box.setAttribute("style","font-size:25px; text-align:center; width:100px; height:100px: color:white; background: #666666; padding: 5px;");            
            fileContainer.appendChild(url);
        }
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

