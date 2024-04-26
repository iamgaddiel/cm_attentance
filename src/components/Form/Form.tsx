import { IonButton, IonCol, IonGrid, IonIcon, IonInput, IonRow, IonText, useIonLoading, useIonModal, useIonToast } from '@ionic/react'
import React, { useEffect, useRef, useState } from 'react'
import Color from '../../constants/Color'
import { checkmark, chevronForward, close, warning } from 'ionicons/icons'
import { Config } from '../../configs/settings'
import Confirmation from '../Confirmation'
import useDisplayModal from '../../hooks/useDisplayModal'
import { encodeString, getTimestamp, isAfterCertainHour, isBeforeCertainHour } from '../../helpers/utils'
import { isBefore, isFriday, isMonday, isSaturday, isSunday, isThursday, isTuesday, isWednesday } from 'date-fns'






const BEFORE_MEETING_ERR_MSG = "You can't sign in. Meeting starts by 4:30PM"
const AFTER_MEETING_ERR_MSG = "You can't sign in. Meeting ended by 5:30PM"
const BEFORE_CHURCH_ERR_MSG = "You can't sign in. Prayers start by 4:00PM and Service starts by 5:00PM"
const AFTER_CHURCH_ERR_MSG = "You can't sign in. Church ended by 7PM"


