import { useState } from 'react';
import Head from 'next/head';
import { countries } from '../data/locations';
import { Check, Plus, X, Clock, Mail, Target, Settings, CheckCircle, XCircle, Loader } from 'lucide-react';

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
  duration: number;
  durationType: 'days' | 'weeks' | 'months';
}

interface TestResult {
  name: string;
  status: 'pending' | 'loading' | 'success' | 'failed';
  progress: number;
  message: string;
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
    endDate: '',
    duration: 1,
    durationType: 'weeks'
  });

  const [testResults, setTestResults] = useState<TestResult[]>([
    { name: 'Companies Found', status: 'pending', progress: 0, message: 'Ready to verify' },
    { name: 'Companies Within Location', status: 'pending', progress: 0, message: 'Ready to verify' },
    { name: 'Email Addresses Found', status: 'pending', progress: 0, message: 'Ready to verify' },
    { name: 'Emails Written', status: 'pending', progress: 0, message: 'Ready to verify' }
  ]);

  const [isVerifying, setIsVerifying] = useState(false);
  const [testEmail, setTestEmail] = useState<TestEmailData>({
    email: '',
    companyName: 'Example Corp',
    companyInfo: 'A leading software company specializing in innovative solutions',
    contactName: 'John Smith',
    website: 'https://example-corp.com'
  });
  const [isSendingTest, setIsSendingTest] = useState(false);

  const selectedCountry = countries.find(c => c.code === campaign.country);
  const isWorldSelected = campaign.country === 'world';

  const updateTemplate = (id: string, content: string) => {
    setCampaign(prev => ({
      ...prev,
      templates: prev.templates.map(t => t.id === id ? { ...t, content } : t)
    }));
  };

  const addTemplate = () => {
    const newId = Date.now().toString();
    setCampaign(prev => ({
      ...prev,
      templates: [...prev.templates, { id: newId, content: '' }]
    }));
  };

  const removeTemplate = (id: string) => {
    setCampaign(prev => ({
      ...prev,
      templates: prev.templates.filter(t => t.id !== id)
    }));
  };

  const runTest = async (testIndex: number) => {
    const tests = [...testResults];
    tests[testIndex].status = 'loading';
    tests[testIndex].progress = 0;
    setTestResults([...tests]);

    // Simulate test progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      tests[testIndex].progress = progress;
      setTestResults([...tests]);
    }

    // Simulate test completion (random success/failure for demo)
    const success = Math.random() > 0.3; // 70% success rate
    tests[testIndex].status = success ? 'success' : 'failed';
    tests[testIndex].message = success ? 
      testIndex === 0 ? '1,247 companies found' :
      testIndex === 1 ? '823 companies in target location' :
      testIndex === 2 ? '1,891 email addresses found' :
      '4 email templates ready'
      :
      'Verification failed - please check your settings';
    
    setTestResults([...tests]);
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    
    // Reset all tests
    const resetTests = testResults.map(test => ({
      ...test,
      status: 'pending' as const,
      progress: 0,
      message: 'Ready to verify'
    }));
    setTestResults(resetTests);

    // Run tests sequentially
    for (let i = 0; i < testResults.length; i++) {
      await runTest(i);
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause between tests
    }

    setIsVerifying(false);
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

    setIsSendingTest(true);
    
    // Simulate sending test email
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSendingTest(false);
    
    const templateContent = campaign.templates[0].content
      .replace(/\[company name\]/gi, testEmail.companyName)
      .replace(/\[company info\]/gi, testEmail.companyInfo)
      .replace(/\[contact name\]/gi, testEmail.contactName)
      .replace(/\[website\]/gi, testEmail.website)
      .replace(/\[industry\]/gi, campaign.industry)
      .replace(/\[location\]/gi, `${campaign.city}, ${selectedCountry?.name || campaign.country}`);

    alert(`Test email sent to ${testEmail.email}!

Preview:
${templateContent.substring(0, 200)}...`);
  };

  return (
    <>
      <Head>
        <title>Professional Email Campaign Dashboard</title>
        <meta name="description" content="Professional email campaign management dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Email Campaign Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional email campaign management with advanced targeting and verification
            </p>
          </div>

          {/* Three Card Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Card 1: Industry & Campaign Setup */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Campaign Setup
                  </h2>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Target Industry</label>
                    <input
                      type="text"
                      value={campaign.industry}
                      onChange={(e) => setCampaign(prev => ({ ...prev, industry: e.target.value }))}
                      placeholder="e.g., SaaS, E-commerce, Healthcare"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Target Location</label>
                    <select
                      value={campaign.country}
                      onChange={(e) => setCampaign(prev => ({ 
                        ...prev, 
                        country: e.target.value,
                        city: countries.find(c => c.code === e.target.value)?.cities[0] || 'All'
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-3"
                      >
                        {selectedCountry.cities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Email Template */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Template</label>
                    <textarea
                      value={campaign.templates[0]?.content || ''}
                      onChange={(e) => updateTemplate('1', e.target.value)}
                      placeholder="Hi [company name], I noticed [company info]..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* A/B Testing */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={campaign.abTestingEnabled}
                      onChange={(e) => setCampaign(prev => ({ ...prev, abTestingEnabled: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700">Enable A/B Testing</label>
                  </div>

                  {/* Emails per Day */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Emails per Day</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={campaign.emailsPerDay}
                      onChange={(e) => setCampaign(prev => ({ 
                        ...prev, 
                        emailsPerDay: Math.min(50, Math.max(1, parseInt(e.target.value) || 1))
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Time Interval */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Time Interval (minutes)</label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        min="1"
                        value={campaign.minInterval}
                        onChange={(e) => setCampaign(prev => ({ 
                          ...prev, 
                          minInterval: Math.max(1, parseInt(e.target.value) || 1)
                        }))}
                        placeholder="Min"
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="number"
                        min="1"
                        value={campaign.maxInterval}
                        onChange={(e) => setCampaign(prev => ({ 
                          ...prev, 
                          maxInterval: Math.max(campaign.minInterval + 1, parseInt(e.target.value) || 2)
                        }))}
                        placeholder="Max"
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Sending Hours */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sending Hours</label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="time"
                        value={campaign.startTime}
                        onChange={(e) => setCampaign(prev => ({ ...prev, startTime: e.target.value }))}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="time"
                        value={campaign.endTime}
                        onChange={(e) => setCampaign(prev => ({ ...prev, endTime: e.target.value }))}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Campaign Dates */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Campaign Dates</label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={campaign.startDate}
                        onChange={(e) => setCampaign(prev => ({ ...prev, startDate: e.target.value }))}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="date"
                        value={campaign.endDate}
                        onChange={(e) => setCampaign(prev => ({ ...prev, endDate: e.target.value }))}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Verification */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    Campaign Verification
                  </h2>
                </div>
                
                <div className="p-6">
                  {/* Verify Button */}
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-lg mb-6"
                  >
                    {isVerifying ? (
                      <>
                        <Loader className="animate-spin h-5 w-5" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5" />
                        <span>Verify</span>
                      </>
                    )}
                  </button>

                  {/* Test Results */}
                  <div className="space-y-4">
                    {testResults.map((test, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-800">{test.name}</span>
                          <div className="flex items-center">
                            {test.status === 'loading' && (
                              <Loader className="animate-spin h-4 w-4 text-blue-500" />
                            )}
                            {test.status === 'success' && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            {test.status === 'failed' && (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </div>
                        
                        {test.status === 'loading' && (
                          <div className="mb-2">
                            <div className="bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${test.progress}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{test.progress}%</div>
                          </div>
                        )}
                        
                        <div className={`text-sm ${
                          test.status === 'success' ? 'text-green-600' :
                          test.status === 'failed' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {test.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Test Email */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Test Email
                  </h2>
                </div>
                
                <div className="p-6">
                  {/* Test Email Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Test Email Address</label>
                    <input
                      type="email"
                      value={testEmail.email}
                      onChange={(e) => setTestEmail(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  {/* Mock Company Data */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Mock Company Data</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Company Name</label>
                        <input
                          type="text"
                          value={testEmail.companyName}
                          onChange={(e) => setTestEmail(prev => ({ ...prev, companyName: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Company Info</label>
                        <textarea
                          value={testEmail.companyInfo}
                          onChange={(e) => setTestEmail(prev => ({ ...prev, companyInfo: e.target.value }))}
                          rows={2}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Contact Name</label>
                        <input
                          type="text"
                          value={testEmail.contactName}
                          onChange={(e) => setTestEmail(prev => ({ ...prev, contactName: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Website</label>
                        <input
                          type="text"
                          value={testEmail.website}
                          onChange={(e) => setTestEmail(prev => ({ ...prev, website: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Send Test Email Button */}
                  <button
                    onClick={handleSendTest}
                    disabled={isSendingTest || !testEmail.email.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-lg"
                  >
                    {isSendingTest ? (
                      <>
                        <Loader className="animate-spin h-5 w-5" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="h-5 w-5" />
                        <span>Send Test Email</span>
                      </>
                    )}
                  </button>

                  {/* Preview Info */}
                  <div className="mt-4 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                    <strong>Preview variables:</strong><br/>
                    [company name] → {testEmail.companyName}<br/>
                    [contact name] → {testEmail.contactName}<br/>
                    [industry] → {campaign.industry || 'Your Industry'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
