import { IonButton, IonCol, IonContent, IonFooter, IonGrid, IonImg, IonRow, IonText, IonToolbar } from '@ionic/react'
import React, { useEffect } from 'react'
import image from '../assets/images/check.gif'



type Props = {
    dismiss: () => void
    name: string
}

const Confirmation: React.FC<Props> = ({ dismiss, name }) => {


    useEffect(() => {
        
    },[])

    async function handleCloseModal() {
        dismiss()
    }


    return (
        <>
            <IonContent className='ion-padding'>
                <IonGrid fixed>
                    <IonRow className='ion-justify-content-center'>
                        <IonCol size='4'>
                            <IonImg src={image} />
                        </IonCol>
                    </IonRow>
                    <IonRow className='ion-justify-content-center ion-text-center'>
                        <IonCol size='12'>
                            <h4>Congrats!</h4>
                            <h2>{name}</h2>
                            <IonText className='ion-margin-top'>You've successfully Signed In for today's service</IonText>
                        </IonCol>

                    </IonRow>
                </IonGrid>
            </IonContent>
            <IonFooter className='ion-no-border ion-padding-horizontal'>
                <IonToolbar>
                    <IonCol>
                        <IonButton
                            color={'dark'}
                            expand='block'
                            mode='ios'
                            size='large'
                            className='ion-margin-top'
                            onClick={handleCloseModal}
                        >
                            Close
                        </IonButton>
                    </IonCol>
                </IonToolbar>
            </IonFooter>
        </>
    )
}

export default Confirmation