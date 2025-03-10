export interface CommandExecutor {
  execute(command: string): Promise<ExecutionResult>;
  validateCommand(command: string): ValidationResult;
  abort(commandId: string): void;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  code?: number;
}

export interface ValidationResult {
  isValid: boolean;
  risks: CommandRisk[];
  message?: string;
}

export interface CommandRisk {
  level: RiskLevel;
  description: string;
  mitigation?: string;
}

export enum RiskLevel {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
} 