import type { CommandExecutor, ExecutionResult, ValidationResult } from '@/types/executor'
import { RiskLevel } from '@/types/executor'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

export class MacOSCommandExecutor implements CommandExecutor {
  private activeCommands: Map<string, AbortController> = new Map()

  async execute(command: string): Promise<ExecutionResult> {
    const validation = this.validateCommand(command)
    
    if (!validation.isValid) {
      return {
        success: false,
        output: '',
        error: validation.message
      }
    }

    try {
      const { stdout, stderr } = await execAsync(command)
      
      return {
        success: !stderr,
        output: stdout,
        error: stderr || undefined,
        code: stderr ? 1 : 0
      }
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }

  validateCommand(command: string): ValidationResult {
    const risks = []
    
    // Vérification des commandes dangereuses
    if (command.includes('rm -rf') || command.includes('sudo')) {
      risks.push({
        level: RiskLevel.HIGH,
        description: 'Commande potentiellement dangereuse détectée',
        mitigation: 'Évitez d\'utiliser rm -rf ou sudo directement'
      })
    }

    // Vérification des chemins sensibles
    if (command.includes('/etc') || command.includes('/usr')) {
      risks.push({
        level: RiskLevel.MEDIUM,
        description: 'Accès à des répertoires système',
        mitigation: 'Assurez-vous d\'avoir les permissions nécessaires'
      })
    }

    // Vérification des commandes de réseau
    if (command.includes('curl') || command.includes('wget')) {
      risks.push({
        level: RiskLevel.LOW,
        description: 'Commande réseau détectée',
        mitigation: 'Vérifiez l\'URL source avant l\'exécution'
      })
    }

    const hasHighRisk = risks.some(risk => risk.level === RiskLevel.HIGH)

    return {
      isValid: !hasHighRisk,
      risks,
      message: hasHighRisk ? 'Commande non autorisée pour des raisons de sécurité' : undefined
    }
  }

  abort(commandId: string): void {
    const controller = this.activeCommands.get(commandId)
    if (controller) {
      controller.abort()
      this.activeCommands.delete(commandId)
    }
  }
} 