import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CheckCircle, Download, Printer, Share2, Home } from 'lucide-react';

export default function PaymentReceipt({ 
  payment, 
  appointment, 
  onClose,
  language = 'en' 
}) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In production, generate actual PDF
    toast.success(language === 'en' ? 'Receipt downloaded' : 'Inyemezabwishyu yakiriye');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Muhazi Dental - Payment Receipt',
          text: `Payment of ${payment.amount?.toLocaleString()} RWF - ${payment.reference}`,
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {language === 'en' ? 'Payment Successful!' : 'Kwishyura Byagenze Neza!'}
        </h2>
        <p className="text-gray-600">
          {language === 'en' ? 'Your transaction has been completed' : 'Ibikorwa byawe byarangiye'}
        </p>
      </div>

      <Card className="print:shadow-none">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-6 pb-6 border-b">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <h3 className="font-bold text-xl text-gray-900">Muhazi Dental Clinic</h3>
            <p className="text-sm text-gray-500">Rwamagana, Rwanda</p>
            <p className="text-sm text-gray-500">+250 787 630 399</p>
          </div>

          {/* Receipt Details */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">{language === 'en' ? 'Receipt No.' : 'Nomero'}</span>
              <span className="font-mono font-semibold">{payment.reference}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">{language === 'en' ? 'Date' : 'Itariki'}</span>
              <span className="font-semibold">{format(new Date(), 'MMMM d, yyyy HH:mm')}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">{language === 'en' ? 'Patient' : 'Umurwayi'}</span>
              <span className="font-semibold">{appointment?.patient_name || payment.account_name}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">{language === 'en' ? 'Service' : 'Serivisi'}</span>
              <span className="font-semibold">{appointment?.service_name}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">{language === 'en' ? 'Payment Method' : 'Uburyo bwo Kwishyura'}</span>
              <span className="font-semibold capitalize">{payment.method?.replace('_', ' ')}</span>
            </div>
            {appointment && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">{language === 'en' ? 'Appointment' : 'Gahunda'}</span>
                <span className="font-semibold">{appointment.date} at {appointment.time}</span>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="border-t-2 border-dashed pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">
                {language === 'en' ? 'Amount Paid' : 'Amafaranga Yishyuwe'}
              </span>
              <span className="text-3xl font-bold text-green-600">
                {payment.amount?.toLocaleString()} RWF
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t text-center text-sm text-gray-500">
            <p>{language === 'en' ? 'Thank you for choosing Muhazi Dental Clinic' : 'Murakoze guhitamo Muhazi Dental Clinic'}</p>
            <p className="mt-2">{language === 'en' ? 'Keep this receipt for your records' : 'Bika iyi nyemezabwishyu ku mabwiriza yawe'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-6 print:hidden">
        <Button
          variant="outline"
          onClick={handlePrint}
          className="flex-1"
        >
          <Printer className="w-4 h-4 mr-2" />
          {language === 'en' ? 'Print' : 'Icapiro'}
        </Button>
        <Button
          variant="outline"
          onClick={handleDownload}
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-2" />
          {language === 'en' ? 'Download' : 'Kuramo'}
        </Button>
        {navigator.share && (
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex-1"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Share' : 'Sangiza'}
          </Button>
        )}
      </div>

      <Button
        onClick={onClose}
        className="w-full bg-teal-600 hover:bg-teal-700 h-12 mt-4"
      >
        <Home className="w-4 h-4 mr-2" />
        {language === 'en' ? 'Back to Home' : 'Subira Ahabanza'}
      </Button>
    </motion.div>
  );
}
