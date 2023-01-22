require('dotenv').config();
const cloudinary = require("cloudinary");


async function mediaParse(post, width = 300, height = 300, quality = 90) {
    console.log('hi media');
    const public_id_list = post.media.split(',');
    const mediaUrl = [];

    for (let i = 0; i < public_id_list.length; i++) {
        // const info = await cloudinary.v2.api.resource(public_id_list[i]);
        // console.log("media info: ",info);
        const mediaFile = public_id_list[i].split('?');
        const public_id = mediaFile[0];
        let resource_type;
        if (mediaFile.length >= 2) {
            resource_type = mediaFile[1];
        }

        if (resource_type === 'video') {
            const video = await cloudinary.video(public_id, {
                loop:true, 
                controls:true,
                transformation:
                    { width: width, quality: quality, crop: "scale" },
                fallback_content: "Your browser does not support HTML5 video tags."
            });

            const media = {
                url: video,
                video: true,
                id: public_id,
                resource_type
            };
            mediaUrl.push(media);
        } else if (resource_type === 'raw') {
            const raw = public_id.split('!')[1];
            const id = public_id.split('!')[0];
            const file_name = public_id.split('!')[2];
            const media = {
                url: raw,
                raw: true,
                id: id,
                file_name,
                resource_type
            }
            mediaUrl.push(media);
        } else {
            const image = await cloudinary.url(public_id, { transformation: { width: width, crop: "scale" } });
            const media = {
                url: image,
                image: true,
                id: public_id,
                resource_type
            }
            mediaUrl.push(media);
        }
    }

    post.media = mediaUrl;
    console.log('new link: ', post.media);

    // return post;

}

exports.mediaParse = mediaParse;