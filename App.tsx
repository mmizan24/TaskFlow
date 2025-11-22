import React, { useState } from 'react';
import { Plus, Layout, Search, CheckCircle, Clock, Circle } from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from './types';
import { MOCK_TASKS, STATUS_CONFIG, PRIORITY_CONFIG } from './constants';
import { TaskSidebar } from './components/TaskSidebar';
import { Button } from './components/Button';

function App() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');

  // Derived state
  const selectedTask = tasks.find(t => t.id === selectedTaskId) || null;
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handlers
  const handleAddTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: 'New Task',
      description: '',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      createdAt: Date.now(),
    };
    setTasks([newTask, ...tasks]);
    setSelectedTaskId(newTask.id);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    if (selectedTaskId === taskId) setSelectedTaskId(null);
  };

  const getStatusIcon = (status: TaskStatus) => {
    const Icon = STATUS_CONFIG[status].icon;
    return <Icon className={`w-5 h-5 ${STATUS_CONFIG[status].color}`} />;
  };

  const getPriorityIcon = (priority: TaskPriority) => {
    const Icon = PRIORITY_CONFIG[priority].icon;
    return <Icon className={`w-4 h-4 ${PRIORITY_CONFIG[priority].color}`} />;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Main Container */}
      <div className={`transition-all duration-300 ease-in-out ${selectedTaskId ? 'mr-0 md:mr-[600px]' : ''}`}>
        
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
                <Layout className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">TaskFlow AI</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center bg-slate-900 rounded-lg border border-slate-800 px-3 py-2 w-64 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                <Search className="w-4 h-4 text-slate-500 mr-2" />
                <input 
                  type="text"
                  placeholder="Search tasks..."
                  className="bg-transparent border-none outline-none text-sm w-full placeholder-slate-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleAddTask} icon={Plus}>
                New Task
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="max-w-5xl mx-auto px-6 py-8">
          
          {/* Filters */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {(['ALL', ...Object.values(TaskStatus)] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as TaskStatus | 'ALL')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  statusFilter === status 
                    ? 'bg-slate-800 text-white shadow-md shadow-slate-900/20 ring-1 ring-slate-700' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                {status === 'ALL' ? 'All Tasks' : STATUS_CONFIG[status as TaskStatus].label}
              </button>
            ))}
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 mb-4">
                  <CheckCircle className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-300">No tasks found</h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-2">Try adjusting your search or create a new task to get started.</p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`group relative bg-slate-900/50 border border-slate-800/60 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:bg-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 ${
                    selectedTaskId === task.id ? 'ring-2 ring-blue-500/50 bg-slate-800 border-slate-700' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="mt-1">
                        {getStatusIcon(task.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-semibold truncate ${task.status === TaskStatus.DONE ? 'text-slate-500 line-through decoration-slate-600' : 'text-slate-100'}`}>
                          {task.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2 h-10">
                          {task.description || "No additional notes..."}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-950 border border-slate-800`}>
                        {getPriorityIcon(task.priority)}
                        {PRIORITY_CONFIG[task.priority].label}
                      </span>
                      <span className="text-xs text-slate-600 font-mono">
                        {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {selectedTaskId && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-40"
          onClick={() => setSelectedTaskId(null)}
        />
      )}

      {/* Sidebar */}
      <TaskSidebar 
        task={selectedTask}
        isOpen={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />

    </div>
  );
}

export default App;