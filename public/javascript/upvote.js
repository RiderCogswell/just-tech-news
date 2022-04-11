// button click event is async because it will be making a put request with fetch
async function upvoteClickHandler(event) {
    event.preventDefault();

    const id = window.location.toString().split('/')[
        // takes browser url and grabs the last item 
        window.location.toString().split('/').length - 1
    ];

    const response = await fetch('/api/posts/upvote', {
        method: 'PUT',
        body: JSON.stringify({
            post_id: id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.reload();
    } else {
        alert(response.statusText);
    }
};

document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);