const Form: React.FC = () => {
    const [code, setCode] = useState('')
    const [memberName, setMemberName] = useState('')
    const inputRef = useRef<HTMLIonInputElement>(null)


    const [presentToast, dismissToast] = useIonToast()
    const [presentLoading, dismissLoading] = useIonLoading()
    const [presentModal, dismissModal] = useIonModal(Confirmation, {
        name: memberName,
        dismiss: () => dismissModal()
    })



    const { sbClient } = Config()




    async function handleCheckIn() {
        await presentLoading({
            message: 'Signing you in...',
            spinner: 'bubbles',
        })

        if (code === '') {
            await dismissLoading()
            presentToast({
                color: 'danger',
                position: 'bottom',
                duration: 4000,
                message: 'Code can not be empty',
                icon: warning,
                swipeGesture: 'vertical',
                mode: 'ios'
            })
            return
        }

        // Check if user ID Exits
        const { name, isFound } = await userIDExits(code)
        if (!isFound) return; //if user is not found
        setMemberName(name!)



        // check if today is a service day
        const currentTimestamp = getTimestamp()

        const isApprovedForMeetingSignIn = await checkServiceAndMeetingTime(currentTimestamp) // check it's server or meeting time
        if (!isApprovedForMeetingSignIn) return; // not approved for meeting signing


        const { signedIn, encodedString, error } = await isSignedIn(name!)
        if (signedIn) return; // if user has signed in for service/meeting already
        if (!Object.is(error, null)) { //network or server error check
            await dismissLoading()
            displayToast(error!, 'danger')
            return
        }

        // Create Attendance record
        await sbClient
            .from('attendance')
            .insert([
                { name, pass: encodedString },
            ])
            .select()


        await dismissLoading()
        await presentModal({
            onWillDismiss: (e) => {
                inputRef.current!.value = '';
                setMemberName('')
            }
        })
    }


    /**
     * 
     * @param name 
     * @description check if user has signed in today
     * @returns 
     */
    async function isSignedIn(name: string): Promise<{ signedIn: boolean, encodedString: null | string, error: null | string }> {

        try {
            // day,month,year are appended to the end of the encoded string so daily "pass" value is unique
            const day = new Date().getDate()
            const month = new Date().getMonth() + 1
            const year = new Date().getFullYear()
            const encodedString = encodeString(name) + `${day}${month}${year}`

            let { data: attendance, error: userSignedInTodayError } = await sbClient
                .from('attendance')
                .select('name')
                .eq('pass', encodedString)


            // User attendance found
            if (attendance!.length > 0) {
                await dismissLoading()
                displayToast("You have signed in today", 'danger')
                return { signedIn: true, encodedString, error: null };
            }

            return { signedIn: false, encodedString, error: null } 

        } catch (error) {
            const errorMsg = "There's a Server/Network issue"
            return { signedIn: false, encodedString: null, error: errorMsg }
        }
    }


    /**
     * 
     * @param id 
     * @returns 
     */
    async function userIDExits(id: string): Promise<{ name: string | null, isFound: boolean, }> {

        // Check if ID exists
        let { data: members, error: userIDExistError } = await sbClient
            .from('members')
            .select('name, created_at')
            .eq('_id', code)

        // ID does not exist
        if (members?.length === 0) {
            await dismissLoading()
            displayToast('Invalid attendance code', 'danger')
            return { name: null, isFound: false }
        }

        return { name: members![0].name, isFound: true }
    }


    /**
     * 
     * @param timestamp 
     * @returns 
     */
    async function checkServiceAndMeetingTime(timestamp: string) {
        if (isThursday(timestamp) || isMonday(timestamp)) {
            await dismissLoading()
            displayToast("Today is not a service or meeting day", 'danger')
            return false
        }

        // check if it's service time
        //SUNDAY CHECK
        if (isSunday(timestamp) && isBeforeCertainHour(timestamp, 7, 0)) {
            await dismissLoading()
            displayToast("You can't sign in. Church starts by 7:00AM", 'danger')
            return false
        }
        if (isSunday(timestamp) && isAfterCertainHour(timestamp, 11, 0)) {
            await dismissLoading()
            displayToast("You can't sign in. Church ended by 12:15PM", 'danger')
            return false
        }


        //TUESDAY CHECK
        if (isTuesday(timestamp) && isBeforeCertainHour(timestamp, 16, 30)) {
            await dismissLoading()
            displayToast(BEFORE_MEETING_ERR_MSG, 'danger')
            return false
        }
        if (isTuesday(timestamp) && isAfterCertainHour(timestamp, 18, 0)) {
            await dismissLoading()
            displayToast(AFTER_MEETING_ERR_MSG, 'danger')
            return false
        }

        //WEDNESDAY CHECK
        if (isWednesday(timestamp) && isBeforeCertainHour(timestamp, 16, 0)) {
            await dismissLoading()
            displayToast(BEFORE_CHURCH_ERR_MSG, 'danger')
            return false
        }
        if (isWednesday(timestamp) && isAfterCertainHour(timestamp, 18, 0)) {
            await dismissLoading()
            displayToast(AFTER_CHURCH_ERR_MSG, 'danger')
            return false
        }

        //FRIDAY CHECK
        if (isFriday(timestamp) && isBeforeCertainHour(timestamp, 16, 0)) {
            await dismissLoading()
            displayToast(BEFORE_CHURCH_ERR_MSG, 'danger')
            return false
        }
        if (isFriday(timestamp) && isAfterCertainHour(timestamp, 18, 0)) {
            await dismissLoading()
            displayToast(AFTER_CHURCH_ERR_MSG, 'danger')
            return false
        }

        //SATURDAY CHECK
        if (isSaturday(timestamp) && isBeforeCertainHour(timestamp, 16, 30)) {
            await dismissLoading()
            displayToast(BEFORE_MEETING_ERR_MSG, 'danger')
            return false
        }
        if (isSaturday(timestamp) && isAfterCertainHour(timestamp, 17, 30)) {
            await dismissLoading()
            displayToast(AFTER_MEETING_ERR_MSG, 'danger')
            return false
        }
        return true
    }


    /**
     * 
     * @param message 
     * @param color 
     */
    function displayToast(message: string, color: 'danger' | 'success' | 'warning') {
        presentToast({
            color,
            position: 'bottom',
            duration: 4000,
            message,
            icon: color === 'success' ? checkmark : warning,
            swipeGesture: 'vertical',
            mode: 'ios'
        })
    }

    return (
        <form style={formContainer}>
            <IonGrid>
                <IonRow className='ion-justify-content-center'>
                    <IonCol size='12' sizeMd='9'>
                        <IonInput
                            placeholder='CM-YVB-234'
                            label='Attendance code'
                            labelPlacement='floating'
                            color={'dark'}
                            autoFocus
                            autofocus
                            style={input}
                            ref={inputRef}
                            onKeyUp={(e) => setCode(e.currentTarget.value as string)}
                        />
                    </IonCol>
                </IonRow>
                <IonRow className='ion-justify-content-end'>
                    <IonCol size='12' sizeMd='3' sizeLg='2'>
                        <IonButton
                            className='ion-margin-top'
                            fill='default'
                            color={'primary'}
                            mode='ios'
                            expand='block'
                            size='large'
                            style={btn}
                            onClick={handleCheckIn}
                        >
                            <IonText style={{ color: Color.light }}>Sign In</IonText>
                            <IonIcon icon={chevronForward} slot='end' color='light' />
                        </IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </form>
    )
}

export default Form

const formContainer = {
    display: 'flex',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2rem'
}

const input = {
    fontSize: '1.5em'
}

const btn = {
    '--background': Color.dark
}

/**
 * Don't spend your money with the mindset that someone is there to bail me out
 * GADDIEL! have a monthly budget and stick to it strickly.
 * If you don't do this how will you have for others to glean on.
 *
 * Prosperity is first from the heart. Peforming your pourpose is prosperity.
 */
