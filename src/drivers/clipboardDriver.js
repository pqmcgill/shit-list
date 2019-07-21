export default function clipboardDriver(sink$) {
  sink$.subscribe({
    next: sink => {
      if (typeof sink !== 'string') {
        throw new Error('clipboard driver: sink needs to be a string. instead got: ', sink)
      } else {
        navigator.clipboard.writeText(sink);
      }
    }
  })
}