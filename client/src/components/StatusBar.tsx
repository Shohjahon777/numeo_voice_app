interface StatusBarProps {
    isConnected: boolean;
    isListening: boolean
}


const StatusBar = ({isConnected, isListening}: StatusBarProps) => {
  return (
    <div className="status-bar">
        <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}/>
        <span>{isConnected ? 'Server connected' : 'Disconnected'}</span>

        {isListening && (
            <span className="listening-indicator">
                <span className="pulse" />
                Listening ...
            </span> 
        )

        }
    </div>
  )
}

export default StatusBar