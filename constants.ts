import { TaskPriority, TaskStatus } from "./types";
import { Circle, Clock, CheckCircle2, AlertCircle, ArrowUp, ArrowDown, Minus } from "lucide-react";
import React from "react";

export const MOCK_TASKS = [
  {
    id: '1',
    title: 'Review Q3 Financial Reports',
    description: 'Analyze the discrepancy in the marketing budget vs actual spend. \n\nKey points to check:\n- September ad spend\n- Agency fees\n- Software subscriptions',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    createdAt: Date.now() - 10000000,
  },
  {
    id: '2',
    title: 'Update Team Documentation',
    description: 'The onboarding guide is outdated. Need to add the new Gemini API integration steps.',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    createdAt: Date.now() - 5000000,
  },
  {
    id: '3',
    title: 'Schedule Client Meeting',
    description: '',
    status: TaskStatus.DONE,
    priority: TaskPriority.LOW,
    createdAt: Date.now() - 20000000,
  }
];

export const STATUS_CONFIG = {
  [TaskStatus.TODO]: { label: 'To Do', icon: Circle, color: 'text-slate-400', bg: 'bg-slate-400/10' },
  [TaskStatus.IN_PROGRESS]: { label: 'In Progress', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  [TaskStatus.DONE]: { label: 'Done', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
};

export const PRIORITY_CONFIG = {
  [TaskPriority.HIGH]: { label: 'High', icon: ArrowUp, color: 'text-rose-400' },
  [TaskPriority.MEDIUM]: { label: 'Medium', icon: Minus, color: 'text-amber-400' },
  [TaskPriority.LOW]: { label: 'Low', icon: ArrowDown, color: 'text-slate-400' },
};
