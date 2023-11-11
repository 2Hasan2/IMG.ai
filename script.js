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

// if user click in ctrl + n then remove api key from local storage
document.addEventListener("keydown", (e) => {
    if (e.key == "c" && e.ctrlKey) {
        localStorage.removeItem("api-key")
        location.reload()
    }
})

const API_KEY = GET_API_KEY();


const input = document.querySelector(".input")
const button = document.querySelector(".input-btn")
const cards = document.querySelectorAll(".card")




const getImages = async (query) => {
    if (query.trim() == "") return;
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "prompt": `${query}`,
            "n": 2,
            "size": "256x256",
        })
    }
    try {
        input.value = "";
        cards.forEach((card) => {
            card.innerHTML = `<div class="loader"></div>`
        })

        const res = await fetch(`https://api.openai.com/v1/images/generations`, options);
        const data = await res.json();
        const imgs = data.data;
        cards.forEach((card, index) => {
            card.innerHTML = `<img src="${imgs[index].url}" alt="${query}">`
        })
    } catch (error) {
        console.log(error)
    }
}

button.addEventListener("click", () => { getImages(input.value) })
