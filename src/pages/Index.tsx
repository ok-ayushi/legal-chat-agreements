
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, FileText, Upload, PenTool, Shield, Users } from 'lucide-react';
import MessageInterface from '@/components/MessageInterface';
import OrderCreation from '@/components/OrderCreation';
import DocumentUpload from '@/components/DocumentUpload';
import ContractPreview from '@/components/ContractPreview';
import ESignature from '@/components/ESignature';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<'buyer' | 'seller'>('buyer');
  const [currentView, setCurrentView] = useState<'messaging' | 'order' | 'contract' | 'signature'>('messaging');
  const [orderData, setOrderData] = useState<any>(null);
  const [contractApproved, setContractApproved] = useState(false);

  const handleCreateOrder = () => {
    setCurrentView('order');
  };

  const handleOrderCreated = (data: any) => {
    setOrderData(data);
    setCurrentView('contract');
  };

  const handleContractApproved = () => {
    setContractApproved(true);
    setCurrentView('signature');
  };

  const handleSignatureComplete = (signatureData: any) => {
    console.log('Signature completed:', signatureData);
    // Here you would typically save the signature data
  };

  const getProgressStep = () => {
    switch (currentView) {
      case 'messaging': return 1;
      case 'order': return 2;
      case 'contract': return 3;
      case 'signature': return 4;
      default: return 1;
    }
  };

  if (currentView === 'order') {
    return (
      <OrderCreation
        currentUser={currentUser}
        onBack={() => setCurrentView('messaging')}
        onCreateOrder={handleOrderCreated}
      />
    );
  }

  if (currentView === 'contract' && orderData) {
    return (
      <ContractPreview
        orderData={orderData}
        currentUser={currentUser}
        onApprove={handleContractApproved}
        onReject={() => setCurrentView('messaging')}
      />
    );
  }

  if (currentView === 'signature' && contractApproved) {
    return (
      <ESignature
        currentUser={currentUser}
        contractData={orderData}
        onSignatureComplete={handleSignatureComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">LegalDeal</h1>
              </div>
              <Badge variant="secondary">Property Transaction Platform</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Switch Role:</span>
                <Button
                  variant={currentUser === 'buyer' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentUser('buyer')}
                >
                  Buyer
                </Button>
                <Button
                  variant={currentUser === 'seller' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentUser('seller')}
                >
                  Seller
                </Button>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="pb-4">
            <div className="flex items-center justify-center space-x-4">
              {[
                { step: 1, label: 'Messaging', icon: MessageSquare },
                { step: 2, label: 'Create Order', icon: FileText },
                { step: 3, label: 'Review Contract', icon: Upload },
                { step: 4, label: 'E-Signature', icon: PenTool }
              ].map(({ step, label, icon: Icon }) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                    getProgressStep() >= step 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  {step < 4 && (
                    <div className={`w-8 h-px mx-2 ${
                      getProgressStep() > step ? 'bg-blue-300' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="messaging" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="messaging" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Messaging</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Documents</span>
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messaging" className="mt-6">
            <Card className="h-[600px]">
              <MessageInterface
                currentUser={currentUser}
                onCreateOrder={handleCreateOrder}
              />
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <DocumentUpload currentUser={currentUser} />
          </TabsContent>

          <TabsContent value="overview" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                    Communication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Secure messaging between buyer and seller with file sharing capabilities.
                  </p>
                  <Badge variant="secondary">Active</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    End-to-end encryption for all documents and communications.
                  </p>
                  <Badge variant="secondary">Protected</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PenTool className="h-5 w-5 mr-2 text-purple-600" />
                    Legal Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Legally binding contracts with digital signatures and audit trails.
                  </p>
                  <Badge variant="secondary">Compliant</Badge>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Platform Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">For Buyers</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Secure document upload and sharing</li>
                      <li>• Create purchase orders with legal terms</li>
                      <li>• Digital signature capabilities</li>
                      <li>• Real-time communication with sellers</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">For Sellers</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Property listing and documentation</li>
                      <li>• Create sales agreements with custom terms</li>
                      <li>• Secure client communication</li>
                      <li>• Legal compliance and audit trails</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
