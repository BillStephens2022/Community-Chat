/* on the edit-post page (this page is rendered after the user clicks an edit button on a post in their dashboard), the
user will be able to edit their post and there is a save button the will replace the previous post*/

const saveButton = document.getElementsByClassName('edit-submit-button')[0];

// function the submits the edited post
const editPost = async (event) => {
    event.preventDefault();
    post_id = getEditPostId(event);
    const post_title = document.querySelector('#edit-post-title').value.trim();
    const post_content = document.querySelector('#edit-post-content').value.trim();
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
function getEditPostId (event) {
    event.preventDefault();
    let buttonId = event.target.id;
    const post_id = buttonId.slice(5,);
    return post_id;
}