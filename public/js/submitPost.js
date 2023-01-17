// function that handles the submission of a newly created post

const submitPost = async (event) => {
    event.preventDefault();
    const title = document.querySelector('#new-post-title').value.trim();
    const content = document.querySelector('#new-post-content').value.trim();
    if (title && content) {
    const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ title, content }),
        headers: { 'Content-Type': 'application/json' },
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
  .querySelector('.submit-post-form')
  .addEventListener('submit', submitPost);