import { createContext, useContext } from 'react';
import { Id } from '@/convex/_generated/dataModel';

interface DepartmentContextType {
  departmentId: Id<'departments'>;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

export function useDepartmentContext() {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error('useDepartmentContext must be used within a DepartmentProvider');
  }
  return context;
}

export default DepartmentContext;
