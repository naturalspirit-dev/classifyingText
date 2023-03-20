let API_KEY;

const form = document.getElementById('text-classification-form');
const ApiKey = document.getElementById('inputKey');
const inputText = document.getElementById('inputText');
const result = document.getElementById('result');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    API_KEY = ApiKey.value.trim();
    const text = inputText.value.trim();

    if (text) {
        result.textContent = 'Classifying...';

        try {
            const response = await classifyText(text);
            const categories = response.categories.map(category => `${category.name} (confidence: ${category.confidence})`);
            result.textContent = categories.length ? categories.join('\n') : 'No categories found';
        } catch (error) {
            console.error(error);
            result.textContent = 'Error: Could not classify text';
        }
    }
});

async function classifyText(text) {
    const requestBody = {
        "document": {
            "type": "PLAIN_TEXT",
            "content": text
        }
    };

    const response = await fetch(`https://language.googleapis.com/v1/documents:classifyText?key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
    }

    return await response.json();
}



async function fetchContentFromUrl(url) {
    try {
        const response = await fetch(url, {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch content from URL');
    }
}


form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const textOrUrl = inputText.value.trim();

    if (textOrUrl) {
        result.textContent = 'Processing...';

        try {
            let content;
            if (isValidUrl(textOrUrl)) {
                result.textContent = 'Fetching content from URL...';
                content = await fetchContentFromUrl(textOrUrl);
            } else {
                content = textOrUrl;
            }

            result.textContent = 'Classifying...';
            const response = await classifyText(content);
            const categories = response.categories.map(category => `${category.name} (confidence: ${category.confidence})`);
            result.textContent = categories.length ? categories.join('\n') : 'No categories found';
        } catch (error) {
            console.error(error);
            result.textContent = 'Error: ' + error.message;
        }
    }
});

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}