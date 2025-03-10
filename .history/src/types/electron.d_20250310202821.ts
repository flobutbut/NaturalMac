declare module 'electron' {
  export * from 'electron'
}

interface Window {
  electronAPI: {
    executeCommand: (command: string) => Promise<any>;
    platform: string;
  }
} 