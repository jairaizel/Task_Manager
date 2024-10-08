// src/components/TaskManager.js

import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import TaskColumn from './TaskColumn';
import { v4 as uuidv4 } from 'uuid';

const TaskManager = () => {
  const initialData = {
    tasks: {
      task1: { id: 'task1', content: 'Build Task Manager', priority: 'High', deadline: '2024-10-01' },
      task2: { id: 'task2', content: 'Learn Drag and Drop', priority: 'Medium', deadline: '2024-10-05' },
      task3: { id: 'task3', content: 'Finish Project', priority: 'Low', deadline: '2024-10-10' },
    },
    columns: {
      'to-do': {
        id: 'to-do',
        title: 'To Do',
        taskIds: ['task1', 'task2', 'task3'],
      },
      'in-progress': {
        id: 'in-progress',
        title: 'In Progress',
        taskIds: [],
      },
      'done': {
        id: 'done',
        title: 'Done',
        taskIds: [],
      },
    },
    columnOrder: ['to-do', 'in-progress', 'done'],
  };

  const [taskData, setTaskData] = useState(initialData);
  const [newTask, setNewTask] = useState({ content: '', priority: '', deadline: '' });

  useEffect(() => {
    const storedData = localStorage.getItem('taskManagerData');
    if (storedData) {
      setTaskData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('taskManagerData', JSON.stringify(taskData));
  }, [taskData]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startColumn = taskData.columns[source.droppableId];
    const finishColumn = taskData.columns[destination.droppableId];

    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      setTaskData((prevData) => ({
        ...prevData,
        columns: {
          ...prevData.columns,
          [newColumn.id]: newColumn,
        },
      }));
    } else {
      const startTaskIds = Array.from(startColumn.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...startColumn,
        taskIds: startTaskIds,
      };

      const finishTaskIds = Array.from(finishColumn.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finishColumn,
        taskIds: finishTaskIds,
      };

      setTaskData((prevData) => ({
        ...prevData,
        columns: {
          ...prevData.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      }));
    }
  };

  const handleNewTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const taskId = uuidv4();
    const newTaskData = {
      id: taskId,
      content: newTask.content,
      priority: newTask.priority,
      deadline: newTask.deadline,
    };

    setTaskData((prevData) => ({
      ...prevData,
      tasks: {
        ...prevData.tasks,
        [taskId]: newTaskData,
      },
      columns: {
        ...prevData.columns,
        'to-do': {
          ...prevData.columns['to-do'],
          taskIds: [...prevData.columns['to-do'].taskIds, taskId],
        },
      },
    }));

    setNewTask({ content: '', priority: '', deadline: '' });
  };

  return (
    <div>
      <h1>Comprehensive Task Manager</h1>

      <form onSubmit={handleAddTask}>
        <input
          type="text"
          name="content"
          value={newTask.content}
          onChange={handleNewTaskChange}
          placeholder="Task Description"
          required
        />
        <input
          type="text"
          name="priority"
          value={newTask.priority}
          onChange={handleNewTaskChange}
          placeholder="Priority (High, Medium, Low)"
          required
        />
        <input
          type="date"
          name="deadline"
          value={newTask.deadline}
          onChange={handleNewTaskChange}
          required
        />
        <button type="submit">Add Task</button>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          {taskData.columnOrder.map((columnId) => {
            const column = taskData.columns[columnId];
            const tasks = column.taskIds.map((taskId) => taskData.tasks[taskId]);

            return <TaskColumn key={column.id} column={column} tasks={tasks} />;
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskManager;
