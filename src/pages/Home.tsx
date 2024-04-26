import { IonContent, IonFooter, IonHeader, IonImg, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import Form from '../components/Form/Form';
import Logo from '../assets/images/CITYMEDIA logo.png'


const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader className='ion-no-border'>
        <IonToolbar mode='ios'>
          <IonTitle>ATTENDO</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='ion-padding'>
        <Form />
      </IonContent>
      <IonFooter className='ion-text-center ion-no-border'>
        <IonToolbar>
          <div style={logoWrapper}>
            <IonImg src={Logo} style={logo} />
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Home;

const logoWrapper = {
  width: '120px',
  height: 'auto',
  margin: 'auto'
}

const logo = {
  width: '100%',
  height: 'auto'
}