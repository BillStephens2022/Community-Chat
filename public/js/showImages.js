console.log("showImage.js");


  const buttonHandler = async (event) => {
    // console.log('hit the button');
    // console.log('Event', event);
    if (event.target.hasAttribute('data-id')) {
      const id = event.target.getAttribute('data-id');
      const btnFunction = event.target.getAttribute('data-function');
      console.log('data-id: ',id);
      console.log('data-function: ',btnFunction);
  
      if (btnFunction === 'delete') {
        const delOk = confirm("Do you want to delete the blog?");
        if (delOk) {
          const response = await fetch(`/api/posts/${id}`, {
            method: 'DELETE',
          });
  
          if (response.ok) {
            document.location.replace('/dashboard');
          } else {
            alert('Failed to delete blog');
          }
        }
      } else if (btnFunction === 'edit') {        
            document.location.replace(`/api/posts/edit-post/${id}`);      
      }
    }
  }
  
  
  document.querySelector('.post-list').addEventListener('click', buttonHandler);



function showImages(event) {
    console.log('event: ', event);
    console.log('event target: ', event.target);
    if (event.target.hasAttribute('data-post')) {
        // clean the modal
        document.getElementById('image-show').innerHTML = "";
        const id = event.target.getAttribute('data-post');
        const public_id = event.target.getAttribute('data-public-id');
        const media = document.getElementById(id).value;
        const imageContainer = document.getElementById('image-show');

        console.log(media);
        const mediaData = JSON.parse(media);

        mediaData.forEach((media, i) => {
            console.log(media);
            console.log("public_id: ", media.public_id);
            const divEl = document.createElement("div");
            if (public_id === media.public_id)
                divEl.classList.add("carousel-item", "active");
            else
                divEl.classList.add("carousel-item");

            if (media.image) {
                const imgEl = document.createElement("img");
                const src = `https://res.cloudinary.com/drmapjksn/image/upload/b_black,c_pad,w_1140,h_600/${media.public_id}`;
                imgEl.setAttribute("src", src);
                divEl.appendChild(imgEl)
                imageContainer.appendChild(divEl);
            } else if (media.video) {
                console.log("public_id: ", media.public_id);
                const videoEl = document.createElement("video");
                const video = `https://res.cloudinary.com/drmapjksn/video/upload/b_black,c_pad,w_1140,h_600/${media.public_id}`;
                videoEl.setAttribute('controls', true);
                const source = document.createElement("source");
                source.setAttribute('src', video);
                videoEl.appendChild(source);
                divEl.appendChild(videoEl);
                imageContainer.appendChild(divEl);
            }
        });
    }
}

document.querySelector('#post-list-show').addEventListener('click', showImages);
