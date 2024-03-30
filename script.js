const chunkSize = 4;
const chatMessages = document.getElementById('chat-messages');

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        Texting();
    }
}


let data = localStorage.getItem('data');
data = JSON.parse(data);

// if data is not exist create a new one
if (!data) {
    data = {
        messages: []
    };
    localStorage.setItem('data', JSON.stringify(data));
}

// if massage is not empty show all messages
const WannaLoad = confirm('Do you want to load the old generated images?)');
if (data.messages.length > 0 && WannaLoad) {
    data.messages.forEach(message => {
        const USER_MSG = document.createElement('div');
        USER_MSG.className = 'user-message';
        USER_MSG.innerHTML = message.prompt;
        USER_MSG.setAttribute('onclick', 'copyToClipboard(this)');
        chatMessages.appendChild(USER_MSG);

        const AI_MSG = document.createElement('div');
        AI_MSG.className = 'ai-message ';
        AI_MSG.innerHTML = '';
        message.urls.forEach(url => {
            const outputImage = document.createElement('img');
            const card = document.createElement('div');
            card.className = 'card';
            outputImage.src = url;
            outputImage.alt = 'Generated Image';
            outputImage.addEventListener('dblclick', (e)=>openImg(e));
            // add download button in card to download image
            const downloadBtn = document.createElement('a');
            downloadBtn.className = 'download-btn';
            downloadBtn.addEventListener('click', (e) => {downloadImg(e, url)});
            downloadBtn.innerText = '↓';
            card.appendChild(downloadBtn);
            card.appendChild(outputImage);
            AI_MSG.appendChild(card);
        });
        chatMessages.appendChild(AI_MSG);
    });
}

function saveData(message) {
    data.messages.push(message);
    localStorage.setItem('data', JSON.stringify(data));
}

function Texting() {
    const prompt = document.getElementById('textCommand').value;
    const style = document.getElementById('styleSelect').value;
    const aspect_ratio = document.getElementById('aspect_ratio').value;
    let num_imgs = +document.getElementById('numberInput').value;
    num_imgs = Math.min(num_imgs, 20);
    if (prompt === '') {
        return;
    }
    

    userMessage(prompt);
    
    for (let i = 0; i < Math.ceil(num_imgs / chunkSize); i++) {
        const options = {
            prompt,
            style,
            safe_filter: false,
            aspect_ratio: aspect_ratio,
            samples: Math.min(chunkSize, num_imgs - i * chunkSize)
        };

        // Remove empty options
        for (const key in options) {
            if (options[key] === '') {
                delete options[key];
            }
        }
        aiMessage(options);
    }

    document.getElementById('textCommand').value = '';
}

// Function for handling user messages
function userMessage(prompt) {
    const USER_MSG = document.createElement('div');
    USER_MSG.className = 'user-message';
    USER_MSG.innerHTML = prompt;
    USER_MSG.setAttribute('onclick', 'copyToClipboard(this)');
    chatMessages.appendChild(USER_MSG);

    // Scroll to the bottom of the chat messages
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function aiMessage(options) {
    const AI_MSG = document.createElement('div');
    AI_MSG.className = 'ai-message ';
    AI_MSG.innerHTML = 'loading...';
    chatMessages.appendChild(AI_MSG);
    let urls = []

    try {
        const result = await sendAndFetchResult(options);
        AI_MSG.innerHTML = '';
        result.forEach(url => {
            const outputImage = document.createElement('img');
            const card = document.createElement('div');
            card.className = 'card';
            outputImage.src = url;
            outputImage.alt = 'Generated Image';
            outputImage.addEventListener('dblclick', (e)=>openImg(e));
            // add download button in card to download image
            const downloadBtn = document.createElement('a');
            downloadBtn.className = 'download-btn';
            downloadBtn.addEventListener('click', (e) => {downloadImg(e, url)});
            downloadBtn.innerText = '↓';
            card.appendChild(downloadBtn);
            card.appendChild(outputImage);
            AI_MSG.appendChild(card);
            urls.push(url);
        });
        // save data
        saveData({
            prompt: options.prompt,
            urls: urls
        });
    } catch (error) {
        AI_MSG.innerHTML = error;
    }
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

// open image in new tab
function openImg(e){
    // move to fullScreen div
    const fullScreen = document.getElementById('fullScreen');
    // clone image
    const img = e.target.cloneNode(true);
    fullScreen.appendChild(img);
    fullScreen.style.display = 'flex';
    // add close 
    fullScreen.addEventListener('click', closeImg);
}

// close image
function closeImg(){
    const fullScreen = document.getElementById('fullScreen');
    fullScreen.style.display = 'none';
    fullScreen.innerHTML = '';
    // remove event listener
    fullScreen.removeEventListener('click', closeImg);
}

function downloadImg(e ,url){
    e.target.href = url;
    e.target.download = 'image.jpg';
}