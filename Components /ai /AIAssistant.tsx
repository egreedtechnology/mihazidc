import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from '@/api/base44Client';
import { Sparkles, Copy, RefreshCw, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AIAssistant({ patient, records = [] }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  const generateSummary = async () => {
    setLoading(true);
    try {
      const recordsText = records.map(r => 
        `${r.record_type}: ${r.title} - ${r.description || ''} (${r.visit_date})`
      ).join('\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Summarize the following patient medical history in a professional, concise manner:\n\nPatient: ${patient.full_name}\nRecords:\n${recordsText}\n\nProvide a brief summary highlighting key medical conditions, treatments, and any concerns.`,
      });

      setResult(response);
      toast.success('Summary generated');
    } catch (error) {
      toast.error('Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  const suggestTreatment = async (symptoms) => {
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `As a dental AI assistant, suggest possible dental services or treatments for a patient with the following symptoms: ${symptoms}\n\nConsider the patient's history: ${records.map(r => r.title).join(', ')}\n\nProvide 3-5 relevant service suggestions with brief explanations. Remember this is for informational purposes and requires professional confirmation.`,
      });

      setResult(response);
      toast.success('Treatment suggestions generated');
    } catch (error) {
      toast.error('Failed to generate suggestions');
    } finally {
      setLoading(false);
    }
  };

  const draftResponse = async (inquiry) => {
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Draft a professional response to this patient inquiry: "${inquiry}"\n\nContext: Muhazi Dental Clinic, located in Rwamagana, Rwanda. Open 8 AM - 8 PM daily. Phone: +250 787 630 399. We offer comprehensive dental services.\n\nProvide a friendly, professional response that can be edited before sending.`,
      });

      setResult(response);
      toast.success('Response drafted');
    } catch (error) {
      toast.error('Failed to draft response');
    } finally {
      setLoading(false);
    }
  };

  const customQuery = async () => {
    if (!customPrompt.trim()) return;
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
 
