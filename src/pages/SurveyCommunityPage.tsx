import AddData from '@/components/AddData'
import Header from '@/components/Header'
import CommunitySurveyForm from '@/components/SurveyCommunity'

function  SurveyCommPage({open, setOpen}:any) {
  const title = "Survey Community Residents"
  return (
    <div className="w-full h-full">
        <Header setOpen={setOpen} open={open} title={title}/>
        <CommunitySurveyForm open={open} />
    </div>
  )
}

export default  SurveyCommPage