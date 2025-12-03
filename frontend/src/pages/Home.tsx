import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, Views, SlotInfo } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'moment/locale/ja';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { Card, Modal, Form, Input, DatePicker, Select, message, Button, Tag, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { equipmentService } from '../services/equipmentService';
import { masterService } from '../services/masterService';
import { EquipmentUsageHistory, Equipment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import JA from '../constants/ja';

moment.locale('ja');
const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId: string;
  booking: EquipmentUsageHistory;
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [resources, setResources] = useState<{ resourceId: string; resourceTitle: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date; resourceId?: string } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [form] = Form.useForm();
  const [equipments, setEquipments] = useState<Equipment[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load all bookings
      const bookingsResponse = await equipmentService.getAllBookings();

      // Load all equipments
      const equipmentsResponse = await masterService.getEquipments(1, 100);

      if (equipmentsResponse.success) {
        const equipmentsList = equipmentsResponse.data.items;
        setEquipments(equipmentsList);

        // Set resources (equipments as columns)
        const resourcesList = equipmentsList.map(eq => ({
          resourceId: eq.id,
          resourceTitle: eq.name,
        }));
        setResources(resourcesList);

        // Convert bookings to calendar events
        if (bookingsResponse.success) {
          const calendarEvents: CalendarEvent[] = bookingsResponse.data.map(booking => ({
            id: booking.id,
            title: `${booking.equipmentName} - ${booking.userName}`,
            start: new Date(booking.startDate),
            end: new Date(booking.endDate),
            resourceId: booking.equipmentId,
            booking,
          }));
          setEvents(calendarEvents);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      message.error(JA.error.networkError);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    if (slotInfo.resourceId) {
      setSelectedSlot({
        start: slotInfo.start as Date,
        end: slotInfo.end as Date,
        resourceId: slotInfo.resourceId as string,
      });

      const equipment = equipments.find(eq => eq.id === slotInfo.resourceId);
      form.setFieldsValue({
        equipmentId: slotInfo.resourceId,
        equipmentName: equipment?.name,
        dateRange: [dayjs(slotInfo.start as Date), dayjs(slotInfo.end as Date)],
      });

      setSelectedEvent(null);
      setModalVisible(true);
    }
  }, [equipments, form]);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setModalVisible(true);
  }, []);

  const handleEventDrop = async ({ event, start, end, resourceId }: any) => {
    try {
      const updatedEvent = { ...event, start, end, resourceId };

      // Update the booking via API
      await equipmentService.updateBooking(event.id, {
        equipmentId: resourceId || event.resourceId,
        startDate: new Date(start).toISOString(),
        endDate: new Date(end).toISOString(),
      } as any);

      // Update local state
      const updatedEvents = events.map(evt =>
        evt.id === event.id ? updatedEvent : evt
      );
      setEvents(updatedEvents);
      message.success(JA.booking.updateSuccess);
    } catch (error) {
      console.error('Error updating booking:', error);
      message.error(JA.error.networkError);
    }
  };

  const handleEventResize = async ({ event, start, end }: any) => {
    try {
      const updatedEvent = { ...event, start, end };

      // Update the booking via API
      await equipmentService.updateBooking(event.id, {
        startDate: new Date(start).toISOString(),
        endDate: new Date(end).toISOString(),
      } as any);

      // Update local state
      const updatedEvents = events.map(evt =>
        evt.id === event.id ? updatedEvent : evt
      );
      setEvents(updatedEvents);
      message.success(JA.booking.updateSuccess);
    } catch (error) {
      console.error('Error updating booking:', error);
      message.error(JA.error.networkError);
    }
  };

  const handleCreateBooking = async () => {
    try {
      const values = await form.validateFields();
      const [startDate, endDate] = values.dateRange;

      await equipmentService.createBooking({
        equipmentId: values.equipmentId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        purpose: values.purpose,
      });

      message.success(JA.booking.bookingSuccess);
      setModalVisible(false);
      form.resetFields();
      loadData();
    } catch (error) {
      console.error('Error creating booking:', error);
      message.error(JA.error.networkError);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await equipmentService.deleteBooking(bookingId);
      message.success(JA.booking.deleteSuccess);
      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error('Error deleting booking:', error);
      message.error(JA.error.networkError);
    }
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3174ad';

    switch (event.booking.status) {
      case 'pending':
        backgroundColor = '#1890ff';
        break;
      case 'approved':
        backgroundColor = '#52c41a';
        break;
      case 'rejected':
        backgroundColor = '#ff4d4f';
        break;
      case 'completed':
        backgroundColor = '#8c8c8c';
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  const formats = {
    timeGutterFormat: 'HH:mm',
    eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
    agendaTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
  };

  const messages = {
    today: JA.calendar.today,
    previous: JA.common.previous,
    next: JA.common.next,
    month: JA.calendar.month,
    week: JA.calendar.week,
    day: JA.calendar.day,
    agenda: JA.calendar.agenda,
    date: '日付',
    time: '時間',
    event: '予約',
    noEventsInRange: JA.calendar.noEvents,
  };

  return (
    <div style={{ height: 'calc(100vh - 100px)' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>
          <CalendarOutlined /> {JA.home.equipmentSchedule}
        </Title>
        <div>
          <Tag color="blue">{JA.booking.pending}</Tag>
          <Tag color="green">{JA.booking.approved}</Tag>
          <Tag color="red">{JA.booking.rejected}</Tag>
          <Tag color="default">{JA.booking.completed}</Tag>
        </div>
      </div>

      <Card style={{ height: 'calc(100% - 60px)' }}>
        <DragAndDropCalendar
          localizer={localizer}
          events={events}
          resources={resources}
          resourceIdAccessor="resourceId"
          resourceTitleAccessor="resourceTitle"
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.DAY}
          views={[Views.DAY, Views.WEEK]}
          step={60}
          showMultiDayTimes
          selectable
          resizable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          eventPropGetter={eventStyleGetter}
          formats={formats}
          messages={messages}
          style={{ height: '100%' }}
          min={new Date(0, 0, 0, 6, 0, 0)}
          max={new Date(0, 0, 0, 22, 0, 0)}
        />
      </Card>

      {/* Booking Modal */}
      <Modal
        title={selectedEvent ? JA.booking.bookingDetail : JA.booking.createBooking}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedEvent(null);
          form.resetFields();
        }}
        footer={
          selectedEvent ? [
            user?.role === 'Admin' && selectedEvent.booking.status === 'pending' && (
              <Button
                key="approve"
                type="primary"
                onClick={() => {
                  equipmentService.approveBooking(selectedEvent.id).then(() => {
                    message.success(JA.booking.approveSuccess);
                    setModalVisible(false);
                    loadData();
                  });
                }}
              >
                {JA.booking.approve}
              </Button>
            ),
            (user?.id === selectedEvent.booking.userId || user?.role === 'Admin') && (
              <Button
                key="delete"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: JA.booking.deleteConfirm,
                    onOk: () => handleDeleteBooking(selectedEvent.id),
                  });
                }}
              >
                {JA.common.delete}
              </Button>
            ),
            <Button key="cancel" onClick={() => setModalVisible(false)}>
              {JA.common.cancel}
            </Button>,
          ] : [
            <Button key="cancel" onClick={() => setModalVisible(false)}>
              {JA.common.cancel}
            </Button>,
            <Button key="submit" type="primary" onClick={handleCreateBooking}>
              {JA.booking.createBooking}
            </Button>,
          ]
        }
      >
        {selectedEvent ? (
          <div>
            <p><strong>{JA.booking.equipment}:</strong> {selectedEvent.booking.equipmentName}</p>
            <p><strong>{JA.booking.bookedBy}:</strong> {selectedEvent.booking.userName}</p>
            <p><strong>{JA.booking.startDate}:</strong> {dayjs(selectedEvent.booking.startDate).format('YYYY/MM/DD HH:mm')}</p>
            <p><strong>{JA.booking.endDate}:</strong> {dayjs(selectedEvent.booking.endDate).format('YYYY/MM/DD HH:mm')}</p>
            <p><strong>{JA.booking.purpose}:</strong> {selectedEvent.booking.purpose}</p>
            <p><strong>{JA.booking.status}:</strong> <Tag color={
              selectedEvent.booking.status === 'approved' ? 'green' :
              selectedEvent.booking.status === 'pending' ? 'blue' :
              selectedEvent.booking.status === 'rejected' ? 'red' : 'default'
            }>{
              selectedEvent.booking.status === 'approved' ? JA.booking.approved :
              selectedEvent.booking.status === 'pending' ? JA.booking.pending :
              selectedEvent.booking.status === 'rejected' ? JA.booking.rejected :
              JA.booking.completed
            }</Tag></p>
          </div>
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item
              name="equipmentId"
              label={JA.booking.equipment}
              rules={[{ required: true, message: JA.error.required }]}
            >
              <Select placeholder={JA.booking.selectEquipment}>
                {equipments.map(eq => (
                  <Select.Option key={eq.id} value={eq.id}>
                    {eq.name} ({eq.category})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="dateRange"
              label={`${JA.calendar.startTime} - ${JA.calendar.endTime}`}
              rules={[{ required: true, message: JA.error.required }]}
            >
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY/MM/DD HH:mm"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="purpose"
              label={JA.booking.purpose}
              rules={[{ required: true, message: JA.error.required }]}
            >
              <Input.TextArea rows={4} placeholder={JA.booking.purpose} />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Home;
