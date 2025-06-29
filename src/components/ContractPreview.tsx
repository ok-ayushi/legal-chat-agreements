
import React, { useState } from 'react';
import { FileText, Check, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ContractPreviewProps {
  orderData: any;
  currentUser: 'buyer' | 'seller';
  onApprove: () => void;
  onReject: () => void;
}

const ContractPreview = ({ orderData, currentUser, onApprove, onReject }: ContractPreviewProps) => {
  const [isApproved, setIsApproved] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<{
    buyer: boolean;
    seller: boolean;
  }>({
    buyer: false,
    seller: false
  });

  const handleApproval = () => {
    setApprovalStatus(prev => ({
      ...prev,
      [currentUser]: true
    }));
    setIsApproved(true);
    onApprove();
  };

  const contractSections = [
    {
      title: 'Transaction Details',
      content: [
        { label: 'Order Title', value: orderData.title },
        { label: 'Property Type', value: orderData.propertyType },
        { label: 'Transaction Amount', value: `$${orderData.amount}` },
        { label: 'Timeline', value: orderData.timeline }
      ]
    },
    {
      title: 'Description & Deliverables',
      content: [
        { label: 'Description', value: orderData.description },
        { label: 'Deliverables', value: orderData.deliverables }
      ]
    },
    {
      title: 'Financial Terms',
      content: [
        { label: 'Payment Terms', value: orderData.paymentTerms },
        { label: 'Cancellation Policy', value: orderData.cancellationPolicy }
      ]
    },
    {
      title: 'Legal Terms',
      content: [
        { label: 'Legal Terms & Conditions', value: orderData.legalTerms },
        { label: 'Dispute Resolution', value: orderData.disputeResolution }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <FileText className="h-6 w-6 mr-2" />
            Contract Preview
          </h2>
          <p className="text-gray-600">
            Review all terms before approval. Both parties must approve to proceed.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Approval Status</p>
            <div className="flex items-center space-x-2">
              <Badge variant={approvalStatus.buyer ? "default" : "secondary"}>
                Buyer {approvalStatus.buyer ? '✓' : '○'}
              </Badge>
              <Badge variant={approvalStatus.seller ? "default" : "secondary"}>
                Seller {approvalStatus.seller ? '✓' : '○'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-2">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-center">Legal Agreement Contract</CardTitle>
          <p className="text-center text-sm text-gray-600">
            This contract is legally binding upon approval by both parties
          </p>
        </CardHeader>
        <CardContent className="p-6">
          {contractSections.map((section, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-900">
                {section.title}
              </h3>
              <div className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <div key={itemIndex} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="font-medium text-gray-700">{item.label}:</div>
                    <div className="md:col-span-2 text-gray-900">
                      {item.value || 'Not specified'}
                    </div>
                  </div>
                ))}
              </div>
              {index < contractSections.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800">Important Legal Notice</h4>
                <p className="text-yellow-700 text-sm mt-1">
                  By approving this contract, you agree to be legally bound by all terms and conditions 
                  outlined above. This agreement will be enforceable under applicable law. Please review 
                  carefully and consult legal counsel if needed.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isApproved ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">
                Your Approval as {currentUser.charAt(0).toUpperCase() + currentUser.slice(1)}
              </h3>
              <p className="text-gray-600">
                Please review all terms carefully before making your decision
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={onReject}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject Contract
                </Button>
                <Button 
                  onClick={handleApproval}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve Contract
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <Check className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800">
              Contract Approved Successfully!
            </h3>
            <p className="text-green-700">
              Your approval has been recorded. Waiting for the other party to approve.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContractPreview;
