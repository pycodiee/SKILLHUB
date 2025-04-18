import React, { useState, useRef } from 'react';
import { ArrowLeft, HelpCircle, MessageSquare, BarChart, Settings } from 'lucide-react';
import Achievement from './Achievement';

interface CodeEditorProps {
  onBack: () => void;
  level?: number;
}

// Add language-specific starter code
const languageTemplates = {
  'Python 3': `import sys

while True:
    enemy_1 = input()  # name of enemy 1
    dist_1 = int(input())  # distance to enemy 1
    enemy_2 = input()  # name of enemy 2
    dist_2 = int(input())  # distance to enemy 2
    
    # Write an action using print
    # To debug: print("Debug messages...", file=sys.stderr, flush=True)
    
    # You have to output a correct ship name to shoot ("Buzz", enemy1, enemy2, ...)`,

  'Java': `import java.util.*;

class Player {
    public static void main(String args[]) {
        Scanner in = new Scanner(System.in);

        while (true) {
            String enemy1 = in.next(); // name of enemy 1
            int dist1 = in.nextInt(); // distance to enemy 1
            String enemy2 = in.next(); // name of enemy 2
            int dist2 = in.nextInt(); // distance to enemy 2

            // Write an action using System.out.println()
            // To debug: System.err.println("Debug messages...");

            // You have to output a correct ship name to shoot ("Buzz", enemy1, enemy2, ...)
        }
    }
}`,

  'C++': `#include <iostream>
#include <string>

using namespace std;

int main() {
    while (1) {
        string enemy_1; // name of enemy 1
        cin >> enemy_1;
        int dist_1; // distance to enemy 1
        cin >> dist_1;
        string enemy_2; // name of enemy 2
        cin >> enemy_2;
        int dist_2; // distance to enemy 2
        cin >> dist_2;

        // Write an action using cout
        // To debug: cerr << "Debug messages..." << endl;

        // You have to output a correct ship name to shoot ("Buzz", enemy1, enemy2, ...)
    }
}`
};

function CodeEditor({ onBack, level = 1 }: CodeEditorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('Python 3');
  const [code, setCode] = useState(languageTemplates['Python 3']);
  const [videoSource, setVideoSource] = useState('/game-lose.mp4');
  const [testsPassed, setTestsPassed] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(level);
  const consoleOutput = currentLevel === 1 ?
      `Game information:
    Is threats approaching fast !
    Threats within range:
    Rock 78m
  
    Standard Output Stream:
    > Rock
    Game information:
    Rock has been targeted
    Threats within range:
    Android 78m` 
    : 
    `Duck Status Report:
    ALERT: Duck in danger!
    Threats detected:
    Buzz 120m
    Android 90m
  
    Standard Output Stream:
    > Android
    Status Update:
    Android eliminated
    Duck status: Safe
    Remaining threat:
    Buzz 120m`;
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(languageTemplates[newLang as keyof typeof languageTemplates]);
  };

  // Move isDummyCode outside checkSolution
  const isDummyCode = () => {
    // Check if code is mostly unchanged from template
    const isTemplateCode = Object.values(languageTemplates).some(template => 
      code.trim() === template.trim()
    );

    // Check if code lacks actual implementation
    const hasNoImplementation = !code.includes('if') && 
      !code.includes('print(enemy') && 
      !code.includes('System.out.println(enemy') && 
      !code.includes('cout << enemy');

    // Check for comparison logic
    const hasNoComparison = !code.includes('<') && 
      !code.includes('>') && 
      !code.includes('min') && 
      !code.includes('compare');

    return isTemplateCode || hasNoImplementation || hasNoComparison;
  };

  const checkSolution = (code: string) => {
    const testCases = [
      { enemy1: "Rock", dist1: 78, enemy2: "Android", dist2: 120, expected: "Rock" },
      { enemy1: "Buzz", dist1: 50, enemy2: "Rock", dist2: 30, expected: "Rock" }
    ];

    // Check for proper code implementation
    if (isDummyCode()) {
      setTestsPassed(false);
      setVideoSource('/game-lose.mp4');
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play();
      }
      return;
    }

    // Test actual implementation
    let allTestsPassed = true;
    for (const test of testCases) {
      const hasProperLogic = code.includes(`${test.dist1}`) || 
        code.includes('dist_1') || 
        code.includes('dist1');
        
      const hasProperOutput = code.includes(`${test.enemy1}`) || 
        code.includes('enemy_1') || 
        code.includes('enemy1');

      if (!hasProperLogic || !hasProperOutput) {
        allTestsPassed = false;
        break;
      }

      const result = test.dist1 <= test.dist2 ? test.enemy1 : test.enemy2;
      if (result !== test.expected) {
        allTestsPassed = false;
        break;
      }
    }

    setTestsPassed(allTestsPassed);
    setVideoSource(allTestsPassed ? '/game-win.mp4' : '/game-lose.mp4');
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play();
    }
  };

  const handlePlayTestCase = () => {
    checkSolution(code);
  };

