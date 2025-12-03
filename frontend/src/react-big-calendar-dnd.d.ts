declare module 'react-big-calendar/lib/addons/dragAndDrop' {
  import { Calendar } from 'react-big-calendar';
  import { ComponentType } from 'react';

  export interface DragAndDropCalendarProps {
    onEventDrop?: (args: any) => void;
    onEventResize?: (args: any) => void;
    resizable?: boolean;
    selectable?: boolean;
  }

  export default function withDragAndDrop<T = any>(
    calendar: typeof Calendar
  ): ComponentType<T & DragAndDropCalendarProps>;
}
