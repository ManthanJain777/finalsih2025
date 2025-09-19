// Utility for handling process cancellation across the application

export interface CancellableProcess {
  id: string;
  type: 'verification' | 'upload' | 'scan' | 'analysis' | 'monitoring';
  startTime: Date;
  onCancel: () => void;
  description: string;
}

class CancellationManager {
  private processes: Map<string, CancellableProcess> = new Map();
  private listeners: Map<string, (processes: CancellableProcess[]) => void> = new Map();

  addProcess(process: CancellableProcess): void {
    this.processes.set(process.id, process);
    this.notifyListeners();
  }

  removeProcess(id: string): void {
    this.processes.delete(id);
    this.notifyListeners();
  }

  cancelProcess(id: string): boolean {
    const process = this.processes.get(id);
    if (process) {
      try {
        process.onCancel();
        this.removeProcess(id);
        return true;
      } catch (error) {
        console.error('Error cancelling process:', error);
        return false;
      }
    }
    return false;
  }

  cancelAllProcesses(): void {
    Array.from(this.processes.values()).forEach(process => {
      try {
        process.onCancel();
      } catch (error) {
        console.error('Error cancelling process:', error);
      }
    });
    this.processes.clear();
    this.notifyListeners();
  }

  getActiveProcesses(): CancellableProcess[] {
    return Array.from(this.processes.values());
  }

  hasActiveProcesses(): boolean {
    return this.processes.size > 0;
  }

  subscribe(id: string, callback: (processes: CancellableProcess[]) => void): () => void {
    this.listeners.set(id, callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(id);
    };
  }

  private notifyListeners(): void {
    const processes = this.getActiveProcesses();
    this.listeners.forEach(callback => callback(processes));
  }
}

export const cancellationManager = new CancellationManager();

// Hook for React components to use cancellation manager
import { useState, useEffect } from 'react';

export function useCancellableProcesses() {
  const [processes, setProcesses] = useState<CancellableProcess[]>([]);

  useEffect(() => {
    const unsubscribe = cancellationManager.subscribe('hook', setProcesses);
    setProcesses(cancellationManager.getActiveProcesses());
    
    return unsubscribe;
  }, []);

  const addProcess = (process: Omit<CancellableProcess, 'id'>) => {
    const fullProcess: CancellableProcess = {
      ...process,
      id: crypto.randomUUID(),
    };
    cancellationManager.addProcess(fullProcess);
    return fullProcess.id;
  };

  const cancelProcess = (id: string) => {
    return cancellationManager.cancelProcess(id);
  };

  const cancelAllProcesses = () => {
    cancellationManager.cancelAllProcesses();
  };

  return {
    processes,
    addProcess,
    cancelProcess,
    cancelAllProcesses,
    hasActiveProcesses: processes.length > 0
  };
}

// Utility function to create timeout with cancellation
export function createCancellableTimeout(
  callback: () => void,
  delay: number
): { cancel: () => void; promise: Promise<void> } {
  let timeoutId: NodeJS.Timeout;
  let cancelled = false;

  const promise = new Promise<void>((resolve) => {
    timeoutId = setTimeout(() => {
      if (!cancelled) {
        callback();
        resolve();
      }
    }, delay);
  });

  const cancel = () => {
    cancelled = true;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  return { cancel, promise };
}

// Utility for cancellable fetch requests
export function createCancellableFetch(
  url: string,
  options?: RequestInit
): { cancel: () => void; promise: Promise<Response> } {
  const controller = new AbortController();
  
  const promise = fetch(url, {
    ...options,
    signal: controller.signal,
  });

  const cancel = () => {
    controller.abort();
  };

  return { cancel, promise };
}