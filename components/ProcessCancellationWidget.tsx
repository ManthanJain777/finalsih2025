import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useCancellableProcesses } from '../utils/cancellation';
import { X, AlertTriangle, Clock, StopCircle } from 'lucide-react';
import { toast } from 'sonner';

export function ProcessCancellationWidget() {
  const { processes, cancelProcess, cancelAllProcesses } = useCancellableProcesses();

  if (processes.length === 0) {
    return null;
  }

  const handleCancelProcess = (id: string, description: string) => {
    const success = cancelProcess(id);
    if (success) {
      toast.success(`Cancelled: ${description}`);
    } else {
      toast.error(`Failed to cancel: ${description}`);
    }
  };

  const handleCancelAll = () => {
    const processCount = processes.length;
    cancelAllProcesses();
    toast.success(`Cancelled ${processCount} active process${processCount > 1 ? 'es' : ''}`);
  };

  const getProcessIcon = (type: string) => {
    switch (type) {
      case 'verification':
        return '🔐';
      case 'upload':
        return '📤';
      case 'scan':
        return '📷';
      case 'analysis':
        return '🔍';
      case 'monitoring':
        return '👁️';
      default:
        return '⚙️';
    }
  };

  const getElapsedTime = (startTime: Date) => {
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    
    if (elapsed < 60) {
      return `${elapsed}s`;
    } else if (elapsed < 3600) {
      return `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`;
    } else {
      return `${Math.floor(elapsed / 3600)}h ${Math.floor((elapsed % 3600) / 60)}m`;
    }
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 p-4 shadow-lg border-2 border-orange-200 bg-orange-50 z-50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <span className="text-sm font-medium text-orange-900">
            Active Processes ({processes.length})
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancelAll}
          className="text-orange-700 hover:text-orange-900 hover:bg-orange-100"
        >
          <StopCircle className="h-4 w-4 mr-1" />
          Cancel All
        </Button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {processes.map((process) => (
          <div
            key={process.id}
            className="flex items-center justify-between p-2 bg-white rounded border border-orange-200"
          >
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <span className="text-lg">{getProcessIcon(process.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {process.description}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {process.type}
                  </Badge>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{getElapsedTime(process.startTime)}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCancelProcess(process.id, process.description)}
              className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 h-6 w-6"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2 border-t border-orange-200">
        <p className="text-xs text-orange-700">
          Click "Cancel All" to stop all processes or use individual cancel buttons.
        </p>
      </div>
    </Card>
  );
}