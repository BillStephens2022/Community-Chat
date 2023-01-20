/* function for kicking off the process of creating a new post - when the user clicks on the 'create post button',
 this function brings the user to a new page which will display input elements for the user to create and submit a post. */
 
const createPost = (event) => {
    event.preventDefault();
    document.location.replace('/dashboard/new-post');
}

// event listener for the create post button
document
.querySelector('#create-post-button')
.addEventListener('click', createPost);
