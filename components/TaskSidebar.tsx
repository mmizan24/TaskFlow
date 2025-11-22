import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, AIAssistanceType } from '../types';
import { X, Sparkles, Save, Trash2, Calendar } from 'lucide-react';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../constants';
import { Button } from './Button';
import { assistWithTask } from '../services/geminiService';

interface TaskSidebarProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskSidebar: React.FC<TaskSidebarProps> = ({ 
  task, 
  isOpen, 
  onClose, 
  onUpdate,
  onDelete 
}) => {
  // Local state to manage form inputs before saving or while editing
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Sync local state when the selected task changes
  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  if (!task || !editedTask) return null;

  const handleInputChange = (field: keyof Task, value: any) => {
    setEditedTask(prev => {
      if (!prev) return null;
      const updated = { ...prev, [field]: value };
      onUpdate(updated); // Auto-save to parent on change for smoother UX
      return updated;
    });
  };

  const handleAiAssist = async (type: AIAssistanceType) => {
    if (!editedTask) return;
    setIsAiLoading(true);
    try {
      const result = await assistWithTask(editedTask, type);
      
      if (type === 'IMPROVE_CLARITY') {
        // This assumes the AI returns a structured suggestion, but for simplicity 
        // we'll just append it or replace. Here we append to notes for safety.
        handleInputChange('description', editedTask.description + '\n\n--- AI Suggested Improvement ---\n' + result);
      } else {
        handleInputChange('description', editedTask.description + '\n\n' + result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Classes for the sliding panel
  const sidebarClasses = `fixed inset-y-0 right-0 w-full md:w-[600px] bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 transform transition-transform duration-300 ease-in-out z-50 ${
    isOpen ? 'translate-x-0' : 'translate-x-full'
  }`;

  return (
    <div className={sidebarClasses}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Calendar className="w-4 h-4" />
          <span>Created {new Date(editedTask.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
           <Button 
            variant="danger" 
            size="sm" // custom prop handling if extended, but utilizing className for size here
            className="p-2 h-8 w-8 !px-0"
            onClick={() => {
              if(window.confirm('Are you sure you want to delete this task?')) {
                onDelete(editedTask.id);
                onClose();
              }
            }}
          >
            <Trash2 className="w-4 h-4 !mr-0" />
          </Button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
        
        {/* Title */}
        <input
          type="text"
          value={editedTask.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full bg-transparent text-2xl font-bold text-white placeholder-slate-600 focus:outline-none border-none p-0 mb-6"
          placeholder="Task Title"
        />

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
            <div className="relative">
              <select
                value={editedTask.status}
                onChange={(e) => handleInputChange('status', e.target.value as TaskStatus)}
                className="w-full appearance-none bg-slate-800 border border-slate-700 text-slate-200 rounded-lg py-2.5 px-4 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.values(TaskStatus).map(s => (
                  <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</label>
            <div className="relative">
              <select
                value={editedTask.priority}
                onChange={(e) => handleInputChange('priority', e.target.value as TaskPriority)}
                className="w-full appearance-none bg-slate-800 border border-slate-700 text-slate-200 rounded-lg py-2.5 px-4 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.values(TaskPriority).map(p => (
                  <option key={p} value={p}>{PRIORITY_CONFIG[p].label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* AI Tools */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-3 text-indigo-400 font-medium text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Gemini AI Assistant</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              className="text-xs py-1.5 bg-slate-900/50"
              onClick={() => handleAiAssist('SUGGEST_SUBTASKS')}
              isLoading={isAiLoading}
            >
              Suggest Subtasks
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="text-xs py-1.5 bg-slate-900/50"
              onClick={() => handleAiAssist('EXPAND_NOTES')}
              isLoading={isAiLoading}
            >
              Expand Notes
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="text-xs py-1.5 bg-slate-900/50"
              onClick={() => handleAiAssist('IMPROVE_CLARITY')}
              isLoading={isAiLoading}
            >
              Improve Clarity
            </Button>
          </div>
        </div>

        {/* Notes Area */}
        <div className="space-y-3 h-[calc(100%-400px)] min-h-[300px]">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Notes</label>
          <textarea
            value={editedTask.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full h-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-slate-300 placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none leading-relaxed font-mono text-sm"
            placeholder="Type your notes here... Markdown is supported by your imagination."
          />
        </div>
      </div>
    </div>
  );
};
