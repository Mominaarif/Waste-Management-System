import AddData from '@/components/AddData'
import Header from '@/components/Header'
import CommunitySurveyForm from '@/components/SurveyCommunity'
import WasteSurvey from '@/components/SurveyGover'

function  SurveyGoverPage({open, setOpen}:any) {
  const title = "Survey Community Residents"
  return (
    <div className="w-full h-full">
        <Header setOpen={setOpen} open={open} title={title}/>
        <WasteSurvey open={open} />
    </div>
  )
}

export default  SurveyGoverPage