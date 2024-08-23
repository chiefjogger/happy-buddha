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
    
    if (submitWish) {
        submitWish.addEventListener('click', handleWishSubmission);
    }

    if (newWishButton) {
        newWishButton.addEventListener('click', function() {
            const name = newPersonName.value;
            if (name) {
                response.textContent = `Vũ trụ sẽ mang tới tốt lành cho ${name}!`;
                response.textContent += ` Hãy gửi tin nhắn này cho ${name} nhé, để Vũ Trụ mang tới an lành cho mọi người!`;
                newWishForm.classList.add('hidden');
            }
        });
    }

    if (testButton) {
        testButton.addEventListener('click', testOpenAI);
    }

    async function handleWishSubmission() {
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
    }
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

function logWish(wish) {
    console.log('Attempting to log wish:', wish);
    fetch('/api/logWish', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wish }),
    })
        .then(response => {
            console.log('Log wish response status:', response.status);
            return response.text();
        })
        .then(text => {
            try {
                const data = JSON.parse(text);
                console.log('Wish logged successfully:', data);
            } catch (e) {
                console.error('Server returned non-JSON response:', text);
                throw new Error('Invalid JSON response from server');
            }
        })
        .catch(error => {
            console.error('Error logging wish:', error);
            alert('Failed to log wish. Please check the console for details.');
        });
}

async function fetchWishes() {
  try {
    const response = await fetch('/api/getWishes');
    const wishes = await response.json();
    console.log('Fetched wishes:', wishes);
    // Handle displaying wishes here
  } catch (error) {
    console.error('Error fetching wishes:', error);
  }
}


// Add a function to display wishes
function displayWishes(wishes) {
  const wishList = document.getElementById('wish-list');
  wishList.innerHTML = ''; // Clear existing wishes
  wishes.forEach(wish => {
    const wishItem = document.createElement('li');
    wishItem.textContent = `${wish.wish} (${new Date(wish.timestamp).toLocaleString()})`;
    wishList.appendChild(wishItem);
  });
}

// Call fetchWishes when the page loads
document.addEventListener('DOMContentLoaded', fetchWishes);
