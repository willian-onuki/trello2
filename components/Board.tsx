'use client'
import { useBoardStore } from '@/store/BoardStore';
import React, { useEffect } from 'react';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import Column from './Column';

export default function Board() {
  const { getBoards, board, setBoardState, updateTodoInDB } = useBoardStore();
  useEffect(() => {
    getBoards();
  }, [getBoards]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    if (type === 'column') {
      const entries = Array.from(board.columns.entries())
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);
      setBoardState({...board, columns: rearrangedColumns});
    }

    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    const startCol = {
      id: startColIndex[0],
      todos: startColIndex[1].todos
    }

    const finishCol = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };

    if (!startCol || !finishCol) return;

    if (source.index === destination.index || startCol === finishCol) return;

    const newTodos = startCol.todos
    const [removed] = newTodos.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      newTodos.splice(destination.index, 0, removed);
      const newColumn = {
        id: startCol.id,
        todos: newTodos
      }

      const rearrangedColumn = new Map(board.columns);
      rearrangedColumn.set(startCol.id, newColumn);

      setBoardState({ ...board, columns: rearrangedColumn });
    } else {
      const finishTodos = Array.from(finishCol.todos)
      finishTodos.splice(destination.index, 0, removed);

      const newColumn = {
        id: startCol.id,
        todos: newTodos
      }

      const rearrangedColumn = new Map(board.columns);

      rearrangedColumn.set(startCol.id, newColumn);
      rearrangedColumn.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos
      })

      updateTodoInDB(removed, finishCol.id)

      setBoardState({...board, columns: rearrangedColumn})
    }
  }

  return (
    <DragDropContext
      onDragEnd={handleOnDragEnd}
    >
      <Droppable droppableId='board' direction='horizontal' type='column'>
        {(provided) => (
          <div
            className='grid grid-cols-1 md:grid-cols-3 gap-5 mx-auto max-w-7xl'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
              {
                Array.from(board.columns.entries()).map(([id, column], index) => (
                  <Column
                    key={id}
                    id={id}
                    todos={column.todos}
                    index={index}
                  />
                ))
              }
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
