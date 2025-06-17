"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import TaskItem from '@/app/components/TaskItem';
import { Task, FirestoreTimestamp } from '@/app/types/task';

interface TaskListProps {
  groupId: string;
}

export default function TaskList({ groupId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    const q = query(
      collection(db, 'tasks'),
      where('groupId', '==', groupId)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const taskList: Task[] = [];
      querySnapshot.forEach((doc) => {
        taskList.push({ id: doc.id, ...doc.data() } as Task);
      });
      
      // Sort tasks by creation date (newest first)
      const sortedTasks = taskList.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date((a.createdAt as FirestoreTimestamp).seconds * 1000);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date((b.createdAt as FirestoreTimestamp).seconds * 1000);
        return dateB.getTime() - dateA.getTime();
      });
      
      setTasks(sortedTasks);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [groupId]);

  return (
    <div>
      {loading ? (
        <div className="p-4 text-center text-gray-500 bg-gray-100 rounded-lg animate-pulse">
          Loading tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div className="p-4 text-center text-gray-500 bg-gray-100 rounded-lg">
          No tasks yet. Add a task to get started!
        </div>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      )}
    </div>
  );
}