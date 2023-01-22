/* on the edit-post page (this page is rendered after the user clicks an edit button on a post in their dashboard), the
user will be able to edit their post and there is a save button the will replace the previous post*/

const saveButton = document.getElementsByClassName('edit-submit-button')[0];

// function the submits the edited post
const editPost = async (event) => {
    event.preventDefault();
    // const post_id = getEditPostId(event);
    const post_title = document.querySelector('#edit-post-title').value.trim();
    const post_content = document.querySelector('#edit-post-content').value.trim();
    const post_id = document.getElementById('post_id').value;


    if (post_id) {
        const response = await fetch(`/api/posts/${post_id}`, {
          method: 'PUT',
          body: JSON.stringify({
            post_title,
            post_content
          }),
          headers: {
            'Content-Type': 'application/json'
          }
      });
        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
          alert('Failed to Edit Post');
        }
      }
}

saveButton.addEventListener('click', editPost);

// gets the post ID of the post being edited.
// function getEditPostId (event) {
//     event.preventDefault();
//     let buttonId = event.target.id;
//     const post_id = buttonId.slice(5,);
//     return post_id;
// }


const mediaHandler = async (event) => {
  // console.log('hit the button');
  // console.log('Event', event);
  if (event.target.hasAttribute('data-id')) {
    const public_id = event.target.getAttribute('data-id');    
    const resource_type = event.target.getAttribute('data-resource');
    const post_id = document.getElementById('post_id').value;
    console.log('data-id: ',public_id);
    console.log('resource_type: ',resource_type);
    
  
    const delOk = confirm("Do you want to delete the media?");
    if (delOk) {

      const response = await fetch(`/api/posts/media/`, {
        method: 'PUT',
        body: JSON.stringify({
          public_id,
          resource_type,
          id: post_id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
    });

      // if (resource_type === 'image') {        
      //   const result = await cloudinary.v2.uploader.destroy(id);
      //   console.log('Delete result: ', result)
      // } else if (resource_type === 'video') {        
      //   const result = await cloudinary.v2.uploader.destroy(id, { resource_type: 'video' });
      //   console.log('Delete result: ', result)
      // } else {        
      //   const result = await cloudinary.v2.uploader.destroy(id, { resource_type: 'raw' });
      //   console.log('Delete result: ', result);
      // }      

      if (response.ok) {
        console.log('Delete Success');
        document.location.reload();
        // document.location.replace(`/edit-post/${post_id}`);
      } else {
        alert('Failed to delete media');
      }
    }    
  }
}


document
  .querySelector('.media-list')
  .addEventListener('click', mediaHandler);