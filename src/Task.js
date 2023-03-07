import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'
import './task.css';

const Task = ({taskText,onClick}) => {

  return (
    <List className='todo_List'>
      <ListItem>
        <ListItemText primary={taskText}/>
      </ListItem>
      <DeleteIcon fontSize='large' style={{opacity:0.7}} onClick={onClick}></DeleteIcon>
    </List>
  )
}

export default Task;