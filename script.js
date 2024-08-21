document.addEventListener('DOMContentLoaded', function() {
    const wishForm = document.getElementById('wishForm');
    const wishInput = document.getElementById('wishInput');
    const submitWish = document.getElementById('submitWish');
    const responseContainer = document.getElementById('responseContainer');
    const response = document.getElementById('response');

    submitWish.addEventListener('click', function() {
        const wish = wishInput.value;
        if (wish) {
            // For now, just display the wish as the response
            response.textContent = "Your wish: " + wish;
            responseContainer.classList.remove('hidden');
            wishForm.classList.add('hidden');
        }
    });
});
