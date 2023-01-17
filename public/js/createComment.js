// function for creating and submitting a comment to a post
const submitComment = async (event) => {
    event.preventDefault();
    const comment_content = document.querySelector('#new-comment-content').value.trim();
    const post_id = window.location.toString().split('/')[window.location.toString().split('/').length - 1];
    if (comment_content) {
    const response = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ comment_content, post_id }),
        headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
        document.location.reload();
    } else {
        alert('Post Failed!');
    }
    }
}




document.querySelector('.submit-comment-form').addEventListener('submit', submitComment)