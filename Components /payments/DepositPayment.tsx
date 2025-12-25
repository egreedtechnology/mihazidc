import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { motion } from 'framer-motion';
import { DollarSign, Percent } from 'lucide-react';

export default function DepositPayment({ totalAmount, onAmountSelect, onCancel }) {
  const [depositType, setDepositType] = useState('full'); // full, half, custom
  const [customAmount, setCustomAmount] = useState('');
  const [percentage, setPercentage] = useState([50]);

  const calculateAmount = () => {
    if (depositType === 'full') return totalAmount;
    if (depositType === 'half') return totalAmount / 2;
    if (depositType === 'percentage') return (totalAmount * percentage[0]) / 100;
    return Number(customAmount) || 0;
  };

  const handleContinue = () => {
    const amount = calculateAmount();
    if (amount <= 0 || amount > totalAmount) {
      return;
    }
    onAmountSelect(amount);
  };

  const amount = calculateAmount();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Options</h3>
        <p className="text-gray-600">
          Total Amount: <span className="font-bold text-teal-600">{totalAmount?.toLocaleString()} RWF</span>
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setDepositType('full')}
          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
            depositType === 'full' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Pay Full Amount</p>
              <p className="text-sm text-gray-500">Complete payment now</p>
            </div>
            <span className="font-bold text-teal-600">{totalAmount?.toLocaleString()} RWF</span>
          </div>
        </button>

        <button
          onClick={() => setDepositType('half')}
          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
            depositType === 'half' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Pay 50% Deposit</p>
              <p className="text-sm text-gray-500">Pay the rest at clinic</p>
            </div>
            <span className="font-bold text-teal-600">{(totalAmount / 2)?.toLocaleString()} RWF</span>
          </div>
        </button>

        <button
          onClick={() => setDepositType('percentage')}
          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
            depositType === 'percentage' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-300'
          }`}
        >
          <div>
            <p className="font-semibold text-gray-900 mb-3">Pay Custom Percentage</p>
            {depositType === 'percentage' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3"
              >
                <div className="flex items-center gap-4">
                  <Slider
                    value={percentage}
                    onValueChange={setPercentage}
                    min={10}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <div className="w-20 text-right">
                    <span className="text-2xl font-bold text-teal-600">{percentage[0]}%</span>
                  </div>
                </div>
                <p className="text-lg font-semibold text-teal-600">
                  {((totalAmount * percentage[0]) / 100).toLocaleString()} RWF
                </p>
              </motion.div>
            )}
          </div>
        </button>

        <button
          onClick={() => setDepositType('custom')}
          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
            depositType === 'custom' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-300'
          }`}
        >
          <div>
            <p className="font-semibold text-gray-900 mb-3">Enter Custom Amount</p>
            {depositType === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="pl-10 h-12 text-lg"
                    max={totalAmount}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Maximum: {totalAmount?.toLocaleString()} RWF
                </p>
              </motion.div>
            )}
          </div>
        </button>
      </div>

      {/* Selected Amount Display */}
      {amount > 0 && (
        <Card className="bg-gradient-to-br from-teal-600 to-teal-700 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-teal-100">You will pay</p>
                <p className="text-3xl font-bold">{amount.toLocaleString()} RWF</p>
                {amount < totalAmount && (
                  <p className="text-teal-200 text-sm mt-1">
                    Remaining: {(totalAmount - amount).toLocaleString()} RWF
                  </p>
                )}
              </div>
              {amount === totalAmount && (
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Percent className="w-6 h-6" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={amount <= 0 || amount > totalAmount}
          className="flex-1 bg-teal-600 hover:bg-teal-700"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
