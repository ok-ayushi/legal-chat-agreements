import React, { useState } from 'react';
import { ArrowLeft, FileText, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useContracts } from '@/hooks/useContracts';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const OrderCreation = ({ currentUser, onBack, onCreateOrder }) => {
  const [orderData, setOrderData] = useState({
    title: '',
    description: '',
    property_type: '',
    amount: '',
    timeline: '',
    legal_terms: '',
    payment_terms: '',
    deliverables: '',
    cancellation_policy: '',
    dispute_resolution: ''
  });
  const [loading, setLoading] = useState(false);
  const { createContract } = useContracts();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!orderData.title || !orderData.amount || !orderData.description) return;
    
    setLoading(true);
    try {
      const { data, error } = await createContract(orderData);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Contract created successfully!',
      });
      
      onCreateOrder(data);
    } catch (error) {
      console.error('Error creating contract:', error);
      toast({
        title: 'Error',
        description: 'Failed to create contract. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Chat
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Create Legal Order</h2>
          <p className="text-gray-600">
            {currentUser === 'seller' ? 'Create an offer for the buyer' : 'Create a purchase request'}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Order Title *</Label>
              <Input
                id="title"
                value={orderData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Residential Property Sale Agreement"
              />
            </div>

            <div>
              <Label htmlFor="propertyType">Property Type</Label>
              <Select onValueChange={(value) => handleInputChange('property_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="land">Land/Plot</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={orderData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed description of the property and transaction requirements..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="deliverables">Deliverables</Label>
              <Textarea
                id="deliverables"
                value={orderData.deliverables}
                onChange={(e) => handleInputChange('deliverables', e.target.value)}
                placeholder="Property documents, surveys, certificates, etc."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Financial & Legal Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount">Transaction Amount *</Label>
              <Input
                id="amount"
                type="number"
                value={orderData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="Enter amount in USD"
              />
            </div>

            <div>
              <Label htmlFor="timeline">Timeline</Label>
              <Input
                id="timeline"
                value={orderData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                placeholder="e.g., 30 days from agreement"
              />
            </div>

            <div>
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Textarea
                id="paymentTerms"
                value={orderData.payment_terms}
                onChange={(e) => handleInputChange('payment_terms', e.target.value)}
                placeholder="Payment schedule, methods, escrow details..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="legalTerms">Legal Terms & Conditions</Label>
              <Textarea
                id="legalTerms"
                value={orderData.legal_terms}
                onChange={(e) => handleInputChange('legal_terms', e.target.value)}
                placeholder="Specific legal clauses, warranties, representations..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
              <Textarea
                id="cancellationPolicy"
                value={orderData.cancellation_policy}
                onChange={(e) => handleInputChange('cancellation_policy', e.target.value)}
                placeholder="Terms for order cancellation and refunds..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="disputeResolution">Dispute Resolution</Label>
              <Select onValueChange={(value) => handleInputChange('dispute_resolution', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select dispute resolution method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arbitration">Binding Arbitration</SelectItem>
                  <SelectItem value="mediation">Mediation</SelectItem>
                  <SelectItem value="court">Court Litigation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700"
          disabled={!orderData.title || !orderData.amount || !orderData.description || loading}
        >
          {loading ? 'Creating...' : 'Create Order'}
        </Button>
      </div>
    </div>
  );
};

export default OrderCreation;
