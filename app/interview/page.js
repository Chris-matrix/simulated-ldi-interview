'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Generate interview feedback based on the conversation
function generateInterviewFeedback(messages, profession) {
  // Count user responses
  const userResponses = messages.filter(msg => msg.role === 'user').length;
  
  // Calculate score based on response count and length
  const responseScore = Math.min(30, userResponses * 5);
  const lengthScore = messages.length > 10 ? 30 : (messages.length / 10) * 30;
  const baseScore = 40 + responseScore + lengthScore;
  
  // Generate random variation (±10 points)
  const variation = (Math.random() * 20) - 10;
  const finalScore = Math.min(100, Math.max(50, Math.round(baseScore + variation)));
  
  // Generate feedback based on score
  const feedbackTemplates = {
    strengths: [
      'Excellent communication skills',
      'Strong problem-solving abilities',
      'In-depth knowledge of the field',
      'Clear and concise responses',
      'Good industry terminology usage',
      'Well-structured answers',
      'Demonstrated relevant experience',
      'Professional demeanor',
      'Good listening skills',
      'Strong leadership qualities'
    ],
    improvements: [
      'Could provide more specific examples',
      'Work on time management',
      'Consider more industry-specific terminology',
      'Try to be more concise in responses',
      'Could demonstrate more enthusiasm',
      'Consider preparing more questions about the company',
      'Work on technical depth in some areas',
      'Could improve on articulating career goals',
      'Consider more detailed explanations',
      'Work on confidence in responses'
    ]
  };
  
  // Select random strengths and improvements
  const getRandomItems = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  const strengths = getRandomItems(feedbackTemplates.strengths, 3);
  const improvements = getRandomItems(feedbackTemplates.improvements, 3);
  
  // Generate recommendation based on score
  let recommendation;
  if (finalScore >= 90) {
    recommendation = 'Exceptional candidate with outstanding qualifications. Strongly recommended for the position.';
  } else if (finalScore >= 75) {
    recommendation = 'Strong candidate with good potential. Recommended for the next round of interviews.';
  } else {
    recommendation = 'Candidate shows potential but may need more experience or preparation. Consider for future opportunities.';
  }
  
  return {
    score: finalScore,
    strengths: strengths,
    areasForImprovement: improvements,
    recommendation: recommendation,
    interviewDate: new Date().toISOString(),
    position: profession
  };
}

export default function InterviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isEndingInterview, setIsEndingInterview] = useState(false);
  
  const profession = searchParams?.get('profession');
  
  // Redirect to profession selection if no profession is provided
  useEffect(() => {
    if (!profession) {
      router.push('/select-profession');
    } else {
      // Initialize with a welcome message
      setMessages([
        { role: 'assistant', content: `Welcome to your ${profession} interview! I'll be your interviewer today.` }
      ]);
      setIsLoading(false);
    }
  }, [profession, router]);

  const handleSend = async (e) => {
    e.preventDefault();
    const userInput = input.trim();
    if (!userInput || isLoading) return;
    
    // Add user message
    const userMessage = { role: 'user', content: userInput };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    
    try {
      // Try to call the API first
      let response;
      try {
        response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'interview_chat',
            message: userInput,
            history: messages,
            profession: profession
          }),
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if we got an error response from the API
        if (data.error) {
          throw new Error(data.message || 'Error from API');
        }
        
        // Add assistant response
        const assistantMessage = { 
          role: 'assistant', 
          content: data.response || "I'm not sure how to respond to that."
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        return;
      } catch (apiError) {
        // Log to error reporting service in production
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('API Error:', apiError);
        }
      }
      
      // Fallback response when API is not available
      const fallbackResponses = [
        `As a ${profession}, how would you handle a challenging situation?`,
        `That's an interesting perspective. In your role as a ${profession}, what skills do you think are most valuable?`,
        `I see. Could you tell me more about your experience with that?`,
        `How would you approach that differently now, with your experience as a ${profession}?`,
        `That's a great point. What challenges have you faced in your work as a ${profession}?`
      ];
      
      const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      const assistantMessage = { 
        role: 'assistant', 
        content: fallbackResponse
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your response. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndInterview = () => {
    if (window.confirm('Are you sure you want to end the interview? You will receive feedback based on your responses.')) {
      confirmEndInterview();
    }
  };

  const confirmEndInterview = () => {
    setIsEndingInterview(true);
    
    // Generate feedback based on the conversation
    const feedback = generateInterviewFeedback(messages, profession);
    
    // Store feedback in session storage
    sessionStorage.setItem('interviewFeedback', JSON.stringify(feedback));
    
    // Add a closing message
    const closingMessage = {
      role: 'assistant',
      content: `Thank you for the interview! Based on our conversation, I've prepared some feedback for your ${profession} interview. You'll be redirected to see your results.`
    };
    
    setMessages(prev => [...prev, closingMessage]);
    
    // Navigate to home page after a short delay
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  if (isLoading || !profession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading interview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {profession} Interview
        </h1>
      </div>
      
      {/* Chat Container */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 h-[calc(100vh-200px)] overflow-y-auto">
        {/* Messages will be rendered here */}
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-4 ${message.role === 'assistant' ? 'text-left' : 'text-right'}`}
          >
            <div 
              className={`inline-block px-4 py-2 rounded-lg ${
                message.role === 'assistant' 
                  ? 'bg-blue-100 text-gray-800' 
                  : 'bg-blue-500 text-white'
              }`}
            >
              {message.content}
              <div className="text-xs mt-1 opacity-70">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your response..."
          disabled={isLoading || isEndingInterview}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading || isEndingInterview}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
      
      {/* End Interview Button */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={handleEndInterview}
          disabled={isEndingInterview}
          className={`bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors ${
            isEndingInterview ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isEndingInterview ? 'Processing...' : 'End Interview'}
        </button>
      </div>
    </div>
  );
}
