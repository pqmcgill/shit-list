# Domain Model

## EventLog<a name="eventlog"></a>
* events: Array<[Event](#event)>

## Event<a name="event"></a>
* loggedBy: String *name*
* entryTime: DateTime
* panic: Boolean *default=false*
* notes: String

## TimedEvent<a name="#timedevent"></a> extends [Event](#event)
* startEventTime: DateTime
* endEventTime: DateTime

## StaticEvent<a name="staticevent"></a> extends [Event](#event)
* eventTime: DateTime

## BreastFeedingEvent<a name="breastfeedingevent"></a> extends [TimedEvent](#timedevent)
* leftBreastDuration: Int *milliseconds*
* rightBreastDuration: Int *milliseconds*
