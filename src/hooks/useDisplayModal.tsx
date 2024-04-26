import { ReactComponentOrElement, useIonModal } from '@ionic/react'
import React, { useState } from 'react'



type Element = ReactComponentOrElement

const useDisplayModal = () => {
    const [component, setComponent] = useState<Element>()
    const [name, setName] = useState('')

    const [presentModal, dismissModal] = useIonModal(component!, {
        name,
        dismiss: (data: string | number | null, role: 'confirm' | 'close') => dismissModal(data, role)
    })


    function setModal(component: ReactComponentOrElement){
        setComponent(component)
    }

    return {
        setComponent,
        setName,
        presentModal,
        setModal
    }
}

export default useDisplayModal