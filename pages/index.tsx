import { useState } from 'react';
import Head from 'next/head';
import { countries } from '../data/locations';

interface EmailTemplate {
  id: string;
  content: string;
}

interface Campaign {
  industry: string;
  country: string;
  city: string;
  templates: EmailTemplate[];
  abTestingEnabled: boolean;
  emailsPerDay: number;
  minInterval: number;
  maxInterval: number;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
}

interface TestEmailData {
  email: string;
  companyName: string;
  companyInfo: string;
  contactName: string;
  website: string;
}

export default function Home() {
  const [campaign, setCampaign] = useState<Campaign>({
    industry: '',
    country: 'world',
    city: 'All',
    templates: [{ id: '1', content: '' }],
    abTestingEnabled: false,
    emailsPerDay: 25,
    minInterval: 3,
    maxInterval: 6,
    startTime: '09:00',
    endTime: '21:00',
    startDate: '',
    endDate: ''
  });

  const [testEmail, setTestEmail] = useState<TestEmailData>({
    email: '',
    companyName: 'Example Corp',
    companyInfo: 'A leading software company specializing in innovative solutions',
    contactName: 'John Smith',
    website: 'https://example-corp.com'
  });

  const selectedCountry = countries.find(c => c.code === campaign.country);
  const isWorldSelected = campaign.country === 'world';

  const updateTemplate = (id: string, content: string) => {
    setCampaign(prev => ({
      ...prev,
      templates: prev.templates.map(t => t.id === id ? { ...t, content } : t)
    }));
  };

  const handleSendTest = async () => {
    if (!testEmail.email.trim()) {
      alert('Please enter a test email address');
      return;
    }
    
    if (campaign.templates.length === 0 || !campaign.templates[0].content.trim()) {
      alert('Please create an email template first');
      return;
    }

    alert(`Test email would be sent to ${testEmail.email}!`);
  };

  return (
    <>
      <Head>
        <title>Email Campaign Dashboard</title>
        <meta name="description" content="Professional email campaign management dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-blue-100 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Email Campaign Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Professional email campaign management with advanced targeting and verification
            </p>
          </div>

          {/* Three Card Layout */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Card 1: Campaign Setup */}
            <div className="bg-white rounded-lg shadow-lg border">
              <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                <h2 className="text-xl font-bold">Campaign Setup</h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Industry */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Target Industry</label>
                  <input
                    type="text"
                    value={campaign.industry}
                    onChange={(e) => setCampaign(prev => ({ ...prev, industry: e.target.value }))}
                    placeholder="e.g., SaaS, E-commerce, Healthcare"
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Target Location</label>
                  <select
                    value={campaign.country}
                    onChange={(e) => setCampaign(prev => ({ 
                      ...prev, 
                      country: e.target.value,
                      city: countries.find(c => c.code === e.target.value)?.cities[0] || 'All'
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  
                  {selectedCountry && !isWorldSelected && (
                    <select
                      value={campaign.city}
                      onChange={(e) => setCampaign(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded mt-2"
                    >
                      {selectedCountry.cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Email Template */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Template</label>
                  <textarea
                    value={campaign.templates[0]?.content || ''}
                    onChange={(e) => updateTemplate('1', e.target.value)}
                    placeholder="Hi [company name], I noticed [company info]..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                  />
                </div>

                {/* Settings */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Emails per Day</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={campaign.emailsPerDay}
                    onChange={(e) => setCampaign(prev => ({ 
                      ...prev, 
                      emailsPerDay: Math.min(50, Math.max(1, parseInt(e.target.value) || 1))
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Verification */}
            <div className="bg-white rounded-lg shadow-lg border">
              <div className="bg-green-600 text-white p-4 rounded-t-lg">
                <h2 className="text-xl font-bold">Campaign Verification</h2>
              </div>
              
              <div className="p-6">
                <button className="w-full bg-green-600 text-white py-3 px-4 rounded mb-6 font-bold">
                  Verify Campaign
                </button>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded p-4">
                    <div className="font-bold text-gray-800">Companies Found</div>
                    <div className="text-sm text-gray-600">Ready to verify</div>
                  </div>
                  <div className="border border-gray-200 rounded p-4">
                    <div className="font-bold text-gray-800">Companies Within Location</div>
                    <div className="text-sm text-gray-600">Ready to verify</div>
                  </div>
                  <div className="border border-gray-200 rounded p-4">
                    <div className="font-bold text-gray-800">Email Addresses Found</div>
                    <div className="text-sm text-gray-600">Ready to verify</div>
                  </div>
                  <div className="border border-gray-200 rounded p-4">
                    <div className="font-bold text-gray-800">Emails Written</div>
                    <div className="text-sm text-gray-600">Ready to verify</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Test Email */}
            <div className="bg-white rounded-lg shadow-lg border">
              <div className="bg-purple-600 text-white p-4 rounded-t-lg">
                <h2 className="text-xl font-bold">Test Email</h2>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Test Email Address</label>
                  <input
                    type="email"
                    value={testEmail.email}
                    onChange={(e) => setTestEmail(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="bg-gray-100 rounded p-4 mb-4">
                  <h4 className="text-sm font-bold text-gray-800 mb-3">Mock Company Data</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={testEmail.companyName}
                        onChange={(e) => setTestEmail(prev => ({ ...prev, companyName: e.target.value }))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Contact Name</label>
                      <input
                        type="text"
                        value={testEmail.contactName}
                        onChange={(e) => setTestEmail(prev => ({ ...prev, contactName: e.target.value }))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSendTest}
                  disabled={!testEmail.email.trim()}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded font-bold disabled:opacity-50"
                >
                  Send Test Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
