import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

// React unmounts the whole tree on an uncaught render error, leaving a blank
// white page with nothing but a console message — this boundary catches
// that and shows the actual error so it's diagnosable without dev tools.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white px-6 text-center">
          <p className="text-sm font-medium text-black">Si è verificato un errore.</p>
          <pre className="max-w-lg overflow-x-auto whitespace-pre-wrap border border-neutral-200 bg-neutral-50 p-4 text-left text-xs text-neutral-600">
            {this.state.error.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="border border-neutral-300 px-4 py-2 text-xs font-medium uppercase tracking-wide text-neutral-600 transition-colors hover:border-black hover:text-black"
          >
            Ricarica la pagina
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
