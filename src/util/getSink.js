import xs from 'xstream'

export function getSink(mapper) {
  return function(sinks$) {
    return sinks$
      .map((sinks) => {
        let sink
        if (typeof mapper === 'string') {
          sink = sinks[mapper]
        } else if (typeof mapper === 'function') {
          sink = mapper(sinks)
        } else {
          throw new Error('the mapper must be either a string or a function')
        }
        return sink || xs.create()
      })
      .flatten()
  }
}
