
import React, { useState } from 'react';
import { MessageSquare, File, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Message {
  id: string;
  sender: 'buyer' | 'seller';
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'order';
  fileData?: {
    name: string;
    size: string;
    type: string;
  };
}

interface MessageInterfaceProps {
  currentUser: 'buyer' | 'seller';
  onCreateOrder: () => void;
}

const MessageInterface = ({ currentUser, onCreateOrder }: MessageInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'buyer',
      content: 'Hi, I\'m interested in discussing a property transaction with you.',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text'
    },
    {
      id: '2',
      sender: 'seller',
      content: 'Hello! I\'d be happy to help. What type of property are you looking for?',
      timestamp: new Date(Date.now() - 3000000),
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: currentUser,
        content: newMessage,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-semibold">
                {currentUser === 'buyer' ? 'Chatting with Seller' : 'Chatting with Buyer'}
              </h3>
              <p className="text-sm text-gray-500">Property Transaction Discussion</p>
            </div>
          </div>
          <Button onClick={onCreateOrder} className="bg-blue-600 hover:bg-blue-700">
            Create Order
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === currentUser ? 'justify-end' : 'justify-start'
            }`}
          >
            <Card className={`max-w-xs md:max-w-md p-3 ${
              message.sender === currentUser
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100'
            }`}>
              <div className="space-y-1">
                <p className="text-sm">{message.content}</p>
                {message.fileData && (
                  <div className="flex items-center space-x-2 text-xs opacity-80">
                    <File className="h-3 w-3" />
                    <span>{message.fileData.name}</span>
                  </div>
                )}
                <p className={`text-xs ${
                  message.sender === currentUser ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={sendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageInterface;
