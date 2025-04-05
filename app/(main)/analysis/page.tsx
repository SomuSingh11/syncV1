// "use client";
// import { ProjectAnalysis } from "@/components/ai/ProjectAnalysis";
// import { Button } from "@/components/ui/button";
// import { useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useState } from "react";

import { TestProjectForm } from "@/components/analysis/DataForm";

// export default function TestAnalysisPage() {
//   const insertTestData = useMutation(api.testData.insertTestData);
//   const [testIds, setTestIds] = useState<{
//     projectId: string;
//     departmentId: string;
//   } | null>(null);

//   const handleSetupTest = async () => {
//     const ids = await insertTestData();
//     setTestIds(ids);
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">AI Analysis Test</h1>
//         <Button onClick={handleSetupTest}>Setup Test Data</Button>
//       </div>

//       {testIds ? (
//         <ProjectAnalysis
//           projectId={testIds.projectId as any}
//           departmentId={testIds.departmentId as any}
//         />
//       ) : (
//         <p>Click "Setup Test Data" to begin testing</p>
//       )}
//     </div>
//   );
// }

// import { TestDataForm } from "@/components//DataForm";

export default function TestPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Test Data</h1>
      <TestProjectForm />
    </div>
  );
}
