"use client";

import { useState } from 'react';
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';

import { db } from '@/app/lib/firebase';
import { Task, FirestoreTimestamp } from '@/app/types/task';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const [isCompleted, setIsCompleted] = useState(task.completed);

  const toggleComplete = async () => {
    setIsCompleted(!isCompleted);
    await updateDoc(doc(db, 'tasks', task.id), {
      completed: !isCompleted,
    });
  };

  const deleteTask = async () => {
    await deleteDoc(doc(db, 'tasks', task.id));
  };

  // Format the date for display
  const formatDate = (date: Date | FirestoreTimestamp) => {
    const dateObj = date instanceof Date ? date : new Date(date.seconds * 1000);
    return dateObj.toLocaleDateString();
  };

  return (
    <li className="flex flex-col p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={toggleComplete}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className={isCompleted ? 'line-through text-gray-500' : 'font-medium'}>
            {task.title}
          </span>
        </div>
        <button
          onClick={deleteTask}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
      <div className="text-xs text-gray-500 ml-9">
        Created: {formatDate(task.createdAt)}
      </div>
    </li>
  );
}