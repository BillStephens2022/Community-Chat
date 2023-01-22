console.log("homeImages.js");


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