// Remove duplicate state declaration since it's already defined above
  
  // Add level progression handler
  const handleLevelProgress = () => {
    setCurrentLevel(2);
    setTestsPassed(false);
    setCode(languageTemplates[selectedLanguage as keyof typeof languageTemplates]);
  };

  const [showAchievement, setShowAchievement] = useState(false);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex">
      {/* Sidebar */}
      <div className="w-20 bg-[#252525] flex flex-col items-center py-6 space-y-8 border-r border-gray-800">
        <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors w-14 h-14 flex items-center justify-center" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors w-14 h-14 flex items-center justify-center">
          <HelpCircle size={24} />
        </button>
        <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors w-14 h-14 flex items-center justify-center">
          <MessageSquare size={24} />
        </button>
        <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors w-14 h-14 flex items-center justify-center">
          <BarChart size={24} />
        </button>
        <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors w-14 h-14 flex items-center justify-center">
          <Settings size={24} />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Left panel */}
        <div className="w-1/2 border-r border-gray-800">
          {/* Level preview - Video or GIF */}
          <div className="h-[300px] bg-black relative">
            {currentLevel === 1 ? (
              <video 
                ref={videoRef}
                className="w-full h-full object-cover" 
                controls
              >
                <source src={videoSource} type="video/mp4" />
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src={
                    testsPassed 
                      ? "./duck-win.gif"
: code === languageTemplates[selectedLanguage as keyof typeof languageTemplates]
                        ? "/duck-hanging.gif"
                        : isDummyCode() 
                          ? "/duck-lose.gif"
                          : "/duck-hanging.gif"
                  }
                  alt="Duck Challenge"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            <div className="absolute bottom-4 right-4 text-sm">
            </div>
          </div>
          
          {/* Game information */}
          <div className="p-4">
            <h2 className="text-gray-400 mb-4">⚪ The Goal</h2>
            <p className="text-sm text-gray-300 mb-6">
              {currentLevel === 1 
                ? "Your program must destroy the enemy ships by shooting the closest enemy on each turn."
                : "A duck is in peril! Write code to target and eliminate the nearest threat to save our feathered friend from certain doom!"}
            </p>

            <div className="bg-[#252525] p-4 rounded">
              <h3 className="text-sm font-medium mb-2">Console output</h3>
              <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                {consoleOutput}
              </pre>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-1/2 flex flex-col">
          {/* Language selector */}
          <div className="p-2 bg-[#252525] border-b border-gray-800">
            <select 
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="bg-[#1A1A1A] text-white px-3 py-1 rounded"
            >
              <option>Python 3</option>
              <option>Java</option>
              <option>C++</option>
            </select>
          </div>

          {/* Code editor */}
          <div className="flex-1 p-4 bg-[#1E1E1E]">
            <pre className="text-sm text-green-400 font-mono mb-4">
              {currentLevel === 1 
                ? "# CodinGame planet is being attacked by slimy insectoid aliens."
                : "# A brave duck is trapped by enemy forces! Time is running out."}
            </pre>
            <pre className="text-sm text-green-400 font-mono mb-4">
              {currentLevel === 1 
                ? "# Hint: To protect the planet, you can implement the pseudo-code provided in the statement."
                : "# Hint: Compare the distances and target the closest enemy to save our\n# feathered friend before it's too late!"}
            </pre>
            <textarea
              className="w-full h-[calc(100%-100px)] bg-transparent text-white font-mono text-sm resize-none focus:outline-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
            />
          </div>

          {/* Test cases */}
          <div className="h-[200px] bg-[#252525] p-4">
            <div className="flex justify-between items-center mb-4">
              <h3>Test cases</h3>
              <div className="flex gap-2">
                <button 
                  onClick={handlePlayTestCase}
                  className="bg-[#1A1A1A] px-4 py-1 rounded text-sm hover:bg-[#2A2A2A]"
                >
                  ▶ PLAY TESTCASE
                </button>
                <button 
                  onClick={() => checkSolution(code)}
                  className="bg-[#1A1A1A] px-4 py-1 rounded text-sm hover:bg-[#2A2A2A]"
                >
                  ▶ PLAY ALL TESTCASES
                </button>
                <button 
                  className={`px-4 py-1 rounded text-sm ${
                    testsPassed ? 'bg-green-500 text-black' : 'bg-yellow-500 text-black'
                  }`}
                >
                  {testsPassed ? '✓ PASSED' : '✓ SUBMIT'}
                </button>
              </div>
            </div>
            {/* Test cases */}
                        <div className="bg-[#1A1A1A] p-2 rounded">
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm">
                              <span>{currentLevel === 1 ? '01' : '02'}</span>
                              <span className={`${testsPassed ? 'text-green-400' : 'text-gray-400'}`}>
                                {currentLevel === 1 ? 'Imminent danger' : 'Advanced combat'} {testsPassed && '✓'}
                              </span>
                            </div>
                            {testsPassed && currentLevel === 1 && (
                              <button 
                                onClick={handleLevelProgress}
                                className="w-full bg-green-500 text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-green-400 transition-colors"
                              >
                                Continue to Level 2 →
                              </button>
                            )}
                            {currentLevel === 2 && testsPassed && (
                              <>
                                <button 
                                  onClick={() => setShowAchievement(true)}
                                  className="w-full bg-purple-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-400 transition-colors"
                                >
                                  🏆 Achievement Unlocked: Duck Savior
                                </button>
                                {showAchievement && (
                                  <Achievement 
                                    onClose={() => setShowAchievement(false)}
                                  />
                                )}
                              </>
                            )}
                          </div>
                        </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;