
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useMessages = (contractId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMessages = async () => {
    if (!contractId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('contract_id', contractId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [contractId]);

  const sendMessage = async (content, messageType = 'text') => {
    if (!user || !contractId) return { error: 'Missing requirements' };

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          contract_id: contractId,
          sender_id: user.id,
          sender_type: 'buyer', // This should be determined based on the contract
          content,
          message_type: messageType
        }])
        .select()
        .single();

      if (error) throw error;
      
      setMessages(prev => [...prev, data]);
      return { data, error: null };
    } catch (error) {
      console.error('Error sending message:', error);
      return { error };
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    fetchMessages
  };
};
