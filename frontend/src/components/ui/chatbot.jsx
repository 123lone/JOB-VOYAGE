import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion'; 
import { TypeAnimation } from 'react-type-animation';  
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; 

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! How can I assist you today?", sender: "bot" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatWindowRef = useRef(null);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:5000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}, ${response.statusText}`);
            }

            const data = await response.json();
            const botResponse = { text: data.reply || "Sorry, I couldn't understand that.", sender: 'bot' };
            setMessages((prev) => [...prev, botResponse]);
        } catch (error) {
            console.error("Error connecting to chatbot:", error);
            setMessages((prev) => [...prev, { text: `Error: Unable to reach chatbot.`, sender: "bot" }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        onClick={() => setIsOpen(true)}
                        className="bg-blue-600 text-white p-3 rounded-full shadow-md hover:bg-blue-700 transition-colors duration-200"
                        aria-label="Open Chatbot"
                    >
                        <MessageCircle size={24} />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div className="w-96 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
                        <div className="flex justify-between items-center bg-gray-50 border-b p-4">
                            <h2 className="text-lg font-semibold">Job Seeker Assistant</h2>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700" aria-label="Close Chatbot">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="h-96 overflow-y-auto p-3 flex flex-col space-y-2" ref={chatWindowRef}>
                            <AnimatePresence initial={false}>
                                {messages.map((msg, index) => (
                                    <motion.div key={index} className={`flex items-start space-x-3 py-2 ${msg.sender === 'user' ? 'self-end text-right' : 'text-left'}`}>
                                        {msg.sender === 'bot' && <Avatar><AvatarFallback>AI</AvatarFallback></Avatar>}
                                        <div className={`text-sm rounded-xl p-3 w-fit max-w-[70%] break-words ${msg.sender === 'user' ? 'bg-blue-100 text-gray-800' : 'bg-gray-100 text-gray-700'}`}>
                                            {msg.text}
                                        </div>
                                        {msg.sender === 'user' && <Avatar><AvatarFallback>You</AvatarFallback></Avatar>}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {loading && (
                                <div className="text-gray-500 text-sm self-start flex items-center space-x-2">
                                    <Avatar><AvatarFallback>AI</AvatarFallback></Avatar>
                                    <span>
                                        <TypeAnimation sequence={['Thinking...', 1000]} repeat={Infinity} cursor={true} />
                                    </span>
                                </div>
                            )}
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="p-3 border-t">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a message..."
                                    className="flex-1 border rounded-md p-2 outline-none"
                                    aria-label="Enter your message"
                                />
                                <Button type="submit" className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700" aria-label="Send message">
                                    <Send size={16} />
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Chatbot;
