import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import itLocale from '@fullcalendar/core/locales/it'
import type { EventClickArg } from '@fullcalendar/core'
import { toEndDate, toStartDate } from '../../lib/date'
import type { LessonRequest } from '../../types'

export function OwnerCalendar({
  requests,
  onSelect,
}: {
  requests: LessonRequest[]
  onSelect: (id: string) => void
}) {
  const events = requests.map((r) => ({
    id: r.id,
    title: r.username,
    start: toStartDate(r.requestedDate, r.requestedTime),
    end: toEndDate(r.requestedDate, r.requestedTime),
    classNames: [`status-${r.status}`],
  }))

  function handleEventClick(arg: EventClickArg) {
    onSelect(arg.event.id)
  }

  return (
    <div className="owner-calendar">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek',
        }}
        locales={[itLocale]}
        locale="it"
        firstDay={1}
        height="auto"
        events={events}
        eventClick={handleEventClick}
      />
    </div>
  )
}
