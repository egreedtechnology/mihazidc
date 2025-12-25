import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2, CreditCard, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

const PAYMENT_METHODS = [
  {
    id: 'mtn_momo',
    name: 'MTN Mobile Money',
    icon: '📱',
    color: 'from-yellow-400 to-yellow-600',
    prefix: ['078', '079'],
    format: '+250 7XX XXX XXX'
  },
  {
    id: 'airtel_money',
    name: 'Airtel Money',
    icon: '📱',
    color: 'from-red-400 to-red-600',
    prefix: ['073'],
    format: '+250 7XX XXX XXX'
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: '💳',
    color: 'from-blue-400 to-blue-600',
    format: 'XXXX XXXX XXXX XXXX'
  }
];

export default function PaymentMethodSelector({ amount, onPaymentSuccess, onCancel }) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [validationStatus, setValidationStatus] = useState(null);
  const [accountName, setAccountName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('method'); // method, validate, process, success

  // Simulate phone number validation with backend
  const validatePhoneNumber = async (phone) => {
    setValidationStatus('checking');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Clean phone number
    const cleaned = phone.replace(/\s/g, '');
    
    // Validate format
    if (!/^(\+250|0)?7[3|8|9]\d{7}$/.test(cleaned)) {
      setValidationStatus('invalid');
      return false;
    }

    // Check if MTN or Airtel
    const prefix = cleaned.slice(-9, -7);
    const method = selectedMethod;
    
    if (method === 'mtn_momo' && !['78', '79'].includes(prefix)) {
      setValidationStatus('invalid');
      toast.error('This number is not an MTN Mobile Money number');
      return false;
    }
    
    if (method === 'airtel_money' && prefix !== '73') {
      setValidationStatus('invalid');
      toast.error('This number is not an Airtel Money number');
      return false;
    }

    // Simulate fetching account name (in production, this would be a real API call)
    const mockNames = [
      'NSHIMIYIMANA Jean Baptiste',
      'UWIMANA Marie Claire',
      'MUKAMANA Diane',
      'HABIMANA Emmanuel',
      'NDAYISABA Innocent'
    ];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    
    setAccountName(randomName);
    setValidationStatus('valid');
    return true;
  };

  // Simulate card validation
  const validateCard = async () => {
    setValidationStatus('checking');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Basic card validation
    const cardCleaned = cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cardCleaned)) {
      setValidationStatus('invalid');
      toast.error('Invalid card number');
      return false;
    }

    // Validate expiry
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      setValidationStatus('invalid');
      toast.error('Invalid expiry date (MM/YY)');
      return false;
    }

    // Validate CVV
    if (!/^\d{3}$/.test(cardCVV)) {
      setValidationStatus('invalid');
      toast.error('Invalid CVV');
      return false;
    }

    // Simulate fetching cardholder name
    const mockNames = ['JEAN B. NSHIMIYIMANA', 'MARIE C. UWIMANA', 'DIANE MUKAMANA'];
    setAccountName(mockNames[Math.floor(Math.random() * mockNames.length)]);
    setValidationStatus('valid');
    return true;
  };

  const handleValidate = async () => {
    if (selectedMethod === 'card') {
      const isValid = await validateCard();
      if (isValid) setPaymentStep('validate');
    } else {
      const isValid = await validatePhoneNumber(phoneNumber);
      if (isValid) setPaymentStep('validate');
    }
  };

  const processPayment = async () => {
    setIsProcessing(true);
    setPaymentStep('process');

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate success (in production, handle actual payment gateway response)
    const success = Math.random() > 0.1; // 90% success rate

    if (success) {
      setPaymentStep('success');
      setTimeout(() => {
        onPaymentSuccess({
          method: selectedMethod,
          phone: phoneNumber,
          card: cardNumber,
          amount,
          reference: `TXN-${Date.now()}`,
          account_name: accountName
        });
      }, 2000);
    } else {
      setIsProcessing(false);
      setPaymentStep('validate');
      toast.error('Payment failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {paymentStep === 'method' && (
          <motion.div
            key="method"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Payment Method</h3>
              <p className="text-lg text-teal-600 font-semibold">
                Amount to pay: {amount?.toLocaleString()} RWF
              </p>
            </div>

            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedMethod === method.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl`}>
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{method.name}</p>
                      <p className="text-sm text-gray-500">{method.format}</p>
                    </div>
                    {selectedMethod === method.id && (
                      <CheckCircle className="w-6 h-6 text-teal-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {selectedMethod && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 space-y-4"
              >
                {selectedMethod !== 'card' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          setValidationStatus(null);
                          setAccountName('');
                        }}
                        placeholder="+250 7XX XXX XXX"
                        className="pl-11 h-12 text-lg"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\s/g, '');
                            const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                            setCardNumber(formatted);
                            setValidationStatus(null);
                            setAccountName('');
                          }}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="pl-11 h-12 text-lg"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry (MM/YY)
                        </label>
                        <Input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2, 4);
                            }
                            setCardExpiry(value);
                          }}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="h-12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <Input
                          type="text"
                          value={cardCVV}
                          onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, ''))}
                          placeholder="123"
                          maxLength={3}
                          className="h-12"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {validationStatus === 'checking' && (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="text-blue-700">Validating...</span>
                  </div>
                )}

                {validationStatus === 'invalid' && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-700">Invalid {selectedMethod === 'card' ? 'card details' : 'phone number'}</span>
                  </div>
                )}

                {validationStatus === 'valid' && accountName && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-green-700 font-medium">{accountName}</p>
                      <p className="text-green-600 text-sm">Account verified</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleValidate}
                    disabled={
                      validationStatus === 'checking' ||
                      (selectedMethod !== 'card' && !phoneNumber) ||
                      (selectedMethod === 'card' && (!cardNumber || !cardExpiry || !cardCVV))
                    }
                    className="flex-1 bg-teal-600 hover:bg-teal-700"
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {paymentStep === 'validate' && (
          <motion.div
            key="validate"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Payment</h3>
            </div>

            <Card className="bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-semibold">
                    {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Account Name</span>
                  <span className="font-semibold">{accountName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {selectedMethod === 'card' ? 'Card' : 'Phone Number'}
                  </span>
                  <span className="font-semibold">
                    {selectedMethod === 'card' ? cardNumber : phoneNumber}
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="text-lg text-gray-900 font-medium">Total Amount</span>
                  <span className="text-2xl font-bold text-teal-600">
                    {amount?.toLocaleString()} RWF
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setPaymentStep('method');
                  setValidationStatus(null);
                }}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={processPayment}
                disabled={isProcessing}
                className="flex-1 bg-teal-600 hover:bg-teal-700"
              >
                Confirm & Pay
              </Button>
            </div>
          </motion.div>
        )}

        {paymentStep === 'process' && (
          <motion.div
            key="process"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment...</h3>
            <p className="text-gray-600">
              {selectedMethod !== 'card' 
                ? 'Please approve the payment request on your phone'
                : 'Processing your card payment securely'}
            </p>
          </motion.div>
        )}

        {paymentStep === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">Your payment has been processed</p>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
