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

            const responseData = await apiResponse.json();

            if (!apiResponse.ok) {
                throw new Error(`API Error: ${responseData.error}. Details: ${responseData.details || 'No details provided'}`);
            }

            response.textContent = responseData.result;
            responseContainer.classList.remove('hidden');
            buddhaImage.classList.remove('hidden');
            newWishForm.classList.remove('hidden');
            wishForm.classList.add('hidden');

            // Log the wish
            logWish(wish);
        } catch (error) {
            console.error('Full error object:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
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

// Function to submit a wish
function logWish(wish) {
    fetch('/api/logWish', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wish }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Wish logged:', data);
            fetchRecentWishes(); // Refresh the wishes list
        })
        .catch(error => console.error('Error logging wish:', error));
}

// Function to fetch and display recent wishes
function fetchRecentWishes() {
    fetch('/api/getWishes')
        .then(response => response.json())
        .then(wishes => {
            const tableBody = document.querySelector('#wishesTable tbody');
            tableBody.innerHTML = '';
            wishes.forEach(wish => {
                const row = `
                    <tr>
                        <td>${wish.wish}</td>
                        <td>${new Date(wish.timestamp).toLocaleString('vi-VN')}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
            document.getElementById('recentWishes').classList.remove('hidden');
        })
        .catch(error => console.error('Error fetching wishes:', error));
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...

    fetchRecentWishes();
});
