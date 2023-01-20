/* the dashboard displays all of the users posts - each post has a delete button which can be clicked.  deleteButtons is an array of buttons
with the class 'delete button' */
// const deleteButtons = document.getElementsByClassName('delete-button');
// //function for deleting a post
// const deletePost = async (event) => {
//     let post_id = getPostId(event);
//     // const post_id = window.location.toString().split('/')[window.location.toString().split('/').length - 1];
//     if (post_id) {
//       const response = await fetch(`/api/posts/${post_id}`, {
//         method: 'DELETE',
//     });
//       if (response.ok) {
//           document.location.reload();
//       } else {
//         alert('Failed to Delete Post');
//       }
//     }
// }

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


// //adds an event listener to each delete button in the array of 'deleteButtons'
// Array.from(deleteButtons).forEach((deleteButton) => {
//     deleteButton.addEventListener('click', deletePost);
// });

// //function to get the post ID of the delete button clicked
// function getPostId (event) {
//     event.preventDefault();
//     let buttonId = event.target.id;
//     const post_id = buttonId.slice(7,);
//     return post_id;
// }
