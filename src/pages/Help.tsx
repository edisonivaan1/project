import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../components/UI/Card';
import Button from '../components/UI/Button';
import { supportService } from '../services/api';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'How do I play the grammar games?',
    answer: 'Select a grammar topic from the home screen, and you\'ll be taken to a brief tutorial. After watching the tutorial, you can start playing the game. Each game presents different types of exercises: multiple choice questions, fill-in-the-blank, or drag-and-drop activities.',
  },
  {
    question: 'Can I skip the tutorial?',
    answer: 'Yes, you can skip the tutorial by clicking the "Skip Tutorial" button. You can also replay the tutorial at any time. Each tutorial is customized to show you exactly how that topic\'s questions work.',
  },
  {
    question: 'How do drag-and-drop questions work?',
    answer: 'In drag-and-drop exercises, you\'ll see sentences with blank spaces and a list of available words. Simply drag the correct words into the blanks. You can also use keyboard shortcuts: Ctrl+1/2/3 to select words, then 1/2 to place them in spaces, Shift+1/2 to select words from spaces, and Escape to cancel selections.',
  },
  {
    question: 'What keyboard shortcuts are available?',
    answer: 'For drag-and-drop questions: Ctrl+1/2/3 selects words from the list, 1/2 places selected words in spaces, Shift+1/2 selects words already in spaces, Escape cancels current selection, and Delete removes words from selected spaces. Use arrow keys ←/→ to navigate between questions.',
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [category, setCategory] = useState('other');
  const [userEmail, setUserEmail] = useState('');
  
  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  
  const handleSubmitSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supportMessage.trim()) {
      setSubmitStatus('error');
      setSubmitMessage('Please write a message before sending.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const response = await supportService.submitMessage({
        message: supportMessage.trim(),
        category,
        userEmail: userEmail.trim() || undefined
      });

      if (response.success) {
        setSubmitStatus('success');
        setSubmitMessage('Message sent successfully! Our support team will get back to you soon.');
        setSupportMessage('');
        setUserEmail('');
        setCategory('other');
        
        // Show success popup and clear after 4 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
          setSubmitMessage('');
        }, 4000);
      } else {
        throw new Error(response.message || 'Error sending message');
      }
    } catch (error: any) {
      console.error('Error submitting support message:', error);
      setSubmitStatus('error');
      setSubmitMessage(
        error.message || 
        'An error occurred while sending your message. Please try again.'
      );
      
      // Clear error state after 4 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 4000);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in">
      {/* Popup Notification */}
      {submitMessage && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border max-w-md transition-all duration-300 ${
          submitStatus === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-start gap-3">
            {submitStatus === 'success' ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-600" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">
                {submitStatus === 'success' ? 'Success!' : 'Error'}
              </p>
              <p className="text-sm mt-1">{submitMessage}</p>
            </div>
            <button
              onClick={() => {
                setSubmitStatus('idle');
                setSubmitMessage('');
              }}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="bg-[rgb(var(--color-background-card))] rounded-xl shadow-md p-6">
        <header className="mb-8">
          <h1 
            className="text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
            tabIndex={0}
            role="heading"
            aria-level={1}
          >
            Help & Support
          </h1>
        </header>
        
        <section className="mb-8">
          <h2 
            className="text-2xl font-bold mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
            tabIndex={0}
            role="heading"
            aria-level={2}
          >
            Frequently Asked Questions
          </h2>
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
                  <p>The game screen presents different types of grammar exercises:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Multiple Choice:</strong> Select the correct answer from the given options</li>
                    <li><strong>Fill in the Blank:</strong> Type complete sentences using proper grammar</li>
                    <li><strong>Drag and Drop:</strong> Drag words from the available options into the correct blank spaces</li>
                  </ul>
                  <p className="mt-2">Use the hint button if you need help, and navigate between questions using the arrow keys or the question navigator.</p>
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

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Accessibility Features</h2>
          <Card>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold mb-2">Keyboard Navigation</h3>
                  <p>The game is fully accessible via keyboard:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><kbd className="px-2 py-1 bg-gray-100 rounded text-sm">←/→</kbd> Navigate between questions</li>
                    <li><kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Tab</kbd> Move through interactive elements</li>
                    <li><kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Enter/Space</kbd> Activate buttons and select options</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold mb-2">Drag-and-Drop Keyboard Shortcuts</h3>
                  <p>For users who prefer keyboard over mouse:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl+1/2/3</kbd> Select word from available options</li>
                    <li><kbd className="px-2 py-1 bg-gray-100 rounded text-sm">1/2</kbd> Place selected word in space 1 or 2</li>
                    <li><kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Shift+1/2</kbd> Select word from existing space</li>
                    <li><kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Escape</kbd> Cancel current selection</li>
                    <li><kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Delete</kbd> Remove word from selected space</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Screen Reader Support</h3>
                  <p>All interactive elements include proper ARIA labels and live regions to announce changes to screen readers.</p>
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
              <form onSubmit={handleSubmitSupport} className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Inquiry Type
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="technical">Technical Issue</option>
                    <option value="content">Game Content</option>
                    <option value="account">User Account</option>
                    <option value="feedback">Suggestions/Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Email Field (Optional) */}
                <div>
                  <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="userEmail"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your-email@example.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    If you provide your email, we can respond to you directly
                  </p>
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Describe your inquiry or issue in as much detail as possible..."
                    required
                    maxLength={2000}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {supportMessage.length}/2000 characters
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={!supportMessage.trim() || isSubmitting}
                    className={`h-[40px] w-[150px] border-2 rounded-lg transition-all font-medium ${
                      isSubmitting 
                        ? 'bg-gray-400 border-gray-500 cursor-not-allowed text-gray-200' 
                        : 'bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white shadow-sm hover:shadow-md'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-200"></div>
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
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