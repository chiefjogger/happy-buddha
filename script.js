const apiKey = window.ENV.OPENAI_API_KEY;
const apiUrl = 'https://api.openai.com/v1/chat/completions';

const wishForm = document.getElementById('wishForm');
const wishInput = document.getElementById('wishInput');
const submitWish = document.getElementById('submitWish');
const response = document.getElementById('response');
const personalizedResponse = document.getElementById('personalizedResponse');
const buddhaImage = document.getElementById('buddhaImage');
const doneButton = document.getElementById('doneButton');
const referral = document.getElementById('referral');
const referralName = document.getElementById('referralName');
const sendReferral = document.getElementById('sendReferral');
const referralMessage = document.getElementById('referralMessage');
const referralText = document.getElementById('referralText');
const referralBuddhaImage = document.getElementById('referralBuddhaImage');

submitWish.addEventListener('click', handleWish);
doneButton.addEventListener('click', resetForm);
sendReferral.addEventListener('click', handleReferral);

async function handleWish() {
    const wish = wishInput.value.trim();
    if (wish) {
        try {
            const generatedResponse = await generateResponse(wish);
            personalizedResponse.textContent = generatedResponse;
            wishForm.classList.add('hidden');
            response.classList.remove('hidden');
            buddhaImage.classList.remove('hidden');
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    }
}

async function generateResponse(wish) {
    const prompt = `As an enlightened and compassionate Buddha, provide a warm, encouraging, and personalized response to the following wish: "${wish}". 
Your response should be kind, wise, and offer subtle guidance or perspective. 
Incorporate elements of Buddhist philosophy if relevant, but keep the language accessible. 
Aim for a response length of about 2-3 sentences. 
Begin with a greeting that references the wish, and end with a gentle word of encouragement.`;

    try {
        const response = await axios.post(apiUrl, {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 100,
            n: 1,
            temperature: 0.7,
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function resetForm() {
    wishInput.value = '';
    wishForm.classList.remove('hidden');
    response.classList.add('hidden');
    referral.classList.remove('hidden');
}

function handleReferral() {
    const name = referralName.value.trim();
    if (name) {
        referralText.textContent = `${wishInput.value.trim()} wished ${name} great luck!`;
        referral.classList.add('hidden');
        referralMessage.classList.remove('hidden');
        referralBuddhaImage.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    response.classList.add('hidden');
    buddhaImage.classList.add('hidden');
    referralMessage.classList.add('hidden');
    referralBuddhaImage.classList.add('hidden');
});
