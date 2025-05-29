// src/components/MyChatbot.tsx
import React from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';

const steps = [
  {
    id: '0',
    message: 'Hi!',
    trigger: '1',
  },
  {
    id: '1',
    message: 'What is your name?',
    trigger: '2',
  },
  {
    id: '2',
    user: true,
    trigger: '3',
  },
  {
    id: '3',
    message: 'Nice to meet you, {previousValue}!',
    trigger: '4',
  },
  {
    id: '4',
    message: 'Ask me any question related to solid waste management...',
  }
];

const theme = {
  background: '#f5f8fb',
  fontFamily: 'Arial',
  headerBgColor: '#6A994E',
  headerFontColor: '#fff',
  headerFontSize: '15px',
  botBubbleColor: '#6A994E',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};

const MyChatbot =() => {
  return (
    <ThemeProvider theme={theme}>
      <ChatBot  steps={steps} 
          floating={true}  // Adds floating button for chatbot toggle
           />
    </ThemeProvider>
  );
};

export default MyChatbot;
