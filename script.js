
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        Texting();
    }
}


function Texting() {
    const chatMessages = document.getElementById('chat-messages');
    const prompt = document.getElementById('textCommand').value;
    const style = document.getElementById('styleSelect').value;
    const samples = +document.getElementById('numberInput').value;
 if (prompt === '') {
        return;
    }

    const options={
        prompt,
        style,
        safe_filter: true,
        samples
    }
    // handle empty option value use loop
    for (const key in options) {
        if (options[key] === '') {
            delete options[key];
        }
    }
    // Display user message
    message(options , true);

    // Display AI message
    message(options , false);

    document.getElementById('textCommand').value = '';

    // Scroll to the bottom of the chat messages
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


function message(options, isUser) {
    const chatMessages = document.getElementById('chat-messages');
    const message = document.createElement('div');
    // append loader
    message.className = 'message-container';
    message.innerHTML = `<div class="${isUser ? 'user-message loading-img' : 'ai-message'} card" onclick="copyToClipboard(this)">${isUser ? options.prompt : 'loading...'}</div>`;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    // if not user message, generate image
    if (!isUser) {
        sendAndFetchResult(options)
            .then(result => {
                // delete loading text
                message.querySelector('.ai-message').innerHTML = '';
                result.forEach(Url => {
                    const outputImage = document.createElement('img');
                    outputImage.src = Url;
                    outputImage.alt = 'Generated Image';
                    message.querySelector('.ai-message').appendChild(outputImage);
                });
            })
            .catch(error=> {
                console.log(error);
                // convert it to string
                const errorMessage = JSON.parse(error.message).result.errorMessage;
                message.querySelector('.ai-message').innerHTML = errorMessage;
            });
    };
}



function copyToClipboard(element) {
    const textToCopy = element.innerText;
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = textToCopy;
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}