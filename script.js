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
            console.log('Submitting wish:', wish);
            const apiResponse = await fetch('/api/test-openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ wish: wish })
            });

            console.log('API response status:', apiResponse.status);
            const responseData = await apiResponse.json();
            console.log('API response data:', responseData);

            if (!apiResponse.ok) {
                throw new Error(`API Error: ${responseData.error}. Details: ${responseData.details || 'No details provided'}`);
            }

            response.textContent = responseData.result;
            responseContainer.classList.remove('hidden');
            buddhaImage.classList.remove('hidden');
            newWishForm.classList.remove('hidden');
            wishForm.classList.add('hidden');

            // Log the wish
            await logWish(wish);
            console.log('Wish logged successfully');

            // Fetch and display updated wishes
            await fetchWishes();

        } catch (error) {
            console.error('Full error object:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            alert(`An error occurred while processing your wish. Please try again. Error: ${error.message}`);
        }
    } else {
        console.log('No wish entered');
        alert('Please enter your wish.');
    }
}

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

async function logWish(wish) {
    try {
        const response = await fetch('/api/logWish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ wish })
        });
        if (!response.ok) {
            throw new Error('Failed to log wish');
        }
        // Fetch and display updated wishes
        await fetchWishes();
    } catch (error) {
        console.error('Error logging wish:', error);
    }
}

async function fetchWishes() {
    try {
        const response = await fetch('/api/getWishes');
        if (!response.ok) {
            throw new Error('Failed to fetch wishes');
        }
        const wishes = await response.json();
        displayWishes(wishes);
    } catch (error) {
        console.error('Error fetching wishes:', error);
    }
}
// Add a function to display wishes
function displayWishes(wishes) {
  const wishesTable = document.getElementById('wishesTable').getElementsByTagName('tbody')[0];
  wishesTable.innerHTML = ''; // Clear existing wishes
  wishes.slice(0, 10).forEach(wish => {
    const row = wishesTable.insertRow();
    const wishCell = row.insertCell(0);
    const timestampCell = row.insertCell(1);
    wishCell.textContent = wish.wish;
    timestampCell.textContent = new Date(wish.timestamp).toLocaleString();
  });
}

// Call fetchWishes when the page loads
document.addEventListener('DOMContentLoaded', fetchWishes);
