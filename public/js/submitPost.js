// function that handles the submission of a newly created post

const submitPost = async (event) => {
    event.preventDefault();
    const title = document.querySelector('#new-post-title').value.trim();
    const content = document.querySelector('#new-post-content').value.trim();
    const file = document.querySelector('#new-post-file');

    console.log('file: ', file.files[0]);

    if (title && content) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);

        if (file) {
            formData.append('file', file.files[0]);
        }


        const response = await fetch('/api/posts', {
            method: 'POST',
            // body: JSON.stringify({ title, content }),
            // headers: { 'Content-Type': 'application/json' },
            body: formData,
            headers: {
                "Context-type": "multipart/form-data"
            }
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