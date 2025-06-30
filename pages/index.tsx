import { useState } from 'react';
import Head from 'next/head';
import { countries } from '../data/locations';
// Removed problematic import - using inline types instead
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

  return (
    <>
      <Head>
        <title>Email Campaign Builder</title>
        <meta name="description" content="Create and manage email campaigns" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Mail className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Email Campaign Builder</h1>
            <p className="text-lg text-gray-600">Create targeted email campaigns with A/B testing</p>
          </div>

          <div className="bg-white shadow-xl rounded-lg p-8 space-y-8">
            {/* Industry Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="inline h-4 w-4 mr-2" />
                Industry
              </label>
              <input
                type="text"
                value={campaign.industry}
                onChange={(e) => setCampaign(prev => ({ ...prev, industry: e.target.value }))}
                placeholder="e.g., SaaS, E-commerce, Healthcare, Finance"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Country Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => setCampaign(prev => ({ 
                      ...prev, 
                      country: country.code,
                      city: country.cities[0] || 'All'
                    }))}
                    className={`p-3 text-sm rounded-lg border transition-colors ${
                      campaign.country === country.code
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {country.name}
                  </button>
                ))}
              </div>
            </div>

            {/* City Selection */}
            {selectedCountry && !isWorldSelected && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {selectedCountry.cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => setCampaign(prev => ({ ...prev, city }))}
                      className={`p-3 text-sm rounded-lg border transition-colors ${
                        campaign.city === city
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Email Templates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Templates</label>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable A/B Testing</span>
                  </label>
                  
                  {campaign.abTestingEnabled && (
                    <button
                      onClick={addTemplate}
                      className="flex items-center text-primary-600 hover:text-primary-800"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <span className="flex items-center text-gray-500">to</span>
                  <input
                    type="time"
                    value={campaign.endTime}
                    onChange={(e) => setCampaign(prev => ({ ...prev, endTime: e.target.value }))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <select
                    value={campaign.durationType}
                    onChange={(e) => setCampaign(prev => ({ 
                      ...prev, 
                      durationType: e.target.value as 'days' | 'weeks' | 'months'
                    }))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
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
            <div className="flex space-x-4 pt-6">
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="flex-1 bg-primary-600 text-white py-4 px-6 rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
              >
                {isVerifying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Verify Campaign</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleSend}
                disabled={isSending || !validation.isValid}
                className="flex-1 bg-success-600 text-white py-4 px-6 rounded-lg hover:bg-success-700 focus:ring-2 focus:ring-success-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
              >
                {isSending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Starting Campaign...</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    <span>Start Campaign</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 
// Test comment
