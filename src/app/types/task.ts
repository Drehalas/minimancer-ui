export interface Task {
    id: string;
    title: string;
    completed: boolean;
    createdAt: Date | FirestoreTimestamp;
    groupId: string;
  }
  
  export interface FirestoreTimestamp {
    seconds: number;
    nanoseconds: number;
  }