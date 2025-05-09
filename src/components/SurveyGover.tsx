import React, { useState } from "react";

export default function WasteSurvey({open}:any) {
  const [formData, setFormData] = useState({
    stakeholder: "",
    experience: "",
    region: "",
    socialIssue: "",
    healthIntegration: "",
    policy: "",
    informalWorkers: "",
    comments: ""
  });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log(formData); // Replace with Firebase submission logic
    alert("Survey submitted. شکریہ!");
  };

  return (
    <div className="w-full h-[calc(100vh-85px)] overflow-y-auto bg-white">
      <div className="pt-10 px-5 md:px-8">
      <form className="border p-8 rounded-md ">
    <div className="p-6 w-full">
    <div className="text-center pb-8">
            <h2 className="text-xl font-bold">Survey 2: Survey on Social Sustainability in Waste Management Technologies</h2>
            <h2 className="text-xl font-bold">سروے 2: سرکاری عہدیداران، صنعت، اور ویسٹ مینجمنٹ پروفیشنلز کے لیے</h2>
          </div>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Stakeholder */}
        <div>
          <label className="font-semibold">
            Stakeholder Category (Select One) / اسٹیک ہولڈر کی قسم
          </label>
          <select name="stakeholder" value={formData.stakeholder} onChange={handleChange} className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm">
            <option value="">-- Select / منتخب کریں --</option>
            <option>Government Official / سرکاری عہدیدار</option>
            <option>Policy Maker / پالیسی ساز</option>
            <option>Waste Management Professional / ویسٹ مینجمنٹ ماہر</option>
            <option>Environmental Consultant / ماحولیاتی مشیر</option>
            <option>Industrial Representative / صنعتی نمائندہ</option>
            <option>NGO Representative / این جی او کا نمائندہ</option>
          </select>
        </div>

        {/* Experience */}
        <div>
          <label className="font-semibold">
            Years of Experience / تجربہ (سالوں میں)
          </label>
          <select name="experience" value={formData.experience} onChange={handleChange} className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm">
            <option value="">-- Select --</option>
            <option>{'<1 year'}</option>
            <option>1-5 years</option>
            <option>6-10 years</option>
            <option>10+ years</option>
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="font-semibold">Region / علاقہ</label>
          <input name="region" type="text" value={formData.region} onChange={handleChange} className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm" />
        </div>

        {/* Social Issues */}
        <div>
          <label className="font-semibold">
            Social Issues in Waste Management / ویسٹ مینجمنٹ کے سماجی مسائل
          </label>
          <select name="socialIssue" value={formData.socialIssue} onChange={handleChange} className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm">
            <option value="">-- Select --</option>
            <option>Public health risks / عوامی صحت کے خطرات</option>
            <option>Community resistance / کمیونٹی کی مزاحمت</option>
            <option>Lack of worker safety / ورکرز کی حفاظت کی کمی</option>
            <option>Unequal access / سہولیات میں عدم مساوات</option>
          </select>
        </div>

        {/* Health Integration */}
        <div>
          <label className="font-semibold">
            How should health be integrated? / صحت کو کیسے شامل کیا جائے؟
          </label>
          <select name="healthIntegration" value={formData.healthIntegration} onChange={handleChange} className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm">
            <option value="">-- Select --</option>
            <option>Health risk assessments / صحت کے خطرات کی جانچ</option>
            <option>Low-emission solutions / کم اخراج والی ٹیکنالوجیز</option>
          </select>
        </div>

        {/* Policy */}
        <div>
          <label className="font-semibold">
            Priority Policies / ترجیحی پالیسیاں
          </label>
          <select name="policy" value={formData.policy} onChange={handleChange} className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm">
            <option value="">-- Select --</option>
            <option>Subsidies for underserved areas / کم سہولت علاقوں کے لیے سبسڈی</option>
            <option>Stricter regulations / سخت ضوابط</option>
            <option>Public-private partnerships / عوامی و نجی شراکت</option>
          </select>
        </div>

        {/* Informal Workers */}
        <div>
          <label className="font-semibold">
            Should informal workers be integrated? / غیر رسمی ورکرز کو شامل کیا جائے؟
          </label>
          <select name="informalWorkers" value={formData.informalWorkers} onChange={handleChange} className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm">
            <option value="">-- Select --</option>
            <option>Yes, with wages and safety / ہاں، اجرت اور تحفظ کے ساتھ</option>
            <option>No, remain independent / نہیں، آزاد رہیں</option>
            <option>Not sure / معلوم نہیں</option>
          </select>
        </div>

        {/* Final Comments */}
        <div>
          <label className="font-semibold">
            Final Comments / آخری تبصرے
          </label>
          <textarea name="comments" value={formData.comments} onChange={handleChange} rows={4} className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm" placeholder="Write here / یہاں لکھیں..." />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Submit / جمع کریں
        </button>
      </form>
    </div>
    </form>
    </div>
    </div>
  );
}
