import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Send, ArrowLeft } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../components/UI/Card';
import Button from '../components/UI/Button';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'How do I play the grammar games?',
    answer: 'Select a grammar topic from the home screen, and you\'ll be taken to a brief tutorial. After watching the tutorial, you can start playing the game. Each game presents grammar exercises where you need to select the correct answer.',
  },
  {
    question: 'Can I skip the tutorial?',
    answer: 'Yes, you can skip the tutorial by clicking the "Skip Tutorial" button. You can also replay the tutorial at any time.',
  },
  {
    question: 'How do the hints work?',
    answer: 'If you\'re stuck on a question, you can click the "Show Hint" button to get a clue. Hints will also appear automatically after two incorrect attempts.',
  },
  {
    question: 'How is my score calculated?',
    answer: 'Your score is calculated based on the number of correct answers. At the end of each game, you\'ll see your total score and success rate.',
  },
  {
    question: 'How do I change the sound settings?',
    answer: 'You can change sound settings by clicking the Settings button on the home screen or by using the sound icon in the game screen.',
  },
  {
    question: 'Will my progress be saved?',
    answer: 'Yes, your progress is saved automatically. You can see your completion percentage for each topic on the home screen.',
  },
];

const Help: React.FC = () => {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [supportMessage, setSupportMessage] = useState('');
  
  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  
  const handleSubmitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the support message to a backend
    alert('Your message has been sent. Our support team will get back to you soon.');
    setSupportMessage('');
  };
  
  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in">
      <div className="bg-[rgb(var(--color-background-card))] rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-8">Help & Support</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  className="w-full text-left p-4 flex justify-between items-center"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-semibold">{item.question}</h3>
                  {expandedIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {expandedIndex === index && (
                  <CardBody className="border-t border-gray-100 bg-gray-50">
                    <p>{item.answer}</p>
                  </CardBody>
                )}
              </Card>
            ))}
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Game Navigation</h2>
          <Card>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold mb-2">Home Screen</h3>
                  <p>The home screen displays all available grammar topics. Click on a topic card to start learning.</p>
                </div>
                
                <div>
                  <h3 className="font-bold mb-2">Tutorial Screen</h3>
                  <p>Each topic has a tutorial that explains the game mechanics and provides examples. You can skip or replay the tutorial.</p>
                </div>
                
                <div>
                  <h3 className="font-bold mb-2">Game Screen</h3>
                  <p>The game screen presents grammar exercises. Select your answer and click "Check Answer". Use the hint button if you need help.</p>
                </div>
                
                <div>
                  <h3 className="font-bold mb-2">Results Screen</h3>
                  <p>After completing all questions, you'll see your score and performance summary. You can retry the game or return to the home screen.</p>
                </div>
                
                <div>
                  <h3 className="font-bold mb-2">Settings Screen</h3>
                  <p>Customize your experience by adjusting audio and visual settings. Changes are saved automatically.</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-6">Contact Support</h2>
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold">Need more help?</h3>
              <p className="text-gray-600 text-sm">Send us a message and we'll get back to you.</p>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmitSupport}>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Describe your issue or question..."
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={!supportMessage.trim()}
                    className="h-[30px] w-[150px] bg-[rgb(var(--color-secondary-button))] hover:bg-[rgb(var(--color-secondary-button))/0.8] text-[rgb(var(--color-text-white))] border-2 border-black rounded-[21.5px]"
                  >
                    Send
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </section>

        <div className="mt-8 flex justify-start">
          <Button
            variant="outline"
            icon={<ArrowLeft className="text-white" />}
            onClick={() => navigate('/')}
            className="h-[40px] w-[225px] bg-[rgb(var(--color-button))] hover:bg-[rgb(var(--color-button))/0.8] text-white border-[2px] border-solid border-[#000000] rounded-[11.5px]"
          >
            Back to topics
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Help;