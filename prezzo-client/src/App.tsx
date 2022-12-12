import React, { useEffect, useState } from 'react'
import Editor from './components/Editor'
import './App.css'
import Deck from './components/Deck'
import { State } from './interfaces/interface-models'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import Presenter from './components/Presenter'
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from 'websocket'

function App() {
    const [state, set_state] = useState<State>({
        presenatation_markdown: '',
        presentation_mode: false,
        presentation_slides: [],
        presentation_uuid: uuidv4(),
        websocket: new W3CWebSocket('ws://127.0.0.1:8080/presentation_content'),
    })

    const set_presentation_markdown = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        set_state({
            ...state,
            presenatation_markdown: e.target.value,
        })
    }

    useEffect(() => {
        state.websocket.onmessage = (event: IMessageEvent) => {
            set_state((state) => ({
                ...state,
                presentation_slides: JSON.parse(event.data.toString()),
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        console.log(state.presenatation_markdown)
        if (state.websocket.readyState === 1) {
            state.websocket.send(
                JSON.stringify({
                    presentation_uuid: state.presentation_uuid,
                    text_content: state.presenatation_markdown,
                })
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.presenatation_markdown])

    const upload_image = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0]
        const form_data = new FormData()
        form_data.append('image', file)
        form_data.append('presentation_uuid', state.presentation_uuid)
        axios
            .post('http://localhost:8080/image_upload', form_data)
            .then((response) => {
                if (response.status !== 200) alert('Error uploading image..')
            })
    }

    const set_presentation_mode = () => {
        set_state({
            ...state,
            presentation_mode: !state.presentation_mode,
        })
    }

    return (
        <div className="absolute w-full h-full flex flex-row justify-start">
            {!state.presentation_mode && (
                <>
                    <Deck presentation_slides={state.presentation_slides} />
                    <Editor
                        presentation_markdown={state.presenatation_markdown}
                        set_presentation_markdown={set_presentation_markdown}
                        upload_image={upload_image}
                        start_presentation={set_presentation_mode}
                    />
                </>
            )}
            {state.presentation_mode && (
                <Presenter presentation_slides={state.presentation_slides} />
            )}
        </div>
    )
}

export default App
