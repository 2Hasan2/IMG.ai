// inter using openai api use prompt and save it in local storage

const GET_API_KEY = () => {
    const key = localStorage.getItem("api-key")
    if (key) {
        return key
    } else {
        const key = prompt("Enter your API key")
        localStorage.setItem("api-key", key)
        return key
    }
}

// if user click in ctrl + c then remove api key from local storage
document.addEventListener("keydown", (e) => {
    if (e.key == "e" && e.ctrlKey) {
        localStorage.removeItem("api-key")
        location.reload()
    }
})

// reset api button
reset.addEventListener("click", () => {
    localStorage.removeItem("api-key")
    location.reload()
})

const API_KEY = GET_API_KEY();

// input and button
const chat = document.querySelector(".chat-container")
const input = document.querySelector("#input")
const button = document.querySelector("#send_btn")
const model = document.querySelector("#model")
const dall_e_2 = document.querySelector("#size_dall-e-2")
const dall_e_3 = document.querySelector("#size_dall-e-3")
const amount_dall_e_2 = document.querySelector("#amount_dall-e-2")
const amount_dall_e_3 = document.querySelector("#amount_dall-e-3")
const loader = document.querySelector(".loader")

let PROMPT;
let MODEL;
let SIZE;
let AMOUNT;

// set model and size
model.addEventListener("change", () => { SET_MODEL() })

// add event listener for any input in the page
document.addEventListener("change", () => { setInputsValue(model.value) })


SET_MODEL()

function SET_MODEL() {
    if (model.value == "dall-e-2") {
        dall_e_2.style.display = "block"
        amount_dall_e_2.style.display = "block"
        dall_e_3.style.display = "none"
        amount_dall_e_3.style.display = "none"
        input.setAttribute("maxlength", 1000)
        setInputsValue('dall-e-2')
    } else {
        dall_e_3.style.display = "block"
        amount_dall_e_3.style.display = "block"
        dall_e_2.style.display = "none"
        amount_dall_e_2.style.display = "none"
        input.setAttribute("maxlength", 4000)
        setInputsValue('dall-e-3')
    }
}

// get inputs value
function setInputsValue(model_version) {
    PROMPT = input.value;
    MODEL = model.value;
    SIZE = model_version == 'dall-e-2' ? dall_e_2.value : dall_e_3.value;
    AMOUNT = model_version == 'dall-e-2' ? amount_dall_e_2.value : amount_dall_e_3.value;
    return { PROMPT, MODEL, SIZE, AMOUNT }
}

// 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

// loader

// get the last grandson div
function lastdiv(div) {
    let DIV = div.querySelector('div');
    if (DIV) {
        return lastdiv(DIV);
    }
    return div;
}

let i = 20

while (i--) {
    let div = document.createElement('div');
    lastdiv(loader).appendChild(div);
}



const getImages = async (query) => {
    if (query.trim() == "") return;
    button.disabled = true;
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "prompt": PROMPT,
            "model": MODEL,
            "n": +AMOUNT,
            "size": SIZE,
        })
    }
    try {
        message(query);
        loader.style.display = "block";
        const res = await fetch(`https://api.openai.com/v1/images/generations`, options);
        const data = await res.json();
        const imgs = data.data;
        setImages(imgs, JSON.parse(options.body))
    } catch (error) {
        console.log(error)
    }
    loader.style.display = "none";
    button.disabled = false;
}

function message(msg) {
    // create div with class message bot
    const div = document.createElement("div");
    div.classList.add("message", "user");
    div.innerText = msg;
    chat.appendChild(div);
}

function setImages(imgs, data) {
    const { prompt, model, n, size } = data;

    imgs.forEach(({ url }) => {
        const div = document.createElement("div");
        div.classList.add("message", "bot");

        // Create image element
        let img = document.createElement("img");
        img.src = url;
        div.appendChild(img);

        img.addEventListener("dblclick", () => {
            open(url, "_blank")
        })

        // Create download button
        chat.appendChild(div);
    });
}



button.addEventListener("click", () => { getImages(input.value) })
document.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        getImages(input.value)
    }
})