import '../styles/button.css'

export default function Button({onClick}) {


    return (
        <button className="penicillin-button" onClick={onClick}>Take Penicillin</button>
    )
}