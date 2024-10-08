// src/components/TaskCard.js

import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const TaskCard = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className="task-card"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className="task-content">
            <p><strong>{task.content}</strong></p>
            <p>Priority: {task.priority}</p>
            <p>Deadline: {task.deadline}</p>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
