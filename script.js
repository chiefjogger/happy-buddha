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
    const testButton = document.getElementById('testOpenAIButton');

    submitWish.addEventListener('click', async function() {
    const wish = wishInput.value;
    if (wish) {
        try {
            const apiResponse = await fetch('/api/test-openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ wish: wish })
            });

            if (!apiResponse.ok) {
                const errorData = await apiResponse.json();
                throw new Error(`API Error: ${errorData.error}. Details: ${errorData.details || 'No details provided'}`);
            }

            const data = await apiResponse.json();
            response.textContent = data.result;
            responseContainer.classList.remove('hidden');
            buddhaImage.classList.remove('hidden');
            newWishForm.classList.remove('hidden');
            wishForm.classList.add('hidden');
        } catch (error) {
            console.error('Error:', error.message);
            alert(`Vũ Trụ chưa nhận được tín hiệu API của bạn, hãy thử lại. Error: ${error.message}`);
        }
    }
});

    newWishButton.addEventListener('click', function() {
        const name = newPersonName.value;
        if (name) {
            response.textContent = `Vũ trụ sẽ mang tới tốt lành cho ${name}!`;
            response.textContent += ` Hãy gửi tin nhắn này cho ${name} nhé, để Vũ Trụ mang tới an lành cho mọi người!`;
            newWishForm.classList.add('hidden');
        }
    });

    testButton.addEventListener('click', testOpenAI);
});

async function testOpenAI() {
  try {
    const response = await fetch('/api/test-openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    alert('OpenAI API Test Result: ' + data.result);
  } catch (error) {
    console.error('Error testing OpenAI:', error);
    alert('Error testing OpenAI. Check the console for details.');
  }
}
