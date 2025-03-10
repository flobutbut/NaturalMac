export interface Command {
  id: string;
  input: string;
  generatedCommand: string;
  output?: string;
  status: CommandStatus;
  timestamp: Date;
  type: CommandType;
}

export enum CommandStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  CONFIRMING = 'confirming',
  EXECUTING = 'executing',
  COMPLETED = 'completed',
  ERROR = 'error'
}

export enum CommandType {
  FILE = 'file',
  SYSTEM = 'system',
  MEDIA = 'media',
  NETWORK = 'network',
  PRODUCTIVITY = 'productivity'
} 