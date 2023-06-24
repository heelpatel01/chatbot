const chatInput=document.querySelector(".chat-input textarea");
const sendChatBtn=document.querySelector(".chat-input span");
const chatbox=document.querySelector(".chatbox");
const chatbotToggler=document.querySelector(".chatbot-toggler");
const CloseBtn=document.querySelector(".close-btn");

let userMessage;
const API_KEY="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";
const inputInitHeight=chatInput.scrollHeight;

const createChatLi=(message,className)=>{
    const chatLi=document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent=className==="outgoing"? `<p></p> `: `<span class="material-symbols-outlined">smart_toy</span> <p></p>`;
    chatLi.innerHTML=chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;

}

const generateResponse=(incomingChatLi)=>{
    const API_URL= "https://api.openai.com/v1/chat/completions";
    const msgElement=incomingChatLi.querySelector("p")

    const requestOptions={
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${API_KEY}`
        },
        body:JSON.stringify({
            model:"gpt-3.5-turbo",
            messages:[{role:"user",content:userMessage}]
        })
    }
//sending POST req. to API, get response
    fetch(API_URL,requestOptions).then(res=>res.json()).then(data=>{
        msgElement.textContent=data.choices[0].message.content;
    }).catch((error)=>{
        msgElement.classList.add("error");
        msgElement.textContent="Oops ! Something went wrong. please try again";
    }).finally(()=>chatbox.scrollTo(0,chatbox.scrollHeight));
}

const handleChat=()=>{
    userMessage=chatInput.value.trim();
    // console.log(userMessage);

    if(!userMessage) return;
    chatInput.value="";
    chatInput.style.height=`${inputInitHeight}px`;


    //Appending the inputed msg to chatbox
    chatbox.appendChild(createChatLi(userMessage,"outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight);

    setTimeout(()=>{
        const incomingChatLi=createChatLi("Thinking...","incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0,chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    },600);
}

CloseBtn.addEventListener("click",()=>document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click",()=>document.body.classList.toggle("show-chatbot"));

chatInput.addEventListener("input",()=>{
    //for adjusting text area based on content
    chatInput.style.height=`${inputInitHeight}px`;
    chatInput.style.height=`${chatInput.scrollHeight}px`;
})

chatInput.addEventListener("keydown",(e)=>{
    if(e.key==="Enter" && !e.shiftKey && window.innerWidth>800){
        e.preventDefault();
        handleChat()
    }
})


sendChatBtn.addEventListener("click",handleChat)

