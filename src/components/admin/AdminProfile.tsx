import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { User, Mail, Phone, Shield, Save } from 'lucide-react';
import translations from '../../utils/translations';

const AdminProfile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];
  
  const [formData, setFormData] = useState({
    name: user?.name || 'Trapo',
    email: user?.email || 'dagrind2nd@gmail.com',
    phone: user?.phone || '+12525921863',
    currentPassword: 'TrapoC304$$',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      // In a real app, this would update the user profile in the database
      if (isChangingPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage({ type: 'error', text: t.passwordsDoNotMatch });
          return;
        }
        
        // Simulate password validation and update
        if (formData.currentPassword === '') {
          setMessage({ type: 'error', text: t.currentPasswordRequired });
          return;
        }
        
        // Password update logic would go here
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        setMessage({ type: 'success', text: t.passwordUpdatedSuccessfully });
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        
        setIsChangingPassword(false);
      } else {
        // Profile update logic
        await updateUserProfile({
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        });
        
        setMessage({ type: 'success', text: t.profileUpdatedSuccessfully });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: t.errorUpdatingProfile });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {formData.name.charAt(0).toUpperCase()}
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-semibold">{t.adminProfile}</h2>
          <p className="text-gray-600 dark:text-gray-400">{t.manageYourProfile}</p>
        </div>
      </div>
      
      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="md:col-span-2">
          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{t.profileInformation}</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {t.edit}
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.fullName}
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                        required
                      />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <span>{formData.name}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.email}
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                        required
                      />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      <span>{formData.email}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.phoneNumber}
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-2" />
                      <span>{formData.phone || t.notProvided}</span>
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center ${
                        loading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                          {t.saving}
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          {t.saveChanges}
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md transition-colors duration-300"
                    >
                      {t.cancel}
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
          
          {/* Change Password */}
          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md p-4 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{t.changePassword}</h3>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {t.changePassword}
                </button>
              )}
            </div>
            
            {isChangingPassword ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.currentPassword}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.newPassword}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.confirmNewPassword}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center ${
                        loading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                          {t.updating}
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          {t.updatePassword}
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setIsChangingPassword(false)}
                      className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md transition-colors duration-300"
                    >
                      {t.cancel}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t.passwordLastChanged}: <span className="font-medium">2 months ago</span>
              </p>
            )}
          </div>
        </div>
        
        {/* Account Info */}
        <div className="md:col-span-1">
          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md p-4">
            <h3 className="font-semibold mb-4">{t.accountInformation}</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.accountCreated}</p>
                <p className="font-medium">January 15, 2023</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.accountType}</p>
                <p className="font-medium">{t.administrator}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.lastLogin}</p>
                <p className="font-medium">Today, 10:30 AM</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.twoFactorAuth}</p>
                <p className="font-medium text-yellow-600 dark:text-yellow-400">{t.notEnabled}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300">
                {t.enableTwoFactorAuth}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;