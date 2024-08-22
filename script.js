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
    const testFetchWishesButton = document.getElementById('testFetchWishesButton');
    if (testFetchWishesButton) {
        testFetchWishesButton.addEventListener('click', testFetchWishes);
    } else {
        console.error('Test Fetch Wishes button not found');
    }
    
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
    fetchRecentWishes();
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
            return response.json();
        })
        .then(data => {
            console.log('Wish logged successfully:', data);
            fetchRecentWishes(); // Refresh the wishes list
        })
        .catch(error => {
            console.error('Error logging wish:', error);
            alert('Failed to log wish. Please check the console for details.');
        });
}

// Function to fetch and display recent wishes
function fetchRecentWishes() {
    console.log('Fetching recent wishes...');
    fetch('/api/getWishes')
        .then(response => {
            console.log('Get wishes response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(wishes => {
            console.log('Retrieved wishes:', wishes);
            const tableBody = document.querySelector('#wishesTable tbody');
            tableBody.innerHTML = '';
            if (wishes.length === 0) {
                console.log('No wishes found');
                tableBody.innerHTML = '<tr><td colspan="2">No wishes found</td></tr>';
            } else {
                wishes.forEach(wish => {
                    const row = `
                        <tr>
                            <td>${wish.wish}</td>
                            <td>${new Date(wish.timestamp).toLocaleString('vi-VN')}</td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });
            }
            document.getElementById('recentWishes').classList.remove('hidden');
        }         
        .catch(error => {
            console.error('Error fetching wishes:', error);
            console.error('Error details:', error.message);
            alert('Failed to fetch wishes. Please check the console for details.');
        });
}

function testFetchWishes() {
    console.log('Manually triggering wish fetch...');
    fetchRecentWishes();
}



