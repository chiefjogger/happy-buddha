document.addEventListener('DOMContentLoaded', function() {
    const wishForm = document.getElementById('wishForm');
    const wishInput = document.getElementById('wishInput');
    const submitWish = document.getElementById('submitWish');
    const responseContainer = document.getElementById('responseContainer');
    const response = document.getElementById('response');
    const buddhaImage = document.getElementById('buddhaImage');
    const newWishForm = document.getElementById('newWishForm');
    const newPersonName = document.getElementById('newPersonName');
    const newWishButton = document.getElementById('newWishButton');

    submitWish.addEventListener('click', function() {
        const wish = wishInput.value;
        if (wish) {
            response.textContent = "Tín hiệu từ vũ trụ: Bạn sẽ có" + wish;
            responseContainer.classList.remove('hidden');
            buddhaImage.classList.remove('hidden');
            newWishForm.classList.remove('hidden');
            wishForm.classList.add('hidden');
        }
    });

    newWishButton.addEventListener('click', function() {
        const name = newPersonName.value;
        if (name) {
            response.textContent = `Vũ trụ sẽ mang tới tốt lành cho ${name}!`;
            newWishForm.classList.add('hidden');
        }
    });
});
