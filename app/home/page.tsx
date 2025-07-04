export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Welcome to Interview Simulator</h1>
        <p className="text-xl text-gray-600 mb-8">
          Practice your interview skills with our AI-powered platform
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
            <p className="text-gray-700 mb-4">
              Begin your interview preparation by starting a new practice session.
            </p>
            <a 
              href="/interview" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Start Practice
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Your Progress</h2>
            <p className="text-gray-700 mb-4">
              Track your improvement and review past interview sessions.
            </p>
            <a 
              href="/history" 
              className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              View History
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

