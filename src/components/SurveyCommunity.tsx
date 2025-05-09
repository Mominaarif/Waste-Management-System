import React, { useState } from "react";

const CommunitySurveyForm = ({ open }: any) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    ageGroup: "",
    education: "",
    employment: "",
    healthIssue: "",
    healthRisks: [] as string[],
    wasteDisposal: [] as string[],
    wasteDisposalOther: "",
    awareOfRecycling: "",
    encourageFactors: [] as string[],
    encourageOther: "",
    govtServices: "",
    culturalBeliefs: "",
    supportTech: "",
    improvements: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setFormData((prev) => {
        const updated = checked
          ? [...(prev as any)[name], value]
          : (prev as any)[name].filter((v: string) => v !== value);
        return { ...prev, [name]: updated };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  //   "Public Health & Waste Management"
  //  "صحت عامہ اور کچرا مینجمنٹ"

  const Content = [
    {
      id: "q1",
      eng: "Age Group",
      urdu: "عمر کی حد",
      engOp: ["18-30", " 31-45", " 46-60", "60+"],
      urduOp: ["18-30", " 31-45", " 46-60", "60+"],
    },
    {
      id: "q2",
      eng: "Educational Background ",
      urdu: "تعلیمی پس منظر",
      engOp: [
        "No Formal Education",
        "Primary",
        "Secondary",
        "Higher Education",
      ],
      urduOp: [
        "کوئی رسمی تعلیم نہیں",
        " ابتدائی تعلیم",
        "ثانوی تعلیم",
        "اعلیٰ تعلیم",
      ],
    },
    {
      id: "q3",
      eng: "Employment Status",
      urdu: " روزگار کی حیثیت",
      engOp: ["	Employed", "Self-employed", "Unemployed", "Student", "Retired"],
      urduOp: ["ملازمت شدہ", "خود مختار", "بے روزگار", "طالب علم", "ریٹائرڈ"],
    },
    {
      id: "q4",
      eng:
        "Have you or anyone in your area experienced health issues due to improper waste disposal?",
      urdu:
        "کیا آپ یا آپ کے علاقے میں کسی کو کچرے کے ناقص انتظام کی وجہ سے صحت کے مسائل کا سامنا ہوا ہے؟ ",
      engOp: ["Yes", "No", "Not sure"],
      urduOp: ["ہاں", "نہیں", "معلوم نہیں"],
    },
    {
      id: "q5",
      eng: "Which health risks are most common in your area?",
      urdu: "آپ کے علاقے میں سب سے زیادہ عام صحت کے مسائل کون سے ہیں؟",
      engOp: [
        "Respiratory issues",
        "Waterborne diseases",
        "Skin infections",
        "Vector-borne diseases",
        "No major health issues",
      ],
      urduOp: [
        "سانس کی بیماریاں",
        "پانی سے پیدا ہونے والی بیماریاں",
        "جلد کی بیماریاں",
        "ڈینگی، ملیریا وغیرہ",
        "کوئی بڑا مسئلہ نہیں",
      ],
    },
    {
      eng: "",
      urdu: "",
      engOp: [],
      urduOp: [],
    },
    {
      eng: "",
      urdu: "",
      engOp: [],
      urduOp: [],
    },
    {
      eng: "",
      urdu: "",
      engOp: [],
      urduOp: [],
    },
    {
      eng: "",
      urdu: "",
      engOp: [],
      urduOp: [],
    },
    {
      eng: "",
      urdu: "",
      engOp: [],
      urduOp: [],
    },
    {
      eng: "",
      urdu: "",
      engOp: [],
      urduOp: [],
    },
    {
      eng: "",
      urdu: "",
      engOp: [],
      urduOp: [],
    },
    {
      eng: "",
      urdu: "",
      engOp: [],
      urduOp: [],
    },
    {
      eng: "",
      urdu: "",
      engOp: [],
      urduOp: [],
    },
    {
      eng: "",
      urdu: "",
      engOp: [],
      urduOp: [],
    },
    {
      eng: "",
      urdu: "",
      engOp: [],
      urduOp: [],
    },
    {
      eng: "",
      urdu: "",
      engOp: [],
      urduOp: [],
    },
    {
      eng: "",
      urdu: "",
      engOp: [],
      urduOp: [],
    },
    {
      eng: "",
      urdu: "",
      engOp: [],
      urduOp: [],
    },
    {
      eng: "",
      urdu: "",
      engOp: [],
      urduOp: [],
    },
  ];

  return (
    <div className="w-full h-[calc(100vh-85px)] overflow-y-auto bg-white">
      <div className="pt-10 px-5 md:px-8">
        <form className="border p-8 rounded-md ">
          <h2 className="text-xl font-bold">Survey 1: Community Residents</h2>
          <h2>
            Survey on Community Perception of Waste Management Technologies
          </h2>
          <h2></h2>Objective / مقصد:
          <h2>
            {" "}
            This survey aims to understand community perspectives on{" "}
            <strong>
              waste management practices, health impacts, public participation,
              and social acceptance{" "}
            </strong>
            of low-carbon waste technologies.
          </h2>
          <h2 className=" text-right">
            یہ سروے ویسٹ مینجمنٹ پریکٹسز، صحت کے اثرات، عوامی شرکت، اور کم کاربن
            ویسٹ ٹیکنالوجیز کی سماجی قبولیت کو سمجھنے کے لیے کیا جا رہا ہے۔
          </h2>
          {/* General Info */}
          <div>
            <label>Name (Optional):</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
            />
          </div>
          <div>
            <label>Location:</label>
            <input
              type="text"
              name="location"
              onChange={handleChange}
              className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
            />
          </div>
          <div>
            <label>Age Group:</label>
            {["18-30", "31-45", "46-60", "60+"].map((age) => (
              <div key={age}>
                <input
                  type="radio"
                  name="ageGroup"
                  value={age}
                  onChange={handleChange}
                />{" "}
                {age}
              </div>
            ))}
          </div>
          <div>
            <label>Educational Background:</label>
            {[
              "No Formal Education",
              "Primary",
              "Secondary",
              "Higher Education",
            ].map((edu) => (
              <div key={edu}>
                <input
                  type="radio"
                  name="education"
                  value={edu}
                  onChange={handleChange}
                />{" "}
                {edu}
              </div>
            ))}
          </div>
          <div>
            <label>Employment Status:</label>
            {[
              "Employed",
              "Self-employed",
              "Unemployed",
              "Student",
              "Retired",
            ].map((emp) => (
              <div key={emp}>
                <input
                  type="radio"
                  name="employment"
                  value={emp}
                  onChange={handleChange}
                />{" "}
                {emp}
              </div>
            ))}
          </div>
          {/* Public Health & Waste Management */}
          <div>
            <label>Health issues due to waste?</label>
            {["Yes", "No", "Not sure"].map((opt) => (
              <div key={opt}>
                <input
                  type="radio"
                  name="healthIssue"
                  value={opt}
                  onChange={handleChange}
                />{" "}
                {opt}
              </div>
            ))}
          </div>
          <div>
            <label>Common health risks (Select all that apply):</label>
            {[
              "Respiratory issues",
              "Waterborne diseases",
              "Skin infections",
              "Vector-borne diseases",
              "No major health issues",
            ].map((risk) => (
              <div key={risk}>
                <input
                  type="checkbox"
                  name="healthRisks"
                  value={risk}
                  onChange={handleChange}
                />{" "}
                {risk}
              </div>
            ))}
          </div>
          <div>
            <label>How do you dispose household waste?</label>
            {[
              "Municipal waste collection",
              "Open dumping",
              "Burning waste",
              "Composting",
              "Recycling",
            ].map((method) => (
              <div key={method}>
                <input
                  type="checkbox"
                  name="wasteDisposal"
                  value={method}
                  onChange={handleChange}
                />{" "}
                {method}
              </div>
            ))}
            <div>
              <label>Other:</label>
              <input
                type="text"
                name="wasteDisposalOther"
                onChange={handleChange}
                className="block border p-2 mt-1"
              />
            </div>
          </div>
          {/* Community Engagement */}
          <div>
            <label>Awareness of recycling?</label>
            {[
              "Yes, and I practice it",
              "Yes, but I do not practice it",
              "No",
            ].map((resp) => (
              <div key={resp}>
                <input
                  type="radio"
                  name="awareOfRecycling"
                  value={resp}
                  onChange={handleChange}
                />{" "}
                {resp}
              </div>
            ))}
          </div>
          <div>
            <label>What would encourage you to separate waste?</label>
            {[
              "Awareness programs",
              "Financial incentives",
              "More waste bins",
              "Strict regulations",
              "Door-to-door waste collection",
            ].map((enc) => (
              <div key={enc}>
                <input
                  type="checkbox"
                  name="encourageFactors"
                  value={enc}
                  onChange={handleChange}
                />{" "}
                {enc}
              </div>
            ))}
            <div>
              <label>Other:</label>
              <input
                type="text"
                name="encourageOther"
                onChange={handleChange}
                className="block border p-2 mt-1"
              />
            </div>
          </div>
          <div>
            <label>Does the government provide adequate services?</label>
            {[
              "Yes",
              "No",
              "Not sure",
              "Services exist but are not efficient",
            ].map((ans) => (
              <div key={ans}>
                <input
                  type="radio"
                  name="govtServices"
                  value={ans}
                  onChange={handleChange}
                />{" "}
                {ans}
              </div>
            ))}
          </div>
          {/* Social Acceptance */}
          <div>
            <label>Are there cultural beliefs affecting disposal?</label>
            {["Yes", "No", "Not sure"].map((opt) => (
              <div key={opt}>
                <input
                  type="radio"
                  name="culturalBeliefs"
                  value={opt}
                  onChange={handleChange}
                />{" "}
                {opt}
              </div>
            ))}
          </div>
          <div>
            <label>Support low-carbon technologies?</label>
            {["Yes", "No", "Not sure", "Only if they are cost-effective"].map(
              (opt) => (
                <div key={opt}>
                  <input
                    type="radio"
                    name="supportTech"
                    value={opt}
                    onChange={handleChange}
                  />{" "}
                  {opt}
                </div>
              )
            )}
          </div>
          <div>
            <label>Improvements you want to see:</label>
            <textarea
              name="improvements"
              onChange={handleChange}
              className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommunitySurveyForm;
