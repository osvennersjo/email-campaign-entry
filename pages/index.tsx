import { useState } from 'react';
import Head from 'next/head';
import { countries } from '../data/locations';
import { Check, Plus, X, Clock, Mail, Target, Settings } from 'lucide-react';

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
  duration: number;
  durationType: 'days' | 'weeks' | 'months';
}

interface CampaignValidation {
  isValid: boolean;
  errors: string[];
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
    duration: 1,
    durationType: 'weeks'
  });

  const [validation, setValidation] = useState<CampaignValidation>({ isValid: false, errors: [] });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
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

  const validateCampaign = (): CampaignValidation => {
    const errors: string[] = [];

    if (!campaign.industry.trim()) errors.push('Industry is required');
    if (campaign.templates.some(t => !t.content.trim())) errors.push('All email templates must have content');
    if (campaign.emailsPerDay < 1 || campaign.emailsPerDay > 50) errors.push('Emails per day must be between 1 and 50');
    if (campaign.minInterval < 1 || campaign.maxInterval < 1) errors.push('Time intervals must be at least 1 minute');
    if (campaign.minInterval >= campaign.maxInterval) errors.push('Maximum interval must be greater than minimum interval');

    return { isValid: errors.length === 0, errors };
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    const validationResult = validateCampaign();
    setValidation(validationResult);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsVerifying(false);
  };

  const handleSend = async () => {
    if (!validation.isValid) {
      await handleVerify();
      return;
    }
    
    setIsSending(true);
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsSending(false);
    alert('Campaign started successfully!');
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
        <title>Email Campaign Builder with Test Email</title>
        <meta name="description" content="Create and manage email campaigns" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-6 shadow-lg">
              <Mail className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              Email Campaign Builder
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create powerful, targeted email campaigns with A/B testing and smart personalization
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Campaign Settings */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 space-y-8 border border-white/20">
                {/* Industry Input */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    <Target className="inline h-5 w-5 mr-2 text-blue-600" />
                    Target Industry
                  </label>
                  <input
                    type="text"
                    value={campaign.industry}
                    onChange={(e) => setCampaign(prev => ({ ...prev, industry: e.target.value }))}
                    placeholder="e.g., SaaS, E-commerce, Healthcare, Finance"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg placeholder-gray-400"
                  />
                </div>

                {/* Country Selection */}
                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-100">
                  <label className="block text-lg font-semibold text-gray-800 mb-4">🌍 Target Location</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => setCampaign(prev => ({ 
                          ...prev, 
                          country: country.code,
                          city: country.cities[0] || 'All'
                        }))}
                        className={`p-4 text-sm rounded-xl border-2 transition-all duration-200 font-medium ${
                          campaign.country === country.code
                            ? 'bg-green-600 text-white border-green-600 shadow-lg transform scale-105'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-green-50 hover:border-green-300 hover:shadow-md'
                        }`}
                      >
                        {country.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* City Selection */}
                {selectedCountry && !isWorldSelected && (
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-100">
                    <label className="block text-lg font-semibold text-gray-800 mb-4">🏙️ City Focus</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {selectedCountry.cities.map((city) => (
                        <button
                          key={city}
                          onClick={() => setCampaign(prev => ({ ...prev, city }))}
                          className={`p-3 text-sm rounded-xl border-2 transition-all duration-200 font-medium ${
                            campaign.city === city
                              ? 'bg-teal-600 text-white border-teal-600 shadow-lg transform scale-105'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-teal-50 hover:border-teal-300 hover:shadow-md'
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Email Templates */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                  <label className="block text-lg font-semibold text-gray-800 mb-4">✉️ Email Templates & A/B Testing</label>
                  <div className="space-y-4">
                    {campaign.templates.map((template, index) => (
                      <div key={template.id} className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            Template {String.fromCharCode(65 + index)} {index === 0 ? '(Primary)' : ''}
                          </span>
                          {index > 0 && (
                            <button
                              onClick={() => removeTemplate(template.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <textarea
                          value={template.content}
                          onChange={(e) => updateTemplate(template.id, e.target.value)}
                          placeholder="Hi [company name], I noticed [company info] and thought..."
                          rows={6}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                    
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={campaign.abTestingEnabled}
                          onChange={(e) => setCampaign(prev => ({ 
                            ...prev, 
                            abTestingEnabled: e.target.checked 
                          }))}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Enable A/B Testing</span>
                      </label>
                      
                      {campaign.abTestingEnabled && (
                        <button
                          onClick={addTemplate}
                          className="flex items-center text-purple-600 hover:text-purple-800"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Template
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    Use brackets [ ] to mark custom fields: [company name], [company info], [industry]
                  </div>
                </div>

                {/* Campaign Settings */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100">
                  <label className="block text-lg font-semibold text-gray-800 mb-6">⚙️ Campaign Settings</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Settings className="inline h-4 w-4 mr-2" />
                        Emails per Day (Max 50)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={campaign.emailsPerDay}
                        onChange={(e) => setCampaign(prev => ({ 
                          ...prev, 
                          emailsPerDay: Math.min(50, Math.max(1, parseInt(e.target.value) || 1))
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="inline h-4 w-4 mr-2" />
                        Time Interval (minutes)
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          min="1"
                          value={campaign.minInterval}
                          onChange={(e) => setCampaign(prev => ({ 
                            ...prev, 
                            minInterval: Math.max(1, parseInt(e.target.value) || 1)
                          }))}
                          placeholder="Min"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <span className="flex items-center text-gray-500">to</span>
                        <input
                          type="number"
                          min="1"
                          value={campaign.maxInterval}
                          onChange={(e) => setCampaign(prev => ({ 
                            ...prev, 
                            maxInterval: Math.max(campaign.minInterval + 1, parseInt(e.target.value) || 2)
                          }))}
                          placeholder="Max"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sending Hours</label>
                      <div className="flex space-x-2">
                        <input
                          type="time"
                          value={campaign.startTime}
                          onChange={(e) => setCampaign(prev => ({ ...prev, startTime: e.target.value }))}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <span className="flex items-center text-gray-500">to</span>
                        <input
                          type="time"
                          value={campaign.endTime}
                          onChange={(e) => setCampaign(prev => ({ ...prev, endTime: e.target.value }))}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Duration</label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          min="1"
                          value={campaign.duration}
                          onChange={(e) => setCampaign(prev => ({ 
                            ...prev, 
                            duration: Math.max(1, parseInt(e.target.value) || 1)
                          }))}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <select
                          value={campaign.durationType}
                          onChange={(e) => setCampaign(prev => ({ 
                            ...prev, 
                            durationType: e.target.value as 'days' | 'weeks' | 'months'
                          }))}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                          <option value="months">Months</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Validation Errors */}
                {validation.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
                    <ul className="text-sm text-red-600 space-y-1">
                      {validation.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-8">
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-semibold text-lg"
                  >
                    {isVerifying ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5" />
                        <span>Verify Campaign</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleSend}
                    disabled={isSending || !validation.isValid}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-semibold text-lg"
                  >
                    {isSending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Starting Campaign...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="h-5 w-5" />
                        <span>Start Campaign</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Test Email Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/20 sticky top-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-purple-600" />
                  Send Test Email
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Test Email Address</label>
                    <input
                      type="email"
                      value={testEmail.email}
                      onChange={(e) => setTestEmail(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-800 mb-3">Mock Company Data</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Company Name</label>
                        <input
                          type="text"
                          value={testEmail.companyName}
                          onChange={(e) => setTestEmail(prev => ({ ...prev, companyName: e.target.value }))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Company Info</label>
                        <textarea
                          value={testEmail.companyInfo}
                          onChange={(e) => setTestEmail(prev => ({ ...prev, companyInfo: e.target.value }))}
                          rows={2}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Contact Name</label>
                        <input
                          type="text"
                          value={testEmail.contactName}
                          onChange={(e) => setTestEmail(prev => ({ ...prev, contactName: e.target.value }))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Website</label>
                        <input
                          type="text"
                          value={testEmail.website}
                          onChange={(e) => setTestEmail(prev => ({ ...prev, website: e.target.value }))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSendTest}
                    disabled={isSendingTest || !testEmail.email.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-200"
                  >
                    {isSendingTest ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        <span>Send Test Email</span>
                      </>
                    )}
                  </button>
                  
                  <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
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
