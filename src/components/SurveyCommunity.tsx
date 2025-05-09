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
    // {
    //   eng: "",
    //   urdu: "",
    //   engOp: [],
    //   urduOp: [],
    // },
    // {
    //   eng: "",
    //   urdu: "",
    //   engOp: [],
    //   urduOp: [],
    // },
    // {
    //   eng: "",
    //   urdu: "",
    //   engOp: [],
    //   urduOp: [],
    // },
    // {
    //   eng: "",
    //   urdu: "",
    //   engOp: [],
    //   urduOp: [],
    // },
    // {
    //   eng: "",
    //   urdu: "",
    //   engOp: [],
    //   urduOp: [],
    // },
    // {
    //   eng: "",
    //   urdu: "",
    //   engOp: [],
    //   urduOp: [],
    // },
    // {
    //   eng: "",
    //   urdu: "",
    //   engOp: [],
    //   urduOp: [],
    // },
    // {
    //   eng: "",
    //   urdu: "",
    //   engOp: [],
    //   urduOp: [],
    // },
    // {
    //   eng: "",
    //   urdu: "",
    //   engOp: [],
    //   urduOp: [],
    // },
    // {
    //   eng: "",
    //   urdu: "",
    //   engOp: [],
    //   urduOp: [],
    // },
    // {
    //   eng: "",
    //   urdu: "",
    //   engOp: [],
    //   urduOp: [],
    // },
    // {
    //   eng: "",
    //   urdu: "",
    //   engOp: [],
    //   urduOp: [],
    // },
    // {
    //   eng: "",
    //   urdu: "",
    //   engOp: [],
    //   urduOp: [],
    // },
    // {
    //   eng: "",
    //   urdu: "",
    //   engOp: [],
    //   urduOp: [],
    // },
    // {
    //   eng: "",
    //   urdu: "",
    //   engOp: [],
    //   urduOp: [],
    // },
  ];

  return (
    <div className="w-full h-[calc(100vh-85px)] overflow-y-auto bg-white">
      <div className="pt-10 px-5 md:px-8">
        <form className="border p-8 rounded-md ">
          <div className="text-center">
            <h2 className="text-xl font-bold">Survey 1: Community Residents</h2>
            <h2 className="text-xl font-bold">سروے 1: کمیونٹی کے رہائشیوں کے لیے</h2>
          </div>
          <div className="text-base font-bold flex justify-between items-center mt-4 mb-2">
            <h2 className="">
              Survey on Community Perception of Waste Management Technologies
            </h2>
            <h2 className="">کچرا مینجمنٹ ٹیکنالوجیز پر کمیونٹی کے خیالات کا سروے</h2>
          </div>
          <div className=" flex flex-col justify-center mt-4 mb-2">
            <div className="">
              <p className="text-base font-bold">Objective:</p>   <h2>
                This survey aims to understand community perspectives on{" "}
                <strong>
                  waste management practices, health impacts, public participation,
                  and social acceptance{" "}
                </strong>
                of low-carbon waste technologies.
              </h2>
            </div>
            <div className="text-right">
              <p className="text-base font-bold">:مقصد</p>
              <h2 className="">
                یہ سروے ویسٹ مینجمنٹ پریکٹسز، صحت کے اثرات، عوامی شرکت، اور کم کاربن
                ویسٹ ٹیکنالوجیز کی سماجی قبولیت کو سمجھنے کے لیے کیا جا رہا ہے۔
              </h2>

            </div>
          </div>


          {/* General Info */}
          <div className="font-bold mb-8">
            <label className="">1. General Information / عمومی معلومات</label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="font-semibold">i. Name (Optional) / نام (اختیاری):</label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
              />
            </div>
            <div>
              <label className="font-semibold">ii. Location / مقام: </label>
              <input
                type="text"
                name="location"
                onChange={handleChange}
                className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
              />
            </div>
          </div>
          <div>
            <label className="font-semibold">iii. Age Group / عمر کی حد:</label>
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
            <label className="font-semibold">iv. Educational Background / تعلیمی پس منظر: </label>
            {[
              "No Formal Education / کوئی رسمی تعلیم نہیں",
              "Primary / ابتدائی تعلیم",
              "Secondary / ثانوی تعلیم",
              "Higher Education / اعلیٰ تعلیم"

              // "No Formal Education",
              // "Primary",
              // "Secondary",
              // "Higher Education",
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
            <label className="font-semibold">v. Employment Status / روزگار کی حیثیت: </label>
            {[

              "Employed / ملازمت شدہ",
              "Self-employed / خود مختار",
              "Unemployed / بے روزگار",
              "Student / طالب علم",
              "Retired / ریٹائرڈ"

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
          <div className="font-bold my-8">
            <label className="">2. Public Health & Waste Management / صحت عامہ اور کچرا مینجمنٹ</label>
          </div>
          <div>
            <label className="font-semibold">vi. Have you or anyone in your area experienced health issues due to improper waste disposal? / کیا آپ یا آپ کے علاقے میں کسی کو کچرے کے ناقص انتظام کی وجہ سے صحت کے مسائل کا سامنا ہوا ہے؟ </label>
            {["Yes / ہاں", "No / نہیں", "Not sure / معلوم نہیں"].map((opt) => (
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
            <label className="font-semibold">vii. Which health risks are most common in your area? / آپ کے علاقے میں سب سے زیادہ عام صحت کے مسائل کون سے ہیں؟ </label>
            {[
              "Respiratory issues (سانس کی بیماریاں)", " Waterborne diseases (پانی سے پیدا ہونے والی بیماریاں)", " Skin infections (جلد کی بیماریاں)", "Vector-borne diseases (ڈینگی، ملیریا وغیرہ)", "No major health issues (کوئی بڑا مسئلہ نہیں)",
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
            <label className="font-semibold">viii. How do you currently dispose of your household waste? / آپ اپنے گھریلو کچرے کو کیسے ٹھکانے لگاتے ہیں؟ </label>
            {[
              "Municipal waste collection / میونسپل ویسٹ کلیکشن", "Open dumping / کھلے عام کچرا پھینکنا", "Burning waste / کچرا جلانا", "Composting / کمپوسٹنگ", "Recycling / ری سائیکلنگ"
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
              <label>Other (Please specify) / (براہ کرم وضاحت کریں) دیگر: </label>
              <input
                type="text"
                name="wasteDisposalOther"
                onChange={handleChange}
                className="block w-1/2 border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
              />
            </div>
          </div>
          {/* Community Engagement */}
          <div className="font-bold my-8">
            <label className="">3. Community Engagement & Awareness / کمیونٹی کی شمولیت اور آگاہی</label>
          </div>
          <div>
            <label className="font-semibold">ix. Are you aware of waste segregation and recycling practices? / کیا آپ کچرے کی علیحدگی اور ری سائیکلنگ کے بارے میں جانتے ہیں؟ </label>
            {[
              "Yes, and I practice it",
              "Yes, but I do not practice it",
              "No",
              "Yes, and I practice it / ہاں، اور میں اس پر عمل کرتا ہوں", "Yes, but I do not practice it / ہاں، لیکن میں اس پر عمل نہیں کرتا", "No / نہیں", 
              



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
            <label className="font-semibold">x.	What would encourage you to separate waste at home? / کون سے عوامل آپ کو گھر میں کچرے کی علیحدگی پر آمادہ کر سکتے ہیں؟</label>
            {[
              // "Awareness programs",
              // "Financial incentives",
              // "More waste bins",
              // "Strict regulations",
              // "Door-to-door waste collection",
              "Awareness programs (آگاہی پروگرامز)", 
              "Financial incentives (مالی فوائد)", 
              "More waste bins (زیادہ کوڑے دان)", 
              "Strict regulations (سخت قوانین)", 
              "Door-to-door waste collection (گھر گھر کچرا اٹھانے کی سہولت)",
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
            <label>Other (Please specify) / (براہ کرم وضاحت کریں) دیگر: </label>
            <input
                type="text"
                name="encourageOther"
                onChange={handleChange}
                className="block w-1/2 border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
              />
            </div>
          </div>
          <div>
            <label className="font-semibold">xi. Do you think the government provides adequate waste collection and recycling services? / کیا آپ کو لگتا ہے کہ حکومت مناسب کچرا کلیکشن اور ری سائیکلنگ کی خدمات فراہم کر رہی ہے؟</label>
            {[
             "Yes / ہاں",
              "No / نہیں",
              "Not sure / معلوم نہیں",
              "Services exist but are not efficient / خدمات موجود ہیں لیکن موثر نہیں ہیں",
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
          <div className="font-bold my-8">
            <label className="">4. Cultural & Social Acceptance / ثقافتی اور سماجی قبولیت</label>
          </div>
          <div>
            <label className="font-semibold">xii.	Are there any cultural beliefs affecting waste disposal in your area? / کیا آپ کے علاقے میں کچرا ٹھکانے لگانے کے حوالے سے کوئی ثقافتی عقائد موجود ہیں؟</label>
            {[
              "Yes / ہاں",
              "No / نہیں",
              "Not sure / معلوم نہیں",
            ].map((opt) => (
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
            <label className="font-semibold">xiii.	Would you support new waste management technologies that reduce carbon footprint? / کیا آپ کم کاربن ویسٹ مینجمنٹ ٹیکنالوجیز کی حمایت کریں گے؟</label>
            {[
              "Yes / ہاں",
              "No / نہیں",
              "Not sure / معلوم نہیں",
              "Only if they are cost-effective / صرف اگر یہ لاگت مؤثر ہوں",
            ].map(
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
          <div className="font-bold my-8">
            <label className="">5. Additional Comments / اضافی تبصرے</label>
          </div>
          <div>
            <label className="font-semibold">xiv.	What improvements would you like to see in your area’s waste management system? / آپ اپنے علاقے کے کچرا مینجمنٹ نظام میں کیا بہتری دیکھنا چاہتے ہیں؟</label>
            <textarea
              name="improvements"
              onChange={handleChange}
              className="block w-1/2 border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
          >
                      Submit / جمع کریں

          </button>
        </form>
      </div>
    </div>
  );
};

export default CommunitySurveyForm;
