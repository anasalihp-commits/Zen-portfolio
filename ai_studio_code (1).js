import CONFIG from './config.js';

// Initialize EmailJS
(function() {
    emailjs.init(CONFIG.PUBLIC_KEY);
})();

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Config into UI
    document.getElementById('contact-info-display').innerHTML = 
        `${CONFIG.EMAIL_ADDRESS} | ${CONFIG.PHONE_NUMBER}`;
    document.getElementById('floating-call').href = `tel:${CONFIG.PHONE_NUMBER}`;

    // 2. Contact Form Handling
    const contactForm = document.getElementById('booking-form');
    const submitBtn = document.getElementById('submit-btn');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitBtn.innerText = "SENDING...";
        submitBtn.disabled = true;

        // Integration with EmailJS
        emailjs.sendForm(CONFIG.EMAIL_SERVICE_ID, CONFIG.EMAIL_TEMPLATE_ID, contactForm)
            .then(() => {
                alert("Thank you! Zen will contact you shortly.");
                contactForm.reset();
                submitBtn.innerText = "SEND INQUIRY";
                submitBtn.disabled = false;
            }, (error) => {
                alert("Failed to send. Please try again or email directly.");
                console.log('FAILED...', error);
                submitBtn.innerText = "SEND INQUIRY";
                submitBtn.disabled = false;
            });
    });

    // 3. Simple Chatbot Logic
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatHistory = document.getElementById('chat-history');

    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
    });

    const botResponse = (input) => {
        const text = input.toLowerCase();
        if (text.includes('price') || text.includes('cost')) 
            return `Zen's websites range from ${CONFIG.PRICE_RANGE}. Would you like a custom quote?`;
        if (text.includes('booking') || text.includes('start')) 
            return "To start, please fill out the contact form or use the Call button!";
        if (text.includes('service')) 
            return "Zen specializes in Premium Web Design, E-commerce, and Custom Full-Stack Apps.";
        return "I'm a simple AI. You can ask about pricing, services, or how to book!";
    };

    const addMessage = (msg, isUser) => {
        const div = document.createElement('div');
        div.className = isUser 
            ? "bg-zinc-100 text-black p-3 rounded-lg self-end max-w-[80%]" 
            : "bg-zinc-800 p-3 rounded-lg self-start max-w-[80%]";
        div.innerText = msg;
        chatHistory.appendChild(div);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    };

    chatSend.addEventListener('click', () => {
        if (!chatInput.value.trim()) return;
        const userMsg = chatInput.value;
        addMessage(userMsg, true);
        chatInput.value = '';
        
        setTimeout(() => {
            addMessage(botResponse(userMsg), false);
        }, 600);
    });
    
    // Allow enter key for chat
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') chatSend.click();
    });
});