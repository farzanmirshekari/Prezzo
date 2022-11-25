import React from 'react'
import { Presentation_Slide } from '../interfaces/interface-models'
import Slide from './Slide'

interface Props {
    presentation_slides: Presentation_Slide[]
}

function Deck({ presentation_slides }: Props) {
    return (
        <div className="relative w-7/12 h-full overflow-y-scroll slide_deck">
            {presentation_slides.map((slide, index) => {
                return (
                    <Slide key={index} header={slide.title} body={slide.body} />
                )
            })}
        </div>
    )
}

export default Deck
