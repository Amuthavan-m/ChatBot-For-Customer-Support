import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { CustomerData } from '../types';

interface PaymentFormProps {
  onSubmit: (data: CustomerData) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<CustomerData>({
    fullName: '',
    email: '',
    phone: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: ''
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerData, string>>>({});
  const [step, setStep] = useState<'customerInfo' | 'payment'>('customerInfo');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when typing
    if (errors[name as keyof CustomerData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateCustomerInfo = () => {
    const newErrors: Partial<Record<keyof CustomerData, string>> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number should be 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePayment = () => {
    const newErrors: Partial<Record<keyof CustomerData, string>> = {};
    
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number should be 16 digits';
    }
    
    if (!formData.cardExpiry.trim()) {
      newErrors.cardExpiry = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
      newErrors.cardExpiry = 'Expiry format should be MM/YY';
    }
    
    if (!formData.cardCVC.trim()) {
      newErrors.cardCVC = 'CVC is required';
    } else if (!/^\d{3,4}$/.test(formData.cardCVC)) {
      newErrors.cardCVC = 'CVC should be 3 or 4 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleContinue = () => {
    if (validateCustomerInfo()) {
      setStep('payment');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 'customerInfo') {
      handleContinue();
      return;
    }
    
    if (validatePayment()) {
      onSubmit(formData);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Complete Your Booking</h3>
      
      <div className="flex mb-4">
        <div className="flex-1 flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'customerInfo' 
              ? 'bg-blue-600 text-white' 
              : 'bg-green-100 text-green-600'
          }`}>
            {step === 'customerInfo' ? '1' : <CheckCircle size={16} />}
          </div>
          <span className="text-sm mt-1">Your Info</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className={`h-1 w-full ${
            step === 'payment' ? 'bg-blue-600' : 'bg-gray-300'
          }`}></div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'payment' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
          <span className="text-sm mt-1">Payment</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 'customerInfo' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                className={`w-full p-2 border rounded-lg ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  className={`w-full p-2 border rounded-lg ${
                    errors.cardExpiry ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.cardExpiry && (
                  <p className="text-red-500 text-xs mt-1">{errors.cardExpiry}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  name="cardCVC"
                  value={formData.cardCVC}
                  onChange={handleChange}
                  placeholder="123"
                  className={`w-full p-2 border rounded-lg ${
                    errors.cardCVC ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.cardCVC && (
                  <p className="text-red-500 text-xs mt-1">{errors.cardCVC}</p>
                )}
              </div>
            </div>
          </>
        )}
        
        <div className="flex justify-between pt-2">
          {step === 'payment' && (
            <button
              type="button"
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setStep('customerInfo')}
            >
              Back
            </button>
          )}
          
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-auto`}
          >
            {step === 'customerInfo' ? 'Continue' : 'Complete Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;