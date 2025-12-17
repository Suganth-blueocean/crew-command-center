import { Task } from './types';

export const availableTasks: Task[] = [
  {
    id: 'fetch_code',
    name: 'Fetch Code',
    description: 'Fetches code from Github based on provided requirements',
    icon: '📥',
  },
  {
    id: 'analyze_code',
    name: 'Code Analyzer',
    description: 'Analyzes code to identify issues and suggest improvements',
    icon: '🔎',
  },
  {
    id: 'send_notification',
    name: 'Notifier',
    description: 'Sends notifications via Google chat',
    icon: '🔔',
  },
  {
    id: 'create_ticket',
    name: 'Ticket creator',
    description: 'Creates github issues based on alert details',
    icon: '🐞',
  },
  // {
  //   id: 'reviewer',
  //   name: 'Quality Reviewer',
  //   description: 'Reviews and validates outputs for accuracy and quality',
  //   icon: '✅',
  // },
  // {
  //   id: 'translator',
  //   name: 'Translator',
  //   description: 'Translates content between multiple languages accurately',
  //   icon: '🌐',
  // },
  // {
  //   id: 'summarizer',
  //   name: 'Summarizer',
  //   description: 'Creates concise summaries of long-form content',
  //   icon: '📝',
  // },
  // {
  //   id: 'scheduler',
  //   name: 'Task Scheduler',
  //   description: 'Orchestrates and schedules tasks for optimal execution',
  //   icon: '📅',
  // },
];
