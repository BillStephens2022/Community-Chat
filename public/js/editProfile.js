// function for creating and submitting a comment to a post
const submitProfile = async (event) => {
    event.preventDefault();
    const first_name = document.querySelector('#first-name').value.trim();
    const last_name = document.querySelector('#last-name').value.trim();
    const date_of_birth = document.querySelector('#date-of-birth').value.trim();
    const file = document.querySelector('#proflie-picture');

    if (first_name && last_name && date_of_birth) {
        const formData = new FormData();
        formData.append('first_name', first_name);
        formData.append('last_name', last_name);
        formData.append('date_of_birth', date_of_birth);

        if (file) {
            formData.append('file', file.files[0]);
            const public_id = document.getElementById('public_id').value;
            
            console.log('public_id: ',public_id);
            formData.append('public_id',public_id);
        }

        const response = await fetch('/api/posts/profile', {
            method: 'PUT',
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

document.querySelector('.submit-profile-form').addEventListener('submit', submitProfile)