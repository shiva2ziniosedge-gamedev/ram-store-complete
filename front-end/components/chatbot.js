// Simple FAQ Chatbot for RAM Store
class Chatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.ramData = [];
        this.orderData = [];
        this.init();
    }

    init() {
        this.createChatWidget();
        this.addWelcomeMessage();
        this.loadRamData();
        this.loadOrderData();
    }

    async loadRamData() {
        try {
            const API_URL = 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/ram`);
            this.ramData = await response.json();
            console.log('RAM data loaded:', this.ramData.length, 'products');
        } catch (error) {
            console.error('Failed to load RAM data:', error);
        }
    }

    async loadOrderData() {
        try {
            const API_URL = 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/order`);
            this.orderData = await response.json();
            console.log('Order data loaded:', this.orderData.length, 'orders');
        } catch (error) {
            console.error('Failed to load order data:', error);
        }
    }

    createChatWidget() {
        const chatHTML = `
            <div id="chatbot-container" class="chatbot-closed">
                <div id="chat-button" onclick="chatbot.toggle()">
                    <span>💬</span>
                </div>
                <div id="chat-window" class="hidden">
                    <div id="chat-header">
                        <span>RAM Store Assistant</span>
                        <button onclick="chatbot.toggle()">✕</button>
                    </div>
                    <div id="chat-messages"></div>
                    <div id="chat-input-container">
                        <input type="text" id="chat-input" placeholder="Ask a question..." onkeypress="chatbot.handleKeyPress(event)">
                        <button onclick="chatbot.sendMessage()">Send</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const container = document.getElementById('chatbot-container');
        const window = document.getElementById('chat-window');
        
        if (this.isOpen) {
            container.classList.remove('chatbot-closed');
            container.classList.add('chatbot-open');
            window.classList.remove('hidden');
        } else {
            container.classList.remove('chatbot-open');
            container.classList.add('chatbot-closed');
            window.classList.add('hidden');
        }
    }

    addWelcomeMessage() {
        this.addBotMessage("Hi! I'm your RAM Store assistant. Ask me about:\n• RAM specifications\n• Pricing\n• Orders & shipping\n• Compatibility");
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addUserMessage(message);
        input.value = '';
        
        // Show typing indicator
        const typingId = 'typing-' + Date.now();
        this.addBotMessage("Typing...", typingId);
        
        // Simulate thinking delay
        setTimeout(() => {
            // Remove typing indicator
            const typingMsg = document.getElementById(typingId);
            if (typingMsg) {
                typingMsg.remove();
            }
            
            // Get intelligent response
            const response = this.getIntelligentResponse(message);
            this.addBotMessage(response);
        }, 500);
    }

    getIntelligentResponse(message) {
        const msg = message.toLowerCase();
        
        // Check for off-topic questions
        if (this.isOffTopic(msg)) {
            return "I'm specialized in helping with RAM products and our store. Please ask me about RAM specifications, compatibility, pricing, orders, or technical questions related to computer memory!";
        }
        
        // Check for specific RAM product queries FIRST (highest priority)
        const productInfo = this.getProductInfo(msg);
        if (productInfo) return productInfo;
        
        // Check for order queries
        if (msg.match(/order|booked|confirmed|my order|track|status/)) {
            const orderInfo = this.getOrderInfo(msg);
            if (orderInfo) return orderInfo;
        }
        
        // Check for stock queries
        if (msg.match(/stock|available|availability|in stock|out of stock/)) {
            const stockInfo = this.getStockInfo(msg);
            if (stockInfo) return stockInfo;
        }
        
        // Greetings
        if (msg.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
            return "Hello! 👋 Welcome to RAM Store! I'm here to help you find the perfect RAM for your needs. What would you like to know?";
        }
        
        // DDR Types
        if (msg.includes('ddr4') && msg.includes('ddr5')) {
            return "Great question! Here's the difference:\n\n🔹 DDR4: Mature technology, more affordable, speeds up to 3600MHz, widely compatible\n🔹 DDR5: Latest generation, faster (4800MHz+), better power efficiency, future-proof\n\nDDR5 is better for new builds, but DDR4 offers great value. Check your motherboard compatibility first!";
        }
        
        if (msg.includes('ddr5')) {
            return "DDR5 is our latest RAM technology! Benefits:\n✅ Speeds from 4800MHz to 6000MHz+\n✅ Better power efficiency (1.1V vs 1.2V)\n✅ Higher capacity support\n✅ Future-proof for new systems\n\nWe have DDR5 options from ₹5,199. Check the product list above!";
        }
        
        if (msg.includes('ddr4')) {
            return "DDR4 is a reliable, cost-effective choice! Features:\n✅ Speeds from 2400MHz to 3600MHz\n✅ Wide motherboard compatibility\n✅ Great price-to-performance ratio\n✅ Perfect for most gaming and work needs\n\nOur DDR4 RAM starts at ₹2,199. Browse our selection above!";
        }
        
        if (msg.includes('ddr3')) {
            return "DDR3 is older technology. We focus on DDR4 and DDR5 for better performance and compatibility with modern systems. If you have an older PC, DDR4 might still work with a motherboard upgrade!";
        }
        
        // Speed and Performance
        if (msg.match(/speed|mhz|fast|performance|quick/)) {
            return "RAM speed (MHz) affects performance:\n\n🚀 2400-2666MHz: Basic tasks, office work\n🚀 3000-3200MHz: Gaming, multitasking (sweet spot!)\n🚀 3600MHz+: High-end gaming, content creation\n🚀 4800MHz+: DDR5 for cutting-edge performance\n\nHigher MHz = faster data transfer. Match your motherboard's supported speed!";
        }
        
        // Capacity
        if (msg.match(/capacity|how much|8gb|16gb|32gb|size/)) {
            return "RAM capacity guide:\n\n💾 8GB: Basic use, web browsing, office work\n💾 16GB: Gaming, multitasking (recommended!)\n💾 32GB: Heavy workloads, video editing, 3D rendering\n💾 64GB+: Professional workstations\n\nFor most users, 16GB is the sweet spot. Gamers and creators benefit from 32GB!";
        }
        
        // Compatibility
        if (msg.match(/compatible|compatibility|work with|support|motherboard/)) {
            return "To check RAM compatibility:\n\n1️⃣ Check your motherboard manual or specs\n2️⃣ Verify DDR type (DDR4 or DDR5)\n3️⃣ Check max speed supported\n4️⃣ Confirm max capacity per slot\n5️⃣ Check number of RAM slots\n\n⚠️ DDR4 and DDR5 are NOT interchangeable! Share your motherboard model if you need help.";
        }
        
        if (msg.match(/laptop|notebook/)) {
            return "Important: Our RAM is primarily for DESKTOP PCs (DIMM format).\n\nLaptop RAM uses SO-DIMM (smaller form factor). Please verify before ordering! If you need laptop RAM, contact us for availability.";
        }
        
        // Brands
        if (msg.match(/brand|corsair|kingston|gskill|crucial|teamgroup|adata/)) {
            return "We stock premium RAM brands:\n\n⭐ Corsair: High performance, RGB options\n⭐ Kingston: Reliable, great value\n⭐ G.Skill: Enthusiast choice, overclocking\n⭐ Crucial: Budget-friendly, solid quality\n⭐ TeamGroup: Good balance of price/performance\n\nAll brands come with manufacturer warranty. Check our product list for available models!";
        }
        
        // Pricing
        if (msg.match(/price|cost|cheap|expensive|budget|affordable/)) {
            return "Our RAM pricing:\n\n💰 Budget (₹2,199-₹4,000): 8GB DDR4, basic speeds\n💰 Mid-range (₹4,000-₹8,000): 16GB DDR4, good speeds\n💰 Premium (₹8,000-₹15,000): 32GB or DDR5\n\nPrices vary by capacity, speed, and brand. Check the product list above for current prices and stock!";
        }
        
        // Gaming
        if (msg.match(/gaming|game|fps|fortnite|valorant|gta|pubg/)) {
            return "For gaming, I recommend:\n\n🎮 Minimum: 16GB DDR4 3200MHz (₹4,000-₹6,000)\n🎮 Recommended: 16GB DDR4 3600MHz or DDR5 (₹6,000-₹10,000)\n🎮 Enthusiast: 32GB DDR5 5600MHz+ (₹10,000+)\n\n16GB is the sweet spot for most games. Higher speeds improve FPS in CPU-intensive games!";
        }
        
        // RGB
        if (msg.match(/rgb|light|led|color|glow/)) {
            return "Looking for RGB RAM? 🌈\n\nWe have RGB options from Corsair and other brands! RGB RAM adds style to your build without affecting performance. Check product descriptions for RGB availability.\n\nNote: RGB models are typically ₹500-₹1,500 more than non-RGB versions.";
        }
        
        // Ordering
        if (msg.match(/order|buy|purchase|checkout/)) {
            return "To place an order:\n\n1️⃣ Browse RAM products above\n2️⃣ Click 'View Details' to see specs\n3️⃣ Fill in your name and email\n4️⃣ Select quantity\n5️⃣ Click 'Order Now'\n\n✅ You'll receive email confirmation with PDF invoice\n✅ Payment deducted in 2 business days\n✅ Delivery in 3-5 business days";
        }
        
        // Shipping
        if (msg.match(/shipping|delivery|ship|deliver|when|how long/)) {
            return "Shipping details:\n\n📦 Processing: 1-2 business days\n📦 Delivery: 3-5 business days\n📦 Tracking: Sent via email\n📦 Shipping: Free on all orders!\n\nYou'll receive order confirmation and tracking updates via email.";
        }
        
        // Payment
        if (msg.match(/payment|pay|cod|cash|card|upi/)) {
            return "Payment information:\n\n💳 Payment is deducted 2 business days after order confirmation\n💳 We accept all major payment methods\n💳 You'll receive a PDF invoice via email\n\nFor specific payment queries, check your order confirmation email or contact support.";
        }
        
        // Stock
        if (msg.match(/stock|available|availability|in stock|out of stock/)) {
            // Already handled above with getStockInfo
            return this.getStockInfo(msg);
        }
        
        // Warranty
        if (msg.match(/warranty|guarantee|defect|broken|faulty/)) {
            return "Warranty information:\n\n🛡️ All RAM comes with manufacturer warranty\n🛡️ Typically 3-5 years (lifetime on some brands)\n🛡️ Covers manufacturing defects\n🛡️ Check individual product details for specific warranty period\n\nFor warranty claims, contact us with your order details.";
        }
        
        // Returns
        if (msg.match(/return|refund|cancel|exchange/)) {
            return "Return policy:\n\n↩️ 7-day return window\n↩️ Accepted for defective or damaged items\n↩️ Product must be unused and in original packaging\n↩️ Contact us with order details to initiate return\n\nWe'll process refunds within 5-7 business days after receiving the return.";
        }
        
        // Reviews
        if (msg.match(/review|rating|feedback|opinion/)) {
            return "Customer reviews:\n\n⭐ View reviews by clicking 'View Details' on any product\n⭐ See ratings and customer experiences\n⭐ After purchasing, you can leave your own review!\n\nReviews help other customers make informed decisions. Check them out!";
        }
        
        // Installation
        if (msg.match(/install|how to|setup|put in|insert/)) {
            return "Installing RAM is easy:\n\n1️⃣ Power off PC and unplug\n2️⃣ Open case and locate RAM slots\n3️⃣ Push down slot clips\n4️⃣ Align RAM notch with slot notch\n5️⃣ Press firmly until clips click\n6️⃣ Close case and power on\n\n⚠️ Handle by edges, avoid touching gold contacts. For dual-channel, use matching pairs in alternating slots (usually slots 2 & 4).";
        }
        
        // Overclocking
        if (msg.match(/overclock|xmp|docp|boost|tune/)) {
            return "RAM overclocking (XMP/DOCP):\n\n⚡ XMP (Intel) / DOCP (AMD) profiles boost RAM to rated speed\n⚡ Enable in BIOS settings\n⚡ Improves performance in CPU-intensive tasks\n⚡ Safe and supported by manufacturers\n\nMost RAM runs at lower speeds by default. Enable XMP/DOCP to get the speed you paid for!";
        }
        
        // Contact/Support
        if (msg.match(/contact|support|help|email|phone|call/)) {
            return "Need more help?\n\n📧 Email: support@ramstore.com\n📧 Response time: Within 24 hours\n📧 Include order number for faster assistance\n\nI'm here for quick questions, but our support team can help with complex issues!";
        }
        
        // Thanks
        if (msg.match(/thank|thanks|appreciate/)) {
            return "You're very welcome! 😊 Happy to help! If you have any other questions about RAM or our store, feel free to ask. Good luck with your build! 🚀";
        }
        
        // Comparison
        if (msg.match(/compare|difference|vs|versus|better/)) {
            return "Want to compare RAM options?\n\nTell me what you're comparing:\n• DDR4 vs DDR5\n• Different speeds (e.g., 3200MHz vs 3600MHz)\n• Capacities (e.g., 16GB vs 32GB)\n• Brands\n\nOr check the product details above to compare specs side-by-side!";
        }
        
        // Recommendation
        if (msg.match(/recommend|suggest|best|which|should i/)) {
            return "I'd love to recommend the perfect RAM! Tell me:\n\n🔹 Your use case (gaming, work, editing?)\n🔹 Your budget\n🔹 Your motherboard (DDR4 or DDR5?)\n🔹 Current RAM (if upgrading)\n\nOr browse our products above - all are quality options!";
        }
        
        // Default response
        return "I can help you with:\n\n💬 RAM specifications (DDR4/DDR5, speed, capacity)\n💬 Compatibility and installation\n💬 Gaming and performance questions\n💬 Pricing and product recommendations\n💬 Orders, shipping, and returns\n💬 Warranty and support\n\nWhat would you like to know about RAM?";
    }

    isOffTopic(msg) {
        const offTopicKeywords = [
            'weather', 'news', 'politics', 'sports', 'movie', 'music', 'recipe', 'cooking',
            'restaurant', 'travel', 'hotel', 'flight', 'car', 'phone', 'mobile',
            'facebook', 'instagram', 'twitter', 'dating', 'relationship', 'health',
            'medicine', 'doctor', 'covid', 'virus', 'stock market', 'crypto', 'bitcoin',
            'joke', 'story', 'poem', 'song', 'celebrity', 'actor', 'actress'
        ];
        
        return offTopicKeywords.some(keyword => msg.includes(keyword));
    }

    getOrderInfo(msg) {
        if (this.orderData.length === 0) {
            return "No orders found in the system yet. Be the first to order! 🚀";
        }

        // Check if asking about a specific customer
        const customerMatch = msg.match(/([a-z]+)/i);
        if (customerMatch) {
            const searchName = customerMatch[0].toLowerCase();
            const customerOrders = this.orderData.filter(order => 
                order.customerName.toLowerCase().includes(searchName)
            );
            
            if (customerOrders.length > 0) {
                let response = `📦 Orders for "${customerOrders[0].customerName}":\n\n`;
                customerOrders.forEach((order, index) => {
                    const statusEmoji = order.status === 'Confirmed' ? '✅' : 
                                       order.status === 'Pending' ? '⏳' : '📦';
                    response += `${index + 1}. ${order.ram.name}\n`;
                    response += `   ${statusEmoji} Status: ${order.status}\n`;
                    response += `   Qty: ${order.quantity} | Total: ₹${(order.ram.price * order.quantity).toLocaleString()}\n\n`;
                });
                return response;
            }
        }

        // General order statistics
        const confirmed = this.orderData.filter(o => o.status === 'Confirmed').length;
        const pending = this.orderData.filter(o => o.status === 'Pending').length;
        const stockout = this.orderData.filter(o => o.status === 'Stockout').length;

        let response = `📊 Order Statistics:\n\n`;
        response += `📦 Total Orders: ${this.orderData.length}\n`;
        response += `✅ Confirmed: ${confirmed}\n`;
        response += `⏳ Pending: ${pending}\n`;
        if (stockout > 0) response += `❌ Stockout: ${stockout}\n`;
        response += `\n💡 To track your order, tell me your name or email!`;

        return response;
    }

    getProductInfo(msg) {
        if (this.ramData.length === 0) {
            return null; // Let other responses handle it
        }

        // Check if message mentions a specific product name or brand
        for (const ram of this.ramData) {
            const ramName = ram.name.toLowerCase();
            const ramBrand = ram.brand.toLowerCase();
            
            // Check if the message contains the product name or brand
            if (msg.includes(ramName) || (msg.includes(ramBrand) && msg.length < 30)) {
                const stockStatus = ram.stock > 0 ? `✅ IN STOCK (${ram.stock} units)` : `❌ OUT OF STOCK`;
                
                return `📦 ${ram.name}\n\n` +
                       `${stockStatus}\n\n` +
                       `💰 Price: ₹${ram.price.toLocaleString()}\n` +
                       `🏷️ Brand: ${ram.brand}\n` +
                       `🔧 Type: ${ram.ddrType}\n` +
                       `💾 Capacity: ${ram.capacityGb}GB\n` +
                       `⚡ Speed: ${ram.speedMhz}MHz\n` +
                       `🛡️ Warranty: ${ram.warranty}\n\n` +
                       (ram.stock > 0 ? 
                           `Order now from the product list above! 🚀` : 
                           `This item is currently unavailable. Check our other options!`);
            }
        }

        return null; // No specific product found
    }

    getStockInfo(msg) {
        if (this.ramData.length === 0) {
            return "Loading stock information... Please try again in a moment.";
        }

        // Check if asking about a specific product
        const inStock = this.ramData.filter(ram => ram.stock > 0);
        const outOfStock = this.ramData.filter(ram => ram.stock === 0);

        // Check if message mentions a specific brand or product
        for (const ram of this.ramData) {
            const ramName = ram.name.toLowerCase();
            const ramBrand = ram.brand.toLowerCase();
            
            if (msg.includes(ramName) || msg.includes(ramBrand)) {
                if (ram.stock > 0) {
                    return `✅ ${ram.name} is IN STOCK!\n\n📦 Available: ${ram.stock} units\n💰 Price: ₹${ram.price.toLocaleString()}\n🔧 Specs: ${ram.brand} | ${ram.ddrType} | ${ram.capacityGb}GB | ${ram.speedMhz}MHz\n\nOrder now before it sells out!`;
                } else {
                    return `❌ ${ram.name} is currently OUT OF STOCK.\n\nWe're working to restock this item. Check back soon or browse our other available RAM options!`;
                }
            }
        }

        // General stock query
        if (outOfStock.length === 0) {
            return `✅ Great news! All our RAM products are currently IN STOCK!\n\n📦 ${inStock.length} products available\n\nBrowse the product list above to see all options and place your order!`;
        } else {
            let response = `📊 Current Stock Status:\n\n`;
            response += `✅ IN STOCK: ${inStock.length} products\n`;
            response += `❌ OUT OF STOCK: ${outOfStock.length} products\n\n`;
            
            if (outOfStock.length > 0) {
                response += `Out of stock items:\n`;
                outOfStock.forEach(ram => {
                    response += `• ${ram.name}\n`;
                });
                response += `\nCheck the product list above for available alternatives!`;
            }
            
            return response;
        }
    }

    addUserMessage(text) {
        const messagesDiv = document.getElementById('chat-messages');
        messagesDiv.innerHTML += `
            <div class="chat-message user-message">
                <div class="message-content">${text}</div>
            </div>
        `;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    addBotMessage(text, id = null) {
        const messagesDiv = document.getElementById('chat-messages');
        const messageId = id ? `id="${id}"` : '';
        messagesDiv.innerHTML += `
            <div class="chat-message bot-message" ${messageId}>
                <div class="message-content">${text}</div>
            </div>
        `;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}

// Initialize chatbot when page loads
let chatbot;
document.addEventListener('DOMContentLoaded', () => {
    chatbot = new Chatbot();
});
