import { Routes, Route } from 'react-router-dom'
import PhoneFrame from './components/PhoneFrame.jsx'
import RequireProfile from './components/RequireProfile.jsx'

import Splash from './screens/01_Splash.jsx'
import LanguageSelect from './screens/02_LanguageSelect.jsx'
import Login from './screens/03_Login.jsx'
import OtpVerify from './screens/04_OtpVerify.jsx'
import ProfileSteps from './screens/05_ProfileSteps.jsx'
import PersonalDetails from './screens/06_PersonalDetails.jsx'
import EducationDetails from './screens/07_EducationDetails.jsx'
import OccupationDetails from './screens/08_OccupationDetails.jsx'
import AdditionalDetails from './screens/09_AdditionalDetails.jsx'
import Dashboard from './screens/10_Dashboard.jsx'
import Recommendations from './screens/11_Recommendations.jsx'
import SchemeDetails from './screens/12_SchemeDetails.jsx'
import Chatbot from './screens/13_Chatbot.jsx'
import Assistant from './screens/14_Assistant.jsx'
import Profile from './screens/15_Profile.jsx'

export default function App() {
  return (
    <PhoneFrame>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/language" element={<LanguageSelect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OtpVerify />} />
        <Route path="/profile-steps" element={<ProfileSteps />} />
        <Route path="/profile/personal" element={<PersonalDetails />} />
        <Route path="/profile/education" element={<EducationDetails />} />
        <Route path="/profile/occupation" element={<OccupationDetails />} />
        <Route path="/profile/additional" element={<AdditionalDetails />} />
        <Route path="/dashboard" element={<RequireProfile><Dashboard /></RequireProfile>} />
        <Route path="/schemes" element={<RequireProfile><Recommendations /></RequireProfile>} />
        <Route path="/scheme/:id" element={<SchemeDetails />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/chatbot/:id" element={<Chatbot />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/me" element={<RequireProfile><Profile /></RequireProfile>} />
      </Routes>
    </PhoneFrame>
  )
}
