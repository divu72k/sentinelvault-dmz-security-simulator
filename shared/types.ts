export interface DemoItem {
  id: string;
  name: string;
  value: number;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type StepStatus = 'pending' | 'processing' | 'success' | 'error';
export interface SimulationStep {
  id: string;
  nodeName: string;
  status: StepStatus;
  message: string;
  timestamp: string;
}
export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  identity: string;
  result: 'SUCCESS' | 'DENIED' | 'FAILED';
  details?: string;
}
export interface SimulationState {
  isActive: boolean;
  currentStepIndex: number;
  steps: SimulationStep[];
}