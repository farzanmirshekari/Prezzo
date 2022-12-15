import React from 'react'
import { Presentation_Slide } from '../interfaces/interface-models'
import Slide from './Slide'

interface Props {
    presentation_slides: Presentation_Slide[],
    current_slide_index: number
}

function Presenter({ presentation_slides, current_slide_index }: Props) {
    return (
        <div className="relative w-full h-full aspect-video presenter">
            {
                // eslint-disable-next-line array-callback-return
                presentation_slides.map((slide, index) => {
                    if (index === current_slide_index) {
                        return (
                            <Slide
                                header={slide.header}
                                key={index}
                                body={slide.body}
                                image={slide.image}
                                styles={slide.styles}
                            />
                        )
                    }
                })
            }
        </div>
    )
}

export default Presenter
