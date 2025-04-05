"use client";

import { useState } from "react";
import { AutogenSystem } from "./autogen.service";

// Mock data for testing
const mockDepartments = ["Urban Planning", "Transportation", "Public Works"];
const mockResources = ["Heavy Machinery", "Engineering Teams", "Survey Equipment"];
const mockGoals = ["Infrastructure Upgrade", "Traffic Flow Optimization"];

export function AutogenTest() {
  // Add this new state for tab management
  const [activeTab, setActiveTab] = useState('overview');
  
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const startCollaboration = async () => {
    setLoading(true);
    try {
      // Mock conflict data - in production this would come from your database
      const conflictData = {
        temporalConflicts: [
          { 
            departments: ["Urban Planning", "Transportation"],
            project: "Road Expansion",
            startDate: "2023-06-15",
            endDate: "2023-07-30",
            location: "Downtown District"
          }
        ],
        spatialConflicts: [
          {
            departments: ["Public Works", "Transportation"],
            project: "Utility Line Installation",
            location: "Main Street Corridor",
            overlappingArea: "2.5 km stretch"
          }
        ]
      };
      
      const autogen = new AutogenSystem({
        departments: mockDepartments,
        resources: mockResources,
        projectGoals: mockGoals,
        conflicts: conflictData // Pass conflict data to the system
      });
      
      // Update the prompt to focus on conflict resolution
      const conversation = await autogen.initiateCollaboration({
        focusArea: "conflict-resolution",
        resolutionOptions: ["reschedule", "collaborate", "resource-sharing"]
      });
      
      // Process the result to highlight recommendations
      const processedResult = {
        ...conversation,
        recommendations: extractRecommendations(conversation)
      };
      
      setResult(processedResult);
    } catch (error) {
      console.error("Autogen error:", error);
      setResult({ error: "Failed to process collaboration" });
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to extract recommendations from the AI response
  const extractRecommendations = (conversation: any) => {
    // In a real implementation, this would parse the AI response
    // For now, return mock recommendations
    return {
      temporalConflicts: [
        {
          departments: ["Urban Planning", "Transportation"],
          recommendation: "collaborate",
          reasoning: "Projects have complementary goals and resource sharing would reduce costs by 15%",
          suggestedTimeline: {
            startDate: "2023-06-20",
            endDate: "2023-07-25",
            phases: [
              { name: "Planning", duration: "1 week" },
              { name: "Implementation", duration: "4 weeks" }
            ]
          }
        }
      ],
      spatialConflicts: [
        {
          departments: ["Public Works", "Transportation"],
          recommendation: "reschedule",
          reasoning: "Simultaneous work would cause severe traffic disruption",
          suggestedTimeline: {
            original: { startDate: "2023-08-01", endDate: "2023-09-15" },
            revised: { startDate: "2023-10-01", endDate: "2023-11-15" }
          }
        }
      ]
    };
  };

  return (
    <div className="p-6 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Autogen Collaboration Test</h2>
      
      <button 
        onClick={startCollaboration}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Start Collaboration"}
      </button>
      
      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Collaboration Result:</h3>
          
          {/* Tab navigation */}
          <div className="flex border-b mb-4">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 ${activeTab === 'tasks' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
            >
              Tasks
            </button>
            <button 
              onClick={() => setActiveTab('resources')}
              className={`px-4 py-2 ${activeTab === 'resources' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
            >
              Resources
            </button>
            <button 
              onClick={() => setActiveTab('conflicts')}
              className={`px-4 py-2 ${activeTab === 'conflicts' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
            >
              Conflicts
            </button>
            {/* Add this button to the tab navigation */}
            <button 
              onClick={() => setActiveTab('recommendations')}
              className={`px-4 py-2 ${activeTab === 'recommendations' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
            >
              Recommendations
            </button>
            
            {/* Add this tab content */}
            {activeTab === 'recommendations' && result?.recommendations && (
              <div>
                <h4 className="font-medium mb-4">Conflict Resolution Recommendations</h4>
                
                <div className="space-y-6">
                  {/* Temporal Conflicts */}
                  <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Temporal Conflicts</h5>
                    {result.recommendations.temporalConflicts.map((conflict, index) => (
                      <div key={index} className="bg-white p-4 rounded shadow mb-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-medium">
                              {conflict.departments.join(" & ")}
                            </span>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded ${
                            conflict.recommendation === 'collaborate' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {conflict.recommendation === 'collaborate' ? 'Collaborate' : 'Reschedule'}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{conflict.reasoning}</p>
                        
                        <div className="border-t pt-2">
                          <div className="text-xs text-gray-500 mb-1">Suggested Timeline:</div>
                          <div className="flex text-sm">
                            <div className="mr-4">
                              <span className="text-gray-500">Start:</span> {conflict.suggestedTimeline.startDate}
                            </div>
                            <div>
                              <span className="text-gray-500">End:</span> {conflict.suggestedTimeline.endDate}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Spatial Conflicts */}
                  <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Spatial Conflicts</h5>
                    {result.recommendations.spatialConflicts.map((conflict, index) => (
                      <div key={index} className="bg-white p-4 rounded shadow mb-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-medium">
                              {conflict.departments.join(" & ")}
                            </span>
                          </div>
                          <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                            Reschedule
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{conflict.reasoning}</p>
                        
                        <div className="grid grid-cols-2 gap-4 border-t pt-2">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Original Timeline:</div>
                            <div className="text-sm">
                              {conflict.suggestedTimeline.original.startDate} to {conflict.suggestedTimeline.original.endDate}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Revised Timeline:</div>
                            <div className="text-sm font-medium text-blue-600">
                              {conflict.suggestedTimeline.revised.startDate} to {conflict.suggestedTimeline.revised.endDate}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}