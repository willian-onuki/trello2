'use client';
import { XCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from 'react-beautiful-dnd';

interface Props {
  todo: Todo;
  id: TypedColumn;
  index: number;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}

export default function TodoCard({
  todo,
  id,
  index,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) {
  return (
    <div
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
      className='bg-white rounded-md space-y-2 drop-shadow-md'
    >
      <div className='flex justify-between items-center p-5'>
        <p>{todo.title}</p>
        <button className='text-red-500 hover:text-red-600'>
          <XCircleIcon className='ml-5 h-8 w-8' />
        </button>
      </div>
    </div>
  );
}
