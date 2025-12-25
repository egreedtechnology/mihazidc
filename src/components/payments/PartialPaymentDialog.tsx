import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from 'framer-motion';
import DepositPayment from './DepositPayment';
import PaymentMethodSelector from './PaymentMethodSelector';
import PaymentReceipt from './PaymentReceipt';

export default function PartialPaymentDialog({ 
  isOpen, 
  onClose, 
  totalAmount,
  appointmentData,
  language = 'en',
  onPaymentComplete 
}) {
  const [step, setStep] = useState('deposit'); // deposit, method, receipt
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [paymentData, setPaymentData] = useState(null);

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setStep('method');
  };

  const handlePaymentSuccess = (payment) => {
    setPaymentData({
      ...payment,
      amount: selectedAmount
    });
    setStep('receipt');
  };

  const handleClose = () => {
    if (step === 'receipt' && paymentData) {
      onPaymentComplete(paymentData);
    }
    onClose();
    setStep('deposit');
    setSelectedAmount(0);
    setPaymentData(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 'deposit' && (
            <motion.div
              key="deposit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DialogHeader>
                <DialogTitle>
                  {language === 'en' ? 'Choose Payment Amount' : 'Hitamo Amafaranga yo Kwishyura'}
                </DialogTitle>
              </DialogHeader>
              <DepositPayment
                totalAmount={totalAmount}
                onAmountSelect={handleAmountSelect}
                onCancel={handleClose}
              />
            </motion.div>
          )}

          {step === 'method' && (
            <motion.div
              key="method"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DialogHeader>
                <DialogTitle>
                  {language === 'en' ? 'Complete Payment' : 'Rangiza Kwishyura'}
                </DialogTitle>
              </DialogHeader>
              <PaymentMethodSelector
                amount={selectedAmount}
                onPaymentSuccess={handlePaymentSuccess}
                onCancel={() => setStep('deposit')}
              />
            </motion.div>
          )}

          {step === 'receipt' && paymentData && (
            <motion.div
              key="receipt"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <PaymentReceipt
                payment={paymentData}
                appointment={appointmentData}
                onClose={handleClose}
                language={language}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
